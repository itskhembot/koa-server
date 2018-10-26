import createFakeEventStore from '../helper/create-fake-event-store';
import createFakeEvent from '../helper/create-fake-event';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { v4 as uuid } from 'uuid';
import casual from 'casual';

chai.use(chaiAsPromised);

describe('projections', () => {
  describe('ReservedBalance Projections', () => {
    const fakeFindById = sinon.fake(() => Promise.resolve(null));
    const fakeCreate = sinon.fake(
      (account: string, context: string, amount: number) => {
        return {
          id: `res_${uuid()}`,
          account,
          context,
          balance: amount,
          isReleased: false,
        };
      }
    );
    const fakeUpdate = sinon.fake(() => {});
    const fakeLiteral = sinon.fake(() => {});
    const fakeModel = { create: fakeCreate, update: fakeUpdate };
    const fakeSequelize = {
      literal: fakeLiteral,
      define: () => {
        return {
          findById: fakeFindById,
          upsert: () => Promise.resolve(),
          sync: () => Promise.resolve(),
        };
      },
    } as any;
    beforeEach(async () => {
      fakeCreate.resetHistory();
      fakeUpdate.resetHistory();
    });
    describe('create', () => {
      const account = `acc_${uuid()}`;
      const context = casual.sentence;
      const { default: ReservedBalanceProjection } = proxyquire(
        '../../src/projections/reserved-balance',
        {
          '../lib/event-store': {
            default: createFakeEventStore([
              createFakeEvent({
                type: 'ReservedBalanceCreated',
                body: {
                  account,
                  context,
                  amount: 50,
                },
              }),
            ]),
          },
          '../lib/sequelize': { default: fakeSequelize },
          '../models/reserved-balance': { default: fakeModel },
        }
      );
      it('should call create', async () => {
        const projection = new ReservedBalanceProjection();
        await projection.initialized;
        await projection.queue.onEmpty();
        expect(fakeCreate.calledOnce).to.be.true;
        expect(fakeCreate.lastCall.lastArg).has.property('account', account);
        expect(fakeCreate.lastCall.lastArg).has.property('context', context);
        expect(fakeCreate.lastCall.lastArg).has.property('balance', 50);
      });
    });
    describe('update', () => {
      const account = `acc_${uuid()}`;
      const context = casual.sentence;
      const { default: ReservedBalanceProjection } = proxyquire(
        '../../src/projections/reserved-balance',
        {
          '../lib/event-store': {
            default: createFakeEventStore([
              createFakeEvent({
                type: 'ReservedBalanceUpdated',
                body: {
                  account,
                  context,
                  amount: 50,
                },
              }),
            ]),
          },
          '../lib/sequelize': { default: fakeSequelize },
          '../models/reserved-balance': { default: fakeModel },
        }
      );
      it('should call update', async () => {
        const projection = new ReservedBalanceProjection();
        await projection.initialized;
        await projection.queue.onEmpty();
        expect(fakeUpdate.calledOnce).to.be.true;
      });
    });

    describe('released', () => {
      const { default: ReservedBalanceProjection } = proxyquire(
        '../../src/projections/reserved-balance',
        {
          '../lib/event-store': {
            default: createFakeEventStore([
              createFakeEvent({
                type: 'ReservedBalanceReleased',
                body: {
                  account: `acc_${uuid()}`,
                  context: casual.sentence,
                },
              }),
            ]),
          },
          '../lib/sequelize': { default: fakeSequelize },
          '../models/reserved-balance': { default: fakeModel },
        }
      );
      it('should call release', async () => {
        const projection = new ReservedBalanceProjection();
        await projection.initialized;
        await projection.queue.onEmpty();
        expect(fakeUpdate.calledOnce).to.be.true;
      });
    });
  });
});
