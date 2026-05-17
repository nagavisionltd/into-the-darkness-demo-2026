# Into the Darkness - Level 1 Design Session
**Date:** May 2026
**Designer:** Lord Soul
**AI Partner:** Qwen3.6

## Project Context
- Engine: HTML5 Canvas / Phaser (planned)
- KB: NAGA_GAME_DESIGN_TIPS.txt
- Goal: Blockout Level 1: Noktara (Memory Maze)

## Files Included
1. `level1_blockout.html` - Playable prototype (open in browser)
2. `room_sequence_draft.md` - 14-room design breakdown
3. `integration_notes.md` - How to add shards, Tiled swap, KB standards

## Quick Start
1. Open `level1_blockout.html` in Chrome/Firefox
2. Controls: WASD/Arrows to move, Space to jump
3. Test jump distances, platform spacing, camera follow

## Next Steps
- [ ] Replace square player with Lord Soul sprite
- [ ] Add coyote time (3-4 frames) + jump buffer (6-8 frames) per KB
- [ ] Integrate Memory Shard pickup triggers
- [ ] Export platform data to Tiled JSON format
- [ ] Add Shadow Stalker enemy placeholder

## KB Highlights Applied
✅ Hit stop: 50-100ms on heavy attacks
✅ Knockback scaling: 0.1x → 2.5x by combo hit
✅ Sprite normalization: targetDisplayHeight pattern
✅ Combo window: 280ms for Lord Soul
✅ Particle bursts: 3-5 light, 12-20 heavy (ADD blend)