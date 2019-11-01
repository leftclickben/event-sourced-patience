import { GameplayCommandName } from '../types';
import { Game } from '../api';
import { Interface } from 'readline';

export interface CommandRouteParameter<TParsed> {
  name: string;
  parse: (input: string) => TParsed;
}

export interface BaseCommandRouteMapEntry {
  type: string;
  match: RegExp;
}

export interface GameplayCommandRouteMapEntry extends BaseCommandRouteMapEntry {
  type: 'gameplay'
  command: GameplayCommandName;
  parameters: CommandRouteParameter<any>[];
}

export interface SpecialCommandRouteMapEntry extends BaseCommandRouteMapEntry{
  type: 'special'
  handler: (readlineInterface: Interface, game: Game) => Promise<Game>;
}

export type CommandRouteMapEntry = GameplayCommandRouteMapEntry | SpecialCommandRouteMapEntry;
