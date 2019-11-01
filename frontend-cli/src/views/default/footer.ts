import { Card } from '../../types';
import { top } from '../../util';
import { margin } from './strings';
import { generateCardView } from './card';

export const generateFooterView = (stock: Card[], waste: Card[], tableauColumns: number) => [
  '',
  [
    ...Array.from({ length: tableauColumns - 2 }, () => generateCardView(undefined, false)),
    generateCardView(top(waste)),
    generateCardView(top(stock))
  ].join(margin),
  ''
];
