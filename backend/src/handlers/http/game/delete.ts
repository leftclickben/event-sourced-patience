import { forfeitGame } from '../../../commands/processors/forfeitGame';
import { APIGatewayProxyHandlerWithData, checkArguments, checkEnvironment, wrapHttpHandler } from '../helpers';

// This function is named after the HTTP verb being used; the game is actually forfeited, not deleted as such
export const deleteGameHandler: APIGatewayProxyHandlerWithData = async ({ pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId } = pathParameters;
  checkArguments({ gameId });

  await forfeitGame({ gameId });
};

export const handler = wrapHttpHandler(deleteGameHandler);
