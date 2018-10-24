import AggregateType from 'onewallet.library.framework';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';

export default function(): any {
  const fakeFindOrCreateAggregate = sinon.fake(() => Promise.resolve());
  return {
    id: uuid(),
    type: AggregateType,
    toJSON: {},
    findOrCreateAggregate: fakeFindOrCreateAggregate,
    reset: () => {
      fakeFindOrCreateAggregate.resetHistory();
    },
  };
}
