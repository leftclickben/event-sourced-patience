# Event Sourced Patience

Demonstration of simple event sourcing and complete end-to-end integration testing, using the card game &ldquo;[Patience](https://en.wikipedia.org/wiki/Patience_(game) )&rdquo; as the problem domain.

This repository consists of several top-level components (directories):

+ The `backend` directory contains an AWS Serverless implementation of the game engine and API, including infrastructure and backend code: [README](./backend/README.md)
+ The `frontend-cli` directory contains a simple command line application to play the game: [README](./frontend-cli/README.md)
+ The `test-end-to-end` directory contains a complete end-to-end integration test that exercises the deployment, API and frontend application: [README](./test-end-to-end/README.md)
+ The `.github` directory contains CI/CD configuration for GitHub

For more details, see the individual README files as listed above.

You only need [NodeJS](https://nodejs.org/) (and [npm](https://npmjs.org/)) and an [AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/) to use everything in this repository.  Your AWS consumption should fit well within the [free tier](https://aws.amazon.com/free/).
