import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { Interface } from 'readline';
import { handleCommand } from '../../../src/commands';
import { Game } from '../../../src/types';
import * as routesModule from '../../../src/commands/routes';
import * as apiModule from '../../../src/services/api';

describe('Handling a command entered by the user', () => {
  const game: Game = {
    gameId: 'game-42',
    table: 'initial stable state'
  } as unknown as Game;

  const modifiedGame: Game = {
    gameId: 'game-42',
    table: 'modified stable state'
  } as unknown as Game;

  let getCommandRouteStub: SinonStub;
  let consoleErrorStub: SinonStub;
  let playGameStub: SinonStub;

  beforeEach(() => {
    getCommandRouteStub = stub(routesModule, 'getCommandRoute');
    consoleErrorStub = stub(console, 'error');
    playGameStub = stub(apiModule, 'playGame');
  });

  afterEach(() => {
    getCommandRouteStub.restore();
    consoleErrorStub.restore();
    playGameStub.restore();
  });

  describe('Given the readline interface is working normally', () => {
    let readlineInterface: Interface;

    beforeEach(() => {
      readlineInterface = {} as Interface;
    });

    describe('Given a game is in progress', () => {
      describe('When the command is an empty string (i.e. the user only presses enter)', () => {
        beforeEach(() => {
          getCommandRouteStub.returns(undefined);
        });

        describe('When invoked', () => {
          let result: Game | void;

          beforeEach(async () => {
            result = await handleCommand(readlineInterface, game, '');
          });

          it('Does not print an error message', () => {
            expect(consoleErrorStub.called).to.equal(false);
          });

          it('Does not call the "playGame" API', () => {
            expect(playGameStub.called).to.equal(false);
          });

          it('Returns the game unmodified', () => {
            expect(result).to.equal(game);
          });
        });
      });

      describe('When the command is a non-empty string command that does not match any command route', () => {
        beforeEach(() => {
          getCommandRouteStub.returns(undefined);
        });

        describe('When invoked', () => {
          it('Throws an error', async () => {
            await expect(handleCommand(readlineInterface, game, 'not-a-valid-command'))
              .to.be.eventually.rejectedWith('Unknown command "not-a-valid-command');
            expect(playGameStub.called).to.equal(false);
          });
        });
      });

      describe('When the command matches a command route of type "special"', () => {
        let handler: SinonStub;

        beforeEach(() => {
          handler = stub().returns(modifiedGame);
          getCommandRouteStub.returns({
            type: 'special',
            match: /^t(?:est)?$/,
            handler
          });
        });

        describe('When invoked', () => {
          let result: Game | void;

          beforeEach(async () => {
            result = await handleCommand(readlineInterface, game, 'test');
          });

          it('Does not print an error message', () => {
            expect(consoleErrorStub.called).to.equal(false);
          });

          it('Does not call the "playGame" API', () => {
            expect(playGameStub.called).to.equal(false);
          });

          it('Returns the modified game from the command route handler', () => {
            expect(result).to.equal(modifiedGame);
          });
        });
      });

      describe('When the command matches a command route of type "gameplay" with no arguments', () => {
        beforeEach(() => {
          getCommandRouteStub.returns({
            type: 'gameplay',
            match: /^m(?:ove)?$/,
            command: 'moveCardFromAtoB',
            parameters: []
          });
        });

        describe('When the "playGame" API call is working normally', () => {
          beforeEach(() => {
            playGameStub.resolves(modifiedGame);
          });

          describe('When invoked', () => {
            let result: Game | void;

            beforeEach(async () => {
              result = await handleCommand(readlineInterface, game, 'move');
            });

            it('Does not print an error message', () => {
              expect(consoleErrorStub.called).to.equal(false);
            });

            it('Calls the "playGame" API', () => {
              expect(playGameStub.calledOnce).to.equal(true);
              expect(playGameStub.firstCall.args).to.deep.equal([
                'game-42',
                'moveCardFromAtoB',
                {}
              ]);
            });

            it('Returns the modified game from the playGame API call', () => {
              expect(result).to.equal(modifiedGame);
            });
          });
        });

        describe('When the "playGame" API call is throwing errors', () => {
          const playGameError = Error('API call failed');

          beforeEach(() => {
            playGameStub.rejects(playGameError);
          });

          describe('When invoked', () => {
            it('Throws the API error', async () => {
              await expect(handleCommand(readlineInterface, game, 'move'))
                .to.be.eventually.rejectedWith(playGameError);
              expect(playGameStub.calledOnce).to.equal(true);
              expect(playGameStub.firstCall.args).to.deep.equal([
                'game-42',
                'moveCardFromAtoB',
                {}
              ]);
            });
          });
        });
      });

      describe('When the command matches a command route of type "gameplay" with arguments', () => {
        beforeEach(() => {
          getCommandRouteStub.returns({
            type: 'gameplay',
            match: /^m(?:ove)? ([xyz]) ([xyz])$/,
            command: 'moveCardBetweenXYZ',
            parameters: [
              {
                name: 'from',
                parse: (value: any) => value
              },
              {
                name: 'to',
                parse: (value: any) => value
              }
            ]
          });
        });

        describe('When the "playGame" API call is working normally', () => {
          beforeEach(() => {
            playGameStub.resolves(modifiedGame);
          });

          describe('When invoked', () => {
            let result: Game | void;

            beforeEach(async () => {
              result = await handleCommand(readlineInterface, game, 'move x y');
            });

            it('Does not print an error message', () => {
              expect(consoleErrorStub.called).to.equal(false);
            });

            it('Calls the "playGame" API', () => {
              expect(playGameStub.calledOnce).to.equal(true);
              expect(playGameStub.firstCall.args).to.deep.equal([
                'game-42',
                'moveCardBetweenXYZ',
                {
                  from: 'x',
                  to: 'y'
                }
              ]);
            });

            it('Returns the modified game from the playGame API call', () => {
              expect(result).to.equal(modifiedGame);
            });
          });
        });

        describe('When the "playGame" API call is throwing errors', () => {
          const playGameError = Error('API call failed');

          beforeEach(() => {
            playGameStub.rejects(playGameError);
          });

          describe('When invoked', () => {
            it('Throws the API error', async () => {
              await expect(handleCommand(readlineInterface, game, 'move x y'))
                .to.be.eventually.rejectedWith(playGameError);
              expect(playGameStub.calledOnce).to.equal(true);
              expect(playGameStub.calledOnce).to.equal(true);
              expect(playGameStub.firstCall.args).to.deep.equal([
                'game-42',
                'moveCardBetweenXYZ',
                {
                  from: 'x',
                  to: 'y'
                }
              ]);
            });
          });
        });
      });
    });
  });
});
