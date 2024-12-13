'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('delayed_productions', {
    //     pkid: {
    //         allowNull: false,
    //         autoIncrement: true,
    //         primaryKey: true,
    //         type: Sequelize.INTEGER
    //     },
    //     pdr_id: {
    //         type: Sequelize.STRING,
    //     },
    //     item_id: {
    //         type: Sequelize.STRING,
    //     },
    //     quantity: {
    //         type: Sequelize.FLOAT,
    //     },
    //     status: {
    //         type: Sequelize.ENUM('waiting', 'on production'),
    //         defaultValue: 'waiting',
    //     },
    //     createdAt: {
    //         allowNull: false,
    //         type: Sequelize.DATE,
    //     },
    //     updatedAt: {
    //         allowNull: false,
    //         type: Sequelize.DATE,
    //     },
    // });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('delayed_productions');
  },
};
