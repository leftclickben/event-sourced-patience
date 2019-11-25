import {
  GameCreatedEvent,
  GameEvent,
  GameEventType,
  GameForfeitedEvent,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent,
  VictoryClaimedEvent,
  WastePlayedToFoundationEvent,
  WastePlayedToTableauEvent
} from '../../events/types';
import { buildStateFromEvents } from '../util';
import { StateBuilder } from '../types';
import { ScoreState } from './types';
import { GameStatus } from '../../game/types';

export const buildScoreState = (events: GameEvent[]) =>
  buildStateFromEvents<ScoreState>(
    {
      status: GameStatus.none,
      score: 0,
      tableau: []
    },
    {
      gameCreated,
      gameForfeited,
      victoryClaimed,
      wastePlayedToTableau,
      wastePlayedToFoundation,
      tableauPlayedToFoundation,
      tableauPlayedToTableau
    } as Record<GameEventType, StateBuilder<ScoreState>>,
    events);

// Builder functions

const gameCreated: StateBuilder<ScoreState, GameCreatedEvent> =
  (_ignoreInitialState, { tableau }) => ({
    status: GameStatus.inProgress,
    score: 0,
    tableau: Array.from(tableau, (column) => ({
      faceUp: column.filter(({ faceUp }) => faceUp).length,
      faceDown: column.filter(({ faceUp }) => !faceUp).length
    }))
  });

const gameForfeited: StateBuilder<ScoreState, GameForfeitedEvent> =
  (state) => ({ ...state, status: GameStatus.forfeited });

const victoryClaimed: StateBuilder<ScoreState, VictoryClaimedEvent> =
  (state) => ({ ...state, status: GameStatus.completed });

const wastePlayedToTableau: StateBuilder<ScoreState, WastePlayedToTableauEvent> =
  ({ score, tableau, ...state }, { tableauIndex }) => {
    score += 5;
    ++tableau[tableauIndex].faceUp;
    return { ...state, score, tableau };
  };

const wastePlayedToFoundation: StateBuilder<ScoreState, WastePlayedToFoundationEvent> =
  ({ score, ...state }) => {
    score += 10;
    return { ...state, score };
  };

const tableauPlayedToFoundation: StateBuilder<ScoreState, TableauPlayedToFoundationEvent> =
  ({ score, tableau, ...state }, { tableauIndex }) => {
    score += tableau[tableauIndex].faceUp === 1 ? 15 : 10;
    --tableau[tableauIndex].faceUp;
    if (tableau[tableauIndex].faceUp === 0 && tableau[tableauIndex].faceDown > 0) {
      tableau[tableauIndex].faceUp = 1;
      --tableau[tableauIndex].faceDown;
    }
    return { ...state, score, tableau };
  };

const tableauPlayedToTableau: StateBuilder<ScoreState, TableauPlayedToTableauEvent> =
  ({ tableau, ...state }, { fromIndex, count, toIndex }) => {
    tableau[fromIndex].faceUp -= count;
    tableau[toIndex].faceUp += count;
    if (tableau[fromIndex].faceUp === 0 && tableau[fromIndex].faceDown > 0) {
      tableau[fromIndex].faceUp = 1;
      --tableau[fromIndex].faceDown;
    }
    return { ...state, tableau };
  };
