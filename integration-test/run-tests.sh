#!/usr/bin/env bash

set -eux

# Create a new deployment per execution
UNIQUE_STAGE=integrationtests$(date +%Y%m%d%H%M%S)
echo "UNIQUE_STAGE = ${UNIQUE_STAGE}"

# Deploy the backend
pushd ../backend
npm run push --stage="${UNIQUE_STAGE}"
npm run show --stage="${UNIQUE_STAGE}"
popd

# Get the stack output values for use in other parts of the script
# TODO Get the `stack-name` from an npm script (?)
API_BASE_URL=$(aws cloudformation describe-stacks --stack-name "event-sourced-patience-${UNIQUE_STAGE}" --query "Stacks[0].Outputs[?OutputKey=='ApiBaseUrl'].OutputValue" --output text)
echo "API_BASE_URL = ${API_BASE_URL}"

DB_TABLE_EVENTS=$(aws cloudformation describe-stacks --stack-name "event-sourced-patience-${UNIQUE_STAGE}" --query "Stacks[0].Outputs[?OutputKey=='EventsTableName'].OutputValue" --output text)
echo "DB_TABLE_EVENTS = ${DB_TABLE_EVENTS}"

# Populate the database with a known state
DB_TABLE_EVENTS="${DB_TABLE_EVENTS}" ts-node src/seed.ts

# Play the input sequences, ensuring the output matches expectations
# TODO API_BASE_URL="${API_BASE_URL}" ts-node src/performTests.ts

# Ensure the final state of the database matches expectation
# TODO DB_TABLE_EVENTS="${DB_TABLE_EVENTS}" ts-node src/assertFinalState.ts

# Maybe wait for enter
if [ -z "${CI:-}" ]; then
  echo 'Press enter to clean up and remove all data...'
  read -n 1 -s -r
fi

# Clean up the deployment
pushd ../backend
npm run pull --stage="${UNIQUE_STAGE}"
popd
