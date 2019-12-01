export enum Suit {
  clubs = 'clubs',
  diamonds = 'diamonds',
  spades = 'spades',
  hearts = 'hearts'
}

export enum Value {
  two = 'two',
  three = 'three',
  four = 'four',
  five = 'five',
  six = 'six',
  seven = 'seven',
  eight = 'eight',
  nine = 'nine',
  ten = 'ten',
  jack = 'jack',
  queen = 'queen',
  king = 'king',
  ace = 'ace'
}

export interface Card {
  suit: Suit;
  value: Value;
  faceUp: boolean;
}

export type GameId = string;

export enum GameStatus {
  none = 'none',
  inProgress = 'inProgress',
  forfeited = 'forfeited',
  completed = 'completed'
}

export interface TableState {
  tableau: Card[][];
  foundation: Card[][];
  stock: Card[];
  waste: Card[];
}

export type GameplayCommandName =
  'dealStockToWaste' |
  'resetWasteToStock' |
  'playWasteToTableau' |
  'playWasteToFoundation' |
  'playTableauToFoundation' |
  'playTableauToTableau' |
  'claimVictory';

export interface Game {
  gameId: GameId;
  status: GameStatus;
  score: number;
  table: TableState;
}
