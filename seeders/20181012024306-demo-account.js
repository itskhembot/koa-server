'use strict';

const R = require('ramda');
const uuid = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Account',[{
        id: `acc_01770e44-b3eb-4351-8a2f-8f1ed45097db`,
        balance: Math.random() * (500 - 5),
        availableBalance: Math.random() * (700 - 50),
      }],{}
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'Account',
      R.map(index => ({
        id: `acc_${uuid()}`,
        balance: Math.random() * (500 - 5) + index,
        availableBalance: Math.random() * (700 - 50) + index,
      }))(R.range(1, 5))
    );
  },

  down: async queryInterface => {
    return queryInterface.bulkDelete('Account', null, {});
  },
};
