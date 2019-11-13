import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { createSampleCreateGameEvent, createSampleGameplayEvent } from '../../../../fixtures/events';
import * as eventStoreModule from '../../../../../src/events/store';
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

      beforeEach(() => {
        initialEvents = [
          createSampleCreateGameEvent(),
          createSampleGameplayEvent<GameEventType.stockDealtToWaste, StockDealtToWasteEvent>(
            GameEventType.stockDealtToWaste,
            'game-42',
            'event-999',
            {})
        ];
        stub(eventStoreModule, 'loadEvents').resolves(initialEvents);
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

        describe('Given gameplay commands can be successfully executed', () => {
          let stockDealtToWasteEvent: StockDealtToWasteEvent;
          let wasteResetToStockEvent: WasteResetToStockEvent;
          let wastePlayedToTableauEvent: WastePlayedToTableauEvent;
          let wastePlayedToFoundationEvent: WastePlayedToFoundationEvent;
          let tableauPlayedToTableauEvent: TableauPlayedToTableauEvent;
          let tableauPlayedToFoundationEvent: TableauPlayedToFoundationEvent;
          let victoryClaimedEvent: VictoryClaimedEvent;

          beforeEach(() => {
            stockDealtToWasteEvent = createSampleGameplayEvent<GameEventType.stockDealtToWaste, StockDealtToWasteEvent>(
              GameEventType.stockDealtToWaste,
              'game-42',
              'event-1000',
              {});

            wasteResetToStockEvent = createSampleGameplayEvent<GameEventType.wasteResetToStock, WasteResetToStockEvent>(
              GameEventType.wasteResetToStock,
              'game-42',
              'event-1001',
              {});

            wastePlayedToTableauEvent = createSampleGameplayEvent<GameEventType.wastePlayedToTableau, WastePlayedToTableauEvent>(
              GameEventType.wastePlayedToTableau,
              'game-42',
              'event-1002',
              {
                tableauIndex: 1
              });

            wastePlayedToFoundationEvent = createSampleGameplayEvent<GameEventType.wastePlayedToFoundation, WastePlayedToFoundationEvent>(
              GameEventType.wastePlayedToFoundation,
              'game-42',
              'event-1003',
              {
                foundationIndex: 2
              });

            tableauPlayedToTableauEvent = createSampleGameplayEvent<GameEventType.tableauPlayedToTableau, TableauPlayedToTableauEvent>(
              GameEventType.tableauPlayedToTableau,
              'game-42',
              'event-1004',
              {
                fromIndex: 7,
                count: 3,
                toIndex: 0
              });

            tableauPlayedToFoundationEvent = createSampleGameplayEvent<GameEventType.tableauPlayedToFoundation, TableauPlayedToFoundationEvent>(
              GameEventType.tableauPlayedToFoundation,
              'game-42',
              'event-1005',
              {
                tableauIndex: 5,
                foundationIndex: 1
              });

            victoryClaimedEvent = createSampleGameplayEvent<GameEventType.victoryClaimed, VictoryClaimedEvent>(
              GameEventType.victoryClaimed,
              'game-42',
              'event-1006',
              {});

            stub(dealStockToWasteModule, 'dealStockToWaste').resolves(stockDealtToWasteEvent);
            stub(resetWasteToStockModule, 'resetWasteToStock').resolves(wasteResetToStockEvent);
            stub(playWasteToTableauModule, 'playWasteToTableau').resolves(wastePlayedToTableauEvent);
            stub(playWasteToFoundationModule, 'playWasteToFoundation').resolves(wastePlayedToFoundationEvent);
            stub(playTableauToTableauModule, 'playTableauToTableau').resolves(tableauPlayedToTableauEvent);
            stub(playTableauToFoundationModule, 'playTableauToFoundation').resolves(tableauPlayedToFoundationEvent);
            stub(claimVictoryModule, 'claimVictory').resolves(victoryClaimedEvent);
          });

          afterEach(() => {
            (dealStockToWasteModule.dealStockToWaste as SinonStub).restore();
            (resetWasteToStockModule.resetWasteToStock as SinonStub).restore();
            (playWasteToTableauModule.playWasteToTableau as SinonStub).restore();
            (playWasteToFoundationModule.playWasteToFoundation as SinonStub).restore();
            (playTableauToTableauModule.playTableauToTableau as SinonStub).restore();
            (playTableauToFoundationModule.playTableauToFoundation as SinonStub).restore();
            (claimVictoryModule.claimVictory as SinonStub).restore();
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
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the dealStockToWaste command', () => {
              expect((dealStockToWasteModule.dealStockToWaste as SinonStub).callCount).to.equal(1);
              expect((dealStockToWasteModule.dealStockToWaste as SinonStub).firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42'
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(1);
              expect((tableStateModule.buildTableState as SinonStub).firstCall.args).to.deep.equal([
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
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the resetWasteToStock command', () => {
              expect((resetWasteToStockModule.resetWasteToStock as SinonStub).callCount).to.equal(1);
              expect((resetWasteToStockModule.resetWasteToStock as SinonStub).firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42'
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(1);
              expect((tableStateModule.buildTableState as SinonStub).firstCall.args).to.deep.equal([
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
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playWasteToTableau command', () => {
              expect((playWasteToTableauModule.playWasteToTableau as SinonStub).callCount).to.equal(1);
              expect((playWasteToTableauModule.playWasteToTableau as SinonStub).firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  tableauIndex: 1
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(1);
              expect((tableStateModule.buildTableState as SinonStub).firstCall.args).to.deep.equal([
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
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playWasteToFoundation command', () => {
              expect((playWasteToFoundationModule.playWasteToFoundation as SinonStub).callCount).to.equal(1);
              expect((playWasteToFoundationModule.playWasteToFoundation as SinonStub).firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  foundationIndex: 2
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(1);
              expect((tableStateModule.buildTableState as SinonStub).firstCall.args).to.deep.equal([
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
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playTableauToTableau command', () => {
              expect((playTableauToTableauModule.playTableauToTableau as SinonStub).callCount).to.equal(1);
              expect((playTableauToTableauModule.playTableauToTableau as SinonStub).firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  fromIndex: 7,
                  count: 3,
                  toIndex: 0
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(1);
              expect((tableStateModule.buildTableState as SinonStub).firstCall.args).to.deep.equal([
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
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the playTableauToTableau command', () => {
              expect((playTableauToFoundationModule.playTableauToFoundation as SinonStub).callCount).to.equal(1);
              expect((playTableauToFoundationModule.playTableauToFoundation as SinonStub).firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42',
                  tableauIndex: 5,
                  foundationIndex: 1
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(1);
              expect((tableStateModule.buildTableState as SinonStub).firstCall.args).to.deep.equal([
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
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
            });

            it('Invokes the claimVictory command', () => {
              expect((claimVictoryModule.claimVictory as SinonStub).callCount).to.equal(1);
              expect((claimVictoryModule.claimVictory as SinonStub).firstCall.args).to.deep.equal([
                {
                  gameId: 'game-42'
                }
              ]);
            });

            it('Builds the state based on the loaded events plus the created event', () => {
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(1);
              expect((tableStateModule.buildTableState as SinonStub).firstCall.args).to.deep.equal([
                [...initialEvents, victoryClaimedEvent]
              ]);
            });
          });
        });

        describe('Given gameplay commands throw an error', () => {
          let thrownError = Error('Command failed');

          beforeEach(() => {
            stub(dealStockToWasteModule, 'dealStockToWaste').rejects(thrownError);
            stub(resetWasteToStockModule, 'resetWasteToStock').rejects(thrownError);
            stub(playWasteToTableauModule, 'playWasteToTableau').rejects(thrownError);
            stub(playWasteToFoundationModule, 'playWasteToFoundation').rejects(thrownError);
            stub(playTableauToTableauModule, 'playTableauToTableau').rejects(thrownError);
            stub(playTableauToFoundationModule, 'playTableauToFoundation').rejects(thrownError);
            stub(claimVictoryModule, 'claimVictory').rejects(thrownError);
          });

          afterEach(() => {
            (dealStockToWasteModule.dealStockToWaste as SinonStub).restore();
            (resetWasteToStockModule.resetWasteToStock as SinonStub).restore();
            (playWasteToTableauModule.playWasteToTableau as SinonStub).restore();
            (playWasteToFoundationModule.playWasteToFoundation as SinonStub).restore();
            (playTableauToTableauModule.playTableauToTableau as SinonStub).restore();
            (playTableauToFoundationModule.playTableauToFoundation as SinonStub).restore();
            (claimVictoryModule.claimVictory as SinonStub).restore();
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
                undefined as any)
              ).to.be.eventually.rejectedWith(thrownError);
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(0);
              expect((scoreStateModule.buildScoreState as SinonStub).callCount).to.equal(0);
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
                undefined as any)
              ).to.be.eventually.rejectedWith(thrownError);
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(0);
              expect((scoreStateModule.buildScoreState as SinonStub).callCount).to.equal(0);
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
                undefined as any)
              ).to.be.eventually.rejectedWith(thrownError);
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(0);
              expect((scoreStateModule.buildScoreState as SinonStub).callCount).to.equal(0);
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
                undefined as any)
              ).to.be.eventually.rejectedWith(thrownError);
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(0);
              expect((scoreStateModule.buildScoreState as SinonStub).callCount).to.equal(0);
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
                undefined as any)
              ).to.be.eventually.rejectedWith(thrownError);
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(0);
              expect((scoreStateModule.buildScoreState as SinonStub).callCount).to.equal(0);
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
                undefined as any)
              ).to.be.eventually.rejectedWith(thrownError);
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(0);
              expect((scoreStateModule.buildScoreState as SinonStub).callCount).to.equal(0);
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
                undefined as any)
              ).to.be.eventually.rejectedWith(thrownError);
              expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
              expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
              expect((tableStateModule.buildTableState as SinonStub).callCount).to.equal(0);
              expect((scoreStateModule.buildScoreState as SinonStub).callCount).to.equal(0);
            });
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
          await expect(patchGameHandler(                {
              pathParameters: {
                gameId: 'game-42',
                moveType: 'dealStockToWaste'
              }
            } as any,
            {} as any,
            undefined as any)).to.be.eventually.rejectedWith(thrownError);
          expect((eventStoreModule.loadEvents as SinonStub).callCount).to.equal(1);
          expect((eventStoreModule.loadEvents as SinonStub).firstCall.args).to.deep.equal(['game-42']);
        });
      });
    });
  });
});
