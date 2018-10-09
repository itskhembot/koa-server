import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../src';
import ReservedBalanceModel from '../src/models/reserved-balance';
import uuid from 'uuid';
import casual from 'casual';

let superserver: any;

describe('Mutation', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });
  describe('ReservedBalance', () => {
    it('Mutation.createReservedBalance(request: ID!, account: ID!, context: String!, amount: Float!)', async () => {
      let request = uuid();
      const accountId = 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db';
      const context = casual.sentence;
      let amount = 30;
      describe('Create reserved balance for an account', () => {
        it('reserved balance should be created', async () => {
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!, $amount: Float!)  {
              createReservedBalance(request: $request, account: $account, context: $context, amount: $amount){
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
          const reservedBalance = (await ReservedBalanceModel.findOne({
            where: { account: accountId, context },
            attributes: { exclude: ['isReleased'] },
            raw: true,
          })) as any;
          expect(response.body.data.createReservedBalance).to.not.be.null;
          expect(response.body.data.createReservedBalance).has.property('id');
          expect(response.body.data.createReservedBalance).has.property(
            'account'
          );
          expect(response.body.data.createReservedBalance).has.property(
            'context'
          );
          expect(response.body.data.createReservedBalance).has.property(
            'balance'
          );
          expect(response.body.data.createReservedBalance).is.deep.equal(
            reservedBalance
          );
        });
      });
      request = uuid();
      amount = 50;
      describe('Update reserved balance for an account', () => {
        it('Reserved balance should be updated', async () => {
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!, $amount: Float!)  {
              updateReservedBalance(request: $request, account: $account, context: $context, amount: $amount){
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
          const reservedBalance = (await ReservedBalanceModel.findOne({
            where: { account: accountId, context },
            attributes: { exclude: ['isReleased'] },
            raw: true,
          })) as any;
          expect(response.body.data.updateReservedBalance).to.not.be.null;
          expect(response.body.data.updateReservedBalance).has.property('id');
          expect(response.body.data.updateReservedBalance).has.property(
            'account'
          );
          expect(response.body.data.updateReservedBalance).has.property(
            'context'
          );
          expect(response.body.data.updateReservedBalance).has.property(
            'balance'
          );
          expect(response.body.data.updateReservedBalance).is.deep.equal(
            reservedBalance
          );
        });
      });

      describe('Update account w/ same request ID', () => {
        it('reserved balance should return same data & not affect balance', async () => {
          amount = -50;
          const reservedBalance = (await ReservedBalanceModel.findOne({
            where: { account: accountId, context },
            attributes: { exclude: ['isReleased'] },
            raw: true,
          })) as any;
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!, $amount: Float!)  {
              updateReservedBalance(request: $request, account: $account, context: $context, amount: $amount){
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
          expect(response.body.data.updateReservedBalance).is.deep.equal(
            reservedBalance
          );
        });
      });

      request = uuid();
      describe('Release reserved balance for an account', () => {
        it('Reserved balance should be released', async () => {
          const response = await superserver.post('/graphql').send({
            query: `
            mutation($request: ID!, $account: ID!, $context: String!)  {
              releaseReservedBalance(request: $request, account: $account, context: $context)
              }
            `,
            variables: {
              request,
              account: accountId,
              context,
            },
          });
          expect(response.body.data.releaseReservedBalance).is.true;
        });
      });
    });
  });

  afterEach(async () => {
    await stop();
  });
});
