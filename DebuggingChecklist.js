// Add to update() temporarily:
if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
  console.log('[DEBUG] Player:', {
    pos: {x: this.player.x, y: this.player.y},
    vel: {x: this.player.body.velocity.x, y: this.player.body.velocity.y},
    anim: this.player.anims?.currentAnim?.key,
    frame: this.player.anims?.currentFrame?.index
  });
  this.debug.toggleHitboxes(); // If implemented
}