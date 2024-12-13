

// repositories/items/category-unit.repository.ts
import { Request } from 'express';
import { 
  Model, 
  CreationAttributes, 
  WhereOptions,
  FindOptions
} from 'sequelize';
import { BaseRepository } from '../../utility/base.repository';
import db from '../../../infrastructure/models';
import { getMessage } from '../../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../../helpers/messages/messagesKey';
import { ItemCategoryAttributes } from '../../../infrastructure/models/itemCategory.model';
import { UnitAttributes } from '../../../infrastructure/models/unit.model';

export class CategoryRepository extends BaseRepository<Model<ItemCategoryAttributes>> {
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
  ): Promise<Model<ItemCategoryAttributes>> {
    const creationInfo = this.extractCreationInfo(req);
    const created = await this.model.create({
      ...entity,
      ...creationInfo,
    });

    if (!created) {
      throw new Error(getMessage(req, MessagesKey.ERRORCREATION));
    }

    return created;
  }
  //endregion

  //region Update & Delete methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<ItemCategoryAttributes>,
  ): Promise<[number, Model<ItemCategoryAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
  //endregion
}

export class UnitRepository extends BaseRepository<Model<UnitAttributes>> {
  constructor() {
    super(db.Unit);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<UnitAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<UnitAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<UnitAttributes>,
    options?: FindOptions<UnitAttributes>,
  ): Promise<Model<UnitAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<UnitAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<UnitAttributes>>,
  ): Promise<Model<UnitAttributes>> {
    const creationInfo = this.extractCreationInfo(req);
    const created = await this.model.create({
      ...entity,
      ...creationInfo,
    });

    if (!created) {
      throw new Error(getMessage(req, MessagesKey.ERRORCREATION));
    }

    return created;
  }
  //endregion

  //region Update & Delete methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<UnitAttributes>,
  ): Promise<[number, Model<UnitAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async softDelete(req: Request, pkid: number): Promise<void> {
    return super.softDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return super.restore(req, pkid);
  }
  //endregion
}