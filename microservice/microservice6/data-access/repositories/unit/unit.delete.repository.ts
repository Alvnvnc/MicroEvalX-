
import { Request } from 'express';
import { UnitAttributes } from '../../../infrastructure/models/unit/unitAttributes.model';
import { Model } from 'sequelize';
import { BaseRepository } from '../../utility/base.repository';

export class UnitDeleteRepository extends BaseRepository<Model<UnitAttributes>> {
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