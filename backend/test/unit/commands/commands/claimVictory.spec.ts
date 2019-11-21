import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import * as loadEventsModule from '../../../../src/events/load';
import * as saveEventsModule from '../../../../src/events/save';
import * as validationModule from '../../../../src/commands/validation';
import * as tableStateModule from '../../../../src/state/table';
import { claimVictory } from '../../../../src/commands/processors/claimVictory';
import { GameEvent, GameEventType } from '../../../../src/events/types';
import { createSampleGameplayEvent } from '../../../fixtures/events';
import { fail } from 'assert';

describe('The "claim victory" command', () => {
  describe('Given the event store is loading and saving events correctly', () => {
    describe('Given the game is in progress', () => {
      const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.victoryClaimed);

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

      describe('Given the foundations each contains 13 cards', () => {
        let buildTableStateStub: SinonStub;
        let validateLengthStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            foundation: [[], [], [], []]
          } as any);
          validateLengthStub = stub(validationModule, 'validateLength');
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateLengthStub.restore();
        });

        describe('When invoked', () => {
          let result: GameEvent;

          beforeEach(async () => {
            result = await claimVictory({ gameId: 'game-42' });
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

          it('Builds the table state', () => {
            expect(buildTableStateStub.calledOnce).to.equal(true);
          });

          it('Validates the foundations', () => {
            expect(validateLengthStub.callCount).to.equal(4);
            expect(validateLengthStub.getCall(0).args[1]).to.equal(13);
            expect(validateLengthStub.getCall(0).args[2]).to.equal('Foundation 1');
            expect(validateLengthStub.getCall(1).args[1]).to.equal(13);
            expect(validateLengthStub.getCall(1).args[2]).to.equal('Foundation 2');
            expect(validateLengthStub.getCall(2).args[1]).to.equal(13);
            expect(validateLengthStub.getCall(2).args[2]).to.equal('Foundation 3');
            expect(validateLengthStub.getCall(3).args[1]).to.equal(13);
            expect(validateLengthStub.getCall(3).args[2]).to.equal('Foundation 4');
          });

          it('Saves the new event', () => {
            expect(saveEventStub.calledOnce).to.equal(true);
            expect(saveEventStub.firstCall.args).to.deep.equal([
              'victoryClaimed',
              { gameId: 'game-42' }
            ]);
          });

          it('Returns the saved event', () => {
            expect(result).to.equal(savedEvent);
          });
        });
      });

      describe('Given the foundations are empty', () => {
        const validationError = Error('Foundation not complete');

        let buildTableStateStub: SinonStub;
        let validateLengthStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            foundation: [[], [], [], []]
          } as any);
          validateLengthStub = stub(validationModule, 'validateLength').throws(validationError);
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateLengthStub.restore();
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await claimVictory({ gameId: 'game-42' });
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

          it('Builds the table state', () => {
            expect(buildTableStateStub.calledOnce).to.equal(true);
          });

          it('Validates the foundations', () => {
            expect(validateLengthStub.callCount).to.equal(1); // Fails after the first one
            expect(validateLengthStub.getCall(0).args[1]).to.equal(13);
            expect(validateLengthStub.getCall(0).args[2]).to.equal('Foundation 1');
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

    describe('Given the game does not exist', () => {
      const validationError = Error('Game does not exist');

      let loadEventsStub: SinonStub;
      let saveEventStub: SinonStub;
      let validateParametersStub: SinonStub;
      let validateGameExistsStub: SinonStub;
      let validateGameNotFinishedStub: SinonStub;
      let buildTableStateStub: SinonStub;
      let validateLengthStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists').throws(validationError);
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
        buildTableStateStub = stub(tableStateModule, 'buildTableState');
        validateLengthStub = stub(validationModule, 'validateLength');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
        buildTableStateStub.restore();
        validateLengthStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await claimVictory({ gameId: 'game-42' });
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

        it('Does not build the table state', () => {
          expect(buildTableStateStub.called).to.equal(false);
        });

        it('Does not validate the foundations', () => {
          expect(validateLengthStub.called).to.equal(false);
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
      let buildTableStateStub: SinonStub;
      let validateLengthStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists');
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished').throws(validationError);
        buildTableStateStub = stub(tableStateModule, 'buildTableState');
        validateLengthStub = stub(validationModule, 'validateLength');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
        buildTableStateStub.restore();
        validateLengthStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await claimVictory({ gameId: 'game-42' });
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

        it('Does not build the table state', () => {
          expect(buildTableStateStub.called).to.equal(false);
        });

        it('Does not validate the foundations', () => {
          expect(validateLengthStub.called).to.equal(false);
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
    let buildTableStateStub: SinonStub;
    let validateLengthStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').rejects(eventStoreError);
      saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      buildTableStateStub = stub(tableStateModule, 'buildTableState');
      validateLengthStub = stub(validationModule, 'validateLength');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
      buildTableStateStub.restore();
      validateLengthStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await claimVictory({ gameId: 'game-42' });
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

      it('Does not build the table state', () => {
        expect(buildTableStateStub.called).to.equal(false);
      });

      it('Does not validate the foundations', () => {
        expect(validateLengthStub.called).to.equal(false);
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
    let buildTableStateStub: SinonStub;
    let validateLengthStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
      saveEventStub = stub(saveEventsModule, 'saveEvent').rejects(eventStoreError);
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
        foundation: [[], [], [], []]
      } as any);
      validateLengthStub = stub(validationModule, 'validateLength');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
      buildTableStateStub.restore();
      validateLengthStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await claimVictory({ gameId: 'game-42' });
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

      it('Builds the table state', () => {
        expect(buildTableStateStub.calledOnce).to.equal(true);
      });

      it('Validates the foundations', () => {
        expect(validateLengthStub.callCount).to.equal(4);
        expect(validateLengthStub.getCall(0).args[1]).to.equal(13);
        expect(validateLengthStub.getCall(0).args[2]).to.equal('Foundation 1');
        expect(validateLengthStub.getCall(1).args[1]).to.equal(13);
        expect(validateLengthStub.getCall(1).args[2]).to.equal('Foundation 2');
        expect(validateLengthStub.getCall(2).args[1]).to.equal(13);
        expect(validateLengthStub.getCall(2).args[2]).to.equal('Foundation 3');
        expect(validateLengthStub.getCall(3).args[1]).to.equal(13);
        expect(validateLengthStub.getCall(3).args[2]).to.equal('Foundation 4');
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
