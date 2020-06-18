import { Aggregates } from './types';
import { GameCreatedEvent, GameEvent, GameEventType } from '../../events/types';
import { buildStateFromEvents } from '../util';
import { StateBuilder } from '../types';
import { loadEvents } from '../../events/load';
import { buildScoreState } from '../score';
import { GameStatus } from '../../game/types';

const createBlankAggregates = () => ({
  [GameStatus.inProgress]: { games: 0 },
  [GameStatus.forfeited]: { games: 0, score: 0, events: 0 },
  [GameStatus.completed]: { games: 0, score: 0, events: 0 }
})

const recordGameResult = async (gameId: string, aggregates: Aggregates): Promise<Aggregates> => {
  const gameEvents = await loadEvents(gameId);
  const scoreState = buildScoreState(gameEvents);
  const status = scoreState.status as GameStatus.completed | GameStatus.forfeited;
  --aggregates[GameStatus.inProgress].games;
  ++aggregates[status].games;
  aggregates[status].score += scoreState.score;
  aggregates[status].events += gameEvents.length;
  return aggregates;
}

export const buildAggregates = (events: GameEvent[], initialAggregates?: Aggregates) =>
  buildStateFromEvents<Promise<Aggregates>>(
    Promise.resolve(initialAggregates || createBlankAggregates()),
    { gameCreated, gameForfeited, victoryClaimed } as Record<GameEventType, StateBuilder<Promise<Aggregates>>>,
    events);

const gameCreated: StateBuilder<Promise<Aggregates>, GameCreatedEvent> = async (promise) => {
  const aggregates = await promise;
  ++aggregates[GameStatus.inProgress].games;
  return aggregates;
};

const gameForfeited: StateBuilder<Promise<Aggregates>, GameCreatedEvent> = async (promise, { gameId }) => {
  const aggregates = await promise;
  return await recordGameResult(gameId, aggregates);
};

const victoryClaimed: StateBuilder<Promise<Aggregates>, GameCreatedEvent> = async (promise, { gameId }) => {
  const aggregates = await promise;
  return await recordGameResult(gameId, aggregates);
};
