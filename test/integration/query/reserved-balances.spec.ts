import supertest from 'supertest';
import { expect } from 'chai';
import { start, stop } from '../../../src';
import ReservedBalanceModel from '../../../src/models/reserved-balance';

let superserver: any;

describe('Query', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });

  describe('Query.reservedBalances(account: ID!)', async () => {
    describe('Query existing reservedBalances', () => {
      const accountId = 'acc_e3e7f84b-0daa-4014-b67a-627b7f6f6b59';
      it('should return reserved balance objects', async () => {
        const reservedBalances = await ReservedBalanceModel.findAll({
          where: { account: accountId },
          raw: true,
          attributes: { exclude: ['isReleased'] },
        });
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
        expect(response.body.data.reservedBalances).to.not.be.null;
        expect(response.body.data.reservedBalances).is.deep.equals(
          reservedBalances
        );
      });
    });
    describe('Query non existing reservedBalances', () => {
      const accountId = 'acc_e3e7f84b-0daa-4014-b67a-627x7x6x6x59';
      it('should return empty set', async () => {
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

  afterEach(async () => {
    await stop();
  });
});
