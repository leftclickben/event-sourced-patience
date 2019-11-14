import * as cuid from 'cuid';
import { saveEvent } from '../../events';
import { createDeck, dealTableau, shuffleDeck } from '../../game';
import { GameCreatedEvent, GameEventType } from '../../events/types';
import { CommandProcessor, CreateGameCommand } from '../types';

export const createGame: CommandProcessor<CreateGameCommand, GameCreatedEvent> =
  async () => {
    const gameId = cuid();

    const stock = shuffleDeck(createDeck());

    const tableau = dealTableau(stock);

    return await saveEvent<GameEventType.gameCreated, GameCreatedEvent>(
      GameEventType.gameCreated,
      { gameId, tableau, stock });
  };
