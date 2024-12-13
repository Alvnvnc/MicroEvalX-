// itemCategoryUpdate.repository.ts
import { Request } from 'express';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { Model } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class ItemCategoryUpdateRepository extends BaseRepository<
  Model<ItemCategoryAttributes>
> {
  constructor() {
    super(db.ItemCategory);
  }

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
}
