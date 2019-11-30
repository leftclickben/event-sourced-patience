import * as chalk from 'chalk';

export const writeProgress = (message: string, verbosity: number) => {
  if (verbosity >= 2) {
    console.info(message);
  } else if (verbosity >= 1) {
    process.stdout.write(chalk.gray('\u00b7'));
  }
};

export const writeNewLine = (verbosity: number) => {
  if (verbosity > 0) {
    console.info('');
  }
};
