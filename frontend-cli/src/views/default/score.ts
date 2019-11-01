import { GameStatus } from '../../types';
import { repeat } from '../../util';
import { statusDisplay } from './strings';

export const generateScoreView = (score: number, status: GameStatus, viewWidth: number) => [
  '',
  [
    `Score: ${score}`,
    `Status: ${statusDisplay[status]}`
  ].join(repeat(viewWidth - `Score: ${score}Status: ${statusDisplay[status]}`.length))
];
