// itemCategoryCreation.repository.ts
import { Request } from 'express';
import { ItemCategoryAttributes } from '../../infrastructure/models/itemCategory.model';
import { Model, CreationAttributes } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class ItemCategoryCreationRepository extends BaseRepository<
  Model<ItemCategoryAttributes>
> {
  constructor() {
    super(db.ItemCategory);
  }

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
}
