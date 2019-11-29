import { spawn } from 'child_process';
import { GameId, OutputTapes, Tape, TestConfiguration } from '../types';
import { writeError, writeHeading, writeNewLine, writeProgress, writeProgressError } from '../ui';
import { TableName } from 'aws-sdk/clients/dynamodb';
import { saveEvents } from '../services/database';

export const prepareGame = async (
  gameId: GameId,
  { getInitialEvents }: TestConfiguration,
  tableName: TableName,
  verbose: boolean
) => {
  writeHeading(`Preparing game "${gameId}"`);
  await saveEvents(tableName, gameId, getInitialEvents(gameId), verbose);
  writeNewLine();
};

export const playGame = async (
  gameId: GameId,
  { inputTape }: TestConfiguration,
  apiBaseUrl: string,
  verbose: boolean
): Promise<OutputTapes> =>
  new Promise((resolve, reject) => {
    writeHeading(`Playing game "${gameId}"`);

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

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        writeProgress(data.toString(), verbose);
        outputTape.push(data.toString());
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data) => {
        writeProgressError(data.toString(), verbose);
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
      writeNewLine();
      resolve({ outputTape, errorTape });
    });

    child.on('error', (error) => {
      writeError('Frontend process failed with error', error);
      reject(error);
      child.kill();
    });
  });
