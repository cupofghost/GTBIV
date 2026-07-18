# GTB IV — Characters, Creator & Cutscenes

> Companion to `HANDOFF.md`. Read that first (golden rules, code map,
> conventions). This doc is the plan for **finishing the character models**,
> building a **character creator**, and making **cutscenes actually render
> characters that act** — not just fly the camera past idle NPCs.
>
> Task IDs here (`C1`…`C6`) are referenced from `HANDOFF.md §10`. The dev
> **model viewer `D6`** (in `HANDOFF.md`) is the workbench for all of this.

---

## 0. The one big idea

Every human in the game — pedestrians, cops, gang members, Deb, **and the
player** — is built by a single function, `makePerson(...)`, out of Three.js
primitives (spheres, cylinders, boxes) with a **real articulated rig**. That's
the whole reason this is tractable:

- **Character creator** = expose `makePerson`'s inputs to the player instead of
  randomising them. It's a *refactor*, not a new system.
- **Consistent hero models** (Turbo, Deb) = fixed input specs instead of random.
- **Cutscene acting** = drive the same rig joints the walk-cycle already drives,
  from a data-driven timeline.

We stay **100% procedural and self-contained** — no imported `.glb`/`.fbx`, no
external model files, no new dependency. (See §7 for why, and the one decision
that would change it.)

---

## 1. What exists today (ground truth)

**The builder** — `makePerson(shirt, gender)` (in the `PEDESTRIANS` section):
- Randomises internally: skin colour, hair colour, hair style (incl. bald/
  beard), body width `wid`, gender, outfit (dress / shorts / tank), pants/shoe
  colours, plus a small height jitter (`g.scale.y`).
- Builds an articulated hierarchy: hip→thigh, knee→shin+shoe; pelvis; a torso
  **group** (`torsoG`) with body + chest (+ bust for girls); shoulder→upper arm,
  elbow→forearm+hand+thumb; neck; a head **group** (`headG`) with jaw, eyes
  (white+pupil), brows, nose, mouth, ears, and hair.
- **Exposes the rig** for animation:
  ```js
  g.userData = { legL, legR, armL, armR, body, torso:torsoG, head:headG, gender };
  ```
- Adds a blob shadow and returns the `THREE.Group`.

**The player** is literally one of these:
```js
const player = { mesh: makePerson(0x37c8ff,'guy'), x:…, z:…, heading:0, phase:0, … };
```

**Animation** is hand-driven, not skeletal-skinned. A `phase` accumulator
advances with speed; `Math.sin(phase)` feeds the joints. From `updateFoot`:
```js
const sw = Math.sin(p.phase)*0.55;
u.legL.rotation.x =  sw;  u.legR.rotation.x = -sw;
u.armL.rotation.x = -sw;  u.armR.rotation.x =  sw;
u.torso.rotation.y = Math.sin(p.phase)*0.12*mag;   // walk twist
```
Peds use the same pattern in `updatePeds`; a shooting pose sets
`armL/armR.rotation.x = -2.9`. **This is the animation API** — set joint
rotations. New poses/animations are just new sets of these.

**Cutscenes** — `CUTSCENES` is a data-driven registry; each entry has `shots[]`
of `{duration, pos, lookAt, fov, dialogue, transition, shake}`. `playCutscene(id,
anchorX, anchorZ, onDone)` anchors camera positions to a world point and
`updateCutscene` smoothstep-lerps the camera between shots, showing a dialogue
box. **Limitation:** it only moves the *camera*. Whatever characters happen to be
at the anchor just keep doing their idle/walk loop — they don't turn, gesture, or
enter. To "render cutscenes" we need an **actor layer** (§5).

---

## 2. The character spec (the contract everything shares)

Define one plain-object schema used by the builder, the creator, the hero
registry, saves, and cutscene actors. Proposed shape (extend as fidelity grows):

```js
// a PersonSpec — every field optional; randomPersonSpec() fills gaps
{
  gender: 'guy' | 'girl',
  height: 1.0,                 // multiplier (today's g.scale.y jitter)
  build:  1.0,                 // body width (today's `wid`)
  skin:   0xf0c8a0,
  hair:   { style: 'short'|'buzz'|'bald'|'long'|'ponytail'|'beard'|…, color: 0x1a1a1a },
  outfit: { type: 'tshirt'|'tank'|'dress'|'shorts'|'hoodie'|…,
            shirt: 0x37c8ff, pants: 0x2a3a5c, shoes: 0x1a1a1a },
  face:   { /* room to grow: brow, nose, jaw, eye color… */ },
  accessories: [ /* 'cap','shades','chain'… — added in C3 */ ],
}
```

Keep colours as hex numbers (matches the codebase). Store the spec on the mesh
(`mesh.userData.spec`) so any character can be re-serialised (saves, debugging,
cutscene reuse).

---

## 3. Task cards

