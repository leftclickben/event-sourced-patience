export type StageName = string;

export type CommandLine = string;

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
