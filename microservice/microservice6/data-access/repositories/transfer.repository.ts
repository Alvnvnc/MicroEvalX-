import { Request } from 'express';
import {
  TransferAttributes,
  TransferWithDetailsAttributes,
} from '../../infrastructure/models/transfer.model';
import {
  Model,
  WhereOptions,
  CreationAttributes,
  Transaction,
} from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { getMessage } from '../../helpers/messages/messagesUtil';

export class TransferRepository extends BaseRepository<
  Model<TransferAttributes>
> {
  constructor() {
    super(db.Transfer);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<TransferAttributes>[]> {
    try {
      return await this.model.findAll({
        include: [
          {
            model: db.TransferDetail,
            as: 'transferDetails',
          },
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORFINDINGALL) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async findByID(
    req: Request,
    pkid: number,
  ): Promise<Model<TransferAttributes> | null> {
    try {
      return await this.model.findByPk(pkid, {
        include: [
          {
            model: db.TransferDetail,
            as: 'transferDetails',
          },
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORFINDINGBYID) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async findAllWithDetails(
    req: Request,
  ): Promise<TransferWithDetailsAttributes[]> {
    try {
      const transfers = await this.model.findAll({
        include: [
          {
            model: db.TransferDetail,
            as: 'transferDetails',
          },
        ],
      });
      return transfers.map(
        (transfer) => transfer.toJSON() as TransferWithDetailsAttributes,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORFINDINGALL) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async findAllHeaders(req: Request): Promise<TransferAttributes[]> {
    try {
      const transfers = await this.model.findAll();
      return transfers.map(
        (transfer) => transfer.toJSON() as TransferAttributes,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORFINDINGALL) + ': ' + error.message,
        );
      }
      throw error;
    }
  }
  //endregion

  //region Create methods
  async createWithTransaction(
    req: Request,
    entity: TransferWithDetailsAttributes,
    transaction: Transaction,
  ): Promise<Model<TransferAttributes>> {
    try {
      const newTransfer = await super.createWithTransaction(
        req,
        entity,
        transaction,
      );

      if (entity.transferDetails && Array.isArray(entity.transferDetails)) {
        for (const detail of entity.transferDetails) {
          await db.TransferDetail.create(
            {
              ...detail,
              transfer_pkid: newTransfer.get('pkid') as number,
            },
            { transaction },
          );
        }
      }

      return newTransfer;
    } catch (error) {
      throw error;
    }
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: TransferWithDetailsAttributes,
  ): Promise<[number, Model<TransferAttributes>[]]> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      const [affectedCount, updatedModels] = await super.update(
        req,
        pkid,
        entity,
      );

      if (entity.transferDetails && Array.isArray(entity.transferDetails)) {
        for (const detail of entity.transferDetails) {
          if (detail.pkid) {
            await db.TransferDetail.update(detail, {
              where: { pkid: detail.pkid },
              transaction,
            });
          } else {
            await db.TransferDetail.create(
              {
                ...detail,
                transfer_pkid: pkid,
              },
              { transaction },
            );
          }
        }
      }

      await transaction.commit();
      return [affectedCount, updatedModels];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  //endregion

  //region Delete and Restore methods
  async softDelete(req: Request, pkid: number): Promise<void> {
    await super.softDelete(req, pkid);
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      await db.TransferDetail.destroy({
        where: { transfer_pkid: pkid },
        transaction,
        force: true,
      });

      await this.model.destroy({
        where: { pkid: pkid },
        transaction,
        force: true,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORHARDDELETING) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async restore(req: Request, pkid: number): Promise<void> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      await this.model.update(
        {
          is_deleted: false,
          deleted_by: undefined,
          deleted_date: undefined,
          deleted_host: undefined,
        },
        {
          where: {
            pkid: pkid as any,
          } as WhereOptions<TransferAttributes>,
          paranoid: false,
          transaction,
        },
      );

      await db.TransferDetail.update(
        {
          is_deleted: false,
          deleted_by: undefined,
          deleted_date: undefined,
          deleted_host: undefined,
        },
        {
          where: { transfer_pkid: pkid },
          paranoid: false,
          transaction,
        },
      );

      await transaction.commit();
      await this.model.restore({
        where: { pkid: pkid as any } as WhereOptions<TransferAttributes>,
        transaction,
      });
    } catch (error) {
      await transaction.rollback();
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORRESTORING) + ': ' + error.message,
        );
      }
      throw error;
    }
  }
  //endregion
}
