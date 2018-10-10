import { idempotency } from '../lib/request';
import { updateBalanceTable } from '../lib/account';
import { createReserved, updateReserved, releaseReserved } from '../lib/reserved-balance';
import { createVirtual, updateVirtual, cancelVirtual, commitVirtual } from '../lib/virtual-balance';

export default {
  updateBalance: async (obj: any, args: { request: string, account: string, amount: number }) => 
    idempotency(args, updateBalanceTable)
  ,
  createReservedBalance: async (obj: any, args: { request: string, account: string, context: string, amount: number }) => 
    idempotency(args, createReserved)
  ,
  updateReservedBalance: async (obj: any, args: { request: string, account: string, context: string, amount: number }) => 
    idempotency(args, updateReserved)
  ,
  releaseReservedBalance: async (obj: any, args: { request: string, account: string, context: string }) => 
    idempotency(args, releaseReserved)
  ,
  createVirtualBalance: async (obj: any, args: { request: string, account: string, context: string, amount: number }) => 
    idempotency(args, createVirtual)
  ,
  updateVirtualBalance: async (obj: any, args: { request: string, account: string, context: string, amount: number }) => 
    idempotency(args, updateVirtual)
  ,
  cancelVirtualBalance: async (obj: any, args: { request: string, account: string, context: string }) => 
    idempotency(args, cancelVirtual)
  ,
  commitVirtualBalance: async (obj: any, args: { request: string, account: string, context: string }) => 
    idempotency(args, commitVirtual)
  ,
};
