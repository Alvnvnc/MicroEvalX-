import { Request } from 'express';
import { BaseService } from '../common/base.service';
import {
  WarehouseCreateVM,
  WarehouseResultVM,
  WarehouseUpdateVM,
} from '../../helpers/view-models/warehouse.vm';
import {
  getWarehouseDropdownAttributes,
  WarehouseCreateDTO,
  WarehouseDropdownDTO,
  WarehouseResultDTO,
} from '../../helpers/dto/warehouse.dto';
import { WarehouseRepository } from '../../data-access/repositories/warehouse.repository';
import { WarehouseAttributes } from '../../infrastructure/models/warehouse.model';
import { CreationAttributes, Model, WhereOptions } from 'sequelize';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { generateCSVWarehouse } from '../../helpers/utility/csv/generateCsvWarehouse';
import { CodeGenerator } from '../../helpers/utility/generateCode';

export class WarehouseService extends BaseService<Model<WarehouseAttributes>> {
  constructor() {
    super(new WarehouseRepository());
  }

  //region Helper function
  private convertToResultDTO(
    model: Model<WarehouseAttributes>,
  ): WarehouseResultDTO {
    return model.toJSON();
  }

  private convertToDropdownDTO(
    model: Model<WarehouseAttributes>,
  ): WarehouseDropdownDTO {
    return getWarehouseDropdownAttributes(model.toJSON());
  }
  //endregion

  //region Find methods
  async findAllWarehouses(req: Request): Promise<Model<WarehouseAttributes>[]> {
    return await super.findAll(req);
  }

  async findWarehouseByID(
    req: Request,
    pkid: number,
  ): Promise<Model<WarehouseAttributes> | null> {
    return await super.findByPKID(req, pkid);
  }

  async findWarehousesByCriteria(
    req: Request,
    { code, name }: { code?: string; name?: string },
  ): Promise<Model<WarehouseAttributes>[]> {
    const criteria: WhereOptions<WarehouseAttributes> = {};
    if (code) criteria.code = code;
    if (name) criteria.name = name;

    return this.where(req, criteria);
  }

  async findAllWarehousesForDropdown(
    req: Request,
  ): Promise<WarehouseDropdownDTO[]> {
    const warehouses = await super.findAll(req);
    return await Promise.all(
      warehouses.map(this.convertToDropdownDTO.bind(this)),
    );
  }
  //endregion

  //region Create methods
  async createWarehouse(
    req: Request,
    vm: WarehouseCreateVM,
  ): Promise<WarehouseResultVM> {
    // Generate code by system
    const generatedCode = await CodeGenerator.generateWarehouseCode();

    const warehouseExists = await this.whereExisting(req, {
      code: generatedCode,
    });
    if (warehouseExists) {
      const message = getMessage(req, MessagesKey.DUPLICATEWAREHOUSECODE);
      const formattedMessage = formatMessage(message, [generatedCode]);
      throw new Error(formattedMessage);
    }

    const dto: WarehouseCreateDTO = {
      code: generatedCode,
      name: vm.warehouseData.name,
      address: vm.warehouseData.address,
      city: vm.warehouseData.city,
      state: vm.warehouseData.state,
      country: vm.warehouseData.country,
      postal_code: vm.warehouseData.postal_code,
      contact_number: vm.warehouseData.contact_number,
      status: true,
    };

    const createdWarehouse = await super.create(
      req,
      dto as unknown as CreationAttributes<Model<WarehouseAttributes>>,
    );

    if (!(createdWarehouse instanceof Model)) {
      const message = getMessage(req, MessagesKey.ERRORCREATION);
      const formattedMessage = formatMessage(message, ['warehouse']);
      throw new Error(formattedMessage);
    }

    const resultDTO = this.convertToResultDTO(createdWarehouse);
    return new WarehouseResultVM(resultDTO);
  }
  //endregion

  //region Update methods
  async updateWarehouse(
    req: Request,
    pkid: number,
    vm: WarehouseUpdateVM,
  ): Promise<WarehouseResultVM> {
    const allowedUpdates: Partial<WarehouseAttributes> = {
      name: vm.warehouseData.name,
      address: vm.warehouseData.address,
      city: vm.warehouseData.city,
      state: vm.warehouseData.state,
      country: vm.warehouseData.country,
      postal_code: vm.warehouseData.postal_code,
      contact_number: vm.warehouseData.contact_number,
      status: vm.warehouseData.status,
    };

    const [affectedCount, updatedModels] = await this.repository.update(
      req,
      pkid,
      allowedUpdates,
    );

    if (affectedCount === 0) {
      const message = getMessage(req, MessagesKey.NOCHANGESMADE);
      throw new Error(message);
    }

    const updatedModel = updatedModels[0];
    if (!updatedModel) {
      const message = getMessage(req, MessagesKey.ERRORUPDATE);
      throw new Error(message);
    }

    return new WarehouseResultVM(this.convertToResultDTO(updatedModel));
  }
  //endregion

  //region Delete and Restore methods
  async softDeleteWarehouse(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteWarehouse(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreWarehouse(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion

  //region CSV Methods
  async generateCsvWarehouse(
    req: Request,
    warehouseIds?: number[],
  ): Promise<string> {
    try {
      return await generateCSVWarehouse(req, warehouseIds);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion
}
