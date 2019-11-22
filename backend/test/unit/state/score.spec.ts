import { expect } from 'chai';
import {
  GameEventType,
  StockDealtToWasteEvent,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent
} from '../../../src/events/types';
import { createSampleCreateGameEvent } from '../../fixtures/events';
import { ScoreState } from '../../../src/state/score/types';
import { buildScoreState } from '../../../src/state/score';

describe('The score state builder', () => {
  describe('When provided an empty list of events', () => {
    let state: ScoreState;

    beforeEach(() => {
      state = buildScoreState([]);
    });

    it('Returns the initial state', () => {
      expect(state).to.deep.equal({
        score: 0,
        tableau: []
      });
    });
  });

  describe('When provided a single creation event', () => {
    let state: ScoreState;

    beforeEach(() => {
      state = buildScoreState([
        createSampleCreateGameEvent()
      ]);
    });

    it('Returns the initial state', () => {
      expect(state).to.deep.equal({
        score: 0,
        tableau: [
          { faceDown: 0, faceUp: 1 },
          { faceDown: 1, faceUp: 1 },
          { faceDown: 2, faceUp: 1 },
          { faceDown: 3, faceUp: 1 }
        ]
      });
    });
  });

  describe('When provide a list of multiple events', () => {
    let state: ScoreState;

    beforeEach(() => {
      state = buildScoreState([
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
        score: 35,
        tableau: [
          { faceDown: 0, faceUp: 1 },
          { faceDown: 1, faceUp: 1 },
          { faceDown: 2, faceUp: 2 },
          { faceDown: 0, faceUp: 1 }
        ]
      });
    });
  });
});
