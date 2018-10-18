'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VirtualBalance', {
      id: {
        type: Sequelize.Sequelize.STRING,
        primaryKey: true,
      },
      account: {
        type: Sequelize.STRING,
        allowNull: false,
        references: 'Account',
        referencesKey: 'id',
      },
      context: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      isCommit: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });
    await queryInterface.addConstraint(
      'VirtualBalance',
      ['account', 'context'],
      {
        type: 'unique',
        name: 'account-context-virtual-constraint',
      }
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable('VirtualBalance');
  },
};
