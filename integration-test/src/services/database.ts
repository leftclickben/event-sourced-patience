import { DynamoDB } from 'aws-sdk';
import { GameEvent, GameId } from '../types';
import { TableName } from 'aws-sdk/clients/dynamodb';

export const saveEvents = async (
  tableName: TableName,
  gameId: GameId,
  events: GameEvent[]
) => {
  await new DynamoDB.DocumentClient()
    .batchWrite({
      RequestItems: {
        [tableName]: events
          .slice(0, 25)
          .map((event) => ({
            PutRequest: {
              Item: event
            }
          }))
      }
    })
    .promise();

  if (events.length > 25) {
    await saveEvents(tableName, gameId, events.slice(25));
  }
};

export const loadEvents = async (
  tableName: TableName,
  gameId: GameId,
  startKey?: DynamoDB.DocumentClient.Key
): Promise<GameEvent[]> => {
  const { Items: items, LastEvaluatedKey: lastKey } = await new DynamoDB.DocumentClient()
    .query({
      TableName: tableName,
      ExclusiveStartKey: startKey,
      KeyConditionExpression: '#key = :key',
      ExpressionAttributeNames: {
        '#key': 'gameId'
      },
      ExpressionAttributeValues: {
        ':key': gameId
      }
    })
    .promise();

  return [
    ...(items || []) as GameEvent[],
    ...(lastKey ? await loadEvents(tableName, gameId, lastKey) : [])
  ];
};
