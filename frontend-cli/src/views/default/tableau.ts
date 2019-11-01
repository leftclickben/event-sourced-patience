import { Card } from '../../types';
import { maxChildLength } from '../../util';
import { margin } from './strings';
import { generateCardView } from './card';

export const generateTableauView = (tableau: Card[][]) =>
  Array.from({ length: maxChildLength(tableau) }, (_, cardIndex) =>
    Array.from({ length: tableau.length }, (__, columnIndex) =>
      generateCardView(tableau[columnIndex][cardIndex], false)).join(margin));
