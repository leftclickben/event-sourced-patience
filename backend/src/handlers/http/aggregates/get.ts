import { APIGatewayProxyHandlerWithData, checkEnvironment, wrapHttpHandler } from '../helpers';
import { loadAggregates } from '../../../state/aggregates/persistence';

export const getAggregatesHandler: APIGatewayProxyHandlerWithData = async ({}) => {
  checkEnvironment(['BUCKET_AGGREGATES']);
  const aggregates = await loadAggregates();
  return { data: aggregates };
};

export const handler = wrapHttpHandler(getAggregatesHandler);
