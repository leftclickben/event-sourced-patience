import { CommandProcessor, ResetWasteToStockCommand } from '../types';
import { GameEventType, WasteResetToStockEvent } from '../../events/types';
import { loadEvents } from '../../events/load';
import { saveEvent } from '../../events/save';
import { validateGameExists, validateGameNotFinished, validateNonEmpty, validateParameters } from '../validation';
import { buildTableState } from '../../state/table';

export const resetWasteToStock: CommandProcessor<ResetWasteToStockCommand, WasteResetToStockEvent> =
  async ({ gameId }) => {
    validateParameters({ gameId });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { waste } = buildTableState(events);
    validateNonEmpty(waste, 'Waste');

    return await saveEvent<GameEventType.wasteResetToStock, WasteResetToStockEvent>(
      GameEventType.wasteResetToStock,
      { gameId });
  };
