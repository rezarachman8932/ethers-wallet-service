'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Platforms', [
      {
        uuid: uuidv4(),
        id: 1,
        name: 'KC Wallet Service',
        description: 'Primary platform for wallet service operations',
        token: '78943722374234-token-example',
        accessKey: '2783612736123-access-key-example'
      },
      {
        uuid: uuidv4(),
        id: 2,
        name: 'KC Wallet Service 2',
        description: 'Primary platform for wallet service operations 2',
        token: '78943722374212-token-example',
        accessKey: '2783612733523-access-key-example'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Platforms', null, {});
  }
};