import { Request } from 'express';
import { BomDetailAttributes } from '../../infrastructure/models/bomDetail.model';
import {
  CreationAttributes,
  FindOptions,
  Model,
  Transaction,
  WhereOptions,
} from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';

export class BomDetailRepository extends BaseRepository<
  Model<BomDetailAttributes>
> {
  constructor() {
    super(db.BomDetail);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<BomDetailAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<BomDetailAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<BomDetailAttributes>,
    options?: FindOptions<BomDetailAttributes>,
  ): Promise<Model<BomDetailAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<BomDetailAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<BomDetailAttributes>>,
  ): Promise<Model<BomDetailAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<BomDetailAttributes>>[],
  ): Promise<Model<BomDetailAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }

  async bulkCreateWithTransaction(
    req: Request,
    entities: CreationAttributes<Model<BomDetailAttributes>>[],
    transaction: Transaction,
  ): Promise<Model<BomDetailAttributes>[]> {
    const creationInfo = this.extractCreationInfo(req);
    try {
      return await this.model.bulkCreate(
        entities.map((entity) => ({
          ...entity,
          ...creationInfo,
        })),
        { validate: true, transaction },
      );
    } catch (error) {
      throw error;
    }
  }

  async createWithTransaction(
    req: Request,
    entity: CreationAttributes<Model<BomDetailAttributes>>,
    transaction: Transaction,
  ): Promise<Model<BomDetailAttributes>> {
    try {
      return await this.model.create(entity, { transaction });
    } catch (error) {
      throw error;
    }
  }

  async bulkUpdateWithTransaction(
    req: Request,
    entities: {
      pkid: number;
      values: Partial<BomDetailAttributes>;
    }[],
    transaction: Transaction,
  ): Promise<void> {
    const updatePromises = entities.map(({ pkid, values }) =>
      this.model.update(values, {
        where: { pkid },
        transaction,
      }),
    );

    await Promise.all(updatePromises);
  }

  async bulkDeleteWithTransaction(
    req: Request,
    pkids: number[],
    transaction: Transaction,
  ): Promise<void> {
    await this.model.destroy({
      where: {
        pkid: pkids,
      },
      transaction,
    });
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<BomDetailAttributes>,
  ): Promise<[number, Model<BomDetailAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: {
      pkid: number;
      values: Partial<BomDetailAttributes>;
    }[],
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
