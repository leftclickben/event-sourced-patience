import * as rp from 'request-promise';
import { Game, GameId, GameplayCommandName } from '../types';

const json = true;

export const createGame = async (): Promise<Game> => {
  const url = `${process.env.API_BASE_URL}/game`;
  if (process.env.API_VERBOSE) {
    console.debug(`HTTP POST ${url}`);
  }
  const response = await rp.post(url, { json });
  if (process.env.API_VERBOSE) {
    console.debug(`Response from HTTP POST: ${JSON.stringify(response, null, 2)}`);
  }
  return response;
};

export const loadGame = async (gameId: GameId): Promise<Game> => {
  const url = `${process.env.API_BASE_URL}/game/${gameId}`;
  if (process.env.API_VERBOSE) {
    console.debug(`HTTP GET ${ url }`);
  }
  const response = await rp.get(url, { json });
  if (process.env.API_VERBOSE) {
    console.debug(`Response from HTTP GET: ${JSON.stringify(response, null, 2)}`);
  }
  return response;
};

export const playGame = async (
  gameId: GameId,
  moveType: GameplayCommandName,
  body?: Record<string, string>
): Promise<Game> => {
  const url = `${ process.env.API_BASE_URL }/game/${ gameId }/${ moveType }`;
  if (process.env.API_VERBOSE) {
    console.debug(`HTTP PATCH ${ url } ${ JSON.stringify(body) }`);
  }
  const response = await rp.patch(url, { json, body });
  if (process.env.API_VERBOSE) {
    console.debug(`Response from HTTP PATCH: ${JSON.stringify(response, null, 2)}`);
  }
  return response;
};

export const forfeitGame = async (gameId: GameId): Promise<void> => {
  const url = `${process.env.API_BASE_URL}/game/${gameId}`;
  if (process.env.API_VERBOSE) {
    console.debug(`HTTP DELETE ${ url }`);
  }
  await rp.delete(url);
};
