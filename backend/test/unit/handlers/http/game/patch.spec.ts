import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { createSampleCreateGameEvent, createSampleGameplayEvent } from '../../../../fixtures/events';
import * as loadEventsModule from '../../../../../src/events/load';
import * as tableStateModule from '../../../../../src/state/table';
import * as scoreStateModule from '../../../../../src/state/score';
import * as dealStockToWasteModule from '../../../../../src/commands/processors/dealStockToWaste';
import * as resetWasteToStockModule from '../../../../../src/commands/processors/resetWasteToStock';
import * as playWasteToTableauModule from '../../../../../src/commands/processors/playWasteToTableau';
import * as playWasteToFoundationModule from '../../../../../src/commands/processors/playWasteToFoundation';
import * as playTableauToFoundationModule from '../../../../../src/commands/processors/playTableauToFoundation';
import * as playTableauToTableauModule from '../../../../../src/commands/processors/playTableauToTableau';
import * as claimVictoryModule from '../../../../../src/commands/processors/claimVictory';
import {
  GameEvent,
  GameEventType,
  StockDealtToWasteEvent,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent,
  VictoryClaimedEvent,
  WastePlayedToFoundationEvent,
  WastePlayedToTableauEvent,
  WasteResetToStockEvent
} from '../../../../../src/events/types';
import { patchGameHandler } from '../../../../../src/handlers/http/game/patch';
import { expect } from 'chai';
import { APIGatewayProxyResultWithData } from '../../../../../src/handlers/http/wrap';

