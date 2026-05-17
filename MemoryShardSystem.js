// src/systems/MemoryShardSystem.js
/**
 * MEMORY SHARD SYSTEM
 * Implements Truth/False shard mechanics per NAGA KB
 * - Particle bursts (ADD blend, count scales with intensity)
 * - Hit stop integration (50-100ms on collection)
 * - Screen shake feedback (0.002-0.006 intensity)
 * - Reality shift triggers for level geometry
 */

export default class MemoryShardSystem {
  constructor(scene) {
    this.scene = scene;
    this.shards = [];
    this.activeEffects = [];
    
    // KB Standards
    this.TRUTH_COLOR = '#4da6ff';    // Blue
    this.FALSE_COLOR = '#ff4d4d';    // Red
    this.PARTICLE_LIGHT = 5;         // 3-5 for light effects
    this.PARTICLE_HEAVY = 18;        // 12-20 for heavy effects
    this.HITSTOP_DURATION = 75;      // 50-100ms per KB
    this.SCREENSHAKE_INTENSITY = 0.004; // Medium feedback
  }

  /**
   * Create a shard pickup at position
   * @param {number} x - World X
   * @param {number} y - World Y
   * @param {string} type - 'truth' or 'false'
   * @param {object} effects - Optional: {realityShift, spawnEnemy, grantAbility}
   */
  createShard(x, y, type, effects = {}) {
    const shard = {
      id: Phaser.Utils.String.UUID(),
      x, y,
      type, // 'truth' | 'false'
      radius: 24,
      collected: false,
      pulsePhase: 0,
      effects: {
        realityShift: effects.realityShift || false,
        spawnEnemy: effects.spawnEnemy || null,
        grantAbility: effects.grantAbility || null,
        xpReward: type === 'truth' ? 15 : 5,
        ecReward: type === 'truth' ? 10 : 25 // False shards give more currency but risk
      },
      // Visual config
      glowColor: type === 'truth' ? this.TRUTH_COLOR : this.FALSE_COLOR,
      blendMode: 'ADD', // Per KB: ADD blend for energy effects
      particleCount: type === 'truth' ? this.PARTICLE_LIGHT : this.PARTICLE_HEAVY
    };
    
    this.shards.push(shard);
    return shard;
  }

