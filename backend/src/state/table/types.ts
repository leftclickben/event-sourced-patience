import { Card } from '../../game/types';

export interface TableState {
  tableau: Card[][];
  foundation: Card[][];
  stock: Card[];
  waste: Card[];
}
