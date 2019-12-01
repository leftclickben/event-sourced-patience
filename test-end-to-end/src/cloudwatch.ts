import { CloudWatchLogs } from 'aws-sdk';

export const cleanUpLogGroups = async () => {
  const logs = new CloudWatchLogs();

  const { logGroups, nextToken } = await logs
    .describeLogGroups({ logGroupNamePrefix: '/aws/lambda/event-sourced-patience-end2end' })
    .promise();

  if (!logGroups) {
    return;
  }

  console.info(`Deleting the following log groups: ${JSON.stringify(logGroups)}`);

  await logGroups.reduce(
    async (promise, { logGroupName }) => {
      await promise;
      if (logGroupName) {
        await logs.deleteLogGroup({ logGroupName }).promise();
      }
    },
    Promise.resolve());

  if (nextToken) {
    await cleanUpLogGroups();
  }
};

if (require.main === module) {
  cleanUpLogGroups()
    .then(() => console.log('Log group cleanup completed'))
    .catch((error) => console.error('Failed to clean up log groups', error));
}
