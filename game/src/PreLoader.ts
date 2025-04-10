import Phaser from 'phaser';

export default class PreLoader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        // Path for the image, key is 'tiles'
        this.load.image('tiles', '/tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', '/tiles/dungeon.json');
        this.load.atlas('fauna', '/character/fauna.png', '/character/fauna.json');
    }

    create() {
        this.scene.start('game'); // Start the scene with the key 'game'
        // -------------------------------
    }
}