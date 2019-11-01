import { Card, GameId } from '../game/types';

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

export type GeneratedEventProperties = 'eventId' | 'eventType' | 'eventTimestamp';

export interface GameCreatedEvent extends GameEvent<GameEventType.gameCreated> {
  tableau: Card[][];
  stock: Card[];
}

export type GameForfeitedEvent = GameEvent<GameEventType.gameForfeited>;

export type VictoryClaimedEvent = GameEvent<GameEventType.victoryClaimed>;

export type StockDealtToWasteEvent = GameEvent<GameEventType.stockDealtToWaste>;

export type WasteResetToStockEvent = GameEvent<GameEventType.wasteResetToStock>;

export interface WastePlayedToTableauEvent extends GameEvent<GameEventType.wastePlayedToTableau> {
  tableauIndex: number;
}

export interface WastePlayedToFoundationEvent extends GameEvent<GameEventType.wastePlayedToFoundation>  {
  foundationIndex: number;
}

export interface TableauPlayedToFoundationEvent extends GameEvent<GameEventType.tableauPlayedToFoundation> {
  tableauIndex: number;
  foundationIndex: number;
}

export interface TableauPlayedToTableauEvent extends GameEvent<GameEventType.tableauPlayedToTableau> {
  fromIndex: number;
  count: number;
  toIndex: number;
}
