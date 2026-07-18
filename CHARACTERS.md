# GTB IV — Characters, Creator & Cutscenes

> Companion to `HANDOFF.md`. Read that first (golden rules, code map,
> conventions). This is the plan for **rebuilding the character model** so it
> looks better and is **player-paintable**, building a **character creator +
> paint/edit page**, and making **cutscenes render characters that act**.
>
> Task IDs (`C1`…`C9`) are referenced from `HANDOFF.md §10`. The dev **model
> viewer `D6`** (in `HANDOFF.md`) is the workbench/preview for all of this.

---

## 0. The big idea

Every human — pedestrians, cops, gang members, Deb, **and the player** — is built
by one function, `makePerson(...)`, from Three.js primitives with a **real
articulated rig**. Today it's *flat-coloured primitive soup*: many little meshes,
solid colours, **no textures, no usable UVs**. The new direction needs the
opposite — a few clean, **UV-mapped, texture-backed surfaces** so the player can
**paint their own shirt, shorts, and face**, with **generated hair** on top.

So the work is two things:
1. **Rebuild the body** to look more realistic (fix the sphere "shoulder-pad"
   look) and to expose clean paintable surfaces.
2. **Give the hero/player model paintable texture regions** (shirt / pants /
   face) driven by `<canvas>` → `THREE.CanvasTexture`, plus a **paint page** to
   draw on them and a **hair generator** to pick styles.

We stay **100% procedural and self-contained** — no imported `.glb`, no external
model files (see §9). Painting uses canvas textures, which **this repo already
does** for the pizza sign, ground, water, and sky (e.g. `new
THREE.CanvasTexture(canvas)` with `material.map` and `.needsUpdate=true`) — so
it's an established pattern here, not new tech.

---

## 1. What exists today (ground truth)

**Builder** — `makePerson(shirt, gender)` (in the `PEDESTRIANS` section):
- Randomises internally: skin, hair colour/style (incl. bald/beard), body width
  `wid`, gender, outfit (dress/shorts/tank), pants/shoe colours, height jitter.
- Builds an articulated hierarchy of primitives:
  - **Torso (the problem area):** a `CylinderGeometry` `body` + a
    `SphereGeometry` `chestUp` cap, and — the "shoulder pads" — a small
    `SphereGeometry` `shoulder` **ball at the top of each arm**
    (`sh.position.set(side*(bw/2+0.06),1.47,0)`). The arm juts out with a
    visible ball on top. That reads as shoulder pads.
  - Legs (hip→thigh, knee→shin+shoe), pelvis, arms (shoulder→upper→elbow→fore→
    hand+thumb), neck, head group with **3D** eyes/brows/nose/mouth/ears + hair.
- **Materials are flat** `MeshLambertMaterial({color})` — **no `map`, no UVs used.**
- **Exposes the rig** for animation:
  ```js
  g.userData = { legL, legR, armL, armR, body, torso:torsoG, head:headG, gender };
  ```

**The player is one of these:** `makePerson(0x37c8ff,'guy')`.

**Animation** is hand-driven (not skinned): a `phase` counter feeds
`Math.sin(phase)` into the rig joints (see `updateFoot`/`updatePeds`). Setting
`userData.legL/legR/armL/armR/torso/head` rotations **is the animation API.**

**Cutscenes** (`CUTSCENES`, `playCutscene`) currently **only move the camera**
around whatever stands at an anchor point — characters don't act (§ tasks C8/C9).

---

## 2. Target model architecture

### 2a. Better body geometry (fixes shoulders + "more realistic")
Replace the ball-jointed torso with smooth, sloped forms. Do this for **all**
peds — it's cheap geometry and lifts the whole crowd.
- **Torso = one `LatheGeometry`** (a profile revolved around Y). Author the
  profile so it flows: waist → ribcage → chest (widest) → **deltoid/shoulder
  slope** → taper to neck. A single revolved surface gives **natural sloped
  shoulders with no ball**, and — crucially — **one continuous wrap-around UV**
  (see 2b) that's paintable. This replaces `body` + `chestUp` + the shoulder
  spheres in one mesh.
