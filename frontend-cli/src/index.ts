import { config } from 'dotenv';
import * as yargs from 'yargs';
import { generateGameView } from './views/default';
import { createInterface } from 'readline';
import { handleCommand } from './commands';
import { prompt } from './strings';
import { loadCurrentGame } from './services/game';
import { gameOver } from './util';
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
    console.info(generateGameView(game));

    const readlineInterface = createInterface({ input, output, prompt, crlfDelay: Infinity });
    readlineInterface.prompt(true);

    readlineInterface.on('close', () => {
      console.info('Thanks for playing!');
      process.exit(0);
    });

    for await (const command of readlineInterface) {
      readlineInterface.pause();
      try {
        const result = await handleCommand(readlineInterface, game, command);
        game = result || game;
        if (result) {
          console.info(generateGameView(game));
        }
      } catch (e) {
        console.error(e.message || String(e));
      } finally {
        if (gameOver(game.status)) {
          readlineInterface.close();
        } else {
          readlineInterface.prompt();
        }
      }
    }
  } catch (e) {
    console.error(`Game initialisation error: ${e}`);
    process.exit(1);
  }
};

if (require.main === module) {
  // TODO Support multiple views (commented out code below)
  const { argv } = yargs
    .alias('g', 'game')
    .describe('g', 'ID of the game to load, even if one is in progress')
    .alias('n', 'new')
    .describe('n', 'Start a new game, even if one is in progress')
    .boolean('n')
    // .alias('v', 'view')
    // .describe('v', 'Select the view to use')
    // .choices({ v: ['default'] })
    .alias('h', 'help')
    .help('help')
    .conflicts({ n: ['g'], g: ['n'] })
    .version(false);

  main(argv.game as string | undefined, argv.new as boolean | undefined).then();
}
