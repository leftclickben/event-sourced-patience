import * as chalk from 'chalk';
import { GameId } from './types';
import { gameTitle } from '../../frontend-cli/src/strings';
import { repeat } from '../../frontend-cli/src/util';

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



export const writeBanner = (stage: string) => {
  console.info(`${chalk.black('\u2663')} ${chalk.red('\u2666')} ${chalk.black('\u2660')} ${chalk.red('\u2665')} ${chalk.yellowBright('Integration Tests')} ${chalk.red('\u2665')} ${chalk.black('\u2660')} ${chalk.red('\u2666')} ${chalk.black('\u2663')}`);
  console.info('');
  console.info(`Stage name: ${chalk.bold(stage)}`);
  console.info('');
};

export const writeHeading = (message: string) => console.info(chalk.bold(message));

export const writeMessage = (message: string) => console.info(message);

export const writeSuccess = (message: string) => console.info(chalk.green(chalk.bold(message)));

export const writeError = (message: string, error?: any) => console.error(chalk.red(chalk.bold(message)), error);

export const writeErrorDetails = (message: string) => console.error(message);

export const writeProgress = (message?: string, verbose: boolean = false) => {
  if (verbose) {
    console.info(message);
  } else {
    process.stdout.write(chalk.gray('\u00b7'));
  }
};

export const writeProgressError = (message?: string, verbose: boolean = false) => {
  if (verbose) {
    console.error(chalk.red(message));
  } else {
    process.stdout.write(chalk.red('\u00b7'));
  }
};

export const writeTestPassed = (gameId: GameId, verbose: boolean = false) => {
  console.info(chalk.green(chalk.bold(verbose ? `All tests passed for "${gameId}"` : `\u2713 ${gameId}`)));
};

export const writeTestFailed = (gameId: GameId, verbose: boolean = false) => {
  console.info(chalk.red(chalk.bold(verbose ? `Test failure for "${gameId}"` : `\u2717 ${gameId}`)));
};

export const writeNewLine = () => console.info('');

export const pressEnter = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    console.info('Press enter to continue...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => resolve());
    process.stdin.on('error', (error) => reject(error));
  });
