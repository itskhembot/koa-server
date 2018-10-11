import chai, { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import RequestModel from '../../src/models/request';

chai.use(chaiAsPromised);

describe('idempotency', () => {
    describe('Given fake request', () => {
      const fakeModel = sinon.fake(async () => {
        return RequestModel.findOne({ where: { id: args.request } })
      });
      const fakeHandler = sinon.fake(async (obj: any, args: any) => {
        return args;
      });
      const { default: idempotency } = proxyquire(
        '../../../src/lib/request',
        {
          'request': { default: fakeModel },
        }
      );
  
      const args = {
        request: 'd4bc436a-f43e-4461-a8bc-a91ec19ab1b4',
        account: 'acc_8aa1eaad-36e6-487a-b6f0-3e66a6c83c2d',
        context: 'Lorem ipsum dolor set amet.',
        amount: 385,
      };
  
      it('should call out fakes', async () => {
        const response = await idempotency(args, fakeHandler);
  
        expect(fakeModel.calledOnce).to.be.true;
        expect(fakeHandler.calledOnce).to.be.true;
        expect(response.body).is.not.null;
      });
    });
  
    
  });