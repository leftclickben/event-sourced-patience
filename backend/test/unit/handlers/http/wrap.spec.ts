import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import {
  APIGatewayProxyHandlerWithData,
  APIGatewayProxyResultWithData,
  wrapHttpHandler
} from '../../../../src/handlers/http/wrap';

describe('The HTTP handler wrapper utility', () => {
  beforeEach(() => {
    stub(console, 'error');
  });

  afterEach(() => {
    (console.error as SinonStub).restore();
  });

  describe('Given the inner handler returns nothing', () => {
    let innerHandler: APIGatewayProxyHandlerWithData;
    let outerHandler: APIGatewayProxyHandler;

    beforeEach(() => {
      innerHandler = stub().resolves();
      outerHandler = wrapHttpHandler(innerHandler);
    });

    describe('When the resulting function is invoked', () => {
      let event: APIGatewayProxyEvent;
      let context: Context;
      let result: APIGatewayProxyResultWithData | void;

      beforeEach(async () => {
        event = { body: '{"parameter":"value"}' } as APIGatewayProxyEvent;
        context = {} as Context;
        result = await outerHandler(event, context, () => {});
      });

      it('Calls the inner handler with data', () => {
        expect((innerHandler as SinonStub).callCount).to.equal(1);
        expect((innerHandler as SinonStub).firstCall.args[0]).to.deep.equal({
          ...event,
          data: {
            parameter: 'value'
          }
        });
        expect((innerHandler as SinonStub).firstCall.args[1]).to.equal(context);
      });

      it('Does not log any errors', () => {
        expect((console.error as SinonStub).callCount).to.equal(0);
      });

      it('Returns the correct HTTP response', () => {
        expect(result).to.deep.equal({
          statusCode: 204,
          body: ''
        });
      });
    });
  });

  describe('Given the inner handler returns data but no status code', () => {
    let innerHandler: APIGatewayProxyHandlerWithData;
    let outerHandler: APIGatewayProxyHandler;

    beforeEach(() => {
      innerHandler = stub().resolves({
        data: { object: ['nested', 'array'] }
      });
      outerHandler = wrapHttpHandler(innerHandler);
    });

    describe('When the resulting function is invoked', () => {
      let event: APIGatewayProxyEvent;
      let context: Context;
      let result: APIGatewayProxyResultWithData | void;

      beforeEach(async () => {
        event = { body: '{"parameter":"value"}' } as APIGatewayProxyEvent;
        context = {} as Context;
        result = await outerHandler(event, context, () => {});
      });

      it('Calls the inner handler with data', () => {
        expect((innerHandler as SinonStub).callCount).to.equal(1);
        expect((innerHandler as SinonStub).firstCall.args[0]).to.deep.equal({
          ...event,
          data: {
            parameter: 'value'
          }
        });
        expect((innerHandler as SinonStub).firstCall.args[1]).to.equal(context);
      });

      it('Does not log any errors', () => {
        expect((console.error as SinonStub).callCount).to.equal(0);
      });

      it('Returns the correct HTTP response', () => {
        expect(result).to.deep.equal({
          statusCode: 200,
          body: '{"object":["nested","array"]}'
        });
      });
    });
  });

  describe('Given the inner handler returns data and a status code', () => {
    let innerHandler: APIGatewayProxyHandlerWithData;
    let outerHandler: APIGatewayProxyHandler;

    beforeEach(() => {
      innerHandler = stub().resolves({
        data: { object: ['nested', 'array'] },
        statusCode: 201
      });
      outerHandler = wrapHttpHandler(innerHandler);
    });

    describe('When the resulting function is invoked', () => {
      let event: APIGatewayProxyEvent;
      let context: Context;
      let result: APIGatewayProxyResultWithData | void;

      beforeEach(async () => {
        event = { body: '{"parameter":"value"}' } as APIGatewayProxyEvent;
        context = {} as Context;
        result = await outerHandler(event, context, () => {});
      });

      it('Calls the inner handler with data', () => {
        expect((innerHandler as SinonStub).callCount).to.equal(1);
        expect((innerHandler as SinonStub).firstCall.args[0]).to.deep.equal({
          ...event,
          data: {
            parameter: 'value'
          }
        });
        expect((innerHandler as SinonStub).firstCall.args[1]).to.equal(context);
      });

      it('Does not log any errors', () => {
        expect((console.error as SinonStub).callCount).to.equal(0);
      });

      it('Returns the correct HTTP response', () => {
        expect(result).to.deep.equal({
          statusCode: 201,
          body: '{"object":["nested","array"]}'
        });
      });
    });
  });

  describe('Given the inner handler throws an HTTP error', () => {
    let innerHandler: APIGatewayProxyHandlerWithData;
    let outerHandler: APIGatewayProxyHandler;

    beforeEach(() => {
      innerHandler = stub().rejects({
        statusCode: 400,
        message: 'Client request invalid'
      });
      outerHandler = wrapHttpHandler(innerHandler);
    });

    describe('When the resulting function is invoked', () => {
      let event: APIGatewayProxyEvent;
      let context: Context;
      let result: APIGatewayProxyResultWithData | void;

      beforeEach(async () => {
        event = { body: '{"parameter":"value"}' } as APIGatewayProxyEvent;
        context = {} as Context;
        result = await outerHandler(event, context, () => {});
      });

      it('Calls the inner handler with data', () => {
        expect((innerHandler as SinonStub).callCount).to.equal(1);
        expect((innerHandler as SinonStub).firstCall.args[0]).to.deep.equal({
          ...event,
          data: {
            parameter: 'value'
          }
        });
        expect((innerHandler as SinonStub).firstCall.args[1]).to.equal(context);
      });

      it('Logs an error', () => {
        expect((console.error as SinonStub).callCount).to.equal(1);
        expect((console.error as SinonStub).firstCall.args).to.deep.equal([
          'Client request invalid'
        ]);
      });

      it('Returns the correct HTTP error response', () => {
        expect(result).to.deep.equal({
          statusCode: 400,
          body: '{"message":"Client request invalid"}'
        });
      });
    });
  });

  describe('Given the inner handler throws an arbitrary error', () => {
    let thrownError: any;
    let innerHandler: APIGatewayProxyHandlerWithData;
    let outerHandler: APIGatewayProxyHandler;

    beforeEach(() => {
      thrownError = Error('Some error occurred');
      innerHandler = stub().rejects(thrownError);
      outerHandler = wrapHttpHandler(innerHandler);
    });

    describe('When the resulting function is invoked', () => {
      it('Throws the error from the inner handler with data', async () => {
        const event = { body: '{"parameter":"value"}' } as APIGatewayProxyEvent;
        const context = {} as Context;
        await expect(outerHandler(event, context, () => {})).to.be.eventually.rejectedWith(thrownError);
        expect((innerHandler as SinonStub).callCount).to.equal(1);
        expect((innerHandler as SinonStub).firstCall.args[0]).to.deep.equal({
          ...event,
          data: {
            parameter: 'value'
          }
        });
        expect((innerHandler as SinonStub).firstCall.args[1]).to.equal(context);
        expect((console.error as SinonStub).callCount).to.equal(1);
        expect((console.error as SinonStub).firstCall.args).to.deep.equal(['Some error occurred']);
      });
    });
  });
});
