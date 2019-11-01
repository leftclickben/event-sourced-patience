import { APIGatewayProxyHandler } from 'aws-lambda';
import { loadEvents } from '../../../events/store';
import { buildTableState } from '../../../state/table';
import { checkArguments, checkEnvironment, checkResultArray, httpHandler, success } from '../util';
import { buildScoreState } from '../../../state/score';

export const getGameHandler: APIGatewayProxyHandler = httpHandler(async ({ pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId } = pathParameters || {};

  checkArguments({ gameId });

  const events = await loadEvents(gameId);

  checkResultArray(events, `Game ${gameId} not found`);

  return success({
    gameId,
    table: buildTableState(events),
    score: buildScoreState(events).score
  });
});