- **Arms** emerge from *under* the shoulder slope: replace the visible `shoulder`
  ball with a rounded cap tucked inside the torso's deltoid (hide the pivot
  sphere, don't delete the pivot **group** — animation needs it). Upper/forearm
  stay tapered cylinders with rounded ends (capsule feel).
- **Legs** = tapered cylinders (or a small lathe each) → clean wrap UV for pants.
- **Proportions/curves:** nudge toward realism — better neck→shoulder transition,
  subtle limb taper, rounder hips, softer joints. Keep the stylised low-poly
  look (this is a synthwave game, not photoreal — see §9).
- **Segments:** the hero/player can afford more segments than background peds.
  See the two-tier fidelity note in 2d.

### 2b. Paintable texture regions (hero/player tier)
Give the hero model **three paintable surfaces**, each backed by its own
`<canvas>` → `CanvasTexture` set as `material.map`:

| Region | Mesh(es) | Canvas | UV behaviour to expose in the paint page |
| --- | --- | --- | --- |
| **Shirt** | lathe torso (+ optional sleeve band on upper arms) | e.g. 512² | Lathe/cylinder UV: `u` wraps around the body (0→1), `v` runs waist→neck. Orient the seam to the **back**; the **chest-front** sits at the middle of the canvas. |
| **Pants / shorts** | leg meshes | 512² (or 256² each) | Cylinder wrap per leg: `u` around, `v` hip→ankle. Shorts = only paint the upper `v` band. |
| **Face** | head (front region) | 256² | Sphere UV front patch. The paint page shows just the **oval face area** with guides (eye line, centre, mouth line, hairline) — not the whole sphere wrap. |

Rules:
- Painting = draw on the 2D canvas, then `texture.needsUpdate = true` to re-upload
  (cheap; do it throttled while dragging).
- The paint page must **mirror each region's UV layout** with faint guide overlays
  (FRONT / BACK / side-seam for shirt & pants; face guides for the head) so the
  user knows where a design lands. **MVP mapping = simple wrap-around rectangle
  with guides.** A nicer *garment-atlas* ("paper-doll" front/back/sleeve panels
  with custom UVs) is a **stretch upgrade**, not the first version — flag it, do
  the simple wrap first.
- **Face:** for the hero, the painted texture carries eyes/brows/mouth; keep an
  optional subtle **3D nose** for form. (Background peds keep the current 3D
  face features — cheaper than a texture each.)

### 2c. Generated hair (pick, don't paint)
Hair stays **geometry**, generated and colourable — the user picks a style +
colour, they don't draw it. Refactor the existing inline hair-style code into a
small **hair library**: a set of named styles (short, buzz, fade, long,
ponytail, bun, afro, cap/beanie, bald, + beard as an add-on), each a function
that builds meshes onto `headG`, tinted by `hair.color`. New styles = new entries.

### 2d. Two-tier fidelity (perf guardrail)
**Do not put canvas textures on the whole crowd** — a `CanvasTexture` per ped
blows up memory and draw calls. Split by the spec:
- **Hero/player/cutscene actors:** textured (paintable) + higher segment counts.
- **Background crowd:** flat `MeshLambertMaterial` colours on the *same
  geometry*, lower segments, current 3D face. Reuse shared materials/geometry
  across peds where possible.
`makePerson(spec)` chooses the path from whether the spec carries textures/`detail`
(see §3). This ties into `F3` quality tiers and `R1` disposal in `HANDOFF.md`.

---

## 3. The character spec (the shared contract)

One plain-object schema used by the builder, creator, paint page, hero registry,
saves, and cutscene actors. Colours are hex numbers (matches the codebase).

