import { CloudWatchLogs } from 'aws-sdk';

export const cleanUpLogGroups = async () => {
  const logs = new CloudWatchLogs();

  // NOTE This prefix is coupled to string logic in `package.json` scripts and in `cloudformation.ts` in this directory.
  // Changes must be replicated in all three places.
  const { logGroups, nextToken } = await logs
    .describeLogGroups({ logGroupNamePrefix: '/aws/lambda/patience-end2end' })
    .promise();

  if (!logGroups || logGroups.length < 1) {
    console.info('No log groups to delete');
    return;
  }

  console.info(`Deleting the following log groups: ${JSON.stringify(logGroups, null, 2)}`);

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
  if (process.argv.length <= 2) {
    console.error(`Missing argument: ${process.argv[0]} ${process.argv[1]} [command]`);
    process.exit(1);
  }
  switch (process.argv[2]) {
    case 'cleanup':
      cleanUpLogGroups()
        .then(() => console.log('Log group cleanup completed'))
        .catch((error) => console.error('Failed to clean up log groups', error));
      break;
    default:
      console.error(`Unknown command ${process.argv[2]}`);
      process.exit(2);
  }
}
