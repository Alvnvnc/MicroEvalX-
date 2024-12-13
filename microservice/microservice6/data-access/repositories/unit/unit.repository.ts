import { Request } from 'express';
import { UnitAttributes } from '../../../infrastructure/models/unit/unitAttributes.model';
import {
  Model,
  CreationAttributes,
  WhereOptions,
  FindOptions,
} from 'sequelize';
import db from '../../../infrastructure/models';
import { BaseRepository } from '../../utility/base.repository';

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
  ): Promise<Model<UnitAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<UnitAttributes>>[],
  ): Promise<Model<UnitAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<UnitAttributes>,
  ): Promise<[number, Model<UnitAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<UnitAttributes> }[],
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