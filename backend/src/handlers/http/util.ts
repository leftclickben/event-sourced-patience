import { BadRequest, InternalServerError, NotFound } from 'http-errors';

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
