import { BaseEntity } from '../interfaces/baseEntity.model';
import { ReceiveStatus } from '../../helpers/enum/receiveStatus.enum';
import { ReceiveType } from '../../helpers/enum/receiveType.enum';
import { ReceiveDetailAttributes } from './receiveDetail.model';

export interface ReceiveAttributes extends BaseEntity {
  pkid: number;
  code: string;
  warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  received_date: Date;
  status: ReceiveStatus;
  type: ReceiveType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  is_rejected: boolean;
  description?: string;
}

export interface ReceiveWithDetailsAttributes extends ReceiveAttributes {
  receiveDetails?: ReceiveDetailAttributes[];
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Receive extends BaseEntity implements ReceiveAttributes {
    pkid!: number;
    code!: string;
    warehouse_pkid?: number;
    supplier_pkid?: number;
    customer_pkid?: number;
    reference_number?: string;
    received_date!: Date;
    status!: ReceiveStatus;
    type!: ReceiveType;
    total_quantity?: number;
    total_accepted_quantity?: number;
    total_rejected_quantity?: number;
    is_rejected!: boolean;
    description?: string;

    static associate(models: any) {
      Receive.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_pkid',
        as: 'warehouse',
      });
      Receive.hasMany(models.ReceiveDetail, {
        foreignKey: 'receive_pkid',
        as: 'receiveDetails',
      });
    }
  }

  Receive.init(
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
      warehouse_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'pkid',
        },
      },
      supplier_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      customer_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      received_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ReceiveStatus)),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ReceiveType)),
        allowNull: false,
      },
      total_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total_accepted_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total_rejected_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      is_rejected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Receive',
      tableName: 'receives',
      timestamps: false,
    },
  );

  return Receive;
};
