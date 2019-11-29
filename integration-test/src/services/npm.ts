import { StageName } from '../types';
import { spawn } from 'child_process';

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
      child.stdout.on('data', () => process.stdout.write('.'));
      child.stderr.on('data', () => process.stdout.write('X'));
    }
  });
