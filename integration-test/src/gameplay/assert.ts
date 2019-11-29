import { GameData, GameId, OutputTapes } from '../types';
import { TableName } from 'aws-sdk/clients/dynamodb';
import { loadEvents } from '../services/database';
import { assert } from 'chai';
import { writeHeading, writeNewLine, writeProgress, writeSuccess } from '../ui';

export const assertGameResult = async (
  gameId: GameId,
  { expectedOutputTape, expectedErrorTape, expectedEvents }: GameData,
  { outputTape, errorTape }: OutputTapes,
  tableName: TableName,
  verbose: boolean
): Promise<void> => {
  writeHeading(`Checking result of game "${gameId}"`);

  assert.deepEqual(
    outputTape,
    expectedOutputTape,
    `Tape from output stream does not match for game "${gameId}`);

  writeProgress('Output tape valid', verbose);

  assert.deepEqual(
    errorTape,
    expectedErrorTape,
    `Tape from error stream does not match for game "${gameId}`);

  writeProgress('Error tape valid', verbose);

  const events = await loadEvents(tableName, gameId);

  assert.deepEqual(
    events.map(({ eventId, eventTimestamp, ...event }) => event),
    expectedEvents.map((event) => ({ gameId, ...event })),
    `Incorrect events found for game "${gameId}"`);

  writeProgress('Event store valid', verbose);
  writeNewLine();
  writeSuccess(`Game "${gameId}" validated`);
};
