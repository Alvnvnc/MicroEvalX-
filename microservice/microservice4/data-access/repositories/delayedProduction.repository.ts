import { Request } from 'express';
import { DelayedProductionAttributes } from '../../infrastructure/models/delayedProduction.model';
import {
  Model,
  CreationAttributes,
  WhereOptions,
  FindOptions,
} from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class DelayedProductionRepository extends BaseRepository<
  Model<DelayedProductionAttributes>
> {
  constructor() {
    super(db.DelayedProduction);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<DelayedProductionAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<DelayedProductionAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<DelayedProductionAttributes>,
    options?: FindOptions<DelayedProductionAttributes>,
  ): Promise<Model<DelayedProductionAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<DelayedProductionAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<DelayedProductionAttributes>>,
  ): Promise<Model<DelayedProductionAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<DelayedProductionAttributes>>[],
  ): Promise<Model<DelayedProductionAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<DelayedProductionAttributes>,
  ): Promise<[number, Model<DelayedProductionAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<DelayedProductionAttributes> }[],
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
