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
import AggregateFactoryInstance from '../lib/aggregate-factory';

type State = {
  balance: number;
  isReleased: boolean;
} | null;

export default class ReservedBalanceAggregate extends Aggregate<State> {
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
      case 'ReservedBalanceUpdated': {
        const params = event.body as any;
        return { balance: params.amount, isReleased: false };
      }
      case 'ReservedBalanceReleased': {
        const params = event.body as any;
        return { balance: params.amount, isReleased: true };
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

  async create(
    account: string,
    context: string,
    amount: number
  ): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('ReservedBalanceCreated');

    if (this.state) {
      throw new AppError(
        'RESERVED_BALANCE_EXISTS',
        `Reserved Balance already exists`,
        {
          account,
        }
      );
    }

    const accountAggregate = (await AggregateFactoryInstance.findOrCreateAggregate(
      AccountBalanceAggregate,
      account
    )) as AccountBalanceAggregate;
    accountAggregate.fold();
    const accountBalance = accountAggregate.state.balance;
    if (amount > accountBalance) {
      throw new AppError(
        'INSUFFICIENT_BALANCE',
        `Insufficient balance in account, reserved amount is greater than balance!`,
        {
          account,
        }
      );
    }
    accountAggregate.updateBalance(-Math.abs(amount));
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
        accountAggregate.updateBalance(amount);
        return this.create(account, context, amount);
      }

      throw err;
    }
  }

  async update(
    account: string,
    context: string,
    amount: number
  ): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('ReservedBalanceUpdated');

    const accountAggregate = (await AggregateFactoryInstance.findOrCreateAggregate(
      AccountBalanceAggregate,
      account
    )) as AccountBalanceAggregate;
    accountAggregate.fold();
    const accountBalance = accountAggregate.state.balance;
    if (amount > accountBalance) {
      throw new AppError(
        'INSUFFICIENT_BALANCE',
        `Insufficient balance in account, reserved amount is greater than balance!`,
        {
          account,
        }
      );
    }

    accountAggregate.updateBalance(-Math.abs(amount));
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
        accountAggregate.updateBalance(amount);
        return this.update(account, context, amount);
      }

      throw err;
    }
  }

  async release(account: string, context: string): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('ReservedBalanceReleased');

    const accountAggregate = (await AggregateFactoryInstance.findOrCreateAggregate(
      AccountBalanceAggregate,
      account
    )) as AccountBalanceAggregate;
    accountAggregate.fold();
    let amount;
    if (this.state) {
      amount = (await this.state.balance) as any;
    }

    accountAggregate.updateBalance(amount);
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
        accountAggregate.updateBalance(-Math.abs(amount));
        return this.release(account, context);
      }

      throw err;
    }
  }
}
