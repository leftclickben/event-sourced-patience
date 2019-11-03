export const clearScreen = '\x1b[2J';

export const gameTitle = 'Patience!';

export const prompt = 'Enter a command (h for help): ';

export const helpText = `
# How to play command-line ${gameTitle}

Write a move by specifying where a card is moving from and where it is moving to, using the following abbreviations:

* a..d = foundation (4 positions)
* 1..7 = tableau (7 columns)
* s = stock
* w = waste 

For example:

* sw = deal a card from the stock to the waste; can be abbreviated to "s"
* ws = reset the waste to form a new stock
* w3 = move the top card from the waste to the third column of the tableau
* 2a = move the top card from the second tableau to the first foundation
* 46 = move all face up cards from tableau column 4 to tableau column 6

When moving cards between tableau columns, to move only some of the face up cards, specify the number of cards to move after the column numbers:

* 371 = move a single card from column 3 to column 7
* 2111 = move 11 cards from column 2 to column 1

You can also do:

* q = quit the CLI, but don't finish the game; resume by restarting the CLI
* v = claim victory and quit the CLI; restart the CLI to begin a new game
* f = forfeit the game and quit the CLI; restart the CLI to begin a new game
* h = help, to display this help text
`;
