import { APIGatewayProxyHandler } from 'aws-lambda';
import { checkArguments, checkEnvironment, httpHandler, success } from '../util';
import { loadEvents } from '../../../events/store';
import { buildTableState } from '../../../state/table';
import { buildScoreState } from '../../../state/score';
import { GameEvent } from '../../../events/types';
import { CommandProcessor, GameplayCommandName } from '../../../commands/types';
import { playWasteToTableau } from '../../../commands/processors/playWasteToTableau';
import { playTableauToTableau } from '../../../commands/processors/playTableauToTableau';
import { playTableauToFoundation } from '../../../commands/processors/playTableauToFoundation';
import { playWasteToFoundation } from '../../../commands/processors/playWasteToFoundation';
import { dealStockToWaste } from '../../../commands/processors/dealStockToWaste';
import { resetWasteToStock } from '../../../commands/processors/resetWasteToStock';

const delegations: Record<GameplayCommandName, CommandProcessor<any, GameEvent>> = {
  dealStockToWaste,
  resetWasteToStock,
  playWasteToTableau,
  playWasteToFoundation,
  playTableauToFoundation,
  playTableauToTableau
};

export const patchGameHandler: APIGatewayProxyHandler = httpHandler(async ({ body, pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId, moveType } = pathParameters || {};

  checkArguments({ gameId, moveType });

  const parameters = body ? JSON.parse(body) : undefined;

  const events = await loadEvents(gameId);

  const addedEvent = await delegations[moveType as GameplayCommandName]({ gameId, ...parameters });

  return success({
    gameId,
    table: buildTableState([...events, addedEvent]),
    score: buildScoreState([...events, addedEvent]).score
  });
});
