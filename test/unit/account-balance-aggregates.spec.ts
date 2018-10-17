import { AggregateType } from 'onewallet.library.framework';
import { AccountBalanceAggregate } from '../../src/aggregates';
import createFakeAggregateInstance from '../helper/create-fake-aggregate-instance';
import createFakeEventStore from '../helper/create-fake-event-store';
import AccountError from '../../src/lib/error/account-error';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { v4 as uuid } from 'uuid';

chai.use(chaiAsPromised);

describe('aggregates', () => {
  describe('AccountBalance Aggregates', () => {
    describe('Type', () => {
      it('should return the correct type', () => {
        expect(AccountBalanceAggregate.Type).to.equal(
          AggregateType.AccountBalance
        );
      });
    });

    describe('InitialState', () => {
      it('should return the correct initial state', () => {
        expect(AccountBalanceAggregate.InitialState).has.property('amount', 0);
      });
    });

    describe('constructor', () => {
      const aggregate = new AccountBalanceAggregate(
        createFakeAggregateInstance({ type: AggregateType.AccountBalance }),
        {} as any,
        {} as any
      );

      it('should set the correct properties', () => {
        expect(aggregate).to.has.property('id').to.be.string;
        expect(aggregate).to.has.property('state').to.be.null;
        expect(aggregate)
          .to.has.property('type')
          .to.equal(AggregateType.AccountBalance);
        expect(aggregate)
          .to.has.property('version')
          .to.equal(0);
      });
    });

    describe('updateBalance', () => {
      const fakeAggregateInstance = createFakeAggregateInstance({
        id: `acc_${uuid()}`,
        type: AggregateType.AccountBalance,
        state: { balance: 50 },
      });
      const fakeEventStore = createFakeEventStore([]);
      const aggregate = new AccountBalanceAggregate(
        fakeAggregateInstance,
        fakeEventStore,
        {} as any
      );

      it('should return error', async () => {
        await aggregate.updateBalance(-70);
        expect(aggregate)
          .to.be.an.instanceOf(AccountError).with.property('message', 'Updated balance amount results in negative amount');
      });

      it('should update balance', async () => {
        await aggregate.updateBalance(320);

        expect(aggregate).to.has.property('id').to.be.string;
        expect(aggregate).to.has.property('state').to.have.property('balance',50);
        expect(aggregate)
          .to.has.property('type')
          .to.equal(AggregateType.AccountBalance);
        expect(aggregate)
          .to.has.property('version')
          .to.equal(0);
      });
    });
  });
});
