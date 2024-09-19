export default interface ModuleInterface {
  id: number;
  coord: {
    x: number;
    y: number;
    w: number;
    h: number;
  }
  overlaps(module: ModuleInterface): boolean;
}
