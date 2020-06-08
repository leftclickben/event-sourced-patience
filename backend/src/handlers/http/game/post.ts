import { constants } from 'http2';
import { createGame } from '../../../commands/processors/createGame';
import { buildTableState } from '../../../state/table';
import { buildScoreState } from '../../../state/score';
import { APIGatewayProxyHandlerWithData, checkEnvironment, wrapHttpHandler } from '../helpers';

export const postGameHandler: APIGatewayProxyHandlerWithData = async () => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const createGameEvent = await createGame();
  const gameId = createGameEvent.gameId;
  const { score, status } = buildScoreState([createGameEvent]);
  const table = buildTableState([createGameEvent]);

  return {
    statusCode: constants.HTTP_STATUS_CREATED,
    data: { gameId, score, status, table }
  };
};

export const handler = wrapHttpHandler(postGameHandler);
