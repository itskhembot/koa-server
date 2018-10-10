import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../../src';
import VirtualBalanceModel from '../../src/models/virtual-balance';

let superserver: any;

describe('Query', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });

  describe('VirtualBalance', () => {
    describe('Query.virtualBalance(id: ID!)', async () => {
      describe('Query existing virtualBalance', () => {
        const virtualBalanceId = 'vir_f8aa0564-47ac-4255-b08d-7fef0629c17f';
        it('virtualBalance should exist', async () => {
          const virtualBalance = await VirtualBalanceModel.findOne({
            where: { id: virtualBalanceId },
            raw: true,
            attributes: { exclude: ['isCommit'] },
          });
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
            .equal(virtualBalanceId);
          expect(response.body.data.virtualBalance).has.property('account');
          expect(response.body.data.virtualBalance).has.property('context');
          expect(response.body.data.virtualBalance).has.property('balance');
          expect(response.body.data.virtualBalance).is.deep.equals(
            virtualBalance
          );
        });
      });
      describe('Query non existing virtualBalance', () => {
        const virtualBalanceId = 'vir_f8aa0564-47ac-4255-b08d-7xxx0629x17x';
        it('virtualBalance should not exist', async () => {
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

  afterEach(async () => {
    await stop();
  });
});
