import { GameplayCommandName } from './types';
import { forfeitGame, Game, playGame } from './api';
import { Interface } from 'readline';
import { clearScreen, helpText } from './strings';
import { removeGameFile } from './game';

type ParameterMapKey = 'fromIndex' | 'toIndex' | 'count';

interface CommandMapEntry {
  commandName: GameplayCommandName;
  parameterMap: Partial<Record<ParameterMapKey, string>>;
}

const commandMap: Record<string, CommandMapEntry> = {
  sw: {
    commandName: 'dealStockToWaste',
    parameterMap: {}
  },
  ws: {
    commandName: 'resetWasteToStock',
    parameterMap: {}
  },
  wt: {
    commandName: 'playWasteToTableau',
    parameterMap: {
      toIndex: 'tableauIndex'
    }
  },
  wf: {
    commandName: 'playWasteToFoundation',
    parameterMap: {
      toIndex: 'foundationIndex'
    }
  },
  tf: {
    commandName: 'playTableauToFoundation',
    parameterMap: {
      fromIndex: 'tableauIndex',
      toIndex: 'foundationIndex'
    }
  },
  tt: {
    commandName: 'playTableauToTableau',
    parameterMap: {
      fromIndex: 'fromIndex',
      toIndex: 'toIndex',
      count: 'count'
    }
  }
};

const commandParser = /^\s*([swt])(\d+)?\s*([swtf])(\d+)?(?:\s+(\d+))?\s*$/;

const areasWithIndex = ['f', 't'];
const areasWithoutIndex = ['s', 'w'];

export const handleCommand = async (
  readlineInterface: Interface,
  game: Game,
  command: string
): Promise<Game> => {
  switch (command) {
    case '':
      return game;

    case 'h':
      console.info(clearScreen);
      console.info(helpText);
      await new Promise<void>((resolve) => readlineInterface.question('Press enter to continue...', () => resolve()));
      return game;

    case 'f':
      await forfeitGame(game.gameId);
      await removeGameFile();
      readlineInterface.close();
      return game;

    case 'q':
      readlineInterface.close();
      return game;

    default:
      const match = command.match(commandParser);

      if (!match) {
        console.error(`Unknown command "${command}"; use "h" for help.`);
        return game;
      }

      const [fromArea, fromIndex, toArea, toIndex, count] = match.slice(1);

      if (fromArea in areasWithIndex && !fromIndex) {
        console.error(`Invalid command ${command}; areas [${areasWithIndex.join(', ')}] require an index`);
        return game;
      }
      if (fromArea in areasWithoutIndex && fromIndex) {
        console.error(`Invalid command ${command}; areas [${areasWithIndex.join(', ')}] must not be given an index`);
        return game;
      }
      if (toArea in areasWithIndex && !toIndex) {
        console.error(`Invalid command ${command}; areas [${areasWithIndex.join(', ')}] require an index`);
        return game;
      }
      if (toArea in areasWithoutIndex && toIndex) {
        console.error(`Invalid command ${command}; areas [${areasWithIndex.join(', ')}] must not be given an index`);
        return game;
      }
      if (fromArea === toArea && fromIndex === toIndex) {
        console.error(`Invalid command ${command}; the origin and destination are the same`);
        return game;
      }

      const { commandName, parameterMap } = commandMap[`${fromArea}${toArea}`];

      // Convert to numbers and adjust from 1-based indexes to 0-based indexes q
      const parameterValues = {
        fromIndex: Number(fromIndex) - 1,
        toIndex: Number(toIndex) - 1,
        count: Number(count) || 1
      };

      const parameters = (Object.keys(parameterMap) as ParameterMapKey[])
        .reduce(
          (result, key) => ({
            ...result,
            [parameterMap[key] as string]: parameterValues[key]
          }),
          {});

      return await playGame(game.gameId, commandName, parameters);
  }
};
