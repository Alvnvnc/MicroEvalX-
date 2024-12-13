
import { Request } from 'express';
import { UnitRepository } from '../../repositories/unit/unit.repository';
import { UnitAttributes } from '../../../infrastructure/models/unit/unitAttributes.model';
import { Model, CreationAttributes, WhereOptions, FindOptions } from 'sequelize';

export class UnitService {
  private unitRepository: UnitRepository;

  constructor() {
    this.unitRepository = new UnitRepository();
  }

  async findAll(req: Request): Promise<Model<UnitAttributes>[]> {
    return this.unitRepository.findAll(req);
  }

  async findByID(req: Request, pkid: number): Promise<Model<UnitAttributes> | null> {
    return this.unitRepository.findByID(req, pkid);
  }

  async where(req: Request, criteria: WhereOptions<UnitAttributes>, options?: FindOptions<UnitAttributes>): Promise<Model<UnitAttributes>[]> {
    return this.unitRepository.where(req, criteria, options);
  }

  async whereExisting(req: Request, criteria: Partial<UnitAttributes>): Promise<boolean> {
    return this.unitRepository.whereExisting(req, criteria);
  }

  async create(req: Request, entity: CreationAttributes<Model<UnitAttributes>>): Promise<Model<UnitAttributes> | string> {
    return this.unitRepository.create(req, entity);
  }

  async bulkCreate(req: Request, entities: CreationAttributes<Model<UnitAttributes>>[]): Promise<Model<UnitAttributes>[] | string> {
    return this.unitRepository.bulkCreate(req, entities);
  }

  async update(req: Request, pkid: number, entity: Partial<UnitAttributes>): Promise<[number, Model<UnitAttributes>[]]> {
    return this.unitRepository.update(req, pkid, entity);
  }

  async bulkUpdate(req: Request, entities: { pkid: number; values: Partial<UnitAttributes> }[]): Promise<void> {
    return this.unitRepository.bulkUpdate(req, entities);
  }

  async softDelete(req: Request, pkid: number): Promise<void> {
    return this.unitRepository.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    return this.unitRepository.hardDelete(req, pkid);
  }

  async restore(req: Request, pkid: number): Promise<void> {
    return this.unitRepository.restore(req, pkid);
  }
}