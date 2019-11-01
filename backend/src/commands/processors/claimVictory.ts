import { ClaimVictoryCommand, CommandProcessor } from '../types';
import { GameEventType, VictoryClaimedEvent } from '../../events/types';
import { validateGameExists, validateGameNotFinished, validateLength, validateParameters } from '../validation';
import { loadEvents, saveEvent } from '../../events/store';
import { buildTableState } from '../../state/table';

export const claimVictory: CommandProcessor<ClaimVictoryCommand, VictoryClaimedEvent> =
  async ({ gameId }) => {
    validateParameters({ gameId });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { foundation } = buildTableState(events);
    foundation.forEach((pile, index) => validateLength(pile, 13, `Foundation ${index + 1}`));

    return await saveEvent<GameEventType.victoryClaimed, VictoryClaimedEvent>(
      GameEventType.victoryClaimed,
      { gameId });
  };
