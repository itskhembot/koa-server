import chai, { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import uuid from 'uuid';
import casual from 'casual';

chai.use(chaiAsPromised);

describe('Virtual Balance', () => {
  describe('createVirtual', () => {
    describe('Given arguments', () => {
      const fakeCreate = sinon.fake(async (obj: any, args: any) => {
        return args;
      });
      const fakeModel = { create: fakeCreate };
      const { createVirtual } = proxyquire('../../src/lib/virtual-balance', {
        '../models/virtual-balance': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
        amount: Math.random() * (500 - 5) + 5,
      };

      it('should return arguments', async () => {
        const response = await createVirtual(null, args);

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
      const { createVirtual } = proxyquire('../../src/lib/virtual-balance', {
        '../models/virtual-balance': { default: fakeModel },
      });

      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
        amount: Math.random() * (500 - 5) + 5,
      };

      it('should return null', async () => {
        const response = await createVirtual(null, args);

        expect(fakeCreate.calledOnce).to.be.true;
        expect(response).is.null;
      });
    });
  });
  describe('updateVirtual', () => {
    describe('Given arguments', () => {
      const fakeUpdate = sinon.fake(async (obj: any, args: any) => {
        return args;
      });
      const fakeModel = { update: fakeUpdate };
      const { updateVirtual } = proxyquire('../../src/lib/virtual-balance', {
        '../models/virtual-balance': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
        amount: Math.random() * (500 - 5) + 5,
      };

      it('should return arguments', async () => {
        const response = await updateVirtual(null, args);

        expect(fakeUpdate.calledOnce).to.be.true;
        expect(response).is.not.null;
      });
    });
  });
  describe('commitVirtual', () => {
    describe('Given arguments', () => {
      const fakeUpdate = sinon.fake(async (obj: any, args: any) => {
        return true;
      });
      const fakeModel = { update: fakeUpdate };
      const { commitVirtual } = proxyquire('../../src/lib/virtual-balance', {
        '../models/virtual-balance': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
      };

      it('should return true', async () => {
        const response = await commitVirtual(null, args);

        expect(fakeUpdate.calledOnce).to.be.true;
        expect(response).is.true;
      });
    });
  });
  describe('cancelVirtual', () => {
    describe('Given arguments', () => {
      const fakeDestroy = sinon.fake(async (obj: any, args: any) => {
        return true;
      });
      const fakeModel = { destroy: fakeDestroy };
      const { cancelVirtual } = proxyquire('../../src/lib/virtual-balance', {
        '../models/virtual-balance': { default: fakeModel },
      });
      const id = uuid();
      const args = {
        request: uuid(),
        account: `acc_${id}`,
        context: casual.sentence,
      };

      it('should return true', async () => {
        const response = await cancelVirtual(null, args);

        expect(fakeDestroy.calledOnce).to.be.true;
        expect(response).is.true;
      });
    });
  });
});
