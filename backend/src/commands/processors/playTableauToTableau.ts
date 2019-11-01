import { CommandProcessor, PlayTableauToTableauCommand } from '../types';
import { GameEventType, TableauPlayedToTableauEvent } from '../../events/types';
import { loadEvents, saveEvent } from '../../events/store';
import {
  validateCompatibleWithTableau,
  validateGameExists,
  validateGameNotFinished,
  validateLength,
  validateParameters
} from '../validation';
import { buildTableState } from '../../state/table';

export const playTableauToTableau: CommandProcessor<PlayTableauToTableauCommand, TableauPlayedToTableauEvent> =
  async ({ gameId, fromIndex, count, toIndex }) => {
    validateParameters({ gameId, fromIndex, count, toIndex });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { tableau } = buildTableState(events);
    validateLength(tableau[fromIndex].filter(({ faceUp }) => faceUp), count, `Tableau ${fromIndex + 1}`);
    validateCompatibleWithTableau(tableau[fromIndex][tableau[fromIndex].length - count], tableau[toIndex][tableau[toIndex].length - 1]);

    return await saveEvent<GameEventType.tableauPlayedToTableau, TableauPlayedToTableauEvent>(
      GameEventType.tableauPlayedToTableau,
      { gameId, fromIndex, count, toIndex });
  };
