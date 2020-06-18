import { expect } from 'chai';
import {
  GameEventType,
  GameForfeitedEvent,
  StockDealtToWasteEvent,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent
} from '../../../../src/events/types';
import { createSampleCreateGameEvent } from '../../../fixtures/events';
import { ScoreState } from '../../../../src/state/score/types';
import { buildScoreState } from '../../../../src/state/score';
import { GameStatus } from '../../../../src/game/types';

describe('The score state builder', () => {
  describe('When provided an empty list of events', () => {
    let state: ScoreState;

    beforeEach(() => {
      state = buildScoreState([]);
    });

    it('Returns the initial state', () => {
      expect(state).to.deep.equal({
        score: 0,
        status: GameStatus.none,
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
        status: GameStatus.inProgress,
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
          eventTimestamp: 1571753807474,
          eventType: GameEventType.tableauPlayedToFoundation,
          gameId: 'game-42',
          tableauIndex: 0,
          foundationIndex: 0
        } as TableauPlayedToFoundationEvent, // 10 points for card played to foundation
        {
          eventTimestamp: 1571753807476,
          eventType: GameEventType.tableauPlayedToTableau,
          gameId: 'game-42',
          fromIndex: 3,
          count: 1,
          toIndex: 0
        } as TableauPlayedToTableauEvent, // 5 points for uncovered card
        {
          eventTimestamp: 1571753807475,
          eventType: GameEventType.tableauPlayedToTableau,
          gameId: 'game-42',
          fromIndex: 3,
          count: 1,
          toIndex: 2
        } as TableauPlayedToTableauEvent, // 5 points for uncovered card
        {
          eventTimestamp: 1571753807474,
          eventType: GameEventType.tableauPlayedToFoundation,
          gameId: 'game-42',
          tableauIndex: 3,
          foundationIndex: 1
        } as TableauPlayedToFoundationEvent, // 10 points for card played to foundation, 5 points for uncovered card
        {
          eventTimestamp: 1571753807477,
          eventType: GameEventType.stockDealtToWaste,
          gameId: 'game-42'
        } as StockDealtToWasteEvent // no point change
      ]);
    });

    it('Returns the resulting state', () => {
      expect(state).to.deep.equal({
        score: 30,
        status: GameStatus.inProgress,
        tableau: [
          { faceDown: 0, faceUp: 1 },
          { faceDown: 1, faceUp: 1 },
          { faceDown: 2, faceUp: 2 },
          { faceDown: 0, faceUp: 1 }
        ]
      });
    });
  });

  describe('When provide a list of multiple events ending in a "game forfeited" event', () => {
    let state: ScoreState;

    beforeEach(() => {
      state = buildScoreState([
        createSampleCreateGameEvent(),
        {
          eventTimestamp: 1571753807474,
          eventType: GameEventType.tableauPlayedToFoundation,
          gameId: 'game-42',
          tableauIndex: 0,
          foundationIndex: 0
        } as TableauPlayedToFoundationEvent, // 10 points for card played to foundation
        {
          eventTimestamp: 1571753807476,
          eventType: GameEventType.tableauPlayedToTableau,
          gameId: 'game-42',
          fromIndex: 3,
          count: 1,
          toIndex: 0
        } as TableauPlayedToTableauEvent, // 5 points for uncovered card
        {
          eventTimestamp: 1571753807475,
          eventType: GameEventType.tableauPlayedToTableau,
          gameId: 'game-42',
          fromIndex: 3,
          count: 1,
          toIndex: 2
        } as TableauPlayedToTableauEvent, // 5 points for uncovered card
        {
          eventTimestamp: 1571753807474,
          eventType: GameEventType.tableauPlayedToFoundation,
          gameId: 'game-42',
          tableauIndex: 3,
          foundationIndex: 1
        } as TableauPlayedToFoundationEvent, // 10 points for card played to foundation, 5 points for uncovered card
        {
          eventTimestamp: 1571753807477,
          eventType: GameEventType.stockDealtToWaste,
          gameId: 'game-42'
        } as StockDealtToWasteEvent, // no point change,
        {
          eventTimestamp: 1571753807478,
          eventType: GameEventType.gameForfeited,
          gameId: 'game-42'
        } as GameForfeitedEvent
      ]);
    });

    it('Returns the resulting state', () => {
      expect(state).to.deep.equal({
        score: 30,
        status: GameStatus.forfeited,
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
