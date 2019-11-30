import * as cuid from 'cuid';
import { GameEventBase, GameEventType, GameId, Suit, Value } from '../types';

// The `eventTimestamp` is the range (sort) key, so creating multiple events in the same millisecond will cause
// conflicts.  Use a synthetic timestamp to generate unique timestamp values for initial events.  Start from a minute
// ago so that timestamps don't collide with actual events created during gameplay.
let syntheticTimestamp = Date.now() - 60000;

export const createGameEventBase = <T extends GameEventType = GameEventType>(
  gameId: GameId,
  eventType: T
): GameEventBase<T> => ({
  gameId,
  eventType,
  eventId: cuid(),
  eventTimestamp: ++syntheticTimestamp
});

export const gameCreatedTableau = [
  [
    { value: Value.five, suit: Suit.diamonds, faceUp: true }
  ],
  [
    { value: Value.six, suit: Suit.hearts, faceUp: false },
    { value: Value.four, suit: Suit.hearts, faceUp: true }
  ],
  [
    { value: Value.jack, suit: Suit.hearts, faceUp: false },
    { value: Value.three, suit: Suit.hearts, faceUp: false },
    { value: Value.six, suit: Suit.spades, faceUp: true }
  ],
  [
    { value: Value.seven, suit: Suit.diamonds, faceUp: false },
    { value: Value.ten, suit: Suit.diamonds, faceUp: false },
    { value: Value.nine, suit: Suit.spades, faceUp: false },
    { value: Value.king, suit: Suit.diamonds, faceUp: true }
  ],
  [
    { value: Value.seven, suit: Suit.hearts, faceUp: false },
    { value: Value.queen, suit: Suit.clubs, faceUp: false },
    { value: Value.seven, suit: Suit.spades, faceUp: false },
    { value: Value.eight, suit: Suit.clubs, faceUp: false },
    { value: Value.ace, suit: Suit.diamonds, faceUp: true }
  ],
  [
    { value: Value.king, suit: Suit.clubs, faceUp: false },
    { value: Value.nine, suit: Suit.clubs, faceUp: false },
    { value: Value.four, suit: Suit.diamonds, faceUp: false },
    { value: Value.queen, suit: Suit.spades, faceUp: false },
    { value: Value.four, suit: Suit.spades, faceUp: false },
    { value: Value.five, suit: Suit.spades, faceUp: true }
  ],
  [
    { value: Value.two, suit: Suit.hearts, faceUp: false },
    { value: Value.king, suit: Suit.spades, faceUp: false },
    { value: Value.two, suit: Suit.spades, faceUp: false },
    { value: Value.ace, suit: Suit.spades, faceUp: false },
    { value: Value.ace, suit: Suit.hearts, faceUp: false },
    { value: Value.jack, suit: Suit.clubs, faceUp: false },
    { value: Value.three, suit: Suit.diamonds, faceUp: true }
  ]
];

export const gameCreatedStock = [
  { value: Value.ten, suit: Suit.hearts, faceUp: false },
  { value: Value.ten, suit: Suit.spades, faceUp: false },
  { value: Value.two, suit: Suit.diamonds, faceUp: false },
  { value: Value.three, suit: Suit.clubs, faceUp: false },
  { value: Value.six, suit: Suit.diamonds, faceUp: false },
  { value: Value.ten, suit: Suit.clubs, faceUp: false },
  { value: Value.four, suit: Suit.clubs, faceUp: false },
  { value: Value.queen, suit: Suit.diamonds, faceUp: false},
  { value: Value.five, suit: Suit.clubs, faceUp: false },
  { value: Value.queen, suit: Suit.hearts, faceUp: false },
  { value: Value.eight, suit: Suit.spades, faceUp: false },
  { value: Value.king, suit: Suit.hearts, faceUp: false },
  { value: Value.jack, suit: Suit.spades, faceUp: false },
  { value: Value.two, suit: Suit.clubs, faceUp: false },
  { value: Value.nine, suit: Suit.hearts, faceUp: false },
  { value: Value.eight, suit: Suit.hearts, faceUp: false },
  { value: Value.seven, suit: Suit.clubs, faceUp: false },
  { value: Value.ace, suit: Suit.clubs, faceUp: false },
  { value: Value.eight, suit: Suit.diamonds, faceUp: false },
  { value: Value.three, suit: Suit.spades, faceUp: false },
  { value: Value.five, suit: Suit.hearts, faceUp: false },
  { value: Value.jack, suit: Suit.diamonds, faceUp: false },
  { value: Value.nine, suit: Suit.diamonds, faceUp: false },
  { value: Value.six, suit: Suit.clubs, faceUp: false }
];

export const createGameNoMovesMade = (gameId: GameId) => [
  {
    ...createGameEventBase(gameId, GameEventType.gameCreated),
    tableau: gameCreatedTableau,
    stock: gameCreatedStock
  }
];

export const createGamePlayedToVictory = (gameId: GameId) => [
  {
    ...createGameEventBase(gameId, GameEventType.gameCreated),
    tableau: gameCreatedTableau,
    stock: gameCreatedStock
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 2,
    count: 1,
    fromIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 5,
    count: 1,
    fromIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 4,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    toIndex: 0,
    count: 1,
    fromIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 1,
    count: 3,
    fromIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 2,
    count: 1,
    fromIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 2,
    count: 1,
    fromIndex: 6
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 0,
    count: 1,
    fromIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 6
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 6,
    count: 2,
    fromIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.wasteResetToStock)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 6
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToFoundation),
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 6,
    count: 4,
    fromIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 6
  },
  {
    ...createGameEventBase(gameId, GameEventType.wasteResetToStock)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 6,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 3,
    count: 1,
    fromIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToFoundation),
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 5,
    count: 9,
    fromIndex: 6
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 6,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 6,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 6,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 1,
    count: 1,
    fromIndex: 6
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 6,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wasteResetToStock)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wasteResetToStock)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 0,
    count: 1,
    fromIndex: 4
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 1,
    count: 2,
    fromIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 0,
    count: 1,
    fromIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 0,
    count: 2,
    fromIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 4,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 4,
    count: 1,
    fromIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 5,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 4
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.wasteResetToStock)
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 4
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToFoundation),
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.stockDealtToWaste)
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 4
  },
  {
    ...createGameEventBase(gameId, GameEventType.wastePlayedToTableau),
    tableauIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 3,
    count: 7,
    fromIndex: 5
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToTableau),
    toIndex: 2,
    count: 5,
    fromIndex: 4
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 4,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 3,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 1,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 3,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 1,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 3,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 1,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 3,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 1,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 3,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 1,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 3,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 0,
    foundationIndex: 0
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 1,
    foundationIndex: 3
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 2,
    foundationIndex: 2
  },
  {
    ...createGameEventBase(gameId, GameEventType.tableauPlayedToFoundation),
    tableauIndex: 3,
    foundationIndex: 1
  },
  {
    ...createGameEventBase(gameId, GameEventType.victoryClaimed)
  }
];
