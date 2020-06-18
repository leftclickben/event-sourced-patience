import { SinonStub, stub } from 'sinon';
import mockedEnv from 'mocked-env';
import { expect } from 'chai';
import * as aggregatesPersistenceModule from '../../../../../src/state/aggregates/persistence';
import { getAggregatesHandler } from '../../../../../src/handlers/http/aggregates/get';
import { Context } from 'aws-lambda';
import { APIGatewayProxyResultWithData } from '../../../../../src/handlers/http/helpers';

describe('The HTTP GET /aggregates handler', () => {
  describe('Given the environment is correctly configured', () => {
    let restoreEnv: () => void;

    beforeEach(() => {
      restoreEnv = mockedEnv({
        BUCKET_AGGREGATES: 'aggregates'
      });
    });

    afterEach(() => {
      restoreEnv();
    });

    describe('Given the aggregates can be loaded', () => {
      let loadAggregatesStub: SinonStub;

      beforeEach(() => {
        loadAggregatesStub = stub(aggregatesPersistenceModule, 'loadAggregates').resolves('aggregates data' as any);
      });

      afterEach(() => {
        loadAggregatesStub.restore();
      });

      describe('When invoked', () => {
        let result: APIGatewayProxyResultWithData | void;

        beforeEach(async () => {
          result = await getAggregatesHandler({} as any, {} as Context, undefined as any);
        });

        it('Returns the aggregates', () => {
          expect(result).to.deep.equal({ data: 'aggregates data' });
        });
      });
    });

    describe('Given loading aggregates causes an error', () => {
      let loadAggregatesStub: SinonStub;
      const loadError = Error('Could not load aggregates');

      beforeEach(() => {
        loadAggregatesStub = stub(aggregatesPersistenceModule, 'loadAggregates').rejects(loadError);
      });

      afterEach(() => {
        loadAggregatesStub.restore();
      });

      describe('When invoked', () => {
        it('Returns the aggregates', async () => {
          await expect(getAggregatesHandler({} as any, {} as Context, undefined as any))
            .to.be.eventually.rejectedWith(loadError);
        });
      });
    });
  });
});
