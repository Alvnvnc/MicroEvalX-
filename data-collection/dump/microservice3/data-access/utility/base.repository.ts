import {
  CreationAttributes,
  Model,
  ModelStatic,
  UpdateOptions,
  WhereOptions,
  FindOptions,
  Transaction,
} from 'sequelize';
import { getMessage } from '../../helpers/messages/messagesUtil';
import { MessagesKey } from '../../helpers/messages/messagesKey';
import { Request } from 'express';

export abstract class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  protected constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  //region Extract User Information
  protected extractCreationInfo(req: Request) {
    const user = req.headers['authorization'] ?? 'admin';
    const host = req.ip ?? 'localhost';
    const currentTime = new Date();
    return {
      created_by: user,
      created_date: currentTime,
      created_host: host,
    };
  }

  protected extractUpdateInfo(req: Request) {
    const user = req.headers['authorization'] ?? 'admin';
    const host = req.ip ?? 'localhost';
    const currentTime = new Date();
    return {
      updated_by: user,
      updated_date: currentTime,
      updated_host: host,
    };
  }

  protected extractDeletionInfo(req: Request) {
    const user = req.headers['authorization'] ?? 'admin';
    const host = req.ip ?? 'localhost';
    const currentTime = new Date();
    return {
      deleted_by: user,
      deleted_date: currentTime,
      deleted_host: host,
      is_deleted: true,
    };
  }
  //endregion

  //region Find methods
  async findAll(req: Request): Promise<T[]> {
    try {
      return await this.model.findAll();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORFINDINGALL) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async findByID(req: Request, pkid: number): Promise<T | null> {
    try {
      return await this.model.findByPk(pkid);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORFINDINGBYID) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async where(
    req: Request,
    criteria: WhereOptions<T['_attributes']>,
    options?: FindOptions<T['_attributes']>,
  ): Promise<T[]> {
    try {
      return await this.model.findAll({
        where: criteria,
        ...options,
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

  async whereExisting(
    req: Request,
    criteria: Partial<T['_attributes']>,
  ): Promise<boolean> {
    try {
      const whereCriteria: WhereOptions<T['_attributes']> =
        criteria as WhereOptions<T['_attributes']>;
      const count = await this.model.count({
        where: whereCriteria,
      });
      return count > 0;
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
  async create(
    req: Request,
    entity: CreationAttributes<T>,
  ): Promise<T | string> {
    const creationInfo = this.extractCreationInfo(req);
    try {
      return await this.model.create({
        ...entity,
        ...creationInfo,
      });
    } catch (error) {
      return getMessage(req, MessagesKey.ERRORCREATE);
    }
  }

  async createWithTransaction(
    req: Request,
    entity: CreationAttributes<T>,
    transaction: Transaction,
  ): Promise<T> {
    const creationInfo = this.extractCreationInfo(req);
    return await this.model.create(
      {
        ...entity,
        ...creationInfo,
      },
      { transaction },
    );
  }

  async bulkCreate(
    req: Request,
    entities: CreationAttributes<T>[],
  ): Promise<T[] | string> {
    const creationInfo = this.extractCreationInfo(req);
    try {
      return await this.model.bulkCreate(
        entities.map((entity) => ({
          ...entity,
          ...creationInfo,
        })),
        { validate: true },
      );
    } catch (error) {
      return getMessage(req, MessagesKey.ERRORBULKCREATE);
    }
  }

  async bulkCreateWithTransaction(
    req: Request,
    entities: CreationAttributes<T>[],
    transaction: Transaction,
  ): Promise<T[]> {
    const creationInfo = this.extractCreationInfo(req);
    return await this.model.bulkCreate(
      entities.map((entity) => ({
        ...entity,
        ...creationInfo,
      })),
      { validate: true, transaction },
    );
  }
  //endregion

  //region Update methods
  async update(
    req: Request,
    pkid: number,
    entity: Partial<T['_attributes']>,
  ): Promise<[number, T[]]> {
    const updateInfo = this.extractUpdateInfo(req);
    const [affectedCount] = await this.model.update(
      {
        ...entity,
        ...updateInfo,
      },
      {
        where: { pkid: pkid as any } as WhereOptions<T['_attributes']>,
      } as UpdateOptions,
    );
    const updatedModels = await this.model.findAll({
      where: { pkid: pkid as any } as WhereOptions<T['_attributes']>,
    });
    return [affectedCount, updatedModels];
  }

  async bulkUpdate(
    req: Request,
    entities: { pkid: number; values: Partial<T['_attributes']> }[],
  ): Promise<void> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      for (const entity of entities) {
        const updateInfo = this.extractUpdateInfo(req);
        await this.model.update(
          {
            ...entity.values,
            ...updateInfo,
          },
          {
            where: {
              pkid: entity.pkid as unknown as WhereOptions<T['_attributes']>,
            },
            transaction: transaction,
          } as UpdateOptions,
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  //endregion

  //region Delete and Restore methods
  async softDelete(req: Request, pkid: number): Promise<void> {
    const deletionInfo = this.extractDeletionInfo(req);
    try {
      await this.model.update(deletionInfo, {
        where: { pkid: pkid as any } as WhereOptions<T['_attributes']>,
        paranoid: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORSOFTDELETING) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async hardDelete(req: Request, pkid: number): Promise<void> {
    try {
      const whereOptions = { pkid } as unknown as WhereOptions<
        T['_attributes']
      >;
      await this.model.destroy({
        where: whereOptions,
        force: true, // Force deletion for hard deleting
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          getMessage(req, MessagesKey.ERRORHARDDELETING) + ': ' + error.message,
        );
      }
      throw error;
    }
  }

  async restore(req: Request, pkid: number): Promise<void> {
    try {
      await this.model.update(
        {
          is_deleted: false,
          deleted_by: null,
          deleted_date: null,
          deleted_host: null,
        },
        {
          where: { pkid: pkid as any } as WhereOptions<T['_attributes']>,
          paranoid: false,
        },
      );
      await this.model.restore({
        where: { pkid: pkid as any } as WhereOptions<T['_attributes']>,
      });
    } catch (error) {
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
