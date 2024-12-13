'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

const ReceiveStatus = [
  'on_going',
  'success',
  'cancel',
  'pending',
  'approved',
  'rejected',
];

const ReceiveType = ['production', 'purchase', 'sales', 'return'];

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('receives', {
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
      warehouse_pkid: {
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
      received_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...ReceiveStatus),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...ReceiveType),
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
      is_rejected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'receives');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'receives');

    await queryInterface.dropTable('receives');
  },
};
