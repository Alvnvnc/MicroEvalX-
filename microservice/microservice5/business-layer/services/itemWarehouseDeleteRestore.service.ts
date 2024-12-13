
import { Request } from 'express';
import { BaseService } from '../common/base.service';
import { ItemWarehouseRepository } from '../../data-access/repositories/itemWarehouse.repository';
import { ItemWarehouseAttributes } from '../../infrastructure/models/itemWarehouse.model';
import { Model } from 'sequelize';

export class ItemWarehouseDeleteRestoreService extends BaseService<
  Model<ItemWarehouseAttributes>
> {
  constructor() {
    super(new ItemWarehouseRepository());
  }

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
}