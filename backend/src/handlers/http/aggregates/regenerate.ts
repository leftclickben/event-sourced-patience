import { APIGatewayProxyHandlerWithData, checkEnvironment, wrapHttpHandler } from '../helpers';
import { scanEvents } from '../../../events/scan';
import { GameEventType } from '../../../events/types';
import { buildAggregates } from '../../../state/aggregates';
import { saveAggregates } from '../../../state/aggregates/persistence';

export const regenerateAggregatesHandler: APIGatewayProxyHandlerWithData = async ({}) => {
  checkEnvironment(['DB_TABLE_EVENTS', 'BUCKET_AGGREGATES']);
  const events = await scanEvents(
    'eventType',
    [GameEventType.gameCreated, GameEventType.gameForfeited, GameEventType.victoryClaimed]);
  const aggregates = await buildAggregates(events);
  await saveAggregates(aggregates);
  return { data: aggregates };
};

export const handler = wrapHttpHandler(regenerateAggregatesHandler);
