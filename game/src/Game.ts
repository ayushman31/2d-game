import Phaser from 'phaser'
import { debug } from './utils/debug';
import { demonAnims } from './animations/DemonAnims';
import { characterAnims } from './animations/CharacterAnims';
import Demon from './enemy/Demon';
import "./characters/Fauna";
import Fauna from './characters/Fauna';

export default class Game extends Phaser.Scene {

	private cursors !: Phaser.Types.Input.Keyboard.CursorKeys;
	// private fauna !: Phaser.GameObjects.Sprite; //no physics applied in the character
	private fauna !:Fauna; //physics applied in the character

	private hit=0;

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
		
		map.createLayer('ground', tileset);
		const wallsLayer = map.createLayer('walls', tileset);
		wallsLayer.setCollisionByProperty({ collides: true });  //so that the character doesn't go through the walls

		// debug(wallsLayer, this);
		this.fauna = this.add.fauna(128,128, 'fauna')

		this.physics.add.collider(this.fauna, wallsLayer);
		this.cameras.main.startFollow(this.fauna, true);
		
		const demons = this.physics.add.group({
			classType: Demon,
			createCallback: (go) => {
				const demGo = go as Demon;
				demGo.body.onCollide = true;
			}
		});//groups all the demons which are created using the Demon class
		
		demons.get(256,128, 'demon')
		
		this.physics.add.collider(demons, wallsLayer); //so that the demon doesn't go through the walls

		this.physics.add.collider(demons, this.fauna, this.handlePlayerDemonCollision, undefined, this );

		
	};

	private handlePlayerDemonCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject){
		const demon = obj2 as Demon;

		const dx = this.fauna.x - demon.x;
		const dy = this.fauna.y - demon.y;
		
		const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(200);

		this.fauna.handleDamage(dir);
	}

	update(time: number, delta: number): void {

		if(this.hit > 0){
			++this.hit;
			if(this.hit > 50){
				this.hit = 0;
			}

			return
		}

		if(this.fauna){
			this.fauna.update(this.cursors)
		}		

	}
}
