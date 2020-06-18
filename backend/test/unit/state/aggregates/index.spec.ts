import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import * as loadEventsModule from '../../../../src/events/load';
import { Aggregates } from '../../../../src/state/aggregates/types';
import { buildAggregates } from '../../../../src/state/aggregates';
import { GameEventType } from '../../../../src/events/types';

describe('The aggregates builder', () => {
  describe('When events for a game can be loaded', () => {
    let loadEventsStub: SinonStub;

    beforeEach(() => {
      loadEventsStub = stub(loadEventsModule, 'loadEvents');
    });

    afterEach(() => {
      loadEventsStub.restore();
    });

    describe('When provided an empty list of events', () => {
      let aggregates: Aggregates;

      beforeEach(async () => {
        aggregates = await buildAggregates([]);
      });

      it('Returns a zero aggregate', () => {
        expect(aggregates).to.deep.equal({
          inProgress: {
            games: 0
          },
          forfeited: {
            games: 0,
            score: 0,
            events: 0
          },
          completed: {
            games: 0,
            score: 0,
            events: 0
          }
        });
      });
    });

    describe('When provided an empty list of events and initial aggregates', () => {
      let aggregates: Aggregates;

      beforeEach(async () => {
        aggregates = await buildAggregates([], {
          inProgress: {
            games: 12
          },
          forfeited: {
            games: 42,
            score: 1234,
            events: 234
          },
          completed: {
            games: 1,
            score: 500,
            events: 100
          }
        });
      });

      it('Returns the initial aggregates unmodified', () => {
        expect(aggregates).to.deep.equal({
          inProgress: {
            games: 12
          },
          forfeited: {
            games: 42,
            score: 1234,
            events: 234
          },
          completed: {
            games: 1,
            score: 500,
            events: 100
          }
        });
      });
    });

    describe('When provided a list containing a single game creation event', () => {
      let aggregates: Aggregates;

      beforeEach(async () => {
        aggregates = await buildAggregates([
          {
            eventType: GameEventType.gameCreated,
            gameId: 'test1',
            eventTimestamp: Date.now()
          }
        ]);
      });

      it('Returns an aggregate describing a single in-progress game', () => {
        expect(aggregates).to.deep.equal({
          inProgress: {
            games: 1
          },
          forfeited: {
            games: 0,
            score: 0,
            events: 0
          },
          completed: {
            games: 0,
            score: 0,
            events: 0
          }
        });
      });
    });

    describe('When provided a list containing a single game creation event, with initial aggregates', () => {
      let aggregates: Aggregates;

      beforeEach(async () => {
        aggregates = await buildAggregates(
          [
            {
              eventType: GameEventType.gameCreated,
              gameId: 'test1',
              eventTimestamp: Date.now()
            }
          ],
          {
            inProgress: {
              games: 12
            },
            forfeited: {
              games: 42,
              score: 1234,
              events: 234
            },
            completed: {
              games: 1,
              score: 500,
              events: 100
            }
          });
      });

      it('Returns the initial aggregates plus one additional in-progress game', () => {
        expect(aggregates).to.deep.equal({
          inProgress: {
            games: 13
          },
          forfeited: {
            games: 42,
            score: 1234,
            events: 234
          },
          completed: {
            games: 1,
            score: 500,
            events: 100
          }
        });
      });
    });

    describe('When provided a list containing a single game forfeit event, with initial aggregates', () => {
      let aggregates: Aggregates;

      beforeEach(async () => {
        const forfeitedEvent = {
          eventType: GameEventType.gameForfeited,
          gameId: 'test1',
          eventTimestamp: Date.now()
        };

        loadEventsStub.resolves([forfeitedEvent]);

        aggregates = await buildAggregates(
          [forfeitedEvent],
          {
            inProgress: {
              games: 12
            },
            forfeited: {
              games: 42,
              score: 1234,
              events: 235
            },
            completed: {
              games: 1,
              score: 500,
              events: 100
            }
          });
      });

      it('Returns the initial aggregates plus one game moved from in-progress to forfeited', () => {
        expect(aggregates).to.deep.equal({
          inProgress: {
            games: 11
          },
          forfeited: {
            games: 43,
            score: 1234,
            events: 236
          },
          completed: {
            games: 1,
            score: 500,
            events: 100
          }
        });
      });
    });
  });
});
