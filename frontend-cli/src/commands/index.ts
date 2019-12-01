import { Interface } from 'readline';
import { playGame } from '../services/api';
import { getCommandRoute } from './routes';
import { GameplayCommandRouteMapEntry } from './types';
import { Game } from '../types';

// If nothing is returned, the game view will not be displayed.
export const handleCommand = async (
  readlineInterface: Interface,
  game: Game,
  command: string
): Promise<Game | void> => {
  const route = getCommandRoute(command);
  if (!route) {
    if (command) {
      throw Error(`Unknown command "${command}"`);
    }
    return game;
  }

  return (route.type === 'gameplay')
    ? await handleGameplayCommand(game, route, command)
    : await route.handler(readlineInterface, game);
};

const handleGameplayCommand = async (
  game: Game,
  route: GameplayCommandRouteMapEntry,
  command: string
): Promise<Game> => {
  // This "as" is okay because we just found "route" using the same "match" regex.  The slice() is because the result
  // of match() contains the complete match as the first element.
  const parameterValues = (command.match(route.match) as RegExpMatchArray).slice(1);
  const parameters = route.parameters.reduce(
    (result, { name, parse }, index) => {
      return {
        ...result,
        [name]: parse(parameterValues[index], game, result)
      };
    },
    {}
  );
  return await playGame(game.gameId, route.command, parameters);
};
