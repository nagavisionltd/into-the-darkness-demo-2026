Platformer Principles
"Design the jump before the level."

Variable jump height - Hold = higher jump (cutoff at ~40% of max)

Coyote time - 3-4 frames after leaving platform (per your KB)

Jump buffering - 6-8 frames input queue before landing (per your KB)

level design rhythem INTRO → TEACH → COMBINE → MASTER → SURPRISE

Intro: Safe space to learn controls (Room 1: Awakening)
Teach: Isolate one mechanic (Room 2: First Truth Shard)
Combine: Two mechanics interact (Room 4: Reality Shift + Combat)
Master: Complex execution under pressure (Room 11: Convergence)
Surprise: Optional secret test (Room 10: The Mirror)

Intro: Safe space to learn controls (Room 1: Awakening)
Teach: Isolate one mechanic (Room 2: First Truth Shard)
Combine: Two mechanics interact (Room 4: Reality Shift + Combat)
Master: Complex execution under pressure (Room 11: Convergence)
Surprise: Optional secret test (Room 10: The Mirror)
C. Visual Clarity Rules
✅ Readable silhouettes: Player/enemies distinct against BG
✅ Color coding: Truth=blue, False=red (consistent across game)
✅ Foreground/background separation: Parallax layers for depth
❌ Avoid: Same-color hazards/platforms (player can't read threats)
D. Pacing & Breathers
After high-intensity rooms, insert empty/calming spaces (Room 7: Memory Fragment)
Use camera pauses at scenic moments to let players absorb world-building
Secret areas should feel intentional, not accidental (visual tells required)

Tilemap Loading (Avoid Common LLM Errors)

// ✅ CORRECT: Load tilemap JSON + tileset image SEPARATELY
preload() {
  this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');
  this.load.image('tiles_noktara', 'assets/tiles/noktara_tileset.png');
}

create() {
  const map = this.make.tilemap({ key: 'level1' });
  
  // ✅ CRITICAL: Add tileset WITH correct firstgid from Tiled export
  const tileset = map.addTilesetImage('noktara_tileset', 'tiles_noktara');
  
  // ✅ Create layers by NAME (not index) - matches Tiled layer names
  const platforms = map.createLayer('Platforms', tileset, 0, 0);
  const hazards = map.createLayer('Hazards', tileset, 0, 0);
  
  // ✅ Set collision AFTER layer creation
  platforms.setCollisionByProperty({ collides: true });
}

Spritesheet Animation Standards
// ✅ KB-COMPLIANT: Sprite normalization pattern
createPlayerAnimations() {
  const targetDisplayHeight = 350; // Lord Soul standard
  
  // Load spritesheet with consistent frame dimensions
  this.load.spritesheet('lord_soul', 'assets/characters/lord_soul_sheet.png', {
    frameWidth: 64, frameHeight: 96 // Real sprite dimensions
  });
  
  this.anims.create({
    key: 'lord_idle',
    frames: this.anims.generateFrameNumbers('lord_soul', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
  });
  
  // ✅ CRITICAL: Normalize visual size on frame change
  this.player = this.physics.add.sprite(100, 300, 'lord_soul');
  this.player.setScale(targetDisplayHeight / 96); // 350 / realHeight
  
  // ✅ KB: Update scale ONLY on frame change, not every physics step
  this.player.on('animationupdate', (anim, frame) => {
    const newScale = targetDisplayHeight / frame.cutHeight; // Use real frame height
    if (Math.abs(this.player.scale - newScale) > 0.01) {
      this.player.setScale(newScale);
    }
  });
}





