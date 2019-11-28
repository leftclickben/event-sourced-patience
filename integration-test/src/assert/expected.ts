import { GameEvent, GameEventType, GameId } from '../types';
import { GameCreatedEvent, GameForfeitedEvent } from '../../../backend/src/events/types';

type ExpectedEventDetails<T extends GameEvent = GameEvent> = Omit<T, 'eventId' | 'eventTimestamp' | 'gameId'>;

export const expectedEventsPerGame: Record<GameId, ExpectedEventDetails[]> = {
  c000000000000000000000000: [
    {
      eventType: GameEventType.gameCreated
    } as ExpectedEventDetails<GameCreatedEvent>,
    {
      eventType: GameEventType.gameForfeited
    } as ExpectedEventDetails<GameForfeitedEvent>
  ]
};
