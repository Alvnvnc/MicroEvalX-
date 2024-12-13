'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

const TransferStatus = [
  'on_going',
  'success',
  'cancel',
  'pending',
  'approved',
  'rejected',
];

const TransferType = ['production', 'purchase', 'sales', 'return'];

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('transfers', {
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
      from_warehouse_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'pkid',
        },
      },
      to_warehouse_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'pkid',
        },
      },
      supplier_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      customer_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transfer_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...TransferStatus),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...TransferType),
        allowNull: false,
      },
      total_quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
      },
      total_accepted_quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: true,
      },
      total_rejected_quantity: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'transfers');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'transfers');

    await queryInterface.dropTable('transfers');
  },
};
