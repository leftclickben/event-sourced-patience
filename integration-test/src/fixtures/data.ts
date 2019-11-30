import { GameEventType, GameId, TestConfigurationBuilder } from '../types';
import { createGameNoMovesMade, createGamePlayedToVictory, gameCreatedStock, gameCreatedTableau } from './events';

export const testConfigurations: Record<GameId, TestConfigurationBuilder> = {
  // BASE CASE - FORFEIT: Load a game that has only been created, and forfeit it.
  newGameToForfeit: (gameId: GameId, apiBaseUrl: string) => ({
    initialEvents: createGameNoMovesMade(gameId),
    inputTape: [
      'forfeit'
    ],
    expectedOutputTape: [
      'Continuing explicitly requested game newGameToForfeit\n',
      ...process.env.API_VERBOSE ? [`HTTP GET ${apiBaseUrl}/game/newGameToForfeit\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP GET: {\n  "gameId": "newGameToForfeit",\n  "score": 0,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
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
      'Enter a command (h for help): ', // forfeit
      ...process.env.API_VERBOSE ? [`HTTP DELETE ${apiBaseUrl}/game/newGameToForfeit\n`] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 0          Status: Quitter   ║ \n' +
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
      'Thanks for playing!\n'
    ],
    expectedErrorTape: [],
    expectedEvents: [
      {
        eventType: GameEventType.gameCreated,
        tableau: gameCreatedTableau,
        stock: gameCreatedStock
      },
      {
        eventType: GameEventType.gameForfeited
      }
    ]
  }),

  // BASE CASE - VICTORY: Load a game that has all cards on the foundation but not claimed victory, and claim victory.
  gameReadyToClaimVictory: (gameId: GameId, apiBaseUrl: string) => ({
    initialEvents: createGamePlayedToVictory(gameId).slice(0, -1), // Remove the victoryClaimed event.
    inputTape: [
      'victory'
    ],
    expectedOutputTape: [
      'Continuing explicitly requested game gameReadyToClaimVictory\n',
      ...process.env.API_VERBOSE ? [`HTTP GET ${apiBaseUrl}/game/gameReadyToClaimVictory\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP GET: {\n  "gameId": "gameReadyToClaimVictory",\n  "score": 690,\n  "status": "inProgress",\n  "table": {\n    "foundation": [\n      [\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ]\n    ],\n    "tableau": [\n      [],\n      [],\n      [],\n      [],\n      [],\n      [],\n      []\n    ],\n    "waste": [],\n    "stock": []\n  }\n}\n'] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 690    Status: In Progress   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ♦ K  ♣ K  ♥ K  ♠ K   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n',
      'Enter a command (h for help): ', // victory
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/gameReadyToClaimVictory/claimVictory undefined`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "gameReadyToClaimVictory",\n  "score": 690,\n  "status": "completed",\n  "table": {\n    "foundation": [\n      [\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ]\n    ],\n    "tableau": [\n      [],\n      [],\n      [],\n      [],\n      [],\n      [],\n      []\n    ],\n    "waste": [],\n    "stock": []\n  }\n}\n'] : [],
      'You won!!!',
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 690  Status: !! YOU WON !!   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ♦ K  ♣ K  ♥ K  ♠ K   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n',
      'Thanks for playing!\n'
    ],
    expectedErrorTape: [],
    expectedEvents: [
      {
        eventType: GameEventType.gameCreated,
        tableau: gameCreatedTableau,
        stock: gameCreatedStock
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        toIndex: 2,
        count: 1,
        fromIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        toIndex: 5,
        count: 1,
        fromIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        tableauIndex: 4,
        foundationIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        toIndex: 0,
        count: 1,
        fromIndex: 3,
      },
      {
        eventType: GameEventType.stockDealtToWaste,
      },
      {
        eventType: GameEventType.stockDealtToWaste,
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 3,
        fromIndex: 5,
        toIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 5,
        toIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 6,
        toIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 5,
        toIndex: 0
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 2,
        fromIndex: 3,
        toIndex: 6
      },
      {
        eventType: GameEventType.wasteResetToStock
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.wastePlayedToFoundation,
        foundationIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 4,
        fromIndex: 1,
        toIndex: 6,
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.wasteResetToStock
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 5,
        toIndex: 3
      },
      {
        eventType: GameEventType.wastePlayedToFoundation,
        foundationIndex: 1
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 9,
        fromIndex: 6,
        toIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 6,
        toIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 6
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wasteResetToStock
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wasteResetToStock
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 4,
        toIndex: 0
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 2,
        fromIndex: 3,
        toIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 3,
        toIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 2,
        fromIndex: 2,
        toIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 4
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 1,
        fromIndex: 2,
        toIndex: 4
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 5
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 4
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.wasteResetToStock
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 4
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.wastePlayedToFoundation,
        foundationIndex: 1
      },
      {
        eventType: GameEventType.stockDealtToWaste
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 4
      },
      {
        eventType: GameEventType.wastePlayedToTableau,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 7,
        fromIndex: 5,
        toIndex: 3
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        count: 5,
        fromIndex: 4,
        toIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 4
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 0,
        tableauIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 3,
        tableauIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 2,
        tableauIndex: 2
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        foundationIndex: 1,
        tableauIndex: 3
      },
      {
        eventType: GameEventType.victoryClaimed
      }
    ]
  }),

  // SPECIAL COMMANDS: Load a game that has only been created, show the help, attempt to claim victory, then quit.
  newGameToShowHelpAndAttemptVictory: (gameId: GameId, apiBaseUrl: string) => ({
    initialEvents: createGameNoMovesMade(gameId),
    inputTape: [
      'help',
      'victory',
      'quit'
    ],
    expectedOutputTape: [
      'Continuing explicitly requested game newGameToShowHelpAndAttemptVictory\n',
      ...process.env.API_VERBOSE ? [`HTTP GET ${apiBaseUrl}/game/newGameToShowHelpAndAttemptVictory\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP GET: {\n  "gameId": "newGameToShowHelpAndAttemptVictory",\n  "score": 0,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
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
      'Enter a command (h for help): ', // victory
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/newGameToShowHelpAndAttemptVictory/claimVictory undefined`] : [],
      'Enter a command (h for help): ', // quit
      'Thanks for playing!\n'
    ],
    expectedErrorTape: [
      '400 - {"message":"Command validation failed: Insufficient cards in Foundation 1"}\n'
    ],
    expectedEvents: [
      {
        eventType: GameEventType.gameCreated,
        tableau: gameCreatedTableau,
        stock: gameCreatedStock
      }
    ]
  }),

  // PLAY PARTIAL GAME: Load a game that has just been created, play a few moves, then quit.
  newGameToMakeSomeMoves: (gameId: GameId, apiBaseUrl: string) => ({
    initialEvents: createGameNoMovesMade(gameId),
    inputTape: [
      '13',
      '26',
      '5a',
      '41',
      'sw',
      'sw',
      'quit'
    ],
    expectedOutputTape: [
      'Continuing explicitly requested game newGameToMakeSomeMoves\n',
      ...process.env.API_VERBOSE ? [`HTTP GET ${apiBaseUrl}/game/newGameToMakeSomeMoves\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP GET: {\n  "gameId": "newGameToMakeSomeMoves",\n  "score": 0,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
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
      'Enter a command (h for help): ', // 13
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/newGameToMakeSomeMoves/playTableauToTableau {"fromIndex":0,"toIndex":2,"count":1}\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "newGameToMakeSomeMoves",\n  "score": 0,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 0      Status: In Progress   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ▒▒▒  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║        ░░░  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║        ♥ 4  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♠ 6  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♦ 5  ♦ K  ░░░  ░░░  ░░░   ║ \n' +
      ' ║                       ♦ A  ░░░  ░░░   ║ \n' +
      ' ║                            ♠ 5  ░░░   ║ \n' +
      ' ║                                 ♦ 3   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ▒▒▒  ░░░   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n',
      'Enter a command (h for help): ', // 26
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/newGameToMakeSomeMoves/playTableauToTableau {"fromIndex":1,"toIndex":5,"count":1}\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "newGameToMakeSomeMoves",\n  "score": 0,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 0      Status: In Progress   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ▒▒▒  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║        ♥ 6  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♠ 6  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♦ 5  ♦ K  ░░░  ░░░  ░░░   ║ \n' +
      ' ║                       ♦ A  ░░░  ░░░   ║ \n' +
      ' ║                            ♠ 5  ░░░   ║ \n' +
      ' ║                            ♥ 4  ♦ 3   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ▒▒▒  ░░░   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n',
      'Enter a command (h for help): ', // 5a
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/newGameToMakeSomeMoves/playTableauToFoundation {"tableauIndex":4,"foundationIndex":0}\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "newGameToMakeSomeMoves",\n  "score": 15,\n  "status": "inProgress",\n  "table": {\n    "foundation": [\n      [\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [],\n      [],\n      []\n    ],\n    "tableau": [\n      [],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 15     Status: In Progress   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ♦ A  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║        ♥ 6  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♠ 6  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♦ 5  ♦ K  ♣ 8  ░░░  ░░░   ║ \n' +
      ' ║                            ░░░  ░░░   ║ \n' +
      ' ║                            ♠ 5  ░░░   ║ \n' +
      ' ║                            ♥ 4  ♦ 3   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ▒▒▒  ░░░   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n' +
      '',
      'Enter a command (h for help): ', // 41
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/newGameToMakeSomeMoves/playTableauToTableau {"fromIndex":3,"toIndex":0,"count":1}\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "newGameToMakeSomeMoves",\n  "score": 15,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": []\n  }\n}\n'] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 15     Status: In Progress   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ♦ A  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║   ♦ K  ♥ 6  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♠ 6  ♠ 9  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♦ 5       ♣ 8  ░░░  ░░░   ║ \n' +
      ' ║                            ░░░  ░░░   ║ \n' +
      ' ║                            ♠ 5  ░░░   ║ \n' +
      ' ║                            ♥ 4  ♦ 3   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ▒▒▒  ░░░   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n',
      'Enter a command (h for help): ', // sw
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/newGameToMakeSomeMoves/dealStockToWaste {}\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "newGameToMakeSomeMoves",\n  "score": 15,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": false\n      }\n    ],\n    "waste": [\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": true\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": true\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": true\n      }\n    ]\n  }\n}\n'] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 15     Status: In Progress   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ♦ A  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║   ♦ K  ♥ 6  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♠ 6  ♠ 9  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♦ 5       ♣ 8  ░░░  ░░░   ║ \n' +
      ' ║                            ░░░  ░░░   ║ \n' +
      ' ║                            ♠ 5  ░░░   ║ \n' +
      ' ║                            ♥ 4  ♦ 3   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ♦ J  ░░░   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n',
      'Enter a command (h for help): ', // sw
      ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/newGameToMakeSomeMoves/dealStockToWaste {}\n`] : [],
      ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "newGameToMakeSomeMoves",\n  "score": 15,\n  "status": "inProgress",\n  "table": {\n    "tableau": [\n      [\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": false\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": false\n        },\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": false\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": false\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ]\n    ],\n    "foundation": [\n      [\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [],\n      [],\n      []\n    ],\n    "stock": [\n      {\n        "value": "ten",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "three",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "six",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "ten",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "four",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "diamonds",\n        "faceUp": false\n      },\n      {\n        "value": "five",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "queen",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "king",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "jack",\n        "suit": "spades",\n        "faceUp": false\n      },\n      {\n        "value": "two",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "nine",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "eight",\n        "suit": "hearts",\n        "faceUp": false\n      },\n      {\n        "value": "seven",\n        "suit": "clubs",\n        "faceUp": false\n      },\n      {\n        "value": "ace",\n        "suit": "clubs",\n        "faceUp": false\n      }\n    ],\n    "waste": [\n      {\n        "value": "six",\n        "suit": "clubs",\n        "faceUp": true\n      },\n      {\n        "value": "nine",\n        "suit": "diamonds",\n        "faceUp": true\n      },\n      {\n        "value": "jack",\n        "suit": "diamonds",\n        "faceUp": true\n      },\n      {\n        "value": "five",\n        "suit": "hearts",\n        "faceUp": true\n      },\n      {\n        "value": "three",\n        "suit": "spades",\n        "faceUp": true\n      },\n      {\n        "value": "eight",\n        "suit": "diamonds",\n        "faceUp": true\n      }\n    ]\n  }\n}\n'] : [],
      '\u001b[2J\n' +
      ' ╔══════ ♣ ♦ ♠ ♥ Patience! ♥ ♠ ♦ ♣ ══════╗ \n' +
      ' ║                                       ║ \n' +
      ' ║   Score: 15     Status: In Progress   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                  ♦ A  ▒▒▒  ▒▒▒  ▒▒▒   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║   ♦ K  ♥ 6  ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ░░░  ░░░  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♠ 6  ♠ 9  ░░░  ░░░  ░░░   ║ \n' +
      ' ║             ♦ 5       ♣ 8  ░░░  ░░░   ║ \n' +
      ' ║                            ░░░  ░░░   ║ \n' +
      ' ║                            ♠ 5  ░░░   ║ \n' +
      ' ║                            ♥ 4  ♦ 3   ║ \n' +
      ' ║                                       ║ \n' +
      ' ║                            ♦ 8  ░░░   ║ \n' +
      ' ║                                       ║ \n' +
      ' ╚═══════════════════════════════════════╝ \n',
      'Enter a command (h for help): ', // quit
      'Thanks for playing!\n'
    ],
    expectedErrorTape: [],
    expectedEvents: [
      {
        eventType: GameEventType.gameCreated,
        tableau: gameCreatedTableau,
        stock: gameCreatedStock
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        toIndex: 2,
        count: 1,
        fromIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        toIndex: 5,
        count: 1,
        fromIndex: 1
      },
      {
        eventType: GameEventType.tableauPlayedToFoundation,
        tableauIndex: 4,
        foundationIndex: 0
      },
      {
        eventType: GameEventType.tableauPlayedToTableau,
        toIndex: 0,
        count: 1,
        fromIndex: 3,
      },
      {
        eventType: GameEventType.stockDealtToWaste,
      },
      {
        eventType: GameEventType.stockDealtToWaste,
      }
    ]
  })
};
