import supertest from 'supertest';
import { expect } from 'chai';
import { describe, beforeEach, it, afterEach } from 'mocha';
import { start, stop } from '../../../src';
import ReservedBalanceModel from '../../../src/models/reserved-balance';

let superserver: any;

describe('Query', () => {
  beforeEach(async () => {
    superserver = supertest(await start(3000));
  });

  describe('Query.reservedBalance(id: ID!)', async () => {
    describe('Query existing reservedBalance', () => {
      const reservedBalanceId = 'res_739c71b0-8e5e-465c-b754-0191acbb8caf';
      it('should return reserved balance object', async () => {
        const reservedBalance = await ReservedBalanceModel.findOne({
          where: { id: reservedBalanceId },
          raw: true,
          attributes: { exclude: ['isReleased'] },
        });
        const response = await superserver.post('/graphql').send({
          query: `
            query($id: ID!)  {
              reservedBalance(id: $id) {
                id
                account
                context
                balance
              }
            }
            `,
          variables: {
            id: reservedBalanceId,
          },
        });
        expect(response.body.data.reservedBalance).to.not.be.null;
        expect(response.body.data.reservedBalance).has.property('id');
        expect(response.body.data.reservedBalance)
          .has.property('id')
          .equal(reservedBalanceId);
        expect(response.body.data.reservedBalance).has.property('account');
        expect(response.body.data.reservedBalance).has.property('context');
        expect(response.body.data.reservedBalance).has.property('balance');
        expect(response.body.data.reservedBalance).is.deep.equals(
          reservedBalance
        );
      });
    });
    describe('Query non existing reservedBalance', () => {
      const reservedBalanceId = 'res_739c71b0-8e5e-465c-b754-0191xxxx8xxx';
      it('should return null object', async () => {
        const response = await superserver.post('/graphql').send({
          query: `
            query($id: ID!)  {
              reservedBalance(id: $id) {
                id
                account
                context
                balance
              }
            }
            `,
          variables: {
            id: reservedBalanceId,
          },
        });
        expect(response.body.data.reservedBalance).to.be.null;
      });
    });
  });

  afterEach(async () => {
    await stop();
  });
});
