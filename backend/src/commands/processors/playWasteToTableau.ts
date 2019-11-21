import { CommandProcessor, PlayWasteToTableauCommand } from '../types';
import { GameEventType, WastePlayedToTableauEvent } from '../../events/types';
import { loadEvents } from '../../events/load';
import { saveEvent } from '../../events/save';
import {
  validateCompatibleWithTableau,
  validateGameExists,
  validateGameNotFinished,
  validateNonEmpty,
  validateParameters
} from '../validation';
import { buildTableState } from '../../state/table';

export const playWasteToTableau: CommandProcessor<PlayWasteToTableauCommand, WastePlayedToTableauEvent> =
  async ({ gameId, tableauIndex }) => {
    validateParameters({ gameId, tableauIndex });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { waste, tableau } = buildTableState(events);
    validateNonEmpty(waste, 'Waste');
    const tableauColumn = tableau[tableauIndex];
    validateCompatibleWithTableau(waste[waste.length - 1], tableauColumn[tableauColumn.length - 1]);

    return await saveEvent<GameEventType.wastePlayedToTableau, WastePlayedToTableauEvent>(
      GameEventType.wastePlayedToTableau,
      { gameId, tableauIndex });
  };
