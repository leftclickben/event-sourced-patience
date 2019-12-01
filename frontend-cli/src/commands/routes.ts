import { CommandRouteMapEntry, CommandRouteParameterParser } from './types';
import { forfeitGame, playGame } from '../services/api';
import { clearScreen, helpText } from '../strings';
import { safelyRemoveGameFile } from '../services/game';
import { GameStatus } from '../types';

const parseTableauIndex: CommandRouteParameterParser<number> =
  (input) => Number(input) - 1;

const parseFoundationIndex: CommandRouteParameterParser<number> =
  (input) => input.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

const parseCount: CommandRouteParameterParser<number> =
  (input, game, allParameters) => input
    ? Number(input)
    : game.table.tableau[allParameters.fromIndex].filter(({ faceUp }) => faceUp).length;

const commandRouteMap: CommandRouteMapEntry[] = [
  {
    type: 'special',
    match: /^h(?:elp)?$/,
    handler: async () => {
      console.info(clearScreen);
      console.info(helpText);
    }
  },
  {
    type: 'special',
    match: /^f(?:orfeit)?$/,
    handler: async (readlineInterface, game) => {
      await forfeitGame(game.gameId);
      await safelyRemoveGameFile();
      // The DELETE doesn't return a response, so we just update the status client-side for display purposes.
      return { ...game, status: GameStatus.forfeited };
    }
  },
  {
    type: 'special',
    match: /^v(?:ictory)?$/,
    handler: async (readlineInterface, game) => {
      game = await playGame(game.gameId, 'claimVictory');
      await safelyRemoveGameFile();
      console.info('You won!!!');
      return game;
    }
  },
  {
    type: 'special',
    match: /^q(?:uit)?$/,
    handler: async (readlineInterface) => {
      readlineInterface.close();
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

export const getCommandRoute = (command: string): CommandRouteMapEntry | undefined =>
  commandRouteMap.find(({ match }) => match.test(command));
