import { BaseEntity } from '../interfaces/baseEntity.model';

export interface BomDetailAttributes extends BaseEntity {
  pkid: number;
  bom_header_pkid: number;
  item_detail_pkid: number;
  quantity: number;
  wastage_percentage?: number;
  cost?: number;
  level: number;
  notes?: string;
  parent_bom_detail_pkid?: number;
  unique_parent?: number;
  item_code?: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class BomDetail extends BaseEntity implements BomDetailAttributes {
    pkid!: number;
    bom_header_pkid!: number;
    item_detail_pkid!: number;
    quantity!: number;
    wastage_percentage?: number;
    cost?: number;
    level!: number;
    notes?: string;
    parent_bom_detail_pkid?: number;
    unique_parent?: number;
    item_code?: string;

    static associate(models: any) {
      BomDetail.belongsTo(models.BomHeader, {
        foreignKey: 'bom_header_pkid',
        as: 'bomHeader',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      BomDetail.belongsTo(models.Item, {
        foreignKey: 'item_detail_pkid',
        as: 'itemDetail',
      });
      BomDetail.hasMany(models.BomDetail, {
        foreignKey: 'parent_bom_detail_pkid',
        as: 'childBomDetails',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      BomDetail.belongsTo(models.BomDetail, {
        foreignKey: 'parent_bom_detail_pkid',
        as: 'parentBomDetail',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  BomDetail.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      bom_header_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'bom_headers',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      parent_bom_detail_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'bom_details',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      item_detail_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'items',
          key: 'pkid',
        },
      },
      quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
      },
      wastage_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      cost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
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
      modelName: 'BomDetail',
      tableName: 'bom_details',
      timestamps: false,
    },
  );

  return BomDetail;
};
