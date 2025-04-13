enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const randomDirection = (exclude:  Direction) => {
    let newDirection = Phaser.Math.Between(0,3);
    while(newDirection === exclude){
        newDirection = Phaser.Math.Between(0,3);
    };

    return newDirection
}

export default class Demon extends Phaser.Physics.Arcade.Sprite{
    private direction = Direction.DOWN;
    private movement : Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x:number, y:number, texture: string, frame?: string|number){
        super(scene,x,y,texture,frame );

        this.anims.play('demon-idle');

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE , this.handleTileCollision , this)

        this.movement = scene.time.addEvent({
            delay: 4000,
            callback: () => {
                this.direction = randomDirection(this.direction);
            },
            loop: true
        })
    }

    destroy(fromScene?: boolean): void {
        this.movement.destroy();
        super.destroy(fromScene)
    }

    private handleTileCollision(go: Phaser.GameObjects.GameObject , tile: Phaser.Tilemaps.Tile){
        if(go != this){
            return
        }

        this.direction = randomDirection(this.direction);

    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        const speed = 100;

        switch (this.direction) {
            case Direction.DOWN:
                this.setVelocity(0,speed)
                break;
            
            case Direction.UP:
                this.setVelocity(0,-speed)
                break;
            
            case Direction.LEFT:
                this.setVelocity(-speed,0)
                break;
            
            case Direction.RIGHT:
                this.setVelocity(speed,0)
                break;
            
            default:
                break;
        }
    }
}