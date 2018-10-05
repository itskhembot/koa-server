import AccountModel from '../models/account';

export default{
  account: async ({}, args: { id: string }) => {
    return AccountModel.findOne({ where: { id: args.id } });
  },
  hello: async ({}, args: { id: any }) => {
    //  const account = AccountModel.findOne({ where: { id: "acc_01770e44-b3eb-4351-8a2f-8f1ed45097db" } });
    //  return account.toString(); // this works, returns promise object
    return args.id.toString(); // doesnt work same error Cannot destructure 'undefined' or 'null'.
  },
}
