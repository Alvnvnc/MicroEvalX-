'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('bom_headers', {
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
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'obsolete'),
        allowNull: false,
        defaultValue: 'active',
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
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
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'bom_headers');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'bom_headers');

    await queryInterface.dropTable('bom_headers');
  },
};
