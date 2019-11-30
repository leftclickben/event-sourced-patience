# Event Sourced Patience -- end-to-end integration tests

This is an end-to-end test suite that runs both frontend and backend in an isolated environment, plays several games and ensures the output and database content is consistent with expectations.

## Setting up

You just need node installed and then install the dependencies:

```
npm install
```

You will also need an AWS account to run the tests.

## Running the tests

The `mocha` test suite can be executed using the standard `npm` script:

```
npm test
```

If you are not using the `default` AWS profile on your machine, have the `AWS_PROFILE` environment variable set correctly.  You must also configure `AWS_REGION` to your preferred region.

Some additional environment variables are effective:

* `API_VERBOSE`: passed down to the client frontend and will include API output in the tests
* `TESTS_VERBOSITY`: if set, should be 0, 1 or 2 to displays no output, progress indicator output, or verbose output (respectively) from `npm` scripts and the frontend application while tests are running
* `TESTS_RETAIN_STACK`: if set, skips the cleanup step where the CloudFormation stack is removed, to inspect results afterward
* `TESTS_GAME_IDS`: if set, should be a JSON array of strings, each string is a `gameId` specifying the tests to run (if omitted, all tests are run)

As a complete example naming a profile and specifying the Sydney region, to run only the specified games with the API in verbose mode:

```
AWS_PROFILE=myprofile AWS_REGION=ap-southeast-2 API_VERBOSE=1 TEST_GAME_IDS='["newGameToForfeit","newGameToMakeSomeMoves"]' npm test
```

Note the quotes around the value for `TEST_GAME_IDS`.

## General approach to operating the backend and frontend

The backend is deployed to AWS running in a real CloudFormation stack with real Lambda functions and DynamoDB table.  To perform the deployment, the `npm run deploy` script from the `backend/package.json` is used via the `child_process` node package.

The frontend is executed locally.  It was tempting to call the `main()` function in-process, but in order to provide a complete end-to-end test, the frontend is also executed using the `child_process` package.

To handle I/O, the frontend is provided with an input tape (an array of strings, each of which is followed by a newline), and also writes its output and error streams to tapes, which are then compared with expectations.

## Adding tests

Tests can be easily added and modified in the `fixtures/data` module, which is an array of `TestConfiguration` objects.

The `getInitialise` function returns the `GameEvent`s passed to the `saveEvents` function for each game, to write events directly to the database.  This provides the starting point for the game.

The other keys describe the input tape, expected output and error tapes, and the expected events (with temporal / ephemeral data stripped) after the tapes have been played.  The output tape may be different depending on API verbosity as expressed in the `API_VERBOSE` environment variable.

Note that the `inputTape` array **must** end with either a `quit` or a `forfeit` command, otherwise the tape will not cause the frontend application to exit.
