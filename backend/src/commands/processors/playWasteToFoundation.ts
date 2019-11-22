import { CommandProcessor, PlayWasteToFoundationCommand } from '../types';
import { GameEventType, WastePlayedToFoundationEvent } from '../../events/types';
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

export const playWasteToFoundation: CommandProcessor<PlayWasteToFoundationCommand, WastePlayedToFoundationEvent> =
  async ({ gameId, foundationIndex }) => {
    validateParameters({ gameId, foundationIndex });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { waste, foundation } = buildTableState(events);
    validateNonEmpty(waste, 'Waste');
    const foundationSlot = foundation[foundationIndex];
    validateCompatibleWithFoundation(waste[waste.length - 1], foundationSlot[foundationSlot.length - 1]);

    return await saveEvent<GameEventType.wastePlayedToFoundation, WastePlayedToFoundationEvent>(
      GameEventType.wastePlayedToFoundation,
      { gameId, foundationIndex });
  };
