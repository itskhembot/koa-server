import { OnewalletEventStore } from 'onewallet.library.framework';

import rabbit from './rabbit';

export default new OnewalletEventStore(rabbit, 'onewallet.account');
