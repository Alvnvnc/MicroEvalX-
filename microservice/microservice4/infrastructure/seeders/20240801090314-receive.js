'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface, Sequelize) {
    const receive = {
      code: 'REC202407210001',
      warehouse_pkid: 1,
      supplier_pkid: 1, // supplier_id from Purchase Order
      reference_number: 'PO202407210001',
      received_date: new Date('2024-07-21'),
      status: 'pending',
      type: 'purchase',
      total_quantity: 0, //30001551
      total_accepted_quantity: 0,
      total_rejected_quantity: 0,
      is_rejected: false,
      description: 'Receive for order PO202407210001',
    };

    const createdReceive = baseSeeder.createRecord(receive);

    // Insert receive
    await queryInterface.bulkInsert('receives', [createdReceive], {});

    // Fetch the inserted receipt to get the pkid
    const insertedReceive = await queryInterface.sequelize.query(
      `SELECT pkid FROM receives WHERE code = 'REC202407210001';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (insertedReceive.length > 0) {
      const receivePkid = insertedReceive[0].pkid;

      const receiveDetails = [
        {
          receive_pkid: receivePkid,
          item_pkid: 7, // Item ID untuk Sodium Bicarbonate NaHCO3
          item_quantity: 1500,
          item_accepted_quantity: 1500,
          item_rejected_quantity: 0,
          expiry_date: null,
          notes: 'Received Sodium Bicarbonate NaHCO3',
        },
        {
          receive_pkid: receivePkid,
          item_pkid: 8, // Item ID untuk Flokulan Gula Merah
          item_quantity: 1,
          item_accepted_quantity: 1,
          item_rejected_quantity: 0,
          expiry_date: null,
          notes: 'Received Flokulan Gula Merah',
        },
        {
          receive_pkid: receivePkid,
          item_pkid: 9, // Item ID untuk Karung
          item_quantity: 10000,
          item_accepted_quantity: 10000,
          item_rejected_quantity: 0,
          expiry_date: null,
          notes: 'Received Karung',
        },
        {
          receive_pkid: receivePkid,
          item_pkid: 10, // Item ID untuk Tanaman Tebu
          item_quantity: 3000000,
          item_accepted_quantity: 3000000,
          item_rejected_quantity: 0,
          expiry_date: null,
          notes: 'Received Tanaman Tebu',
        },
        {
          receive_pkid: receivePkid,
          item_pkid: 11, // Item ID untuk Kapur Tohor CaO
          item_quantity: 50,
          item_accepted_quantity: 50,
          item_rejected_quantity: 0,
          expiry_date: null,
          notes: 'Received Kapur Tohor CaO',
        },
      ];

      const receiveDetailRecords = receiveDetails.map((detail) =>
        baseSeeder.createRecord(detail),
      );

      // Insert receive details with the inserted reception ID
      await queryInterface.bulkInsert(
        'receive_details',
        receiveDetailRecords,
        {},
      );
    }
  },

  async down(queryInterface) {
    const receive = await queryInterface.sequelize.query(
      `SELECT pkid FROM receives WHERE code = 'REC202407210001';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (receive.length > 0) {
      const receivePkid = receive[0].pkid;

      await queryInterface.bulkDelete(
        'receive_details',
        { receive_pkid: receivePkid },
        {},
      );
      await queryInterface.bulkDelete('receives', { pkid: receivePkid }, {});
    }
  },
};
