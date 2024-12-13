import { Request } from 'express';
import { BaseService } from '../common/base.service';
import {
  ItemWarehouseCreateVM,
  ItemWarehouseUpdateVM,
} from '../../helpers/view-models/itemWarehouse.vm';
import {
  getAllAttributes,
  ItemWarehouseCreateDTO,
  ItemWarehouseResultDTO,
} from '../../helpers/dto/itemWarehouse.dto';
import { ItemWarehouseRepository } from '../../data-access/repositories/itemWarehouse.repository';
import { ItemWarehouseAttributes } from '../../infrastructure/models/itemWarehouse.model';
import { CreationAttributes, Model, WhereOptions } from 'sequelize';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { ItemRepository } from '../../data-access/repositories/item.repository';
import { WarehouseRepository } from '../../data-access/repositories/warehouse.repository';
import { UnitRepository } from '../../data-access/repositories/unit.repository';
import { ItemAttributes } from '../../infrastructure/models/item.model';
import { WarehouseAttributes } from '../../infrastructure/models/warehouse.model';
import { UnitAttributes } from '../../infrastructure/models/unit.model';
import { removeAuditColumnsFromItem } from '../../helpers/dto/item.dto';
import { removeAuditColumnsFromWarehouse } from '../../helpers/dto/warehouse.dto';
import { removeAuditColumnsFromUnit } from '../../helpers/dto/unit.dto';
import { generateCSVItemWarehouse } from '../../helpers/utility/csv/generateCsvItemWarehouse';

export class ItemWarehouseService extends BaseService<
  Model<ItemWarehouseAttributes>
