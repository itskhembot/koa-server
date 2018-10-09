import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../src';
import AccountModel from '../src/models/account';
import ReservedBalanceModel from '../src/models/reserved-balance';
import VirtualBalanceModel from '../src/models/virtual-balance';

let superserver: any;

describe('Query', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });

  describe('Account', () => {
    it('Query.account(id: ID)', async () => {
      describe('Query existing account', () => {
        it('account should exist', async () => {
          const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';
          const account = await AccountModel.findOne({
            where: { id: accountId },
            raw: true,
          });
          const response = await superserver.post('/graphql').send({
            query: `
            query($id: ID!)  {
              account(id: $id) {
                id
                balance
                availableBalance
              }
            }
            `,
            variables: {
              id: accountId,
            },
          });
          expect(response.body.data.account).to.not.be.null;
          expect(response.body.data.account).has.property('id');
          expect(response.body.data.account)
            .has.property('id')
            .equal('acc_01770e44-b3eb-4351-8a2f-8f1ed45097db');
          expect(response.body.data.account).has.property('balance');
          expect(response.body.data.account).has.property('availableBalance');
          expect(response.body.data.account).is.deep.equals(account);
        });
      });

      describe('Query non existing account', () => {
        it('account should not exist', async () => {
          const accountId = 'acc_01770e44-b3eb-4351-8a2f-8x1xx45097xx';
          const response = await superserver.post('/graphql').send({
            query: `
            query($id: ID!)  {
              account(id: $id) {
                id
                balance
                availableBalance
              }
            }
            `,
            variables: {
              id: accountId,
            },
          });
          expect(response.body.data.account).to.be.null;
        });
      });
    });
  });

  describe('ReservedBalance', () => {
    it('Query.reservedBalance(id: ID!)', async () => {
      describe('Query existing reservedBalance', () => {
        it('reservedBalance should exist', async () => {
          const reservedBalanceId = 'res_739c71b0-8e5e-465c-b754-0191acbb8caf';
          const reservedBalance = await ReservedBalanceModel.findOne(
            { where: { id: reservedBalanceId }, raw: true, attributes: { exclude: ['isReleased'] } },
          );
          const response = await superserver.post('/graphql').send({
            query: `
            query($id: ID!)  {
              reservedBalance(id: $id) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              id: reservedBalanceId,
            },
          });
          expect(response.body.data.reservedBalance).to.not.be.null;
          expect(response.body.data.reservedBalance).has.property('id');
          expect(response.body.data.reservedBalance)
            .has.property('id')
            .equal('res_739c71b0-8e5e-465c-b754-0191acbb8caf');
          expect(response.body.data.reservedBalance).has.property('account');
          expect(response.body.data.reservedBalance).has.property('context');
          expect(response.body.data.reservedBalance).has.property('balance');
          expect(response.body.data.reservedBalance).is.deep.equals(reservedBalance);
        });
      });

      describe('Query non existing reservedBalance', () => {
        it('reservedBalance should not exist', async () => {
          const reservedBalanceId = 'res_739c71b0-8e5e-465c-b754-0191xxxx8xxx';
          const response = await superserver.post('/graphql').send({
            query: `
            query($id: ID!)  {
              reservedBalance(id: $id) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              id: reservedBalanceId,
            },
          });
          expect(response.body.data.reservedBalance).to.be.null;
        });
      });
    });
  });


  describe('ReservedBalances', () => {
    it('Query.reservedBalances(id: ID!)', async () => {
      describe('Query existing reservedBalances', () => {
        it('reservedBalances should exist', async () => {
          const accountId = 'acc_e3e7f84b-0daa-4014-b67a-627b7f6f6b59';
          const reservedBalances = await ReservedBalanceModel.findAll({ where: { account: accountId }, raw: true, attributes: { exclude: ['isReleased'] } });
          const response = await superserver.post('/graphql').send({
            query: `
            query($account: ID!)  {
              reservedBalances(account: $account) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              account: accountId,
            },
          });
          console.log(response.body.data.reservedBalances);
          expect(response.body.data.reservedBalances).to.not.be.null;
          expect(response.body.data.reservedBalances).is.deep.equals(reservedBalances);
        });
      });

      describe('Query non existing reservedBalances', () => {
        it('reservedBalances should not exist', async () => {
          const accountId = 'acc_e3e7f84b-0daa-4014-b67a-627x7x6x6x59';
          const response = await superserver.post('/graphql').send({
            query: `
            query($account: ID!)  {
              reservedBalances(account: $account) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              account: accountId,
            },
          });
          expect(response.body.data.reservedBalances).empty;
        });
      });
    });
  });

  describe('VirtualBalance', () => {
    it('Query.virtualBalance(id: ID!)', async () => {
      describe('Query existing virtualBalance', () => {
        it('virtualBalance should exist', async () => {
          const virtualBalanceId = 'vir_f8aa0564-47ac-4255-b08d-7fef0629c17f';
          const virtualBalance = await VirtualBalanceModel.findOne(
            { where: { id: virtualBalanceId }, raw: true, attributes: { exclude: ['isCommit'] } },
          );
          const response = await superserver.post('/graphql').send({
            query: `
            query($id: ID!)  {
              virtualBalance(id: $id) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              id: virtualBalanceId,
            },
          });
          expect(response.body.data.virtualBalance).to.not.be.null;
          expect(response.body.data.virtualBalance).has.property('id');
          expect(response.body.data.virtualBalance)
            .has.property('id')
            .equal('vir_f8aa0564-47ac-4255-b08d-7fef0629c17f');
          expect(response.body.data.virtualBalance).has.property('account');
          expect(response.body.data.virtualBalance).has.property('context');
          expect(response.body.data.virtualBalance).has.property('balance');
          expect(response.body.data.virtualBalance).is.deep.equals(virtualBalance);
        });
      });

      describe('Query non existing virtualBalance', () => {
        it('virtualBalance should not exist', async () => {
          const virtualBalanceId = 'vir_f8aa0564-47ac-4255-b08d-7xxx0629x17x';
          const response = await superserver.post('/graphql').send({
            query: `
            query($id: ID!)  {
              virtualBalance(id: $id) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              id: virtualBalanceId,
            },
          });
          expect(response.body.data.virtualBalance).to.be.null;
        });
      });
    });
  });


  describe('VirtualBalances', () => {
    it('Query.virtualBalances(id: ID!)', async () => {
      describe('Query existing virtualBalances', () => {
        it('virtualBalances should exist', async () => {
          const accountId = 'acc_cd4b772c-0b48-4dea-82e2-c0494f0f7f06';
          const virtualBalances = await VirtualBalanceModel.findAll({ where: { account: accountId }, raw: true, attributes: { exclude: ['isCommit'] } });
          const response = await superserver.post('/graphql').send({
            query: `
            query($account: ID!)  {
              virtualBalances(account: $account) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              account: accountId,
            },
          });
          console.log(response.body.data.virtualBalances);
          expect(response.body.data.virtualBalances).to.not.be.null;
          expect(response.body.data.virtualBalances).is.deep.equals(virtualBalances);
        });
      });

      describe('Query non existing virtualBalances', () => {
        it('virtualBalances should not exist', async () => {
          const accountId = 'acc_cd4b772c-0b48-4dea-82e2-x0494x0x7x06';
          const response = await superserver.post('/graphql').send({
            query: `
            query($account: ID!)  {
              virtualBalances(account: $account) {
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              account: accountId,
            },
          });
          expect(response.body.data.virtualBalances).empty;
        });
      });
    });
  });


  afterEach(async () => {
    await stop();
  });
});
  