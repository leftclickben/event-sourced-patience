import chalk from 'chalk';
import { Card, GameStatus, Suit, Value } from '../../types';
import { Game } from '../../services/api';
import { maxChildLength, top } from '../../util';
import { clearScreen, gameTitle } from '../../strings';

const asColourFor: Record<Suit | 'faceDown', (text: string) => string> = {
  clubs: (text) => chalk.black(chalk.bgWhite(text)),
  spades: (text) => chalk.black(chalk.bgWhite(text)),
  hearts: (text) => chalk.red(chalk.bgWhite(text)),
  diamonds: (text) => chalk.red(chalk.bgWhite(text)),
  faceDown: (text) => chalk.white(chalk.bgBlue(text))
};

const [club, diamond, spade, heart] = [
  chalk.black('\u2663'),
  chalk.red('\u2666'),
  chalk.black('\u2660'),
  chalk.red('\u2665')
];

const repeat = (length: number, character = ' ') => Array.from({ length }, () => character).join('');

const margin = '  ';

const baseSlot = '   ';

const emptySlot = chalk.gray('\u2592\u2592\u2592');

const getDisplayWidth = (tableau: Card[][], foundation: Card[][]) => {
  const columns = Math.max(tableau.length, foundation.length);
  return columns * baseSlot.length + (columns - 1) * margin.length;
};

const faceDownCardSlot = '\u2591\u2591\u2591';

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

const statusDisplay: Record<GameStatus, string> = {
  [GameStatus.none]: '',
  [GameStatus.inProgress]: 'In Progress',
  [GameStatus.completed]: '!! YOU WON !!',
  [GameStatus.forfeited]: 'Quitter'
};

const createBottomBorder = (displayWidth: number) => ` \u255a${repeat(displayWidth + 6, '\u2550')}\u255d `;

const applyVerticalBorder = (line: string, displayWidth: number) => [
  ' \u2551   ',
  `${line}${repeat(displayWidth - line.length)}`,
  '   \u2551 '
].join('');

export const generateBannerView = (displayWidth: number) => [
  [
    ' \u2554',
    chalk.bgWhite(` ${club} ${diamond} ${spade} ${heart} ${chalk.green(chalk.bold(gameTitle))} ${heart} ${spade} ${diamond} ${club} `),
    '\u2557 '
  ].join(repeat(Math.ceil((displayWidth - gameTitle.length) / 2) - 6, '\u2550'))
];

const generateScoreView = (score: number, status: GameStatus, displayWidth: number) => [
  '',
  [
    `Score: ${score}`,
    `Status: ${statusDisplay[status]}`
  ].join(repeat(displayWidth - `Score: ${score}Status: ${statusDisplay[status]}`.length))
];

const generateFoundationView = (foundation: Card[][], tableauColumns: number) => [
  '',
  [
    ...Array.from(
      { length: tableauColumns - foundation.length },
      () => baseSlot
    ),
    ...foundation.map(top).map((card) => generateCardView(card))
  ].join(margin),
  ''
];

const generateTableauView = (tableau: Card[][]) =>
  Array.from({ length: maxChildLength(tableau) }, (_, cardIndex) =>
    Array.from({ length: tableau.length }, (__, columnIndex) =>
      generateCardView(tableau[columnIndex][cardIndex], false)).join(margin));

const generateFooterView = (stock: Card[], waste: Card[], tableauColumns: number) => [
  '',
  [
    ...Array.from({ length: tableauColumns - 2 }, () => generateCardView(undefined, false)),
    generateCardView(top(waste)),
    generateCardView(top(stock))
  ].join(margin),
  ''
];

export const generateCardView = (card: Card | undefined, displayBlanks: boolean = true) =>
  card
    ? (
      card.faceUp
        ? asColourFor[card.suit](`${suitDisplay[card.suit]}${valueDisplay[card.value]}`)
        : asColourFor.faceDown(faceDownCardSlot))
    : (displayBlanks ? emptySlot : baseSlot);

export const generateGameView = ({ table: { status, tableau, foundation, stock, waste }, score }: Game): string => {
  const displayWidth = getDisplayWidth(tableau, foundation);
  return [
    clearScreen,
    ...generateBannerView(displayWidth),
    ...[
      ...generateScoreView(score, status, displayWidth),
      ...generateFoundationView(foundation, tableau.length),
      ...generateTableauView(tableau),
      ...generateFooterView(stock, waste, tableau.length),
    ].map((line) => applyVerticalBorder(line, displayWidth)),
    createBottomBorder(displayWidth)
  ].join('\n');
};
