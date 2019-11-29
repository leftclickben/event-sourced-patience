export type StageName = string;

export type ExpectedEventDetails<T extends GameEvent = GameEvent> = Omit<T, 'eventId' | 'eventTimestamp' | 'gameId'>;

export type Tape = string[];

export interface OutputTapes {
  outputTape: Tape;
  errorTape: Tape;
}

export interface GameData {
  getInitialEvents: (gameId: GameId) => GameEvent[];
  inputTape: Tape;
  expectedOutputTape: Tape;
  expectedErrorTape: Tape;
  expectedEvents: ExpectedEventDetails[];
}

export type GameId = string;

export enum GameEventType {
  gameCreated = 'gameCreated',
  gameForfeited = 'gameForfeited',
  victoryClaimed = 'victoryClaimed',
  stockDealtToWaste = 'stockDealtToWaste',
  wasteResetToStock = 'wasteResetToStock',
  wastePlayedToTableau = 'wastePlayedToTableau',
  wastePlayedToFoundation = 'wastePlayedToFoundation',
  tableauPlayedToFoundation = 'tableauPlayedToFoundation',
  tableauPlayedToTableau = 'tableauPlayedToTableau'
}

export type EventId = string;

export interface GameEvent<T extends GameEventType = GameEventType> {
  eventId: EventId;
  gameId: GameId;
  eventType: T;
  eventTimestamp: number;
}

export type GameEventBase<T extends GameEventType> =
  Pick<GameEvent<T>, 'gameId' | 'eventType' | 'eventId' | 'eventTimestamp'>;

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
