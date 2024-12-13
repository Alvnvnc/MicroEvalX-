import { Model, DataTypes, Sequelize } from 'sequelize';
import { BaseEntity } from '../interfaces/baseEntity.model';
import { ProductionStatus } from '../../helpers/enum/productionStatus.enum';

export interface DelayedProductionAttributes extends BaseEntity {
  pdr_id: string;
  Item: any;
  pkid: number;
  code: string;
  production_request_pkid: number;
  item_pkid: number;
  quantity: number;
  status: ProductionStatus;
  delayed_reason?: string;
  estimated_completion_date?: Date;
  actual_completion_date?: Date;
  notes?: string;
}

export class DelayedProduction
  extends Model<DelayedProductionAttributes>
  implements DelayedProductionAttributes
{
  public pdr_id!: string;
  public Item!: any;
  public tenant_id?: number | undefined;
  public created_by?: string | undefined;
  public created_date?: Date | undefined;
  public created_host?: string | undefined;
  public updated_by?: string | undefined;
  public updated_date?: Date | undefined;
  public updated_host?: string | undefined;
  public is_deleted?: boolean | undefined;
  public deleted_by?: string | undefined;
  public deleted_date?: Date | undefined;
  public deleted_host?: string | undefined;
  pkid!: number;
  code!: string;
  production_request_pkid!: number;
  item_pkid!: number;
  quantity!: number;
  status!: ProductionStatus;
  delayed_reason?: string;
  estimated_completion_date?: Date;
  actual_completion_date?: Date;
  notes?: string;

  static associate(models: any) {
    DelayedProduction.belongsTo(models.BasicItem, {
      foreignKey: 'item_pkid',
      as: 'item',
    });
  }
}

export function initDelayedProductionModel(sequelize: Sequelize): typeof DelayedProduction {
  DelayedProduction.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      production_request_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      item_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'items',
          key: 'pkid',
        },
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ProductionStatus)),
        allowNull: false,
        defaultValue: ProductionStatus.WAITING,
      },
      delayed_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estimated_completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actual_completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
      _attributes: '',
      sequelize: '',
      destroy: '',
      restore: '',
      update: '',
      increment: '',
      decrement: '',
      addHook: '',
      removeHook: '',
      hasHook: '',
      hasHooks: '',
      pdr_id: '',
      Item: '',
      dataValues: '',
      _creationAttributes: '',
      isNewRecord: '',
      where: '',
      getDataValue: '',
      setDataValue: '',
      get: '',
      set: '',
      setAttributes: '',
      changed: '',
      previous: '',
      save: '',
      reload: '',
      validate: '',
      equals: '',
      equalsOneOf: '',
      toJSON: '',
      isSoftDeleted: '',
      _model: ''
    },
    {
      sequelize,
      modelName: 'DelayedProduction',
      tableName: 'delayed_production',
      timestamps: false,
    }
  );
  return DelayedProduction;
}
