import { Request } from 'express';
import { ItemWarehouseAttributes } from '../../infrastructure/models/itemWarehouse.model';
import {
  Model,
  CreationAttributes,
  WhereOptions,
  FindOptions,
} from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class ItemWarehouseRepository extends BaseRepository<
  Model<ItemWarehouseAttributes>
> {
  constructor() {
    super(db.ItemWarehouse);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<ItemWarehouseAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<ItemWarehouseAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<ItemWarehouseAttributes>,
    options?: FindOptions<ItemWarehouseAttributes>,
  ): Promise<Model<ItemWarehouseAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<ItemWarehouseAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<ItemWarehouseAttributes>>,
  ): Promise<Model<ItemWarehouseAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<ItemWarehouseAttributes>>[],
  ): Promise<Model<ItemWarehouseAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<ItemWarehouseAttributes>,
  ): Promise<[number, Model<ItemWarehouseAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<ItemWarehouseAttributes> }[],
  ): Promise<void> {
    return super.bulkUpdate(req, entities);
  }
  //endregion

  //region Delete and Restore methods
  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    return super.hardDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
  //endregion
}
