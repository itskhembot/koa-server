import { Projection, AggregateType, Event } from 'onewallet.library.framework';

import eventStore from '../lib/event-store';
import sequelize from '../lib/sequelize';
import { idempotency } from '../lib/request';
import { updateBalanceTable } from '../lib/account';

class AccountBalanceProjection extends Projection {
  constructor() {
    super(eventStore, sequelize, {
      id: 'AccountBalance',
      types: [AggregateType.AccountBalance],
    });
  }

  async apply(event: Event<{ account: string; username: string }>) {
    if (event.type === 'BalanceUpdated') {
      updateBalance: async (
        obj: any,
        args: { request: string; account: string; amount: number }
      ) => {
        return idempotency(args, updateBalanceTable);
      };
    }
  }
}

export default new AccountBalanceProjection();
