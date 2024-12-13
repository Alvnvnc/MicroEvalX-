'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const warehouses = [
      {
        code: 'WH00001',
        name: 'Gudang 1',
        address: 'Jalan Raya Malang No. 1',
        city: 'Malang',
        state: 'Jawa Timur',
        country: 'Indonesia',
        postal_code: '65123',
        contact_number: '0341-123456',
        status: true,
      },
    ];

    const warehouseRecords = warehouses.map((warehouse) =>
      baseSeeder.createRecord(warehouse),
    );

    await queryInterface.bulkInsert('warehouses', warehouseRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('warehouses', null, {});
  },
};
