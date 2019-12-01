import { GameStatus } from './types';

export const top = <T>(list: T[]) => list.length > 0 ? list[list.length - 1] : undefined;

export const maxChildLength = <T>(parent: T[][]) => parent.reduce((max, column) => Math.max(max, column.length), 0);

export const gameOver = (status: GameStatus) => [GameStatus.forfeited, GameStatus.completed].indexOf(status) >= 0;

export const repeat = (length: number, character = ' ') => Array.from({ length }, () => character).join('');
