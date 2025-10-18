import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#000',
    antialiasGL: false,
    pixelArt: true,
    preserveDrawingBuffer: true,
    roundPixels: true,
    antialias: false,
    autoRound: false,
    scale: {
        width: 1280,
        height: 720,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 1,
    },
    fps: {
        target: 120,
        min: 30,
        smoothStep: true,
    },
    scene: [
        MainGame,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
