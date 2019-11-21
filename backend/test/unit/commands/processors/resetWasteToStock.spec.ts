import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import * as loadEventsModule from '../../../../src/events/load';
import * as saveEventsModule from '../../../../src/events/save';
import * as validationModule from '../../../../src/commands/validation';
import * as tableStateModule from '../../../../src/state/table';
import { GameEvent, GameEventType } from '../../../../src/events/types';
import { createSampleGameplayEvent } from '../../../fixtures/events';
import { fail } from 'assert';
import { Suit, Value } from '../../../../src/game/types';
import { resetWasteToStock } from '../../../../src/commands/processors/resetWasteToStock';

describe('The "reset waste to stock" command', () => {
  const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.wasteResetToStock);
  const wasteNotEmptyValidationError = Error('Waste empty');
  const stockEmptyValidationError = Error('Stock is not empty');
  const gameExistsValidationError = Error('Game does not exist');
  const gameNotFinishedValidationError = Error('Game is already finished');
  const loadEventsError = Error('Database error: Failed to load events');
  const saveEventError = Error('Database error: Failed to save event');

  let loadEventsStub: SinonStub;
  let saveEventStub: SinonStub;
  let validateParametersStub: SinonStub;
  let validateGameExistsStub: SinonStub;
  let validateGameNotFinishedStub: SinonStub;
  let buildTableStateStub: SinonStub;
  let validateNonEmptyStub: SinonStub;
  let validateEmptyStub: SinonStub;

  beforeEach(() => {
    loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
    saveEventStub = stub(saveEventsModule, 'saveEvent').resolves(savedEvent);
    validateParametersStub = stub(validationModule, 'validateParameters');
    validateGameExistsStub = stub(validationModule, 'validateGameExists');
    validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
    buildTableStateStub = stub(tableStateModule, 'buildTableState');
    validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
    validateEmptyStub = stub(validationModule, 'validateEmpty');
  });

  afterEach(() => {
    loadEventsStub.restore();
    saveEventStub.restore();
    validateParametersStub.restore();
    validateGameExistsStub.restore();
    validateGameNotFinishedStub.restore();
    buildTableStateStub.restore();
    validateNonEmptyStub.restore();
    validateEmptyStub.restore();
  });

  describe('Given the event store is loading and saving events correctly', () => {
    beforeEach(() => {
      loadEventsStub.resolves();
      saveEventStub.resolves(savedEvent);
    });

    describe('Given the game is in progress', () => {
      describe('Given the waste is not empty and the stock is empty', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            waste: [{ suit: Suit.clubs, value: Value.jack, faceUp: true }],
            stock: []
          });
        });

        describe('When invoked', () => {
          let result: GameEvent;

          beforeEach(async () => {
            result = await resetWasteToStock({ gameId: 'game-42' });
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

          it('Validates the waste is not empty', () => {
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.clubs, value: Value.jack, faceUp: true }
            ]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
          });

          it('Validates the stock is empty', () => {
            expect(validateEmptyStub.callCount).to.equal(1);
            expect(validateEmptyStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
          });

          it('Saves the new event', () => {
            expect(saveEventStub.calledOnce).to.equal(true);
            expect(saveEventStub.firstCall.args).to.deep.equal([
              'wasteResetToStock',
              { gameId: 'game-42' }
            ]);
          });

          it('Returns the saved event', () => {
            expect(result).to.equal(savedEvent);
          });
        });
      });

      describe('Given the waste is empty', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            waste: [],
            stock: []
          });
          validateNonEmptyStub.throws(wasteNotEmptyValidationError);
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await resetWasteToStock({ gameId: 'game-42' });
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

          it('Validates the waste is not empty', () => {
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
          });

          it('Does not validate the stock is empty', () => {
            expect(validateEmptyStub.called).to.equal(false);
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(wasteNotEmptyValidationError);
          });
        });
      });

      describe('Given the stock is not empty', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            waste: [],
            stock: [{ suit: Suit.diamonds, value: Value.three, faceUp: false }]
          });
          validateEmptyStub.throws(stockEmptyValidationError);
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await resetWasteToStock({ gameId: 'game-42' });
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

          it('Validates the waste is not empty', () => {
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
          });

          it('Validates the stock is empty', () => {
            expect(validateEmptyStub.callCount).to.equal(1);
            expect(validateEmptyStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.diamonds, value: Value.three, faceUp: false }
            ]);
            expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(stockEmptyValidationError);
          });
        });
      });
    });

    describe('Given the game does not exist', () => {
      beforeEach(() => {
        validateGameExistsStub.throws(gameExistsValidationError);
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await resetWasteToStock({ gameId: 'game-42' });
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

        it('Does not validate the waste', () => {
          expect(validateNonEmptyStub.called).to.equal(false);
        });

        it('Does not validate the stock', () => {
          expect(validateEmptyStub.called).to.equal(false);
        });

        it('Does not save an event', () => {
          expect(saveEventStub.called).to.equal(false);
        });

        it('Throws the validation error', () => {
          expect(caughtError).to.equal(gameExistsValidationError);
        });
      });
    });

    describe('Given the game is already finished', () => {
      beforeEach(() => {
        validateGameNotFinishedStub.throws(gameNotFinishedValidationError);
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await resetWasteToStock({ gameId: 'game-42' });
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

        it('Does not validate the waste', () => {
          expect(validateNonEmptyStub.called).to.equal(false);
        });

        it('Does not validate the stock', () => {
          expect(validateEmptyStub.called).to.equal(false);
        });

        it('Does not save an event', () => {
          expect(saveEventStub.called).to.equal(false);
        });

        it('Throws the validation error', () => {
          expect(caughtError).to.equal(gameNotFinishedValidationError);
        });
      });
    });
  });

  describe('Given the event store throws when loading events', () => {
    beforeEach(() => {
      loadEventsStub.rejects(loadEventsError);
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await resetWasteToStock({ gameId: 'game-42' });
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

      it('Does not validate the waste', () => {
        expect(validateNonEmptyStub.called).to.equal(false);
      });

      it('Does not validate the stock', () => {
        expect(validateEmptyStub.called).to.equal(false);
      });

      it('Does not save an event', () => {
        expect(saveEventStub.called).to.equal(false);
      });

      it('Throws the error from the event store', () => {
        expect(caughtError).to.equal(loadEventsError);
      });
    });
  });

  describe('Given the event store throws when saving an event', () => {
    beforeEach(() => {
      loadEventsStub.resolves();
      saveEventStub.rejects(saveEventError);
      buildTableStateStub.returns({
        waste: [{ suit: Suit.clubs, value: Value.jack, faceUp: true }],
        stock: []
      });
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await resetWasteToStock({ gameId: 'game-42' });
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

      it('Validates the waste is not empty', () => {
        expect(validateNonEmptyStub.callCount).to.equal(1);
        expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([
          { suit: Suit.clubs, value: Value.jack, faceUp: true }
        ]);
        expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Waste');
      });

      it('Validates the stock is empty', () => {
        expect(validateEmptyStub.callCount).to.equal(1);
        expect(validateEmptyStub.getCall(0).args[0]).to.deep.equal([]);
        expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
      });

      it('Saves an event', () => {
        expect(saveEventStub.calledOnce).to.equal(true);
      });

      it('Throws the error from the event store', () => {
        expect(caughtError).to.equal(saveEventError);
      });
    });
  });
});
