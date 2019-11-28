import { CommandLine, GameId } from '../types';

export const movesByGame: Record<GameId, CommandLine[]> = {
  // Just forfeit this one
  c000000000000000000000000: [
    'f'
  ]
};
