import { Suit } from '../../types';
import chalk from 'chalk';

export const asColourFor: Record<Suit | 'faceDown', (text: string) => string> = {
  clubs: (text) => chalk.black(chalk.bgWhite(text)),
  spades: (text) => chalk.black(chalk.bgWhite(text)),
  hearts: (text) => chalk.red(chalk.bgWhite(text)),
  diamonds: (text) => chalk.red(chalk.bgWhite(text)),
  faceDown: (text) => chalk.white(chalk.bgBlue(text))
};
