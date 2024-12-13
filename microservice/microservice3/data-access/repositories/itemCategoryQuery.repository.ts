// itemCategoryQuery.repository.ts
import { Request } from 'express';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { Model, WhereOptions, FindOptions } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class ItemCategoryQueryRepository extends BaseRepository<
  Model<ItemCategoryAttributes>
> {
  constructor() {
    super(db.ItemCategory);
  }

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
}
