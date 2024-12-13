
import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { ItemWarehouseRepository } from '../../data-access/repositories/itemWarehouse.repository';
import { ItemWarehouseAttributes } from '../../infrastructure/models/itemWarehouse.model';
import { ItemWarehouseCreateVM, ItemWarehouseUpdateVM } from '../../helpers/view-models/itemWarehouse.vm';
import { ItemWarehouseResultDTO, ItemWarehouseCreateDTO } from '../../helpers/dto/itemWarehouse.dto';
import { CreationAttributes, Model } from 'sequelize';

import { MessagesKey } from '../../helpers/messages/messagesKey';
import { formatMessage, getMessage } from '../../helpers/messages/messagesUtil';

export class ItemWarehouseCreateUpdateService extends BaseService<
  Model<ItemWarehouseAttributes>
> {
  constructor() {
    super(new ItemWarehouseRepository());
  }

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
    convertToResultDTO(createdItemWarehouse: Model<ItemWarehouseAttributes, ItemWarehouseAttributes>): ItemWarehouseResultDTO | PromiseLike<ItemWarehouseResultDTO> {
        throw new Error('Method not implemented.');
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
}