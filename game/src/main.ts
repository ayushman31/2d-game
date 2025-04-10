import Phaser from 'phaser'
import PreLoader from './PreLoader'
import Game from './Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }, // because top-down game is not gravity-based
			debug: true
		},
	},
	scene: [PreLoader, Game],

	scale: {
		zoom: 2
	}
}

export default new Phaser.Game(config);
