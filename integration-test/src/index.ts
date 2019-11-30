import * as yargs from 'yargs';
import { getStackOutputs } from './services/cloudformation';
import { createTestConfigurations } from './tests/data';
import { playGame, prepareGame } from './tests';
import { runNpmScript } from './services/npm';
import { assertGameResult } from './tests/assert';
import {
  pressEnter,
  writeBanner,
  writeError,
  writeErrorDetails,
  writeHeading,
  writeMessage,
  writeSuccess,
  writeTestFailed,
  writeTestPassed
} from './ui';
import { GameId } from './types';

export const main = async (
  retainStage: boolean = false,
  verbose: boolean = true,
  gamesToPlay?: string[] | undefined
): Promise<void> => {
  let successful: boolean = false;

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

    const testConfigurations = createTestConfigurations(apiBaseUrl);

    const resultsByGameId = await (gamesToPlay || Object.keys(testConfigurations)).reduce(
      async (promise, gameId) => {
        const results = await promise;

        try {
          const testConfiguration = testConfigurations[gameId];
          await prepareGame(gameId, testConfiguration, tableName, verbose);
          const tapes = await playGame(gameId, testConfiguration, apiBaseUrl, verbose);
          await assertGameResult(gameId, testConfiguration, tapes, tableName, verbose);
          writeTestPassed(gameId);
        } catch (error) {
          results[gameId] = { error };
          writeTestFailed(gameId);
        }

        return results;
      },
      Promise.resolve({} as Partial<Record<GameId, { error: any }>>));

    const failedTests = Object.keys(resultsByGameId);
    if (failedTests.length > 0) {
      writeError(`Test failures occurred for the following games: ${JSON.stringify(failedTests)}`);
      writeErrorDetails(JSON.stringify(resultsByGameId, null, 2));
      successful = false;
    } else {
      writeSuccess('All tests completed successfully');
      successful = true;
    }
  } catch (error) {
    writeError('Error running E2E integration tests', error);
    successful = false;
  } finally {
    if (!retainStage) {
      try {
        if (!process.env.CI) {
          await pressEnter();
        }

        writeHeading('Removing CloudFormation stack');
        await runNpmScript('pull', stage, '../backend', verbose);

        if (successful) {
          writeSuccess('Stack cleaned up successfully');
        } else {
          writeError('Stack cleaned up but test run failed; see preceding messages for details');
        }
      } catch (error) {
        writeError('Error cleaning up E2E integration tests', error);
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
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
