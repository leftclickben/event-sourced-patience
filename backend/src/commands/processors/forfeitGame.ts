import { CommandProcessor, ForfeitGameCommand } from '../types';
import { GameEventType, GameForfeitedEvent } from '../../events/types';
import { loadEvents, saveEvent } from '../../events/store';
import { validateParameters, validateGameExists, validateGameNotForfeited } from '../validation';

export const forfeitGame: CommandProcessor<ForfeitGameCommand, GameForfeitedEvent> =
  async ({ gameId }) => {
    validateParameters({ gameId });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotForfeited(events);

    return await saveEvent<GameEventType.gameForfeited, GameForfeitedEvent>(
      GameEventType.gameForfeited,
      { gameId });
  };
