import { GUTTER_SIZE } from '../constants';
import { moduleW2LocalWidth } from '../helpers';
import ModuleInterface from './ModuleInterface';

export default class Module implements ModuleInterface {
  id: number;

  coord: {
    x: number;
    y: number;
    w: number;
    h: number;
  };

  constructor(id: number, coord: { x: number; y: number; w: number; h: number; }) {
    this.id = id;
    this.coord = coord;
  }

  overlaps(module: ModuleInterface): boolean {
    if (this.id === module.id) {
      return false;
    }

    const box1 = this.coord;
    const box2 = module.coord;

    const box1Right = box1.x + moduleW2LocalWidth(box1.w) + GUTTER_SIZE;
    const box2Right = box2.x + moduleW2LocalWidth(box2.w) + GUTTER_SIZE;
    const box1Bottom = box1.y + box1.h + GUTTER_SIZE;
    const box2Bottom = box2.y + box2.h + GUTTER_SIZE;

    if (box1Right > box2.x && box1.x < box2Right && box1Bottom > box2.y && box1.y < box2Bottom) {
      return true;
    }

    return false;
  }
}