```js
// PersonSpec — every field optional; randomPersonSpec() fills gaps for NPCs
{
  gender: 'guy' | 'girl',
  detail: 'crowd' | 'hero',       // hero => textured + higher-poly path
  height: 1.0,                     // multiplier (today's g.scale.y jitter)
  build:  1.0,                     // body width (today's `wid`)
  skin:   0xf0c8a0,
  hair:   { style:'short'|'buzz'|'fade'|'long'|'ponytail'|'bun'|'afro'|'cap'|'bald',
            color:0x1a1a1a, beard:false },
  outfit: {
    // NPC: just colours. Hero: `tex` is a painted canvas / PNG data URL.
    shirt: { color:0x37c8ff, tex:null },
    pants: { color:0x2a3a5c, tex:null, shorts:false },
    shoes: { color:0x1a1a1a },
    dress: false,
  },
  face:   { tex:null, /* hero paints this; NPCs use 3D features */ },
}
```

Store it on the mesh: `mesh.userData.spec = spec` so any character can be
re-serialised (saves, cutscene reuse, debugging). Painted `tex` values persist as
PNG **data URLs** in the save (see C6).

---

## 4. Task cards

### C1 — Refactor `makePerson` to a spec object `P0 · Risk: Med`
**Goal:** `makePerson(spec)` builds deterministically from a `PersonSpec`;
`randomPersonSpec()` reproduces **today's** random NPC look exactly. Every NPC
spawn becomes `makePerson(randomPersonSpec())` — zero visible change.
**Where:** `PEDESTRIANS` (`makePerson`) + callers (`spawnPed`, gang/guard/chaos
spawns, `player` init, `spawnDeb`). Keep a `makePerson(shirt,gender)` shim if it
keeps the diff small.
**Acceptance:** Crowd looks/behaves identical; a full spec yields a specific
repeatable character; `mesh.userData.spec` round-trips; rig `userData` unchanged.
Verify in the `D6` viewer.

### C2 — Body geometry overhaul: shoulders + realism `P1 · Risk: Med`
**Goal:** Kill the "shoulder-pad" spheres; smoother, more realistic body. Applies
to all peds. **This is the top visual complaint — do it early.**
**Where:** the torso/arm build in `makePerson` (see §2a).
**Approach:** Lathe-profile torso with sloped shoulders replacing
`body`+`chestUp`+shoulder balls; arms emerge under the deltoid with hidden pivots;
tapered rounded limbs; better proportions. Keep the rig **groups** (`torso`,
`armL/R` shoulders) so animation still works — only the *visible* geometry
changes.
**Acceptance:** No visible shoulder balls; arms connect naturally; walk/idle/
shoot poses still animate correctly; crowd still holds framerate; looks like the
same character family, just better. Eyeball every angle in `D6`.

### C3 — Paintable UV texture regions + two-tier fidelity `P1 · Risk: High`
**Goal:** Hero model has shirt/pants/face surfaces backed by `CanvasTexture`s with
clean, documented UVs; crowd stays flat-coloured for perf.
**Where:** `makePerson` (hero path), materials; depends on **C1 + C2** (stable
geometry/UVs first).
**Approach:** Per §2b/§2d. Give each paintable mesh a canvas-backed material when
`spec.detail==='hero'` (or when a `tex` is supplied); otherwise flat colour.
**Document the exact UV→canvas mapping** for each region (this is the contract the
paint page in C5 mirrors). Default (unpainted) textures = the base garment colour.
**Acceptance:** A hero character shows a test pattern correctly wrapped on shirt/
pants/face (chest-front centred, seam at back, face oval upright); crowd still
uses flat colours; no per-ped texture on background NPCs; disposal (`R1`) frees
hero textures on teardown.

### C4 — Hair generator `P2 · Risk: Low`
**Goal:** A tidy library of generated, colourable hair styles the user can pick.
**Where:** extract/expand the inline hair code in `makePerson` (§2c).
**Acceptance:** Each style builds correctly on the head, tints by `hair.color`,
switchable live in `D6`; beard toggles independently; bald works.

