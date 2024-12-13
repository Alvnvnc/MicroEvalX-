'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const units = [
      //region Weight
      {
        code: 'KG',
        name: 'Kilogram',
        description: 'Unit of mass',
        symbol: 'kg',
        conversion_factor: 1,
        base_unit: true,
        category: 'Weight',
        status: true,
      },
      {
        code: 'G',
        name: 'Gram',
        description: 'Unit of mass',
        symbol: 'g',
        conversion_factor: 1000,
        base_unit: false,
        category: 'Weight',
        status: true,
      },
      {
        code: 'TON',
        name: 'Ton',
        description: 'Unit of mass',
        symbol: 'ton',
        conversion_factor: 0.001,
        base_unit: false,
        category: 'Weight',
        status: true,
      },
      {
        code: 'Q',
        name: 'Quintal',
        description: 'Unit of mass',
        symbol: 'q',
        conversion_factor: 0.01,
        base_unit: false,
        category: 'Weight',
        status: true,
      },
      {
        code: 'LB',
        name: 'Pound',
        description: 'Unit of mass',
        symbol: 'lb',
        conversion_factor: 2.20462,
        base_unit: false,
        category: 'Weight',
        status: true,
      },
      //endregion

      //region Volume
      {
        code: 'L',
        name: 'Liter',
        description: 'Unit of volume',
        symbol: 'L',
        conversion_factor: 1,
        base_unit: true,
        category: 'Volume',
        status: true,
      },
      {
        code: 'ML',
        name: 'Milliliter',
        description: 'Unit of volume',
        symbol: 'mL',
        conversion_factor: 1000,
        base_unit: false,
        category: 'Volume',
        status: true,
      },
      {
        code: 'GAL',
        name: 'Gallon',
        description: 'Unit of volume',
        symbol: 'gal',
        conversion_factor: 0.264172,
        base_unit: false,
        category: 'Volume',
        status: true,
      },
      {
        code: 'CUBM',
        name: 'Cubic Meter',
        description: 'Unit of volume',
        symbol: 'm³',
        conversion_factor: 0.001,
        base_unit: false,
        category: 'Volume',
        status: true,
      },
      //endregion

      //region Length
      {
        code: 'M',
        name: 'Meter',
        description: 'Unit of length',
        symbol: 'm',
        conversion_factor: 1,
        base_unit: true,
        category: 'Length',
        status: true,
      },
      {
        code: 'CM',
        name: 'Centimeter',
        description: 'Unit of length',
        symbol: 'cm',
        conversion_factor: 100,
        base_unit: false,
        category: 'Length',
        status: true,
      },
      {
        code: 'MM',
        name: 'Millimeter',
        description: 'Unit of length',
        symbol: 'mm',
        conversion_factor: 1000,
        base_unit: false,
        category: 'Length',
        status: true,
      },
      {
        code: 'KM',
        name: 'Kilometer',
        description: 'Unit of length',
        symbol: 'km',
        conversion_factor: 0.001,
        base_unit: false,
        category: 'Length',
        status: true,
      },
      {
        code: 'IN',
        name: 'Inch',
        description: 'Unit of length',
        symbol: 'in',
        conversion_factor: 39.3701,
        base_unit: false,
        category: 'Length',
        status: true,
      },
      {
        code: 'FT',
        name: 'Foot',
        description: 'Unit of length',
        symbol: 'ft',
        conversion_factor: 3.28084,
        base_unit: false,
        category: 'Length',
        status: true,
      },
      //endregion

      //region Time
      {
        code: 'HR',
        name: 'Hour',
        description: 'Unit of time',
        symbol: 'hr',
        conversion_factor: 1,
        base_unit: true,
        category: 'Time',
        status: true,
      },
      {
        code: 'MIN',
        name: 'Minute',
        description: 'Unit of time',
        symbol: 'min',
        conversion_factor: 60,
        base_unit: false,
        category: 'Time',
        status: true,
      },
      {
        code: 'SEC',
        name: 'Second',
        description: 'Unit of time',
        symbol: 'sec',
        conversion_factor: 3600,
        base_unit: false,
        category: 'Time',
        status: true,
      },
      {
        code: 'DAY',
        name: 'Day',
        description: 'Unit of time',
        symbol: 'd',
        conversion_factor: 0.04167,
        base_unit: false,
        category: 'Time',
        status: true,
      },
      {
        code: 'MONTH',
        name: 'Month',
        description: 'Unit of time',
        symbol: 'mo',
        conversion_factor: 0.00137,
        base_unit: false,
        category: 'Time',
        status: true,
      },
      //endregion

      //region Area
      {
        code: 'SQM',
        name: 'Square Meter',
        description: 'Unit of area',
        symbol: 'm²',
        conversion_factor: 1,
        base_unit: true,
        category: 'Area',
        status: true,
      },
      {
        code: 'SQCM',
        name: 'Square Centimeter',
        description: 'Unit of area',
        symbol: 'cm²',
        conversion_factor: 10000,
        base_unit: false,
        category: 'Area',
        status: true,
      },
      {
        code: 'SQFT',
        name: 'Square Foot',
        description: 'Unit of area',
        symbol: 'ft²',
        conversion_factor: 10.7639,
        base_unit: false,
        category: 'Area',
        status: true,
      },
      {
        code: 'SQIN',
        name: 'Square Inch',
        description: 'Unit of area',
        symbol: 'in²',
        conversion_factor: 1550,
        base_unit: false,
        category: 'Area',
        status: true,
      },
      //endregion

      //region Angle
      {
        code: 'DEG',
        name: 'Degree',
        description: 'Unit of angle',
        symbol: '°',
        conversion_factor: 1,
        base_unit: true,
        category: 'Angle',
        status: true,
      },
      {
        code: 'RAD',
        name: 'Radian',
        description: 'Unit of angle',
        symbol: 'rad',
        conversion_factor: 57.2958,
        base_unit: false,
        category: 'Angle',
        status: true,
      },
      //endregion

      //region Energy
      {
        code: 'W',
        name: 'Watt',
        description: 'Unit of power',
        symbol: 'W',
        conversion_factor: 1,
        base_unit: true,
        category: 'Energy',
        status: true,
      },
      {
        code: 'KW',
        name: 'Kilowatt',
        description: 'Unit of power',
        symbol: 'kW',
        conversion_factor: 0.001,
        base_unit: false,
        category: 'Energy',
        status: true,
      },
      //endregion

      //region Pressure
      {
        code: 'BAR',
        name: 'Bar',
        description: 'Unit of pressure',
        symbol: 'bar',
        conversion_factor: 1,
        base_unit: true,
        category: 'Pressure',
        status: true,
      },
      {
        code: 'PSI',
        name: 'Pounds per Square Inch',
        description: 'Unit of pressure',
        symbol: 'psi',
        conversion_factor: 14.5038,
        base_unit: false,
        category: 'Pressure',
        status: true,
      },
      //endregion

      //region Temperature
      {
        code: 'C',
        name: 'Celsius',
        description: 'Unit of temperature',
        symbol: '°C',
        conversion_factor: 1,
        base_unit: true,
        category: 'Temperature',
        status: true,
      },
      {
        code: 'F',
        name: 'Fahrenheit',
        description: 'Unit of temperature',
        symbol: '°F',
        conversion_factor: 33.8,
        base_unit: false,
        category: 'Temperature',
        status: true,
      },
      {
        code: 'K',
        name: 'Kelvin',
        description: 'Unit of temperature',
        symbol: 'K',
        conversion_factor: 274.15,
        base_unit: false,
        category: 'Temperature',
        status: true,
      },
      //endregion

      //region Miscellaneous
      {
        code: 'PCS',
        name: 'Piece',
        description: 'Unit of quantity',
        symbol: 'pcs',
        conversion_factor: 1,
        base_unit: true,
        category: 'Other',
        status: true,
      },
      {
        code: 'UNIT',
        name: 'unit',
        description: 'Unit of quantity',
        symbol: 'buah',
        conversion_factor: 1,
        base_unit: false,
        category: 'Other',
        status: true,
      },
      {
        code: 'BOX',
        name: 'Box',
        description: 'Unit of quantity',
        symbol: 'box',
        conversion_factor: 1,
        base_unit: false,
        category: 'Other',
        status: true,
      },
      //endregion
    ];

    const unitRecords = units.map((unit) => baseSeeder.createRecord(unit));

    await queryInterface.bulkInsert('units', unitRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('units', null, {});
  },
};
