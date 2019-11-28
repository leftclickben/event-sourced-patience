import { StageName } from './types';
import { stdin } from 'process';
import { spawn } from 'child_process';

export type OutputType = 'verbose' | 'terse' | 'none';

export const runNpmScript = async (
  script: string,
  stage: StageName,
  cwd: string,
  outputType: OutputType = 'terse'
): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(
      '/home/ben/.nvm/versions/node/v10.16.0/bin/npm',
      ['run', script, `--stage="${stage}"`],
      {
        cwd,
        stdio: outputType === 'verbose' ? 'inherit' : (outputType === 'none' ? 'ignore' : 'pipe'),
        timeout: 180000
      })
      .on('close', () => {
        console.info();
        resolve();
      })
      .on('error', reject);

    if (child.stdout && child.stderr && outputType === 'terse') {
      child.stdout.on('data', () => process.stdout.write('.'));
      child.stderr.on('data', () => process.stdout.write('X'));
    }
  });

export const pressEnter = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on('data', () => resolve());
    stdin.on('error', (error) => reject(error));
  });
