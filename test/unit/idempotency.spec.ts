import chai, { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe.only('idempotency', () => {
  describe('Given existing request ID', () => {
    const fakeFindOne = sinon.fake(async () => ({result:{}}));
    const fakeModel = { findOne: fakeFindOne };
    const fakeHandler = sinon.fake(async (obj: any, args: any) => {
      return args;
    });
    const { idempotency } = proxyquire(
      '../../src/lib/request',
      {
        '../models/request': { default: fakeModel },
      }
    );

    const args = {
      request: 'f04826fa-9fef-428e-8f71-19c1149ee522',
      account: 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db',
      context: 'Animi praesentium et earum qui quo earum vero.',
      amount: 385,
    };

    it('should call out fakes and return existing result', async () => {
      const response = await idempotency(args, fakeHandler);

      expect(fakeFindOne.calledOnce).to.be.true;
      expect(fakeHandler.calledOnce).to.be.false;
      expect(response.body).is.not.null;
    });
  });

  describe('Given new request ID', () => {
    const fakeFindOne = sinon.fake(async () => null);
    const fakeCreate = sinon.fake(async () => ({}));
    const fakeModel = { findOne: fakeFindOne, create: fakeCreate };
    const fakeHandler = sinon.fake(async (obj: any, args: any) => {
      return args;
    });
    const { idempotency } = proxyquire(
      '../../src/lib/request',
      {
        '../models/request': { default: fakeModel },
      }
    );

    const args = {
      request: 'f04826fa-9fef-428e-8f71-19c1149ee522',
      account: 'acc_01770e44-b3eb-4351-8a2f-8f1ed45097db',
      context: 'Animi praesentium et earum qui quo earum vero.',
      amount: 385,
    };

    it('should call handler', async () => {
      const response = await idempotency(args, fakeHandler);

      expect(fakeFindOne.calledOnce).to.be.true;
      expect(fakeHandler.calledOnce).to.be.true;
      expect(fakeCreate.calledOnce).to.be.true;
      expect(fakeCreate.lastCall.lastArg).to.have.property('id', args.request);
      expect(response.body).is.not.null;
    });
  });
});
