import { BaseEntity } from '../interfaces/baseEntity.model';
import { TransferStatus } from '../../helpers/enum/transferStatus.enum';
import { TransferType } from '../../helpers/enum/transferType.enum';
import { TransferDetailAttributes } from './transferDetail.model';

export interface TransferAttributes extends BaseEntity {
  pkid: number;
  code: string;
  from_warehouse_pkid?: number;
  to_warehouse_pkid?: number;
  supplier_pkid?: number;
  customer_pkid?: number;
  reference_number?: string;
  transfer_date: Date;
  status: TransferStatus;
  type: TransferType;
  total_quantity?: number;
  total_accepted_quantity?: number;
  total_rejected_quantity?: number;
  description?: string;
}

export interface TransferWithDetailsAttributes extends TransferAttributes {
  transferDetails?: TransferDetailAttributes[];
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Transfer extends BaseEntity implements TransferAttributes {
    pkid!: number;
    code!: string;
    from_warehouse_pkid?: number;
    to_warehouse_pkid?: number;
    supplier_pkid?: number;
    customer_pkid?: number;
    reference_number?: string;
    transfer_date!: Date;
    status!: TransferStatus;
    type!: TransferType;
    total_quantity?: number;
    total_accepted_quantity?: number;
    total_rejected_quantity?: number;
    description?: string;

    static associate(models: any) {
      Transfer.belongsTo(models.Warehouse, {
        foreignKey: 'from_warehouse_pkid',
        as: 'fromWarehouse',
      });
      Transfer.belongsTo(models.Warehouse, {
        foreignKey: 'to_warehouse_pkid',
        as: 'toWarehouse',
      });
      Transfer.hasMany(models.TransferDetail, {
        foreignKey: 'transfer_pkid',
        as: 'transferDetails',
      });
    }
  }

  Transfer.init(
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
      from_warehouse_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'pkid',
        },
      },
      to_warehouse_pkid: {
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
      transfer_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(TransferStatus)),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(TransferType)),
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Transfer',
      tableName: 'transfers',
      timestamps: false,
    },
  );

  return Transfer;
};
