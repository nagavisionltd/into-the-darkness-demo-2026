# Level 1 Playable Spec: Noktara - Memory Maze

Source drafts:
- `room_seqeunce_draft.md`
- `RoomFlowChart.txt`
- `Mega Man & Platformer Level Design Research Summary.md`
- Visual refs: burning moonlit city street and Into the Darkness key art
- Current prototype: `starterq.html`

## Design Pillars

1. Mechanics before rooms
   - Every platform span must be checked against the current jump/double-jump budget before it is considered valid.
   - New mechanics get at least one safe introduction room before they are combined with enemies or time pressure.

2. Linear-branching, not full metroidvania
   - Level 1 should read like a Mega Man stage: a strong forward route with optional side rewards.
   - Branches rejoin quickly so the player stays oriented.

3. Horror readability
   - The world can be dark, rainy, and burning, but player-critical objects must remain readable instantly.
   - Use blue, red, and cyan gameplay colors sparingly so they remain meaningful.

4. The map is a promise
   - Visible off-route corners should hint at a reward, shortcut, lore echo, or spectacle.
   - No optional path should punish curiosity with unavoidable damage.

## 1. Hero Signature Moves

1. Double Jump
   - Core traversal identity for Level 1.
   - Used to cross broken streets, recover from bad jumps, and solve vertical echo-platform routes.
   - Design rule: the elegant path uses one clean jump plus one intentional double jump; imperfect players get recovery platforms.

2. Shard Strike
   - Short melee attack that changes behavior based on current shard state.
   - Truth state: reveals hidden/safe platforms and briefly stuns memory enemies.
   - False state: breaks false walls, deals higher knockback, but can spawn extra danger.

Future unlock after boss:
- V Blast, awarded by Memory Keeper, should not be required inside Level 1.

## 2. Exact Hero Capabilities

Current movement constants in `starterq.html`:
- Gravity: `0.65`
- Jump force: `-13`
- Max move speed: `5`
- Max jumps: `2`
- Player size: `32 x 32`

Practical traversal budget:
- Single-jump height: about 123 px.
- Running single-jump width: about 195 px.
- Double-jump height: about 247 px when the second jump is used near apex.
- Running double-jump width: about 340 px.

Level blockout constraints:
- Standard required gap: 120-180 px.
- Advanced optional gap: 220-300 px.
- Never require more than 320 px horizontal distance without a recovery ledge.
- Required vertical step should stay under 115 px for single jumps.
- Double-jump vertical climbs can use 140-220 px rises, with a visible landing target.

Proposed Shard Strike hitboxes:
- Neutral melee: 54 px wide x 36 px tall, starts 24 px in front of player, active for 8 frames.
- Truth reveal pulse: 160 px radius, non-damaging, reveals platforms for 4 seconds.
- False knockback slash: 70 px wide x 44 px tall, 1.4x knockback, spawns risk only in marked rooms.

Proposed dash, if added later:
- Echo Step dash: 150 px horizontal, 12 frames, no invulnerability by default.
- Dash should be optional in Level 1 unless it is taught in Room 4 and then gated after Room 7.

Blockout validation rule:
- For every required jump, mark the expected solution as `single`, `double`, or `recovery`.
- A required double-jump gap should have either a visible landing platform before commitment or a lower recovery route.
- Any wall, door, or arena boundary must have a documented entrance state: `open`, `opens by approach`, `opens by shard`, or `locked until event`.

## 3. Stage-Unique Hero Mechanics

1. Truth Shards
   - Reveal safe paths, temporary platforms, and enemy tells.
   - Used for main-route progression and readable recovery.

2. False Shards
   - Reveal shortcuts, bonus EC, false floors, or extra enemy pressure.
   - Used for optional mastery paths, not mandatory first-clear progression.

3. Memory Echo Platforms
   - Ghost platforms phase in/out or appear after a Truth interaction.
   - Teach timing without text through repeated safe examples.

4. Reality Shift Doors
   - Doors/platforms change state after shard choices.
   - The boss door in the prototype is the first version of this.

5. Echo Replay Hints
   - Ghost silhouettes demonstrate a safe jump, route, or trap.
   - Late rooms subvert this with false echoes, but only after the player has learned the rule.

## 3A. Visual Direction From References

Scene identity:
- Moonlit destroyed city, wet stone streets, burning buildings, distant skyline silhouettes.
- The moon should be a recurring navigation anchor in outdoor rooms.
- Fire is environmental danger and atmosphere; avoid using orange as a gameplay pickup color.

Palette roles:
- Environment: deep navy, blue-black, cold gray stone.
- Danger: fire orange, ember red, smoky black.
- Truth gameplay: saturated blue/cyan glow.
- False gameplay: saturated red/magenta glow.
- Door/machine/interactable: cyan-white edge light.

