import { DynamoDB } from 'aws-sdk';
import { GameEvent, GameEventType, GeneratedEventProperties } from './types';
import * as cuid from 'cuid';

export const saveEvent = async <
  TEventType extends GameEventType,
  TEvent extends GameEvent<TEventType>
> (
  eventType: TEventType,
  params: Omit<TEvent, GeneratedEventProperties>
) => {
  const event = {
    eventId: cuid(),
    eventTimestamp: Date.now(),
    eventType,
    ...params
  } as TEvent;

  await new DynamoDB.DocumentClient()
    .put({
      TableName: process.env.DB_TABLE_EVENTS as string,
      Item: event
    })
    .promise();

  return event;
};
