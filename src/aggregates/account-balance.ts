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

import { updateBalanceTable } from '../lib/account';
import RequestModel from '../models/request';

type State = {
  request: ID;
  account: ID;
  amount: Number;
} | null;

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
      case 'UpdateBalance': {
        return event.body as State;
      }
    }

    return R.clone(state);
  }

  static get Type() {
    return AggregateType.AccountBalance;
  }

  static get InitialState() {
    return null;
  }

  async updateBalance(obj: any, args: { request: string, account: string, amount: number }): Promise<void> {
    await this.fold();
    const nextEvent = this.nextEvent('UpdateBalance');

    const request = (await RequestModel.findOne({
      where: { id: args.request },
    })) as any;

    let result;
    let error;
    if (request) {
      if(request.result) {
        result = request.result;
      }
      if(request.error){
        error = request.error;
        throw new AppError('REQUEST_ALREADY_EXISTS', 'Error Result', {
          error,
        });
      }
    }
    else{
      try {
        result = await updateBalanceTable(null, args);
      } catch (err) {
        error = err;
        result = err;
      }
      await RequestModel.create({
        id: args.request,
        result,
        error,
      });
    }

    try {
      await this.eventStore.createEvent(
        nextEvent({
          result
        })
      );
    } catch (err) {
      throw err;
    }
  }
}
