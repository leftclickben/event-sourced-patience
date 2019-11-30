import { spawn } from 'child_process';
import { GameId, OutputTapes, Tape } from '../types';
import { writeNewLine, writeProgress } from '../ui';

export const playGame = async (
  gameId: GameId,
  inputTape: Tape,
  apiBaseUrl: string,
  verbosity: number
): Promise<OutputTapes> =>
  new Promise((resolve, reject) => {
    const outputTape: Tape = [];
    const errorTape: Tape = [];

    const child = spawn(
      'npm',
      ['run', 'game', '--silent', '--', `--game=${gameId}`, '--no-color'],
      {
        cwd: '../frontend-cli',
        stdio: 'pipe',
        env: {
          ...process.env,
          FORCE_COLOR: '0',
          API_BASE_URL: apiBaseUrl
        }
      });

    child.on('close', () => {
      writeNewLine(verbosity);
      resolve({ outputTape, errorTape });
    });

    child.on('error', (error) => {
      reject(error);
      child.kill();
    });

    child.stdout.on('data', (data) => {
      writeProgress(data.toString(), verbosity);
      outputTape.push(data.toString());
    });

    child.stderr.on('data', (data) => {
      writeProgress(data.toString(), verbosity);
      errorTape.push(data.toString());
    });

    // The additional empty string ensures the final command is actually issued.
    child.stdin.write([...inputTape, ''].join('\n'), (error) => {
      if (error) {
        child.kill();
        reject(error);
      }
    });
  });
