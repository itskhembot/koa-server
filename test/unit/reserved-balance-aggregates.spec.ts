import { AggregateType } from 'onewallet.library.framework';
import createFakeAggregateInstance from '../helper/create-fake-aggregate-instance';
import createFakeEventStore from '../helper/create-fake-event-store';
import createFakeAggregateFactory from '../helper/create-fake-aggregate-factory';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { v4 as uuid } from 'uuid';
import casual from 'casual';
import proxyquire from 'proxyquire';

chai.use(chaiAsPromised);

describe('aggregates', () => {
  describe('ReservedBalance Aggregates', () => {
    const { default: ReservedBalanceAggregate } = proxyquire(
      '../../src/aggregates/reserved-balance',
      {
        '../lib/aggregate-factory': { default: createFakeAggregateFactory() },
      }
    );
    describe('Type', () => {
      it('should return the correct type', () => {
        expect(ReservedBalanceAggregate.Type).to.equal(
          AggregateType.ReservedBalance
        );
      });
    });

    describe('InitialState', () => {
      it('should return the correct initial state', () => {
        expect(ReservedBalanceAggregate.InitialState).is.null;
      });
    });

    describe('constructor', () => {
      const aggregate = new ReservedBalanceAggregate(
        createFakeAggregateInstance({ type: AggregateType.ReservedBalance }),
        {} as any,
        {} as any
      );

      it('should set the correct properties', () => {
        expect(aggregate).to.has.property('id').to.be.string;
        expect(aggregate).to.has.property('state').to.be.null;
        expect(aggregate)
          .to.has.property('type')
          .to.equal(AggregateType.ReservedBalance);
        expect(aggregate)
          .to.has.property('version')
          .to.equal(100);
      });
    });
    describe('createReservedBalance', () => {
      let aggregate: any;

      describe('Reserved Balance already exists', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: {
              balance: 50,
              isReleased: false,
            },
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('should return error', async () => {
          await expect(
            aggregate.create(`acc_${uuid()}`, casual.sentence, 100)
          ).to.eventually.rejected.to.has.property(
            'code',
            'RESERVED_BALANCE_EXISTS'
          );
        });
      });
      describe('Reserved Balance does not exists and amount greater than balance', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: null,
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('should throw balance insufficient error', async () => {
          await expect(
            aggregate.create(`acc_${uuid()}`, casual.sentence, 600)
          ).to.eventually.be.rejected.to.has.property(
            'code',
            'INSUFFICIENT_BALANCE'
          );
        });
      });
      describe('Reserved Balance does not exists', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: null,
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('create reserved balance', async () => {
          await aggregate.create(`acc_${uuid()}`, casual.sentence, 200);
          await aggregate.fold();
          expect(aggregate.state).to.deep.equal({
            balance: 200,
            isReleased: false,
          });
        });
      });
    });
    describe('updateReservedBalance', () => {
      let aggregate: any;

      describe('Reserved Balance does not exists', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: null,
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('should throw reserved balance doesnt exists error', async () => {
          await expect(
            aggregate.update(`acc_${uuid()}`, casual.sentence, 600)
          ).to.eventually.be.rejected.to.has.property(
            'code',
            'RESERVED_BALANCED_NON-EXISTING'
          );
        });
      });
      describe('Reserved Balance exists and negative amount exceeds current balance', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: { balance: 100, isReleased: false },
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('should return insufficient updated balance error', async () => {
          await expect(
            aggregate.update(`acc_${uuid()}`, casual.sentence, -300)
          ).to.eventually.be.rejected.to.has.property(
            'code',
            'INSUFFICIENT_RESERVED_BALANCE'
          );
        });
      });
      describe('Reserved Balance exists', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: { balance: 100, isReleased: false },
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('should update reserved balance', async () => {
          await aggregate.update(`acc_${uuid()}`, casual.sentence, 200);
          await aggregate.fold();
          expect(aggregate.state).to.deep.equal({
            balance: 300,
            isReleased: false,
          });
        });
      });
    });

    describe('releaseReservedBalance', () => {
      let aggregate: any;

      describe('Reserved Balance does not exists', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: null,
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('should return error', async () => {
          await expect(
            aggregate.release(`acc_${uuid()}`, casual.sentence)
          ).to.eventually.rejected.to.has.property(
            'code',
            'RESERVED_BALANCED_NON-EXISTING'
          );
        });
      });
      describe('Reserved Balance exists but isRelease is already true', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: { balance: 100, isReleased: true },
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('should return error', async () => {
          await expect(
            aggregate.release(`acc_${uuid()}`, casual.sentence)
          ).to.eventually.rejected.to.has.property(
            'code',
            'RESERVED_BALANCED_RELEASED'
          );
        });
      });
      describe('Reserved Balance exists', () => {
        before(async () => {
          const fakeAggregateInstance = createFakeAggregateInstance({
            id: `acc_${uuid()}`,
            type: AggregateType.ReservedBalance,
            state: { balance: 100, isReleased: false },
          });
          const fakeEventStore = createFakeEventStore([]);

          aggregate = new ReservedBalanceAggregate(
            fakeAggregateInstance,
            fakeEventStore,
            {} as any
          );
        });
        it('release reserved balance', async () => {
          await aggregate.release(`acc_${uuid()}`, casual.sentence);
          await aggregate.fold();
          expect(aggregate.state).to.deep.equal({
            balance: 100,
            isReleased: true,
          });
        });
      });
    });
  });
});
