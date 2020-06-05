import { loadEvents } from '../../../events/load';
import { buildTableState } from '../../../state/table';
import { buildScoreState } from '../../../state/score';
import {
  APIGatewayProxyHandlerWithData,
  checkArguments,
  checkEnvironment,
  checkResultArray,
  wrapHttpHandler
} from '../helpers';

export const getGameHandler: APIGatewayProxyHandlerWithData = async ({ pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId } = pathParameters;

  checkArguments({ gameId });

  const events = await loadEvents(gameId);

  checkResultArray(events, `Game ${gameId} not found`);

  const { score, status } = buildScoreState(events);
  const table = buildTableState(events);

  return {
    data: { gameId, score, status, table }
  };
};

export const handler = wrapHttpHandler(getGameHandler);
