export class MaskOps {
  constructor(private readonly w: number, private readonly h: number) {}
  makeMask(fill = false): BoolGrid {
    const m: BoolGrid = new Array(this.h);
    for (let y = 0; y < this.h; y++) { m[y] = new Array(this.w); for (let x = 0; x < this.w; x++) m[y][x] = fill; }
    return m;
  }
  inBounds(x: number, y: number) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  not(a: BoolGrid): BoolGrid {
    const out = this.makeMask(false);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) out[y][x] = !a[y][x];
    return out;
  }
  orMany(masks: BoolGrid[]): BoolGrid {
    const out = this.makeMask(false);
    for (const m of masks) for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (m?.[y]?.[x]) out[y][x] = true;
    return out;
  }
  andNot(a: BoolGrid, b: BoolGrid): BoolGrid {
    const out = this.makeMask(false);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) out[y][x] = !!a?.[y]?.[x] && !b?.[y]?.[x];
    return out;
  }
  outerPerimeterMask(interior: BoolGrid, floorMaskAll: BoolGrid): BoolGrid {
    const out = this.makeMask(false);
    const n8: ReadonlyArray<readonly [number, number]> = [
      [ 1, 0], [-1, 0], [0, 1], [0,-1],
      [ 1, 1], [ 1,-1], [-1, 1], [-1,-1],
    ];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (interior[y][x]) {
      for (const [dx, dy] of n8) {
        const nx = x + dx, ny = y + dy;
        if (!this.inBounds(nx, ny)) continue;
        if (!floorMaskAll[ny][nx]) out[ny][nx] = true;
      }
    }
    return out;
  }
}
