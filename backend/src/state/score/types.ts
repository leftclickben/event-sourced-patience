export interface TableauTally {
  faceDown: number;
  faceUp: number;
}

export interface ScoreState {
  score: number;
  tableau: TableauTally[];
}
