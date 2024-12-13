'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

const UnitCategories = [
  'Weight',
  'Volume',
  'Length',
  'Area',
  'Temperature',
  'Time',
  'Mass',
  'Pressure',
  'Energy',
  'Speed',
  'Angle',
  'Other',
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('units', {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      conversion_factor: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
        comment: 'Conversion factor to base unit',
      },
      base_unit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indicates if this unit is the base unit for conversion',
      },
      category: {
        type: DataTypes.ENUM(...UnitCategories),
        allowNull: false,
        defaultValue: 'Other',
        comment: 'Category of the unit, e.g., Weight, Volume, Length',
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'units');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'units');

    await queryInterface.dropTable('units');
  },
};
