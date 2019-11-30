import * as chalk from 'chalk';
import { GameId } from './types';

export const writeBanner = (stage: string) => {
  console.info(chalk.yellowBright('::::: Integration Tests :::::'));
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
    process.stdout.write(chalk.gray('.'));
  }
};

export const writeProgressError = (message?: string, verbose: boolean = false) => {
  if (verbose) {
    console.error(chalk.red(message));
  } else {
    process.stdout.write(chalk.red('\u2717'));
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
