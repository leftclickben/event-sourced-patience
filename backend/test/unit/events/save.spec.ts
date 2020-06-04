import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import mockedEnv from 'mocked-env';
import { DynamoDB } from 'aws-sdk';
import { saveEvent } from '../../../src/events/save';
import { GameEvent, GameEventType } from '../../../src/events/types';

describe('Saving an event to the event store', () => {
  let dateNowStub: SinonStub;

  beforeEach(() => {
    dateNowStub = stub(Date, 'now').returns(1573726643625);
  });

  afterEach(() => {
    dateNowStub.restore();
  });

  describe('Given the environment is correctly configured', () => {
    let restoreEnv: () => void;

    beforeEach(() => {
      restoreEnv = mockedEnv({
        DB_TABLE_EVENTS: 'events_unit_test'
      });
    });

    afterEach(() => {
      restoreEnv();
    });

    describe('Given the event store handles save operations normally', () => {
      let putStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        putStub = stub().returns({
          promise: stub().resolves()
        });

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ put: putStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked', () => {
        let event: GameEvent;

        beforeEach(async () => {
          event = await saveEvent(GameEventType.stockDealtToWaste, { gameId: 'game-42' });
        });

        it('Puts the item in the database', () => {
          expect(putStub.callCount).to.equal(1);
          expect(putStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              Item: {
                eventTimestamp: 1573726643625,
                eventType: 'stockDealtToWaste',
                gameId: 'game-42'
              }
            }
          ]);
        });

        it('Returns the created event', () => {
          expect(event).to.deep.equal({
            eventTimestamp: 1573726643625,
            eventType: 'stockDealtToWaste',
            gameId: 'game-42'
          });
        });
      });
    });

    describe('Given the event store is causing errors', () => {
      const thrownError = Error('Database failure code 666');
      let putStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        putStub = stub().returns({
          promise: stub().rejects(thrownError)
        });

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ put: putStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked', () => {
        it('Throws the database error', async () => {
          await expect(saveEvent(GameEventType.stockDealtToWaste, { gameId: 'game-42' }))
            .to.be.eventually.rejectedWith(thrownError);

          expect(putStub.calledOnce).to.equal(true);
          expect(putStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              Item: {
                eventTimestamp: 1573726643625,
                eventType: 'stockDealtToWaste',
                gameId: 'game-42'
              }
            }
          ]);
        });
      });
    });
  });
});
