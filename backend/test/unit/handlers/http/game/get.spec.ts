import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import { getGameHandler } from '../../../../../src/handlers/http/game/get';
import * as loadEventsModule from '../../../../../src/events/load';
import * as tableStateModule from '../../../../../src/state/table';
import * as scoreStateModule from '../../../../../src/state/score';
import { createSampleCreateGameEvent } from '../../../../fixtures/events';
import { APIGatewayProxyResultWithData } from '../../../../../src/handlers/http/wrap';

describe('The HTTP GET /game handler', () => {
  describe('Given the environment is correctly configured', () => {
    let restoreEnv: () => void;

    beforeEach(() => {
      restoreEnv = mockedEnv({
        DB_TABLE_EVENTS: 'events'
      });
    });

    afterEach(() => {
      restoreEnv();
    });

    describe('Given the game events can be loaded', () => {
      let loadEventsStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves([ createSampleCreateGameEvent() ]);
      });

      afterEach(() => {
        loadEventsStub.restore();
      });

      describe('Given the state can be built', () => {
        let buildTableStateStub: SinonStub;
        let buildScoreStateStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns('table state' as any);
          buildScoreStateStub = stub(scoreStateModule, 'buildScoreState').returns({ score: 123 } as any);
        });

        afterEach(() => {
          buildTableStateStub.restore();
          buildScoreStateStub.restore();
        });

        describe('When invoked with a gameId path parameter', () => {
          let result: APIGatewayProxyResultWithData | void;

          beforeEach(async () => {
            result = await getGameHandler(
              { pathParameters: { gameId: 'game-42' } } as any,
              {} as any,
              undefined as any);
          });

          it('Loads the events', () => {
            expect(loadEventsStub.callCount).to.equal(1);
            expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
          });

          it('Returns a successful HTTP response with the correct state', () => {
            expect(result).to.deep.equal({
              data: {
                gameId: 'game-42',
                table: 'table state',
                score: 123
              }
            });
          });
        });

        describe('When invoked with no gameId path parameter', () => {
          it('Throws an error without loading the events', async () => {
            await expect(getGameHandler(
              { pathParameters: {} } as any,
              {} as any,
              undefined as any))
              .to.be.eventually.rejectedWith('Required parameter "gameId" missing');
            expect(loadEventsStub.callCount).to.equal(0);
          });
        });
      });
    });

    describe('Given the game events fail to load with an error', () => {
      let loadEventsStub: SinonStub;
      const thrownError = Error('Error loading events');

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').rejects(thrownError);
      });

      afterEach(() => {
        loadEventsStub.restore();
      });

      describe('When invoked with a gameId path parameter', () => {
        it('Throws the error from loading the events', async () => {
          await expect(getGameHandler(
            { pathParameters: { gameId: 'game-42' } } as any,
            {} as any,
            undefined as any))
            .to.be.eventually.rejectedWith(thrownError);
          expect(loadEventsStub.callCount).to.equal(1);
          expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
        });
      });
    });
  });
});
