import { GameEvent } from '../events/types';

export type StateBuilder<TState, TEvent = GameEvent> = (state: TState, event: TEvent) => TState;
