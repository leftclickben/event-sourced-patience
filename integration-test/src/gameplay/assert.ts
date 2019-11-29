import { GameData, GameId, OutputTapes } from '../types';
import { TableName } from 'aws-sdk/clients/dynamodb';
import { loadEvents } from '../services/database';
import { assert } from 'chai';
import * as chalk from 'chalk';

export const assertGameResult = async (
  gameId: GameId,
  { expectedOutputTape, expectedErrorTape, expectedEvents }: GameData,
  { outputTape, errorTape }: OutputTapes,
  tableName: TableName
): Promise<void> => {
  assert.deepEqual(
    outputTape,
    expectedOutputTape,
    `Output stream tape does not match for game "${gameId}`);
  process.stdout.write(chalk.gray('.'));

  assert.deepEqual(
    errorTape,
    expectedErrorTape,
    `Error stream tape does not match for game "${gameId}`);
  process.stdout.write(chalk.gray('.'));

  const events = await loadEvents(tableName, gameId);

  assert.deepEqual(
    events.map(({ eventId, eventTimestamp, ...event }) => event),
    expectedEvents.map((event) => ({ gameId, ...event })),
    `Incorrect events found for game "${gameId}"`);
  process.stdout.write(chalk.gray('.'));

  console.log('');
};
