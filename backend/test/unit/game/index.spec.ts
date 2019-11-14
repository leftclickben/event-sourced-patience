import { expect } from 'chai';
import { createDeck, dealTableau, shuffleDeck } from '../../../src/game';
import { Suit, Value } from '../../../src/game/types';

describe('Game utilities', () => {
  describe('Creating a deck', () => {
    it('Results in a complete deck', () => {
      expect(createDeck()).to.deep.equal([
        { suit: Suit.clubs, value: Value.two, faceUp: false },
        { suit: Suit.clubs, value: Value.three, faceUp: false },
        { suit: Suit.clubs, value: Value.four, faceUp: false },
        { suit: Suit.clubs, value: Value.five, faceUp: false },
        { suit: Suit.clubs, value: Value.six, faceUp: false },
        { suit: Suit.clubs, value: Value.seven, faceUp: false },
        { suit: Suit.clubs, value: Value.eight, faceUp: false },
        { suit: Suit.clubs, value: Value.nine, faceUp: false },
        { suit: Suit.clubs, value: Value.ten, faceUp: false },
        { suit: Suit.clubs, value: Value.jack, faceUp: false },
        { suit: Suit.clubs, value: Value.queen, faceUp: false },
        { suit: Suit.clubs, value: Value.king, faceUp: false },
        { suit: Suit.clubs, value: Value.ace, faceUp: false },

        { suit: Suit.diamonds, value: Value.two, faceUp: false },
        { suit: Suit.diamonds, value: Value.three, faceUp: false },
        { suit: Suit.diamonds, value: Value.four, faceUp: false },
        { suit: Suit.diamonds, value: Value.five, faceUp: false },
        { suit: Suit.diamonds, value: Value.six, faceUp: false },
        { suit: Suit.diamonds, value: Value.seven, faceUp: false },
        { suit: Suit.diamonds, value: Value.eight, faceUp: false },
        { suit: Suit.diamonds, value: Value.nine, faceUp: false },
        { suit: Suit.diamonds, value: Value.ten, faceUp: false },
        { suit: Suit.diamonds, value: Value.jack, faceUp: false },
        { suit: Suit.diamonds, value: Value.queen, faceUp: false },
        { suit: Suit.diamonds, value: Value.king, faceUp: false },
        { suit: Suit.diamonds, value: Value.ace, faceUp: false },

        { suit: Suit.spades, value: Value.two, faceUp: false },
        { suit: Suit.spades, value: Value.three, faceUp: false },
        { suit: Suit.spades, value: Value.four, faceUp: false },
        { suit: Suit.spades, value: Value.five, faceUp: false },
        { suit: Suit.spades, value: Value.six, faceUp: false },
        { suit: Suit.spades, value: Value.seven, faceUp: false },
        { suit: Suit.spades, value: Value.eight, faceUp: false },
        { suit: Suit.spades, value: Value.nine, faceUp: false },
        { suit: Suit.spades, value: Value.ten, faceUp: false },
        { suit: Suit.spades, value: Value.jack, faceUp: false },
        { suit: Suit.spades, value: Value.queen, faceUp: false },
        { suit: Suit.spades, value: Value.king, faceUp: false },
        { suit: Suit.spades, value: Value.ace, faceUp: false },

        { suit: Suit.hearts, value: Value.two, faceUp: false },
        { suit: Suit.hearts, value: Value.three, faceUp: false },
        { suit: Suit.hearts, value: Value.four, faceUp: false },
        { suit: Suit.hearts, value: Value.five, faceUp: false },
        { suit: Suit.hearts, value: Value.six, faceUp: false },
        { suit: Suit.hearts, value: Value.seven, faceUp: false },
        { suit: Suit.hearts, value: Value.eight, faceUp: false },
        { suit: Suit.hearts, value: Value.nine, faceUp: false },
        { suit: Suit.hearts, value: Value.ten, faceUp: false },
        { suit: Suit.hearts, value: Value.jack, faceUp: false },
        { suit: Suit.hearts, value: Value.queen, faceUp: false },
        { suit: Suit.hearts, value: Value.king, faceUp: false },
        { suit: Suit.hearts, value: Value.ace, faceUp: false }
      ]);
    });
  });

  describe('Shuffling a deck', () => {
    it('Retains all cards', () => {
      const shuffled = shuffleDeck([
        { suit: Suit.clubs, value: Value.two, faceUp: false },
        { suit: Suit.diamonds, value: Value.three, faceUp: false },
        { suit: Suit.spades, value: Value.four, faceUp: false },
        { suit: Suit.hearts, value: Value.five, faceUp: false }
      ]);
      expect(shuffled.length).to.equal(4);
      expect(shuffled.some((({ suit, value }) => suit === Suit.clubs && value === Value.two))).to.equal(true);
      expect(shuffled.some((({ suit, value }) => suit === Suit.diamonds && value === Value.three))).to.equal(true);
      expect(shuffled.some((({ suit, value }) => suit === Suit.spades && value === Value.four))).to.equal(true);
      expect(shuffled.some((({ suit, value }) => suit === Suit.hearts && value === Value.five))).to.equal(true);
    })
  });

  describe('Dealing the tableau', () => {
    describe('From an unshuffled deck',  () => {
      it('Returns the correct result', () => {
        expect(dealTableau(createDeck())).to.deep.equal([
          [
            { suit: Suit.hearts, value: Value.ace, faceUp: true }
          ],
          [
            { suit: Suit.hearts, value: Value.king, faceUp: false },
            { suit: Suit.hearts, value: Value.seven, faceUp: true }
          ],
          [
            { suit: Suit.hearts, value: Value.queen, faceUp: false },
            { suit: Suit.hearts, value: Value.six, faceUp: false },
            { suit: Suit.spades, value: Value.ace, faceUp: true }
          ],
          [
            { suit: Suit.hearts, value: Value.jack, faceUp: false },
            { suit: Suit.hearts, value: Value.five, faceUp: false },
            { suit: Suit.spades, value: Value.king, faceUp: false },
            { suit: Suit.spades, value: Value.nine, faceUp: true }
          ],
          [
            { suit: Suit.hearts, value: Value.ten, faceUp: false },
            { suit: Suit.hearts, value: Value.four, faceUp: false },
            { suit: Suit.spades, value: Value.queen, faceUp: false },
            { suit: Suit.spades, value: Value.eight, faceUp: false },
            { suit: Suit.spades, value: Value.five, faceUp: true }
          ],
          [
            { suit: Suit.hearts, value: Value.nine, faceUp: false },
            { suit: Suit.hearts, value: Value.three, faceUp: false },
            { suit: Suit.spades, value: Value.jack, faceUp: false },
            { suit: Suit.spades, value: Value.seven, faceUp: false },
            { suit: Suit.spades, value: Value.four, faceUp: false },
            { suit: Suit.spades, value: Value.two, faceUp: true }
          ],
          [
            { suit: Suit.hearts, value: Value.eight, faceUp: false },
            { suit: Suit.hearts, value: Value.two, faceUp: false },
            { suit: Suit.spades, value: Value.ten, faceUp: false },
            { suit: Suit.spades, value: Value.six, faceUp: false },
            { suit: Suit.spades, value: Value.three, faceUp: false },
            { suit: Suit.diamonds, value: Value.ace, faceUp: false },
            { suit: Suit.diamonds, value: Value.king, faceUp: true }
          ]
        ]);
      });
    });
  });
});
