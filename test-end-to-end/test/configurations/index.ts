import { GameId, TestConfigurationBuilder } from '../../src/types';
import { newGameToForfeit } from './newGameToForfeit';
import { gameReadyToClaimVictory } from './gameReadyToClaimVictory';
import { newGameToShowHelpAndAttemptVictory } from './newGameToShowHelpAndAttemptVictory';
import { newGameToMakeSomeMoves } from './newGameToMakeSomeMoves';
import { newGamePlayToVictory } from './newGamePlayToVictory';

export const testConfigurations: Record<GameId, TestConfigurationBuilder> = {
  newGameToForfeit,
  gameReadyToClaimVictory,
  newGameToShowHelpAndAttemptVictory,
  newGameToMakeSomeMoves,
  newGamePlayToVictory
};
