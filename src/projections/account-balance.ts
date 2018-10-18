import { Projection, AggregateType, Event } from 'onewallet.library.framework';

import eventStore from '../lib/event-store';
import sequelize from '../lib/sequelize';
import AccountModel from '../models/account';

class AccountBalanceProjection extends Projection {
  constructor() {
    super(eventStore, sequelize, {
      id: 'AccountBalance',
      types: [AggregateType.AccountBalance],
    });
  }

  async apply(event: Event<{ amount: number }>) {
    if (event.type === 'BalanceUpdated') {
      await AccountModel.update(
        {
          balance: event.body.amount,
        },
        { where: { id: event.aggregate.id } }
      );
    }
  }
}

export default new AccountBalanceProjection();
