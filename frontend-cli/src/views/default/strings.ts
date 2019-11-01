import chalk from 'chalk';
import { GameStatus, Suit, Value } from '../../types';

export const margin = '  ';

export const baseSlot = '   ';

export const emptySlot = chalk.gray('\u2592\u2592\u2592');

export const statusDisplay: Record<GameStatus, string> = {
  [GameStatus.none]: '',
  [GameStatus.inProgress]: 'In Progress',
  [GameStatus.completed]: '!! YOU WON !!',
  [GameStatus.forfeited]: 'Quitter'
};

export const faceDownCardSlot = '\u2591\u2591\u2591';

export const suitDisplay: Record<Suit, string> = {
  [Suit.clubs]: '\u2663',
  [Suit.diamonds]: '\u2666',
  [Suit.spades]: '\u2660',
  [Suit.hearts]: '\u2665'
};

export const valueDisplay: Record<Value, string> = {
  [Value.two]: ' 2',
  [Value.three]: ' 3',
  [Value.four]: ' 4',
  [Value.five]: ' 5',
  [Value.six]: ' 6',
  [Value.seven]: ' 7',
  [Value.eight]: ' 8',
  [Value.nine]: ' 9',
  [Value.ten]: '10',
  [Value.jack]: ' J',
  [Value.queen]: ' Q',
  [Value.king]: ' K',
  [Value.ace]: ' A'
};