describe('The HTTP PATCH /game handler', () => {
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
      let initialEvents: GameEvent[];
      let loadEventsStub: SinonStub;

      beforeEach(() => {
        initialEvents = [
          createSampleCreateGameEvent(),
          createSampleGameplayEvent<GameEventType.stockDealtToWaste, StockDealtToWasteEvent>(
            GameEventType.stockDealtToWaste,
            'game-42',
            'event-999',
            {})
        ];
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves(initialEvents);
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

        describe('Given gameplay commands can be successfully executed', () => {
          let stockDealtToWasteEvent: StockDealtToWasteEvent;
          let wasteResetToStockEvent: WasteResetToStockEvent;
          let wastePlayedToTableauEvent: WastePlayedToTableauEvent;
          let wastePlayedToFoundationEvent: WastePlayedToFoundationEvent;
          let tableauPlayedToTableauEvent: TableauPlayedToTableauEvent;
          let tableauPlayedToFoundationEvent: TableauPlayedToFoundationEvent;
          let victoryClaimedEvent: VictoryClaimedEvent;

          let dealStockToWasteStub: SinonStub;
          let resetWasteToStockStub: SinonStub;
          let playWasteToTableauStub: SinonStub;
          let playWasteToFoundationStub: SinonStub;
          let playTableauToTableauStub: SinonStub;
          let playTableauToFoundationStub: SinonStub;
          let claimVictoryStub: SinonStub;

          beforeEach(() => {
            stockDealtToWasteEvent = createSampleGameplayEvent<
              GameEventType.stockDealtToWaste,
              StockDealtToWasteEvent
            >(
              GameEventType.stockDealtToWaste,
              'game-42',
              'event-1000',
              {});

            wasteResetToStockEvent = createSampleGameplayEvent<
              GameEventType.wasteResetToStock,
              WasteResetToStockEvent
            >(
              GameEventType.wasteResetToStock,
              'game-42',
              'event-1001',
              {});

            wastePlayedToTableauEvent = createSampleGameplayEvent<
              GameEventType.wastePlayedToTableau,
              WastePlayedToTableauEvent
            >(
              GameEventType.wastePlayedToTableau,
              'game-42',
              'event-1002',
              {
                tableauIndex: 1
              });

            wastePlayedToFoundationEvent = createSampleGameplayEvent<
              GameEventType.wastePlayedToFoundation,
              WastePlayedToFoundationEvent
            >(
              GameEventType.wastePlayedToFoundation,
              'game-42',
              'event-1003',
              {
                foundationIndex: 2
              });

            tableauPlayedToTableauEvent = createSampleGameplayEvent<
              GameEventType.tableauPlayedToTableau,
              TableauPlayedToTableauEvent
            >(
              GameEventType.tableauPlayedToTableau,
              'game-42',
              'event-1004',
              {
                fromIndex: 7,
                count: 3,
                toIndex: 0
              });

            tableauPlayedToFoundationEvent = createSampleGameplayEvent<
              GameEventType.tableauPlayedToFoundation,
              TableauPlayedToFoundationEvent
            >(
              GameEventType.tableauPlayedToFoundation,
              'game-42',
              'event-1005',
              {
                tableauIndex: 5,
                foundationIndex: 1
              });

            victoryClaimedEvent = createSampleGameplayEvent<
              GameEventType.victoryClaimed,
              VictoryClaimedEvent
            >(
              GameEventType.victoryClaimed,
              'game-42',
              'event-1006',
              {});

            dealStockToWasteStub = stub(dealStockToWasteModule, 'dealStockToWaste')
              .resolves(stockDealtToWasteEvent);
            resetWasteToStockStub = stub(resetWasteToStockModule, 'resetWasteToStock')
              .resolves(wasteResetToStockEvent);
            playWasteToTableauStub = stub(playWasteToTableauModule, 'playWasteToTableau')
              .resolves(wastePlayedToTableauEvent);
            playWasteToFoundationStub = stub(playWasteToFoundationModule, 'playWasteToFoundation')
              .resolves(wastePlayedToFoundationEvent);
            playTableauToTableauStub = stub(playTableauToTableauModule, 'playTableauToTableau')
              .resolves(tableauPlayedToTableauEvent);
            playTableauToFoundationStub = stub(playTableauToFoundationModule, 'playTableauToFoundation')
              .resolves(tableauPlayedToFoundationEvent);
            claimVictoryStub = stub(claimVictoryModule, 'claimVictory')
              .resolves(victoryClaimedEvent);
          });

          afterEach(() => {
            dealStockToWasteStub.restore();
            resetWasteToStockStub.restore();
            playWasteToTableauStub.restore();
            playWasteToFoundationStub.restore();
            playTableauToTableauStub.restore();
            playTableauToFoundationStub.restore();
            claimVictoryStub.restore();
          });

          describe('When invoked with a valid gameId and a moveType of "dealStockToWaste"', () => {
            let result: APIGatewayProxyResultWithData | void;

            beforeEach(async () => {
              result = await patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'dealStockToWaste'
                  }
                } as any,
                {} as any,
                undefined as any);
            });

            it('Loads the events', () => {
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the dealStockToWaste command', () => {
              expect(dealStockToWasteStub.callCount).to.equal(1);
              expect(dealStockToWasteStub.firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42'
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect(buildTableStateStub.callCount).to.equal(1);
              expect(buildTableStateStub.firstCall.args).to.deep.equal([
                [...initialEvents, stockDealtToWasteEvent]
              ]);
            });
          });

          describe('When invoked with a valid "resetWasteToStock" event', () => {
            let result: APIGatewayProxyResultWithData | void;

            beforeEach(async () => {
              result = await patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'resetWasteToStock'
                  }
                } as any,
                {} as any,
                undefined as any);
            });

            it('Loads the events', () => {
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the resetWasteToStock command', () => {
              expect(resetWasteToStockStub.callCount).to.equal(1);
              expect(resetWasteToStockStub.firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42'
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect(buildTableStateStub.callCount).to.equal(1);
              expect(buildTableStateStub.firstCall.args).to.deep.equal([
                [...initialEvents, wasteResetToStockEvent]
              ]);
            });
          });

          describe('When invoked with a valid "playWasteToTableau" event', () => {
            let result: APIGatewayProxyResultWithData | void;

            beforeEach(async () => {
              result = await patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playWasteToTableau'
                  },
                  data: {
                    tableauIndex: 1
                  }
                } as any,
                {} as any,
                undefined as any);
            });

            it('Loads the events', () => {
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playWasteToTableau command', () => {
              expect(playWasteToTableauStub.callCount).to.equal(1);
              expect(playWasteToTableauStub.firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  tableauIndex: 1
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect(buildTableStateStub.callCount).to.equal(1);
              expect(buildTableStateStub.firstCall.args).to.deep.equal([
                [...initialEvents, wastePlayedToTableauEvent]
              ]);
            });
          });

          describe('When invoked with a valid "playWasteToFoundation" event', () => {
            let result: APIGatewayProxyResultWithData | void;

            beforeEach(async () => {
              result = await patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playWasteToFoundation'
                  },
                  data: {
                    foundationIndex: 2
                  }
                } as any,
                {} as any,
                undefined as any);
            });

            it('Loads the events', () => {
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playWasteToFoundation command', () => {
              expect(playWasteToFoundationStub.callCount).to.equal(1);
              expect(playWasteToFoundationStub.firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  foundationIndex: 2
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect(buildTableStateStub.callCount).to.equal(1);
              expect(buildTableStateStub.firstCall.args).to.deep.equal([
                [...initialEvents, wastePlayedToFoundationEvent]
              ]);
            });
          });

          describe('When invoked with a valid "playTableauToTableau" event', () => {
            let result: APIGatewayProxyResultWithData | void;

            beforeEach(async () => {
              result = await patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playTableauToTableau'
                  },
                  data: {
                    fromIndex: 7,
                    count: 3,
                    toIndex: 0
                  }
                } as any,
                {} as any,
                undefined as any);
            });

            it('Loads the events', () => {
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playTableauToTableau command', () => {
              expect(playTableauToTableauStub.callCount).to.equal(1);
              expect(playTableauToTableauStub.firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  fromIndex: 7,
                  count: 3,
                  toIndex: 0
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect(buildTableStateStub.callCount).to.equal(1);
              expect(buildTableStateStub.firstCall.args).to.deep.equal([
                [...initialEvents, tableauPlayedToTableauEvent]
              ]);
            });
          });

          describe('When invoked with a valid "playTableauToFoundation" event', () => {
            let result: APIGatewayProxyResultWithData | void;

            beforeEach(async () => {
              result = await patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playTableauToFoundation'
                  },
                  data: {
                    tableauIndex: 5,
                    foundationIndex: 1
                  }
                } as any,
                {} as any,
                undefined as any);
            });

            it('Loads the events', () => {
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playTableauToTableau command', () => {
              expect(playTableauToFoundationStub.callCount).to.equal(1);
              expect(playTableauToFoundationStub.firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  tableauIndex: 5,
                  foundationIndex: 1
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect(buildTableStateStub.callCount).to.equal(1);
              expect(buildTableStateStub.firstCall.args).to.deep.equal([
                [...initialEvents, tableauPlayedToFoundationEvent]
              ]);
            });
          });

          describe('When invoked with a valid "claimVictory" event', () => {
            let result: APIGatewayProxyResultWithData | void;

            beforeEach(async () => {
              result = await patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'claimVictory'
                  }
                } as any,
                {} as any,
                undefined as any);
            });

            it('Loads the events', () => {
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the claimVictory command', () => {
              expect(claimVictoryStub.callCount).to.equal(1);
              expect(claimVictoryStub.firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42'
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect(buildTableStateStub.callCount).to.equal(1);
              expect(buildTableStateStub.firstCall.args).to.deep.equal([
                [...initialEvents, victoryClaimedEvent]
              ]);
            });
          });
        });

        describe('Given gameplay commands throw an error', () => {
          const commandError = Error('Command failed');

          let dealStockToWasteStub: SinonStub;
          let resetWasteToStockStub: SinonStub;
          let playWasteToTableauStub: SinonStub;
          let playWasteToFoundationStub: SinonStub;
          let playTableauToTableauStub: SinonStub;
          let playTableauToFoundationStub: SinonStub;
          let claimVictoryStub: SinonStub;

          beforeEach(() => {
            dealStockToWasteStub = stub(dealStockToWasteModule, 'dealStockToWaste')
              .rejects(commandError);
            resetWasteToStockStub = stub(resetWasteToStockModule, 'resetWasteToStock')
              .rejects(commandError);
            playWasteToTableauStub = stub(playWasteToTableauModule, 'playWasteToTableau')
              .rejects(commandError);
            playWasteToFoundationStub = stub(playWasteToFoundationModule, 'playWasteToFoundation')
              .rejects(commandError);
            playTableauToTableauStub = stub(playTableauToTableauModule, 'playTableauToTableau')
              .rejects(commandError);
            playTableauToFoundationStub = stub(playTableauToFoundationModule, 'playTableauToFoundation')
              .rejects(commandError);
            claimVictoryStub = stub(claimVictoryModule, 'claimVictory')
              .rejects(commandError);
          });

          afterEach(() => {
            dealStockToWasteStub.restore();
            resetWasteToStockStub.restore();
            playWasteToTableauStub.restore();
            playWasteToFoundationStub.restore();
            playTableauToTableauStub.restore();
            playTableauToFoundationStub.restore();
            claimVictoryStub.restore();
          });

          describe('When invoked with a valid gameId and a moveType of "dealStockToWaste"', () => {
            it('Loads the events then throws the command error without building state', async () => {
              await expect(patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'dealStockToWaste'
                  }
                } as any,
                {} as any,
                undefined as any))
                .to.be.eventually.rejectedWith(commandError);
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
              expect(buildTableStateStub.callCount).to.equal(0);
              expect(buildScoreStateStub.callCount).to.equal(0);
            });
          });

          describe('When invoked with a valid gameId and a moveType of "resetWasteToStock"', () => {
            it('Loads the events then throws the command error without building state', async () => {
              await expect(patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'resetWasteToStock'
                  }
                } as any,
                {} as any,
                undefined as any))
                .to.be.eventually.rejectedWith(commandError);
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
              expect(buildTableStateStub.callCount).to.equal(0);
              expect(buildScoreStateStub.callCount).to.equal(0);
            });
          });

          describe('When invoked with a valid gameId and a moveType of "playWasteToTableau"', () => {
            it('Loads the events then throws the command error without building state', async () => {
              await expect(patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playWasteToTableau'
                  }
                } as any,
                {} as any,
                undefined as any))
                .to.be.eventually.rejectedWith(commandError);
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
              expect(buildTableStateStub.callCount).to.equal(0);
              expect(buildScoreStateStub.callCount).to.equal(0);
            });
          });

          describe('When invoked with a valid gameId and a moveType of "playWasteToFoundation"', () => {
            it('Loads the events then throws the command error without building state', async () => {
              await expect(patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playWasteToFoundation'
                  }
                } as any,
                {} as any,
                undefined as any))
                .to.be.eventually.rejectedWith(commandError);
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
              expect(buildTableStateStub.callCount).to.equal(0);
              expect(buildScoreStateStub.callCount).to.equal(0);
            });
          });

          describe('When invoked with a valid gameId and a moveType of "playTableauToTableau"', () => {
            it('Loads the events then throws the command error without building state', async () => {
              await expect(patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playTableauToTableau'
                  }
                } as any,
                {} as any,
                undefined as any))
                .to.be.eventually.rejectedWith(commandError);
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
              expect(buildTableStateStub.callCount).to.equal(0);
              expect(buildScoreStateStub.callCount).to.equal(0);
            });
          });

          describe('When invoked with a valid gameId and a moveType of "playTableauToFoundation"', () => {
            it('Loads the events then throws the command error without building state', async () => {
              await expect(patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'playTableauToFoundation'
                  }
                } as any,
                {} as any,
                undefined as any))
                .to.be.eventually.rejectedWith(commandError);
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
              expect(buildTableStateStub.callCount).to.equal(0);
              expect(buildScoreStateStub.callCount).to.equal(0);
            });
          });

          describe('When invoked with a valid gameId and a moveType of "claimVictory"', () => {
            it('Loads the events then throws the command error without building state', async () => {
              await expect(patchGameHandler(
                {
                  pathParameters: {
                    gameId: 'game-42',
                    moveType: 'claimVictory'
                  }
                } as any,
                {} as any,
                undefined as any))
                .to.be.eventually.rejectedWith(commandError);
              expect(loadEventsStub.callCount).to.equal(1);
              expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
              expect(buildTableStateStub.callCount).to.equal(0);
              expect(buildScoreStateStub.callCount).to.equal(0);
            });
          });
        });
      });
    });

    describe('Given the game events fail to load with an error', () => {
      const thrownError = Error('Error loading events');
      let loadEventsStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').rejects(thrownError);
      });

      afterEach(() => {
        loadEventsStub.restore();
      });

      describe('When invoked with a gameId path parameter', () => {
        it('Throws the error from loading the events', async () => {
          await expect(patchGameHandler(                {
              pathParameters: {
                gameId: 'game-42',
                moveType: 'dealStockToWaste'
              }
            } as any,
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
