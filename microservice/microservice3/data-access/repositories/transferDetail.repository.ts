import { Request } from 'express';
import { TransferDetailAttributes } from '../../infrastructure/models/transferDetail.model';
import {
  Model,
  CreationAttributes,
  WhereOptions,
  FindOptions,
  Transaction,
} from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { getMessage } from '../../helpers/messages/messagesUtil';

export class TransferDetailRepository extends BaseRepository<
  Model<TransferDetailAttributes>
> {
  constructor() {
    super(db.TransferDetail);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<TransferDetailAttributes>[]> {
    return await super.findAll(req);
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<TransferDetailAttributes> | null> {
    return await super.findByID(req, pkid);
  }

  async where(
    req: Request,
    criteria: WhereOptions<TransferDetailAttributes>,
    options?: FindOptions<TransferDetailAttributes>,
  ): Promise<Model<TransferDetailAttributes>[]> {
    return super.where(req, criteria, options);
  }

  async whereExisting(
    req: Request,
    criteria: Partial<TransferDetailAttributes>,
  ): Promise<boolean> {
    return super.whereExisting(req, criteria);
  }
  //endregion

  //region Create methods
  async create(
    req: Request,
    entity: CreationAttributes<Model<TransferDetailAttributes>>,
  ): Promise<Model<TransferDetailAttributes> | string> {
    return super.create(req, entity);
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<Model<TransferDetailAttributes>>[],
  ): Promise<Model<TransferDetailAttributes>[] | string> {
    return super.bulkCreate(req, entities);
  }

  async bulkCreateWithTransaction(
    req: Request,
    entities: CreationAttributes<Model<TransferDetailAttributes>>[],
    transaction: Transaction,
  ): Promise<Model<TransferDetailAttributes>[]> {
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
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORBULKCREATE) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async bulkUpdateWithTransaction(
    req: Request,
    entities: {
      pkid: number;
      values: Partial<TransferDetailAttributes>;
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
    entity: Partial<TransferDetailAttributes>,
  ): Promise<[number, Model<TransferDetailAttributes>[]]> {
    return super.update(req, pkid, entity);
  }

  async bulkUpdate(
    req: Request,
    entities: {
      pkid: number;
      values: Partial<TransferDetailAttributes>;
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
