import { constants } from 'http2';
import { createGame } from '../../../commands/processors/createGame';
import { checkEnvironment } from '../util';
import { buildTableState } from '../../../state/table';
import { buildScoreState } from '../../../state/score';
import { APIGatewayProxyHandlerWithData, wrapHttpHandler } from '../wrap';

export const postGameHandler: APIGatewayProxyHandlerWithData = async () => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const createGameEvent = await createGame();

  return {
    statusCode: constants.HTTP_STATUS_CREATED,
    data: {
      gameId: createGameEvent.gameId,
      table: buildTableState([createGameEvent]),
      score: buildScoreState([createGameEvent]).score
    }
  };
};

export const handler = wrapHttpHandler(postGameHandler);
