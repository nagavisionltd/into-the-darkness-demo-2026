// src/core/BaseScene.js
import { CombatFeedback } from '../systems/CombatFeedback.js';
import { InputBuffer } from './InputBuffer.js';
import { DebugOverlay } from '../utils/DebugOverlay.js';

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
    
    // KB: Core systems
    this.combatFeedback = null;
    this.inputBuffer = null;
    this.debug = null;
    
    // KB: Performance tracking
    this.frameCount = 0;
    this.lastFPSLog = 0;
  }
  
  preload() {
    // ✅ Template: Always load these assets
    this.load.image('particle_small', 'assets/spritesheets/particles.png');
    this.load.audio('hit_light', 'assets/audio/sfx/hit_light.mp3');
    this.load.audio('hit_heavy', 'assets/audio/sfx/hit_heavy.mp3');
    
    // ✅ Template: Tilemap loading pattern
    this.load.tilemapTiledJSON('level1', 'assets/tilesets/level1.json');
    this.load.image('placeholder_tiles', 'assets/tilesets/placeholder_tileset.png');
  }
  
  create() {
    // ✅ KB: Initialize combat feedback system
    this.combatFeedback = new CombatFeedback(this);
    
    // ✅ KB: Input buffer for combo windows (280ms default)
    this.inputBuffer = new InputBuffer(this, { comboWindow: 280 });
    
    // ✅ KB: Debug overlay (FPS, position, hitboxes)
    this.debug = new DebugOverlay(this);
    
    // ✅ Template: Load level with safe pattern
    const level = this.loadLevel('level1', 'placeholder_tileset', 'placeholder_tiles');
    if (level) {
      this.platforms = level.layers.Platforms;
      // Set player collision
      if (this.player) {
        this.physics.add.collider(this.player, this.platforms);
      }
    }
    
    // ✅ Template: Spawn placeholder player
    this.spawnPlayer(100, 300);
    
    // ✅ Template: KB-compliant camera setup
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setLerp(0.08, 0.08); // Smooth follow
  }
  
  update(time, delta) {
    // ✅ KB: Performance monitor (log FPS every 2 seconds)
    this.frameCount++;
    if (time - this.lastFPSLog > 2000) {
      const fps = Math.round(this.frameCount * 1000 / (time - this.lastFPSLog));
      console.log(`[FPS] ${fps} | Entities: ${this.children.list.length}`);
      this.frameCount = 0;
      this.lastFPSLog = time;
    }
    
    // ✅ KB: Update input buffer (combo windows, coyote time)
    this.inputBuffer.update(delta);
    
    // ✅ Template: Player update hook
    if (this.player?.active) {
      this.player.update(delta, this.inputBuffer);
    }
  }
  
  // ✅ Template method: Override in child scenes
  spawnPlayer(x, y) {
    // Placeholder: Replace with actual player class
    this.player = this.physics.add.sprite(x, y, 'player_sheet');
    this.player.setCollideWorldBounds(true);
    // KB: Apply sprite normalization
    // (Handled in Player.js via animationupdate event)
  }
  
  // ✅ Template method: Safe tilemap loader (copy from TilemapLoader.js)
  loadLevel(mapKey, tilesetKey, tilesetImageKey) {
    // ... [paste TilemapLoader.loadLevel code here] ...
  }
}