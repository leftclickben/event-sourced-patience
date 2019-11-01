import { GameEvent, GameEventType } from '../events/types';
import { StateBuilder } from './types';

export const SIZE_TABLEAU = 7;

// For each event, call the builder function with the name equal to the event type, if there is such a function.
// Each builder function returns the modified state; this is carried to the next event.  They may also modify the
// incoming state object; this should be ignored.
export const buildStateFromEvents = <TState>(
  initialState: TState,
  builders: Partial<Record<GameEventType, StateBuilder<TState>>>,
  events: GameEvent[]
): TState =>
  events.reduce(
    (state, event) => (builders[event.eventType] || ((state) => state))(state, event),
    initialState);
