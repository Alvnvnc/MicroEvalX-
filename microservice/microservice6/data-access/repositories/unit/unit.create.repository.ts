
import { Request } from 'express';
import { UnitAttributes } from '../../../infrastructure/models/unit/unitAttributes.model';
import { Model, CreationAttributes } from 'sequelize';
import { BaseRepository } from '../../utility/base.repository';

export class UnitCreateRepository extends BaseRepository<Model<UnitAttributes>> {
  async create(req: Request, entity: CreationAttributes<Model<UnitAttributes>>): Promise<Model<UnitAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(req: Request, entities: CreationAttributes<Model<UnitAttributes>>[]): Promise<Model<UnitAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }
}