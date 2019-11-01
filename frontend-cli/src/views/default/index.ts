import { Game } from '../../types';
import { clearScreen } from '../../strings';
import { applyVerticalBorder, generateBannerBorder, generateBottomBorder } from './borders';
import { generateScoreView } from './score';
import { baseSlot, margin } from './strings';
import { generateFoundationView } from './foundation';
import { generateFooterView } from './footer';
import { generateTableauView } from './tableau';

export const generateGameView = ({ table: { status, tableau, foundation, stock, waste }, score }: Game): string => {
  // Calculate the full width of the game view, taking into account there is no margin after last column.
  const viewWidth = Math.max(tableau.length, foundation.length) * (baseSlot.length + margin.length) - margin.length;
  return [
    clearScreen,
    // Top border and banner.
    ...generateBannerBorder(viewWidth),
    // The main game view, surrounded by a vertical border left and right.
    ...[
      ...generateScoreView(score, status, viewWidth),
      ...generateFoundationView(foundation, tableau.length),
      ...generateTableauView(tableau),
      ...generateFooterView(stock, waste, tableau.length),
    ].map((line) => applyVerticalBorder(line, viewWidth)),
    // Bottom border.
    ...generateBottomBorder(viewWidth)
  ].join('\n');
};
