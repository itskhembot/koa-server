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

type State = {
  balance: number;
};

export default class AccountBalanceAggregate extends Aggregate<State> {
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
        return { balance: this.state.balance + params.amount };
      }
    }

    return R.clone(state);
  }

  static get Type() {
    return AggregateType.AccountBalance;
  }

  static get InitialState() {
    return { balance: 0 };
  }

  async updateBalance(amount: number): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('BalanceUpdated');

    const balance = await this.state.balance;
    const calculatedBalance = balance + amount;

    if (calculatedBalance < 0) {
      throw new AppError(
        'INSUFFICIENT_BALANCE',
        'Updated balance amount results in negative amount',
        {
          calculatedBalance,
        }
      );
    }

    try {
      await this.eventStore.createEvent(
        nextEvent({
          amount,
        })
      );
    } catch (err) {
      if (err.code === 'EVENT_VERSION_EXISTS') {
        return this.updateBalance(amount);
      }

      throw err;
    }
  }
}
