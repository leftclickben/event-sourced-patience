# Event Sourced Patience -- end-to-end integration tests

This is an end-to-end test suite that runs both frontend and backend in an isolated environment, plays several games and ensures the output and database content is consistent with expectations.

## Setting up

You just need node installed and then install the dependencies:

```
npm install
```

You will also need an AWS account to run the tests, and if you are not using the default profile, have the `AWS_PROFILE` environment variable set correctly.  You must also configure `AWS_REGION`.

## Running the tests

The test suite is controlled by a set of node modules executed as a standard `npm` script:

```
npm test
```

## Overview of the test process

1. Create a timestamp-based (unique enough) stage name, so that the tests have their own isolated environment
1. Perform a deployment of the backend using the unique stage name
1. Save some known data to the deployed stage
1. For each game:
   1. Run the frontend and use a "tape" approach to controlling and recording I/O
   1. Assert that the output and error tapes match expectation
   1. Assert that the database contains the expected events
1. Clean up the test stage; in a non-CI environment, this is preceded by waiting for user input

## General approach to operating the backend and frontend

The backend is deployed to AWS running in a real CloudFormation stack with real Lambda functions and DynamoDB table.  To perform the deployment, the `npm run deploy` script from the `backend/package.json` is used via the `child_process` node package.

The frontend is executed locally.  It was tempting to call the `main()` function in-process, but in order to provide a complete end-to-end test, the frontend is also executed using the `child_process` package.

To handle I/O, the frontend is provided with an input tape (an array of strings, each of which is followed by a newline), and also writes its output and error streams to tapes, which are then compared with expectations.

## Writing tests

Tests can be easily added and modified in the following two modules:
 
* `src/initialise/index.ts`
* `src/gameplay/gameData.ts`

The `initialise` module calls the `saveEvents` function for each game, to write events directly to the database.  This provides the starting point for the game.

The `gameData` module contains the tapes and the expected events (with temporal / ephemeral data stripped) after the tapes have been played.  The output tape may be different depending on API verbosity; this is provided as a parameter to the `createGameData` function along with the API URL, which appears in verbose logging.

Note that the `inputTape` array **must** end with either a `quit` or a `forfeit` command, otherwise the tape will not cause the frontend application to exit.
