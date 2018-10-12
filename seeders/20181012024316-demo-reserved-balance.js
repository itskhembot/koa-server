'use strict';

const R = require('ramda');
const uuid = require('uuid');
const casual = require('casual');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'ReservedBalance',[{
        id: `res_739c71b0-8e5e-465c-b754-0191acbb8caf`,
        account: `acc_01770e44-b3eb-4351-8a2f-8f1ed45097db`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5),
      }],{}
    );

    await queryInterface.bulkInsert(
      'ReservedBalance',
      R.map(index => ({
        id: `res_${uuid()}`,
        account: `acc_e3e7f84b-0daa-4014-b67a-627b7f6f6b59`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'ReservedBalance',
      R.map(index => ({
        id: `res_${uuid()}`,
        account: `acc_01770e44-b3eb-4351-8a2f-8f1ed45097db`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'ReservedBalance',
      R.map(index => ({
        id: `res_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'ReservedBalance',
      R.map(index => ({
        id: `res_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'ReservedBalance',
      R.map(index => ({
        id: `res_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'ReservedBalance',
      R.map(index => ({
        id: `res_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );
  },

  down: async queryInterface => {
    return queryInterface.bulkDelete('ReservedBalance', null, {});
  },
};
