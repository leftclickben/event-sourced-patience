import { CommandProcessor, PlayWasteToFoundationCommand } from '../types';
import { GameEventType, WastePlayedToFoundationEvent } from '../../events/types';
import { loadEvents, saveEvent } from '../../events/store';
import {
  validateParameters,
  validateGameExists,
  validateGameNotForfeited,
  validateCompatibleWithFoundation
} from '../validation';
import { buildTableState } from '../../state/table';

export const playWasteToFoundation: CommandProcessor<PlayWasteToFoundationCommand, WastePlayedToFoundationEvent> =
  async ({ gameId, foundationIndex }) => {
    validateParameters({ gameId, foundationIndex });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotForfeited(events);

    const { waste, foundation } = buildTableState(events);
    const foundationSlot = foundation[foundationIndex];
    validateCompatibleWithFoundation(waste[waste.length - 1], foundationSlot[foundationSlot.length - 1]);

    return await saveEvent<GameEventType.wastePlayedToFoundation, WastePlayedToFoundationEvent>(
      GameEventType.wastePlayedToFoundation,
      { gameId, foundationIndex });
  };
