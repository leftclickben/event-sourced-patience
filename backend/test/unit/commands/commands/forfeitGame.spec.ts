import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import * as loadEventsModule from '../../../../src/events/load';
import * as saveEventsModule from '../../../../src/events/save';
import * as validationModule from '../../../../src/commands/validation';
import { GameEvent, GameEventType } from '../../../../src/events/types';
import { createSampleGameplayEvent } from '../../../fixtures/events';
import { fail } from 'assert';
import { forfeitGame } from '../../../../src/commands/processors/forfeitGame';

describe('The "forfeit game" command', () => {
  describe('Given the event store is loading and saving events correctly', () => {
    describe('Given the game is in progress', () => {
      const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.gameForfeited);

      let loadEventsStub: SinonStub;
      let saveEventStub: SinonStub;
      let validateParametersStub: SinonStub;
      let validateGameExistsStub: SinonStub;
      let validateGameNotFinishedStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves(savedEvent);
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists');
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
      });

      describe('When invoked', () => {
        let result: GameEvent;

        beforeEach(async () => {
          result = await forfeitGame({ gameId: 'game-42' });
        });

        it('Validates parameters', () => {
          expect(validateParametersStub.calledOnce).to.equal(true);
        });

        it('Loads events for the game', () => {
          expect(loadEventsStub.calledOnce).to.equal(true);
          expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
        });

        it('Validates the game exists', () => {
          expect(validateGameExistsStub.calledOnce).to.equal(true);
        });

        it('Validates the game is not finished', () => {
          expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
        });

        it('Saves the new event', () => {
          expect(saveEventStub.calledOnce).to.equal(true);
          expect(saveEventStub.firstCall.args).to.deep.equal([
            'gameForfeited',
            { gameId: 'game-42' }
          ]);
        });

        it('Returns the saved event', () => {
          expect(result).to.equal(savedEvent);
        });
      });
    });

    describe('Given the game does not exist', () => {
      const validationError = Error('Game does not exist');

      let loadEventsStub: SinonStub;
      let saveEventStub: SinonStub;
      let validateParametersStub: SinonStub;
      let validateGameExistsStub: SinonStub;
      let validateGameNotFinishedStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists').throws(validationError);
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await forfeitGame({ gameId: 'game-42' });
            fail('Test failed because command should throw an error');
          } catch (e) {
            caughtError = e;
          }
        });

        it('Validates parameters', () => {
          expect(validateParametersStub.calledOnce).to.equal(true);
        });

        it('Loads events for the game', () => {
          expect(loadEventsStub.calledOnce).to.equal(true);
          expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
        });

        it('Validates the game exists', () => {
          expect(validateGameExistsStub.calledOnce).to.equal(true);
        });

        it('Does not validate the game is not finished', () => {
          expect(validateGameNotFinishedStub.called).to.equal(false);
        });

        it('Does not save an event', () => {
          expect(saveEventStub.called).to.equal(false);
        });

        it('Throws the validation error', () => {
          expect(caughtError).to.equal(validationError);
        });
      });
    });

    describe('Given the game is already finished', () => {
      const validationError = Error('Game is already finished');

      let loadEventsStub: SinonStub;
      let saveEventStub: SinonStub;
      let validateParametersStub: SinonStub;
      let validateGameExistsStub: SinonStub;
      let validateGameNotFinishedStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists');
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished').throws(validationError);
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await forfeitGame({ gameId: 'game-42' });
            fail('Test failed because command should throw an error');
          } catch (e) {
            caughtError = e;
          }
        });

        it('Validates parameters', () => {
          expect(validateParametersStub.calledOnce).to.equal(true);
        });

        it('Loads events for the game', () => {
          expect(loadEventsStub.calledOnce).to.equal(true);
          expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
        });

        it('Validates the game exists', () => {
          expect(validateGameExistsStub.calledOnce).to.equal(true);
        });

        it('Validates the game is not finished', () => {
          expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
        });

        it('Does not save an event', () => {
          expect(saveEventStub.called).to.equal(false);
        });

        it('Throws the validation error', () => {
          expect(caughtError).to.equal(validationError);
        });
      });
    });
  });

  describe('Given the event store throws when loading events', () => {
    const eventStoreError = Error('Database error: Failed to load events');

    let loadEventsStub: SinonStub;
    let saveEventStub: SinonStub;
    let validateParametersStub: SinonStub;
    let validateGameExistsStub: SinonStub;
    let validateGameNotFinishedStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').rejects(eventStoreError);
      saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await forfeitGame({ gameId: 'game-42' });
          fail('Test failed because command should throw an error');
        } catch (e) {
          caughtError = e;
        }
      });

      it('Validates parameters', () => {
        expect(validateParametersStub.calledOnce).to.equal(true);
      });

      it('Loads events for the game', () => {
        expect(loadEventsStub.calledOnce).to.equal(true);
        expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
      });

      it('Does not validate the game exists', () => {
        expect(validateGameExistsStub.called).to.equal(false);
      });

      it('Does not validate the game is not finished', () => {
        expect(validateGameNotFinishedStub.called).to.equal(false);
      });

      it('Does not save an event', () => {
        expect(saveEventStub.called).to.equal(false);
      });

      it('Throws the error from the event store', () => {
        expect(caughtError).to.equal(eventStoreError);
      });
    });
  });

  describe('Given the event store throws when saving an event', () => {
    const eventStoreError = Error('Database error: Failed to save event');

    let loadEventsStub: SinonStub;
    let saveEventStub: SinonStub;
    let validateParametersStub: SinonStub;
    let validateGameExistsStub: SinonStub;
    let validateGameNotFinishedStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
      saveEventStub = stub(saveEventsModule, 'saveEvent').rejects(eventStoreError);
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await forfeitGame({ gameId: 'game-42' });
          fail('Test failed because command should throw an error');
        } catch (e) {
          caughtError = e;
        }
      });

      it('Validates parameters', () => {
        expect(validateParametersStub.calledOnce).to.equal(true);
      });

      it('Loads events for the game', () => {
        expect(loadEventsStub.calledOnce).to.equal(true);
        expect(loadEventsStub.firstCall.args).to.deep.equal(['game-42']);
      });

      it('Validates the game exists', () => {
        expect(validateGameExistsStub.calledOnce).to.equal(true);
      });

      it('Validates the game is not finished', () => {
        expect(validateGameNotFinishedStub.calledOnce).to.equal(true);
      });

      it('Saves an event', () => {
        expect(saveEventStub.calledOnce).to.equal(true);
      });

      it('Throws the error from the event store', () => {
        expect(caughtError).to.equal(eventStoreError);
      });
    });
  });
});
