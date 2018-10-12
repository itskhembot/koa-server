'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Request', {
      id: {
        type: Sequelize.Sequelize.STRING,
        primaryKey: true,
        autoIncrement: false,
      },
      result: Sequelize.Sequelize.JSON,
      error: Sequelize.Sequelize.JSON,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('Request');
  },
};