Readability rules:
- Foreground platforms need a brighter top edge than background rubble.
- Background fires should be lower contrast than active hazards.
- Enemies should not share the exact silhouette value of background demons.
- Rain, smoke, and particles must not obscure landing platforms or door states.

Hero/enemy framing from key art:
- Hero reads as blue cloak/coat energy silhouette.
- Main attack language is forward blue energy, matching Truth/clarity but usable as neutral combat.
- Demon enemies should have red eyes or red cores so threats read even in dark rooms.

Room art progression:
- R1-R4: open burning streets, moon visible, broken pavement.
- R5-R9: interiors, shafts, collapsed apartments, tighter silhouettes.
- R10: mirror-blue secret room, quiet but uncanny.
- R11-R13: cathedral approach, heavier red/black contrast, boss arena with cyan door.
- R14: dawn edge light, reduced fire intensity.

## 4. World Flow

Main sequence:

`R1 Awakening -> R2 First Contact -> R3 The Choice -> R4 Shifting Streets -> R5 Echo Chamber -> R6 Gauntlet -> R7 Breather -> R8 Truth & Lies -> R9 Shadow Dance -> R11 Convergence -> R12 Antechamber -> R13 Boss -> R14 Aftermath`

Optional branch:

`R8 Truth & Lies -> R10 The Mirror -> R11 Convergence`

Non-linear critical routes:
- Route A, safe truth route: R3 Truth choice -> R4 stable platforms -> R5 main climb -> R6.
- Route B, risky false route: R3 False choice -> R4 crumbled shortcut -> R6 side entrance with extra enemies/rewards.
- Route C, optional mastery route: R8 collect 3+ Truth Shards -> R10 secret -> R11.

## 5. Gates And Checkpoints

Progression checkpoints:
- CP1 after R3: player has learned shard choice.
- CP2 after R5: player has proven vertical navigation.
- CP3 after R7: safe story/breather checkpoint.
- CP4 before R13: antechamber checkpoint.

Ability/mechanic gates:
- R4 gate: requires Truth Shard reveal to create a forward platform.
- R5 gate: requires using Memory Echo platforms in a vertical climb.
- R8 gate: requires choosing Truth to open the main route; False creates optional rewards.
- R10 gate: requires 3+ Truth Shards and a visually foreshadowed blue door.
- R13 gate: sliding boss door opens when the player approaches.

## 6. Echo Pairs

- R3 The Choice -> R8 Truth & Lies
  - Early: choose one safe or risky shard.
  - Late: both appear together, and the player must manage reward versus danger under pressure.

- R5 Echo Chamber -> R9 Shadow Dance
  - Early: echo platforms teach vertical timing.
  - Late: platforms break/disappear and false echoes punish autopilot.

- R2 First Contact -> R11 Convergence
  - Early: one enemy teaches reaction and knockback.
  - Late: mixed enemy set plus shifting platforms tests the same skill in a larger space.

- R12 Antechamber -> R1 Awakening
  - Early: burning street as mystery.
  - Late: cathedral entrance echoes the same moonlit calm before the boss.

## 7. Room Architecture And Purpose

| Room | Name | Architecture | Purpose |
|---|---|---|---|
| R1 | The Awakening | Horizontal scroll | Safe movement, first Truth reveal |
| R2 | First Contact | Horizontal + slight climb | First enemy, knockback into hazards |
| R3 | The Choice | One-screen box | First explicit shard fork |
| R4 | Shifting Streets | Horizontal scroll | Introduce reality shifting |
| R5 | Echo Chamber | Vertical climb | Isolate echo platforms |
| R6 | The Gauntlet | Horizontal scroll | Combat pressure |
| R7 | Breather | One-screen box | Safe checkpoint/story |
| R8 | Truth & Lies | Hybrid zig-zag descent | Combine shard choices |
| R9 | Shadow Dance | Vertical descent | Master echo timing under danger |
| R10 | The Mirror | One-screen box | Optional secret mastery test |
| R11 | Convergence | Horizontal -> vertical hybrid | Combine all stage mechanics |
| R12 | Antechamber | Horizontal | Breather and final choice |
| R13 | Memory Keeper | One-screen arena | Boss mastery exam |
| R14 | Aftermath | Horizontal | Exit and reward beat |

## 8. Introduce, Isolate, Combine, Mastery

Truth Shards:
- Introduce: R1, one obvious shard reveals one obvious platform.
- Isolate: R4, Truth creates the only safe forward route.
- Combine: R8, Truth must be chosen while False rewards tempt the player.
- Mastery: R13, use Truth counters against False boss patterns.

