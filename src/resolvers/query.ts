import AccountModel from '../models/account';
import ReservedBalanceModel from '../models/reserved-balance';
import VirtualBalanceModel from '../models/virtual-balance';

export default{
  account: async (...args: any[]) => (
    AccountModel.findOne({ where: { id: (<any>Object).values(args[1]) } })),
  reservedBalance: async (...args: any[]) => (
    ReservedBalanceModel.findOne({ where: { id: (<any>Object).values(args[1]) } })),
  reservedBalances: async (...args: any[]) => (
    ReservedBalanceModel.findAll({ where: { account: (<any>Object).values(args[1]) } })),
    virtualBalance: async (...args: any[]) => (
      VirtualBalanceModel.findOne({ where: { id: (<any>Object).values(args[1]) } })),
    virtualBalances: async (...args: any[]) => (
      VirtualBalanceModel.findAll({ where: { account: (<any>Object).values(args[1]) } })),
}
