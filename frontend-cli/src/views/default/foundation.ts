import { Card } from '../../types';
import { top } from '../../util';
import { baseSlot, margin } from './strings';
import { generateCardView } from './card';

export const generateFoundationView = (foundation: Card[][], tableauColumns: number) => [
  '',
  [
    ...Array.from(
      { length: tableauColumns - foundation.length },
      () => baseSlot
    ),
    ...foundation.map(top).map((card) => generateCardView(card))
  ].join(margin),
  ''
];
