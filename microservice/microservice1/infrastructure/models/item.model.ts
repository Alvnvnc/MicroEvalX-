import { BaseEntity } from '../interfaces/baseEntity.model';

export interface ItemAttributes extends BaseEntity {
  pkid: number;
  code: string;
  item_category_pkid: number;
  unit_pkid: number;
  tax_pkid?: number;
  currency_code: string;
  name: string;
  purchase_price?: number;
  selling_price?: number;
  description?: string;
  status: boolean;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Item extends BaseEntity implements ItemAttributes {
    pkid!: number;
    code!: string;
    item_category_pkid!: number;
    unit_pkid!: number;
    tax_pkid?: number;
    currency_code!: string;
    name!: string;
    purchase_price?: number;
    selling_price?: number;
    description?: string;
    status!: boolean;
    sku?: string;
    barcode?: string;
    weight?: number;
    dimensions?: number;

    static associate(models: any) {
      // Define associations here
      Item.belongsTo(models.ItemCategory, {
        foreignKey: 'item_category_pkid',
        as: 'itemCategory',
      });
      Item.belongsTo(models.Unit, {
        foreignKey: 'unit_pkid',
        as: 'unit',
      });

      Item.hasMany(models.ItemWarehouse, {
        foreignKey: 'item_pkid',
        as: 'itemWarehouses',
      });
      Item.hasMany(models.ReceiveDetail, {
        foreignKey: 'item_pkid',
        as: 'receiveDetails',
      });
      Item.hasMany(models.TransferDetail, {
        foreignKey: 'item_pkid',
        as: 'transferDetails',
      });
      Item.hasMany(models.BomHeader, {
        foreignKey: 'item_header_pkid',
        as: 'bomHeaders',
      });
      Item.hasMany(models.BomDetail, {
        foreignKey: 'item_detail_pkid',
        as: 'bomDetails',
      });
      Item.hasMany(models.DelayedProduction, {
        foreignKey: 'item_pkid',
        as: 'delayedProductions',
      });
    }
  }

  Item.init(
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
      item_category_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'item_categories',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      unit_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'units',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tax_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      currency_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      purchase_price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      selling_price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      weight: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
      dimensions: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'items',
      timestamps: false,
    },
  );

  return Item;
};
