import { Card, GameStatus } from '../../game/types';

export interface TableState {
  status: GameStatus;
  tableau: Card[][];
  foundation: Card[][];
  stock: Card[];
  waste: Card[];
}

