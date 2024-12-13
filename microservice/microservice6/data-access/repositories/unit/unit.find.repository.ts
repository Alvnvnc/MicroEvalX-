
import { Request } from 'express';
import { UnitAttributes } from '../../../infrastructure/models/unit/unitAttributes.model';
import { Model, WhereOptions, FindOptions } from 'sequelize';
import { BaseRepository } from '../../utility/base.repository';

export class UnitFindRepository extends BaseRepository<Model<UnitAttributes>> {
  async findAll(req: Request): Promise<Model<UnitAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(req: Request, pkid: number): Promise<Model<UnitAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(req: Request, criteria: WhereOptions<UnitAttributes>, options?: FindOptions<UnitAttributes>): Promise<Model<UnitAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(req: Request, criteria: Partial<UnitAttributes>): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
}