import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import mockedEnv from 'mocked-env';
import { DynamoDB } from 'aws-sdk';
import { GameEvent } from '../../../src/events/types';
import { loadEvents } from '../../../src/events/load';

describe('Loading events from the event store', () => {
  describe('Given the environment is correctly configured', () => {
    let restoreEnv: () => void;

    beforeEach(() => {
      restoreEnv = mockedEnv({
        DB_TABLE_EVENTS: 'events_unit_test'
      });
    });

    afterEach(() => {
      restoreEnv();
    });

    describe('Given the event store is returning a single page of results', () => {
      let queryStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        queryStub = stub().returns({
          promise: stub().resolves({
            Items: [
              'first event',
              'second event',
              'third event'
            ]
          })
        });

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ query: queryStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked', () => {
        let result: GameEvent[];

        beforeEach(async () => {
          result = await loadEvents('game-42');
        });

        it('Queries the database once', () => {
          expect(queryStub.calledOnce).to.equal(true);
          expect(queryStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: undefined,
              KeyConditionExpression: '#key = :key',
              ExpressionAttributeNames: {
                '#key': 'gameId'
              },
              ExpressionAttributeValues: {
                ':key': 'game-42'
              }
            }
          ]);
        });

        it('Returns the correct results', () => {
          expect(result).to.deep.equal(['first event', 'second event', 'third event']);
        });
      });
    });

    describe('Given the event store is returning multiple pages of results', () => {
      let queryStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        queryStub = stub().returns({
          promise: stub()
            .onFirstCall().resolves({
              Items: [
                'first event',
                'second event',
                'third event'
              ],
              LastEvaluatedKey: 'there-are-more-results'
            })
            .onSecondCall().resolves({
              Items: [
                'fourth event',
                'fifth event',
                'sixth event'
              ],
              LastEvaluatedKey: 'still-more-results'
            })
            .onThirdCall().resolves({
              Items: [
                'final event'
              ]
            })
        });

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ query: queryStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked', () => {
        let result: GameEvent[];

        beforeEach(async () => {
          result = await loadEvents('game-42');
        });

        it('Queries the database once per page', () => {
          expect(queryStub.calledThrice).to.equal(true);
          expect(queryStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: undefined,
              KeyConditionExpression: '#key = :key',
              ExpressionAttributeNames: {
                '#key': 'gameId'
              },
              ExpressionAttributeValues: {
                ':key': 'game-42'
              }
            }
          ]);
          expect(queryStub.secondCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: 'there-are-more-results',
              KeyConditionExpression: '#key = :key',
              ExpressionAttributeNames: {
                '#key': 'gameId'
              },
              ExpressionAttributeValues: {
                ':key': 'game-42'
              }
            }
          ]);
          expect(queryStub.thirdCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: 'still-more-results',
              KeyConditionExpression: '#key = :key',
              ExpressionAttributeNames: {
                '#key': 'gameId'
              },
              ExpressionAttributeValues: {
                ':key': 'game-42'
              }
            }
          ]);
        });

        it('Returns the correct results', () => {
          expect(result).to.deep.equal([
            'first event', 'second event', 'third event', 'fourth event', 'fifth event', 'sixth event', 'final event'
          ]);
        });
      });
    });

    describe('Given the event store is causing errors', () => {
      const thrownError = Error('Database failure code 666');
      let queryStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        queryStub = stub().returns({
          promise: stub().rejects(thrownError)
        });

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ query: queryStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked', () => {
        it('Throws the database error', async () => {
          await expect(loadEvents('game-42'))
            .to.be.eventually.rejectedWith(thrownError);

          expect(queryStub.calledOnce).to.equal(true);
          expect(queryStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: undefined,
              KeyConditionExpression: '#key = :key',
              ExpressionAttributeNames: {
                '#key': 'gameId'
              },
              ExpressionAttributeValues: {
                ':key': 'game-42'
              }
            }
          ]);
        });
      });
    });
  });
});
