import VirtualBalanceModel from '../models/virtual-balance';
import uuid from 'uuid';



export async function createVirtual(obj: any, args: { request: string, account: string, context: string, amount: number }){
    let virtualBalance;
    const generatedId = uuid();
    try {
      virtualBalance = await VirtualBalanceModel.create({
        id:`vir_${generatedId}`,
        account: args.account,
        context: args.context,
        balance: args.amount,
        isCommit: false
      });
    } catch (err) {
      virtualBalance = err.message;
    }
    return virtualBalance;
  };
  export async function updateVirtual(obj: any, args: { request: string, account: string, context: string, amount: number }){
    let virtualBalance;
    try {
      const [, [updatedVirtualBalance]] = await VirtualBalanceModel.update({
        balance: args.amount,
      }, {
        where: { account: args.account, context: args.context },
        returning: true,
      });
      virtualBalance = updatedVirtualBalance;
    } catch (err) {
      virtualBalance = err.message;
    }
    return virtualBalance;
  };
  export async function cancelVirtual(obj: any, args: { request: string, account: string, context: string }){
    try {
      await VirtualBalanceModel.destroy(
        { where: { account: args.account, context: args.context } },
      );
    } catch (err) {
      return err.message;
    }
    return true;
  };
  export async function commitVirtual(obj: any, args: { request: string, account: string, context: string }){
    try {
      await VirtualBalanceModel.update({
        isCommit: true,
      }, { where: { account: args.account, context: args.context } });
    } catch (err) {
      return err.message;
    }
    return true;
  };
