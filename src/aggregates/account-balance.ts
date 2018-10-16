import {
  ID,
  Aggregate,
  Event,
  AggregateInstance,
  EventStore,
  AggregateFactory,
  AggregateType,
} from 'onewallet.library.framework';
import AppError from 'onewallet.library.error';
import R from 'ramda';

import * as Account from '../client/account';

type State = {
  amount: number;
};

export default class AccountBalance extends Aggregate<State> {
  constructor(
    instance: AggregateInstance<State>,
    eventStore: EventStore,
    factory: AggregateFactory
  ) {
    super(instance, eventStore, factory);
  }

  apply(state: State, event: Event) {
    switch (event.type) {
      case 'BalanceUpdated': {
        const params = event.body as any;
        return {amount: this.state.amount + params.amount};
      }
    }

    return R.clone(state);
  }

  static get Type() {
    return AggregateType.AccountBalance;
  }

  static get InitialState() {
    return { amount: 0 };
  }

  async updateBalance(account: ID, amount: number): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('BalanceUpdated');

    const balance = await Account.retrieveBalance(account);
    const calculatedBalance = balance + amount;

    if(calculatedBalance < 0){
      throw new AppError('INSUFFICIENT_BALANCE', 'Updated balance amount results in negative amount', {
        calculatedBalance,
      });
    }

    try {
      await this.eventStore.createEvent(
        nextEvent({
          amount
        })
      );
    } catch (err) {
      throw err;
    }
  }
}
