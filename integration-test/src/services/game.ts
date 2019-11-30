import { spawn } from 'child_process';
import { GameId, GetInitialEventsFunction, OutputTapes, Tape } from '../types';
import { writeNewLine, writeProgress } from '../ui';
import { TableName } from 'aws-sdk/clients/dynamodb';
import { saveEvents } from './database';

export const prepareGame = async (
  gameId: GameId,
  getInitialEvents: GetInitialEventsFunction,
  tableName: TableName,
  verbosity: number
) => {
  await saveEvents(tableName, gameId, getInitialEvents(gameId));
  writeProgress(`Prepared game "${gameId}"`, verbosity);
};

export const playGame = async (
  gameId: GameId,
  inputTape: Tape,
  apiBaseUrl: string,
  verbosity: number
): Promise<OutputTapes> =>
  new Promise((resolve, reject) => {
    const outputTape: Tape = [];
    const errorTape: Tape = [];

    const env = {
      ...process.env,
      API_BASE_URL: apiBaseUrl
    };

    const child = spawn(
      'npm',
      ['run', 'game', '--silent', '--', `--game=${gameId}`],
      { env, cwd: '../frontend-cli', stdio: 'pipe' });

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
