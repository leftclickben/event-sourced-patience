import { APIGatewayProxyHandler } from 'aws-lambda';
import { checkArguments, checkEnvironment, httpHandler, success } from '../util';
import { forfeitGame } from '../../../commands/processors/forfeitGame';

// This function is named after the HTTP verb being used; the game is actually forfeited, not deleted as such
export const deleteGameHandler: APIGatewayProxyHandler = httpHandler(async ({ pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId } = pathParameters || {};

  checkArguments({ gameId });

  await forfeitGame({ gameId });

  return success();
});
