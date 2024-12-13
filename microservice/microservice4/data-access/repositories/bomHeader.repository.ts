import { Request } from 'express';
import {
  BomHeaderAttributes,
  BomHeaderWithDetailsAttributes,
} from '../../infrastructure/models/bomHeader.model';
import { Model, Op, Transaction, WhereOptions } from 'sequelize';
import db from '../../infrastructure/models';
import { BaseRepository } from '../utility/base.repository';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { BomStatus } from '../../helpers/enum/bomStatus.enum';

export class BomHeaderRepository extends BaseRepository<
  Model<BomHeaderAttributes>
> {
  constructor() {
    super(db.BomHeader);
  }

  //region Find methods
  async findAll(req: Request): Promise<Model<BomHeaderAttributes>[]> {
    try {
      return await this.model.findAll({
        include: [
          {
            model: db.BomDetail,
            as: 'bomDetails',
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
  ): Promise<Model<BomHeaderAttributes> | null> {
    try {
      return await this.model.findByPk(pkid, {
        include: [
          {
            model: db.BomDetail,
            as: 'bomDetails',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllWithDetails(
    req: Request,
  ): Promise<BomHeaderWithDetailsAttributes[]> {
    try {
      const bomHeaders = await this.model.findAll({
        include: [
          {
            model: db.BomDetail,
            as: 'bomDetails',
          },
        ],
      });
      return bomHeaders.map(
        (bomHeader) => bomHeader.toJSON() as BomHeaderWithDetailsAttributes,
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

  async findAllHeaders(req: Request): Promise<BomHeaderAttributes[]> {
    try {
      const bomHeaders = await this.model.findAll();
      return bomHeaders.map(
        (bomHeader) => bomHeader.toJSON() as BomHeaderAttributes,
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

  async findByItemHeaderPKIDs(
    req: Request,
    itemHeaderPKIDs: number[],
    status?: BomStatus, // Added optional status parameter
  ): Promise<Model<BomHeaderAttributes>[]> {
    try {
      const where: WhereOptions<BomHeaderAttributes> = {
        item_header_pkid: {
          [Op.in]: itemHeaderPKIDs,
        },
      };

      if (status !== undefined) {
        where.status = status;
      }

      return await this.model.findAll({
        where,
        include: [
          {
            model: db.BomDetail,
            as: 'bomDetails',
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

  async findByItemEndProductPkidAndActiveStatus(
    req: Request,
    itemEndProductPkid: number,
  ): Promise<Model<BomHeaderAttributes> | null> {
    try {
      return await this.model.findOne({
        where: {
          item_header_pkid: itemEndProductPkid,
          status: BomStatus.ACTIVE,
        },
        include: [
          {
            model: db.BomDetail,
            as: 'bomDetails',
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
  //endregion

  //region Create methods
  async createWithTransaction(
    req: Request,
    entity: BomHeaderAttributes,
    transaction: Transaction,
  ): Promise<Model<BomHeaderAttributes>> {
    try {
      // Notice we do not create details here.
      return await super.createWithTransaction(req, entity, transaction);
    } catch (error) {
      throw error;
    }
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkidOrWhere: number | WhereOptions<BomHeaderAttributes>,
    entity: Partial<BomHeaderAttributes>,
    transaction?: Transaction,
  ): Promise<[number, Model<BomHeaderAttributes>[]]> {
    try {
      const where =
        typeof pkidOrWhere === 'number' ? { pkid: pkidOrWhere } : pkidOrWhere;
      const [affectedCount, updatedModels] = await this.model.update(entity, {
        where,
        returning: true,
        transaction,
      });

      return [affectedCount, updatedModels];
    } catch (error) {
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
      await db.BomDetail.destroy({
        where: { bom_header_pkid: pkid },
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
          } as WhereOptions<BomHeaderAttributes>,
          paranoid: false,
          transaction,
        },
      );

      await db.BomDetail.update(
        {
          is_deleted: false,
          deleted_by: undefined,
          deleted_date: undefined,
          deleted_host: undefined,
        },
        {
          where: { bom_header_pkid: pkid },
          paranoid: false,
          transaction,
        },
      );

      await transaction.commit();
      await this.model.restore({
        where: { pkid: pkid as any } as WhereOptions<BomHeaderAttributes>,
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

  //region Other methods
  async setInactiveForSameItemHeader(
    req: Request,
    itemHeaderPkid: number,
    transaction: Transaction,
  ): Promise<void> {
    try {
      await this.model.update(
        { status: BomStatus.INACTIVE },
        {
          where: {
            item_header_pkid: itemHeaderPkid,
            status: BomStatus.ACTIVE,
          },
          transaction,
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORUPDATE) + ': ' + error.message,
        );
      }
      throw error;
    }
  }
  //endregion
}
