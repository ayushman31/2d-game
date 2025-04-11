import Phaser from 'phaser'
import { debug } from './utils/debug';
import { demonAnims } from './animations/DemonAnims';
import { characterAnims } from './animations/CharacterAnims';
import Demon from './enemy/Demon';

export default class HelloWorldScene extends Phaser.Scene {

	private cursors !: Phaser.Types.Input.Keyboard.CursorKeys;
	// private fauna !: Phaser.GameObjects.Sprite; //no physics applied in the character
	private fauna !: Phaser.Physics.Arcade.Sprite; //physics applied in the character

	constructor() {
		super('game')
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	create() {
		
		characterAnims(this.anims)
		demonAnims(this.anims);

		const map = this.make.tilemap({ key: 'dungeon' });
		const tileset = map.addTilesetImage('dungeon', 'tiles');
		
		map.createStaticLayer('ground', tileset);
		const wallsLayer = map.createStaticLayer('walls', tileset);
		wallsLayer.setCollisionByProperty({ collides: true });

		// debug(wallsLayer, this);

		this.fauna = this.physics.add.sprite(128, 128, 'fauna', 'walk-down-3.png');
		this.fauna.body.setSize(this.fauna.width*0.5 , this.fauna.height*0.5)

		
		this.fauna.anims.play('fauna-idle-down');
		this.physics.add.collider(this.fauna, wallsLayer);
		this.cameras.main.startFollow(this.fauna, true);

		const demons = this.physics.add.group({
			classType: Demon
		});

		demons.get(256,128, 'demon')
		
	};

	update(time: number, delta: number): void {
		if(!this.cursors || !this.fauna){
			return
		}		

		const speed = 200;

		if(this.cursors.left?.isDown){
			this.fauna.anims.play('fauna-run-side', true);
			this.fauna.setVelocity(-speed, 0);
			this.fauna.scaleX = -1;
			this.fauna.body.offset.x = 24;
		} else if(this.cursors.down?.isDown){
			this.fauna.anims.play('fauna-run-down', true);
			this.fauna.setVelocity(0, speed)
		} else if(this.cursors.up?.isDown){
			this.fauna.anims.play('fauna-run-up', true);
			this.fauna.setVelocity(0, -speed)
		} else if(this.cursors.right?.isDown){
			this.fauna.anims.play('fauna-run-side', true);
			this.fauna.setVelocity(speed, 0);
			this.fauna.scaleX = 1;
			this.fauna.body.offset.x = 8;
		} else{
			const parts = this.fauna.anims.currentAnim.key.split('-');
			parts[1] = 'idle';
			this.fauna.anims.play(parts.join('-'))
			this.fauna.setVelocity(0,0);
		}
	}
}
