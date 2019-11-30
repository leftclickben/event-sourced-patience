import { TableName } from 'aws-sdk/clients/dynamodb';
import { runNpmScript } from '../src/services/npm';
import { getStackOutputs } from '../src/services/cloudformation';
import { GameEvent, GameId, OutputTapes, TestConfiguration } from '../src/types';
import { createTestConfigurations } from '../src/fixtures/data';
import { playGame, prepareGame } from '../src/services/game';
import { assert } from 'chai';
import { loadEvents } from '../src/services/database';
import { writeNewLine } from '../src/ui';

const verbosity = Number(process.env.TESTS_VERBOSITY || 0);

describe('End-to-end integration tests', () => {
  describe('With a unique stage configured (this may take a minute or two)', () => {
    let stage: string;
    let tableName: TableName;
    let apiBaseUrl: string;

    before(async () => {
      stage = `integrationtests${Date.now()}`;

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

    describe('With known test configurations', () => {
      const testConfigurations: Record<GameId, TestConfiguration> = createTestConfigurations(apiBaseUrl);

      const testsToRun: string[] = process.env.TESTS_GAME_IDS
        ? JSON.parse(process.env.TESTS_GAME_IDS)
        : Object.keys(testConfigurations);

      before(async () => {
        await testsToRun.reduce(
          async (promise, gameId) => {
            const { getInitialEvents } = testConfigurations[gameId];
            await prepareGame(gameId, getInitialEvents, tableName, verbosity)
          },
          Promise.resolve()
        );
        writeNewLine(verbosity);
      });

      testsToRun.forEach((gameId) => {
        describe(`When playing game "${gameId}"`, () => {
          const { inputTape, expectedOutputTape, expectedErrorTape, expectedEvents } = testConfigurations[gameId];

          let tapes: OutputTapes;
          let events: GameEvent[];

          before(async () => {
            tapes = await playGame(gameId, inputTape, apiBaseUrl, verbosity);
            events = await loadEvents(tableName, gameId);
          });

          it('Matches the output tape', async () => {
            // Without the `.join('')` here, the tests intermittently fail because the text is broken up differently.
            // TODO Investigate why sometimes the tape elements come through joined together as one string
            assert.deepEqual(
              tapes.outputTape.join(''),
              expectedOutputTape.join(''),
              `Tape from output stream does not match for game "${gameId}`);
          });

          it('Matches the error tape', async () => {
            // Without the `.join('')` here, the tests intermittently fail because the text is broken up differently.
            // TODO Investigate why sometimes the tape elements come through joined together as one string
            assert.deepEqual(
              tapes.errorTape.join(''),
              expectedErrorTape.join(''),
              `Tape from error stream does not match for game "${gameId}`);
          });

          it('Matches the events in the database', async () => {
            assert.deepEqual(
              events.map(({ eventId, eventTimestamp, ...event }) => event),
              expectedEvents.map((event) => ({ gameId, ...event })),
              `Incorrect events found for game "${gameId}"`);
          });
        });
      });
    });
  });
});
