'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('bom_details', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
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
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'bom_details');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'bom_details');

    await queryInterface.dropTable('bom_details');
  },
};
