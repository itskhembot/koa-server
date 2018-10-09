import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../src';
import VirtualBalanceModel from '../src/models/virtual-balance';
import uuid from 'uuid';
import casual from 'casual';

let superserver: any;

describe('Mutation', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });
  describe('VirtualBalance', () => {
    it('Mutation.createVirtualBalance(request: ID!, account: ID!, context: String!, amount: Float!)', async () => {
      let request = uuid();
      const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';
      const context = casual.sentence;
      let amount = 30;
      describe('Create virtual balance for an account', () => {
        it('virtual balance should be created', async () => {
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!, $amount: Float!)  {
              createVirtualBalance(request: $request, account: $account, context: $context, amount: $amount){
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              request,
              account: accountId,
              context,
              amount,
            },
          });
          const virtualBalance = (await VirtualBalanceModel.findOne({
            where: { account: accountId, context },
            attributes: { exclude: ['isCommit'] },
            raw: true,
          })) as any;
          expect(response.body.data.createVirtualBalance).to.not.be.null;
          expect(response.body.data.createVirtualBalance).has.property('id');
          expect(response.body.data.createVirtualBalance).has.property(
            'account'
          );
          expect(response.body.data.createVirtualBalance).has.property(
            'context'
          );
          expect(response.body.data.createVirtualBalance).has.property(
            'balance'
          );
          expect(response.body.data.createVirtualBalance).is.deep.equal(
            virtualBalance
          );
        });
      });
      request = uuid();
      amount = 50;
      describe('Update virtual balance for an account', () => {
        it('Reserved balance should be updated', async () => {
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!, $amount: Float!)  {
              updateVirtualBalance(request: $request, account: $account, context: $context, amount: $amount){
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              request,
              account: accountId,
              context,
              amount,
            },
          });
          const virtualBalance = (await VirtualBalanceModel.findOne({
            where: { account: accountId, context },
            attributes: { exclude: ['isCommit'] },
            raw: true,
          })) as any;
          expect(response.body.data.updateVirtualBalance).to.not.be.null;
          expect(response.body.data.updateVirtualBalance).has.property('id');
          expect(response.body.data.updateVirtualBalance).has.property(
            'account'
          );
          expect(response.body.data.updateVirtualBalance).has.property(
            'context'
          );
          expect(response.body.data.updateVirtualBalance).has.property(
            'balance'
          );
          expect(response.body.data.updateVirtualBalance).is.deep.equal(
            virtualBalance
          );
        });
      });

      describe('Update account w/ same request ID', () => {
        it('virtual balance should return same data & not affect balance', async () => {
          amount = -50;
          const virtualBalance = (await VirtualBalanceModel.findOne({
            where: { account: accountId, context },
            attributes: { exclude: ['isCommit'] },
            raw: true,
          })) as any;
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!, $amount: Float!)  {
              updateVirtualBalance(request: $request, account: $account, context: $context, amount: $amount){
                id
                account
                context
                balance
              }
            }
            `,
            variables: {
              request,
              account: accountId,
              context,
              amount,
            },
          });
          expect(response.body.data.updateVirtualBalance).is.deep.equal(
            virtualBalance
          );
        });
      });

      request = uuid();
      describe('Commit virtual balance for an account', () => {
        it('Virtual balance should be committed', async () => {
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!)  {
              commitVirtualBalance(request: $request, account: $account, context: $context)
              }
            `,
            variables: {
              request,
              account: accountId,
              context,
            },
          });
          expect(response.body.data.commitVirtualBalance).is.true;
        });
      });

      request = uuid();
      describe('Cancel virtual balance for an account', () => {
        it('Virtual balance should be canceled', async () => {
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!)  {
              cancelVirtualBalance(request: $request, account: $account, context: $context)
              }
            `,
            variables: {
              request,
              account: accountId,
              context,
            },
          });
          expect(response.body.data.cancelVirtualBalance).is.true;
        });
      });
    });
  });

  afterEach(async () => {
    await stop();
  });
});
