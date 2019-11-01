import chalk from 'chalk';
import { gameTitle } from '../../strings';
import { repeat } from '../../util';

const [club, diamond, spade, heart] = [
  chalk.black('\u2663'),
  chalk.red('\u2666'),
  chalk.black('\u2660'),
  chalk.red('\u2665')
];

export const generateBannerBorder = (viewWidth: number) => [
  [
    ' \u2554',
    chalk.bgWhite(` ${club} ${diamond} ${spade} ${heart} ${chalk.green(chalk.bold(gameTitle))} ${heart} ${spade} ${diamond} ${club} `),
    '\u2557 '
  ].join(repeat(Math.ceil((viewWidth - gameTitle.length) / 2) - 6, '\u2550'))
];

export const generateBottomBorder = (viewWidth: number) => [
  ` \u255a${repeat(viewWidth + 6, '\u2550')}\u255d `
];

export const applyVerticalBorder = (line: string, viewWidth: number) => [
  ' \u2551   ',
  `${line}${repeat(viewWidth - line.length)}`,
  '   \u2551 '
].join('');
