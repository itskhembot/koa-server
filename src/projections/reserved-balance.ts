import { Projection, AggregateType, Event } from 'onewallet.library.framework';

import eventStore from '../lib/event-store';
import sequelize from '../lib/sequelize';
import ReservedBalanceModel from '../models/reserved-balance';
import { v4 as uuid } from 'uuid';

export default class ReservedBalanceProjection extends Projection {
  constructor() {
    super(eventStore, sequelize, {
      id: 'ReservedBalance',
      types: [AggregateType.ReservedBalance],
    });
  }

  async apply(
    event: Event<{ account: string; context: string; amount: number }>
  ) {
    if (event.type === 'ReservedBalanceCreated') {
      await ReservedBalanceModel.create({
        id: `res_${uuid()}`,
        account: event.body.account,
        context: event.body.context,
        balance: event.body.amount,
        isReleased: false,
      });
    }
    if (event.type === 'ReservedBalanceUpdated') {
      await ReservedBalanceModel.update(
        {
          balance: sequelize.literal(`balance + ${event.body.amount}`),
        },
        {
          where: {
            id: event.aggregate.id,
          },
        }
      );
    }
    if (event.type === 'ReservedBalanceReleased') {
      await ReservedBalanceModel.update(
        {
          isReleased: true,
        },
        {
          where: {
            id: event.aggregate.id,
          },
        }
      );
    }
  }
}
