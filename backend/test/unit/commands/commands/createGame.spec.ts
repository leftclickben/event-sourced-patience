import { SinonSpy, SinonStub, spy, stub } from 'sinon';
import { expect } from 'chai';
import * as saveEventsModule from '../../../../src/events/save';
import * as idModule from '../../../../src/id';
import * as gameModule from '../../../../src/game';
import { GameEvent, GameEventType } from '../../../../src/events/types';
import { createSampleGameplayEvent } from '../../../fixtures/events';
import { fail } from 'assert';
import { createGame } from '../../../../src/commands/processors/createGame';
import { stockFromUnshuffledDeck, tableauFromUnshuffledDeck } from '../../../fixtures/game';

describe('The "create game" command', () => {
  let generateIdStub: SinonStub;
  let createDeckSpy: SinonSpy;
  let shuffleDeckStub: SinonStub;
  let dealTableauSpy: SinonSpy;

  beforeEach(() => {
    generateIdStub = stub(idModule, 'generateId').returns('generated-id');

    // Don't actually shuffle the deck, so we know what order the cards will come out in.
    shuffleDeckStub = stub(gameModule, 'shuffleDeck').callsFake((deck) => deck);

    // Only spy on these to retain functionality.
    createDeckSpy = spy(gameModule, 'createDeck');
    dealTableauSpy = spy(gameModule, 'dealTableau');
  });

  afterEach(() => {
    generateIdStub.restore();
    shuffleDeckStub.restore();
    createDeckSpy.restore();
    dealTableauSpy.restore();
  });

  describe('Given the event store is saving events correctly', () => {
    const savedEvent: GameEvent = createSampleGameplayEvent(GameEventType.gameCreated);

    let saveEventStub: SinonStub;

    beforeEach(() => {
      saveEventStub = stub(saveEventsModule, 'saveEvent').resolves(savedEvent);
    });

    afterEach(() => {
      saveEventStub.restore();
    });

    describe('When invoked', () => {
      let result: GameEvent;

      beforeEach(async () => {
        result = await createGame();
      });

      it('Creates a deck', () => {
        expect(createDeckSpy.calledOnce).to.equal(true);
      });

      it('Shuffles the deck', () => {
        expect(shuffleDeckStub.calledOnce).to.equal(true);
      });

      it('Deals the cards to the tableau', () => {
        expect(dealTableauSpy.calledOnce).to.equal(true);
      });

      it('Saves the new event', () => {
        expect(saveEventStub.calledOnce).to.equal(true);
        expect(saveEventStub.firstCall.args).to.deep.equal([
          'gameCreated',
          {
            gameId: 'generated-id',
            tableau: tableauFromUnshuffledDeck,
            stock: stockFromUnshuffledDeck
          }
        ]);
      });

      it('Returns the saved event', () => {
        expect(result).to.equal(savedEvent);
      });
    });
  });

  describe('Given the event store throws when saving an event', () => {
    const eventStoreError = Error('Database error: Failed to save event');

    let saveEventStub: SinonStub;

    beforeEach(() => {
      saveEventStub = stub(saveEventsModule, 'saveEvent').rejects(eventStoreError);
    });

    afterEach(() => {
      saveEventStub.restore();
    });

    describe('When invoked', () => {
      let caughtError: any;

      beforeEach(async () => {
        try {
          await createGame();
          fail('Test failed because command should throw an error');
        } catch (e) {
          caughtError = e;
        }
      });

      it('Creates a deck', () => {
        expect(createDeckSpy.calledOnce).to.equal(true);
      });

      it('Shuffles the deck', () => {
        expect(shuffleDeckStub.calledOnce).to.equal(true);
      });

      it('Deals the cards to the tableau', () => {
        expect(dealTableauSpy.calledOnce).to.equal(true);
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
