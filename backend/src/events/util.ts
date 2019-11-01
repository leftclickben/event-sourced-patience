import * as cuid from 'cuid';
import { GameEvent, GameEventType, GeneratedEventProperties } from './types';

export const createEvent = <
  TEventType extends GameEventType,
  TEvent extends GameEvent<TEventType>
> (
  eventType: TEventType,
  params: Omit<TEvent, GeneratedEventProperties>
): TEvent => ({
  eventId: cuid(),
  eventTimestamp: Date.now(),
  eventType,
  ...params
} as TEvent);
