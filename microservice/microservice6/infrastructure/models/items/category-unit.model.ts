
// infrastructure/models/items/category-unit.model.ts
import { BaseEntity } from '../../interfaces/baseEntity.model';

export interface ItemCategoryAttributes extends BaseEntity {
  pkid: number;
  code: string;
  name: string;
  description?: string;
  coa_pkid?: number;
}

export interface UnitAttributes extends BaseEntity {
  pkid: number;
  code: string;
  name: string;
  description?: string;
  symbol?: string;
  conversion_factor?: number;
  base_unit?: string;
  category: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ItemCategory extends BaseEntity implements ItemCategoryAttributes {
    pkid!: number;
    code!: string;
    name!: string;
    description?: string;
    coa_pkid?: number;

    static associate(models: any) {
      ItemCategory.hasMany(models.BasicItem, {
        foreignKey: 'item_category_pkid',
        as: 'items',
      });
    }
  }

  class Unit extends BaseEntity implements UnitAttributes {
    pkid!: number;
    code!: string;
    name!: string;
    description?: string;
    symbol?: string;
    conversion_factor?: number;
    base_unit?: string;
    category!: string;

    static associate(models: any) {
      Unit.hasMany(models.BasicItem, {
        foreignKey: 'unit_pkid',
        as: 'items',
      });
    }
  }

  ItemCategory.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coa_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'ItemCategory',
      tableName: 'item_categories',
      timestamps: false,
    },
  );

  Unit.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      conversion_factor: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
      base_unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Unit',
      tableName: 'units',
      timestamps: false,
    },
  );

  return { ItemCategory, Unit };
};