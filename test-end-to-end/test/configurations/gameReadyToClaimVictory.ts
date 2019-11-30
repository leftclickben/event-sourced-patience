import { GameEventType, GameId } from '../../src/types';
import { createGamePlayedToVictory, gameCreatedStock, gameCreatedTableau } from '../../src/events';

// BASE CASE - VICTORY: Load a game that has all cards on the foundation but not claimed victory, and claim victory.
export const gameReadyToClaimVictory = (gameId: GameId, apiBaseUrl: string) => ({
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
    ...process.env.API_VERBOSE ? [`HTTP PATCH ${apiBaseUrl}/game/gameReadyToClaimVictory/claimVictory undefined\n`] : [],
    ...process.env.API_VERBOSE ? ['Response from HTTP PATCH: {\n  "gameId": "gameReadyToClaimVictory",\n  "score": 690,\n  "status": "completed",\n  "table": {\n    "foundation": [\n      [\n        {\n          "value": "ace",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "diamonds",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "diamonds",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "clubs",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "clubs",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "hearts",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "hearts",\n          "faceUp": true\n        }\n      ],\n      [\n        {\n          "value": "ace",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "two",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "three",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "four",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "five",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "six",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "seven",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "eight",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "nine",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "ten",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "jack",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "queen",\n          "suit": "spades",\n          "faceUp": true\n        },\n        {\n          "value": "king",\n          "suit": "spades",\n          "faceUp": true\n        }\n      ]\n    ],\n    "tableau": [\n      [],\n      [],\n      [],\n      [],\n      [],\n      [],\n      []\n    ],\n    "waste": [],\n    "stock": []\n  }\n}\n'] : [],
    'You won!!!\n',
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
});
