import { GameData, GameId, OutputTapes } from '../types';
import { TableName } from 'aws-sdk/clients/dynamodb';
import { loadEvents } from '../services/database';
import { assert } from 'chai';

export const assertGameTapes = (
  gameId: GameId,
  { expectedOutputTape, expectedErrorTape }: GameData,
  { outputTape, errorTape }: OutputTapes
): void => {
  assert.deepEqual(
    outputTape,
    expectedOutputTape,
    `Output stream tape does not match for game "${gameId}`);

  assert.deepEqual(
    errorTape,
    expectedErrorTape,
    `Error stream tape does not match for game "${gameId}`);
};

export const assertGameEvents = async (
  gameId: GameId,
  { expectedEvents }: GameData,
  tableName: TableName
): Promise<void> => {
  const events = await loadEvents(tableName, gameId);

  assert.deepEqual(
    events.map(({ eventId, eventTimestamp, ...event }) => event),
    expectedEvents.map((event) => ({ gameId, ...event })),
    `Incorrect events found for game "${gameId}"`);
};
