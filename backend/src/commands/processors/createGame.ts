import { saveEvent } from '../../events/save';
import { createDeck, dealTableau, shuffleDeck } from '../../game';
import { GameCreatedEvent, GameEventType } from '../../events/types';
import { CommandProcessor, CreateGameCommand } from '../types';
import { generateId } from '../../id';

export const createGame: CommandProcessor<CreateGameCommand, GameCreatedEvent> =
  async () => {
    const gameId = generateId();

    const stock = shuffleDeck(createDeck());

    const tableau = dealTableau(stock);

    return await saveEvent<GameEventType.gameCreated, GameCreatedEvent>(
      GameEventType.gameCreated,
      { gameId, tableau, stock });
  };
