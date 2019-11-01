import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import { APIGatewayProxyResult } from 'aws-lambda';
import { deleteGameHandler } from '../../../../../src/handlers/http/game/delete';
import * as forfeitGameModule from '../../../../../src/commands/processors/forfeitGame';
import { createSampleForfeitGameEvent } from '../../../../fixtures/events';

describe('The HTTP DELETE /game handler', () => {
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

    describe('Given the forfeitGame command is successful', () => {
      beforeEach(() => {
        stub(forfeitGameModule, 'forfeitGame').resolves(createSampleForfeitGameEvent());
      });

      afterEach(() => {
        (forfeitGameModule.forfeitGame as SinonStub).restore();
      });

      describe('When invoked with a gameId path parameter', () => {
        let result: APIGatewayProxyResult | void;

        beforeEach(async () => {
          result = await deleteGameHandler({ pathParameters: { gameId: 'game-42' } } as any, {} as any, () => {});
        });

        it('Invokes the forfeitGame command', () => {
          expect((forfeitGameModule.forfeitGame as SinonStub).callCount).to.equal(1);
          expect((forfeitGameModule.forfeitGame as SinonStub).firstCall.args).to.deep.equal([{ gameId: 'game-42' }]);
        });

        it('Returns a successful HTTP response', () => {
          expect(result).to.deep.equal({
            statusCode: 204,
            body: ''
          });
        });
      });

      describe('When invoked with no gameId path parameter', () => {
        let result: APIGatewayProxyResult | void;

        beforeEach(async () => {
          result = await deleteGameHandler({ pathParameters: {} } as any, {} as any, () => {});
        });

        it('Does not invoke the forfeitGame command', () => {
          expect((forfeitGameModule.forfeitGame as SinonStub).callCount).to.equal(0);
        });

        it('Returns a Bad Request HTTP response', () => {
          expect(result).to.deep.equal({
            statusCode: 400,
            body: '{"message":"Required parameter \\"gameId\\" missing"}'
          });
        });
      });
    });

    describe('Given the forfeitGame command fails', () => {
      const thrownError = Error('Thrown error');

      beforeEach(() => {
        stub(forfeitGameModule, 'forfeitGame').rejects(thrownError);
      });

      afterEach(() => {
        (forfeitGameModule.forfeitGame as SinonStub).restore();
      });

      describe('When invoked', () => {
        let error: any;

        beforeEach(async () => {
          try {
            await deleteGameHandler({ pathParameters: { gameId: 'game-42' } } as any, {} as any, () => {});
          } catch (e) {
            error = e;
          }
        });

        it('Invokes the forfeitGame command', () => {
          expect((forfeitGameModule.forfeitGame as SinonStub).callCount).to.equal(1);
          expect((forfeitGameModule.forfeitGame as SinonStub).firstCall.args).to.deep.equal([{ gameId: 'game-42' }]);
        });

        it('Returns a HTTP error', () => {
          expect(error).to.equal(thrownError);
        });
      });
    });
  });
});
