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
import { playTableauToFoundation } from '../../../../src/commands/processors/playTableauToFoundation';

describe('The "deal stock to waste" command', () => {
  describe('Given the event store is loading and saving events correctly', () => {
    describe('Given the game is in progress', () => {
      const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.tableauPlayedToFoundation);

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

      describe('Given the tableau column is not empty and the top card is compatible with the target', () => {
        let buildTableStateStub: SinonStub;
        let validateNonEmptyStub: SinonStub;
        let validateCompatibleWithFoundationStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            foundation: [[{ suit: Suit.clubs, value: Value.ace, faceUp: true }], [], [], []],
            tableau: [[{ suit: Suit.clubs, value: Value.two, faceUp: true }], [], [], [], [], [], []]
          } as any);
          validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
          validateCompatibleWithFoundationStub = stub(validationModule, 'validateCompatibleWithFoundation');
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateNonEmptyStub.restore();
          validateCompatibleWithFoundationStub.restore();
        });

        describe('When invoked', () => {
          let result: GameEvent;

          beforeEach(async () => {
            result = await playTableauToFoundation({
              gameId: 'game-42',
              tableauIndex: 0,
              foundationIndex: 0
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

          it('Validates the source tableau column is not empty', () => {
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.clubs, value: Value.two, faceUp: true }
            ]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Tableau column 0');
          });

          it('Validates the card being moved is compatible with the foundation', () => {
            expect(validateCompatibleWithFoundationStub.callCount).to.equal(1);
            expect(validateCompatibleWithFoundationStub.getCall(0).args).to.deep.equal([
              { suit: Suit.clubs, value: Value.two, faceUp: true },
              { suit: Suit.clubs, value: Value.ace, faceUp: true }
            ])
          });

          it('Saves the new event', () => {
            expect(saveEventStub.calledOnce).to.equal(true);
            expect(saveEventStub.firstCall.args).to.deep.equal([
              'tableauPlayedToFoundation',
              { gameId: 'game-42', tableauIndex: 0, foundationIndex: 0 }
            ]);
          });

          it('Returns the saved event', () => {
            expect(result).to.equal(savedEvent);
          });
        });
      });

      describe('Given the source tableau column is empty', () => {
        const validationError = Error('Tableau column 0 empty');

        let buildTableStateStub: SinonStub;
        let validateNonEmptyStub: SinonStub;
        let validateCompatibleWithFoundationStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            foundation: [[{ suit: Suit.clubs, value: Value.ace, faceUp: true }], [], [], []],
            tableau: [[], [], [], [], [], [], []]
          } as any);
          validateNonEmptyStub = stub(validationModule, 'validateNonEmpty').throws(validationError);
          validateCompatibleWithFoundationStub = stub(validationModule, 'validateCompatibleWithFoundation');
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateNonEmptyStub.restore();
          validateCompatibleWithFoundationStub.restore();
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await playTableauToFoundation({
                gameId: 'game-42',
                tableauIndex: 0,
                foundationIndex: 0
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
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Tableau column 0');
          });

          it('Does not validate the card being moved is compatible with the foundation', () => {
            expect(validateCompatibleWithFoundationStub.called).to.equal(false);
          });

          it('Does not save an event', () => {
            expect(saveEventStub.called).to.equal(false);
          });

          it('Throws the validation error', () => {
            expect(caughtError).to.equal(validationError);
          });
        });
      });

      describe('Given the card being moved is not compatible with the foundation', () => {
        const validationError = Error('You can\'t play that there');

        let buildTableStateStub: SinonStub;
        let validateNonEmptyStub: SinonStub;
        let validateCompatibleWithFoundationStub: SinonStub;

        beforeEach(() => {
          buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
            foundation: [[{ suit: Suit.clubs, value: Value.ace, faceUp: true }], [], [], []],
            tableau: [[{ suit: Suit.diamonds, value: Value.jack, faceUp: true }], [], [], [], [], [], []]
          } as any);
          validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
          validateCompatibleWithFoundationStub =
            stub(validationModule, 'validateCompatibleWithFoundation').throws(validationError);
        });

        afterEach(() => {
          buildTableStateStub.restore();
          validateNonEmptyStub.restore();
          validateCompatibleWithFoundationStub.restore();
        });

        describe('When invoked', () => {
          let caughtError: any;

          beforeEach(async () => {
            try {
              await playTableauToFoundation({
                gameId: 'game-42',
                tableauIndex: 0,
                foundationIndex: 0
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
            expect(validateNonEmptyStub.callCount).to.equal(1);
            expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([
              { suit: Suit.diamonds, value: Value.jack, faceUp: true }
            ]);
            expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Tableau column 0');
          });

          it('Validates the card being moved is compatible with the foundation', () => {
            expect(validateCompatibleWithFoundationStub.callCount).to.equal(1);
            expect(validateCompatibleWithFoundationStub.getCall(0).args).to.deep.equal([
              { suit: Suit.diamonds, value: Value.jack, faceUp: true },
              { suit: Suit.clubs, value: Value.ace, faceUp: true }
            ])
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
      let validateNonEmptyStub: SinonStub;
      let validateCompatibleWithFoundationStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists').throws(validationError);
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
        buildTableStateStub = stub(tableStateModule, 'buildTableState');
        validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
        validateCompatibleWithFoundationStub = stub(validationModule, 'validateCompatibleWithFoundation');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
        buildTableStateStub.restore();
        validateNonEmptyStub.restore();
        validateCompatibleWithFoundationStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await playTableauToFoundation({
              gameId: 'game-42',
              tableauIndex: 0,
              foundationIndex: 0
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

        it('Does not validate the source tableau column is not empty', () => {
          expect(validateNonEmptyStub.called).to.equal(false);
        });

        it('Does not validate the card being moved is compatible with the foundation', () => {
          expect(validateCompatibleWithFoundationStub.called).to.equal(false);
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
      let validateNonEmptyStub: SinonStub;
      let validateCompatibleWithFoundationStub: SinonStub;

      beforeEach(() => {
        loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
        saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
        validateParametersStub = stub(validationModule, 'validateParameters');
        validateGameExistsStub = stub(validationModule, 'validateGameExists');
        validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished').throws(validationError);
        buildTableStateStub = stub(tableStateModule, 'buildTableState');
        validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
        validateCompatibleWithFoundationStub = stub(validationModule, 'validateCompatibleWithFoundation');
      });

      afterEach(() => {
        loadEventsStub.restore();
        saveEventStub.restore();
        validateParametersStub.restore();
        validateGameExistsStub.restore();
        validateGameNotFinishedStub.restore();
        buildTableStateStub.restore();
        validateNonEmptyStub.restore();
        validateCompatibleWithFoundationStub.restore();
      });

      describe('When invoked', () => {
        let caughtError: any;

        beforeEach(async () => {
          try {
            await playTableauToFoundation({
              gameId: 'game-42',
              tableauIndex: 0,
              foundationIndex: 0
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

        it('Does not validate the source tableau column is not empty', () => {
          expect(validateNonEmptyStub.called).to.equal(false);
        });

        it('Does not validate the card being moved is compatible with the foundation', () => {
          expect(validateCompatibleWithFoundationStub.called).to.equal(false);
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
    let validateNonEmptyStub: SinonStub;
    let validateCompatibleWithFoundationStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').rejects(eventStoreError);
      saveEventStub = stub(saveEventsModule, 'saveEvent').resolves();
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      buildTableStateStub = stub(tableStateModule, 'buildTableState');
      validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
      validateCompatibleWithFoundationStub = stub(validationModule, 'validateCompatibleWithFoundation');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
      buildTableStateStub.restore();
      validateNonEmptyStub.restore();
      validateCompatibleWithFoundationStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await playTableauToFoundation({
            gameId: 'game-42',
            tableauIndex: 0,
            foundationIndex: 0
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

      it('Does not validate the stock', () => {
        expect(validateNonEmptyStub.called).to.equal(false);
      });

      it('Does not validate the card being moved is compatible with the foundation', () => {
        expect(validateCompatibleWithFoundationStub.called).to.equal(false);
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
    let validateNonEmptyStub: SinonStub;
    let validateCompatibleWithFoundationStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents').resolves();
      saveEventStub = stub(saveEventsModule, 'saveEvent').rejects(eventStoreError);
      validateParametersStub = stub(validationModule, 'validateParameters');
      validateGameExistsStub = stub(validationModule, 'validateGameExists');
      validateGameNotFinishedStub = stub(validationModule, 'validateGameNotFinished');
      buildTableStateStub = stub(tableStateModule, 'buildTableState').returns({
        foundation: [[{ suit: Suit.clubs, value: Value.ace, faceUp: true }], [], [], []],
        tableau: [[{ suit: Suit.clubs, value: Value.two, faceUp: true }], [], [], [], [], [], []]
      } as any);
      validateNonEmptyStub = stub(validationModule, 'validateNonEmpty');
      validateCompatibleWithFoundationStub = stub(validationModule, 'validateCompatibleWithFoundation');
    });

    afterEach(() => {
      loadEventsStub.restore();
      saveEventStub.restore();
      validateParametersStub.restore();
      validateGameExistsStub.restore();
      validateGameNotFinishedStub.restore();
      buildTableStateStub.restore();
      validateNonEmptyStub.restore();
      validateCompatibleWithFoundationStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await playTableauToFoundation({
            gameId: 'game-42',
            tableauIndex: 0,
            foundationIndex: 0
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
        expect(validateNonEmptyStub.callCount).to.equal(1);
        expect(validateNonEmptyStub.getCall(0).args[0]).to.deep.equal([
          { suit: Suit.clubs, value: Value.two, faceUp: true }
        ]);
        expect(validateNonEmptyStub.getCall(0).args[1]).to.equal('Tableau column 0');
      });

      it('Validates the card being moved is compatible with the foundation', () => {
        expect(validateCompatibleWithFoundationStub.callCount).to.equal(1);
        expect(validateCompatibleWithFoundationStub.getCall(0).args).to.deep.equal([
          { suit: Suit.clubs, value: Value.two, faceUp: true },
          { suit: Suit.clubs, value: Value.ace, faceUp: true }
        ])
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
