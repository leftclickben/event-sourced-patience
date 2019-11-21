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
import { playTableauToTableau } from '../../../../src/commands/processors/playTableauToTableau';

describe('The "play tableau to tableau" command', () => {
  const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.tableauPlayedToTableau);
  const lengthValidationError = Error('Tableau column 0 does not contain enough cards');
  const compatibleWithTableauValidationError = Error('You cannot play that there');
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
  let validateLengthStub: SinonStub;
  let validateCompatibleWithTableauStub: SinonStub;

  beforeEach(() => {
    loadEventsStub = stub(loadEventsModule, 'loadEvents');
    saveEventStub = stub(saveEventsModule, 'saveEvent');
    validateParametersStub = stub(validationModule, 'validateParameters');
    validateGameExistsStub = stub(validationModule, 'validateGameExists');
    validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
    buildTableStateStub = stub(tableStateModule, 'buildTableState');
    validateLengthStub = stub(validationModule, 'validateLength');
    validateCompatibleWithTableauStub = stub(validationModule, 'validateCompatibleWithTableau');
  });

  afterEach(() => {
    loadEventsStub.restore();
    saveEventStub.restore();
    validateParametersStub.restore();
    validateGameExistsStub.restore();
    validateGameNotFinishedStub.restore();
    buildTableStateStub.restore();
    validateLengthStub.restore();
    validateCompatibleWithTableauStub.restore();
  });

  describe('Given the event store is loading and saving events correctly', () => {
    beforeEach(() => {
      loadEventsStub.resolves();
      saveEventStub.resolves(savedEvent);
    });

    describe('Given the game is in progress', () => {
      describe('Given the source column contains enough cards and is compatible with the target', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            tableau: [
              [
                { suit: Suit.diamonds, value: Value.queen, faceUp: true }
              ],
              [
                { suit: Suit.hearts, value: Value.six, faceUp: false },
                { suit: Suit.clubs, value: Value.king, faceUp: true }
              ],
              [],
              [],
              [],
              [],
              []
            ]
          });
        });

        describe('When invoked', () => {
          let result: GameEvent;

          beforeEach(async () => {
            result = await playTableauToTableau({
              gameId: 'game-42',
              fromIndex: 0,
              count: 1,
              toIndex: 1
            });
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

          it('Validates the source tableau column contains enough face-up cards', () => {
            expect(validateLengthStub.callCount).to.equal(1);
            expect(validateLengthStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.diamonds, value: Value.queen, faceUp: true }
            ]);
            expect(validateLengthStub.getCall(0).args[1]).to.equal(1);
            expect(validateLengthStub.getCall(0).args[2]).to.equal('Tableau 1');
          });

          it('Validates the card being moved is compatible with the target', () => {
            expect(validateCompatibleWithTableauStub.callCount).to.equal(1);
            expect(validateCompatibleWithTableauStub.getCall(0).args).to.deep.equal([
              { suit: Suit.diamonds, value: Value.queen, faceUp: true },
              { suit: Suit.clubs, value: Value.king, faceUp: true }
            ]);
          });

          it('Saves the new event', () => {
            expect(saveEventStub.calledOnce).to.equal(true);
            expect(saveEventStub.firstCall.args).to.deep.equal([
              'tableauPlayedToTableau',
              { gameId: 'game-42', fromIndex: 0, count: 1, toIndex: 1 }
            ]);
          });

          it('Returns the saved event', () => {
            expect(result).to.equal(savedEvent);
          });
        });
      });

      describe('Given the source tableau column contains insufficient cards', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            tableau: [[], [], [], [], [], [], []]
          });
          validateLengthStub.throws(lengthValidationError);
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await playTableauToTableau({
                gameId: 'game-42',
                fromIndex: 0,
                count: 1,
                toIndex: 1
              });
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

          it('Validates the source tableau column is not empty', () => {
            expect(validateLengthStub.callCount).to.equal(1);
            expect(validateLengthStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateLengthStub.getCall(0).args[1]).to.equal(1);
            expect(validateLengthStub.getCall(0).args[2]).to.equal('Tableau 1');
          });

          it('Does not validate the card being moved is compatible with the target column', () => {
            expect(validateCompatibleWithTableauStub.called).to.equal(false);
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(lengthValidationError);
          });
        });
      });

      describe('Given the card being moved is not compatible with the target column', () => {
        beforeEach(() => {
          buildTableStateStub.returns({
            tableau: [
              [
                { suit: Suit.diamonds, value: Value.queen, faceUp: true }
              ],
              [
                { suit: Suit.hearts, value: Value.six, faceUp: false },
                { suit: Suit.clubs, value: Value.king, faceUp: true }
              ],
              [],
              [],
              [],
              [],
              []
            ]
          });
          validateCompatibleWithTableauStub.throws(compatibleWithTableauValidationError);
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await playTableauToTableau({
                gameId: 'game-42',
                fromIndex: 0,
                count: 1,
                toIndex: 1
              });
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

          it('Validates the source tableau column is not empty', () => {
            expect(validateLengthStub.callCount).to.equal(1);
            expect(validateLengthStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.diamonds, value: Value.queen, faceUp: true }
            ]);
            expect(validateLengthStub.getCall(0).args[1]).to.equal(1);
            expect(validateLengthStub.getCall(0).args[2]).to.equal('Tableau 1');
          });

          it('Validates the card being moved is compatible with the foundation', () => {
            expect(validateCompatibleWithTableauStub.callCount).to.equal(1);
            expect(validateCompatibleWithTableauStub.getCall(0).args).to.deep.equal([
              { suit: Suit.diamonds, value: Value.queen, faceUp: true },
              { suit: Suit.clubs, value: Value.king, faceUp: true }
            ]);
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(compatibleWithTableauValidationError);
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
            await playTableauToTableau({
              gameId: 'game-42',
              fromIndex: 0,
              count: 1,
              toIndex: 1
            });
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

        it('Does not validate the source tableau column contains enough face-up cards', () => {
          expect(validateLengthStub.called).to.equal(false);
        });

        it('Does not validate the card being moved is compatible with the target', () => {
          expect(validateCompatibleWithTableauStub.called).to.equal(false);
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
            await playTableauToTableau({
              gameId: 'game-42',
              fromIndex: 0,
              count: 1,
              toIndex: 1
            });
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

        it('Does not validate the source tableau column contains enough face-up cards', () => {
          expect(validateLengthStub.called).to.equal(false);
        });

        it('Does not validate the card being moved is compatible with the target', () => {
          expect(validateCompatibleWithTableauStub.called).to.equal(false);
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
          await playTableauToTableau({
            gameId: 'game-42',
            fromIndex: 0,
            count: 1,
            toIndex: 1
          });
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

      it('Does not validate the source tableau column contains enough face-up cards', () => {
        expect(validateLengthStub.called).to.equal(false);
      });

      it('Does not validate the card being moved is compatible with the target', () => {
        expect(validateCompatibleWithTableauStub.called).to.equal(false);
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
        tableau: [
          [
            { suit: Suit.diamonds, value: Value.queen, faceUp: true }
          ],
          [
            { suit: Suit.hearts, value: Value.six, faceUp: false },
            { suit: Suit.clubs, value: Value.king, faceUp: true }
          ],
          [],
          [],
          [],
          [],
          []
        ]
      });
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await playTableauToTableau({
            gameId: 'game-42',
            fromIndex: 0,
            count: 1,
            toIndex: 1
          });
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

      it('Validates the source tableau column contains enough face-up cards', () => {
        expect(validateLengthStub.callCount).to.equal(1);
        expect(validateLengthStub.getCall(0).args[0]).to.deep.equal([
          { suit: Suit.diamonds, value: Value.queen, faceUp: true }
        ]);
        expect(validateLengthStub.getCall(0).args[1]).to.equal(1);
        expect(validateLengthStub.getCall(0).args[2]).to.equal('Tableau 1');
      });

      it('Validates the card being moved is compatible with the target', () => {
        expect(validateCompatibleWithTableauStub.callCount).to.equal(1);
        expect(validateCompatibleWithTableauStub.getCall(0).args).to.deep.equal([
          { suit: Suit.diamonds, value: Value.queen, faceUp: true },
          { suit: Suit.clubs, value: Value.king, faceUp: true }
        ]);
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
