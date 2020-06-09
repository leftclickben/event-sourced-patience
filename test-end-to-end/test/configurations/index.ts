import { GameId, TestConfigurationBuilder } from '../../src/types';
import { newGameToForfeit } from './newGameToForfeit';
import { gameReadyToClaimVictory } from './gameReadyToClaimVictory';
import { newGameToMakeSomeMoves } from './newGameToMakeSomeMoves';
import { newGamePlayToVictory } from './newGamePlayToVictory';
import { newGameForInvalidCommandsAndHelp } from './newGameForInvalidCommandsAndHelp';
import { newGamePlayToVictoryClaimedEarly } from './newGamePlayToVictoryClaimedEarly';

export const testConfigurations: Record<GameId, TestConfigurationBuilder> = {
  newGameToForfeit,
  gameReadyToClaimVictory,
  newGameToMakeSomeMoves,
  newGamePlayToVictory,
  newGamePlayToVictoryClaimedEarly,
  newGameForInvalidCommandsAndHelp
};
