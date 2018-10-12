'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Account', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      balance: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      availableBalance: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('Account');
  },
};
