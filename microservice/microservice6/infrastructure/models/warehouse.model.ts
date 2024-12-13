import { BaseEntity } from '../interfaces/baseEntity.model';

export interface WarehouseAttributes extends BaseEntity {
  pkid: number;
  code: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_number?: string;
  status: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Warehouse extends BaseEntity implements WarehouseAttributes {
    pkid!: number;
    code!: string;
    name!: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    contact_number?: string;
    status!: boolean;

    static associate(models: any) {
      Warehouse.hasMany(models.ItemWarehouse, {
        foreignKey: 'warehouse_pkid',
        as: 'itemWarehouses',
      });

      Warehouse.hasMany(models.Receive, {
        foreignKey: 'warehouse_pkid',
        as: 'receives',
      });

      Warehouse.hasMany(models.Transfer, {
        foreignKey: 'from_warehouse_pkid',
        as: 'transfersFrom',
      });

      Warehouse.hasMany(models.Transfer, {
        foreignKey: 'to_warehouse_pkid',
        as: 'transfersTo',
      });
    }
  }

  Warehouse.init(
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
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_number: {
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
      modelName: 'Warehouse',
      tableName: 'warehouses',
      timestamps: false,
    },
  );

  return Warehouse;
};
