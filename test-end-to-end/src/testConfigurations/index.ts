import { GameId, TestConfigurationBuilder } from '../types';
import { newGameToForfeit } from './newGameToForfeit';
import { gameReadyToClaimVictory } from './gameReadyToClaimVictory';
import { newGameToShowHelpAndAttemptVictory } from './newGameToShowHelpAndAttemptVictory';
import { newGameToMakeSomeMoves } from './newGameToMakeSomeMoves';

export const testConfigurations: Record<GameId, TestConfigurationBuilder> = {
  newGameToForfeit,
  gameReadyToClaimVictory,
  newGameToShowHelpAndAttemptVictory,
  newGameToMakeSomeMoves
};
