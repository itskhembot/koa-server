import AccountModel from '../models/account';
import ReservedBalanceModel from '../models/reserved-balance';
import VirtualBalanceModel from '../models/virtual-balance';

export default {
  account: async (obj: any, args: { id: string }) =>
    AccountModel.findOne({ where: { id: args.id } }),
  reservedBalance: async (obj: any, args: { id: string }) =>
    ReservedBalanceModel.findOne({
      where: { id: args.id },
    }),
  reservedBalances: async (obj: any, args: { account: string }) =>
    ReservedBalanceModel.findAll({
      where: { account: args.account },
    }),
  virtualBalance: async (obj: any, args: { id: string }) =>
    VirtualBalanceModel.findOne({
      where: { id: args.id },
    }),
  virtualBalances: async (obj: any, args: { account: string }) =>
    VirtualBalanceModel.findAll({
      where: { account: args.account },
    }),
};
