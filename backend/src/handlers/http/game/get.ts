import { loadEvents } from '../../../events/load';
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

  const { score, status } = buildScoreState(events);

  return {
    data: {
      gameId,
      score,
      status,
      table: buildTableState(events)
    }
  };
};

export const handler = wrapHttpHandler(getGameHandler);
