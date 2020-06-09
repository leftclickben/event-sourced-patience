import { expect } from 'chai';
import {
  validateAllFaceUp,
  validateCompatibleWithFoundation,
  validateCompatibleWithTableau,
  validateGameExists,
  validateGameNotFinished,
  validateLength,
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
    describe('When called with a card of the same suit and value one less than the destination', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        const destinationCard: Card = { suit: Suit.clubs, value: Value.three, faceUp: true };
        expect(() => validateCompatibleWithTableau(movingCard, destinationCard))
          .to.throw('Command validation failed: Card colour must alternate when building tableau columns');
      });
    });

    describe('When called with a card of the other suit of the same colour and value one less than destination', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        const destinationCard: Card = { suit: Suit.spades, value: Value.three, faceUp: true };
        expect(() => validateCompatibleWithTableau(movingCard, destinationCard))
          .to.throw('Command validation failed: Card colour must alternate when building tableau columns');
      });
    });

    describe('When called with a card of the other suit of the same colour and value one less than destination', () => {
      it('Throws an error', () => {
        const movingCard: Card = { suit: Suit.clubs, value: Value.two, faceUp: true };
        const destinationCard: Card = { suit: Suit.spades, value: Value.three, faceUp: true };
        expect(() => validateCompatibleWithTableau(movingCard, destinationCard))
          .to.throw('Command validation failed: Card colour must alternate when building tableau columns');
      });
    });
  });

  describe('The length validator', () => {
    describe('When called with an array longer than the required number', () => {
      it('Does not throw', () => {
        expect(() => validateLength(
          [
            { suit: Suit.clubs, value: Value.jack, faceUp: true },
            { suit: Suit.hearts, value: Value.three, faceUp: true}
          ],
          1,
          'Test'
        )).not.to.throw();
      });
    });

    describe('When called with an array the same length as the required number', () => {
      it('Does not throw', () => {
        expect(() => validateLength(
          [
            { suit: Suit.clubs, value: Value.jack, faceUp: true },
            { suit: Suit.hearts, value: Value.three, faceUp: true }
          ],
          2,
          'Test'
        )).not.to.throw();
      });
    });

    describe('When called with an array shorter than the required number', () => {
      it('Throws', () => {
        expect(() => validateLength(
          [
            { suit: Suit.clubs, value: Value.jack, faceUp: true },
            { suit: Suit.hearts, value: Value.three, faceUp: true}
          ],
          3,
          'Test'
        )).to.throw('Command validation failed: Insufficient cards in Test');
      });
    });
  });

  describe('Validating all cards are face up', () => {
    describe('When given an empty array', () => {
      it('Does not throw', () => {
        expect(() => validateAllFaceUp([], 'Test')).not.to.throw();
      });
    });
    describe('When given a single face up card', () => {
      it('Does not throw', () => {
        const cards: Card[] = [
          { suit: Suit.clubs, value: Value.jack, faceUp: true }
        ];
        expect(() => validateAllFaceUp(cards, 'Test')).not.to.throw();
      });
    });
    describe('When given multiple face up cards', () => {
      it('Does not throw', () => {
        const cards: Card[] = [
          { suit: Suit.clubs, value: Value.jack, faceUp: true },
          { suit: Suit.hearts, value: Value.queen, faceUp: true },
          { suit: Suit.spades, value: Value.ace, faceUp: true }
        ];
        expect(() => validateAllFaceUp(cards, 'Test')).not.to.throw();
      });
    });
    describe('When given a single face down card', () => {
      it('Throws', () => {
        const cards: Card[] = [
          { suit: Suit.clubs, value: Value.jack, faceUp: false }
        ];
        expect(() => validateAllFaceUp(cards, 'Test'))
          .to.throw('Command validation failed: All cards in Test must be face up');
      });
    });
    describe('When given multiple cards including face down cards', () => {
      it('Throws', () => {
        const cards: Card[] = [
          { suit: Suit.clubs, value: Value.jack, faceUp: false },
          { suit: Suit.hearts, value: Value.queen, faceUp: true },
          { suit: Suit.spades, value: Value.ace, faceUp: true }
        ];
        expect(() => validateAllFaceUp(cards, 'Test'))
          .to.throw('Command validation failed: All cards in Test must be face up');
      });
    });
  });
});
