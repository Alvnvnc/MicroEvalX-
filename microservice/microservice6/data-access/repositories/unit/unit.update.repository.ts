
import { Request } from 'express';
import { UnitAttributes } from '../../../infrastructure/models/unit/unitAttributes.model';
import { Model } from 'sequelize';
import { BaseRepository } from '../../utility/base.repository';

export class UnitUpdateRepository extends BaseRepository<Model<UnitAttributes>> {
  async update(req: Request, pkid: number, entity: Partial<UnitAttributes>): Promise<[number, Model<UnitAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(req: Request, entities: { pkid: number; values: Partial<UnitAttributes> }[]): Promise<void> {
    return super.bulkUpdate(req, entities);
  }
}