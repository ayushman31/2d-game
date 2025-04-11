export const demonAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'demon-idle',
        frames: anims.generateFrameNames('demon', {start: 0, end: 3, prefix: 'big_demon_idle_anim_f', suffix:'.png'}),
        repeat: -1,
        frameRate: 15
    });
    anims.create({
        key: 'demon-run',
        frames: anims.generateFrameNames('demon', {start: 0, end: 3, prefix: 'big_demon_run_anim_f', suffix:'.png'}),
        repeat: -1,
        frameRate: 15
    });
}