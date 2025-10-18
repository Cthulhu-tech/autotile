AutoTile Click Canvas (Phaser 3)

Минимальный «пустой холст» на Phaser 3 с автотайлингом 48-квадрантов: ЛКМ — рисуем пол, ПКМ — стираем. Стены строятся автоматически по внешнему периметру (8-связность). Подходит как изолированный playground для отладки тайлсетов и правил автотайлинга.

Демо-возможности

Ручная отрисовка пола по клику (grid на логических клетках, каждая рендерится как 2×2 сабтайла).

Автотайлинг пола/стен по набору индексов INDEX_ARRS (48 вариантов).

Очистка/перерисовка слоёв без артефактов.

Простые свойства тайлов (флаг коллизии для стен).

Стек

Phaser 3.90+

TypeScript

Любой бандлер (Vite/Webpack/Parcel). Ниже пример для Vite.

Структура
src/
  scenes/
    AutoTileClickScene.ts   # сцена из примера
  constants/
    map.ts                  # INDEX_ARRS, TILECOUNT_PER_SET
  utils/
    autoTileMath.ts         # AutoTileMath.quad(...)
assets/
  tiles/
    ground.png              # 48-квадрантовый тайлсет пола
    wall.png                # 48-квадрантовый тайлсет стен
index.html
main.ts


Импорт в сцене ожидает:

INDEX_ARRS и TILECOUNT_PER_SET из constants/map

AutoTileMath из utils/autoTileMath

Если у вас уже есть эти файлы — просто положите сцену рядом.
Если нет — добавьте свои реализации. Для 48-квадрантов TILECOUNT_PER_SET обычно 48.

Установка
# с Vite + TS
npm create vite@latest autotile-canvas -- --template vanilla-ts
cd autotile-canvas
npm i phaser
# скопируйте файлы из раздела "Структура" в src/ и assets/
npm run dev

Загрузка ассетов

В вашем main.ts или сцене-прелоадере загрузите ровно двумя ключами:

preload() {
  this.load.spritesheet('ground', 'assets/tiles/ground.png', {
    frameWidth: SUB_TILE,   // размер сабтайла, напр. 16
    frameHeight: SUB_TILE
  });
  this.load.spritesheet('wall', 'assets/tiles/wall.png', {
    frameWidth: SUB_TILE,
    frameHeight: SUB_TILE
  });
}


Один логический тайл рендерится 2×2 сабтайлами, поэтому размер «клетки» = SUB_TILE * 2.

Инициализация сцены
import Phaser from 'phaser';
import { AutoTileClickScene } from './scenes/AutoTileClickScene';

new Phaser.Game({
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#111',
  scale: { width: 1024, height: 768, mode: Phaser.Scale.FIT },
  scene: [
    // при необходимости: ваш Preloader,
    new AutoTileClickScene('AutoTileClickScene', {
      subTile: 16,          // размер сабтайла в пикселях
      indexArrs: INDEX_ARRS,
      floor: 'ground',      // ключ загруженного тайлсета пола
      floorWall: 'wall',    // ключ загруженного тайлсета стен
    }, 64, 48)              // логический размер сетки (W×H)
  ],
});

Управление

ЛКМ — поставить пол в клетке.

ПКМ — стереть пол в клетке.

Стены строятся автоматически по периметру «маски пола».

Требования к тайлсетам

Формат 48-квадрантов (Wang-like), согласованный с AutoTileMath.

Каждый субтайл одинакового размера subTile×subTile (например, 16×16).

Спрайтлисты (или spritesheet) должны идти ровно в том порядке, для которого рассчитаны индексы INDEX_ARRS.

Настройка коллизии

В примере для стен ставится tile.properties['ge_colide'] = true.
Если используете физику/путь-файндинг, настройте обработку этого свойства в своей системе коллизий.

Известные оговорки

Полная перерисовка слоёв после клика — самый простой и надёжный путь для playground. Для больших карт оптимизируйте (перерисовывайте окрестность курсора).

Если цвета/паттерны «слипаются» между соседними областями — используйте разные тайлсеты/плитки или разнесите регионы (в этом демо один тайлсет пола на весь холст).

Лицензия

MIT

EN (short)

Minimal Phaser 3 playground with 48-tile autotiling. LMB paints floor, RMB erases; walls are auto-computed on the outer perimeter. Bring your own INDEX_ARRS, TILECOUNT_PER_SET, and AutoTileMath. Two spritesheets required: ground and wall (each a 48-variant autotile set). Use Vite/Webpack, preload textures, then add AutoTileClickScene.