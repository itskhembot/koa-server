import { v4 as uuid } from 'uuid';

export default function(params: {
  id?: string;
  type?: string;
  timestamp?: number;
  aggregate?: {
    id: string;
    type: number;
    version: number;
  };
  body?: {};
}) {
  return {
    id: uuid(),
    type: 'TestEvent',
    timestamp: Date.now(),
    aggregate: {
      id: uuid(),
      type: 9999,
      version: 0,
    },
    body: {},
    ...params,
  };
}