### C1 — Refactor `makePerson` to a spec object `P0 · Risk: Med`
**Goal:** `makePerson(spec)` builds deterministically from a `PersonSpec`; a new
`randomPersonSpec()` reproduces **exactly today's** random look. Every existing
NPC spawn becomes `makePerson(randomPersonSpec())` — **zero visible change**.
**Where:** `PEDESTRIANS` (`makePerson`), and each caller (`spawnPed`,
`spawnGangMember`, guards, chaos gang, the `player` init, `spawnDeb`).
**Approach:**
1. Pull every internal `pick(...)`/`rand(...)` in `makePerson` out into
   `randomPersonSpec()` returning a `PersonSpec`.
2. Rewrite `makePerson` to read from `spec`, with per-field fallback to a random
   default so partial specs work (`spec.skin ?? pickSkin()`).
3. Store `mesh.userData.spec = spec` alongside the existing rig `userData`
   (keep `legL/legR/armL/armR/torso/head/gender` — don't break animation).
4. Update callers. Keep a back-compat shim if convenient
   (`makePerson(shirt, gender)` → build a spec) so the diff stays small.
**Acceptance:** Game looks/plays identical to before (crowd variety unchanged);
`makePerson({gender:'guy', skin:…, hair:{…}, outfit:{…}})` produces a specific,
repeatable character; `mesh.userData.spec` round-trips. Verify in the `D6` viewer.

### C2 — Hero registry: consistent Turbo & Deb `P1 · Risk: Low`
**Goal:** Named characters look identical every time and in every cutscene.
**Where:** new `HEROES` map near `makePerson`; the `player` init and `spawnDeb`.
**Approach:** Define fixed specs, e.g.
```js
const HEROES = {
  turbo: { gender:'guy', build:1.08, skin:0xc89060,
           hair:{style:'buzz',color:0x1a1a1a},
           outfit:{type:'tank',shirt:0x37c8ff,pants:0x222833,shoes:0x111} },
  deb:   { gender:'girl', build:0.96, skin:0xf0c8a0,
           hair:{style:'long',color:0x6b4a2f},
           outfit:{type:'dress',shirt:0x8a2a4a,…} },
};
```
Build the player and Deb from these (player spec is overridden by the creator
once `C4` lands). Tune the exact look in the `D6` viewer.
**Acceptance:** Turbo and Deb render the same across a fresh game, a reload, and
both Deb cutscenes; changing `HEROES.turbo` changes the hero everywhere in one
place.

### C3 — Model fidelity pass (scoped) `P2 · Risk: Med`
**Goal:** "Finish" the models — richer heads/hair/outfits — while staying
primitive-based and cheap. Scope to taste; this is where "finished" gets
defined.
**Where:** `makePerson` geometry; new spec fields (`hair.style`s, `outfit.type`s,
`accessories`).
**Approach:** Add hair styles (fade, afro, bun, cap), outfit types (hoodie,
jacket, suit), and simple **accessories** (cap, shades, chain, backpack) as
optional meshes keyed off the spec. Add a couple of face knobs (jaw width, nose
size, eye colour). **Watch the poly/draw-call budget** (`HANDOFF.md` golden rule
#5) — a ped is instanced many times; keep new geometry small and reuse shared
materials where possible. Keep an LOD in mind: distant peds don't need the detail
(pairs with `F3` quality tiers).
**Acceptance:** Noticeably richer, still 60fps with a full crowd on a mid phone;
every new option is drivable from a spec and visible in the `D6` viewer; no
per-ped material explosion (watch draw calls).

### C4 — Character creator `P1 · Risk: Med`
**Goal:** Player builds their Turbo before starting; the choice is saved and used
for the player mesh.
**Where:** new `CHARACTER CREATOR` DOM screen + CSS; boot/start flow;
`localStorage` via **`F1`** (save system); reuses **`D6`** viewer as the live
preview.
**Approach:**
1. A screen shown on **New Game** (skipped if a saved character exists → editable
   later from the pause/settings menu, `F2`).
2. Controls for each spec field: gender, skin swatch, hair style + colour, build,
   height, outfit type + colour swatches, accessories. Plus **Randomize**
   (`randomPersonSpec()`) and a few **Presets** (including "Turbo" default).
3. A live rotating preview (the `D6` turntable) rebuilt on each change — dispose
   the old mesh (see `R1`) to avoid leaks.
4. On confirm: `save()` the spec (`gtb4.save.character`), build `player.mesh`
   from it, proceed.
**Acceptance:** You can build a distinct character, see it live, start the game as
that character, reload → same character persists; **New Game** re-opens the
creator; editing from settings updates the live player mesh. Mobile-landscape
friendly, no control overlap.

### C5 — Cutscene actor & animation layer `P1 · Risk: High`
**Goal:** Cutscenes stage and **animate** characters, not just the camera.
**Where:** `CUTSCENE SYSTEM` (`CUTSCENES` schema, `playCutscene`, `initShot`,
`updateCutscene`, `endCutscene`); a new small **pose/animation** library reusing
the rig joints.
**Approach:**
1. **Pose library** — canned joint-rotation sets applied to any `makePerson`
   mesh: `idle`, `talk` (subtle hand/torso motion), `point`, `armsCrossed`,
   `handsOnHips`, `shrug`, plus a `walkTo` procedural mover. Each is a small
   function `applyPose(mesh, name, t)` that sets `userData` joints — exactly like
   `updateFoot` does.
2. **Actor staging** — extend a cutscene with actors:
   ```js
   deb_confrontation: {
     actors: [
       { role:'player' },                              // reuse the live player
       { hero:'deb', pos:[0,0,0], heading:Math.PI },   // or spawn from a spec/hero
     ],
     shots: [ { …, act:[ {actor:1, anim:'talk'}, {actor:0, anim:'idle'} ] } ],
   }
   ```
   On `playCutscene`, spawn/position any non-`role` actors at the anchor, hide
   conflicting world NPCs, and **clean them up in `endCutscene`** (dispose — `R1`).
3. **Per-shot acting** — add an optional `act:[{actor, anim, lookAt?}]` to the
   shot schema; `updateCutscene` advances each actor's animation by shot time.
   Keep it data-driven and backward-compatible (shots with no `act` still work).
4. Sync dialogue → the speaking actor plays `talk`; others `idle`.
**Acceptance:** The two Deb scenes show Deb *acting* (turning to face, gesturing
while she talks) with Turbo reacting, then clean up with no leftover actors and no
leaked meshes; existing camera moves/dialogue/fades still work; a cutscene with no
`act` data behaves exactly as today.

### C6 — Faces: expressions & lip-flap (nice-to-have) `P3 · Risk: Med`
**Goal:** Cheap facial life during dialogue.
**Where:** `makePerson` head (`mouth`, `brow` meshes are already there); driven
from `showDialogue`/`updateCutscene`.
**Approach:** Simple **lip-flap** — open/close the existing `mouth` mesh (scale/
position) while a line plays, gated to the speaker; small **brow** raises for
emphasis; optional blink. Keep it subtle and cheap.
**Acceptance:** During spoken lines the speaker's mouth moves and reads as
talking; no effect on non-speaking characters; negligible perf cost; respects the
Reduce-Motion setting (`A2`) if present.

---

## 4. Dependencies & suggested order

```
D6  model viewer/turntable      (HANDOFF.md — build first; it's the workbench)
C1  makePerson(spec) refactor    ← unlocks everything below
C2  hero specs (Turbo, Deb)
F1  save system                  (HANDOFF.md — needed before C4 can persist)
C4  character creator
C5  cutscene actors + animation
C3  fidelity pass                (parallel/ongoing, as taste dictates)
C6  faces / lip-flap
```

`C1` is the keystone — do it early and verify the crowd is unchanged before
anything builds on top. `C5` is the riskiest (touches the cutscene runtime and
spawns/cleans actors); land it in small steps (pose library → single staged
actor → full `act` timeline).

---

## 5. Verification (in addition to `HANDOFF.md §9`)

- **No crowd regression after C1:** a busy street looks as varied as before.
- **Hero consistency:** Turbo/Deb identical across reloads and every cutscene.
- **Creator persistence:** chosen character survives reload; New Game re-opens it.
- **Cutscene cleanup:** after any cutscene, entity counts return to baseline
  (check with the `D3` debug HUD) — no orphaned or leaked actors.
- **Perf:** full crowd + fidelity still holds framerate on a mid phone; watch
  draw calls (fidelity is the easiest place to blow the budget).
- **Everything checked in the `D6` viewer** before wiring into gameplay.

---

## 6. Conventions specific to characters

- **One builder.** Don't fork a second character function — extend `makePerson`
  via the spec. Peds, heroes, creator, and cutscene actors must all come from it,
  or they'll drift apart.
- **Animate via `userData` joints only.** Never rebuild a mesh to animate it;
  set `legL/legR/armL/armR/torso/head` rotations like the existing code.
- **Share materials/geometry across the crowd** where you can; **dispose**
  per-character meshes when a character is gone for good (`R1`). The creator and
  cutscene actors both create/destroy meshes — they must not leak.
- **Colours are hex numbers.** Match the codebase (`0xrrggbb`).

---

## 7. The one decision that changes this plan

**Do we stay procedural, or import real 3D models (`.glb`)?**

**Recommendation: stay procedural.** It keeps the game self-contained and
zero-build (a golden rule), keeps characters cheap enough to crowd a city on a
phone, and — crucially — makes the character creator trivial because the model is
*already* parametric. The primitive/low-poly look is the established aesthetic.

Importing rigged GLTF models would mean: a loader + skinned-mesh animation, real
asset files in the repo (size, licensing), a much harder creator (morph targets/
blend shapes), and a bigger perf bill per NPC. It's a different project. If the
art ambition eventually demands it, that's an **expansion-phase** decision to make
deliberately with Austin — not part of this pass.
