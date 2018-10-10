import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../../../src';
import VirtualBalanceModel from '../../../src/models/virtual-balance';

let superserver: any;

describe('Query', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });

  describe('Query.virtualBalances(account: ID!)', async () => {
    describe('Query existing virtualBalances', () => {
      const accountId = 'acc_cd4b772c-0b48-4dea-82e2-c0494f0f7f06';
      it('should return virtual balance objects', async () => {
        const virtualBalances = await VirtualBalanceModel.findAll({
          where: { account: accountId },
          raw: true,
          attributes: { exclude: ['isCommit'] },
        });
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
        expect(response.body.data.virtualBalances).to.not.be.null;
        expect(response.body.data.virtualBalances).is.deep.equals(
          virtualBalances
        );
      });
    });
    describe('Query non existing virtualBalances', () => {
      const accountId = 'acc_cd4b772c-0b48-4dea-82e2-x0494x0x7x06';
      it('should return empty set', async () => {
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

  afterEach(async () => {
    await stop();
  });
});
