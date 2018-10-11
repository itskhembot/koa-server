import chai, { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import uuid from 'uuid';

chai.use(chaiAsPromised);

describe('Account', () => {
  describe('updateBalance', () => {
    describe('Given arguments', () => {
      const balance = 100;
      const fakeUpdate = sinon.fake(async (obj: any, args: any) => {
        return [null,[balance + args.amount]];
      });
      const fakeModel = { update: fakeUpdate };
      const { updateBalanceTable } = proxyquire('../../src/lib/account', {
        '../models/account': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        amount: Math.random() * (500 - 5) + 5,
      };

      it('should validate update', async () => {
        const response = await updateBalanceTable(null, args);
        expect(response).is.not.null;
        expect(fakeUpdate.calledOnce).to.be.true;
      });
    });
  });
});
