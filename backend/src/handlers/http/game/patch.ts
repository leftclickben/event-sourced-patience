import { loadEvents } from '../../../events/load';
import { buildTableState } from '../../../state/table';
import { buildScoreState } from '../../../state/score';
import { GameplayCommandName } from '../../../commands/types';
import { getCommandProcessor } from '../../../commands/processors';
import { APIGatewayProxyHandlerWithData, checkArguments, checkEnvironment, wrapHttpHandler } from '../helpers';

export const patchGameHandler: APIGatewayProxyHandlerWithData = async ({ data, pathParameters }) => {
  checkEnvironment(['DB_TABLE_EVENTS']);

  const { gameId, moveType } = pathParameters;
  checkArguments({ gameId, moveType });

  const commandProcessor = getCommandProcessor(moveType as GameplayCommandName);
  const events = await loadEvents(gameId);
  const addedEvent = await commandProcessor({ gameId, ...data as any });
  const newEvents = [...events, addedEvent];

  const { score, status } = buildScoreState(newEvents);
  const table = buildTableState(newEvents);

  return {
    data: { gameId, score, status, table }
  };
};

export const handler = wrapHttpHandler(patchGameHandler);
