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

import ReservedBalanceModel from '../models/reserved-balance';

type State = {
  id: ID;
  account: string;
  context: string;
  balance: number;
  isReleased: boolean;
};

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
        return event.body as State;
      }
    }

    return R.clone(state);
  }

  static get Type() {
    return AggregateType.ReservedBalance;
  }

  static get InitialState() {
    return {
      id: null,
      account: null,
      context: null,
      balance: 0,
      isReleased: false,
    };
  }

  async createReservedBalance(
    id: ID,
    account: string,
    context: string
  ): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('ReservedBalanceCreated');
    if (this.state) {
      throw new AppError(
        'RESERVED_BALANCE_EXISTS',
        'Reserved Balance already exists',
        {
          id,
        }
      );
    }
    const reservedBalance = await ReservedBalanceModel.findOne({
      where: { account, context },
    });
    if (reservedBalance) {
      throw new AppError(
        'RESERVED_BALANCE_CONSTRAINT_EXISTS',
        `Account - Context combination already exists ${account}, ${context}`,
        {
          id,
        }
      );
    }

    try {
      await this.eventStore.createEvent(
        nextEvent({
          id,
          account,
          context,
        })
      );
    } catch (err) {
      if (err.code === 'EVENT_VERSION_EXISTS') {
        return this.createReservedBalance(id, account, context);
      }

      throw err;
    }
  }
}
