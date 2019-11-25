import { GameStatus } from '../../game/types';

export interface TableauTally {
  faceDown: number;
  faceUp: number;
}

export interface ScoreState {
  status: GameStatus;
  score: number;
  tableau: TableauTally[];
}
