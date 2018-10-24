import AggregateType from 'onewallet.library.framework';
import sinon from 'sinon';

export default function(eventStore: any, sequelize: any): any {
  const fakeFindOrCreateAggregate = sinon.fake(
    async (aggregateClass: any, account: string) => {
      return {
        state: { balance: 500 },
        version: 101,
        id: account,
        type: AggregateType,
        toJSON: {},
      };
    }
  );
  return {
    findOrCreateAggregate: fakeFindOrCreateAggregate,
    reset: () => {
      fakeFindOrCreateAggregate.resetHistory();
    },
  };
}
