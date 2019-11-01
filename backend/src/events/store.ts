import { DynamoDB } from 'aws-sdk';
import { GameEvent, GameEventType, GeneratedEventProperties } from './types';
import { GameId } from '../game/types';
import { createEvent } from './util';

const createClient = () => new DynamoDB.DocumentClient();

export const saveEvent = async <
  TEventType extends GameEventType,
  TEvent extends GameEvent<TEventType>
> (
  eventType: TEventType,
  params: Omit<TEvent, GeneratedEventProperties>
) => {
  const event = createEvent(eventType, params);
  await createClient()
    .put({
      TableName: process.env.DB_TABLE_EVENTS as string,
      Item: event
    })
    .promise();
  return event;
};

export const loadEvents = async (gameId: GameId, startKey?: DynamoDB.DocumentClient.Key): Promise<GameEvent[]> => {
  const { Items: items, LastEvaluatedKey: lastKey } = await createClient()
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
