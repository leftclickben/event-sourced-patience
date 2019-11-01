import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import { APIGatewayProxyResult } from 'aws-lambda';
import { postGameHandler } from '../../../../../src/handlers/http/game/post';
import * as createGameModule from '../../../../../src/commands/processors/createGame';
import { createSampleCreateGameEvent } from '../../../../fixtures/events';

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
      beforeEach(() => {
        stub(createGameModule, 'createGame').resolves(createSampleCreateGameEvent());
      });

      afterEach(() => {
        (createGameModule.createGame as SinonStub).restore();
      });

      describe('When invoked', () => {
        let result: APIGatewayProxyResult | void;

        beforeEach(async () => {
          result = await postGameHandler({} as any, {} as any, () => {});
        });

        it('Invokes the createGame command', () => {
          expect((createGameModule.createGame as SinonStub).callCount).to.equal(1);
          expect((createGameModule.createGame as SinonStub).firstCall.args).to.deep.equal([]);
        });

        it('Returns a successful HTTP response', () => {
          expect(result).to.deep.equal({
            statusCode: 201,
            body: '{"gameId":{"gameId":"game-42","eventId":"event-1","eventTimestamp":1571753807473,"eventType":"gameCreated","tableau":[[{"suit":"diamonds","value":"ace","faceUp":true}],[{"suit":"diamonds","value":"queen","faceUp":false},{"suit":"diamonds","value":"seven","faceUp":true}],[{"suit":"spades","value":"five","faceUp":false},{"suit":"spades","value":"ten","faceUp":false},{"suit":"spades","value":"jack","faceUp":true}],[{"suit":"diamonds","value":"five","faceUp":false},{"suit":"spades","value":"ace","faceUp":false},{"suit":"diamonds","value":"ten","faceUp":false},{"suit":"diamonds","value":"king","faceUp":true}]],"stock":[{"suit":"diamonds","value":"three","faceUp":false},{"suit":"spades","value":"six","faceUp":false},{"suit":"spades","value":"eight","faceUp":false},{"suit":"spades","value":"four","faceUp":false},{"suit":"diamonds","value":"four","faceUp":false},{"suit":"spades","value":"queen","faceUp":false},{"suit":"diamonds","value":"two","faceUp":false},{"suit":"spades","value":"three","faceUp":false},{"suit":"spades","value":"king","faceUp":false},{"suit":"diamonds","value":"jack","faceUp":false},{"suit":"spades","value":"two","faceUp":false},{"suit":"diamonds","value":"eight","faceUp":false},{"suit":"spades","value":"seven","faceUp":true}]}}'
          });
        });
      });
    });

    describe('Given the createGame command fails', () => {
      const thrownError = Error('Thrown error');

      beforeEach(() => {
        stub(createGameModule, 'createGame').rejects(thrownError);
      });

      afterEach(() => {
        (createGameModule.createGame as SinonStub).restore();
      });

      describe('When invoked', () => {
        let error: any;

        beforeEach(async () => {
          try {
            await postGameHandler({} as any, {} as any, () => {});
          } catch (e) {
            error = e;
          }
        });

        it('Invokes the createGame command', () => {
          expect((createGameModule.createGame as SinonStub).callCount).to.equal(1);
          expect((createGameModule.createGame as SinonStub).firstCall.args).to.deep.equal([]);
        });

        it('Returns a HTTP error', () => {
          expect(error).to.deep.equal(thrownError);
        });
      });
    });
  });
});
