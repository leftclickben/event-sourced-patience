import * as yargs from 'yargs';
import { getStackOutputs } from './services/cloudformation';
import { createGameData } from './gameplay/gameData';
import { playGame, prepareGame } from './gameplay';
import { runNpmScript } from './services/npm';
import { assertGameResult } from './gameplay/assert';
import { pressEnter, writeBanner, writeError, writeHeading, writeMessage, writeNewLine, writeSuccess } from './ui';

export const main = async (
  retainStage: boolean = false,
  verbose: boolean = true,
  gamesToPlay?: string[] | undefined
): Promise<void> => {
  const stage = `integrationtests${Date.now()}`;

  writeBanner(stage);

  try {
    writeHeading('Deploying CloudFormation stack');

    await runNpmScript('push', stage, '../backend', verbose);

    const { tableName, apiBaseUrl } = await getStackOutputs(stage, {
      EventsTableName: 'tableName',
      ApiBaseUrl: 'apiBaseUrl'
    });

    writeSuccess('Stack deployed successfully');
    writeMessage(`Table name is "${tableName}"`);
    writeMessage(`API base URL is "${apiBaseUrl}"`);

    const gameDataByGameId = createGameData(apiBaseUrl);

    await (gamesToPlay || Object.keys(gameDataByGameId)).reduce(
      async (promise, gameId) => {
        await promise;
        const gameData = gameDataByGameId[gameId];
        await prepareGame(gameId, gameData, tableName, verbose);
        const tapes = await playGame(gameId, gameData, apiBaseUrl, verbose);
        await assertGameResult(gameId, gameData, tapes, tableName, verbose);
      },
      Promise.resolve());

    writeSuccess('All tests completed successfully');
  } catch (error) {
    writeError('Error running E2E integration tests', error);
  } finally {
    if (!retainStage) {
      try {
        if (!process.env.CI) {
          await pressEnter();
        }
        writeHeading('Removing CloudFormation stack');
        await runNpmScript('pull', stage, '../backend', verbose);
      } catch (error) {
        writeError('Error cleaning up E2E integration tests', error);
      } finally {
        writeSuccess('Stack cleaned up successfully');
      }
    }
  }
};

if (require.main === module) {
  const { argv: { retain, verbose, games } } = yargs
    .alias('r', 'retain')
    .describe('r', 'Retain the CloudFormation stack after running tests')
    .boolean('r')
    .alias('v', 'verbose')
    .describe('v', 'Display all output and use verbose API calls')
    .boolean('v')
    .alias('g', 'games')
    .describe('g', 'Specify a subset of game IDs to play')
    .array('g')
    .alias('h', 'help')
    .help('help')
    .version(false);

  main(!!retain, !!verbose, games as string[])
    .then(() => {
      writeSuccess('Integration tests completed');
      writeNewLine();
      process.exit(0);
    })
    .catch((error) => {
      writeError('Unexpected fatal error occurred', error);
      process.exit(1);
    });
}
