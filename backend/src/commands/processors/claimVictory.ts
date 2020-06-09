import { ClaimVictoryCommand, CommandProcessor } from '../types';
import { GameEventType, VictoryClaimedEvent } from '../../events/types';
import {
  validateAllFaceUp,
  validateEmpty,
  validateGameExists,
  validateGameNotFinished,
  validateParameters
} from '../validation';
import { saveEvent } from '../../events/save';
import { loadEvents } from '../../events/load';
import { buildTableState } from '../../state/table';

export const claimVictory: CommandProcessor<ClaimVictoryCommand, VictoryClaimedEvent> =
  async ({ gameId }) => {
    validateParameters({ gameId });

    const events = await loadEvents(gameId);
    validateGameExists(events);
    validateGameNotFinished(events);

    const { stock, tableau, waste } = buildTableState(events);
    validateEmpty(stock, 'Stock');
    validateEmpty(waste, 'Waste');
    tableau.forEach((column, index) => validateAllFaceUp(column, `Tableau ${index + 1}`));

    return await saveEvent<GameEventType.victoryClaimed, VictoryClaimedEvent>(
      GameEventType.victoryClaimed,
      { gameId });
  };
