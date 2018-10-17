import sinon from 'sinon';
import { Event } from 'onewallet.library.framework';
import { v4 as uuid } from 'uuid';
import R from 'ramda';

export default function(initialEvents: Array<Event>): any {
  let events = R.clone(initialEvents);

  const fakeRetrieveEvents = sinon.fake(async () => {
    return events;
  });
  const fakeCreateEvent = sinon.fake(async (event: Event) => {
    events.push({
      ...event,
      id: uuid(),
      timestamp: Date.now(),
    });
  });

  return {
    retrieveEvents: fakeRetrieveEvents,
    createEvent: fakeCreateEvent,
    reset: () => {
      events = R.clone(initialEvents);
      fakeRetrieveEvents.resetHistory();
      fakeCreateEvent.resetHistory();
    },
  };
}