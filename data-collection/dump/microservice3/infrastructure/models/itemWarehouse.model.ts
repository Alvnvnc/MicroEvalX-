import { BaseEntity } from '../interfaces/baseEntity.model';

export interface ItemWarehouseAttributes extends BaseEntity {
  pkid: number;
  item_pkid: number;
  warehouse_pkid: number;
  quantity: number;
  reorder_level?: number;
  reorder_quantity?: number;
  last_restocked?: Date;
  expiry_date?: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ItemWarehouse extends BaseEntity implements ItemWarehouseAttributes {
    pkid!: number;
    item_pkid!: number;
    warehouse_pkid!: number;
    quantity!: number;
    reorder_level?: number;
    reorder_quantity?: number;
    last_restocked?: Date;
    expiry_date?: Date;

    static associate(models: any) {
      // Define associations here
      ItemWarehouse.belongsTo(models.Item, {
        foreignKey: 'item_pkid',
        as: 'item',
      });
      ItemWarehouse.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_pkid',
        as: 'warehouse',
      });
    }
  }

  ItemWarehouse.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      item_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'items',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      warehouse_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      reorder_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reorder_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_restocked: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'ItemWarehouse',
      tableName: 'item_warehouse',
      timestamps: false,
    },
  );

  return ItemWarehouse;
};
