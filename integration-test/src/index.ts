import * as yargs from 'yargs';
import { getStackOutputs } from './services/cloudformation';
import { createGameData } from './gameplay/gameData';
import { playGame } from './gameplay';
import { runNpmScript } from './services/npm';
import { assertGameEvents, assertGameTapes } from './gameplay/assert';

export const writeHeadline = (message: string) => console.info(`>>>>> ${message}`);

export const writeError = (message: string, error: any) => console.error(message, error);

export const pressEnter = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => resolve());
    process.stdin.on('error', (error) => reject(error));
  });

export const main = async (
  retainStage: boolean = false,
  verbose: boolean = true,
  gamesToPlay?: string[] | undefined
): Promise<void> => {
  // Generate a unique stage identifier, so we are running in a clean environment
  const stage = `integrationtests${Date.now()}`;

  try {
    writeHeadline(`Deploying a new CloudFormation stack to run integration tests for stage "${stage}"`);
    await runNpmScript('push', stage, '../backend', verbose);

    const { tableName, apiBaseUrl } = await getStackOutputs(stage, {
      EventsTableName: 'tableName',
      ApiBaseUrl: 'apiBaseUrl'
    });

    const gameDataByGameId = createGameData(apiBaseUrl);

    await (gamesToPlay || Object.keys(gameDataByGameId)).reduce(
      async (promise, gameId) => {
        await promise;
        const gameData = gameDataByGameId[gameId];

        writeHeadline(`Populating database for game "${gameId}" with seed data for stage "${stage}" with table "${tableName}"`);
        await gameData.initialise(gameId, tableName);

        writeHeadline(`Playing game "${gameId}" in stage "${stage}" with API base URL "${apiBaseUrl}"`);
        const tapes = await playGame(gameId, gameData, apiBaseUrl, verbose);

        writeHeadline(`Checking tapes for game "${gameId}" in stage "${stage}`);
        await assertGameTapes(gameId, gameData, tapes);

        writeHeadline(`Checking events for game "${gameId}" in stage "${stage}`);
        await assertGameEvents(gameId, gameData, tableName);
      },
      Promise.resolve());
  } catch (error) {
    writeError('Error occurred running E2E integration tests', error);
  } finally {
    if (!retainStage) {
      try {
        if (!process.env.CI) {
          writeHeadline('Press enter to continue...');
          await pressEnter();
        }
        writeHeadline(`Removing CloudFormation stack for stage "${stage}"`);
        await runNpmScript('pull', stage, '../backend', verbose);
      } catch (error) {
        writeError('Error occurred cleaning up E2E integration tests', error);
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

  main(!!retain, !!verbose, games as string[]).catch(console.error);
}
