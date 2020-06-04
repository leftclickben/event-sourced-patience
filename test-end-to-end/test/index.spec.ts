import { TableName } from 'aws-sdk/clients/dynamodb';
import { runNpmScript } from '../src/npm';
import { getStackOutputs } from '../src/cloudformation';
import { GameEvent, OutputTapes, TestConfiguration } from '../src/types';
import { testConfigurations } from './configurations';
import { playGame } from '../src/game';
import { assert } from 'chai';
import { loadEvents, saveEvents } from '../src/database';
import { writeNewLine, writeProgress } from '../src/ui';

const verbosity = Number(process.env.TESTS_VERBOSITY || 0);

const testsToRun: string[] = process.env.TESTS_GAME_IDS
  ? JSON.parse(process.env.TESTS_GAME_IDS)
  : Object.keys(testConfigurations);

describe('End-to-end integration tests', () => {
  describe('With a unique stage configured (this may take a minute or two)', () => {
    let stage: string;
    let tableName: TableName;
    let apiBaseUrl: string;

    before(async () => {
      stage = `end2end${Date.now()}`;

      await runNpmScript('push', stage, '../backend', verbosity);

      const outputs = await getStackOutputs(stage, {
        EventsTableName: 'tableName',
        ApiBaseUrl: 'apiBaseUrl'
      });

      tableName = outputs.tableName;
      apiBaseUrl = outputs.apiBaseUrl;
    });

    after(async () => {
      if (!process.env.TESTS_RETAIN_STACK) {
        await runNpmScript('pull', stage, '../backend', verbosity);
      }
    });

    describe('With known initial event store contents', () => {
      before(async () => {
        await testsToRun.reduce(
          async (promise, gameId) => {
            await promise;
            const { initialEvents } = testConfigurations[gameId](gameId, apiBaseUrl);
            await saveEvents(tableName, gameId, initialEvents);
            await writeProgress(`Prepared game "${gameId}"\n`, verbosity);
          },
          Promise.resolve());

        writeNewLine(verbosity);
      });

      testsToRun.forEach((gameId) => {
        describe(`When playing game ID "${gameId}"`, () => {
          let testConfiguration: TestConfiguration;
          let actualTapes: OutputTapes;
          let actualEvents: GameEvent[];

          before(async () => {
            testConfiguration = testConfigurations[gameId](gameId, apiBaseUrl);
            actualTapes = await playGame(gameId, testConfiguration.inputTape, apiBaseUrl, verbosity);
            actualEvents = await loadEvents(tableName, gameId);
          });

          it('Matches the output tape', async () => {
            // Without the `.join('')` here, the tests intermittently fail because the text is broken up differently.
            // TODO Investigate why sometimes the tape elements come through joined together as one string
            assert.deepEqual(
              actualTapes.outputTape.join(''),
              testConfiguration.expectedOutputTape.join(''),
              `Tape from output stream does not match for game "${gameId}`);
          });

          it('Matches the error tape', async () => {
            // Without the `.join('')` here, the tests intermittently fail because the text is broken up differently.
            // TODO Investigate why sometimes the tape elements come through joined together as one string
            assert.deepEqual(
              actualTapes.errorTape.join(''),
              testConfiguration.expectedErrorTape.join(''),
              `Tape from error stream does not match for game "${gameId}`);
          });

          it('Matches the events in the database', async () => {
            assert.deepEqual(
              actualEvents.map(({ eventTimestamp, ...event }) => event),
              testConfiguration.expectedEvents.map((event) => ({ gameId, ...event })),
              `Incorrect events found for game "${gameId}"`);
          });
        });
      });
    });
  });
});
