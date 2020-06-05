import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import {
  APIGatewayProxyResultWithData,
  checkArguments,
  checkEnvironment,
  checkResultArray,
  wrapHttpHandler
} from '../../../../src/handlers/http/helpers';
import mockedEnv from 'mocked-env';

describe('Helper functions', () => {
  describe('The HTTP handler wrapper helper', () => {
    let consoleErrorStub: SinonStub;

    beforeEach(() => {
      consoleErrorStub = stub(console, 'error');
    });

    afterEach(() => {
      consoleErrorStub.restore();
    });

    describe('Given the inner handler returns nothing', () => {
      let innerHandler: SinonStub;
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
          result = await outerHandler(event, context, undefined as any);
        });

        it('Calls the inner handler with data', () => {
          expect(innerHandler.callCount).to.equal(1);
          expect(innerHandler.firstCall.args[0]).to.deep.equal({
            ...event,
            data: {
              parameter: 'value'
            }
          });
          expect(innerHandler.firstCall.args[1]).to.equal(context);
        });

        it('Does not log any errors', () => {
          expect(consoleErrorStub.callCount).to.equal(0);
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
      let innerHandler: SinonStub;
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
          result = await outerHandler(event, context, undefined as any);
        });

        it('Calls the inner handler with data', () => {
          expect(innerHandler.callCount).to.equal(1);
          expect(innerHandler.firstCall.args[0]).to.deep.equal({
            ...event,
            data: {
              parameter: 'value'
            }
          });
          expect(innerHandler.firstCall.args[1]).to.equal(context);
        });

        it('Does not log any errors', () => {
          expect(consoleErrorStub.callCount).to.equal(0);
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
      let innerHandler: SinonStub;
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
          result = await outerHandler(event, context, undefined as any);
        });

        it('Calls the inner handler with data', () => {
          expect(innerHandler.callCount).to.equal(1);
          expect(innerHandler.firstCall.args[0]).to.deep.equal({
            ...event,
            data: {
              parameter: 'value'
            }
          });
          expect(innerHandler.firstCall.args[1]).to.equal(context);
        });

        it('Does not log any errors', () => {
          expect(consoleErrorStub.callCount).to.equal(0);
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
      let innerHandler: SinonStub;
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
          result = await outerHandler(event, context, undefined as any);
        });

        it('Calls the inner handler with data', () => {
          expect(innerHandler.callCount).to.equal(1);
          expect(innerHandler.firstCall.args[0]).to.deep.equal({
            ...event,
            data: {
              parameter: 'value'
            }
          });
          expect(innerHandler.firstCall.args[1]).to.equal(context);
        });

        it('Logs an error', () => {
          expect(consoleErrorStub.callCount).to.equal(1);
          expect(consoleErrorStub.firstCall.args).to.deep.equal([
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
      let innerHandler: SinonStub;
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
          await expect(outerHandler(event, context, undefined as any)).to.be.eventually.rejectedWith(thrownError);
          expect(innerHandler.callCount).to.equal(1);
          expect(innerHandler.firstCall.args[0]).to.deep.equal({
            ...event,
            data: {
              parameter: 'value'
            }
          });
          expect(innerHandler.firstCall.args[1]).to.equal(context);
          expect(consoleErrorStub.callCount).to.equal(1);
          expect(consoleErrorStub.firstCall.args).to.deep.equal(['Some error occurred']);
        });
      });
    });
  });

  describe('The environment variable checker', () => {
    describe('When some environment variables are configured', () => {
      let restoreEnv: () => void;

      beforeEach(() => {
        restoreEnv = mockedEnv({
          ALPHA: 'foo',
          BRAVO: 'xyzzy'
        });
      });

      afterEach(() => {
        restoreEnv();
      });

      describe('With no custom message', () => {
        describe('When all required variables are present', () => {
          it('Passes', () => {
            expect(() => checkEnvironment(['ALPHA'])).not.to.throw();
            expect(() => checkEnvironment(['BRAVO'])).not.to.throw();
            expect(() => checkEnvironment(['ALPHA', 'BRAVO'])).not.to.throw();
          });
        });

        describe('When a required variable is missing', () => {
          it('Throws an error mentioning the missing variable', () => {
            expect(() => checkEnvironment(['CHARLIE']))
              .to.throw('Required environment variable "CHARLIE" missing, check your configuration');
            expect(() => checkEnvironment(['ALPHA', 'CHARLIE']))
              .to.throw('Required environment variable "CHARLIE" missing, check your configuration');
          });
        });

        describe('When multiple required variables are missing', () => {
          it('Throws an error mentioning the first missing variable', () => {
            expect(() => checkEnvironment(['CHARLIE', 'ZULU'])).to.throw(
              'Required environment variable "CHARLIE" missing, check your configuration');
            expect(() => checkEnvironment(['ZULU', 'CHARLIE'])).to.throw(
              'Required environment variable "ZULU" missing, check your configuration');
          });
        });
      });

      describe('With a custom message', () => {
        describe('When all required variables are present', () => {
          it('Passes', () => {
            expect(() => checkEnvironment(['ALPHA'], 'Custom error message'))
              .not.to.throw();
            expect(() => checkEnvironment(['BRAVO'], 'Custom error message'))
              .not.to.throw();
            expect(() => checkEnvironment(['ALPHA', 'BRAVO'], 'Custom error message'))
              .not.to.throw();
          });
        });

        describe('When a required variable is missing', () => {
          it('Throws an error with the custom message', () => {
            expect(() => checkEnvironment(['CHARLIE'], 'Custom error message'))
              .to.throw('Custom error message');
            expect(() => checkEnvironment(['ALPHA', 'CHARLIE'], 'Custom error message'))
              .to.throw('Custom error message');
          });
        });

        describe('When multiple required variables are missing', () => {
          it('Throws an error with the custom message', () => {
            expect(() => checkEnvironment(['CHARLIE', 'ZULU'], 'Custom error message'))
              .to.throw('Custom error message');
            expect(() => checkEnvironment(['ZULU', 'CHARLIE'], 'Custom error message'))
              .to.throw('Custom error message');
          });
        });
      });
    });
  });

  describe('The argument checker', () => {
    describe('With no custom message', () => {
      describe('When all arguments have a truthy value', () => {
        it('Passes', () => {
          expect(() => checkArguments({})).not.to.throw();
          expect(() => checkArguments({ foo: 'bar' })).not.to.throw();
          expect(() => checkArguments({ foo: 'bar', xyzzy: 42 })).not.to.throw();
        });
      });

      describe('When one argument has a falsy value', () => {
        it('Throws an exception mentioning the missing argument', () => {
          expect(() => checkArguments({ foo: 'bar', xyzzy: undefined }))
            .to.throw('Required parameter "xyzzy" missing');
          expect(() => checkArguments({ foo: 'bar', xyzzy: '' }))
            .to.throw('Required parameter "xyzzy" missing');
          expect(() => checkArguments({ foo: null, xyzzy: 42 }))
            .to.throw('Required parameter "foo" missing');
        });
      });

      describe('When multiple arguments have a falsy value', () => {
        it('Throws an exception mentioning the first missing argument', () => {
          expect(() => checkArguments({ foo: undefined, xyzzy: undefined }))
            .to.throw('Required parameter "foo" missing');
          expect(() => checkArguments({ foo: null, xyzzy: '' }))
            .to.throw('Required parameter "foo" missing');
        });
      });
    });

    describe('With a custom message', () => {
      describe('When all arguments have a truthy value', () => {
        it('Passes', () => {
          expect(() => checkArguments({}, 'Custom error message'))
            .not.to.throw();
          expect(() => checkArguments({ foo: 'bar' }, 'Custom error message'))
            .not.to.throw();
          expect(() => checkArguments({ foo: 'bar', xyzzy: 42 }, 'Custom error message'))
            .not.to.throw();
        });
      });

      describe('When one argument has a falsy value', () => {
        it('Throws an exception mentioning the missing argument', () => {
          expect(() => checkArguments({ foo: 'bar', xyzzy: undefined }, 'Custom error message'))
            .to.throw('Custom error message');
          expect(() => checkArguments({ foo: 'bar', xyzzy: '' }, 'Custom error message'))
            .to.throw('Custom error message');
          expect(() => checkArguments({ foo: null, xyzzy: 42 }, 'Custom error message'))
            .to.throw('Custom error message');
        });
      });

      describe('When multiple arguments have a falsy value', () => {
        it('Throws an exception mentioning the first missing argument', () => {
          expect(() => checkArguments({ foo: undefined, xyzzy: undefined }, 'Custom error message'))
            .to.throw('Custom error message');
          expect(() => checkArguments({ foo: null, xyzzy: '' }, 'Custom error message'))
            .to.throw('Custom error message');
        });
      });
    });
  });

  describe('The result array checker', () => {
    describe('Without a custom error message', () => {
      describe('With a non-empty empty array', () => {
        it('Passes', () => {
          expect(() => checkResultArray(['a'])).not.to.throw();
          expect(() => checkResultArray(['a', 'b', 'c'])).not.to.throw();
        });
      });

      describe('With an empty array', () => {
        it('Throws an error', () => {
          expect(() => checkResultArray([])).to.throw('Result not found');
        });
      });
    });

    describe('With a custom error message', () => {
      describe('With a non-empty empty array', () => {
        it('Passes', () => {
          expect(() => checkResultArray(['a'], 'Custom error message')).not.to.throw();
          expect(() => checkResultArray(['a', 'b', 'c'], 'Custom error message')).not.to.throw();
        });
      });

      describe('With an empty array', () => {
        it('Throws an error', () => {
          expect(() => checkResultArray([], 'Custom error message'))
            .to.throw('Custom error message');
        });
      });
    });
  });
});
