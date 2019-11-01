import { InternalServerError, BadRequest, NotFound } from 'http-errors';
import { constants } from 'http2';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const httpHandler = (handler: APIGatewayProxyHandler): APIGatewayProxyHandler =>
  async (event, context) => {
    try {
      return await handler(event, context, () => {}) as APIGatewayProxyResult;
    } catch (e) {
      console.error(e);
      if (!e.statusCode || !e.message) {
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

export const success = (data?: any, statusCode?: number): APIGatewayProxyResult => {
  const body = data ? JSON.stringify(data) : '';
  statusCode = statusCode || (body && body.length > 0 ? constants.HTTP_STATUS_OK : constants.HTTP_STATUS_NO_CONTENT);
  return { statusCode, body };
};
