import { BaseEntity } from '../interfaces/baseEntity.model';

export interface TransferDetailAttributes extends BaseEntity {
  pkid: number;
  transfer_pkid: number;
  item_pkid: number;
  item_quantity: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class TransferDetail extends BaseEntity implements TransferDetailAttributes {
    pkid!: number;
    transfer_pkid!: number;
    item_pkid!: number;
    item_quantity!: number;
    item_accepted_quantity?: number;
    item_rejected_quantity?: number;
    expiry_date?: Date;
    notes?: string;

    static associate(models: any) {
      TransferDetail.belongsTo(models.Transfer, {
        foreignKey: 'transfer_pkid',
        as: 'transfer',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      TransferDetail.belongsTo(models.Item, {
        foreignKey: 'item_pkid',
        as: 'item',
      });
    }
  }

  TransferDetail.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      transfer_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'transfers',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      item_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'items',
          key: 'pkid',
        },
      },
      item_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      item_accepted_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      item_rejected_quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      expiry_date: {
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
      modelName: 'TransferDetail',
      tableName: 'transfer_details',
      timestamps: false,
    },
  );

  return TransferDetail;
};
