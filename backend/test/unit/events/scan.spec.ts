import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import mockedEnv from 'mocked-env';
import { DynamoDB } from 'aws-sdk';
import { GameEvent } from '../../../src/events/types';
import { scanEvents } from '../../../src/events/scan';

describe('Scanning events from the event store', () => {
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
      let scanStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        scanStub = stub().returns({
          promise: stub().resolves({
            Items: [
              'first event',
              'second event',
              'third event'
            ]
          })
        });

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ scan: scanStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked with a single filter value', () => {
        let result: GameEvent[];

        beforeEach(async () => {
          result = await scanEvents('field', ['first value']);
        });

        it('Queries the database once', () => {
          expect(scanStub.calledOnce).to.equal(true);
          expect(scanStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: undefined,
              FilterExpression: '#key0 = :value0',
              ExpressionAttributeNames: {
                '#key0': 'field'
              },
              ExpressionAttributeValues: {
                ':value0': 'first value'
              }
            }
          ]);
        });

        it('Returns the correct results', () => {
          expect(result).to.deep.equal(['first event', 'second event', 'third event']);
        });
      });

      describe('When invoked with multiple filter values', () => {
        let result: GameEvent[];

        beforeEach(async () => {
          result = await scanEvents('field', ['first value', 'second value', 'third value']);
        });

        it('Queries the database once', () => {
          expect(scanStub.calledOnce).to.equal(true);
          expect(scanStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: undefined,
              FilterExpression: '#key0 = :value0 or #key1 = :value1 or #key2 = :value2',
              ExpressionAttributeNames: {
                '#key0': 'field',
                '#key1': 'field',
                '#key2': 'field'
              },
              ExpressionAttributeValues: {
                ':value0': 'first value',
                ':value1': 'second value',
                ':value2': 'third value'
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
      let scanStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        scanStub = stub().returns({
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

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ scan: scanStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked with multiple filter values', () => {
        let result: GameEvent[];

        beforeEach(async () => {
          result = await scanEvents('field', ['first value', 'second value', 'third value']);
        });

        it('Queries the database once per page', () => {
          expect(scanStub.calledThrice).to.equal(true);
          expect(scanStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: undefined,
              FilterExpression: '#key0 = :value0 or #key1 = :value1 or #key2 = :value2',
              ExpressionAttributeNames: {
                '#key0': 'field',
                '#key1': 'field',
                '#key2': 'field'
              },
              ExpressionAttributeValues: {
                ':value0': 'first value',
                ':value1': 'second value',
                ':value2': 'third value'
              }
            }
          ]);
          expect(scanStub.secondCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: 'there-are-more-results',
              FilterExpression: '#key0 = :value0 or #key1 = :value1 or #key2 = :value2',
              ExpressionAttributeNames: {
                '#key0': 'field',
                '#key1': 'field',
                '#key2': 'field'
              },
              ExpressionAttributeValues: {
                ':value0': 'first value',
                ':value1': 'second value',
                ':value2': 'third value'
              }
            }
          ]);
          expect(scanStub.thirdCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: 'still-more-results',
              FilterExpression: '#key0 = :value0 or #key1 = :value1 or #key2 = :value2',
              ExpressionAttributeNames: {
                '#key0': 'field',
                '#key1': 'field',
                '#key2': 'field'
              },
              ExpressionAttributeValues: {
                ':value0': 'first value',
                ':value1': 'second value',
                ':value2': 'third value'
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
      let scanStub: SinonStub;
      let documentClientStub: SinonStub;

      beforeEach(() => {
        scanStub = stub().returns({
          promise: stub().rejects(thrownError)
        });

        documentClientStub = stub(DynamoDB, 'DocumentClient').returns({ scan: scanStub });
      });

      afterEach(() => {
        documentClientStub.restore();
      });

      describe('When invoked with multiple filter values', () => {
        it('Throws the database error', async () => {
          await expect(scanEvents('field', ['first value', 'second value', 'third value']))
            .to.be.eventually.rejectedWith(thrownError);

          expect(scanStub.calledOnce).to.equal(true);
          expect(scanStub.firstCall.args).to.deep.equal([
            {
              TableName: 'events_unit_test',
              ExclusiveStartKey: undefined,
              FilterExpression: '#key0 = :value0 or #key1 = :value1 or #key2 = :value2',
              ExpressionAttributeNames: {
                '#key0': 'field',
                '#key1': 'field',
                '#key2': 'field'
              },
              ExpressionAttributeValues: {
                ':value0': 'first value',
                ':value1': 'second value',
                ':value2': 'third value'
              }
            }
          ]);
        });
      });
    });
  });
});
