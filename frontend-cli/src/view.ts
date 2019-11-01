import chalk from 'chalk';
import { Card, Suit, Value } from './types';
import { Game } from './api';
import { maxChildLength, top } from './util';
import { banner, clearScreen } from './strings';

const asColour: Record<Suit | 'faceDown', (text: string) => string> = {
  clubs: (text) => chalk.black(chalk.bgWhite(text)),
  spades: (text) => chalk.black(chalk.bgWhite(text)),
  hearts: (text) => chalk.red(chalk.bgWhite(text)),
  diamonds: (text) => chalk.red(chalk.bgWhite(text)),
  faceDown: (text) => chalk.white(chalk.bgBlue(text))
};

const spaceDisplay = '  ';
const faceDownDisplay = '\u2592\u2592\u2592';

const suitDisplay: Record<Suit, string> = {
  [Suit.clubs]: '\u2663',
  [Suit.diamonds]: '\u2666',
  [Suit.spades]: '\u2660',
  [Suit.hearts]: '\u2665'
};

const valueDisplay: Record<Value, string> = {
  [Value.two]: ' 2',
  [Value.three]: ' 3',
  [Value.four]: ' 4',
  [Value.five]: ' 5',
  [Value.six]: ' 6',
  [Value.seven]: ' 7',
  [Value.eight]: ' 8',
  [Value.nine]: ' 9',
  [Value.ten]: '10',
  [Value.jack]: ' J',
  [Value.queen]: ' Q',
  [Value.king]: ' K',
  [Value.ace]: ' A'
};

const getTableauRows = (tableau: Card[][]) =>
  Array.from({ length: maxChildLength(tableau) }, (_, cardIndex) =>
    Array.from({ length: tableau.length }, (__, columnIndex) =>
      generateCardView(tableau[columnIndex][cardIndex], false)).join(spaceDisplay));

export const generateCardView = (card: Card | undefined, displayBlanks: boolean = true) =>
  card
    ? (
      card.faceUp
        ? asColour[card.suit](`${suitDisplay[card.suit]}${valueDisplay[card.value]}`)
        : asColour.faceDown(faceDownDisplay))
    : (
      displayBlanks
        ? '___'
        : '   ');

export const generateGameView = ({ table: { tableau, foundation, stock, waste }, score }: Game): string => [
  clearScreen,
  banner,
  '',
  `Score: ${score}`,
  [
    ...Array.from({ length: tableau.length - foundation.length }, () => generateCardView(undefined, false)),
    ...foundation.map(top).map((card) => generateCardView(card))
  ].join(spaceDisplay),
  '',
  ...getTableauRows(tableau),
  '',
  [
    ...Array.from({ length: tableau.length - 2 }, () => generateCardView(undefined, false)),
    generateCardView(top(waste)),
    generateCardView(top(stock))
  ].join(spaceDisplay),
  ''
].join('\n');
