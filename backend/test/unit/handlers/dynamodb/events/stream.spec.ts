import { SinonStub, stub } from 'sinon';
import { expect } from 'chai';
import * as aggregatesModule from '../../../../../src/state/aggregates';
import * as aggregatesPersistenceModule from '../../../../../src/state/aggregates/persistence';
import { handler } from '../../../../../src/handlers/dynamodb/events/stream';
import { Context } from 'aws-lambda';

describe('The DynamoDB events table stream handler', () => {
  const event = { Records: [{ dynamodb: { NewImage: { id: { S: 'first record' } } } }] };

  describe('Given aggregates can be loaded and saved', () => {
    let loadAggregatesStub: SinonStub;
    let saveAggregatesStub: SinonStub;

    beforeEach(() => {
      loadAggregatesStub = stub(aggregatesPersistenceModule, 'loadAggregates').resolves('original aggregates' as any);
      saveAggregatesStub = stub(aggregatesPersistenceModule, 'saveAggregates').resolves();
    });

    afterEach(() => {
      loadAggregatesStub.restore();
      saveAggregatesStub.restore();
    });

    describe('Given aggregates can be built', () => {
      let buildAggregatesStub: SinonStub;

      beforeEach(() => {
        buildAggregatesStub = stub(aggregatesModule, 'buildAggregates').returns('new aggregates' as any);
      });

      afterEach(() => {
        buildAggregatesStub.restore();
      });

      describe('When invoked', () => {
        beforeEach(async () => {
          await handler(
            event,
            {} as Context,
            undefined as any);
        });

        it('Loads current aggregates', () => {
          expect(loadAggregatesStub.callCount).to.equal(1);
        });

        it('Builds the new aggregates', () => {
          expect(buildAggregatesStub.callCount).to.equal(1);
          expect(buildAggregatesStub.firstCall.args).to.deep.equal([
            [{ id: 'first record' }],
            'original aggregates'
          ]);
        });

        it('Saves the aggregates', () => {
          expect(saveAggregatesStub.callCount).to.equal(1);
          expect(saveAggregatesStub.firstCall.args).to.deep.equal(['new aggregates']);
        });
      });
    });

    describe('Given building aggregates generates an error', () => {
      let buildAggregatesStub: SinonStub;
      const buildAggregatesError = Error('Could not build aggregates');

      beforeEach(() => {
        buildAggregatesStub = stub(aggregatesModule, 'buildAggregates').throws(buildAggregatesError);
      });

      afterEach(() => {
        buildAggregatesStub.restore();
      });

      describe('When invoked', () => {
        it('Throws an error', async () => {
          await expect(handler(event, {} as Context, undefined as any))
            .to.be.eventually.rejectedWith(buildAggregatesError);

          expect(loadAggregatesStub.callCount).to.equal(1);

          expect(buildAggregatesStub.callCount).to.equal(1);
          expect(buildAggregatesStub.firstCall.args).to.deep.equal([
            [{ id: 'first record' }],
            'original aggregates'
          ]);
        });
      });
    });
  });

  describe('When loading aggregates generates an error', () => {
    let loadAggregatesStub: SinonStub;
    let saveAggregatesStub: SinonStub;
    const loadError = Error('Could not load aggregates');

    beforeEach(() => {
      loadAggregatesStub = stub(aggregatesPersistenceModule, 'loadAggregates').rejects(loadError);
      saveAggregatesStub = stub(aggregatesPersistenceModule, 'saveAggregates').resolves();
    });

    afterEach(() => {
      loadAggregatesStub.restore();
      saveAggregatesStub.restore();
    });

    it('Throws an error loading the aggregates', async () => {
      await expect(handler(event, {} as Context, undefined as any))
        .to.be.eventually.rejectedWith(loadError);

      expect(loadAggregatesStub.callCount).to.equal(1);
    });
  });

  describe('When loading aggregates is successful, but saving aggregates generates an error', () => {
    let loadAggregatesStub: SinonStub;
    let saveAggregatesStub: SinonStub;
    let buildAggregatesStub: SinonStub;
    const saveError = Error('Could not save aggregates');

    beforeEach(() => {
      loadAggregatesStub = stub(aggregatesPersistenceModule, 'loadAggregates').resolves('original aggregates' as any);
      saveAggregatesStub = stub(aggregatesPersistenceModule, 'saveAggregates').rejects(saveError);
      buildAggregatesStub = stub(aggregatesModule, 'buildAggregates').resolves('new aggregates' as any);
    });

    afterEach(() => {
      loadAggregatesStub.restore();
      saveAggregatesStub.restore();
      buildAggregatesStub.restore();
    });

    it('Loads and builds the aggregates, then fails saving the aggregates', async () => {
      await expect(handler(event, {} as Context, undefined as any))
        .to.be.eventually.rejectedWith(saveError);

      expect(loadAggregatesStub.callCount).to.equal(1);

      expect(buildAggregatesStub.callCount).to.equal(1);
      expect(buildAggregatesStub.firstCall.args).to.deep.equal([
        [{ id: 'first record' }],
        'original aggregates'
      ]);

      expect(saveAggregatesStub.callCount).to.equal(1);
      expect(saveAggregatesStub.firstCall.args).to.deep.equal(['new aggregates']);
    });
  });
});
