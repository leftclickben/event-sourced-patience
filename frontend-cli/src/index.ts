import { config } from 'dotenv';
import { generateGameView } from './view';
import { createInterface } from 'readline';
import { handleCommand } from './command';
import { banner, prompt } from './strings';
import { loadCurrentGame } from './game';
import * as yargs from 'yargs';

export const cli = async (gameId?: string) => {
  try {
    config();
    console.info(banner);

    let game = await loadCurrentGame(gameId);

    const readlineInterface = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt
    });

    console.info(generateGameView(game));
    readlineInterface.prompt();

    readlineInterface.on('line', async (command) => {
      try {
        game = await handleCommand(readlineInterface, game, command);
      } catch (e) {
        console.error(e.message || String(e));
      } finally {
        console.info(generateGameView(game));
        readlineInterface.prompt();
      }
    });

    readlineInterface.on('close', () => {
      console.info('Thanks for playing!');
      process.exit(0);
    });
  } catch (e) {
    console.error(`Game initialisation error: ${e}`);
    process.exit(1);
  }
};

if (require.main === module) {
  const argv = yargs
    .alias('g', 'game')
    .alias('h', 'help')
    .describe('g', 'ID of the game to load; if omitted, continue a previous game or create a new game as required')
    .help('help')
    .version(false)
    .argv;
  cli(argv.game as string | undefined).then();
}
