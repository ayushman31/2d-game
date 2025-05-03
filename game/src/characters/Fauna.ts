declare global{
    namespace Phaser.GameObjects{
        interface GameObjectFactory{
            fauna(x: number, y: number, texture: string, frame?: string|number): Fauna
        }
    }
}

enum HealthState{
    IDLE, DAMAGE
}

export default class Fauna extends Phaser.Physics.Arcade.Sprite{

    private healthState = HealthState.IDLE;
    private damageTime = 0;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string|number){
        super(scene, x, y, texture, frame);

        this.anims.play('fauna-idle-down');
    }

    handleDamage(dir: Phaser.Math.Vector2){        
        if(this.healthState == HealthState.DAMAGE){
            return;
        }
        this.setVelocity(dir.x, dir.y);
        this.setTint(0xff0000);
        this.healthState = HealthState.DAMAGE;
        this.damageTime = 0;
    }

    protected preUpdate(time: number, delta: number): void {
          switch(this.healthState){
            case HealthState.IDLE:
                break;
            
            case HealthState.DAMAGE:
                this.damageTime += delta;
                if(this.damageTime >=250 ){
                    this.healthState = HealthState.IDLE;
                    this.setTint(0xffffff);
                    this.damageTime = 0;
                }
                break;
            
          }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys){

        if(this.healthState === HealthState.DAMAGE){
            return;
        }

        if(!cursors){
			return
		}		

		const speed = 200;

		if(cursors.left?.isDown){
			this.anims.play('fauna-run-side', true);
			this.setVelocity(-speed, 0);
			this.scaleX = -1;
			this.body.offset.x = 24;
		} else if(cursors.down?.isDown){
			this.anims.play('fauna-run-down', true);
			this.setVelocity(0, speed)
		} else if(cursors.up?.isDown){
			this.anims.play('fauna-run-up', true);
			this.setVelocity(0, -speed)
		} else if(cursors.right?.isDown){
			this.anims.play('fauna-run-side', true);
			this.setVelocity(speed, 0);
			this.scaleX = 1;
			this.body.offset.x = 8;
		} else{
			const parts = this.anims.currentAnim.key.split('-');
			parts[1] = 'idle';
			this.anims.play(parts.join('-'))
			this.setVelocity(0,0);
		}
    }
}

Phaser.GameObjects.GameObjectFactory.register('fauna' , function(this: Phaser.GameObjects.GameObjectFactory , x: number, y: number, texture: string, frame?: string|number){
    var sprite = new Fauna(this.scene , x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    sprite.body.setSize(sprite.width * 0.5, sprite.height*0.5)
    return sprite;
})