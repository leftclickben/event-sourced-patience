# Event Sourced Patience -- Backend

The backend is an AWS Serverless application.  It uses AWS Lambda, API Gateway and DynamoDB.

## Initial setup

Just install the dependencies:

```
npm i
```

## Code quality tools

To run the linter:

```
npm run lint
```

To run the tests:

```
npm test
```

## Running the backend locally

You need `sam` installed (see [the documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)).

Then run the backend using:

```
npm run local
```

You will then need to change your frontend API URL to the `localhost` address output by `sam-local`.

## Deploying

To deploy to AWS, you must have an AWS account, configured AWS credentials, and installed NodeJS and the AWS CLI.  Use the following command:

```
npm run push
```

This performs a `build` step and a `deploy` step, for details see `package.json`.

You can see the outputs, including the generated API base URL, by running:

```
npm run show
```

There are also some configuration options that you can override, see `package.json` for details.
