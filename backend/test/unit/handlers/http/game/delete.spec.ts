import mockedEnv from 'mocked-env';
import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import { deleteGameHandler } from '../../../../../src/handlers/http/game/delete';
import { createSampleForfeitGameEvent } from '../../../../fixtures/events';
import * as forfeitGameModule from '../../../../../src/commands/processors/forfeitGame';
import { APIGatewayProxyResultWithData } from '../../../../../src/handlers/http/wrap';

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
        let result: APIGatewayProxyResultWithData | void;

        beforeEach(async () => {
          result = await deleteGameHandler({ pathParameters: { gameId: 'game-42' } } as any, {} as any, () => {});
        });

        it('Invokes the forfeitGame command', () => {
          expect((forfeitGameModule.forfeitGame as SinonStub).callCount).to.equal(1);
          expect((forfeitGameModule.forfeitGame as SinonStub).firstCall.args).to.deep.equal([{ gameId: 'game-42' }]);
        });

        it('Returns an empty result', () => {
          expect(result).to.equal(undefined);
        });
      });

      describe('When invoked with no gameId path parameter', () => {
        it('Throws an error without invoking the forfeitGame command', async () => {
          await expect(deleteGameHandler({ pathParameters: {} } as any, {} as any, () => {}))
            .to.be.eventually.rejectedWith('Required parameter "gameId" missing');
          expect((forfeitGameModule.forfeitGame as SinonStub).callCount).to.equal(0);
        });
      });
    });

    describe('Given the forfeitGame command fails', () => {
      const thrownError = Error('Error executing forfeitGame command');

      beforeEach(() => {
        stub(forfeitGameModule, 'forfeitGame').rejects(thrownError);
      });

      afterEach(() => {
        (forfeitGameModule.forfeitGame as SinonStub).restore();
      });

      describe('When invoked', () => {
        it('Throws the error from the forfeitGame command', async () => {
          await expect(deleteGameHandler({ pathParameters: { gameId: 'game-42' } } as any, {} as any, () => {}))
            .to.be.eventually.rejectedWith(thrownError);
          expect((forfeitGameModule.forfeitGame as SinonStub).callCount).to.equal(1);
          expect((forfeitGameModule.forfeitGame as SinonStub).firstCall.args).to.deep.equal([{ gameId: 'game-42' }]);
        });
      });
    });
  });
});
