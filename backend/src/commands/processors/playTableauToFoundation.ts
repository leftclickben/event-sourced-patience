import { CommandProcessor, PlayTableauToFoundationCommand } from '../types';
import { GameEventType, TableauPlayedToFoundationEvent } from '../../events/types';
import { loadEvents } from '../../events/load';
import { saveEvent } from '../../events/save';
import {
  validateCompatibleWithFoundation,
  validateGameExists,
  validateGameNotFinished,
  validateNonEmpty,
  validateParameters
} from '../validation';
import { buildTableState } from '../../state/table';

export const playTableauToFoundation: CommandProcessor<PlayTableauToFoundationCommand, TableauPlayedToFoundationEvent> =
  async ({ gameId, tableauIndex, foundationIndex }) => {
    validateParameters({ gameId, tableauIndex, foundationIndex });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { tableau, foundation } = buildTableState(events);
    const tableauColumn = tableau[tableauIndex];
    const foundationSlot = foundation[foundationIndex];
    validateNonEmpty(tableauColumn, `Tableau column ${tableauIndex}`);
    validateCompatibleWithFoundation(
      tableauColumn[tableauColumn.length - 1],
      foundationSlot[foundationSlot.length - 1]);

    return await saveEvent<GameEventType.tableauPlayedToFoundation, TableauPlayedToFoundationEvent>(
      GameEventType.tableauPlayedToFoundation,
      { gameId, tableauIndex, foundationIndex });
  };
