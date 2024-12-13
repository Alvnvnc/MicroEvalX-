'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('item_categories', {
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
      coa_pkid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'item_categories');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'item_categories');

    await queryInterface.dropTable('item_categories');
  },
};
