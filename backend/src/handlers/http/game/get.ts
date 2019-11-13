import { loadEvents } from '../../../events/store';
import { buildTableState } from '../../../state/table';
import { checkArguments, checkEnvironment, checkResultArray } from '../util';
import { buildScoreState } from '../../../state/score';
import { APIGatewayProxyHandlerWithData, wrapHttpHandler } from '../wrap';

export const getGameHandler: APIGatewayProxyHandlerWithData = async ({ pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId } = pathParameters || {};

  checkArguments({ gameId });

  const events = await loadEvents(gameId);

  checkResultArray(events, `Game ${gameId} not found`);

  return {
    data: {
      gameId,
      table: buildTableState(events),
      score: buildScoreState(events).score
    }
  };
};

export const handler = wrapHttpHandler(getGameHandler);
