'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('receive_details', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      receive_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'receives',
          key: 'pkid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      item_pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'items',
          key: 'pkid',
        },
      },
      item_quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
      },
      item_accepted_quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: true,
      },
      item_rejected_quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: true,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'receive_details');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'receive_details');

    await queryInterface.dropTable('receive_details');
  },
};
