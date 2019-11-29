import { spawn } from 'child_process';
import * as chalk from 'chalk';
import { StageName } from '../types';

export const runNpmScript = async (
  script: string,
  stage: StageName,
  cwd: string,
  verbose: boolean
): Promise<void> =>
  new Promise((resolve, reject) => {
    const stdio = verbose ? 'inherit' : 'pipe';
    const child = spawn(
      'npm',
      ['run', script, `--stage="${stage}"`],
      { cwd, stdio }
    );

    child.on('close', () => {
      console.info('');
      resolve();
    });

    child.on('error', (error) => {
      reject(error);
      child.kill();
    });

    if (child.stdout && child.stderr && !verbose) {
      child.stdout.on('data', () => process.stdout.write(chalk.grey('.')));
      child.stderr.on('data', () => process.stdout.write(chalk.red(chalk.bold('X'))));
    }
  });
