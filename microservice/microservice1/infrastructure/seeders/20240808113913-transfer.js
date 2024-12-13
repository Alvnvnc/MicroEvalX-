'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transfer = {
      code: 'TRF202408010001',
      from_warehouse_pkid: 1,
      to_warehouse_pkid: null,
      customer_pkid: 1, // customer_id from Sales Order
      reference_number: 'SO202407220001',
      transfer_date: new Date('2024-08-01'),
      status: 'pending',
      type: 'sales',
      total_quantity: 0,
      total_accepted_quantity: 0,
      total_rejected_quantity: 0,
      description: 'Transfer based on Sales Order SO202407220001',
    };

    const createdTransfer = baseSeeder.createRecord(transfer);

    // Insert transfer
    await queryInterface.bulkInsert('transfers', [createdTransfer], {});

    // Fetch the inserted transfer to get the pkid
    const insertedTransfer = await queryInterface.sequelize.query(
      `SELECT pkid FROM transfers WHERE code = 'TRF202408010001';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (insertedTransfer.length > 0) {
      const transferPkid = insertedTransfer[0].pkid;

      const transferDetails = [
        {
          transfer_pkid: transferPkid,
          item_pkid: 1,
          item_quantity: 12000,
          item_accepted_quantity: 12000,
          item_rejected_quantity: 0,
          expiry_date: null,
          notes: 'Transferred Gula Merah based on Sales Order SO202407220001',
        },
      ];

      const transferDetailRecords = transferDetails.map((detail) =>
        baseSeeder.createRecord(detail),
      );

      // Insert transfer details with the inserted transfer ID
      await queryInterface.bulkInsert(
        'transfer_details',
        transferDetailRecords,
        {},
      );
    }
  },

  async down(queryInterface) {
    const transfer = await queryInterface.sequelize.query(
      `SELECT pkid FROM transfers WHERE code = 'TRF202408010001';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (transfer.length > 0) {
      const transferPkid = transfer[0].pkid;

      await queryInterface.bulkDelete(
        'transfer_details',
        { transfer_pkid: transferPkid },
        {},
      );
      await queryInterface.bulkDelete('transfers', { pkid: transferPkid }, {});
    }
  },
};
