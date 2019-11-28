import { initialiseDatabase } from './initialise';
import { playGames } from './gameplay';
import { assertEvents } from './assert';
import { getStackOutputs } from './services/cloudformation';
import { pressEnter, runNpmScript } from './util';

export const main = async (): Promise<void> => {
  // Generate a unique stage identifier, so we are running in a clean environment
  const stage = `integrationtests${Date.now()}`;

  try {
    console.info(`>>>>> Deploying a new CloudFormation stack to run integration tests for stage "${stage}"`);
    await runNpmScript('push', stage, '../backend');
    const { tableName, apiBaseUrl } =
      await getStackOutputs(stage, { EventsTableName: 'tableName', ApiBaseUrl: 'apiBaseUrl' });
    console.info(`>>>>> Deployed stack and got table name "${tableName}" and API base URL ${apiBaseUrl}`);

    console.info(`>>>>> Populating database with seed data for stage "${stage}"`);
    await initialiseDatabase(tableName);

    console.info(`>>>>> Playing through each game`);
    await playGames(apiBaseUrl);

    console.info(`>>>>> Checking final database contents match expectations for stage "${stage}"`);
    await assertEvents(tableName);
  } catch (error) {
    console.error(`>>>>> Error occurred running E2E integration tests`, error);
  } finally {
    try {
      if (!process.env.CI) {
        console.info('>>>>> Press enter to continue...');
        await pressEnter();
      }
      console.info(`>>>>> Removing CloudFormation stack for stage "${stage}"`);
      await runNpmScript('pull', stage, '../backend');
    } catch (error) {
      console.error(`>>>>> Error occurred cleaning up E2E integration tests`, error);
    }
  }
};

if (require.main === module) {
  main().then(() => process.exit());
}
