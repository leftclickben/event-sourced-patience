import { CommandRouteMapEntry, GameplayCommandRouteMapEntry, SpecialCommandRouteMapEntry } from './types';
import { forfeitGame, Game } from '../api';
import { clearScreen, helpText } from '../strings';
import { removeGameFile } from '../game';
import { pressEnter } from '../util';

const parseTableauIndex = (input: string) => Number(input) - 1;
const parseFoundationIndex = (input: string) => input.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
const parseCount = (input: string) => input ? Number(input) : 1;

export const commandRouteMap: CommandRouteMapEntry[] = [
  {
    type: 'special',
    match: /^h(?:elp)?$/,
    handler: async (readlineInterface, game) => {
      console.info(clearScreen);
      console.info(helpText);
      await pressEnter(readlineInterface);
      return game;
    }
  },
  {
    type: 'special',
    match: /^f(?:orfeit)?$/,
    handler: async (readlineInterface, game) => {
      await forfeitGame(game.gameId);
      await removeGameFile();
      readlineInterface.close();
      return game;
    }
  },
  {
    type: 'special',
    match: /^q(?:uit)?$/,
    handler: async (readlineInterface, game) => {
      readlineInterface.close();
      return game;
    }
  },
  {
    type: 'gameplay',
    match: /^sw?$/i,
    command: 'dealStockToWaste',
    parameters: []
  },
  {
    type: 'gameplay',
    match: /^ws$/i,
    command: 'resetWasteToStock',
    parameters: []
  },
  {
    type: 'gameplay',
    match: /^w([1-7])$/i,
    command: 'playWasteToTableau',
    parameters: [
      {
        name: 'tableauIndex',
        parse: parseTableauIndex
      }
    ]
  },
  {
    type: 'gameplay',
    match: /^w([a-d])$/i,
    command: 'playWasteToFoundation',
    parameters: [
      {
        name: 'foundationIndex',
        parse: parseFoundationIndex
      }
    ]
  },
  {
    type: 'gameplay',
    match: /^([1-7])([a-d])$/i,
    command: 'playTableauToFoundation',
    parameters: [
      {
        name: 'tableauIndex',
        parse: parseTableauIndex
      },
      {
        name: 'foundationIndex',
        parse: parseFoundationIndex
      }
    ]
  },
  {
    type: 'gameplay',
    match: /^([1-7])([1-7])(\d?\d?)$/i,
    command: 'playTableauToTableau',
    parameters: [
      {
        name: 'fromIndex',
        parse: parseTableauIndex
      },
      {
        name: 'toIndex',
        parse: parseTableauIndex
      },
      {
        name: 'count',
        parse: parseCount
      }
    ]
  }
];
