import { BaseEntity } from '../interfaces/baseEntity.model';

export interface ItemCategoryAttributes extends BaseEntity {
  pkid: number;
  code: string;
  coa_pkid?: number;
  name: string;
  description?: string;
  status: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ItemCategory extends BaseEntity implements ItemCategoryAttributes {
    pkid!: number;
    code!: string;
    coa_pkid?: number;
    name!: string;
    description?: string;
    status!: boolean;

    static associate(models: any) {
      ItemCategory.hasMany(models.Item, {
        foreignKey: 'item_category_pkid',
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
      coa_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'ItemCategory',
      tableName: 'item_categories',
      timestamps: false,
    },
  );

  return ItemCategory;
};
