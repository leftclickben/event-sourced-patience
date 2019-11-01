import {
  GameCreatedEvent,
  GameEvent, GameEventType,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent,
  WastePlayedToFoundationEvent,
  WastePlayedToTableauEvent
} from '../../events/types';
import { buildStateFromEvents } from '../util';
import { StateBuilder } from '../types';
import { ScoreState } from './types';

export const buildScoreState = (events: GameEvent[]) =>
  buildStateFromEvents<ScoreState>(
    {
      score: 0,
      tableau: []
    },
    {
      gameCreated,
      wastePlayedToTableau,
      wastePlayedToFoundation,
      tableauPlayedToFoundation,
      tableauPlayedToTableau
    } as Record<GameEventType, StateBuilder<ScoreState>>,
    events);

// Builder functions

const gameCreated: StateBuilder<ScoreState, GameCreatedEvent> =
  (_ignoreInitialState, { tableau }) => ({
    score: 0,
    tableau: Array.from(tableau, (column) => ({
      faceUp: column.filter(({ faceUp }) => faceUp).length,
      faceDown: column.filter(({ faceUp }) => !faceUp).length
    }))
  });

const wastePlayedToTableau: StateBuilder<ScoreState, WastePlayedToTableauEvent> =
  (state, { tableauIndex }) =>
    changeFaceUpTally(
      addScore(state, 5),
      tableauIndex,
      1);

const wastePlayedToFoundation: StateBuilder<ScoreState, WastePlayedToFoundationEvent> =
  (state) => addScore(state, 10);

const tableauPlayedToFoundation: StateBuilder<ScoreState, TableauPlayedToFoundationEvent> =
  (state, { tableauIndex }) =>
    maybeTurnOverAndScore(
      addScore(
        changeFaceUpTally(state, tableauIndex, -1),
        10),
      tableauIndex,
      5);

const tableauPlayedToTableau: StateBuilder<ScoreState, TableauPlayedToTableauEvent> =
  (state, { fromIndex, count, toIndex }) =>
    maybeTurnOverAndScore(
      changeFaceUpTally(
        changeFaceUpTally(
          state,
          fromIndex,
          -count),
        toIndex,
        count
      ),
      fromIndex,
      5);

// Helper functions

const changeFaceUpTally = ({ score, tableau }: ScoreState, index: number, cardsDelta: number): ScoreState => {
  tableau.splice(index, 1, {
    faceUp: tableau[index].faceUp + cardsDelta,
    faceDown: tableau[index].faceDown
  });
  return { score, tableau };
};

const addScore = ({ score, tableau }: ScoreState, points: number) => ({ score: score + points, tableau });

const maybeTurnOverAndScore = ({ score, tableau }: ScoreState, index: number, points: number): ScoreState => {
  if (tableau[index].faceUp === 0 && tableau[index].faceDown > 0) {
    tableau.splice(index, 1, {
      faceUp: 1,
      faceDown: tableau[index].faceDown - 1
    });
    score += points;
  }
  return { score, tableau };
};
