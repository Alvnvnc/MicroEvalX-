// itemCategoryDelete.repository.ts
import { Request } from 'express';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { Model } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class ItemCategoryDeleteRepository extends BaseRepository<
  Model<ItemCategoryAttributes>
> {
  constructor() {
    super(db.ItemCategory);
  }

  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    return super.hardDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
}
