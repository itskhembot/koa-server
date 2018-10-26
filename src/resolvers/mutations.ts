import AggregateFactory from '../lib/aggregate-factory';
import {
  AccountBalanceAggregate,
  ReservedBalanceAggregate,
} from '../../src/aggregates';
import { idempotency } from '../lib/request';

import {
  createVirtual,
  updateVirtual,
  cancelVirtual,
  commitVirtual,
} from '../lib/virtual-balance';

export default {
  updateBalance: async (
    obj: any,
    args: { request: string; account: string; amount: number }
  ) =>
    idempotency(args, async function(
      obj: any,
      args: { request: string; account: string; amount: number }
    ) {
      const aggregate = (await AggregateFactory.findOrCreateAggregate(
        AccountBalanceAggregate,
        args.account
      )) as AccountBalanceAggregate;
      await aggregate.updateBalance(args.amount);
      await aggregate.fold();
      return aggregate.state.balance;
    }),
  createReservedBalance: async (
    obj: any,
    args: { request: string; account: string; context: string; amount: number }
  ) =>
    idempotency(args, async function(
      obj: any,
      args: {
        request: string;
        account: string;
        context: string;
        amount: number;
      }
    ) {
      const aggregate = (await AggregateFactory.findOrCreateAggregate(
        ReservedBalanceAggregate,
        args.account
      )) as ReservedBalanceAggregate;
      await aggregate.create(args.account, args.context, args.amount);
      await aggregate.fold();
      if (aggregate.state) {
        return {
          id: aggregate.id,
          account: args.account,
          context: args.context,
          balance: aggregate.state.balance,
          isReleased: aggregate.state.isReleased,
        };
      }
    }),
  updateReservedBalance: async (
    obj: any,
    args: { request: string; account: string; context: string; amount: number }
  ) =>
    idempotency(args, async function(
      obj: any,
      args: {
        request: string;
        account: string;
        context: string;
        amount: number;
      }
    ) {
      const aggregate = (await AggregateFactory.findOrCreateAggregate(
        ReservedBalanceAggregate,
        args.account
      )) as ReservedBalanceAggregate;
      await aggregate.update(args.account, args.context, args.amount);
      await aggregate.fold();
      if (aggregate.state) {
        return {
          id: aggregate.id,
          account: args.account,
          context: args.context,
          balance: aggregate.state.balance,
          isReleased: aggregate.state.isReleased,
        };
      }
    }),
  releaseReservedBalance: async (
    obj: any,
    args: { request: string; account: string; context: string }
  ) =>
    idempotency(args, async function(
      obj: any,
      args: {
        request: string;
        account: string;
        context: string;
        amount: number;
      }
    ) {
      const aggregate = (await AggregateFactory.findOrCreateAggregate(
        ReservedBalanceAggregate,
        args.account
      )) as ReservedBalanceAggregate;
      await aggregate.release(args.account, args.context);
      await aggregate.fold();
      if (aggregate.state) {
        return aggregate.state.isReleased;
      }
    }),
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
