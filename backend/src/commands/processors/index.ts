import { GameplayCommandName } from '../types';
import { dealStockToWaste } from './dealStockToWaste';
import { resetWasteToStock } from './resetWasteToStock';
import { playWasteToTableau } from './playWasteToTableau';
import { playWasteToFoundation } from './playWasteToFoundation';
import { playTableauToFoundation } from './playTableauToFoundation';
import { playTableauToTableau } from './playTableauToTableau';
import { claimVictory } from './claimVictory';

export const getCommandProcessor = (key: GameplayCommandName) => ({
  dealStockToWaste,
  resetWasteToStock,
  playWasteToTableau,
  playWasteToFoundation,
  playTableauToFoundation,
  playTableauToTableau,
  claimVictory
}[key]);
