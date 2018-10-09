import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../src';

let superserver: any;

const port = 3000;


describe('Query', () => {

  beforeEach(async () => {
    superserver = supertest(await start(port));
  });

  describe('Account', () => {
    it('Query.account(id: ID)', async () => {
      describe('Query existing account', () => {
        it('account should exist', async () => {
          const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';
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

  afterEach(async () => {
    await stop();
  });
  
});
