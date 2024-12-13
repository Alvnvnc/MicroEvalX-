'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const itemWarehouses = [
      {
        item_pkid: 1,
        warehouse_pkid: 1,
        quantity: 0,
        reorder_level: null,
        reorder_quantity: null,
        last_restocked: null,
        expiry_date: null,
      },
      {
        item_pkid: 7,
        warehouse_pkid: 1,
        quantity: 1450,
        reorder_level: null,
        reorder_quantity: null,
        last_restocked: null,
        expiry_date: null,
      },
      {
        item_pkid: 8,
        warehouse_pkid: 1,
        quantity: 0.993,
        reorder_level: null,
        reorder_quantity: null,
        last_restocked: null,
        expiry_date: null,
      },
      {
        item_pkid: 9,
        warehouse_pkid: 1,
        quantity: 9760,
        reorder_level: null,
        reorder_quantity: null,
        last_restocked: null,
        expiry_date: null,
      },
      {
        item_pkid: 10,
        warehouse_pkid: 1,
        quantity: 2900000,
        reorder_level: null,
        reorder_quantity: null,
        last_restocked: null,
        expiry_date: null,
      },
      {
        item_pkid: 11,
        warehouse_pkid: 1,
        quantity: 49,
        reorder_level: null,
        reorder_quantity: null,
        last_restocked: null,
        expiry_date: null,
      },
    ];

    const itemWarehouseRecords = itemWarehouses.map((itemWarehouse) =>
      baseSeeder.createRecord(itemWarehouse),
    );

    await queryInterface.bulkInsert('item_warehouse', itemWarehouseRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('item_warehouse', null, {});
  },
};
