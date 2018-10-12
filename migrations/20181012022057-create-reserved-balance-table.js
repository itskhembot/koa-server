'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReservedBalance', {
      id: {
        type: Sequelize.Sequelize.STRING,
        primaryKey: true,
      },
      account: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      context: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isReleased: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint(
      'ReservedBalance',
      ['account', 'context'],
      {
        type: 'unique',
        name: 'account-context-reserved-constraint',
      }
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ReservedBalance');
  },
};