> {
  private itemRepository: ItemRepository;
  private warehouseRepository: WarehouseRepository;
  private unitRepository: UnitRepository;

  constructor() {
    super(new ItemWarehouseRepository());
    this.itemRepository = new ItemRepository();
    this.warehouseRepository = new WarehouseRepository();
    this.unitRepository = new UnitRepository();
  }

  //region Helper methods
  private async convertToResultDTO(
    model: Model<ItemWarehouseAttributes>,
  ): Promise<ItemWarehouseResultDTO> {
    const itemWarehouse = model.toJSON() as ItemWarehouseAttributes;
    let itemData;
    let unitData;
    let warehouseData;

    if (itemWarehouse.item_pkid) {
      const itemModel = await this.itemRepository.findByID(
        {} as Request,
        itemWarehouse.item_pkid,
      );
      if (itemModel) {
        const itemAttributes = itemModel.toJSON() as ItemAttributes;
        if (itemAttributes.unit_pkid) {
          const unitModel = await this.unitRepository.findByID(
            {} as Request,
            itemAttributes.unit_pkid,
          );
          if (unitModel) {
            unitData = removeAuditColumnsFromUnit(
              unitModel.toJSON() as UnitAttributes,
            );
          }
        }
        itemData = {
          ...removeAuditColumnsFromItem(itemAttributes),
          unit: unitData,
        };
      }
    }

    if (itemWarehouse.warehouse_pkid) {
      const warehouseModel = await this.warehouseRepository.findByID(
        {} as Request,
        itemWarehouse.warehouse_pkid,
      );
      if (warehouseModel) {
        warehouseData = removeAuditColumnsFromWarehouse(
          warehouseModel.toJSON() as WarehouseAttributes,
        );
      }
    }

    const resultDTO = getAllAttributes(itemWarehouse);
    return {
      ...resultDTO,
      item: itemData,
      warehouse: warehouseData,
    };
  }
  //endregion

  //region Find methods
  async findAllItemWarehouses(req: Request): Promise<ItemWarehouseResultDTO[]> {
    const itemWarehouses = await super.findAll(req);
    return await Promise.all(
      itemWarehouses.map((itemWarehouse) =>
        this.convertToResultDTO(itemWarehouse),
      ),
    );
  }

  async findItemWarehouseByID(
    req: Request,
    pkid: number,
  ): Promise<ItemWarehouseResultDTO | null> {
    const itemWarehouse = await super.findByPKID(req, pkid);
    if (itemWarehouse) {
      return await this.convertToResultDTO(itemWarehouse);
    }
    return null;
  }

  async findItemWarehousesByCriteria(
    req: Request,
    criteria: any,
  ): Promise<ItemWarehouseResultDTO[]> {
    const where: WhereOptions<ItemWarehouseAttributes> = {};
    if (criteria.item_pkid) where.item_pkid = criteria.item_pkid;
    if (criteria.warehouse_pkid) where.warehouse_pkid = criteria.warehouse_pkid;

    const itemWarehouses = await this.where(req, where);
    return await Promise.all(
      itemWarehouses.map((itemWarehouse) =>
        this.convertToResultDTO(itemWarehouse),
      ),
    );
  }

  async findItemWarehousesByWarehouseID(
    req: Request,
    warehouse_pkid: number,
  ): Promise<ItemWarehouseResultDTO[]> {
    const where: WhereOptions<ItemWarehouseAttributes> = { warehouse_pkid };
    const itemWarehouses = await this.where(req, where);
    return await Promise.all(
      itemWarehouses.map((itemWarehouse) =>
        this.convertToResultDTO(itemWarehouse),
      ),
    );
  }

  public async checkItemQuantity(
    req: Request,
    item_pkid: number,
    warehouse_pkid: number,
    expected_quantity: number,
  ): Promise<boolean> {
    const itemWarehouse = await this.repository.where(req, {
      item_pkid,
      warehouse_pkid,
    });

    if (itemWarehouse.length > 0) {
      const currentQuantity = parseFloat(
        itemWarehouse[0].get('quantity') as string,
      );
      return currentQuantity >= expected_quantity;
    } else {
      const message = getMessage(req, MessagesKey.NODATAFOUND);
      throw new Error(message);
    }
  }
  //endregion

  //region Create methods
  async createItemWarehouse(
    req: Request,
    vm: ItemWarehouseCreateVM,
  ): Promise<ItemWarehouseResultDTO> {
    const dto: ItemWarehouseCreateDTO = {
      item_pkid: vm.itemWarehouseData.item_pkid,
      warehouse_pkid: vm.itemWarehouseData.warehouse_pkid,
      quantity: vm.itemWarehouseData.quantity,
      reorder_level: vm.itemWarehouseData.reorder_level,
      reorder_quantity: vm.itemWarehouseData.reorder_quantity,
      last_restocked: vm.itemWarehouseData.last_restocked,
      expiry_date: vm.itemWarehouseData.expiry_date,
    };

    const createdItemWarehouse = await this.repository.create(
      req,
      dto as unknown as CreationAttributes<Model<ItemWarehouseAttributes>>,
    );

    if (!(createdItemWarehouse instanceof Model)) {
      const message = getMessage(req, MessagesKey.ERRORCREATION);
      const formattedMessage = formatMessage(message, ['item warehouse']);
      throw new Error(formattedMessage);
    }

    return await this.convertToResultDTO(createdItemWarehouse);
  }

  async addAcceptedQuantityToItemWarehouse(
    req: Request,
    warehouse_pkid: number,
    item_pkid: number,
    accepted_quantity: number,
  ): Promise<void> {
    if (!accepted_quantity) {
      const message = getMessage(req, MessagesKey.BADREQUEST);
      throw new Error(message);
    }

    const itemWarehouse = await this.repository.where(req, {
      warehouse_pkid,
      item_pkid,
    });

    if (itemWarehouse.length > 0) {
      const currentQuantity = parseFloat(
        itemWarehouse[0].get('quantity') as string,
      );
      const acceptedQuantityValue = parseFloat(accepted_quantity.toString());
      const newQuantity = currentQuantity + acceptedQuantityValue;

      const updatedRows = await this.repository.update(
        req,
        itemWarehouse[0].get('pkid') as number,
        {
          quantity: parseFloat(newQuantity.toFixed(4)),
        },
      );

      if (updatedRows[0] === 0) {
        const message = getMessage(req, MessagesKey.ERRORUPDATE);
        throw new Error(message);
      }
    } else {
      const message = getMessage(req, MessagesKey.NODATAFOUND);
      throw new Error(message);
    }
  }

  async subtractAcceptedQuantityFromItemWarehouse(
    req: Request,
    warehouse_pkid: number,
    item_pkid: number,
    accepted_quantity: number,
  ): Promise<void> {
    if (!accepted_quantity) {
      const message = getMessage(req, MessagesKey.BADREQUEST);
      throw new Error(message);
    }

    const itemWarehouse = await this.repository.where(req, {
      warehouse_pkid,
      item_pkid,
    });

    if (itemWarehouse.length > 0) {
      const currentQuantity = parseFloat(
        itemWarehouse[0].get('quantity') as string,
      );
      const acceptedQuantityValue = parseFloat(accepted_quantity.toString());
      const newQuantity = currentQuantity - acceptedQuantityValue;

      const updatedRows = await this.repository.update(
        req,
        itemWarehouse[0].get('pkid') as number,
        {
          quantity: parseFloat(newQuantity.toFixed(4)),
        },
      );

      if (updatedRows[0] === 0) {
        const message = getMessage(req, MessagesKey.ERRORUPDATE);
        throw new Error(message);
      }
    } else {
      const message = getMessage(req, MessagesKey.NODATAFOUND);
      throw new Error(message);
    }
  }
  //endregion

  //region Update methods
  async updateItemWarehouse(
    req: Request,
    pkid: number,
    vm: ItemWarehouseUpdateVM,
  ): Promise<ItemWarehouseResultDTO> {
    const allowedUpdates: Partial<ItemWarehouseAttributes> = {
      item_pkid: vm.itemWarehouseData.item_pkid,
      warehouse_pkid: vm.itemWarehouseData.warehouse_pkid,
      quantity: vm.itemWarehouseData.quantity,
      reorder_level: vm.itemWarehouseData.reorder_level,
      reorder_quantity: vm.itemWarehouseData.reorder_quantity,
      last_restocked: vm.itemWarehouseData.last_restocked,
      expiry_date: vm.itemWarehouseData.expiry_date,
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

    return await this.convertToResultDTO(updatedModel);
  }
  //endregion

  //region Delete & Restore methods
  async softDeleteItemWarehouse(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDeleteItemWarehouse(req: Request, pkid: number): Promise<void> {
    await super.hardDelete(req, pkid);
  }

  async restoreItemWarehouse(req: Request, pkid: number): Promise<void> {
    await super.restore(req, pkid);
  }
  //endregion

  //region Generate CSV
  async generateCsvItemWarehouse(
    req: Request,
    itemIds?: number[],
  ): Promise<string> {
    try {
      return await generateCSVItemWarehouse(req, itemIds);
    } catch (error) {
      throw new Error(getMessage(req, MessagesKey.ERRORGENERATECSV));
    }
  }
  //endregion
}