False Shards:
- Introduce: R2, red shard creates a single enemy.
- Isolate: R3, risky side path gives reward.
- Combine: R8/R11, False shortcuts plus enemy pressure.
- Mastery: R13, use False counters against Truth boss patterns.

Memory Echo Platforms:
- Introduce: R1, ghost replay hints at a safe jump.
- Isolate: R5, vertical climb depends on echo timing.
- Combine: R9, disappearing platforms and enemy pressure.
- Mastery: R11, echoes appear during combat and reality shifts.

Boss Door / Reality Door:
- Introduce: R4, small door/platform opens from shard reveal.
- Isolate: R12, clean dramatic boss door with no enemies.
- Combine: R13, arena walls/doors become part of boss pacing.

Level pacing from research summary:
- Intro: R1-R3 teach movement, first shard, first choice.
- Spike: R4 introduces reality shift with clear visual drama.
- Breathe: short safe landing after R4 before R5 begins.
- Isolate: R5 teaches vertical echo platforms without heavy combat.
- Combo: R6 combines enemies and hazards.
- Breathe: R7 safe story room.
- Escalate: R8/R9 evolve R3/R5.
- Secret: R10 optional mastery test with visible clue.
- Gauntlet: R11 combines all learned skills.
- Breathe: R12 final calm before boss.
- Boss: R13 uses stage gimmicks in phases.

## 9. Breather Rooms

- R7 after R6: no enemies, story object, checkpoint, lower music intensity.
- R12 after R11: boss door, final shard choice, no platforming danger.
- R14 after R13: victory traversal with no fail state.

Rule:
- After any room with vertical pressure plus enemy pressure, insert either a safe landing, checkpoint, or low-intensity traversal space.

## 10. Secret Test

Room 10: The Mirror

Visual foreshadowing:
- A blue glow should be visible from the main route in R8 or R9.
- The entrance should be reachable only by using a Truth-revealed platform chain.
- Put one harmless mirror shard earlier in R3 so the secret visual has prior meaning.

Requirement:
- Player has collected at least 3 Truth Shards.

Challenge:
- Fight a reflection enemy using the player's double jump and Shard Strike.
- No instant death pits; failure costs time/health, not progression.

Reward:
- Permanent Memory Shard: +10 HP or +5% Shard Strike damage.
- 100 EC.
- Optional lore echo that clarifies Noktara's fall.

## 11. Playtest Checklist

Per mechanic isolation:
- Double jump: verify R1/R2 can be cleared with single jump, while optional pickups reward double jump.
- Truth reveal: verify R4 can be solved without guessing.
- False risk: verify False choices are visibly risky before collection.
- Echo platforms: verify R5 can be cleared without enemies first.
- Boss door: verify the player sees the door before it opens and understands it opened because they approached.

Visual clarity:
- Blue means safe/reveal/Truth.
- Red means risk/reward/False.
- Cyan means door/machine/interactive route.
- Required platforms must contrast against background at camera speed.
- False platforms must have a distinct shimmer, not only color.

Backtracking:
- R4 and R5 should have return ledges so missed pickups are not tedious.
- After R7, unlock a shortcut back to R4/R5 if optional collection matters.
- Do not force players to redo R6 gauntlet for optional R10 attempts.

Optional content:
- Optional routes should give reward, shortcut, spectacle, or lore.
- Optional routes may be harder, but should not punish curiosity with unavoidable damage.
- Secrets should be foreshadowed with a visible clue before the hidden entrance.

## 12. Current Prototype Mapping

`starterq.html` currently maps most closely to this compressed test route:

- Opening floors/platforms: R1/R2 movement intro.
- Wide-gap approach: R4 Shifting Streets blockout placeholder.
- Vertical climb shaft: R5 Echo Chamber placeholder.
- Upper precision route: R8/R9 traversal pressure placeholder.
- Descending gaps: R11 convergence approach placeholder.
- Sliding boss door and red arena: R12/R13 placeholder.

Next implementation pass:
- Add visible room labels/debug zones.
- Add shard pickups as colored rectangles/circles.
- Add Truth-revealed platforms that start hidden.
- Add one optional secret entrance before the boss route.
- Add a lightweight attack rectangle before real enemies.

## 13. Prototype Navigation Audit Rules

Run this checklist after every blockout change:

1. Can the player reach the next room using the intended movement?
2. Is any door/wall physically sealing the route?
3. Is each required platform visible before the jump?
4. Is the gap within the capability budget?
5. Is there a recovery ledge after a high-commitment double jump?
6. Does the boss/arena entrance have a visible open state?
7. Does the return path avoid forcing the hardest challenge twice?

Current known fixes already applied:
- Vertical climb entrance wall was shortened so the player can enter the shaft.
- Boss arena got an approach-triggered sliding door instead of a sealed wall.
