import chalk from 'chalk';

const [club, diamond, spade, heart] = [
  chalk.black('\u2663'),
  chalk.red('\u2666'),
  chalk.black('\u2660'),
  chalk.red('\u2665')
];

export const clearScreen = '\x1b[2J';

export const gameTitle = 'Patience';

export const banner =
  chalk.underline(
    chalk.bgWhite(
      `${club} ${diamond} ${spade} ${heart} ${gameTitle} ${heart} ${spade} ${diamond} ${club}`
    )
  );

export const prompt = 'Enter a command (h for help): ';

export const helpText = `
# How to play command-line ${gameTitle}

Write a move by specifying where a card is moving from and where it is moving
to, using the following abbreviations:

* a..d = foundation (4 positions)
* 1..7 = tableau (7 columns)
* s = stock
* w = waste 

For example:

* sw = deal a card from the stock to the waste
* ws = reset the waste to form a new stock
* w3 = move the top card from the waste to the third column of the tableau
* 2a = move the top card from the second tableau to the first foundation

As a shortcut, dealing from the stock to the waste can be written as "s".

There is one other exception, which is that when moving cards between tableau
columns, any number of face-up cards can be moved (as long as the move is
otherwise legal, i.e. only face-up cards are moved and the result follows
the red-black alternating descending pattern).  

Specify the number of cards you want to move after the locations.  You can
omit the count, in which case 1 card is moved by default.

* 371 = move a single card from column 3 to column 7
* 37 = identical to the first example (371)
* 2111 = move 11 cards from column 2 to column 1

You can also do:

* q = quit the CLI, but don't finish the game; resume by restarting the CLI
* v = claim victory and quit the CLI; restart the CLI to begin a new game
* f = forfeit the game and quit the CLI; restart the CLI to begin a new game
* h = help, to display this help text
`;
