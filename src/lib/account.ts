import AccountModel from '../models/account';
import sequelize from './sequelize';

  export async function updateBalanceTable(obj: any, args: { request: string, account: string, amount: number }) {
    try {
      const [, [account]] = await AccountModel.update({
          balance: sequelize.literal(`balance + ${args.amount}`)
        }, { where: { id: args.account } ,
        returning: true,}) as any;

        return account.balance;
      
    } catch (err) {
      throw new Error(err.message);
    }
    return 0;
  };
