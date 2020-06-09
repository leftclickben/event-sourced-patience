import { GameEvent, GameEventType } from '../events/types';
import { BadRequest, NotFound } from 'http-errors';
import { Card, Value } from '../game/types';
import { nextLowestValue, suitColour } from '../game';

export const validateParameters = (parameters: Record<string, any>) => {
  const missingKeys = Object.keys(parameters).filter((key) => [undefined, null, ''].indexOf(parameters[key]) >= 0);
  if (missingKeys.length > 0) {
    throw new BadRequest(`Required parameters missing: "${missingKeys.join('", "')}"`);
  }
};

export const validateGameExists = (events: GameEvent[]) => {
  if (!events || !events.length) {
    throw new NotFound('Command validation failed: Game does not exist');
  }
};

const gameFinishedEventTypes = [GameEventType.gameForfeited, GameEventType.victoryClaimed];

export const validateGameNotFinished = (events: GameEvent[]) => {
  if (events.some(({ eventType }) => gameFinishedEventTypes.indexOf(eventType) >= 0)) {
    throw new BadRequest('Command validation failed: Game is already forfeited');
  }
};

export const validateEmpty = <T>(array: T[], label: string) => {
  if (array.length > 0) {
    throw new BadRequest(`Command validation failed: "${label}" is not empty`);
  }
};

export const validateNonEmpty = <T>(array: T[], label: string) => {
  if (array.length === 0) {
    throw new BadRequest(`Command validation failed: "${label}" is empty`);
  }
};

export const validateCompatibleWithFoundation = (movingCard: Card, destinationCard: Card | undefined) => {
  if (destinationCard) {
    if (movingCard.suit !== destinationCard.suit) {
      throw new BadRequest('Command validation failed: Suits must match when playing to a non-empty foundation');
    }
    if (nextLowestValue[movingCard.value] !== destinationCard.value) {
      throw new BadRequest('Command validation failed: Value must ascend when playing to a non-empty foundation');
    }
  } else if (movingCard.value !== Value.ace) {
    throw new BadRequest('Command validation failed: Only Aces can be played to an empty foundation');
  }
};

export const validateCompatibleWithTableau = (movingCard: Card, destinationCard: Card | undefined) => {
  if (destinationCard) {
    if (suitColour[movingCard.suit] === suitColour[destinationCard.suit]) {
      throw new BadRequest('Command validation failed: Card colour must alternate when building tableau columns');
    }
    if (nextLowestValue[destinationCard.value] !== movingCard.value) {
      throw new BadRequest('Command validation failed: Cards must decrease in value when building tableau columns');
    }
  } else if (movingCard.value !== Value.king) {
    throw new BadRequest('Command validation failed: Only Kings can be moved to an empty tableau slot');
  }
};

export const validateLength = (column: Card[], count: number, label: string) => {
  if (column.length < count) {
    throw new BadRequest(`Command validation failed: Insufficient cards in ${label}`);
  }
};

export const validateAllFaceUp = (cards: Card[], label: string) => {
  if (cards.some(({ faceUp }) => !faceUp)) {
    throw new BadRequest(`Command validation failed: All cards in ${label} must be face up`);
  }
};
