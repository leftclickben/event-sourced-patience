import { GameId } from '../game/types';
import { DynamoDB } from 'aws-sdk';
import { GameEvent } from './types';

export const loadEvents = async (gameId: GameId, startKey?: DynamoDB.DocumentClient.Key): Promise<GameEvent[]> => {
  const { Items: items, LastEvaluatedKey: lastKey } = await new DynamoDB.DocumentClient()
    .query({
      TableName: process.env.DB_TABLE_EVENTS as string,
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
    ...(lastKey ? await loadEvents(gameId, lastKey) : [])
  ];
};
