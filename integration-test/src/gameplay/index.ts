import { movesByGame } from './moves';

export const playGames = async (apiBaseUrl: string): Promise<void> =>
  Object.keys(movesByGame).reduce(
    async (promise, gameId) => {
      await promise;
      console.log(`Playing game "${gameId}" at API base URL "${apiBaseUrl}"`);
    },
    Promise.resolve()
  );
