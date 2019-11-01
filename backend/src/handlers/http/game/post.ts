import { constants } from 'http2';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createGame } from '../../../commands/processors/createGame';
import { checkEnvironment, httpHandler, success } from '../util';
import { buildTableState } from '../../../state/table';
import { buildScoreState } from '../../../state/score';

export const postGameHandler: APIGatewayProxyHandler = httpHandler(async () => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const createGameEvent = await createGame();

  return success({
    gameId: createGameEvent.gameId,
    table: buildTableState([createGameEvent]),
    score: buildScoreState([createGameEvent]).score
  }, constants.HTTP_STATUS_CREATED);
});
