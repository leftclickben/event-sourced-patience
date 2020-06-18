import { DynamoDB } from 'aws-sdk';
import { GameEvent } from './types';

export const scanEvents = async (
  filterField: string,
  filterValues: string[],
  startKey?: DynamoDB.DocumentClient.Key
): Promise<GameEvent[]> => {
  const { Items: items, LastEvaluatedKey: lastKey } = await new DynamoDB.DocumentClient()
    .scan({
      TableName: process.env.DB_TABLE_EVENTS as string,
      ExclusiveStartKey: startKey,
      FilterExpression: filterValues
        .reduce<string[]>((parts, value, index) => [...parts, `#key${index} = :value${index}`], [])
        .join(' or '),
      ExpressionAttributeNames: filterValues
        .reduce((names, value, index) => ({ ...names, [`#key${index}`]: filterField }), {}),
      ExpressionAttributeValues: filterValues
        .reduce((values, value, index) => ({ ...values, [`:value${index}`]: value }), {})
    })
    .promise();

  return [
    ...(items || []) as GameEvent[],
    ...(lastKey ? await scanEvents(filterField, filterValues, lastKey) : [])
  ];
};
