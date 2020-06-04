import { CloudFormation } from 'aws-sdk';
import { StageName } from './types';

// NOTE This prefix is coupled to string logic in `package.json` scripts and in `cloudwatch.ts` in this directory.
// Changes must be replicated in all three places.
const getStackName = (stage: StageName) => {
  return `patience-${stage}`;
};

export const getStackOutputs = async <T extends string>(
  stage: StageName,
  keyMap: Record<string, T>
): Promise<Record<T, string>> => {
  const stackName = getStackName(stage);
  const { Stacks: stacks } = await new CloudFormation().describeStacks({ StackName: stackName }).promise();
  if (!stacks) {
    throw Error(`Stack "${stackName}" not found`);
  }
  const outputKeys = Object.keys(keyMap);
  const outputs = (stacks[0].Outputs || []).filter(({ OutputKey: key }) => key && outputKeys.indexOf(key) >= 0);
  if (outputs.length !== outputKeys.length) {
    throw Error(`Stack "${stackName}" is missing one or more output keys, expected ${JSON.stringify(outputKeys)} got ${JSON.stringify(outputs)}`);
  }

  return outputs.reduce(
    (result, { OutputKey: key, OutputValue: value }) => ({
      ...result,
      [keyMap[key as string]]: value as string
    }),
    {} as Record<T, string>);
};
