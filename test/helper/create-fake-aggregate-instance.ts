import { v4 as uuid } from 'uuid';
import sinon from 'sinon';

export default function(params: {
  id?: string;
  state?: any;
  version?: number;
  type: number;
}): any {
  let state = null;
  let version = 0;

  const fakeReload = sinon.fake(() => Promise.resolve());
  const fakeUpdate = sinon.fake(async (values: any) => {
    state = values.state;
    version = values.version;
    return [1];
  });

  return {
    id: uuid(),
    state,
    version,
    ...params,
    reload: fakeReload,
    sequelize: {
      models: {
        Aggregate: {
          update: fakeUpdate,
        },
      },
    },
    reset: () => {
      fakeUpdate.resetHistory();
      fakeUpdate.resetHistory();
    },
  };
}