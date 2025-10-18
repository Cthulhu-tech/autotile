import { Scene } from 'phaser';
import { MaskOps } from '../utils/mask';
import { INDEX_ARRS } from '../../constant/map';
import { TilesetRegistrar } from '../utils/tilesetRegistrar';
import { Painter } from '../utils/painter';

export class Game extends Scene {
  private cfg: SimpleConfig;
  private w: number;
  private h: number;

  private map: Phaser.Tilemaps.Tilemap;
  private solidLayer: Phaser.Tilemaps.TilemapLayer;
  private floorLayer: Phaser.Tilemaps.TilemapLayer;

  private tilesetsWall: Record<string, Phaser.Tilemaps.Tileset>;
  private tilesetsFloor: Record<string, Phaser.Tilemaps.Tileset>;

  private maskOps: MaskOps;
  private painter: Painter;

  private floorMask!: BoolGrid;

  constructor(
    key = 'Game',
    cfg: SimpleConfig = {
      subTile: 16,
      indexArrs: INDEX_ARRS,
      floor: 'ground',
      floorWall: 'wall',
    },
    gridW = 100,
    gridH = 100
  ) {
    super(key);
    this.cfg = cfg;
    this.w = gridW;
    this.h = gridH;
  }

  preload() {
    this.load.setPath('assets');
    this.load.image("ground", "ground.png");
    this.load.image("wall", "wall.png");
  }

  create() {
    this.cameras.main.setZoom(1);

    this.map = this.make.tilemap({ tileWidth: this.cfg.subTile, tileHeight: this.cfg.subTile, width: this.w * 2, height: this.h * 2 });
    const registrar = new TilesetRegistrar(this.map, this.cfg.subTile);

    this.tilesetsWall  = registrar.register([this.cfg.floorWall]);
    this.tilesetsFloor = registrar.register([this.cfg.floor]);

    this.solidLayer = this.map.createBlankLayer('Solid', [this.tilesetsWall[this.cfg.floorWall]], 0) as Phaser.Tilemaps.TilemapLayer;
    this.floorLayer = this.map.createBlankLayer('Floor', [this.tilesetsFloor[this.cfg.floor]], 1) as Phaser.Tilemaps.TilemapLayer;
    this.solidLayer.setPosition(0, 0);
    this.floorLayer.setPosition(0, 0);

    this.maskOps = new MaskOps(this.w, this.h);
    this.painter = new Painter(this.w, this.h, this.cfg);

    this.floorMask = this.maskOps.makeMask(false);

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.handlePointer(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { if (p.isDown) this.handlePointer(p); });

    this.repaintAll();
  }

  private handlePointer(pointer: Phaser.Input.Pointer) {
    const worldX = pointer.worldX;
    const worldY = pointer.worldY;
    const cellSize = this.cfg.subTile * 2;
    const gx = Math.floor(worldX / cellSize);
    const gy = Math.floor(worldY / cellSize);
    if (!this.maskOps.inBounds(gx, gy)) return;

    if (pointer.leftButtonDown()) {
      this.floorMask[gy][gx] = true;
    } else if (pointer.rightButtonDown()) {
      this.floorMask[gy][gx] = false;
    } else {
      return;
    }

    this.repaintAll();
  }

  private clearLayer(layer: Phaser.Tilemaps.TilemapLayer) {
    const tw = this.w * 2;
    const th = this.h * 2;
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const t = layer.getTileAt(x, y, false);
        if (t) layer.removeTileAt(x, y);
      }
    }
  }

  private repaintAll() {
    const wallsMask = this.maskOps.outerPerimeterMask(this.floorMask, this.floorMask);

    this.clearLayer(this.solidLayer);
    this.clearLayer(this.floorLayer);

    this.painter.paintCompositeAutotilePerQuad(
      this.floorLayer,
      this.floorMask,
      [{ mask: this.floorMask, tilesetKey: this.cfg.floor }],
      { [this.cfg.floor]: this.tilesetsFloor[this.cfg.floor] }
    );

    this.painter.paintCompositeAutotilePerQuad(
      this.solidLayer,
      wallsMask,
      [{ mask: wallsMask, tilesetKey: this.cfg.floorWall }],
      { [this.cfg.floorWall]: this.tilesetsWall[this.cfg.floorWall] }
    );
  }
}
