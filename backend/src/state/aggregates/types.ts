import { GameStatus } from '../../game/types';

export interface Aggregate {
  games: number;
  score: number;
  events: number;
}

export interface Aggregates {
  [GameStatus.inProgress]: Pick<Aggregate, 'games'>;
  [GameStatus.forfeited]: Aggregate;
  [GameStatus.completed]: Aggregate;
}
