import { spawn } from 'child_process';
import { StageName } from '../types';
import { writeNewLine, writeProgress, writeProgressError } from '../ui';

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
      writeNewLine();
      resolve();
    });

    child.on('error', (error) => {
      reject(error);
      child.kill();
    });

    if (child.stdout && child.stderr && !verbose) {
      child.stdout.on('data', (data) => writeProgress(data, verbose));
      child.stderr.on('data', (data) => writeProgressError(data, verbose));
    }
  });
