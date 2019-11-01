import { CommandProcessor, ResetWasteToStockCommand } from '../types';
import { GameEventType, WasteResetToStockEvent } from '../../events/types';
import { loadEvents, saveEvent } from '../../events/store';
import { validateGameExists, validateGameNotForfeited, validateNonEmpty, validateParameters } from '../validation';
import { buildTableState } from '../../state/table';

export const resetWasteToStock: CommandProcessor<ResetWasteToStockCommand, WasteResetToStockEvent> =
  async ({ gameId }) => {
    validateParameters({ gameId });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotForfeited(events);

    const { waste } = buildTableState(events);
    validateNonEmpty(waste, 'Waste');

    return await saveEvent<GameEventType.wasteResetToStock, WasteResetToStockEvent>(
      GameEventType.wasteResetToStock,
      { gameId });
  };
