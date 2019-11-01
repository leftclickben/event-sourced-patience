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

* f = foundation, followed by a number 1-4 representing which pile to use
* t = tableau, followed by a number 1-7 representing which column to use
* s = stock
* w = waste 

For example:

* sw = deal a card from the stock to the waste
* ws = reset the waste to form a new stock
* wt3 = move the top card from the waste to the third column of the tableau
* t2f1 = move the top card from the second column of the tableau

You may include a space between the two board locations, so the last example
above could also be written "t2 f1".

There is one exception, which is that when moving cards between tableau 
columns, any number of face-up cards can be moved (as long as the move is
otherwise legal, i.e. only face-up cards are moved and the result follows
the red-black alternating descending pattern).  

Specify the number of cards you want to move after the locations, separated by
a space (again, you may optionally also include a space between the source and
destination):

* t3t7 1 = move a single card from column 3 to column 7
* t2 t1 5 = move 5 cards from column 2 to column 1

You can also do:

* q = quit the CLI, but don't forfeit the game; resume by restarting the CLI
* f = forfeit the game and quit the CLI; restart the CLI to begin a new game
* h = help, to display this help text
`;
