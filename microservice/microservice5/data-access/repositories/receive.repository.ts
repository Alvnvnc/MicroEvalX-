import { Request } from 'express';
import {
  ReceiveAttributes,
  ReceiveWithDetailsAttributes,
} from '../../infrastructure/models/receive.model';
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

export class ReceiveRepository extends BaseRepository<
  Model<ReceiveAttributes>
> {
  constructor() {
    super(db.Receive);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<ReceiveAttributes>[]> {
    try {
      return await this.model.findAll({
        include: [
          {
            model: db.ReceiveDetail,
            as: 'receiveDetails',
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
  ): Promise<Model<ReceiveAttributes> | null> {
    try {
      return await this.model.findByPk(pkid, {
        include: [
          {
            model: db.ReceiveDetail,
            as: 'receiveDetails',
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
  ): Promise<ReceiveWithDetailsAttributes[]> {
    try {
      const receives = await this.model.findAll({
        include: [
          {
            model: db.ReceiveDetail,
            as: 'receiveDetails',
          },
        ],
      });
      return receives.map(
        (receive) => receive.toJSON() as ReceiveWithDetailsAttributes,
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

  async findAllHeaders(req: Request): Promise<ReceiveAttributes[]> {
    try {
      const receives = await this.model.findAll();
      return receives.map((receive) => receive.toJSON() as ReceiveAttributes);
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
    entity: ReceiveWithDetailsAttributes,
    transaction: Transaction,
  ): Promise<Model<ReceiveAttributes>> {
    try {
      const newReceive = await super.createWithTransaction(
        req,
        entity,
        transaction,
      );

      if (entity.receiveDetails && Array.isArray(entity.receiveDetails)) {
        for (const detail of entity.receiveDetails) {
          await db.ReceiveDetail.create(
            {
              ...detail,
              receive_pkid: newReceive.get('pkid') as number,
            },
            { transaction },
          );
        }
      }

      return newReceive;
    } catch (error) {
      throw error;
    }
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: ReceiveWithDetailsAttributes,
  ): Promise<[number, Model<ReceiveAttributes>[]]> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      const [affectedCount, updatedModels] = await super.update(
        req,
        pkid,
        entity,
      );

      if (entity.receiveDetails && Array.isArray(entity.receiveDetails)) {
        for (const detail of entity.receiveDetails) {
          if (detail.pkid) {
            await db.ReceiveDetail.update(detail, {
              where: { pkid: detail.pkid },
              transaction,
            });
          } else {
            await db.ReceiveDetail.create(
              {
                ...detail,
                receive_pkid: pkid,
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
      await db.ReceiveDetail.destroy({
        where: { receive_pkid: pkid },
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
          } as WhereOptions<ReceiveAttributes>,
          paranoid: false,
          transaction,
        },
      );

      await db.ReceiveDetail.update(
        {
          is_deleted: false,
          deleted_by: undefined,
          deleted_date: undefined,
          deleted_host: undefined,
        },
        {
          where: { receive_pkid: pkid },
          paranoid: false,
          transaction,
        },
      );

      await transaction.commit();
      await this.model.restore({
        where: { pkid: pkid as any } as WhereOptions<ReceiveAttributes>,
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
