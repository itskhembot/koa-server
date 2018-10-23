import { AggregateFactory } from 'onewallet.library.framework';

import EventStore from '../lib/event-store';
import sequelize from '../lib/sequelize';

export default new AggregateFactory(EventStore, sequelize);
