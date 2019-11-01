# Event Sourced Patience -- Frontend CLI

The frontend is a simple NodeJS CLI application.  You just need a terminal window to play it.

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

There are no tests at this time.

## Running the frontend

To play the game, you need to configure the environment.  Either:

* Create a file named `.env` with the API base URL returned by the backend.  The file `.template.env` can be copied as a starting point.
* Or, set actual environment variables with the names in the `.template.env` file.

Then execute:

```
npm run game
```

### Debugging

You can set `API_VERBOSE` to a truthy value to see the requests and responses to and from the API.

### Specifying the Game ID

To specify the game ID explicitly:

```
npm run game -- -g <game-id>
```

## Building

You can generate a single `.js` file by running:

```
npm run build
```

This file can then be run anywhere there is a NodeJS interpreter, without needing TypeScript.

## Gameplay

Playing the game via the CLI consists of entering commands consisting of the source and destination location of the cards, and in some cases, the number of cards being moved.

Run the game and type "h" to see the instructions, or look [here](src/strings.ts).
