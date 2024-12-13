
import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { ItemWarehouseRepository } from '../../data-access/repositories/itemWarehouse.repository';
import { ItemWarehouseAttributes } from '../../infrastructure/models/itemWarehouse.model';
import { ItemWarehouseResultDTO } from '../../helpers/dto/itemWarehouse.dto';
import { WhereOptions, Model } from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class ItemWarehouseFindService extends BaseService<
  Model<ItemWarehouseAttributes>
> {
  constructor() {
    super(new ItemWarehouseRepository());
  }

  //region Find methods
  async findAllItemWarehouses(req: Request): Promise<ItemWarehouseResultDTO[]> {
    const itemWarehouses = await super.findAll(req);
    return await Promise.all(
      itemWarehouses.map((itemWarehouse) =>
        this.convertToResultDTO(itemWarehouse),
      ),
    );
  }
    convertToResultDTO(itemWarehouse: Model<ItemWarehouseAttributes, ItemWarehouseAttributes>): any {
        throw new Error('Method not implemented.');
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
}