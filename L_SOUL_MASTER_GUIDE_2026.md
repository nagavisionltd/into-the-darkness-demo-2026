# L-Soul Master Character Guide (2026)
## Project: Into The Darkness

### 👤 Character Profile: L-Soul
L-Soul is the definitive protagonist of *Into The Darkness*. A powerful warrior balancing high-speed agility with heavy elemental mastery.

*   **Visual Identity (High-Fidelity):** Bearded Black man with short black hair, yellow-rimmed glasses, white glowing eyes, blue overcoat, pink t-shirt, dark cargo pants, and white sneakers.
*   **Sprite Variation Note:** Current sprite sets represent L-Soul in a **blue suit with a t-shirt**. Future outfits will be standardized to this frame architecture.
*   **Vibe:** 90s OVA Anime / Cel-Shaded. Atmospheric, dark, and kinetic.

---

## 📐 1. Technical Standards

| Category | Standard | Notes |
|----------|----------|-------|
| **Art Style** | Cel-Shaded / 90s OVA | Bold outlines, high-contrast shadows. |
| **Grid System** | 5 Cols x 3 Rows | 15 total frames per 9:16 sheet. |
| **Baseline** | Static Floor Line | All frames must share the exact same vertical floor anchor. |
| **Background** | Pure Green (#00FF00) or White | For flawless chroma-keying. |
| **Scale** | 250px Target Height | Sized for 1080p atmospheric contexts. |

---

## ⚔️ 2. The Final 19-Move List

### 2.1 Movement & Recovery
| Move | Keyboard | Control Pad | Detail / Juice |
| :--- | :--- | :--- | :--- |
| **Walk/Run** | **WASD** | L-Stick | 8-frame loop. Stride matches speed. |
| **Jump** | **W** | **Up** | 4-frame logic. Apex suspension. |
| **Somersault** | **W (Air)** | **Up (Air)** | **Double-Jump.** Fast rotation with blur. |
| **Air Recovery** | **W (Hitstun)** | **Up (Hitstun)** | **DBZ Flip.** Regain footing instantly. |
| **Dash** | **Space** | **R1** | 1-frame blur pose. `velX = 600`. |
| **Hover/Flight** | **Shift** | **Hold R2** | Gravity 0. Tilting anims based on dir. |
| **Wall Slide** | Dir + Wall | L-Stick + Wall | `velY` cap 50. Sparks VFX. |
| **Wall Jump** | Jump at Wall | Up | Push-off force in opposite dir. |
| **Ledge Grab** | Auto-Detect | Auto-Detect | Snaps to ledge. Up to pull-up. |

### 2.2 Melee Combat (Weighted Kinetic System)
| Move | Keyboard | Control Pad | Detail / Juice |
| :--- | :--- | :--- | :--- |
| **9-Hit Combo** | **V** | **Square** | **Rhythm:** Fast (1-3) -> Med (4-6) -> Flurry (7-8) -> Heavy Finisher (9). |
| **3-Hit Air** | **V (Air)** | **Square (Air)** | **DBZ Juggling.** Gravity 0 while hitting. |
| **Dash Attack** | **Space + V** | **R1 + Square** | Shoulder bash. Maintains dash momentum. |
| **Jump Attack** | **V + S** | **Square + Dn** | Diagonal dive kick. Dust landing impact. |

### 2.3 Elemental Specials (Current: Ice)
| Move | Keyboard | Control Pad | Detail / Juice |
| :--- | :--- | :--- | :--- |
| **E-Blast (Tap)** | **C** | **Triangle** | Fast projectile (3-hit capability). |
| **E-Blast (Hold)**| **C (Hold)** | **Triangle (Hold)**| **Charge Shot.** Level 1 (Cyan), Level 2 (White). |
| **Ice Shard** | **F** | **Circle** | 3 rapid shards fired at angles. |
| **Ice Wave** | **G** | **X (Cross)** | Ground slam. **FREEZES** enemies (2.5s). |
| **Super Special** | **N** | **L1 + R1** | **Frozen Singularity.** Time freeze + screen wipe. |

### 2.4 Defense & Utility
| Move | Keyboard | Control Pad | Detail / Juice |
| :--- | :--- | :--- | :--- |
| **Guard/Block** | **B** | **L1** | 80% Dmg reduction. Bracing pose. |
| **Flash Step** | **B + WASD** | **L1 + L-Stick** | 400ms Invulnerability. Ghosting VFX. |
| **Crouch** | S (Hold) | L-Stick Dn | 50% Hitbox reduction. Ducking pose. |

---

## ⚙️ 3. Technical Implementation Patterns

### 3.1 Variable Frame Duration
Implement weighted animation by defining non-uniform durations (e.g., 30ms startup vs 400ms heavy impact).

### 3.2 Legacy Ghosting (Flash Step)
Spawn non-colliding sprites at the player's position every 50ms during high-velocity or invulnerable states.

### 3.3 Screen-Space Juice
*   **Hitstop:** 8-frame pause on combo hit 9.
*   **Screenshake:** ±5px jitter on heavy impacts.
*   **Freeze Logic:** Frozen enemies are tinted `#00ffff`, `velocity = 0`.

---

**Version:** 3.0 (Into The Darkness Edition)  
**Maintained By:** Gemini CLI / Naga Hub Core  
**Standardized:** May 17, 2026
