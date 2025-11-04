'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('auditrails', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      action: {
       type: Sequelize.STRING(250),
       allowNull: false
      },
      header: Sequelize.JSON,
      body: Sequelize.JSON,
      ipAddress: Sequelize.STRING(100),
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    // Add indexes for better query performance
    await queryInterface.addIndex('auditrails', ['action'], {
      name: 'idx_auditrails_action'
    });

    await queryInterface.addIndex('auditrails', ['ipAddress'], {
      name: 'idx_auditrails_ipAddress'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('auditrails');
  }
};
