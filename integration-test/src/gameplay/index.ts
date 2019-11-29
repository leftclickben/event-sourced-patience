import { GameData, GameId, OutputTapes, Tape } from '../types';
import { spawn } from 'child_process';

export const playGame = async (
  gameId: GameId,
  { inputTape }: GameData,
  apiBaseUrl: string,
  verbose: boolean
): Promise<OutputTapes> =>
  new Promise((resolve, reject) => {
    const outputTape: Tape = [];
    const errorTape: Tape = [];

    const env = {
      ...process.env,
      ...(verbose ? { API_VERBOSE: '1' } : {}),
      API_BASE_URL: apiBaseUrl
    };

    const child = spawn(
      'npm',
      ['run', 'game', '--silent', '--', `--game=${gameId}`],
      { env, cwd: '../frontend-cli', stdio: 'pipe' });

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        if (verbose) {
          console.info(`*** stdout data ***\n${data}`);
        } else {
          process.stdout.write('.');
        }
        outputTape.push(data.toString());
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data) => {
        if (verbose) {
          console.info(`*** stderr data ***\n${data}`);
        } else {
          process.stdout.write('X');
        }
        errorTape.push(data.toString());
      });
    }

    if (child.stdin) {
      // The additional empty string ensures the final command is actually issued.
      child.stdin.write([...inputTape, ''].join('\n'), (error) => {
        if (error) {
          child.kill();
          reject(error);
        }
      });
    }

    child.on('close', () => {
      console.info('');
      resolve({ outputTape, errorTape });
    });

    child.on('error', (error) => {
      console.error(`Frontend process failed with error: ${error}`);
      reject(error);
      child.kill();
    });
  });
