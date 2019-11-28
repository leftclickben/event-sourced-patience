import { createGameEventBase, createGameEvents } from '../events';
import { saveEvents } from '../services/database';
import { GameEventType } from '../types';
import { TableName } from 'aws-sdk/clients/dynamodb';

export const initialiseDatabase = async (tableName: TableName) => {
  // A game that has only been created.
  await saveEvents(
    tableName,
    'c000000000000000000000000',
    [
      createGameEventBase('c000000000000000000000000', GameEventType.gameCreated)
    ]);

  // A game that has been created and forfeited.
  await saveEvents(
    tableName,
    'c000000000000000000010000',
    [
      createGameEventBase('c000000000000000000010000', GameEventType.gameCreated),
      createGameEventBase('c000000000000000000010000', GameEventType.gameForfeited)
    ]);

  // A game that has been created and partially played.
  await saveEvents(
    tableName,
    'c000000000000000000020000',
    createGameEvents('c000000000000000000020000').slice(0, 10));

  // A game that has been created and completed to victory.
  await saveEvents(
    tableName,
    'c000000000000000000030000',
    createGameEvents('c000000000000000000030000'));
};
