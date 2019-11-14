import { CommandProcessor, DealStockToWasteCommand } from '../types';
import { GameEventType, StockDealtToWasteEvent } from '../../events/types';
import { loadEvents, saveEvent } from '../../events';
import { validateGameExists, validateGameNotFinished, validateNonEmpty, validateParameters } from '../validation';
import { buildTableState } from '../../state/table';

export const dealStockToWaste: CommandProcessor<DealStockToWasteCommand, StockDealtToWasteEvent> =
  async ({ gameId }) => {
    validateParameters({ gameId });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { stock } = buildTableState(events);
    validateNonEmpty(stock, 'Stock');

    return await saveEvent<GameEventType.stockDealtToWaste, StockDealtToWasteEvent>(
      GameEventType.stockDealtToWaste,
      { gameId });
  };
