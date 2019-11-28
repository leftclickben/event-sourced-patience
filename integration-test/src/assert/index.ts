import { expectedEventsPerGame } from './expected';
import { loadEvents } from '../services/database';
import { TableName } from 'aws-sdk/clients/dynamodb';
import { assert } from 'chai';

export const assertEvents = async (tableName: TableName) =>
  Object.keys(expectedEventsPerGame).reduce(
    async (promise, gameId) => {
      await promise;
      const events = await loadEvents(tableName, gameId);
      const actual = events.map(({ eventId, eventTimestamp, ...event }) => event);
      const expected = expectedEventsPerGame[gameId].map((event) => ({ gameId, ...event }));
      assert.deepEqual(actual, expected, `Incorrect events found for game "${gameId}"`);
    },
    Promise.resolve()
  );
