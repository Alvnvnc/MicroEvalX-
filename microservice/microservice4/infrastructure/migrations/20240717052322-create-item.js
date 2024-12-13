'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('items', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
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
      },
      unit_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'units',
          key: 'pkid',
        },
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
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      selling_price: {
        type: DataTypes.DECIMAL(18, 2),
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
      }, // SKU for tracking item variations
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
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'items');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'items');

    await queryInterface.dropTable('items');
  },
};
