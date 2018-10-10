import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../../src';
import AccountModel from '../../src/models/account';

let superserver: any;

describe('Query', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });

  describe('Query.account(id: ID)', async () => {
    describe('Query existing account', () => {
      const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';
      it('should return account object', async () => {
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
          .equal(accountId);
        expect(response.body.data.account).has.property('balance');
        expect(response.body.data.account).has.property('availableBalance');
        expect(response.body.data.account).is.deep.equals(account);
      });
    });
    describe('Query non existing account', () => {
      const accountId = 'acc_01770e44-b3eb-4351-8a2f-8x1xx45097xx';
      it('should return null object', async () => {
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

  afterEach(async () => {
    await stop();
  });
});
