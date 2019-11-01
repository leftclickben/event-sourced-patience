import { Card } from '../../types';
import { asColourFor } from './colours';
import { baseSlot, emptySlot, faceDownCardSlot, suitDisplay, valueDisplay } from './strings';

export const generateCardView = (card: Card | undefined, displayBlanks: boolean = true) =>
  card
    ? (
      card.faceUp
        ? asColourFor[card.suit](`${suitDisplay[card.suit]}${valueDisplay[card.value]}`)
        : asColourFor.faceDown(faceDownCardSlot))
    : (displayBlanks ? emptySlot : baseSlot);
