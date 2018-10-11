import chai, { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import uuid from 'uuid';
import casual from 'casual';

chai.use(chaiAsPromised);

describe('Reserved Balance', () => {
  describe('createReserve', () => {
    describe('Given arguments', () => {
      const fakeCreate = sinon.fake(async (obj: any, args: any) => {
        return args;
      });
      const fakeModel = { create: fakeCreate };
      const { createReserved } = proxyquire('../../src/lib/reserved-balance', {
        '../models/reserved-balance': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
        amount: Math.random() * (500 - 5) + 5,
      };

      it('should return arguments', async () => {
        const response = await createReserved(null, args);

        expect(fakeCreate.lastCall.lastArg).to.have.property(
          'account',
          args.account
        );
        expect(fakeCreate.lastCall.lastArg).to.have.property(
          'context',
          args.context
        );
        expect(fakeCreate.lastCall.lastArg).to.have.property(
          'balance',
          args.amount
        );
        expect(fakeCreate.calledOnce).to.be.true;
        expect(response).is.not.null;
      });
    });

    describe('Given bad arguments', () => {
      const fakeCreate = sinon.fake(async (obj: any, args: any) => null);
     
      const fakeModel = { create: fakeCreate };
      const { createReserved } = proxyquire('../../src/lib/reserved-balance', {
        '../models/reserved-balance': { default: fakeModel },
      });

      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
        amount: Math.random() * (500 - 5) + 5,
      };

      it('should return null', async () => {
        const response = await createReserved(null, args);

        expect(fakeCreate.calledOnce).to.be.true;
        expect(response).is.null;
      });
    });
  });
  describe('updateReserve', () => {
    describe('Given arguments', () => {
      const fakeUpdate = sinon.fake(async (obj: any, args: any) => {
        return args;
      });
      const fakeModel = { update: fakeUpdate };
      const { updateReserved } = proxyquire('../../src/lib/reserved-balance', {
        '../models/reserved-balance': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
        amount: Math.random() * (500 - 5) + 5,
      };

      it('should return arguments', async () => {
        const response = await updateReserved(null, args);

        expect(fakeUpdate.calledOnce).to.be.true;
        expect(response).is.not.null;
      });
    });
  });
  describe('releaseReserve', () => {
    describe('Given arguments', () => {
      const fakeUpdate = sinon.fake(async (obj: any, args: any) => {
        return true;
      });
      const fakeModel = { update: fakeUpdate };
      const { releaseReserved } = proxyquire('../../src/lib/reserved-balance', {
        '../models/reserved-balance': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
      };

      it('should return true', async () => {
        const response = await releaseReserved(null, args);

        expect(fakeUpdate.calledOnce).to.be.true;
        expect(response).is.true;
      });
    });
  });
});
