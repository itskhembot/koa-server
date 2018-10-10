import supertest from 'supertest';
import { expect } from 'chai';
import { start, stop } from '../../../src';
import VirtualBalanceModel from '../../../src/models/virtual-balance';
import uuid from 'uuid';
import casual from 'casual';

let superserver: any;

describe('Mutation', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });

  const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';
  const context = casual.sentence;

  describe('Mutation.createVirtualBalance(request: ID!, account: ID!, context: String!, amount: Float!)', async () => {
    describe('Create virtual balance for an account', () => {
      const request = uuid();
      const amount = 30;
      it('should create virtual balance object', async () => {
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
        expect(response.body.data.createVirtualBalance).has.property('account').equal(accountId);
        expect(response.body.data.createVirtualBalance).has.property('context').equal(context);
        expect(response.body.data.createVirtualBalance).has.property('balance').equal(amount);
        expect(response.body.data.createVirtualBalance).is.deep.equal(
          virtualBalance
        );
      });
    });
  });
  describe('Mutation.updateVirtualBalance(request: ID!, account: ID!, context: String!, amount: Float!)', async () => {
    const request = uuid();
    let amount = 50;
    describe('Update virtual balance for an account', () => {
      it('should update reserved balance object', async () => {
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
        expect(response.body.data.updateVirtualBalance).has.property('account').equal(accountId);
        expect(response.body.data.updateVirtualBalance).has.property('context').equal(context);
        expect(response.body.data.updateVirtualBalance).has.property('balance').equal(amount);
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
  });
  describe('Mutation.commitVirtualBalance(request: ID!, account: ID!, context: String!)', async () => {
    describe('Commit virtual balance for an account', () => {
      const request = uuid();
      it('should update commit to true for virtual balance object', async () => {
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
  });
  describe('Mutation.cancelVirtualBalance(request: ID!, account: ID!, context: String!)', async () => {
    describe('should delete virtual balance object', () => {
      const request = uuid();
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

  afterEach(async () => {
    await stop();
  });
});
