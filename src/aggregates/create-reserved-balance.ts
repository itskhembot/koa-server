import {
  Aggregate,
  Event,
  AggregateInstance,
  EventStore,
  AggregateFactory,
  AggregateType,
} from 'onewallet.library.framework';
import AppError from 'onewallet.library.error';
import R from 'ramda';

import { AccountBalanceAggregate } from '../../src/aggregates';
import libEventStore from '../lib/event-store';
import sequelize from '../lib/sequelize';

type State = {
  balance: number;
  isReleased: boolean;
} | null;

export default class CreateReservedBalanceAggregate extends Aggregate<State> {
  constructor(
    instance: AggregateInstance<State>,
    eventStore: EventStore,
    factory: AggregateFactory
  ) {
    super(instance, eventStore, factory);
  }

  apply(state: State, event: Event) {
    switch (event.type) {
      case 'ReservedBalanceCreated': {
        const params = event.body as any;
        return { balance: params.amount, isReleased: false };
      }
    }

    return R.clone(state);
  }

  static get Type() {
    return AggregateType.ReservedBalance;
  }

  static get InitialState() {
    return null;
  }

  async createReservedBalance(
    account: string,
    context: string,
    amount: number
  ): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('ReservedBalanceCreated');

    if (this.state) {
      throw new AppError(
        'RESERVED_BALANCE_ALREADY_EXISTS',
        `Reserved Balance already exists`,
        {
          account,
        }
      );
    }
    const aggregateFactory = new AggregateFactory(libEventStore, sequelize);
    const accountAggregate = await aggregateFactory.findOrCreateAggregate(
      AccountBalanceAggregate,
      account
    );
    accountAggregate.fold();
    const accountBalance = accountAggregate.state.balance;
    if (amount > accountBalance) {
      throw new AppError(
        'INSUFFICIENT_ACCOUNT_BALANCE_TO_RESERVE',
        `Insufficient balance in account, reserved amount is greater than balance!`,
        {
          account,
        }
      );
    }
    try {
      await this.eventStore.createEvent(
        nextEvent({
          account,
          context,
          amount,
        })
      );
    } catch (err) {
      if (err.code === 'EVENT_VERSION_EXISTS') {
        return this.createReservedBalance(account, context, amount);
      }

      throw err;
    }
  }
}
