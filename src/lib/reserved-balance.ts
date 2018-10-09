import ReservedBalanceModel from '../models/reserved-balance';
import uuid from 'uuid';

  export async function createReserved(obj: any, args: { request: string, account: string, context: string, amount: number }){
    let reservedBalance;
    const generatedId = uuid();
    try {
      reservedBalance = await ReservedBalanceModel.create({
        id:`res_${generatedId}`,
        account: args.account,
        context: args.context,
        balance: args.amount,
        isReleased: false
      });
    } catch (err) {
      reservedBalance = err.message;
    }
    return reservedBalance;
  };
  export async function updateReserved(obj: any, args: { request: string, account: string, context: string, amount: number }){
    let reservedBalance;
    try {
      const [, [updatedReservedBalance]] = await ReservedBalanceModel.update({
        balance: args.amount,
      }, {
        where: { account: args.account, context: args.context },
        returning: true,
      });
      reservedBalance = updatedReservedBalance;
    } catch (err) {
      reservedBalance = err.message;
    }
    return reservedBalance;
  };
  export async function releaseReserved(obj: any, args: { request: string, account: string, context: string }){
    try {
      await ReservedBalanceModel.update({
        isReleased: true,
      }, { where: { account: args.account, context: args.context } });
    } catch (err) {
      return err.message;
    }
    return true;
  };
