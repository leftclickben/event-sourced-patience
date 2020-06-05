import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { constants } from 'http2';
import { BadRequest, InternalServerError, NotFound } from 'http-errors';

export interface APIGatewayProxyEventWithData extends Partial<APIGatewayProxyEvent> {
  data?: object;
}

export interface APIGatewayProxyResultWithData extends Partial<APIGatewayProxyResult> {
  data?: object;
}

export type APIGatewayProxyHandlerWithData =
  Handler<APIGatewayProxyEventWithData, APIGatewayProxyResultWithData | void>;

export const wrapHttpHandler =
  (handler: APIGatewayProxyHandlerWithData): APIGatewayProxyHandler =>
    async (event, context) => {
      try {
        const wrappedEvent = {
          ...event,
          data: event.body ? JSON.parse(event.body) : undefined
        };

        const { data, ...result } = await handler(wrappedEvent, context, () => undefined) || {};

        result.body = data ? JSON.stringify(data) : '';
        result.statusCode = result.statusCode || (data ? constants.HTTP_STATUS_OK : constants.HTTP_STATUS_NO_CONTENT);

        return result as APIGatewayProxyResult;
      } catch (e) {
        console.error(e.message ? e.message : JSON.stringify(e));

        if (!e.statusCode || !e.message) {
          // Let API Gateway return a 500
          throw e;
        }

        return {
          statusCode: e.statusCode,
          body: JSON.stringify({ message: e.message })
        };
      }
    };

export const checkEnvironment = (requiredVariables: string[], message?: string) => {
  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new InternalServerError(message || `Required environment variable "${variable}" missing, check your configuration`);
    }
  });
};

export const checkArguments = (args: Record<string, any>, message?: string) => {
  Object.keys(args).forEach((key) => {
    if (!args.hasOwnProperty(key) || [undefined, null, ''].indexOf(args[key]) >= 0) {
      throw new BadRequest(message || `Required parameter "${key}" missing`);
    }
  });
};

export const checkResultArray = (result: any, message?: string) => {
  if (!result || !result.length) {
    throw new NotFound(message || 'Result not found');
  }
};