  /**
   * Update all shards (pulse animation, collection check)
   */
  update(player) {
    for (const shard of this.shards) {
      if (shard.collected) continue;
      
      // Pulse animation (KB: smooth visual feedback)
      shard.pulsePhase += 0.05;
      const pulseScale = 1 + Math.sin(shard.pulsePhase) * 0.15;
      
      // Collection check (circle vs player AABB)
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      const dx = playerCenterX - shard.x;
      const dy = playerCenterY - shard.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < shard.radius + player.width * 0.4) {
        this.collectShard(shard, player);
      }
    }
  }

  /**
   * Handle shard collection with KB-compliant feedback
   */
  collectShard(shard, player) {
    shard.collected = true;
    
    // === KB: HIT STOP on collection ===
    this.triggerHitStop(this.HITSTOP_DURATION);
    
    // === KB: SCREEN SHAKE scaled by shard type ===
    const shakeIntensity = shard.type === 'truth' ? 0.002 : 0.006;
    const shakeDuration = shard.type === 'truth' ? 80 : 200;
    this.triggerScreenShake(shakeIntensity, shakeDuration);
    
    // === KB: PARTICLE BURST with ADD blend ===
    this.spawnParticleBurst(
      shard.x, shard.y,
      shard.particleCount,
      shard.glowColor,
      shard.blendMode
    );
    
    // === Apply effects ===
    if (shard.effects.realityShift) {
      this.triggerRealityShift(shard.type);
    }
    if (shard.effects.spawnEnemy && this.scene.enemies) {
      this.scene.enemies.spawn(shard.effects.spawnEnemy, shard.x + 50, shard.y);
    }
    if (shard.effects.grantAbility && player.abilities) {
      player.abilities.unlock(shard.effects.grantAbility);
    }
    
    // === RPG Rewards (per KB) ===
    if (player.rpg) {
      player.rpg.addXP(shard.effects.xpReward);
      player.rpg.addEC(shard.effects.ecReward);
    }
    
    // === Sound feedback (KB: layered SFX) ===
    const sfxKey = shard.type === 'truth' ? 'shard_truth' : 'shard_false';
    this.scene.sound.play(sfxKey, {
      volume: shard.type === 'truth' ? 0.7 : 1.0,
      detune: shard.type === 'truth' ? 200 : -200
    });
    
    // === Visual feedback ===
    this.showCollectionText(shard.x, shard.y - 30, shard.type);
  }

  /**
   * KB-COMPLIANT: Trigger hit stop (freeze frames)
   */
  triggerHitStop(durationMs) {
    // Per KB: Pause physics and anims, resume after delay
    this.scene.physics.world.pause();
    this.scene.time.delayedCall(durationMs, () => {
      this.scene.physics.world.resume();
    });
  }

  /**
   * KB-COMPLIANT: Screen shake with intensity scaling
   */
  triggerScreenShake(intensity, duration) {
    // Per KB: Scale by knockback/collection type
    this.scene.cameras.main.shake(duration, intensity);
  }

  /**
   * KB-COMPLIANT: Particle burst with ADD blend
   */
  spawnParticleBurst(x, y, count, color, blendMode) {
    // Per KB: Spawn on impact direction, ADD blend for energy
    const particles = this.scene.add.particles(x, y, 'particle_small', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      blendMode: blendMode, // ADD per KB
      tint: color,
      quantity: count,
      lifespan: 400,
      gravityY: 200,
      emitting: false
    });
    
    particles.explode(count);
    
    // KB Performance: Auto-destroy after lifespan
    this.scene.time.delayedCall(500, () => particles.destroy());
  }

  /**
   * Reality shift mechanic (Level 1: Noktara core)
   */
  triggerRealityShift(shardType) {
    // Per level design: Truth reveals paths, False creates traps
    const shiftData = {
      type: shardType,
      duration: 300, // ms transition
      platforms: []
    };
    
    // Example: Toggle platform visibility/state
    if (this.scene.platforms) {
      for (const plat of this.scene.platforms) {
        if (plat.shardDependent) {
          const shouldShow = shardType === 'truth' ? plat.truthVisible : plat.falseVisible;
          plat.setVisible(shouldShow);
          plat.setActive(shouldShow);
          // KB: Disable hitboxes when not active (performance)
          plat.body?.enable = shouldShow;
          shiftData.platforms.push(plat);
        }
      }
    }
    
    // Visual transition effect
    this.scene.cameras.main.fade(150, 0, 0, 0, false);
    this.scene.time.delayedCall(150, () => {
      this.scene.cameras.main.fade(150, 0, 0, 0, true);
    });
    
    return shiftData;
  }

  /**
   * Collection text feedback (KB: clear visual tells)
   */
  showCollectionText(x, y, type) {
    const text = type === 'truth' ? '+TRUTH' : '+FALSE';
    const color = type === 'truth' ? this.TRUTH_COLOR : this.FALSE_COLOR;
    
    const txt = this.scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: color,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Float up and fade (KB: readable feedback)
    this.scene.tweens.add({
      targets: txt,
      y: y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.easeOut',
      onComplete: () => txt.destroy()
    });
  }

  /**
   * Render shards (call in scene's render loop)
   */
  render(ctx, camera) {
    for (const shard of this.shards) {
      if (shard.collected) continue;
      
      const screenX = shard.x - camera.scrollX;
      const screenY = shard.y - camera.scrollY;
      
      // Glow effect (KB: ADD blend for energy)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter'; // ADD blend
      ctx.fillStyle = shard.glowColor + '80'; // 50% alpha hex
      ctx.beginPath();
      ctx.arc(screenX, screenY, shard.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Core sprite
      ctx.fillStyle = shard.glowColor;
      ctx.beginPath();
      ctx.arc(screenX, screenY, shard.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      
      // Pulse ring
      const pulseR = shard.radius * (1 + Math.sin(shard.pulsePhase) * 0.3);
      ctx.strokeStyle = shard.glowColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(screenX, screenY, pulseR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /**
   * Debug: Log shard states (per KB debug commands)
   */
  debugLog() {
    console.log(`[Shards] Total: ${this.shards.length}, Collected: ${this.shards.filter(s => s.collected).length}`);
    for (const s of this.shards) {
      if (!s.collected) {
        console.log(`  - ${s.type} @ (${Math.round(s.x)}, ${Math.round(s.y)})`);
      }
    }
  }
}