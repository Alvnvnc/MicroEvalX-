import { Request } from 'express';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import {
  Model,
  CreationAttributes,
  WhereOptions,
  FindOptions,
} from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class ItemCategoryRepository extends BaseRepository<
  Model<ItemCategoryAttributes>
> {
  constructor() {
    super(db.ItemCategory);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<ItemCategoryAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<ItemCategoryAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<ItemCategoryAttributes>,
    options?: FindOptions<ItemCategoryAttributes>,
  ): Promise<Model<ItemCategoryAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<ItemCategoryAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<ItemCategoryAttributes>>,
  ): Promise<Model<ItemCategoryAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<ItemCategoryAttributes>>[],
  ): Promise<Model<ItemCategoryAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<ItemCategoryAttributes>,
  ): Promise<[number, Model<ItemCategoryAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<ItemCategoryAttributes> }[],
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
