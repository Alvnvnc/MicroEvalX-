'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface) {
    const items = [
      {
        code: 'IEP00000001',
        name: 'Gula Merah',
        item_category_pkid: 1, // End Product
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 0,
        selling_price: 12000,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IMG00000001',
        name: 'Hasil Pemerahan Tebu',
        item_category_pkid: 3, // Intermediate Good
        unit_pkid: 6, // L
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 0,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IMG00000002',
        name: 'Hasil Penerimaan Tebu',
        item_category_pkid: 3, // Intermediate Good
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 0,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IMG00000003',
        name: 'Hasil Penguapan',
        item_category_pkid: 3, // Intermediate Good
        unit_pkid: 6, // L
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 0,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IMG00000004',
        name: 'Hasil Pemasakan',
        item_category_pkid: 3, // Intermediate Good
        unit_pkid: 6, // L
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 0,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IMG00000005',
        name: 'Hasil Pemurnian Tebu',
        item_category_pkid: 3, // Intermediate Good
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 0,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IRM00000001',
        name: 'Sodium Bicarbonate NaHCO3',
        item_category_pkid: 2, // Raw Material
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 7500,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IRM00000002',
        name: 'Flokulan',
        item_category_pkid: 2, // Raw Material
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 30000,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IRM00000003',
        name: 'Karung',
        item_category_pkid: 2, // Raw Material
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 3000,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IRM00000004',
        name: 'Tanaman Tebu',
        item_category_pkid: 2, // Raw Material
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 1000,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
      {
        code: 'IRM00000005',
        name: 'Kapur Tohor CaO',
        item_category_pkid: 2, // Raw Material
        unit_pkid: 1, // KG
        tax_pkid: 1, // PPN General
        currency_code: 'IDR',
        purchase_price: 2500,
        selling_price: 0,
        description: null,
        status: true,
        sku: null,
        barcode: null,
        weight: null,
        dimensions: null,
      },
    ];

    const itemRecords = items.map((item) => baseSeeder.createRecord(item));

    await queryInterface.bulkInsert('items', itemRecords, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('items', null, {});
  },
};
