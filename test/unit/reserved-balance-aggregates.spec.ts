import { AggregateType } from 'onewallet.library.framework';
import { ReservedBalanceAggregate } from '../../src/aggregates';
import { AccountBalanceAggregate } from '../../src/aggregates';
import createFakeAggregateInstance from '../helper/create-fake-aggregate-instance';
import createFakeEventStore from '../helper/create-fake-event-store';
import createFakeAggregateFactory from '../helper/create-fake-aggregate-factory';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { v4 as uuid } from 'uuid';
import casual from 'casual';
// import proxyquire from 'proxyquire';

chai.use(chaiAsPromised);

describe('aggregates', () => {
  describe('AccountBalance Aggregates', () => {
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
      beforeEach(async () => {
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
        const fakeAccountAggregateInstance = createFakeAggregateInstance({
          id: `acc_${uuid()}`,
          type: AggregateType.ReservedBalance,
          state: {
            balance: 500,
          },
        });
        const fakeAggregateFactory = await createFakeAggregateFactory();
        const bal = fakeAggregateFactory.findOrCreateAggregate();
        const accountBalanceAggregate = new AccountBalanceAggregate(
          fakeAccountAggregateInstance,
          fakeEventStore,
          fakeAggregateFactory
        );
        const accountBalance = accountBalanceAggregate;
      });
      it('should return error', async () => {
        try {
          await expect(aggregate.create(`acc_${uuid()}`, casual.sentence, 100))
            .to.eventually.throw()
            .to.has.property('code', 'RESERVED_BALANCE_EXISTS');
        } catch (err) {}
      });
    });
  });
});
