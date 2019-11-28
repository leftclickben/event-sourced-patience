import { GameEvent, GameEventType } from './types';

const idMap: Record<string, number> = {};

type GameEventBase = Pick<GameEvent, 'gameId' | 'eventType' | 'eventId' | 'eventTimestamp'>;

export const createGameEventBase = (gameId: string, eventType: GameEventType): GameEventBase => {
  const root = gameId.slice(0, -4);
  if (!idMap.hasOwnProperty(gameId)) {
    idMap[gameId] = 0;
  }
  const sequence = idMap[gameId]++;
  const padding = Array.from({ length: 4 - String(sequence).length }, () => '0').join('');
  return {
    gameId,
    eventType,
    eventId: `${root}${padding}${sequence}`,
    eventTimestamp: 1574691152612 + sequence
  };
};

export const createGameEvents = (gameId: string) => [
  {
    ...createGameEventBase(gameId, GameEventType.gameCreated),
    tableau: [
      [
        { value: 'five', suit: 'diamonds', faceUp: true }
      ],
      [
        { value: 'six', suit: 'hearts', faceUp: false },
        { value: 'four', suit: 'hearts', faceUp: true }
      ],
      [
        { value: 'jack', suit: 'hearts', faceUp: false },
        { value: 'three', suit: 'hearts', faceUp: false },
        { value: 'six', suit: 'spades', faceUp: true }
      ],
      [
        { value: 'seven', suit: 'diamonds', faceUp: false },
        { value: 'ten', suit: 'diamonds', faceUp: false },
        { value: 'nine', suit: 'spades', faceUp: false },
        { value: 'king', suit: 'diamonds', faceUp: true }
      ],
      [
        { value: 'seven', suit: 'hearts', faceUp: false },
        { value: 'queen', suit: 'clubs', faceUp: false },
        { value: 'seven', suit: 'spades', faceUp: false },
        { value: 'eight', suit: 'clubs', faceUp: false },
        { value: 'ace', suit: 'diamonds', faceUp: true }
      ],
      [
        { value: 'king', suit: 'clubs', faceUp: false },
        { value: 'nine', suit: 'clubs', faceUp: false },
        { value: 'four', suit: 'diamonds', faceUp: false },
        { value: 'queen', suit: 'spades', faceUp: false },
        { value: 'four', suit: 'spades', faceUp: false },
        { value: 'five', suit: 'spades', faceUp: true }
      ],
      [
        { value: 'two', suit: 'hearts', faceUp: false },
        { value: 'king', suit: 'spades', faceUp: false },
        { value: 'two', suit: 'spades', faceUp: false },
        { value: 'ace', suit: 'spades', faceUp: false },
        { value: 'ace', suit: 'hearts', faceUp: false },
        { value: 'jack', suit: 'clubs', faceUp: false },
        { value: 'three', suit: 'diamonds', faceUp: true }
      ]
    ],
    stock: [
      { value: 'ten', suit: 'hearts', faceUp: false },
      { value: 'ten', suit: 'spades', faceUp: false },
      { value: 'two', suit: 'diamonds', faceUp: false },
      { value: 'three', suit: 'clubs', faceUp: false },
      { value: 'six', suit: 'diamonds', faceUp: false },
      { value: 'ten', suit: 'clubs', faceUp: false },
      { value: 'four', suit: 'clubs', faceUp: false },
      { value: 'queen', suit: 'diamonds', faceUp: false},
      { value: 'five', suit: 'clubs', faceUp: false },
      { value: 'queen', suit: 'hearts', faceUp: false },
      { value: 'eight', suit: 'spades', faceUp: false },
      { value: 'king', suit: 'hearts', faceUp: false },
      { value: 'jack', suit: 'spades', faceUp: false },
      { value: 'two', suit: 'clubs', faceUp: false },
      { value: 'nine', suit: 'hearts', faceUp: false },
      { value: 'eight', suit: 'hearts', faceUp: false },
      { value: 'seven', suit: 'clubs', faceUp: false },
      { value: 'ace', suit: 'clubs', faceUp: false },
      { value: 'eight', suit: 'diamonds', faceUp: false },
      { value: 'three', suit: 'spades', faceUp: false },
      { value: 'five', suit: 'hearts', faceUp: false },
      { value: 'jack', suit: 'diamonds', faceUp: false },
      { value: 'nine', suit: 'diamonds', faceUp: false },
      { value: 'six', suit: 'clubs', faceUp: false }
    ]
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
