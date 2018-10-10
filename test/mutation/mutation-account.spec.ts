import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../../src';
import AccountModel from '../../src/models/account';
import uuid from 'uuid';

let superserver: any;

describe('Mutation', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });
  
  const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';

  describe('Mutation.updateBalance(request: ID!, account: ID!, amount: Float!)', async () => {
    const request = uuid();
    let amount = 30;
    describe('Update balance of existing account', () => {
      it('should update account balance', async () => {
        const account = (await AccountModel.findOne({
          where: { id: accountId },
          raw: true,
        })) as any;
        const response = await superserver.post('/graphql').send({
          query: `
            mutation($request: ID!, $account: ID!, $amount: Float!)  {
              updateBalance(request: $request, account: $account, amount: $amount)
            }
            `,
          variables: {
            request,
            account: accountId,
            amount,
          },
        });
        expect(response.body.data.updateBalance).to.not.be.null;
        if (amount > 0) {
          expect(response.body.data.updateBalance).is.greaterThan(account.balance);
        }
        if (amount < 0) {
          expect(response.body.data.updateBalance).is.lessThan(account.balance);
        }
      });
    });

    describe('Update account w/ same request ID', () => {
      amount = -50;
      it('should return same data & not affect balance', async () => {
        const account = (await AccountModel.findOne({
          where: { id: accountId },
          raw: true,
        })) as any;
        const response = await superserver.post('/graphql').send({
          query: `
            mutation($request: ID!, $account: ID!, $amount: Float!)  {
              updateBalance(request: $request, account: $account, amount: $amount)
            }
            `,
          variables: {
            request,
            account: accountId,
            amount,
          },
        });
        expect(response.body.data.updateBalance).is.equal(account.balance);
      });
    });
  });

  afterEach(async () => {
    await stop();
  });
});
