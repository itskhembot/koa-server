import chai, { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import uuid from 'uuid';
import casual from 'casual';

chai.use(chaiAsPromised);

describe('idempotency', () => {
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
    const id = uuid();  
    const args = {
      request: uuid(),
      account: `acc_${id}`,
      context: casual.sentence,
      amount: Math.random() * (500 - 5) + 5,
    };

    it('should call out fakes and return existing result', async () => {
      const response = await idempotency(args, fakeHandler);

      expect(fakeFindOne.calledOnce).to.be.true;
      expect(fakeHandler.calledOnce).to.be.false;
      expect(response).is.not.null;
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

    const id = uuid();  
    const args = {
      request: uuid(),
      account: `acc_${id}`,
      context: casual.sentence,
      amount: Math.random() * (500 - 5) + 5,
    };

    it('should call handler', async () => {
      const response = await idempotency(args, fakeHandler);

      expect(fakeFindOne.calledOnce).to.be.true;
      expect(fakeHandler.calledOnce).to.be.true;
      expect(fakeCreate.calledOnce).to.be.true;
      expect(fakeCreate.lastCall.lastArg).to.have.property('id', args.request);
      expect(response).is.not.null;
    });
  });
});
