import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import { postGameHandler } from '../../../../../src/handlers/http/game/post';
import * as createGameModule from '../../../../../src/commands/processors/createGame';
import { createSampleCreateGameEvent } from '../../../../fixtures/events';
import { APIGatewayProxyResultWithData } from '../../../../../src/handlers/http/wrap';

describe('The HTTP POST /game handler', () => {
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

    describe('Given the createGame command is successful', () => {
      let createGameStub: SinonStub;

      beforeEach(() => {
        createGameStub = stub(createGameModule, 'createGame').resolves(createSampleCreateGameEvent());
      });

      afterEach(() => {
        createGameStub.restore();
      });

      describe('When invoked', () => {
        let result: APIGatewayProxyResultWithData | void;

        beforeEach(async () => {
          result = await postGameHandler(
            {} as any,
            {} as any,
            undefined as any);
        });

        it('Invokes the createGame command', () => {
          expect(createGameStub.callCount).to.equal(1);
          expect(createGameStub.firstCall.args).to.deep.equal([]);
        });

        it('Returns a successful HTTP response', () => {
          expect(result).to.deep.equal({
            statusCode: 201,
            data: {
              gameId: 'game-42',
              table: {
                status: 'inProgress',
                tableau: [
                  [
                    { suit: 'diamonds', value: 'ace', faceUp: true }
                  ],
                  [
                    { suit: 'diamonds', value: 'queen', faceUp: false },
                    { suit: 'diamonds', value: 'seven', faceUp: true }
                  ],
                  [
                    { suit: 'spades', value: 'five', faceUp: false },
                    { suit: 'spades', value: 'ten', faceUp: false },
                    { suit: 'spades', value: 'jack', faceUp: true }
                  ],
                  [
                    { suit: 'diamonds', value: 'five', faceUp: false },
                    { suit: 'spades', value: 'ace', faceUp: false },
                    { suit: 'diamonds', value: 'ten', faceUp: false },
                    { suit: 'diamonds', value: 'king', faceUp: true }
                  ]
                ],
                foundation: [[], [], [], []],
                stock: [
                  { suit: 'diamonds', value: 'three', faceUp: false },
                  { suit: 'spades', value: 'six', faceUp: false },
                  { suit: 'spades', value: 'eight', faceUp: false },
                  { suit: 'spades', value: 'four', faceUp: false },
                  { suit: 'diamonds', value: 'four', faceUp: false },
                  { suit: 'spades', value: 'queen', faceUp: false },
                  { suit: 'diamonds', value: 'two', faceUp: false },
                  { suit: 'spades', value: 'three', faceUp: false },
                  { suit: 'spades', value: 'king', faceUp: false },
                  { suit: 'diamonds', value: 'jack', faceUp: false },
                  { suit: 'spades', value: 'two', faceUp: false },
                  { suit: 'diamonds', value: 'eight', faceUp: false },
                  { suit: 'spades', value: 'seven', faceUp: true }
                ],
                waste: []
              },
              score: 0
            }
          });
        });
      });
    });

    describe('Given the createGame command fails', () => {
      const thrownError = Error('Error executing createGame command');
      let createGameStub: SinonStub;

      beforeEach(() => {
        createGameStub = stub(createGameModule, 'createGame').rejects(thrownError);
      });

      afterEach(() => {
        createGameStub.restore();
      });

      describe('When invoked', () => {
        it('Throws the error from the createGame command', async () => {
          await expect(postGameHandler(
            {} as any,
            {} as any,
            undefined as any))
            .to.be.eventually.rejectedWith(thrownError);
          expect(createGameStub.callCount).to.equal(1);
        });
      });
    });
  });
});
