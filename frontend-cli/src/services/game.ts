import { promisify } from 'util';
import { exists, readFile, unlink, writeFile } from 'fs';
import { createGame, loadGame } from './api';
import { homedir } from 'os';

const gameIdFile = `${homedir()}/.patience-cli`;

export const loadCurrentGame = async (overrideGameId?: string, newGame: boolean = false) => {
  if (overrideGameId) {
    return await loadGame(overrideGameId);
  }

  const gameIdFileExists = await promisify(exists)(gameIdFile);

  if (!gameIdFileExists || newGame) {
    const game = await createGame();
    await promisify(writeFile)(gameIdFile, game.gameId);
    console.log(`Created game ${ game.gameId } and saved ID to ${ gameIdFile }`);
    return game;
  }

  const gameId = await promisify(readFile)(gameIdFile, 'utf-8');
  console.log(`Continuing game ${ gameId }`);
  return await loadGame(gameId);
};

export const removeGameFile = async () => {
  await promisify(unlink)(gameIdFile);
};
