'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

const ProductionStatus = [
  'waiting',
  'on_production',
  'completed',
  'canceled',
  'delayed',
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('delayed_production', {
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
      production_request_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      item_pkid: {
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
      status: {
        type: DataTypes.ENUM(...ProductionStatus),
        allowNull: false,
        defaultValue: 'waiting',
      },
      delayed_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estimated_completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actual_completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'delayed_production');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(
      queryInterface,
      'delayed_production',
    );

    await queryInterface.dropTable('delayed_production');
  },
};
