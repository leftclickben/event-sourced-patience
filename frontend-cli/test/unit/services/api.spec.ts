import * as requestPromiseModule from 'request-promise';
import { SinonStub, stub } from 'sinon';
import { createGame, forfeitGame, loadGame, playGame } from '../../../src/services/api';
import mockedEnv from 'mocked-env';
import { expect } from 'chai';

describe('The API service', () => {
  const httpError = Error('HTTP 500 Internal Server Error');

  describe('Given a properly configured environment', () => {
    let restoreEnv: () => void;

    beforeEach(() => {
      restoreEnv = mockedEnv({
        API_BASE_URL: 'http://example.org/api'
      });
    });

    afterEach(() => {
      restoreEnv();
    });

    describe('Creating a game', () => {
      let postStub: SinonStub;

      beforeEach(() => {
        postStub = stub(requestPromiseModule, 'post');
      });

      afterEach(() => {
        postStub.restore();
      });

      describe('Given HTTP POST is working normally', () => {
        beforeEach(() => {
          postStub.resolves({ meaning: 42 });
        });

        describe('When invoked', () => {
          let result: any;

          beforeEach(async () => {
            result = await createGame();
          });

          it('Performs an HTTP POST to the correct URL', () => {
            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game',
              { json: true }
            ]);
          });

          it('Returns the HTTP response data as an object', () => {
            expect(result).to.deep.equal({ meaning: 42 });
          });
        });
      });

      describe('Given HTTP POST is returning errors', () => {
        beforeEach(() => {
          postStub.rejects(httpError);
        });

        describe('When invoked', () => {
          it('Performs an HTTP POST to the correct URL and throws the error', async () => {
            await expect(createGame()).to.be.eventually.rejectedWith(httpError);
            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game',
              { json: true }
            ]);
          });
        });
      });
    });

    describe('Loading a game', () => {
      let getStub: SinonStub;

      beforeEach(() => {
        getStub = stub(requestPromiseModule, 'get');
      });

      afterEach(() => {
        getStub.restore();
      });

      describe('Given HTTP GET is working normally', () => {
        beforeEach(() => {
          getStub.resolves({ meaning: 42 });
        });

        describe('When invoked', () => {
          let result: any;

          beforeEach(async () => {
            result = await loadGame('game-42');
          });

          it('Performs an HTTP GET to the correct URL', () => {
            expect(getStub.calledOnce).to.equal(true);
            expect(getStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game/game-42',
              { json: true }
            ]);
          });

          it('Returns the HTTP response data as an object', () => {
            expect(result).to.deep.equal({ meaning: 42 });
          });
        });
      });

      describe('Given HTTP GET is returning errors', () => {
        beforeEach(() => {
          getStub.rejects(httpError);
        });

        describe('When invoked', () => {
          it('Performs an HTTP GET to the correct URL and throws the error', async () => {
            await expect(loadGame('game-42')).to.be.eventually.rejectedWith(httpError);
            expect(getStub.calledOnce).to.equal(true);
            expect(getStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game/game-42',
              { json: true }
            ]);
          });
        });
      });
    });

    describe('Playing a game', () => {
      let patchStub: SinonStub;

      beforeEach(() => {
        patchStub = stub(requestPromiseModule, 'patch');
      });

      afterEach(() => {
        patchStub.restore();
      });

      describe('Given HTTP PATCH is working normally', () => {
        beforeEach(() => {
          patchStub.resolves({ meaning: 42 });
        });

        describe('When invoked', () => {
          let result: any;

          beforeEach(async () => {
            result = await playGame('game-42', 'dealStockToWaste', { foo: 'xyzzy' });
          });

          it('Performs an HTTP PATCH to the correct URL', () => {
            expect(patchStub.calledOnce).to.equal(true);
            expect(patchStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game/game-42/dealStockToWaste',
              {
                json: true,
                body: {
                  foo: 'xyzzy'
                }
              }
            ]);
          });

          it('Returns the HTTP response data as an object', () => {
            expect(result).to.deep.equal({ meaning: 42 });
          });
        });
      });

      describe('Given HTTP PATCH is returning errors', () => {
        beforeEach(() => {
          patchStub.rejects(httpError);
        });

        describe('When invoked', () => {
          it('Performs an HTTP PATCH to the correct URL and throws the error', async () => {
            await expect(playGame('game-42', 'dealStockToWaste', { foo: 'xyzzy' }))
              .to.be.eventually.rejectedWith(httpError);
            expect(patchStub.calledOnce).to.equal(true);
            expect(patchStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game/game-42/dealStockToWaste',
              {
                json: true,
                body: {
                  foo: 'xyzzy'
                }
              }
            ]);
          });
        });
      });
    });

    describe('Forfeiting a game', () => {
      let deleteStub: SinonStub;

      beforeEach(() => {
        deleteStub = stub(requestPromiseModule, 'delete');
      });

      afterEach(() => {
        deleteStub.restore();
      });

      describe('Given HTTP DELETE is working normally', () => {
        beforeEach(() => {
          deleteStub.resolves();
        });

        describe('When invoked', () => {
          beforeEach(async () => {
            await forfeitGame('game-42');
          });

          it('Performs an HTTP DELETE to the correct URL', () => {
            expect(deleteStub.calledOnce).to.equal(true);
            expect(deleteStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game/game-42'
            ]);
          });
        });
      });

      describe('Given HTTP DELETE is returning errors', () => {
        beforeEach(() => {
          deleteStub.rejects(httpError);
        });

        describe('When invoked', () => {
          it('Performs an HTTP DELETE to the correct URL and throws the error', async () => {
            await expect(forfeitGame('game-42')).to.be.eventually.rejectedWith(httpError);
            expect(deleteStub.calledOnce).to.equal(true);
            expect(deleteStub.firstCall.args).to.deep.equal([
              'http://example.org/api/game/game-42'
            ]);
          });
        });
      });
    });
  });
});
