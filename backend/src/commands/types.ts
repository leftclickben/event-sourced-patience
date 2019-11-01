import { GameId } from '../game/types';

export type CommandProcessor<TCommand, TEvent> = (command: TCommand) => Promise<TEvent>;

export type CreateGameCommand = void;

export interface ClaimVictoryCommand {
  gameId: GameId;
}

export interface ForfeitGameCommand {
  gameId: GameId;
}

export interface GameplayCommand {
  gameId: GameId;
}

export interface DealStockToWasteCommand extends GameplayCommand {}

export interface ResetWasteToStockCommand extends GameplayCommand {}

export interface PlayWasteToTableauCommand extends GameplayCommand {
  tableauIndex: number;
}

export interface PlayWasteToFoundationCommand extends GameplayCommand {
  foundationIndex: number;
}

export interface PlayTableauToFoundationCommand extends GameplayCommand {
  tableauIndex: number;
  foundationIndex: number;
}

export interface PlayTableauToTableauCommand extends GameplayCommand {
  fromIndex: number;
  count: number;
  toIndex: number;
}

export type GameplayCommandName =
  'dealStockToWaste' |
  'resetWasteToStock' |
  'playWasteToTableau' |
  'playWasteToFoundation' |
  'playTableauToFoundation' |
  'playTableauToTableau' |
  'claimVictory';
