import { Interface } from 'readline';
import { playGame } from '../services/api';
import { commandRouteMap } from './routes';
import { GameplayCommandRouteMapEntry } from './types';
import { pressEnter } from '../util';
import { Game } from '../types';

export const handleCommand = async (
  readlineInterface: Interface,
  game: Game,
  command: string
): Promise<Game> => {
  const route = commandRouteMap.find(({ match }) => match.test(command));
  if (!route) {
    if (command) {
      console.error(`Unknown command "${command}"`);
      await pressEnter(readlineInterface);
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
