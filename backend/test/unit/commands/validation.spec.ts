import { expect } from 'chai';
import {
  validateCompatibleWithFoundation,
  validateCompatibleWithTableau,
  validateGameExists,
  validateGameNotFinished,
  validateNonEmpty,
  validateParameters
} from '../../../src/commands/validation';
import {
  createSampleCreateGameEvent,
  createSampleForfeitGameEvent,
  createSampleGameplayEvent
} from '../../fixtures/events';
import { GameEventType } from '../../../src/events/types';
import { Card, Suit, Value } from '../../../src/game/types';

describe('Command validation utilities', () => {
  describe('Parameter validator', () => {
    describe('When called with an empty object', () => {
      it('Does not throw', () => {
        expect(() => validateParameters({})).not.to.throw();
      });
    });

    describe('When called with an object where every key maps to a truthy value', () => {
      it('Does not throw', () => {
        expect(() => validateParameters({
          foo: 'bar',
          xyzzy: 'maze of twisty passages'
        })).not.to.throw();
      });
    });

    describe('When called with an object with one falsy value', () => {
      it('Throws an error', () => {
        expect(() => validateParameters({
          foo: 'bar',
          xyzzy: undefined
        })).to.throw('Required parameters missing: "xyzzy"');
      });
    });

    describe('When called with an object with multiple falsy values', () => {
      it('Throws an error', () => {
        expect(() => validateParameters({
          foo: 'bar',
          xyzzy: undefined,
          another: null,
          baz: ''
        })).to.throw('Required parameters missing: "xyzzy", "another", "baz"');
      });
    });
  });

  describe('The game existence validator', () => {
    describe('When called with a non-empty list', () => {
      it('Does not throw', () => {
        expect(() => validateGameExists([createSampleCreateGameEvent()])).not.to.throw();
      });
    });

    describe('When called with an empty list', () => {
      it('Throws an error', () => {
        expect(() => validateGameExists([])).to.throw('Command validation failed: Game does not exist');
      });
    });
  });

  describe('The game completion validator', () => {
    describe('When called with an empty list', () => {
      it('Does not throw', () => {
        expect(() => validateGameNotFinished([])).not.to.throw();
      });
    });

    describe('When called with a non-empty list that does not include a forfeit or victory event', () => {
      it('Does not throw', () => {
        expect(() => validateGameNotFinished([createSampleCreateGameEvent()])).not.to.throw();
      });
    });

    describe('When called with a non-empty list that does includes a forfeit event', () => {
      it('Does not throw', () => {
        expect(() => validateGameNotFinished([
          createSampleCreateGameEvent(),
          createSampleForfeitGameEvent()
        ])).to.throw('Command validation failed: Game is already forfeited');
      });
    });

    describe('When called with a non-empty list that does includes a victory event', () => {
      it('Does not throw', () => {
        expect(() => validateGameNotFinished([
          createSampleCreateGameEvent(),
          createSampleGameplayEvent(GameEventType.victoryClaimed)
        ])).to.throw('Command validation failed: Game is already forfeited');
      });
    });
  });

  describe('The list-not-empty validator', () => {
    describe('When called with a non-empty list', () => {
      it('Does not throw', () => {
        expect(() => validateNonEmpty(['foo'], 'strings')).not.to.throw();
      });
    });

    describe('When called with an empty list', () => {
      it('Throws an error', () => {
        expect(() => validateNonEmpty([], 'strings'))
          .to.throw('Command validation failed: "strings" is empty');
      });
    });
  });

  describe('The foundation compatibility validator', () => {
    describe('When called with an Ace on an empty foundation', () => {
      it('Does not throw', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.ace, faceUp: true };
        expect(() => validateCompatibleWithFoundation(movingCard, undefined)).not.to.throw();
      });
    });

    describe('When called with an Ace on a non-empty foundation', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.ace, faceUp: true };
        const destinationCard: Card = { suit: Suit.diamonds, value: Value.ace, faceUp: true };
        expect(() => validateCompatibleWithFoundation(movingCard, destinationCard))
          .to.throw('Command validation failed: Suits must match when playing to a non-empty foundation');
      });
    });

    describe('When called with something other than an Ace on an empty foundation', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        expect(() => validateCompatibleWithFoundation(movingCard, undefined))
          .to.throw('Command validation failed: Only Aces can be played to an empty foundation');
      });
    });

    describe('When called with a card of the correct suit but incorrect value on a non-empty foundation', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.three, faceUp: true };
        const destinationCard: Card = { suit: Suit.clubs, value: Value.ace, faceUp: true };
        expect(() => validateCompatibleWithFoundation(movingCard, destinationCard))
          .to.throw('Command validation failed: Value must ascend when playing to a non-empty foundation');
      });
    });

    describe('When called with a card of the incorrect suit but correct value on a non-empty foundation', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.three, faceUp: true };
        const destinationCard: Card = { suit: Suit.diamonds, value: Value.two, faceUp: true };
        expect(() => validateCompatibleWithFoundation(movingCard, destinationCard))
          .to.throw('Command validation failed: Suits must match when playing to a non-empty foundation');
      });
    });

    describe('When called with a card of correct suit and value on a non-empty foundation', () => {
      it('Does not throw', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.three, faceUp: true };
        const destinationCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        expect(() => validateCompatibleWithFoundation(movingCard, destinationCard)).not.to.throw();
      });
    });
  });

  describe('The tableau compatibility validator', () => {
    describe('When called with a card of the same suit as the destination and value one less than the destination', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        const destinationCard: Card = { suit: Suit.clubs, value: Value.three, faceUp: true };
        expect(() => validateCompatibleWithTableau(movingCard, destinationCard))
          .to.throw('Command validation failed: Card colour must alternate when building tableau columns');
      });
    });

    describe('When called with a card of the other suit of the same colour as the destination and value one less than the destination', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        const destinationCard: Card = { suit: Suit.spades, value: Value.three, faceUp: true };
        expect(() => validateCompatibleWithTableau(movingCard, destinationCard))
          .to.throw('Command validation failed: Card colour must alternate when building tableau columns');
      });
    });

    describe('When called with a card of the other suit of the same colour as the destination and value one less than the destination', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        const destinationCard: Card = { suit: Suit.spades, value: Value.three, faceUp: true };
        expect(() => validateCompatibleWithTableau(movingCard, destinationCard))
          .to.throw('Command validation failed: Card colour must alternate when building tableau columns');
      });
    });
  });

  describe('The length validator', () => {

  });
});
