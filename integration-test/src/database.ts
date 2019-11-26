import { DynamoDB } from 'aws-sdk';
import { GameEvent } from '../../backend/src/events/types';

export const saveEvents = async (gameId: string, events: GameEvent[]) => {
  new DynamoDB.DocumentClient()
    .batchWrite({
      RequestItems: {
        [process.env.DB_TABLE_EVENTS as string]: events
          .slice(0, 25)
          .map((event) => ({
            PutRequest: {
              Item: event
            }
          }))
      }
    })
    .promise();

  if (events.length > 25) {
    await saveEvents(gameId, events.slice(25));
  }
};
