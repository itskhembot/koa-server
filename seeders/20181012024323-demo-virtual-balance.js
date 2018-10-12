'use strict';

const R = require('ramda');
const uuid = require('uuid');
const casual = require('casual');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'VirtualBalance',[{
        id: `vir_f8aa0564-47ac-4255-b08d-7fef0629c17f`,
        account: `acc_01770e44-b3eb-4351-8a2f-8f1ed45097db`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5),
      }],{}
    );

    await queryInterface.bulkInsert(
      'VirtualBalance',
      R.map(index => ({
        id: `vir_${uuid()}`,
        account: `acc_cd4b772c-0b48-4dea-82e2-c0494f0f7f06`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'VirtualBalance',
      R.map(index => ({
        id: `vir_${uuid()}`,
        account: `acc_01770e44-b3eb-4351-8a2f-8f1ed45097db`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'VirtualBalance',
      R.map(index => ({
        id: `vir_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'VirtualBalance',
      R.map(index => ({
        id: `vir_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'VirtualBalance',
      R.map(index => ({
        id: `vir_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );

    await queryInterface.bulkInsert(
      'VirtualBalance',
      R.map(index => ({
        id: `vir_${uuid()}`,
        account: `acc_${uuid()}`,
        context: casual.sentence,
        balance: Math.random() * (500 - 5) + index,
      }))(R.range(1, 5))
    );
  },

  down: async queryInterface => {
    return queryInterface.bulkDelete('VirtualBalance', null, {});
  },
};