### C5 — Paint / Edit page `P1 · Risk: High`
**Goal:** The tool the user asked for — draw shirts, shorts, and face details on
the model with a live 3D preview.
**Where:** a new DOM screen + CSS (reachable from the creator, C6, and from `?dev=1`
for standalone iteration); reuses the `D6` turntable as the live preview; edits the
C3 region canvases.
**Approach:**
- **Region tabs:** Shirt · Pants/Shorts · Face (Shoes/Sleeves later). Each shows
  its flat template canvas with **guide overlays** mirroring the C3 UV layout
  (FRONT/BACK/seam; face guides).
- **Tools:** brush (size, colour, opacity), eraser, fill/bucket, colour palette +
  picker, **undo/redo**, clear, and **mirror/symmetry** (huge for faces &
  symmetric shirt designs). Optional simple shapes/stamps.
- **Live preview:** the turntable rebuilds/repaints as you draw
  (`texture.needsUpdate=true`, throttled). Rotate to check wrap/seams.
- **Import/Export:** load/save each region as a PNG (data URL) so designs can be
  backed up or shared; also feeds the save (C6).
- Touch-friendly (it's a mobile game) **and** mouse — the canvas must take pointer
  events at phone size without fighting the page.
**Acceptance:** You can paint a logo on the chest and see it land correctly on the
3D chest; draw a face and it maps to the head; shorts paint only the upper leg;
mirror works; undo/redo works; export→import round-trips a design; usable with a
finger in landscape.

### C6 — Character creator (picker + paint + save) `P1 · Risk: Med`
**Goal:** Full creator: pick base attributes, paint the textures, save the result
as the player.
**Where:** new `CHARACTER CREATOR` flow; boot/New-Game; `localStorage` via **F1**;
embeds C5's paint page and the `D6` preview.
**Approach:** Base pickers (gender, skin, build, height, hair style/colour, outfit
type + base colours) → **Paint** step (C5) → confirm. **Randomize**
(`randomPersonSpec`) + **Presets** (incl. "Turbo"). On confirm, save the full spec
**including painted `tex` PNGs** (`gtb4.save.character`) and build `player.mesh`
from it. Re-editable later from the pause/settings menu (F2).
**Acceptance:** Build a distinct painted character, start as them, reload → same
character (designs intact) persists; New Game re-opens the creator; editing from
settings updates the live player mesh. Watch localStorage size — downscale/PNG the
textures if needed (§7).

### C7 — Hero registry: Turbo & Deb `P2 · Risk: Low`
**Goal:** Named characters look identical everywhere via fixed specs (Turbo can
default to the creator's "Turbo" preset; Deb is authored).
**Where:** a `HEROES` map; `player` init + `spawnDeb`; cutscene actors (C8).
**Acceptance:** Turbo/Deb render consistently across reloads and every cutscene;
one edit point changes them everywhere.

### C8 — Cutscene actor & animation layer `P1 · Risk: High`
**Goal:** Cutscenes stage and **animate** characters, not just the camera.
**Where:** `CUTSCENE SYSTEM`; a new pose/anim library reusing the rig joints.
**Approach:**
- **Pose library:** `applyPose(mesh,name,t)` sets `userData` joints — `idle`,
  `talk`, `point`, `armsCrossed`, `handsOnHips`, `shrug`, plus a `walkTo` mover.
- **Actor staging:** extend a cutscene with `actors:[{role:'player'} | {hero:'deb',
  pos,heading}]`; spawn/position non-`role` actors at the anchor, hide conflicting
  world NPCs, and **clean up in `endCutscene`** (dispose — `R1`).
- **Per-shot acting:** optional `act:[{actor,anim,lookAt?}]` on each shot;
  `updateCutscene` advances each actor's animation by shot time. Backward-
  compatible: shots with no `act` behave as today.
- Speaking actor plays `talk`; others `idle`.
**Acceptance:** The Deb scenes show Deb acting (turns to face, gestures) with Turbo
reacting, then clean up with no leftover/leaked actors; existing camera/dialogue/
fades still work; a no-`act` cutscene is unchanged.

### C9 — Faces: painted detail + lip-flap/expressions `P3 · Risk: Med`
**Goal:** Facial life during dialogue, on the painted-face model.
**Where:** head build; driven from `showDialogue`/`updateCutscene`.
**Approach:** Since the hero face is a texture (C3/C5), do lip-flap either by
swapping/oscillating a small **mouth overlay** on the face canvas, or a subtle 3D
mouth mesh for heroes; small brow raises / blinks for emphasis. Gate to the
speaker; cheap; respect the Reduce-Motion setting (`A2`).
**Acceptance:** The speaker's mouth reads as talking during lines; non-speakers
unaffected; negligible perf cost.

---

## 5. Dependencies & suggested order

```
D6  model viewer/turntable      (HANDOFF.md — the workbench/preview; build first)
C1  makePerson(spec) refactor    ← keystone; verify crowd unchanged
C2  body geometry overhaul        ← fixes shoulders / realism (top complaint)
C3  paintable UV regions          ← establishes the canvases + UV contract
C4  hair generator
F1  save system                  (HANDOFF.md — needed before C6 persists designs)
C5  paint / edit page             ← the drawing tool + live preview
C6  character creator             ← picker + paint + save
C7  hero specs (Turbo/Deb)
C8  cutscene actors + animation
C9  faces / lip-flap
```

`C1→C2→C3` is the critical path (geometry must settle before UVs, UVs before the
paint page). `C3` and `C5` are the riskiest — land them in small steps (one region
at a time: shirt → pants → face).

---

## 6. Verification (plus `HANDOFF.md §9`)

- **No crowd regression after C1/C2:** a busy street looks as varied as before,
  now with better shoulders; framerate holds with a full crowd on a mid phone.
- **UV correctness (C3):** a test grid/pattern wraps predictably — chest-front
  centred, seam at back, face oval upright, shorts only on the upper leg.
- **Paint fidelity (C5):** what you draw on the template lands where you expect on
  the 3D model; mirror/undo/redo/export all work; usable with a finger in landscape.
- **Persistence (C6):** painted character survives reload; New Game re-opens the
  creator; watch `localStorage` size (a few 256–512² PNGs per character; downscale
  if near the ~5MB budget).
- **Cutscene cleanup (C8):** entity counts return to baseline after any cutscene
  (check the `D3` debug HUD) — no orphaned/leaked actors or textures.
- **Everything checked in `D6` first** before wiring into gameplay.

---

## 7. Conventions specific to characters

- **One builder.** Extend `makePerson` via the spec — don't fork a second person
  function. Peds, heroes, creator, and cutscene actors all come from it.
- **Animate via `userData` joints only.** Never rebuild a mesh to animate it.
- **Textures are hero-tier only.** Keep the crowd flat-coloured; share materials/
  geometry; **dispose** per-character meshes *and* their canvas textures when a
  character is gone for good (`R1`). The creator and cutscene actors create/destroy
  meshes and textures — they must not leak.
- **Canvas-texture pattern:** follow the repo's existing usage (pizza sign, ground,
  water) — `document.createElement('canvas')` → draw → `new
  THREE.CanvasTexture(c)` → `material.map=tex` → `tex.needsUpdate=true`.
- **Colours are hex numbers** (`0xrrggbb`); painted designs are PNG data URLs.

---

## 8. The one decision that changes this plan

**Stay procedural, or import real 3D models (`.glb`)?**

**Recommendation: stay procedural.** It keeps the game self-contained/zero-build,
keeps characters cheap enough to crowd a city on a phone, and — the whole reason
the creator + paint page are even feasible — makes the model *parametric and
canvas-paintable* by construction. The stylised low-poly look is the established
aesthetic; "more realistic" here means better forms and real textures, **not**
photoreal.

Importing rigged GLTF models would mean a loader + skinned animation, real asset
files (size/licensing), morph-target-based creation (much harder painting), and a
bigger per-NPC perf bill. That's a different project and an **expansion-phase**
decision to make deliberately with Austin — not part of this pass.
