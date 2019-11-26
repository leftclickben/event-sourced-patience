import { GameEventType } from '../../backend/src/events/types';
import { createGameEventBase, createGameEvents } from './events';
import { saveEvents } from './database';

export const saveSeedData = async () => {
  // A game that has only been created.
  await saveEvents(
    'c000000000000000000000000',
    [
      createGameEventBase('c000000000000000000000000', GameEventType.gameCreated)
    ]);

  // A game that has been created and forfeited.
  await saveEvents(
    'c000000000000000000010000',
    [
      createGameEventBase('c000000000000000000010000', GameEventType.gameCreated),
      createGameEventBase('c000000000000000000010000', GameEventType.gameForfeited)
    ]);

  // A game that has been created and partially played.
  await saveEvents(
    'c000000000000000000020000',
    createGameEvents('c000000000000000000020000').slice(0, 10));

  // A game that has been created and completed to victory.
  await saveEvents(
    'c000000000000000000030000',
    createGameEvents('c000000000000000000030000'));
};

if (require.main === module) {
  saveSeedData()
    .then(() => console.info('Database seed data saved'))
    .catch((error) => console.error(`Could not save database seed data: ${error}`));
}
