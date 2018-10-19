import createFakeEventStore from '../helper/create-fake-event-store';
import createFakeEvent from '../helper/create-fake-event';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

chai.use(chaiAsPromised);

describe('projections', () => {
  describe('AccountBalance Projections', () => {
    describe('updateBalance', () => {
      const fakeFindById = sinon.fake(() => Promise.resolve(null));
      const fakeUpdate = sinon.fake(async () => {});
      const fakeModel = { update: fakeUpdate };
      const fakeSequelize = {
        define: () => {
          return {
            findById: fakeFindById,
            upsert: () => Promise.resolve(),
            sync: () => Promise.resolve(),
          };
        },
      } as any;
      const { default: AccountBalanceProjection } = proxyquire(
        '../../src/projections/account-balance',
        {
          '../lib/event-store': {
            default: createFakeEventStore([
              createFakeEvent({ type: 'BalanceUpdated', body: { amount: 50 } }),
            ]),
          },
          '../lib/sequelize': { default: fakeSequelize },
          '../models/account': { default: fakeModel },
        }
      );

      it('should call  balance', async () => {
        const projection = new AccountBalanceProjection();
        await projection.initialized;
        await projection.queue.onEmpty();
        expect(fakeUpdate.calledOnce).to.be.true;
      });
    });
  });
});
