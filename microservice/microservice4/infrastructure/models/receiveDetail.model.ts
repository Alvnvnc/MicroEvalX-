import { BaseEntity } from '../interfaces/baseEntity.model';

export interface ReceiveDetailAttributes extends BaseEntity {
  pkid: number;
  receive_pkid: number;
  item_pkid: number;
  item_quantity: number;
  item_accepted_quantity?: number;
  item_rejected_quantity?: number;
  expiry_date?: Date;
  notes?: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ReceiveDetail extends BaseEntity implements ReceiveDetailAttributes {
    pkid!: number;
    receive_pkid!: number;
    item_pkid!: number;
    item_quantity!: number;
    item_accepted_quantity?: number;
    item_rejected_quantity?: number;
    expiry_date?: Date;
    notes?: string;

    static associate(models: any) {
      ReceiveDetail.belongsTo(models.Receive, {
        foreignKey: 'receive_pkid',
        as: 'receive',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      ReceiveDetail.belongsTo(models.Item, {
        foreignKey: 'item_pkid',
        as: 'item',
      });
    }
  }

  ReceiveDetail.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      receive_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'receives',
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
      modelName: 'ReceiveDetail',
      tableName: 'receive_details',
      timestamps: false,
    },
  );

  return ReceiveDetail;
};
