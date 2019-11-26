import { config } from 'dotenv';
import * as yargs from 'yargs';
import { generateGameView } from './views/default';
import { createInterface } from 'readline';
import { handleCommand } from './commands';
import { prompt } from './strings';
import { loadCurrentGame } from './services/game';
import { gameOver, pressEnter } from './util';
import { Readable, Writable } from 'stream';

export const main = async (
  gameId?: string,
  newGame: boolean = false,
  input: Readable = process.stdin,
  output: Writable = process.stdout
) => {
  try {
    config();

    let game = await loadCurrentGame(gameId, newGame);

    const readlineInterface = createInterface({ input, output, prompt });

    console.info(generateGameView(game));
    readlineInterface.prompt();

    readlineInterface.on('line', async (command) => {
      try {
        game = await handleCommand(readlineInterface, game, command);
      } catch (e) {
        console.error(e.message || String(e));
        await pressEnter(readlineInterface);
      } finally {
        console.info(generateGameView(game));
        if (gameOver(game.status)) {
          readlineInterface.close();
        } else {
          readlineInterface.prompt();
        }
      }
    });

    readlineInterface.on('close', () => {
      if (gameOver(game.status)) {
        console.info(generateGameView(game));
      }
      console.info('Thanks for playing!');
      process.exit(0);
    });
  } catch (e) {
    console.error(`Game initialisation error: ${e}`);
    process.exit(1);
  }
};

if (require.main === module) {
  // TODO Support multiple views (commented out code below)
  const argv = yargs
    .alias('g', 'game')
    .describe('g', 'ID of the game to load, even if one is in progress')
    .alias('n', 'new')
    .describe('n', 'Start a new game, even if one is in progress')
    .boolean('n')
    // .alias('v', 'view')
    // .describe('v', 'Select the view to use')
    .alias('h', 'help')
    .help('help')
    // .choices({ v: ['default'] })
    .conflicts({ n: ['g'], g: ['n'] })
    .version(false)
    .argv;
  main(argv.game as string | undefined, argv.new as boolean | undefined).then();
}
