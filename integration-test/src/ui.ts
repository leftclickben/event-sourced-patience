import * as chalk from 'chalk';

export const writeBanner = (stage: string) => {
  console.info(chalk.yellowBright('::::: Integration Tests :::::'));
  console.info('');
  console.info(`Stage name: ${chalk.bold(stage)}`);
  console.info('');
};

export const writeHeading = (message: string) => console.info(chalk.bold(message));

export const writeMessage = (message: string) => console.info(message);

export const writeSuccess = (message: string) => console.info(chalk.green(chalk.bold(message)));

export const writeError = (message: string, error: any) => console.error(chalk.red(chalk.bold(message)), error);

export const writeProgress = (message?: string, verbose: boolean = false) => {
  if (verbose) {
    console.info(message);
  } else {
    process.stdout.write(chalk.gray('.'));
  }
};

export const writeProgressError = (message?: string, verbose: boolean = false) => {
  if (verbose) {
    console.error(chalk.red(chalk.bold(message)));
  } else {
    process.stdout.write(chalk.red(chalk.bold('X')));
  }
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
