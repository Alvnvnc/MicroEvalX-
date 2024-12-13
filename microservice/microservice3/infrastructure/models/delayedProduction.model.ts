import { BaseEntity } from '../interfaces/baseEntity.model';
import { ProductionStatus } from '../../helpers/enum/productionStatus.enum';

export interface DelayedProductionAttributes extends BaseEntity {
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

module.exports = (sequelize: any, DataTypes: any) => {
  class DelayedProduction
    extends BaseEntity
    implements DelayedProductionAttributes
  {
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
      DelayedProduction.belongsTo(models.Item, {
        foreignKey: 'item_pkid',
        as: 'item',
      });
    }
  }

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
    },
    {
      sequelize,
      modelName: 'DelayedProduction',
      tableName: 'delayed_production',
      timestamps: false,
    },
  );

  return DelayedProduction;
};
