import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import * as scanEventsModule from '../../../../../src/events/scan';
import * as aggregatesModule from '../../../../../src/state/aggregates';
import * as aggregatesPersistenceModule from '../../../../../src/state/aggregates/persistence';
import { createSampleCreateGameEvent } from '../../../../fixtures/events';
import { regenerateAggregatesHandler } from '../../../../../src/handlers/http/aggregates/regenerate';
import { expect } from 'chai';
import { GameEventType } from '../../../../../src/events/types';

describe('The HTTP GET /aggregates/regenerate handler', () => {
  describe('Given the environment is correctly configured', () => {
    let restoreEnv: () => void;

    beforeEach(() => {
      restoreEnv = mockedEnv({
        DB_TABLE_EVENTS: 'events',
        BUCKET_AGGREGATES: 'aggregates'
      });
    });

    afterEach(() => {
      restoreEnv();
    });

    describe('Given the game events can be scanned', () => {
      let scanEventsStub: SinonStub;

      beforeEach(() => {
        scanEventsStub = stub(scanEventsModule, 'scanEvents').resolves([ createSampleCreateGameEvent() ]);
      });

      afterEach(() => {
        scanEventsStub.restore();
      });

      describe('Given aggregates can be built', () => {
        let buildAggregatesStub: SinonStub;

        beforeEach(() => {
          buildAggregatesStub = stub(aggregatesModule, 'buildAggregates').returns('aggregates' as any);
        });

        afterEach(() => {
          buildAggregatesStub.restore();
        });

        describe('Given aggregates can be saved', () => {
          let saveAggregatesStub: SinonStub;

          beforeEach(() => {
            saveAggregatesStub = stub(aggregatesPersistenceModule, 'saveAggregates').resolves();
          });

          afterEach(() => {
            saveAggregatesStub.restore();
          });

          describe('When invoked', () => {
            beforeEach(async () => {
              await regenerateAggregatesHandler({} as any, {} as any, undefined as any);
            });

            it('Scans the event store', () => {
              expect(scanEventsStub.callCount).to.equal(1);
              expect(scanEventsStub.firstCall.args).to.deep.equal([
                'eventType',
                [GameEventType.gameCreated, GameEventType.gameForfeited, GameEventType.victoryClaimed]
              ]);
            });

            it('Builds the aggregates', () => {
              expect(buildAggregatesStub.callCount).to.equal(1);
            });

            it('Saves the aggregates data', () => {
              expect(saveAggregatesStub.callCount).to.equal(1);
              expect(saveAggregatesStub.firstCall.args).to.deep.equal(['aggregates']);
            });
          });
        });

        describe('Given saving aggregates fails', () => {
          let saveAggregatesStub: SinonStub;
          const saveError = Error('Could not save aggregates');

          beforeEach(() => {
            saveAggregatesStub = stub(aggregatesPersistenceModule, 'saveAggregates').rejects(saveError);
          });

          afterEach(() => {
            saveAggregatesStub.restore();
          });

          describe('When invoked', () => {
            it('Scans the event store, builds the aggregates then fails saving the aggregates', async () => {
              await expect(regenerateAggregatesHandler({} as any, {} as any, undefined as any))
                .to.eventually.be.rejectedWith(saveError);

              expect(scanEventsStub.callCount).to.equal(1);
              expect(scanEventsStub.firstCall.args).to.deep.equal([
                'eventType',
                [GameEventType.gameCreated, GameEventType.gameForfeited, GameEventType.victoryClaimed]
              ]);

              expect(buildAggregatesStub.callCount).to.equal(1);

              expect(saveAggregatesStub.callCount).to.equal(1);
              expect(saveAggregatesStub.firstCall.args).to.deep.equal(['aggregates']);
            });
          });
        });
      });

      describe('Given building aggregates is failing', () => {
        let buildAggregatesStub: SinonStub;
        const buildError = Error('Could not build aggregates');

        beforeEach(() => {
          buildAggregatesStub = stub(aggregatesModule, 'buildAggregates').rejects(buildError);
        });

        afterEach(() => {
          buildAggregatesStub.restore();
        });

        describe('When invoked', () => {
          it('Scans the event store, then throws an error building the aggregates', async () => {
            await expect(regenerateAggregatesHandler({} as any, {} as any, undefined as any))
              .to.be.eventually.rejectedWith(buildError);

            expect(scanEventsStub.callCount).to.equal(1);
            expect(scanEventsStub.firstCall.args).to.deep.equal([
              'eventType',
              [GameEventType.gameCreated, GameEventType.gameForfeited, GameEventType.victoryClaimed]
            ]);

            expect(buildAggregatesStub.callCount).to.equal(1);
          });
        });
      });
    });

    describe('Given scanning the game events fails', () => {
      let scanEventsStub: SinonStub;
      const scanError = Error('Cannot load game events');

      beforeEach(() => {
        scanEventsStub = stub(scanEventsModule, 'scanEvents').rejects(scanError);
      });

      afterEach(() => {
        scanEventsStub.restore();
      });

      describe('When invoked', () => {
        it('Throws an error scanning the event store', async () => {
          await expect(regenerateAggregatesHandler({} as any, {} as any, undefined as any))
            .to.be.eventually.rejectedWith(scanError);

          expect(scanEventsStub.callCount).to.equal(1);
          expect(scanEventsStub.firstCall.args).to.deep.equal([
            'eventType',
            [GameEventType.gameCreated, GameEventType.gameForfeited, GameEventType.victoryClaimed]
          ]);
        });
      });
    });
  });
});
