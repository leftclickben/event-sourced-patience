import { Card, Suit, Value } from './types';
import { SIZE_TABLEAU } from '../state/util';

export const createDeck = (): Card[] =>
  Object.keys(Suit).reduce<Card[]>(
    (result, suit) => [
      ...result,
      ...Object.keys(Value).map<Card>((value) => ({
        suit: Suit[suit as Suit],
        value: Value[value as Value],
        faceUp: false
      }))
    ],
    []);

export const shuffleDeck = (deck: Card[]): Card[] =>
  Array.from({ length: deck.length }, () => {
    const index = Math.floor(Math.random() * deck.length);
    return deck.splice(index, 1)[0];
  });

export const createTableau = (deck: Card[]) =>
  Array.from(
    { length: SIZE_TABLEAU },
    (_, index) => Array.from(
      { length: index + 1 },
      (__, cardIndex) => {
        const card = deck.pop() as Card;
        if (cardIndex === index) {
          card.faceUp = true;
        }
        return card;
      }));

export const suitColour: Record<Suit, 'red' | 'black'> = {
  [Suit.clubs]: 'black',
  [Suit.spades]: 'black',
  [Suit.diamonds]: 'red',
  [Suit.hearts]: 'red'
};

export const nextLowestValue: Record<Value, Value | undefined> = {
  [Value.ace]: undefined,
  [Value.two]: Value.ace,
  [Value.three]: Value.two,
  [Value.four]: Value.three,
  [Value.five]: Value.four,
  [Value.six]: Value.five,
  [Value.seven]: Value.six,
  [Value.eight]: Value.seven,
  [Value.nine]: Value.eight,
  [Value.ten]: Value.nine,
  [Value.jack]: Value.ten,
  [Value.queen]: Value.jack,
  [Value.king]: Value.queen
};
