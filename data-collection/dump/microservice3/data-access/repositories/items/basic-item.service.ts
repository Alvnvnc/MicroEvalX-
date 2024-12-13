// repositories/items/basic-item.repository.ts
import { Request } from 'express';
import { ItemAttributes } from '../../../infrastructure/models/item.model';
import {
  Model,
  CreationAttributes,
  WhereOptions,
  FindOptions,
} from 'sequelize';
import db from '../../../infrastructure/models';
import { BaseRepository } from '../../utility/base.repository';
import { getMessage } from '../../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../../helpers/messages/messagesKey';

export class BasicItemRepository extends BaseRepository<Model<ItemAttributes>> {
  constructor() {
    super(db.Item);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<ItemAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<ItemAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<ItemAttributes>,
    options?: FindOptions<ItemAttributes>,
  ): Promise<Model<ItemAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<ItemAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<ItemAttributes>>,
  ): Promise<Model<ItemAttributes>> {
    const creationInfo = this.extractCreationInfo(req);
    const createdItem = await this.model.create({
      ...entity,
      ...creationInfo,
    });

    if (!createdItem) {
      throw new Error(getMessage(req, MessagesKey.ERRORCREATION));
    }

    return createdItem;
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<ItemAttributes>>[],
  ): Promise<Model<ItemAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<ItemAttributes>,
  ): Promise<[number, Model<ItemAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<ItemAttributes> }[],
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