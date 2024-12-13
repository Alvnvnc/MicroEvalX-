'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const itemCategories = [
      {
        code: 'IEP',
        name: 'End Product',
        description: 'Finished goods ready for sale',
        status: true,
        coa_pkid: 261, // CoA ID for End Product
      },
      {
        code: 'IRM',
        name: 'Raw Material',
        description: 'Basic materials used in production',
        status: true,
        coa_pkid: 262, // CoA ID for Raw Material
      },
      {
        code: 'IMG',
        name: 'Intermediate Good',
        description:
          'Products that are processed further to make final products',
        status: true,
        coa_pkid: 263, // CoA ID for Intermediate Good
      },
      {
        code: 'IMD',
        name: 'Merchandise',
        description: 'Goods bought for resale',
        status: true,
        coa_pkid: 264, // CoA ID for Merchandise
      },
      {
        code: 'IOS',
        name: 'Operational Supplies',
        description: 'Items used in the daily operations',
        status: true,
        coa_pkid: 265, // CoA ID for Operational Supplies
      },
      {
        code: 'ISP',
        name: 'Spare Parts',
        description:
          'Parts kept in inventory for maintenance and repair of equipment',
        status: true,
        coa_pkid: 266, // CoA ID for Spare Parts
      },
      {
        code: 'ICO',
        name: 'Consumables',
        description: 'Items used up during the production process',
        status: true,
        coa_pkid: 267, // CoA ID for Consumables
      },
    ];

    const itemCategoryRecords = itemCategories.map((category) =>
      baseSeeder.createRecord(category),
    );

    await queryInterface.bulkInsert('item_categories', itemCategoryRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('item_categories', null, {});
  },
};
