'use strict';

const baseSeeder = require('../interfaces/baseSeeder');

module.exports = {
  async up(queryInterface, Sequelize) {
    const generateBomCode = async () => {
      const datePrefix = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
      const latestBom = await queryInterface.sequelize.query(
        `SELECT code FROM bom_headers WHERE code LIKE 'BOM${datePrefix}%' ORDER BY code DESC LIMIT 1;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      let nextNumber = 1;
      if (latestBom.length > 0) {
        const lastCode = latestBom[0].code;
        const lastNumber = parseInt(lastCode.slice(-3), 10);
        nextNumber = lastNumber + 1;
      }

      return `BOM${datePrefix}${nextNumber.toString().padStart(3, '0')}`;
    };

    const bomCode = await generateBomCode();

    // Create BOM Parent for Gula Merah
    const bomParent = {
      code: bomCode, // Use generated BOM code
      item_header_pkid: 1, // Gula Merah PKID
      production_quantity: 12000, // 12000 kg
      description: 'BOM for Gula Merah production',
      status: 'active',
      effective_date: new Date('2024-08-12'),
      expiration_date: null,
      total_cost: 0, // Initialize total cost, to be calculated later
    };

    const createdBomParent = baseSeeder.createRecord(bomParent);

    // Insert BOM Parent
    await queryInterface.bulkInsert('bom_headers', [createdBomParent], {});

    // Fetch the inserted BOM to get the pkid
    const insertedBomParent = await queryInterface.sequelize.query(
      `SELECT pkid FROM bom_headers WHERE code = '${bomCode}';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (insertedBomParent.length > 0) {
      const bomParentPkid = insertedBomParent[0].pkid;

      // BOM Children Details
      const bomChildren = [
        {
          bom_header_pkid: bomParentPkid,
          item_detail_pkid: 10, // Tanaman Tebu PKID
          quantity: 100000, // 100000 kg
          wastage_percentage: 0, // No wastage
          cost: 100000 * 1000, // Quantity * Purchase Price (assuming 1000 IDR/kg)
          notes: 'Main raw material for Gula Merah',
          level: 1, // Level 1 for direct child of the parent
        },
        {
          bom_header_pkid: bomParentPkid,
          item_detail_pkid: 11, // Kapur Tohor CaO PKID
          quantity: 1, // 1 kg
          wastage_percentage: 0, // No wastage
          cost: 1 * 2500, // Quantity * Purchase Price (assuming 2500 IDR/kg)
          notes: 'Used in the purification process',
          level: 1, // Level 1 for direct child of the parent
        },
        {
          bom_header_pkid: bomParentPkid,
          item_detail_pkid: 8, // Flokulan PKID
          quantity: 0.007, // 0.007 kg
          wastage_percentage: 0, // No wastage
          cost: 0.007 * 30000, // Quantity * Purchase Price (assuming 30000 IDR/kg)
          notes: 'Used in the coagulation process',
          level: 1, // Level 1 for direct child of the parent
        },
        {
          bom_header_pkid: bomParentPkid,
          item_detail_pkid: 7, // Sodium Bicarbonate NaHCO3 PKID
          quantity: 50, // 50 kg
          wastage_percentage: 0, // No wastage
          cost: 50 * 7500, // Quantity * Purchase Price (assuming 7500 IDR/kg)
          notes: 'Used in the refining process',
          level: 1, // Level 1 for direct child of the parent
        },
        {
          bom_header_pkid: bomParentPkid,
          item_detail_pkid: 9, // Karung PKID
          quantity: 240, // 240 pcs
          wastage_percentage: 0, // No wastage
          cost: 240 * 3000, // Quantity * Purchase Price (assuming 3000 IDR/pcs)
          notes: 'Packaging material for Gula Merah',
          level: 1, // Level 1 for direct child of the parent
        },
      ];

      const totalCost = bomChildren.reduce(
        (sum, detail) => sum + detail.cost,
        0,
      );
      bomParent.total_cost = totalCost; // Calculate and update total cost

      // Update BOM Parent with total cost
      await queryInterface.bulkUpdate(
        'bom_headers',
        { total_cost: totalCost },
        { pkid: bomParentPkid },
      );

      const bomChildrenRecords = bomChildren.map((detail) =>
        baseSeeder.createRecord(detail),
      );

      // Insert BOM Children
      await queryInterface.bulkInsert('bom_details', bomChildrenRecords, {});
    }
  },

  async down(queryInterface) {
    const bom = await queryInterface.sequelize.query(
      `SELECT pkid FROM bom_headers WHERE code LIKE 'BOM%' ORDER BY created_at DESC LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (bom.length > 0) {
      const bomParentPkid = bom[0].pkid;

      await queryInterface.bulkDelete(
        'bom_details',
        { bom_header_pkid: bomParentPkid },
        {},
      );
      await queryInterface.bulkDelete(
        'bom_headers',
        { pkid: bomParentPkid },
        {},
      );
    }
  },
};
