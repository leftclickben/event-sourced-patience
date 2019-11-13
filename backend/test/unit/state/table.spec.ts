import { expect } from 'chai';
import { buildTableState } from '../../../src/state/table';
import { GameStatus, Suit, Value } from '../../../src/game/types';
import {
  GameEventType,
  StockDealtToWasteEvent,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent
} from '../../../src/events/types';
import { createSampleCreateGameEvent } from '../../fixtures/events';
import { TableState } from '../../../src/state/table/types';

describe('The table state builder', () => {
  describe('When provided an empty list of events', () => {
    let state: TableState;

    beforeEach(() => {
      state = buildTableState([]);
    });

    it('Returns the initial state', () => {
      expect(state).to.deep.equal({
        status: GameStatus.none,
        tableau: [],
        foundation: [],
        stock: [],
        waste: []
      });
    });
  });

  describe('When provided a single creation event', () => {
    let state: TableState;

    beforeEach(() => {
      state = buildTableState([
        createSampleCreateGameEvent()
      ]);
    });

    it('Returns the resulting state', () => {
      expect(state).to.deep.equal({
        status: GameStatus.inProgress,
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
        foundation: [[], [], [], []],
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
        ],
        waste: []
      })
    });
  });

  describe('When provide a list of multiple events', () => {
    let state: TableState;

    beforeEach(() => {
      state = buildTableState([
        createSampleCreateGameEvent(),
        {
          eventId: '2',
          eventTimestamp: 1571753807474,
          eventType: GameEventType.tableauPlayedToFoundation,
          gameId: 'game-42',
          tableauIndex: 0,
          foundationIndex: 0
        } as TableauPlayedToFoundationEvent,
        {
          eventId: '3',
          eventTimestamp: 1571753807476,
          eventType: GameEventType.tableauPlayedToTableau,
          gameId: 'game-42',
          fromIndex: 3,
          count: 1,
          toIndex: 0
        } as TableauPlayedToTableauEvent,
        {
          eventId: '4',
          eventTimestamp: 1571753807475,
          eventType: GameEventType.tableauPlayedToTableau,
          gameId: 'game-42',
          fromIndex: 3,
          count: 1,
          toIndex: 2
        } as TableauPlayedToTableauEvent,
        {
          eventId: '5',
          eventTimestamp: 1571753807474,
          eventType: GameEventType.tableauPlayedToFoundation,
          gameId: 'game-42',
          tableauIndex: 3,
          foundationIndex: 1
        } as TableauPlayedToFoundationEvent,
        {
          eventId: '6',
          eventTimestamp: 1571753807477,
          eventType: GameEventType.stockDealtToWaste,
          gameId: 'game-42'
        } as StockDealtToWasteEvent
      ]);
    });

    it('Returns the resulting state', () => {
      expect(state).to.deep.equal({
        status: GameStatus.inProgress,
        tableau: [
          [
            { suit: Suit.diamonds, value: Value.king, faceUp: true }
          ],
          [
            { suit: Suit.diamonds, value: Value.queen, faceUp: false },
            { suit: Suit.diamonds, value: Value.seven, faceUp: true }
          ],
          [
            { suit: Suit.spades, value: Value.five, faceUp: false },
            { suit: Suit.spades, value: Value.ten, faceUp: false },
            { suit: Suit.spades, value: Value.jack, faceUp: true },
            { suit: Suit.diamonds, value: Value.ten, faceUp: true }
          ],
          [
            { suit: Suit.diamonds, value: Value.five, faceUp: true }
          ]
        ],
        foundation: [
          [
            { suit: Suit.diamonds, value: Value.ace, faceUp: true }
          ],
          [
            { suit: Suit.spades, value: Value.ace, faceUp: true }
          ],
          [],
          []
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
        ],
        waste: [
          { suit: Suit.spades, value: Value.seven, faceUp: false },
          { suit: Suit.diamonds, value: Value.eight, faceUp: true },
          { suit: Suit.spades, value: Value.two, faceUp: true }
        ]
      })
    });
  });
});
