import { SinonStub, stub } from 'sinon';
import * as osModule from 'os';
import * as fsModule from 'fs';
import * as apiModule from '../../../src/services/api';
import { loadCurrentGame, safelyRemoveGameFile } from '../../../src/services/game';
import { Game } from '../../../src/types';
import { expect } from 'chai';

describe('The game file service', () => {
  beforeEach(() => {
    stub(osModule, 'homedir').returns('/home/test');
  });

  afterEach(() => {
    (osModule.homedir as SinonStub).restore();
  });

  describe('Loading a game', () => {
    const explicitLoadedGame: Game = {
      gameId: 'game-99',
      table: 'current table state'
    } as unknown as Game;

    const loadedGame: Game = {
      gameId: 'game-42',
      table: 'current table state'
    } as unknown as Game;

    const createdGame: Game = {
      gameId: 'created-game',
      table: 'initial table state'
    } as unknown as Game;

    const apiError = Error('HTTP 500 Internal Server Error');
    const fsError = Error('File system is broken');

    let existsStub: SinonStub;
    let readFileStub: SinonStub;
    let writeFileStub: SinonStub;
    let loadGameStub: SinonStub;
    let createGameStub: SinonStub;
    let consoleInfoStub: SinonStub;

    beforeEach(() => {
      existsStub = stub(fsModule, 'exists');
      readFileStub = stub(fsModule, 'readFile');
      writeFileStub = stub(fsModule, 'writeFile');
      loadGameStub = stub(apiModule, 'loadGame');
      createGameStub = stub(apiModule, 'createGame');
      consoleInfoStub = stub(console, 'info');
    });

    afterEach(() => {
      existsStub.restore();
      readFileStub.restore();
      writeFileStub.restore();
      loadGameStub.restore();
      createGameStub.restore();
      consoleInfoStub.restore();
    });

    describe('Given the API is working normally', () => {
      beforeEach(() => {
        createGameStub.resolves(createdGame);
        loadGameStub
          .withArgs('game-42').resolves(loadedGame)
          .withArgs('game-99').resolves(explicitLoadedGame);
      });

      describe('Given the game data file does not exist', () => {
        beforeEach(() => {
          existsStub.callsFake((path, callback) => callback(undefined, false));
          writeFileStub.callsFake((path, data, callback) => callback());
        });

        describe('When invoked with no parameters', () => {
          let result: Game;

          beforeEach(async () => {
            result = await loadCurrentGame();
          });

          it('Checks if the game data file exists', () => {
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
          });

          it('Does not read the game data file', () => {
            expect(readFileStub.called).to.equal(false);
          });

          it('Creates a game', () => {
            expect(createGameStub.calledOnce).to.equal(true);
          });

          it('Does not load a game', () => {
            expect(loadGameStub.called).to.equal(false);
          });

          it('Writes the game ID to the game data file', () => {
            expect(writeFileStub.calledOnce).to.equal(true);
            expect(writeFileStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli',
              'created-game'
            ]);
          });

          it('Logs a message', () => {
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Created game created-game and saved ID to /home/test/.patience-cli'
            ]);
          });

          it('Returns the created game', () => {
            expect(result).to.equal(createdGame);
          });
        });

        describe('When invoked with an override game ID', () => {
          let result: Game;

          beforeEach(async () => {
            result = await loadCurrentGame('game-99');
          });

          it('Does not check if the game data file exists', () => {
            expect(existsStub.called).to.equal(false);
          });

          it('Does not read the game data file', () => {
            expect(readFileStub.called).to.equal(false);
          });

          it('Does not create a game', () => {
            expect(createGameStub.called).to.equal(false);
          });

          it('Loads a game', () => {
            expect(loadGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.firstCall.args).to.deep.equal([
              'game-99'
            ]);
          });

          it('Does not writes to the game data file', () => {
            expect(writeFileStub.called).to.equal(false);
          });

          it('Logs a message', () => {
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Continuing explicitly requested game game-99'
            ]);
          });

          it('Returns the loaded game', () => {
            expect(result).to.equal(explicitLoadedGame);
          });
        });

        describe('When invoked with the new game flag set', () => {
          let result: Game;

          beforeEach(async () => {
            result = await loadCurrentGame(undefined, true);
          });

          it('Checks if the game data file exists', () => {
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
          });

          it('Does not read the game data file', () => {
            expect(readFileStub.called).to.equal(false);
          });

          it('Creates a game', () => {
            expect(createGameStub.calledOnce).to.equal(true);
          });

          it('Does not load a game', () => {
            expect(loadGameStub.called).to.equal(false);
          });

          it('Writes the game ID to the game data file', () => {
            expect(writeFileStub.calledOnce).to.equal(true);
            expect(writeFileStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli',
              'created-game'
            ]);
          });

          it('Logs a message', () => {
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Created game created-game and saved ID to /home/test/.patience-cli'
            ]);
          });

          it('Returns the created game', () => {
            expect(result).to.equal(createdGame);
          });
        });
      });

      describe('Given the game data file exists with a game ID', () => {
        beforeEach(() => {
          existsStub.callsFake((path, callback) => callback(undefined, true));
          readFileStub.callsFake((path, encoding, callback) => callback(undefined, 'game-42'));
          writeFileStub.callsFake((path, data, callback) => callback());
        });

        describe('When invoked with no parameters', () => {
          let result: Game;

          beforeEach(async () => {
            result = await loadCurrentGame();
          });

          it('Checks if the game data file exists', () => {
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
          });

          it('Reads the game data file', () => {
            expect(readFileStub.calledOnce).to.equal(true);
            expect(readFileStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli',
              'utf-8'
            ]);
          });

          it('Does not create a game', () => {
            expect(createGameStub.called).to.equal(false);
          });

          it('Loads a game', () => {
            expect(loadGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.firstCall.args).to.deep.equal([
              'game-42'
            ]);
          });

          it('Does not write to the game data file', () => {
            expect(writeFileStub.called).to.equal(false);
          });

          it('Logs a message', () => {
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Continuing game game-42'
            ]);
          });

          it('Returns the loaded game', () => {
            expect(result).to.equal(loadedGame);
          });
        });

        describe('When invoked with an override game ID', () => {
          let result: Game;

          beforeEach(async () => {
            result = await loadCurrentGame('game-99');
          });

          it('Does not check if the game data file exists', () => {
            expect(existsStub.called).to.equal(false);
          });

          it('Does not read the game data file', () => {
            expect(readFileStub.called).to.equal(false);
          });

          it('Does not create a game', () => {
            expect(createGameStub.called).to.equal(false);
          });

          it('Loads a game', () => {
            expect(loadGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.firstCall.args).to.deep.equal([
              'game-99'
            ]);
          });

          it('Does not writes to the game data file', () => {
            expect(writeFileStub.called).to.equal(false);
          });

          it('Logs a message', () => {
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Continuing explicitly requested game game-99'
            ]);
          });

          it('Returns the loaded game', () => {
            expect(result).to.equal(explicitLoadedGame);
          });
        });

        describe('When invoked with the new game flag set', () => {
          let result: Game;

          beforeEach(async () => {
            result = await loadCurrentGame(undefined, true);
          });

          it('Checks if the game data file exists', () => {
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
          });

          it('Does not read the game data file', () => {
            expect(readFileStub.called).to.equal(false);
          });

          it('Creates a game', () => {
            expect(createGameStub.calledOnce).to.equal(true);
          });

          it('Does not load a game', () => {
            expect(loadGameStub.called).to.equal(false);
          });

          it('Writes the game ID to the game data file', () => {
            expect(writeFileStub.calledOnce).to.equal(true);
            expect(writeFileStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli',
              'created-game'
            ]);
          });

          it('Logs a message', () => {
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Created game created-game and saved ID to /home/test/.patience-cli'
            ]);
          });

          it('Returns the created game', () => {
            expect(result).to.equal(createdGame);
          });
        });
      });

      describe('Given the file system is throwing errors', () => {
        beforeEach(() => {
          existsStub.callsFake((path, callback) => callback(fsError));
          writeFileStub.callsFake((path, data, callback) => callback(fsError));
        });

        describe('When invoked with no parameters', () => {
          it('Fails when checking for the existence of the file', async () => {
            await expect(loadCurrentGame()).to.be.eventually.rejectedWith(fsError);
            expect(existsStub.calledOnce).to.equal(true); // FAILS HERE
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(readFileStub.called).to.equal(false);
            expect(createGameStub.calledOnce).to.equal(false);
            expect(loadGameStub.called).to.equal(false);
            expect(writeFileStub.called).to.equal(false);
            expect(consoleInfoStub.called).to.equal(false);
          });
        });

        describe('When invoked with an override game ID', () => {
          let result: Game;

          beforeEach(async () => {
            result = await loadCurrentGame('game-99');
          });

          it('Does not check if the game data file exists', () => {
            expect(existsStub.called).to.equal(false);
          });

          it('Does not read the game data file', () => {
            expect(readFileStub.called).to.equal(false);
          });

          it('Does not create a game', () => {
            expect(createGameStub.called).to.equal(false);
          });

          it('Loads a game', () => {
            expect(loadGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.firstCall.args).to.deep.equal([
              'game-99'
            ]);
          });

          it('Does not writes to the game data file', () => {
            expect(writeFileStub.called).to.equal(false);
          });

          it('Logs a message', () => {
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Continuing explicitly requested game game-99'
            ]);
          });

          it('Returns the loaded game', () => {
            expect(result).to.equal(explicitLoadedGame);
          });
        });

        describe('When invoked with the new game flag set', () => {
          it('Performs the correct sequence and fails when writing the game file', async () => {
            await expect(loadCurrentGame(undefined, true))
              .to.be.eventually.rejectedWith(fsError);
            expect(existsStub.calledOnce).to.equal(true); // FAILS HERE
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(createGameStub.calledOnce).to.equal(false);
            expect(writeFileStub.called).to.equal(false);
            expect(readFileStub.called).to.equal(false);
            expect(loadGameStub.called).to.equal(false);
            expect(consoleInfoStub.calledOnce).to.equal(false);
          });
        });
      });
    });

    describe('Given the API is throwing errors', () => {
      beforeEach(() => {
        loadGameStub.rejects(apiError);
        createGameStub.rejects(apiError);
      });

      describe('Given the game data file does not exist', () => {
        beforeEach(() => {
          existsStub.callsFake((path, callback) => callback(undefined, false));
          writeFileStub.callsFake((path, data, callback) => callback());
        });

        describe('When invoked with no parameters', () => {
          it('Performs the correct sequence and fails with the "createGame" API error', async () => {
            await expect(loadCurrentGame()).to.be.eventually.rejectedWith(apiError);
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(readFileStub.called).to.equal(false);
            expect(createGameStub.calledOnce).to.equal(true); // FAILS HERE
            expect(loadGameStub.called).to.equal(false);
            expect(writeFileStub.called).to.equal(false);
            expect(consoleInfoStub.called).to.equal(false);
          });
        });

        describe('When invoked with an override game ID', async () => {
          it('Only logs a message and fails on the "loadGame" API', async () => {
            await expect(loadCurrentGame('game-99')).to.be.eventually.rejectedWith(apiError);
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Continuing explicitly requested game game-99'
            ]);
            expect(loadGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.firstCall.args).to.deep.equal([
              'game-99'
            ]);
            expect(existsStub.called).to.equal(false);
            expect(readFileStub.called).to.equal(false);
            expect(createGameStub.called).to.equal(false);
            expect(writeFileStub.called).to.equal(false);
          });
        });

        describe('When invoked with the new game flag set', () => {
          it('Performs the correct sequence and fails with the "createGame" API error', async () => {
            await expect(loadCurrentGame(undefined, true))
              .to.be.eventually.rejectedWith(apiError);
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(createGameStub.calledOnce).to.equal(true);
            expect(readFileStub.called).to.equal(false);
            expect(loadGameStub.called).to.equal(false);
            expect(writeFileStub.called).to.equal(false);
            expect(consoleInfoStub.calledOnce).to.equal(false);
          });
        });
      });

      describe('Given the game data file exists with a game ID', () => {
        beforeEach(() => {
          existsStub.callsFake((path, callback) => callback(undefined, true));
          readFileStub.callsFake((path, encoding, callback) => callback(undefined, 'game-42'));
          writeFileStub.callsFake((path, data, callback) => callback());
        });

        describe('When invoked with no parameters', () => {
          it('Performs the correct sequence and fails with the "loadGame" API error', async () => {
            await expect(loadCurrentGame()).to.be.eventually.rejectedWith(apiError);
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(readFileStub.calledOnce).to.equal(true);
            expect(readFileStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli',
              'utf-8'
            ]);
            expect(createGameStub.called).to.equal(false);
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Continuing game game-42'
            ]);
            expect(loadGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.firstCall.args).to.deep.equal([
              'game-42'
            ]);
            expect(writeFileStub.called).to.equal(false);
          });
        });

        describe('When invoked with an override game ID', () => {
          it('Performs the correct startup sequence and fails with the "loadGame" API error', async () => {
            await expect(loadCurrentGame('game-99')).to.be.eventually.rejectedWith(apiError);
            expect(existsStub.called).to.equal(false);
            expect(readFileStub.called).to.equal(false);
            expect(createGameStub.called).to.equal(false);
            expect(loadGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.firstCall.args).to.deep.equal([
              'game-99'
            ]);
            expect(writeFileStub.called).to.equal(false);
            expect(consoleInfoStub.calledOnce).to.equal(true);
            expect(consoleInfoStub.firstCall.args).to.deep.equal([
              'Continuing explicitly requested game game-99'
            ]);
          });
        });

        describe('When invoked with the new game flag set', () => {
          it('Performs the correct startup sequence and fails with the "createGame" API error', async () => {
            await expect(loadCurrentGame(undefined, true))
              .to.be.eventually.rejectedWith(apiError);
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(readFileStub.called).to.equal(false);
            expect(createGameStub.calledOnce).to.equal(true);
            expect(loadGameStub.called).to.equal(false);
            expect(writeFileStub.called).to.equal(false);
            expect(consoleInfoStub.called).to.equal(false);
          });
        });
      });
    });
  });

  describe('Removing the game file', () => {
    let existsStub: SinonStub;
    let unlinkStub: SinonStub;

    beforeEach(() => {
      existsStub = stub(fsModule, 'exists');
      unlinkStub = stub(fsModule, 'unlink');
    });

    afterEach(() => {
      existsStub.restore();
      unlinkStub.restore();
    });

    describe('Given the file does not exist', () => {
      beforeEach(() => {
        existsStub.callsFake((path, callback) => callback(undefined, false));
      });

      describe('When invoked', () => {
        beforeEach(async () => {
          await safelyRemoveGameFile();
        });

        it('Checks if the game data file exists', () => {
          expect(existsStub.calledOnce).to.equal(true);
          expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
            '/home/test/.patience-cli'
          ])
        });

        it('Does not delete the game data file', () => {
          expect(unlinkStub.called).to.equal(false);
        });
      });
    });

    describe('Given the file exists', () => {
      beforeEach(() => {
        existsStub.callsFake((path, callback) => callback(undefined, true));
      });

      describe('Given the game data file can be deleted without errors', () => {
        beforeEach(() => {
          unlinkStub.callsFake((path, callback) => callback());
        });

        describe('When invoked', () => {
          beforeEach(async () => {
            await safelyRemoveGameFile();
          });

          it('Checks if the game data file exists', () => {
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ])
          });

          it('Deletes the game data file', () => {
            expect(unlinkStub.calledOnce).to.equal(true);
            expect(unlinkStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
          });
        });
      });

      describe('Given the file system is throwing errors when deleting', () => {
        const fsError = Error('Could not delete file');

        beforeEach(() => {
          unlinkStub.callsFake((path, callback) => callback(fsError));
        });

        describe('When invoked', () => {
          it('Throws the error from the file system', async () => {
            await expect(safelyRemoveGameFile()).to.be.eventually.rejectedWith(fsError);
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(unlinkStub.calledOnce).to.equal(true);
            expect(unlinkStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
          });
        });
      });
    });

    describe('Given checking if the file exists is throwing errors', () => {
      const fsError = Error('Could not access file system');

      beforeEach(() => {
        existsStub.callsFake((path, callback) => callback(fsError));
      });

      describe('Given the game data file can be deleted without errors', () => {
        beforeEach(() => {
          unlinkStub.callsFake((path, callback) => callback());
        });

        describe('When invoked', () => {
          it('Throws the error from the file system', async () => {
            await expect(safelyRemoveGameFile()).to.be.eventually.rejectedWith(fsError);
            expect(existsStub.calledOnce).to.equal(true);
            expect(existsStub.firstCall.args.slice(0, -1)).to.deep.equal([
              '/home/test/.patience-cli'
            ]);
            expect(unlinkStub.called).to.equal(false);
          });
        });
      });
    });
  });
});
