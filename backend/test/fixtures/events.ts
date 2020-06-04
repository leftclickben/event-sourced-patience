import { GameCreatedEvent, GameEvent, GameEventType, GameForfeitedEvent } from '../../src/events/types';
import { GameId, Suit, Value } from '../../src/game/types';

export const createSampleCreateGameEvent = (gameId: GameId = 'game-42') => ({
  gameId,
  eventTimestamp: 1571753807473,
  eventType: GameEventType.gameCreated,
  tableau: [
    [
      { suit: Suit.diamonds, value: Value.ace, faceUp: true }
    ],
    [
      { suit: Suit.diamonds, value: Value.queen, faceUp: false },
      { suit: Suit.diamonds, value: Value.seven, faceUp: true }
    ],
    [
      { suit: Suit.spades, value: Value.five, faceUp: false },
      { suit: Suit.spades, value: Value.ten, faceUp: false },
      { suit: Suit.spades, value: Value.jack, faceUp: true }
    ],
    [
      { suit: Suit.diamonds, value: Value.five, faceUp: false },
      { suit: Suit.spades, value: Value.ace, faceUp: false },
      { suit: Suit.diamonds, value: Value.ten, faceUp: false },
      { suit: Suit.diamonds, value: Value.king, faceUp: true }
    ]
  ],
  stock: [
    { suit: Suit.diamonds, value: Value.three, faceUp: false },
    { suit: Suit.spades, value: Value.six, faceUp: false },
    { suit: Suit.spades, value: Value.eight, faceUp: false },
    { suit: Suit.spades, value: Value.four, faceUp: false },
    { suit: Suit.diamonds, value: Value.four, faceUp: false },
    { suit: Suit.spades, value: Value.queen, faceUp: false },
    { suit: Suit.diamonds, value: Value.two, faceUp: false },
    { suit: Suit.spades, value: Value.three, faceUp: false },
    { suit: Suit.spades, value: Value.king, faceUp: false },
    { suit: Suit.diamonds, value: Value.jack, faceUp: false },
    { suit: Suit.spades, value: Value.two, faceUp: false },
    { suit: Suit.diamonds, value: Value.eight, faceUp: false },
    { suit: Suit.spades, value: Value.seven, faceUp: true }
  ]
} as GameCreatedEvent);

export const createSampleForfeitGameEvent = (gameId: GameId = 'game-42') => ({
  gameId,
  eventTimestamp: 1571753807473,
  eventType: GameEventType.gameForfeited
} as GameForfeitedEvent);

export const createSampleGameplayEvent = <TEventType extends GameEventType, TEvent extends GameEvent<TEventType>>(
  eventType: TEventType,
  gameId: GameId = 'game-42',
  args: Record<Exclude<keyof TEvent, keyof GameEvent>, any> = {} as any // args must be supplied where applicable
) => ({
  gameId,
  eventTimestamp: 1571753807474,
  eventType,
  ...args
} as TEvent);
