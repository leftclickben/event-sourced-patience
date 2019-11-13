import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { constants } from 'http2';

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

        const { data, ...result } = await handler(wrappedEvent, context, () => {}) || {};

        result.body = data ? JSON.stringify(data) : '';
        result.statusCode = result.statusCode || (data ? constants.HTTP_STATUS_OK : constants.HTTP_STATUS_NO_CONTENT);

        return result as APIGatewayProxyResult;

      } catch (e) {
        console.error(e.message ? e.message : JSON.stringify(e));
        if (!e.statusCode || !e.message) {
          throw e;
        }

        return {
          statusCode: e.statusCode,
          body: JSON.stringify({ message: e.message })
        };
      }
    };
