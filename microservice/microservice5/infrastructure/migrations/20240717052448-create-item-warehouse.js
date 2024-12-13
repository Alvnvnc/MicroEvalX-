'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('item_warehouse', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      item_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'items',
          key: 'pkid',
        },
      },
      warehouse_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'pkid',
        },
      },
      quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
        defaultValue: 0,
      },
      reorder_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // Reorder level is the inventory threshold at which a new order should be placed.
        // Example: If reorder_level is set to 20, when the quantity falls to 20 or below,
        // it triggers a reorder to ensure the stock does not run out.
        // This helps to prevent stockouts and ensures continuous availability of items.
      },
      reorder_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // Reorder quantity is the amount of stock to be ordered once the reorder level is reached.
        // Example: If reorder_quantity is set to 50, once the reorder level of 20 is hit,
        // an order for 50 units will be placed to replenish the stock.
        // This ensures that the inventory is replenished by a consistent and sufficient amount.
      },
      last_restocked: {
        type: DataTypes.DATE,
        allowNull: true,
        // The date when the item was last restocked.
        // Helps in tracking inventory restocking patterns and managing inventory cycles.
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'item_warehouse');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'item_warehouse');

    await queryInterface.dropTable('item_warehouse');
  },
};
