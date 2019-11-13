import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import { getGameHandler } from '../../../../../src/handlers/http/game/get';
import * as eventStoreModule from '../../../../../src/events/store';
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
      beforeEach(() => {
        stub(eventStoreModule, 'loadEvents').resolves([ createSampleCreateGameEvent() ]);
      });

      afterEach(() => {
        (eventStoreModule.loadEvents as SinonStub).restore();
      });

      describe('Given the state can be built', () => {
        beforeEach(() => {
          stub(tableStateModule, 'buildTableState').returns('table state' as any);
          stub(scoreStateModule, 'buildScoreState').returns({ score: 123 } as any);
        });

        afterEach(() => {
          (tableStateModule.buildTableState as SinonStub).restore();
          (scoreStateModule.buildScoreState as SinonStub).restore();
        });

        describe('When invoked with a gameId path parameter', () => {
          let result: APIGatewayProxyResultWithData | void;

          beforeEach(async () => {
            result = await getGameHandler({ pathParameters: { gameId: 'game-42' } } as any, {} as any, undefined as any);
          });

          it('Loads the events', () => {
            expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
            expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
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
            await expect(getGameHandler({ pathParameters: {} } as any, {} as any, () => {}))
              .to.be.eventually.rejectedWith('Required parameter "gameId" missing');
            expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(0);
          });
        });
      });
    });

    describe('Given the game events fail to load with an error', () => {
      const thrownError = Error('Error loading events');

      beforeEach(() => {
        stub(eventStoreModule, 'loadEvents').rejects(thrownError);
      });

      afterEach(() => {
        (eventStoreModule.loadEvents as SinonStub).restore();
      });

      describe('When invoked with a gameId path parameter', () => {
        it('Throws the error from loading the events', async () => {
          await expect(getGameHandler({ pathParameters: { gameId: 'game-42' } } as any, {} as any, undefined as any))
            .to.be.eventually.rejectedWith(thrownError);
          expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
          expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
        });
      });
    });
  });
});
