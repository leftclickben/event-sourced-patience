import * as chalk from 'chalk';

export const writeProgress = (message: string, verbosity: number) => {
  if (verbosity > 0) {
    process.stdout.write(verbosity >= 2 ? message : chalk.gray('\u00b7'));
  }
};

export const writeNewLine = (verbosity: number) => {
  if (verbosity > 0) {
    console.info('');
  }
};
