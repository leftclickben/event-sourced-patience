import { Suit, Value } from '../../src/game/types';
import { createDeck } from '../../src/game';

export const tableauFromUnshuffledDeck = [
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
];

export const stockFromUnshuffledDeck = createDeck().slice(0, 24);
