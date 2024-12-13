import { BaseEntity } from '../interfaces/baseEntity.model';
import { UnitCategory } from '../../helpers/enum/unitCategory.enum';

export interface UnitAttributes extends BaseEntity {
  pkid: number;
  code: string;
  name: string;
  description?: string;
  symbol: string;
  conversion_factor?: number;
  base_unit: boolean;
  category: UnitCategory;
  status: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Unit extends BaseEntity implements UnitAttributes {
    pkid!: number;
    code!: string;
    name!: string;
    description?: string;
    symbol!: string;
    conversion_factor?: number;
    base_unit!: boolean;
    category!: UnitCategory;
    status!: boolean;

    static associate(models: any) {
      Unit.hasMany(models.Item, {
        foreignKey: 'unit_pkid',
        as: 'items',
      });
    }
  }

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
        allowNull: false,
      },
      conversion_factor: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
      base_unit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(UnitCategory)),
        allowNull: false,
        defaultValue: UnitCategory.OTHER,
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
      modelName: 'Unit',
      tableName: 'units',
      timestamps: false,
    },
  );

  return Unit;
};
