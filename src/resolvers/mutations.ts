import { AggregateFactory } from 'onewallet.library.framework';

import { AccountBalanceAggregate } from '../../src/aggregates';
import EventStore from '../lib/event-store';
import { idempotency } from '../lib/request';
import {
  createReserved,
  updateReserved,
  releaseReserved,
} from '../lib/reserved-balance';
import {
  createVirtual,
  updateVirtual,
  cancelVirtual,
  commitVirtual,
} from '../lib/virtual-balance';

import sequelize from '../lib/sequelize';

export default {
  updateBalance: async (
    obj: any,
    args: { request: string; account: string; amount: number }
  ) => idempotency(args, updateBalanceTable),
  createReservedBalance: async (
    obj: any,
    args: { request: string; account: string; context: string; amount: number }
  ) => idempotency(args, createReserved),
  updateReservedBalance: async (
    obj: any,
    args: { request: string; account: string; context: string; amount: number }
  ) => idempotency(args, updateReserved),
  releaseReservedBalance: async (
    obj: any,
    args: { request: string; account: string; context: string }
  ) => idempotency(args, releaseReserved),
  createVirtualBalance: async (
    obj: any,
    args: { request: string; account: string; context: string; amount: number }
  ) => idempotency(args, createVirtual),
  updateVirtualBalance: async (
    obj: any,
    args: { request: string; account: string; context: string; amount: number }
  ) => idempotency(args, updateVirtual),
  cancelVirtualBalance: async (
    obj: any,
    args: { request: string; account: string; context: string }
  ) => idempotency(args, cancelVirtual),
  commitVirtualBalance: async (
    obj: any,
    args: { request: string; account: string; context: string }
  ) => idempotency(args, commitVirtual),
};

async function updateBalanceTable(
  obj: any,
  args: { request: string; account: string; amount: number }
) {
  const aggregateFactory = new AggregateFactory(EventStore, sequelize);
  const aggregate = await aggregateFactory.findOrCreateAggregate(
    AccountBalanceAggregate,
    args.account
  );
  aggregate.fold();
  return aggregate.state.balance;
}
