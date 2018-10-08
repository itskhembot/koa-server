import supertest from 'supertest';
import test, { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../src/index';
import AccountModel from '../src/models/account';

let superserver;

const port = 3000;


describe('Query', () => {
  beforeEach(async () => {
    superserver = supertest(await start(port));
  });

  describe('Account', () => {
    it('should query account', async () => {
      const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';
      const account = await AccountModel.findOne({
        where: { id: accountId },
        raw: true,
      });
      const { body } = await superserver.post('/graphql').send({
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
    });
  });
  afterEach(async () => {
    await stop();
  });
});

