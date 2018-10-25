import AggregateType from 'onewallet.library.framework';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';

export default function(): any {
  const fakeFindOrCreateAggregate = sinon.fake(async () => {
    return {
      id: uuid(),
      type: AggregateType,
      state: { balance: 500 },
      toJSON: {},
    };
  });
  return {
    findOrCreateAggregate: fakeFindOrCreateAggregate,
    reset: () => {
      fakeFindOrCreateAggregate.resetHistory();
    },
  };
}
