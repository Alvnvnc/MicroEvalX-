import { Request } from 'express';
import { BaseService } from '../common/base.service';
import {
  UnitCreateVM,
  UnitResultVM,
  UnitUpdateVM,
} from '../../helpers/view-models/unit.vm';
import {
  getUnitDropdownAttributes,
  UnitCreateDTO,
  UnitDropdownDTO,
  UnitResultDTO,
} from '../../helpers/dto/unit.dto';
import { UnitRepository } from '../../data-access/repositories/unit.repository';
import { UnitAttributes } from '../../infrastructure/models/unit.model';
import { CreationAttributes, Model, WhereOptions } from 'sequelize';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { UnitCategory } from '../../helpers/enum/unitCategory.enum';
import { generateCSVUnit } from '../../helpers/utility/csv/generateCsvUnit';

export class UnitService extends BaseService<Model<UnitAttributes>> {
  constructor() {
    super(new UnitRepository());
  }

  //region Helper function
  private convertToResultDTO(model: Model<UnitAttributes>): UnitResultDTO {
    return model.toJSON();
  }

  private convertToDropdownDTO(model: Model<UnitAttributes>): UnitDropdownDTO {
    return getUnitDropdownAttributes(model.toJSON());
  }

  private mapCategory(category: string, req: Request): UnitCategory {
    if (!Object.values(UnitCategory).includes(category as UnitCategory)) {
      const message = getMessage(req, MessagesKey.INVALIDCATEGORY);
      throw new Error(formatMessage(message, [category]));
    }
    return category as UnitCategory;
  }
  //endregion

  //region Find methods
  async findAllUnits(req: Request): Promise<Model<UnitAttributes>[]> {
    return await super.findAll(req);
  }

  async findUnitByID(
    req: Request,
    pkid: number,
  ): Promise<Model<UnitAttributes> | null> {
    return await super.findByPKID(req, pkid);
  }

  async findUnitsByCriteria(
    req: Request,
    { code, name }: { code?: string; name?: string },
  ): Promise<Model<UnitAttributes>[]> {
    const criteria: WhereOptions<UnitAttributes> = {};
    if (code) criteria.code = code;
    if (name) criteria.name = name;

    return this.where(req, criteria);
  }

  async findAllUnitsForDropdown(req: Request): Promise<UnitDropdownDTO[]> {
    const units = await super.findAll(req);
    return await Promise.all(units.map(this.convertToDropdownDTO.bind(this)));
  }
  //endregion

  //region Create methods
  async createUnit(req: Request, vm: UnitCreateVM): Promise<UnitResultVM> {
    const unitExists = await this.whereExisting(req, {
      code: vm.unitData.code,
    });
    if (unitExists) {
      const message = getMessage(req, MessagesKey.DUPLICATEUNITCODE);
      const formattedMessage = formatMessage(message, [vm.unitData.code]);
      throw new Error(formattedMessage);
    }

    const dto: UnitCreateDTO = {
      code: vm.unitData.code,
      name: vm.unitData.name,
      description: vm.unitData.description,
      symbol: vm.unitData.symbol,
      conversion_factor: vm.unitData.conversion_factor,
      base_unit: vm.unitData.base_unit,
      category: this.mapCategory(vm.unitData.category, req),
    };

    const createdUnit = await super.create(
      req,
      dto as unknown as CreationAttributes<Model<UnitAttributes>>,
    );

    if (!(createdUnit instanceof Model)) {
      const message = getMessage(req, MessagesKey.ERRORCREATION);
      const formattedMessage = formatMessage(message, ['unit']);
      throw new Error(formattedMessage);
    }

    const resultDTO = this.convertToResultDTO(createdUnit);
    return new UnitResultVM(resultDTO);
  }
  //endregion

  //region Update methods
  async updateUnit(
    req: Request,
    pkid: number,
    vm: UnitUpdateVM,
  ): Promise<UnitResultVM> {
    const allowedUpdates: Partial<UnitAttributes> = {
      name: vm.unitData.name,
      description: vm.unitData.description,
      symbol: vm.unitData.symbol,
      conversion_factor: vm.unitData.conversion_factor,
      base_unit: vm.unitData.base_unit,
      category: vm.unitData.category
        ? this.mapCategory(vm.unitData.category, req)
        : undefined,
      status: vm.unitData.status,
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

    return new UnitResultVM(this.convertToResultDTO(updatedModel));
  }
  //endregion

  //region Delete and Restore methods
  async softDeleteUnit(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteUnit(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreUnit(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion

  //region CSV Methods
  async generateCsvUnit(req: Request, unitIds?: number[]): Promise<string> {
    try {
      return await generateCSVUnit(req, unitIds);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion
}
