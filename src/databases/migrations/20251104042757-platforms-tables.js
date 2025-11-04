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
    await queryInterface.createTable('platforms', { 
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
      name: Sequelize.STRING(80),
      description: Sequelize.TEXT,
      token: Sequelize.STRING(200),
      accessKey: Sequelize.STRING(200),
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
    await queryInterface.addIndex('platforms', ['name'], {
      name: 'idx_platforms_name'
    });

    await queryInterface.addIndex('platforms', ['token'], {
      name: 'idx_platforms_token'
    });

    await queryInterface.addIndex('platforms', ['accessKey'], {
      name: 'idx_platforms_access_key'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('platforms');
  }
};
