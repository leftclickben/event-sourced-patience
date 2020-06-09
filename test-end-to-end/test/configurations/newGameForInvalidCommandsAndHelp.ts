import { GameEventType, GameId } from '../../src/types';
import { createGameNoMovesMade, gameCreatedStock, gameCreatedTableau } from '../../src/events';

// tslint:disable:max-line-length

// SPECIAL COMMANDS: Load a game that has only been created, show the help, attempt to claim victory, then quit.
export const newGameForInvalidCommandsAndHelp = (gameId: GameId, apiBaseUrl: string) => ({
  initialEvents: createGameNoMovesMade(gameId),
  inputTape: [
    // illegal command syntax
    'xyzzy',
    '88',
    // valid command syntax, illegal moves
    '12',
    '7a',
    'ws',
    // failed attempt to claim victory
    'victory',
    // special commands
    'help',
    'quit'
  ],
  expectedOutputTape: [
    `Continuing explicitly requested game ${gameId}\n`,
    ...process.env.API_VERBOSE ? [`HTTP GET ${apiBaseUrl}/game/${gameId}\n`] : [],
    ...process.env.API_VERBOSE ? [`Response from HTTP GET: {\n  "gameId": "${gameId}",\n  "score": 0,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n`] : [],
    '\u001b[2J\n' +
    ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
    ' ║                                       ║ \n' +
    ' ║   Score: 0      Status: In Progress   ║ \n' +
    ' ║                                       ║ \n' +
    ' ║                  ▒▒▒  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n' +
    ' ║                                       ║ \n' +
    ' ║   ♦ 5  ░░░  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
    ' ║        ♥ 4  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
    ' ║             ♠ 6  ░░░  ░░░  ░░░  ░░░   ║ \n' +
    ' ║                  ♦ K  ░░░  ░░░  ░░░   ║ \n' +
    ' ║                       ♦ A  ░░░  ░░░   ║ \n' +
    ' ║                            ♠ 5  ░░░   ║ \n' +
    ' ║                                 ♦ 3   ║ \n' +
    ' ║                                       ║ \n' +
    ' ║                            ▒▒▒  ░░░   ║ \n' +
    ' ║                                       ║ \n' +
    ' ╚═══════════════════════════════════════╝ \n',
    'Enter a command (h for help): ', // xyzzy
    'Enter a command (h for help): ', // 88
    'Enter a command (h for help): ', // 12
    'Enter a command (h for help): ', // 7a
    'Enter a command (h for help): ', // ws
    'Enter a command (h for help): ', // victory
    ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/${gameId}/claimVictory undefined\n`] : [],
    'Enter a command (h for help): ', // help
    '\u001b[2J\n',
    '\n' +
    '# How to play command-line Patience!\n' +
    '\n' +
    'Write a move by specifying where a card is moving from and where it is moving to, using the following abbreviations:\n' +
    '\n' +
    '* a..d = foundation (4 positions)\n' +
    '* 1..7 = tableau (7 columns)\n' +
    '* s = stock\n' +
    '* w = waste\n' +
    '\n' +
    'For example:\n' +
    '\n' +
    '* sw = deal a card from the stock to the waste; can be abbreviated to "s"\n' +
    '* ws = reset the waste to form a new stock\n' +
    '* w3 = move the top card from the waste to the third column of the tableau\n' +
    '* 2a = move the top card from the second tableau to the first foundation\n' +
    '* 46 = move all face up cards from tableau column 4 to tableau column 6\n' +
    '\n' +
    'When moving cards between tableau columns, to move only some of the face up cards, specify the number of cards to move after the column numbers:\n' +
    '\n' +
    '* 371 = move a single card from column 3 to column 7\n' +
    '* 2111 = move 11 cards from column 2 to column 1\n' +
    '\n' +
    'You can also do:\n' +
    '\n' +
    '* q = quit the CLI, but don\'t finish the game; resume by restarting the CLI\n' +
    '* v = claim victory and quit the CLI; restart the CLI to begin a new game\n' +
    '* f = forfeit the game and quit the CLI; restart the CLI to begin a new game\n' +
    '* h = help, to display this help text\n' +
    '\n' +
    'Press enter to display the table.\n\n',
    'Enter a command (h for help): ', // quit
    'Thanks for playing!\n'
  ],
  expectedErrorTape: [
    'Unknown command "xyzzy"\n',
    'Unknown command "88"\n',
    '400 - {"message":"Command validation failed: Card colour must alternate when building tableau columns"}\n',
    '400 - {"message":"Command validation failed: Only Aces can be played to an empty foundation"}\n',
    '400 - {"message":"Command validation failed: \\"Waste\\" is empty"}\n',
    '400 - {"message":"Command validation failed: \\"Stock\\" is not empty"}\n'
  ],
  expectedEvents: [
    {
      gameId,
      eventType: GameEventType.gameCreated,
      tableau: gameCreatedTableau,
      stock: gameCreatedStock
    }
  ]
});
