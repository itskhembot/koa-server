import AccountModel from '../models/account';

export default{
  account: async ({}, args: { id: string }) => (
    AccountModel.findOne({ where: { id: args.id } })),
}
