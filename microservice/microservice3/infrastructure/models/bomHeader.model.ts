import { BaseEntity } from '../interfaces/baseEntity.model';
import { BomStatus } from '../../helpers/enum/bomStatus.enum';
import { BomDetailAttributes } from './bomDetail.model';

export interface BomHeaderAttributes extends BaseEntity {
  pkid: number;
  code: string;
  item_header_pkid: number;
  production_quantity: number;
  total_cost?: number;
  description?: string;
  status: BomStatus;
  effective_date?: Date;
  expiration_date?: Date;
  unique_parent?: number;
  item_code?: string;
}

export interface BomHeaderWithDetailsAttributes extends BomHeaderAttributes {
  bomDetails?: BomDetailAttributes[];
}

module.exports = (sequelize: any, DataTypes: any) => {
  class BomHeader extends BaseEntity implements BomHeaderAttributes {
    pkid!: number;
    code!: string;
    item_header_pkid!: number;
    production_quantity!: number;
    total_cost?: number;
    description?: string;
    status!: BomStatus;
    effective_date?: Date;
    expiration_date?: Date;
    unique_parent?: number;
    item_code?: string;

    static associate(models: any) {
      BomHeader.belongsTo(models.Item, {
        foreignKey: 'item_header_pkid',
        as: 'itemHeader',
      });
      BomHeader.hasMany(models.BomDetail, {
        foreignKey: 'bom_header_pkid',
        as: 'bomDetails',
      });
    }
  }

  BomHeader.init(
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
      item_header_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'items',
          key: 'pkid',
        },
      },
      production_quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
      },
      total_cost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(BomStatus)),
        allowNull: false,
        defaultValue: BomStatus.ACTIVE,
      },
      effective_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      unique_parent: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      item_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'BomHeader',
      tableName: 'bom_headers',
      timestamps: false,
    },
  );

  return BomHeader;
};
