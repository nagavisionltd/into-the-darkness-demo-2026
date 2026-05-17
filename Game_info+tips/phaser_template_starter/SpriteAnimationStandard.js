// src/utils/SpriteUtils.js
export const SPRITE_STANDARDS = {
  // KB: Character height normalization targets
  CHARACTER_HEIGHTS: {
    chibi: 250,
    lord_soul: 350,  // Default for this template
    big_z: 450
  },
  
  // KB: Animation timing defaults (60 FPS)
  ANIM_TIMING: {
    startup: { min: 3, max: 10 },    // frames (no hitbox)
    active: { min: 2, max: 6 },      // frames (hitbox ON)
    recovery: { min: 6, max: 20 }    // frames (no input)
  },
  
  // KB: Combo windows
  COMBO_WINDOWS: {
    fast: 200,
    balanced: 280,  // Lord Soul default
    heavy: 350
  }
};

/**
 * KB-CRITICAL: Normalize sprite visual size across animation frames
 * Call on EVERY frame change, not every physics step
 */
export function normalizeScale(sprite, targetHeight, currentFrame) {
  if (!currentFrame?.cutHeight) return; // Safety
  
  const newScale = targetHeight / currentFrame.cutHeight;
  // Only update if change is significant (prevent micro-jitter)
  if (Math.abs(sprite.scale - newScale) > 0.01) {
    sprite.setScale(newScale);
  }
}

/**
 * Create animation with KB-compliant timing
 */
export function createKBAnimation(scene, config) {
  const {
    key,
    frames,
    frameRate = 24,
    repeat = -1,
    kbTiming = {} // Optional: override startup/active/recovery frames
  } = config;
  
  // Apply KB timing if provided
  const processedFrames = frames.map((frame, index) => {
    let duration = 1000 / frameRate; // Default ms per frame
    
    // KB: Adjust duration based on animation phase
    if (kbTiming.startup && index < kbTiming.startup.end) {
      duration = kbTiming.startup.duration || duration;
    } else if (kbTiming.active && index >= kbTiming.active.start && index <= kbTiming.active.end) {
      duration = kbTiming.active.duration || duration;
    } else if (kbTiming.recovery && index > kbTiming.recovery.start) {
      duration = kbTiming.recovery.duration || duration;
    }
    
    return { ...frame, duration };
  });
  
  scene.anims.create({
    key,
    frames: processedFrames,
    repeat,
    // KB: Skip missed frames to maintain timing integrity
    skipMissedFrames: true
  });
}