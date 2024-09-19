import { COLUMN_WIDTH, GUTTER_SIZE } from './constants';

const moduleW2LocalWidth = (moduleW: number): number =>
  Math.round(moduleW) * COLUMN_WIDTH - GUTTER_SIZE;

const moduleX2LocalX = (moduleX: number): number =>
  Math.round(moduleX) * COLUMN_WIDTH + GUTTER_SIZE;

const moduleY2LocalY = (moduleY: number): number => moduleY + GUTTER_SIZE;

export { moduleW2LocalWidth, moduleX2LocalX, moduleY2LocalY };
