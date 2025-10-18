import Phaser from 'phaser';
import { INDEX_ARRS } from '../../constant/map';
import { AutoTileMath } from './autoTileMath';

export class Painter {
  constructor(private readonly w: number, private readonly h: number, private readonly cfg: SimpleConfig) {}
  paintCompositeAutotilePerQuad(
    layer: Phaser.Tilemaps.TilemapLayer,
    combinedMask: BoolGrid,
    sources: Array<{ mask: BoolGrid; tilesetKey: string }>,
    tilesetMap: Record<string, Phaser.Tilemaps.Tileset>
  ) {
    const ids: NumGrid = combinedMask.map(r => r.map(v => (v ? 1 : 0)));
    const lastKeyAt = (x: number, y: number) => {
      let key: string | null = null;
      for (const s of sources) if (s.mask?.[y]?.[x]) key = s.tilesetKey;
      return key;
    };
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (!combinedMask[y][x]) continue;
        const [a, b, c, d] = AutoTileMath.quad(this.cfg.indexArrs ?? INDEX_ARRS, ids, x, y, this.w, this.h);
        const tl = this.toZeroBased(a), tr = this.toZeroBased(b), bl = this.toZeroBased(c), br = this.toZeroBased(d);
        const key = lastKeyAt(x, y);
        if (!key) continue;
        const ts = tilesetMap[key];
        if (!ts) continue;
        const sx = x * 2, sy = y * 2;
        this.put(layer, ts.firstgid + tl, sx,     sy);
        this.put(layer, ts.firstgid + tr, sx + 1, sy);
        this.put(layer, ts.firstgid + bl, sx,     sy + 1);
        this.put(layer, ts.firstgid + br, sx + 1, sy + 1);
      }
    }
  }

  private put(layer: Phaser.Tilemaps.TilemapLayer, tileIndex: number, x: number, y: number) {
    layer.putTileAt(tileIndex, x, y, true);
  }

  private toZeroBased(idx1to48: number) {
    const idx = Math.max(1, Math.min(48, idx1to48));
    return idx - 1;
  }
}
