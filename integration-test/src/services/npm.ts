import { spawn } from 'child_process';
import { StageName } from '../types';
import { writeNewLine, writeProgress } from '../ui';

export const runNpmScript = async (
  script: string,
  stage: StageName,
  cwd: string,
  verbosity: number
): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(
      'npm',
      ['run', script, `--stage="${stage}"`],
      { cwd, stdio: 'pipe' }
    );

    child.on('close', () => {
      writeNewLine(verbosity);
      resolve();
    });

    child.on('error', (error) => {
      reject(error);
      child.kill();
    });

    child.stdout.on('data', (data) => writeProgress(data, verbosity));
    child.stderr.on('data', (data) => writeProgress(data, verbosity));
  });
