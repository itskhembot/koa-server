import AccountModel from '../models/account';

export async function retrieveBalance(id: String): Promise<number> {
    const account = (await AccountModel.findOne({
        where: { id },
      })) as any
    return account.balance;
}