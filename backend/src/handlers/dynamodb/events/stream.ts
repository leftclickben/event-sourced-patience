import { DynamoDBStreamHandler } from 'aws-lambda';
import { GameEvent } from '../../../events/types';
import { loadAggregates, saveAggregates } from '../../../state/aggregates/persistence';
import { buildAggregates } from '../../../state/aggregates';

const stripTypes = (input: Record<string, any>) => Object.keys(input).reduce((result, key) => ({ ...result, [key]: input[key][Object.keys(input[key])[0]] }), {});

export const handler: DynamoDBStreamHandler = async ({ Records: records }) => {
  const aggregates = await loadAggregates() || {};

  const events = records
    .map(({ dynamodb }) => (dynamodb ? stripTypes(dynamodb.NewImage as Record<string, any>) : undefined))
    .filter((x) => !!x) as GameEvent[];

  const newAggregates = await buildAggregates(events, aggregates);

  await saveAggregates(newAggregates);
};
