import {
  GameCreatedEvent,
  GameEvent,
  GameEventType,
  StockDealtToWasteEvent,
  TableauPlayedToFoundationEvent,
  TableauPlayedToTableauEvent,
  WastePlayedToFoundationEvent,
  WastePlayedToTableauEvent,
  WasteResetToStockEvent
} from '../../events/types';
import { Card } from '../../game/types';
import { TableState } from './types';
import { buildStateFromEvents } from '../util';
import { StateBuilder } from '../types';

export const buildTableState = (events: GameEvent[]) =>
  buildStateFromEvents<TableState>(
    {
      tableau: [],
      foundation: [],
      stock: [],
      waste: []
    },
    {
      gameCreated,
      stockDealtToWaste,
      wasteResetToStock,
      wastePlayedToTableau,
      wastePlayedToFoundation,
      tableauPlayedToFoundation,
      tableauPlayedToTableau
    } as Record<GameEventType, StateBuilder<TableState>>,
    events);

// Builder functions

const gameCreated: StateBuilder<TableState, GameCreatedEvent> =
  (_ignorePreviousState, { tableau, stock }): TableState => ({
    tableau,
    foundation: [[], [], [], []],
    stock,
    waste: []
  });

const stockDealtToWaste: StateBuilder<TableState, StockDealtToWasteEvent> =
  (state) => ({
    ...state,
    waste: state.waste.concat(takeUpTo(state.stock, 3).reverse().map(turnOverCard))
  });

const wasteResetToStock: StateBuilder<TableState, WasteResetToStockEvent> =
  (state) => ({
    ...state,
    stock: state.waste.reverse().map(turnOverCard),
    waste: []
  });

const wastePlayedToTableau: StateBuilder<TableState, WastePlayedToTableauEvent> =
  ({ waste, tableau, ...rest }, { tableauIndex }) => ({
    tableau: appendToChild(tableau, tableauIndex, waste.pop() as Card),
    waste,
    ...rest
  });

const wastePlayedToFoundation: StateBuilder<TableState, WastePlayedToFoundationEvent> =
  ({ waste, foundation, ...rest }, { foundationIndex }) => ({
    foundation: appendToChild(foundation, foundationIndex, waste.pop() as Card),
    waste,
    ...rest
  });

const tableauPlayedToFoundation: StateBuilder<TableState, TableauPlayedToFoundationEvent> =
  ({ tableau, foundation, ...rest }, { foundationIndex, tableauIndex }) => ({
    foundation: appendToChild(foundation, foundationIndex, tableau[tableauIndex].pop() as Card),
    tableau: ensureTableauFaceUp(tableau),
    ...rest
  });

const tableauPlayedToTableau: StateBuilder<TableState, TableauPlayedToTableauEvent> =
  ({ tableau, ...rest }, { fromIndex, count, toIndex }) => ({
    tableau: ensureTableauFaceUp(moveBetweenChildren(tableau, fromIndex, count, toIndex)),
    ...rest
  });

// Helper functions

const appendToChild = <T>(array: T[][], index: number, element: T): T[][] => {
  array[index].push(element);
  return array;
};

const moveBetweenChildren = <T>(array: T[][], fromIndex: number, count: number, toIndex: number): T[][] => {
  array[toIndex].push(...array[fromIndex].splice(array[fromIndex].length - count, count));
  return array;
};

const takeUpTo = <T>(array: T[], maxCount: number): T[] => {
  const numberToTake = Math.min(array.length, maxCount);
  return array.splice(array.length - numberToTake, numberToTake);
};

const turnOverCard = ({ faceUp, ...rest }: Card): Card => ({ ...rest, faceUp: !faceUp });

const ensureTableauFaceUp = (tableau: Card[][]): Card[][] =>
  tableau.map((column) => {
    if (column.length > 0 && !column[column.length - 1].faceUp) {
      column[column.length - 1].faceUp = true;
    }
    return column;
  });


