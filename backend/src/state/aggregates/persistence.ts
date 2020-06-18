import { S3 } from 'aws-sdk';
import { Aggregates } from './types';

const GAME_AGGREGATES_OBJECT_KEY = 'games.json';

export const loadAggregates = async (): Promise<Aggregates> => {
  const { Body: body } = await new S3()
    .getObject({
      Bucket: process.env.BUCKET_AGGREGATES as string,
      Key: GAME_AGGREGATES_OBJECT_KEY
    })
    .promise();
  if (!body) throw 'Could not load aggregates';
  return JSON.parse(body.toString());
};

export const saveAggregates = async (aggregates: Aggregates): Promise<void> => {
  await new S3()
    .putObject({
      Bucket: process.env.BUCKET_AGGREGATES as string,
      Key: GAME_AGGREGATES_OBJECT_KEY,
      Body: JSON.stringify(aggregates, null, 2)
    })
    .promise();
};
