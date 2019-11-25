import { checkArguments, checkEnvironment } from '../util';
import { loadEvents } from '../../../events/load';
import { buildTableState } from '../../../state/table';
import { buildScoreState } from '../../../state/score';
import { GameplayCommandName } from '../../../commands/types';
import { playWasteToTableau } from '../../../commands/processors/playWasteToTableau';
import { playTableauToTableau } from '../../../commands/processors/playTableauToTableau';
import { playTableauToFoundation } from '../../../commands/processors/playTableauToFoundation';
import { playWasteToFoundation } from '../../../commands/processors/playWasteToFoundation';
import { dealStockToWaste } from '../../../commands/processors/dealStockToWaste';
import { resetWasteToStock } from '../../../commands/processors/resetWasteToStock';
import { claimVictory } from '../../../commands/processors/claimVictory';
import { APIGatewayProxyHandlerWithData, wrapHttpHandler } from '../wrap';

const getDelegation = (key: GameplayCommandName) => ({
  dealStockToWaste,
  resetWasteToStock,
  playWasteToTableau,
  playWasteToFoundation,
  playTableauToFoundation,
  playTableauToTableau,
  claimVictory
}[key]);

export const patchGameHandler: APIGatewayProxyHandlerWithData = async ({ data, pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId, moveType } = pathParameters || {};

  checkArguments({ gameId, moveType });

  const delegation = getDelegation(moveType as GameplayCommandName);

  const events = await loadEvents(gameId);

  const addedEvent = await delegation({ gameId, ...data as any });

  const { score, status } = buildScoreState([...events, addedEvent]);

  return {
    data: {
      gameId,
      score,
      status,
      table: buildTableState([...events, addedEvent])
    }
  };
};

export const handler = wrapHttpHandler(patchGameHandler);
