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
  const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.victoryClaimed);
  const tableauNotAllFaceUpError = Error('Tableau not all face up');
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
  let validateEmptyStub: SinonStub;
  let validateAllFaceUpStub: SinonStub;

  beforeEach(() => {
    loadEventsStub = stub(loadEventsModule, 'loadEvents');
    saveEventStub = stub(saveEventsModule, 'saveEvent');
    validateParametersStub = stub(validationModule, 'validateParameters');
    validateGameExistsStub = stub(validationModule, 'validateGameExists');
    validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
    buildTableStateStub = stub(tableStateModule, 'buildTableState');
    validateEmptyStub = stub(validationModule, 'validateEmpty');
    validateAllFaceUpStub = stub(validationModule, 'validateAllFaceUp');
  });

  afterEach(() => {
    loadEventsStub.restore();
    saveEventStub.restore();
    validateParametersStub.restore();
    validateGameExistsStub.restore();
    validateGameNotFinishedStub.restore();
    buildTableStateStub.restore();
    validateEmptyStub.restore();
    validateAllFaceUpStub.restore();
  });

  describe('Given the event store is loading and saving events correctly', () => {
    beforeEach(() => {
      loadEventsStub.resolves();
      saveEventStub.resolves(savedEvent);
    });

    describe('Given the game is in progress', () => {
      describe('Given the foundations each contains 13 cards', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            tableau: [[], [], [], [], [], [], []],
            stock: [],
            waste: []
          });
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

          it('Validates stock and waste are empty', () => {
            expect(validateEmptyStub.callCount).to.equal(2);
            expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
            expect(validateEmptyStub.getCall(1).args[1]).to.equal('Waste');
          });

          it('Validates every tableau consists only of face up cards', () => {
            expect(validateAllFaceUpStub.callCount).to.equal(7);
            expect(validateAllFaceUpStub.getCall(0).args[1]).to.equal('Tableau 1');
            expect(validateAllFaceUpStub.getCall(1).args[1]).to.equal('Tableau 2');
            expect(validateAllFaceUpStub.getCall(2).args[1]).to.equal('Tableau 3');
            expect(validateAllFaceUpStub.getCall(3).args[1]).to.equal('Tableau 4');
            expect(validateAllFaceUpStub.getCall(4).args[1]).to.equal('Tableau 5');
            expect(validateAllFaceUpStub.getCall(5).args[1]).to.equal('Tableau 6');
            expect(validateAllFaceUpStub.getCall(6).args[1]).to.equal('Tableau 7');
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

      describe('Given some cards in the tableau are face down', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            tableau: [[], [], [], [], [], [], []],
            stock: [],
            waste: []
          });
          validateAllFaceUpStub.throws(tableauNotAllFaceUpError);
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

          it('Validates the stock and waste are empty', () => {
            expect(validateEmptyStub.callCount).to.equal(2); // Fails after the first one
            expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
            expect(validateEmptyStub.getCall(1).args[1]).to.equal('Waste');
          });

          it('Validates the first tableau column and then fails', () => {
            expect(validateAllFaceUpStub.callCount).to.equal(1); // Fails after the first one
            expect(validateAllFaceUpStub.getCall(0).args[1]).to.equal('Tableau 1');
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(tableauNotAllFaceUpError);
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

        it('Does not validate the stock and waste', () => {
          expect(validateEmptyStub.called).to.equal(false);
        });

        it('Does not validate the tableau is all face up', () => {
          expect(validateAllFaceUpStub.called).to.equal(false);
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

        it('Does not validate the stock and waste', () => {
          expect(validateEmptyStub.called).to.equal(false);
        });

        it('Does not validate the tableau is all face up', () => {
          expect(validateAllFaceUpStub.called).to.equal(false);
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

      it('Does not validate the stock and waste', () => {
        expect(validateEmptyStub.called).to.equal(false);
      });

      it('Does not validate the tableau is all face up', () => {
        expect(validateAllFaceUpStub.called).to.equal(false);
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
        tableau: [[], [], [], [], [], [], []],
        stock: [],
        waste: []
      });
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

      it('Validates the stock and waste are empty', () => {
        expect(validateEmptyStub.callCount).to.equal(2);
        expect(validateEmptyStub.getCall(0).args[1]).to.equal('Stock');
        expect(validateEmptyStub.getCall(1).args[1]).to.equal('Waste');
      });

      it('Validates the foundations', () => {
        expect(validateAllFaceUpStub.callCount).to.equal(7);
        expect(validateAllFaceUpStub.getCall(0).args[1]).to.equal('Tableau 1');
        expect(validateAllFaceUpStub.getCall(1).args[1]).to.equal('Tableau 2');
        expect(validateAllFaceUpStub.getCall(2).args[1]).to.equal('Tableau 3');
        expect(validateAllFaceUpStub.getCall(3).args[1]).to.equal('Tableau 4');
        expect(validateAllFaceUpStub.getCall(4).args[1]).to.equal('Tableau 5');
        expect(validateAllFaceUpStub.getCall(5).args[1]).to.equal('Tableau 6');
        expect(validateAllFaceUpStub.getCall(6).args[1]).to.equal('Tableau 7');
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
