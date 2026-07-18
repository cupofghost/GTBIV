# GTB IV — Engineering Handoff & Improvement Plan

> **Audience:** the coding agent (Kimi3) picking up implementation work on
> *Grand Turbo Boost IV: San Chaos*.
> **Author role:** architecture / planning (Claude). **Owner:** Austin.
>
> Read this top-to-bottom once before touching code. It tells you what the game
> is, how the one big file is organised, the rules you must not break, and a
> prioritised backlog of self-contained tasks. Each task in
> [§8 The Improvement Backlog](#8-the-improvement-backlog) is written to be
> picked up on its own — "do **F1**" is a complete instruction.

---

## 1. TL;DR

- The **entire game is one file**: `index.html` (~5,000 lines). Markup + CSS +
  ~4,560 lines of game JS. Three.js is vendored as `three.min.js` (r128).
- **Zero build step.** It's a static site; it deploys to GitHub Pages as-is and
  must keep working by just opening the served URL. **Do not add a bundler,
  npm dependency, framework, or transpile step.**
- It's already a rich GTA-style sandbox: procedural city, driveable cars +
  bikes + helicopters, cop AI + cop helis, pedestrians + dogs, a heist system,
  a rival pizza-gang war, random missions, cutscenes, procedural radio, and
  voiceover. **Respect the existing code — it is dense but deliberate.** Prefer
  surgical edits over rewrites.
- The work now is **general polish and depth before any expansion**: make what
  exists feel great, run smoothly on phones, and persist between sessions.

---

## 2. Golden Rules (do not break these)

1. **Stay zero-build and self-contained.** No CDN links, no `npm install`, no
   bundler, no ES-module transpile that needs tooling. Everything ships as
   plain files served statically. If you split JS (see **X1**), use ordered
   plain `<script>` tags — still no build.
2. **Keep Three.js at the vendored r128 (`three.min.js`).** Don't bump it,
   don't fetch it from a CDN. APIs like `THREE.Geometry` removal, color
   management, etc. changed in later versions — r128 is the contract.
3. **Audio must be fetched over HTTP.** The game `fetch()`es `.mp3` assets, so
   `file://` silently drops sound. Always test on a local server (§3).
4. **Mobile-first, landscape.** This is a PWA for landscape phones. Every UI or
   control change must be validated at a phone-sized landscape viewport (e.g.
   ~800×390) with touch, not just desktop + keyboard. Don't let new UI overlap
   the joystick, pedals, or action buttons.
5. **Preserve the performance budget.** Target 60fps on a mid phone, never drop
   below ~30. The render loop runs every frame — anything you add inside
   `loop()` / the `update*` functions must be cheap. Reuse vectors, avoid `new`
   in hot paths, respect the existing pools.
6. **One change per commit, always runnable.** The game must launch and play
   after every commit. If a task is big, land it in small verified steps. Never
   leave `main`/the branch in a broken state.
7. **Don't change the deploy shape.** Assets are referenced by plain relative
   paths at repo root. New assets go at root (or a subfolder referenced
   relatively) and must be committed.
8. **Ask before large refactors or new systems.** Anything that rewrites a
   whole system, changes the save format after saves ship, or edges from
   "polish" into "expansion" (new map, new game mode) needs sign-off first.

---

## 3. How to Run & Verify

```bash
# from repo root
python3 -m http.server 8099
# open http://localhost:8099/index.html
```

Desktop keyboard controls for quick testing: `W A S D` move/drive, `F`
enter/steal vehicle, `E` punch, `G` gun, `Space` jump, `Q` radio, `N`
day/night, `C` crouch, `M` Pizza Wars. Look = drag the **right** half of the
screen.

**There is no automated test suite.** Verification is by playing. For every
change, run the relevant [Verification Checklist](#9-verification--definition-of-done)
in a **landscape phone-sized viewport** (browser devtools device mode), with
sound on, and confirm nothing regressed. Watch the on-screen `fps` readout
(top-of-loop, id `fpsWarn`) — a change that drops it is a bug.

---

## 4. Architecture Overview

### Tech
- **Rendering:** Three.js r128 (`three.min.js`), one `WebGLRenderer`
  (`antialias:true`, `powerPreference:'high-performance'`, pixel ratio capped
  at `min(devicePixelRatio, 1.75)`). No shadow maps — the game uses cheap
  **blob shadows** (`makeShadow`) and instanced meshes for density.
- **Audio:** Raw **Web Audio API** — one `AudioContext` (`AC`), a `masterGain`,
  a live engine synth (oscillators + filters), a fully **procedural radio**
  (3 stations synthesised from `sKick/sSnare/sBass/sPad/…`), a `sfx` object of
  one-shot synth effects, and a **voiceover** system that both plays recorded
  `.mp3` narration and synthesises "wah-wah" NPC speech.
- **UI/HUD:** Plain DOM overlaid on the WebGL canvas (see §6.7). Styled by the
  single `<style>` block (lines ~15–418).
- **PWA:** `manifest.json` + icons; installable, fullscreen, landscape-locked.

### File layout (everything is at repo root, referenced by relative path)
| File | Purpose |
| --- | --- |
| `index.html` | The whole game — markup, CSS, and all logic |
| `three.min.js` | Vendored Three.js r128 |
| `manifest.json`, `icon-512.png`, `apple-touch-icon.png` | PWA |
| `panel1-3.jpg` | Intro cinematic key-art (placeholders) |
| `vo1-4.mp3`, `t_run1-3.mp3`, `t_shoot1.mp3` | Voiceover + catchphrases |
| `HANDOFF.md` | **This doc** |

### Structure of `index.html`
```
lines   1– 14   <head>, meta, PWA links
lines  15–418   <style>   — all CSS (HUD, controls, overlays, cinematics)
lines 301–418   <body>    — DOM: HUD, joystick, pedals, buttons, overlays
line   419       <script src="three.min.js">
lines 420–4979  <script>  — the entire game (see the Code Map in §5)
```

---

## 5. The Code Map

The JS is organised into labelled sections. **Navigate by grepping the section
banner, not by line number** (line numbers drift as you edit). Every banner
looks like:

```js
// ================= CARS =================
```

Sections, in file order, with what lives in each:

| Banner / area | What's in it |
| --- | --- |
| top of `<script>` | **Helpers & global state** — `rand/randi/pick/clamp/lerp/angDiff`, `TAU`, `$`, and the two master state objects **`G`** and **`WORLD`** (see §6.1) |
| `AUDIO` | `initAudio`, engine synth, `sfx` object, procedural radio (`STATIONS`, `scheduleMusic`), dash gauge drawing |
| `THREE SETUP` | `scene`, `camera`, `renderer`, sky/sun textures, lights |
| `CITY` | Procedural block/building/road generation, `intersections`, water, ramps, street furniture, collision helpers (`buildingHit`, `rampHit`, `resolveFootCollision`) |
| `PARTICLES` | Fixed-size pool (`P_MAX=360`, `parts[]`), `spawnP`, `burst`, `updateParticles`, colour constants |
| `BLOB SHADOWS` | `makeShadow` |
| `CARS` | `CARTYPES`, `makeCarMesh`, `makeCar`, traffic spawn |
| `PEDESTRIANS` | `makePerson` (rigged limbs), dogs, `spawnPed`, chatter |
| `PIZZA DELIVERY SYSTEM` | Jackable pizza cars, `activeDelivery`, delivery loop |
| `RIVAL PIZZA GANG` | `chaosDrivers`, `gangMembers`, turf on minimap |
| `PIZZA WARS MISSION` | Scripted gang-war mission (`startPizzaWars`) |
| heist funcs | `spawnGuards`, `updateGuards`, `updateSafeCrack`, `checkHeistTriggers`, `updateHeistHUD` |
| pickups | `pickups`, `pickupDefs`, `scatterPickups`, `collectPickups` |
| `HELICOPTERS` | Player heli + `spawnCopHeli`/`updateCopHeli` |
| `TALKING PEDS` | Speech bubbles, `wahVoice`, `doTalk` |
| `WEAPONS` | `cycleWeapon`, `doAttack`, rockets, `explode`, `damageArea` |
| input | `joyStart/Move/End`, `doJump`, `applyLook`, `pollKeys` |
| `WANTED` | `addHeat`, `clearHeat`, `spawnCop`, `updateWanted` |
| `CAR PHYSICS` | `carPhysics`, `damageCar` |
| `PLAYER: FOOT & CAR` | `updateFoot`, `updateCarMode`, enter/exit, punch, horn |
| `HUD / TOASTS` | `toast`, `addMoney`, `updateStarsHUD`, `setMissionHUD`, `cycleRadio` |
| `MISSIONS` | `startMission` (5 random types), `updateMission`, complete/fail, beacon |
| `AI` | `updateTraffic`, `updateCops`, `updatePeds`, pickup visuals |
| `BUSTED / WASTED` | `bigEvent`, `respawn`, `busted`, `wasted` |
| `CAMERA` | `updateCamera`, `cameraCollide`, `shake` |
| `MINIMAP` | `drawMinimap` |
| `MAIN LOOP` | `loop()` — the one `requestAnimationFrame` driver, `bootSpawns` |
| `ORIENTATION` | `checkOrientation`, fullscreen |
| `ANIMATED INTRO` | Fly-through intro camera |
| `STORY: TURBO JONES, CHAPTER 1` | `spawnDeb`, `updateStory`, the $800 debt, story cards, store robberies |
| `CUTSCENE SYSTEM` | `CUTSCENES`, `playCutscene`, dialogue box |
| `VOICEOVER SYSTEM` | `speak`, recorded VO (`loadVOFiles`, `playVOFile`), trailer/turbo lines |
| `START / RESIZE` | Boot, resize, event wiring |

---

## 6. Core Systems Reference

### 6.1 State model
Two global objects hold nearly all mutable state:

```js
const G = { mode:'foot'|'car'|'heli', money, heat, stars, carHP, boost,
            escapeT, bustT, missionsDone, over, started, paused,
            station, weapon:'fists'|'pistol'|'rpg', rockets };
const WORLD = { blocks:10, block:50, road:16, pitch, half, size };
```

- **`G.mode`** decides which per-frame updater runs (`updateFoot` / `updateCarMode`
  / `updateHeliMode`) and how the camera and HUD behave. It's the single most
  important switch.
- **`G.paused`** currently only means "portrait orientation → freeze" — there is
  **no pause menu**. (See task **F2**.)
- **`player`** (a plain object, defined mid-file) holds foot position/heading and
  references `player.car` / `player.heli` when driving/flying.
- **World entities are plain arrays of plain objects**, each carrying its own
  `mesh` (a `THREE.Object3D`): `cars`, `traffic`, `peds`, `helis`, `cops`,
  `rockets`, `ramps`, `pickups`, `guards`, `gangMembers`, `chaosDrivers`,
  `pizzaDrivers`. Static world data: `buildings`, `blockInfo`, `intersections`,
  `roadLines`. There is **no ECS and no class hierarchy** — keep it that way;
  add fields to the existing objects.

### 6.2 The main loop
`loop()` is the only `requestAnimationFrame` driver. Shape:
- Computes `dt` (clamped to 0.05s).
- **Cutscene branch:** if a cutscene is active, run cinematic camera + ambient
  world only, render, return.
- **Gameplay:** if `G.started && !G.paused && !G.over`, it runs **fixed-ish
  substeps** — `steps = clamp(ceil(dt/0.017), 1, 4)`, `sdt = dt/steps` — and
  calls every `update*` simulation function per substep so physics is
  framerate-independent. **Add new per-frame simulation here, inside the substep
  loop, matched to the pattern.** Purely visual updates (particles, camera,
  minimap, water) run **once per frame** after the substep loop, not per substep.

### 6.3 Coordinate system
- Ground plane is **XZ**; **+Y is up**. Headings are radians, `0 = +Z`, measured
  so `dir = (sin(h), 0, cos(h))`. Use `angDiff(a,b)` for shortest angle deltas
  and `TAU` for 2π.
- World spans roughly `[-WORLD.half, +WORLD.half]` in X and Z; past
  `WATER_R` you're in the sea (`overWater(x,z)`).

### 6.4 Particles (pooled — copy this pattern)
Fixed pool of `P_MAX=360` reused particle structs (`parts[]`) writing into a
single `BufferGeometry`. `spawnP(...)` grabs the next slot (ring buffer via
`pNext`); `burst(x,y,z,n,cols,speed,life,grav)` is the convenience spawner;
`updateParticles(dt)` integrates. **Never allocate particles per frame — always
go through this pool.** New visual FX that spawn many short-lived objects should
follow the same fixed-pool approach.

### 6.5 Collision
No physics engine. Collision is hand-rolled: `buildingHit(x,z,r)` returns a
push-out normal + depth against building AABBs; `rampHit`, `roofAt`,
`resolveFootCollision` handle the rest. Cars and feet resolve against these each
substep. Keep new colliders in this cheap analytic style.

### 6.6 Audio
- `initAudio()` must run **after a user gesture** (autoplay policy) — it's wired
  to the start flow. `AC` is the context, `masterGain` the master bus.
- **`sfx`** is an object of one-shot synth effects (`sfx.crash`, `sfx.coin`,
  `sfx.jump`, `sfx.mission`, `sfx.fail`, …). Add new effects here.
- Radio is procedural: `STATIONS` + `scheduleMusic()` schedule notes ahead of
  the audio clock. Voiceover: `speak()` for synth NPC "wah" voice; `playVOFile`
  for recorded narration.
- **There is currently no volume mixing** beyond `masterGain` — see task **F4**.

### 6.7 DOM / HUD layer
UI is DOM, not canvas (except the minimap + dash gauge, which are 2D canvases).
Grab elements with `$('id')`. Key ids you'll touch:
- HUD: `money`, `debtHud`/`debtNum`, `stars`, `mission`, `minimap`, `speedo`
  (`gauge`, `dashName`, `hpfill`, `boostfill`), `toasts`, `fpsWarn`.
- Controls: `joy`/`joyKnob`, `pedals`/`pedalCol`, `btns` (`btnGas`, `btnBrake`,
  `btnBoost`, `btnDrift`, `btnEnter`, `btnPunch`, `btnGun`, `btnHorn`, `btnJump`,
  `btnTalk`, `btnCrouch`), `radioBtn`, `fsBtn`.
- Overlays: `start`, `loadScreen`, `storyCard`, `bigEvent`, `dialogueBox`,
  `heistHUD`, `safeCrack`, `rotate` (portrait warning), `fadeOverlay`,
  `nightOverlay`, cinematic bars (`cineTop/Bot/Vignette/Grain`).
- `toast(msg, cls)` is the standard transient-message helper (`cls` ∈
  `'gold'|'bad'|…`). Use it; don't invent new notification systems.

### 6.8 Missions & story
- **Story (Chapter 1):** Turbo owes **Deb $800 by tonight**. `updateStory`
  drives it; store robberies + mission payouts fund the debt. This is the
  spine — don't break the debt loop.
- **Side missions:** `startMission()` picks one of five types at random
  (`delivery`, `style`, `checkpoints`, `rampage`, `heat`), avoiding an immediate
  repeat, on a cooldown, forever. `updateMission(dt)` runs the active one.
  Reward + a `+$500` "chapter bonus" every 5 missions. This is the main target
  for depth work (task **P1**).

### 6.9 Characters & cutscenes → see `CHARACTERS.md`
Every human — **including the player** — is built by one function,
`makePerson(shirt, gender)`, from primitives with a real articulated rig exposed
on `mesh.userData` (`legL, legR, armL, armR, torso, head`). Animation is a
`phase` counter driving `Math.sin(phase)` into those joints. Cutscenes
(`CUTSCENES`, `playCutscene`) currently **only fly the camera** around whatever's
standing at an anchor point — actors don't act. The character-model, character-
creator, and cutscene-rendering plan lives in its own doc, **`CHARACTERS.md`**.

---

## 7. Coding Conventions (match the existing style)

- **Terse and functional.** Short helper names, arrow helpers, minimal
  ceremony. Mirror the surrounding code's density and idiom — don't reformat
  files or impose a new style.
- **Reuse the helpers:** `rand`, `randi`, `pick`, `clamp`, `lerp`, `angDiff`,
  `TAU`, `$`. Don't re-implement them.
- **No new globals unless necessary.** Prefer adding a field to `G` (for game
  state) or to an existing entity object.
- **Hot-path discipline:** inside `loop()` and any `update*`, avoid `new`,
  avoid array allocation, avoid `.filter`/`.map` that create garbage every
  frame. Reuse scratch vectors (the code already keeps module-level scratch
  `THREE.Vector3`s like `_camTmp` — follow that).
- **Clean up what you remove.** When you `scene.remove(mesh)` an entity for
  good, also `dispose()` its geometry/material (see task **R1** — the codebase
  currently never disposes, which leaks). New long-lived spawners must not leak.
- **Comment the *why*, briefly**, like the existing code does (e.g. the camera
  and physics sections have short intent comments). Don't over-document.
- **Guard risky spawns** the way `bootSpawns()` does (try/catch + `console.warn`)
  when adding new subsystem bootstrapping.

---

## 8. The Improvement Backlog

Tasks are grouped into phases and ordered by leverage. **Do phases roughly in
order** — Phase 1 items are foundations that later tasks lean on. Each card:

- **Priority** P0 (do first) … P3 (nice-to-have)
- **Risk** Low / Med / High (how likely to break existing play)
- **Where** the section(s) to work in
- **Acceptance** what "done" looks like — verify all of it before committing.

Pick up a task by ID. If a task's scope balloons or you hit an ambiguous design
call, stop and ask rather than guessing.

---

### Phase 0 — Dev & Test Tooling (build these first — they make every other task faster to test)

> These exist purely to make **iterating and test-playing** fast. Gate all of
> them so they never ship to players: enable only when the URL has `?dev=1` (or a
> `localStorage['gtb4.dev']` flag). None of this should be reachable in a normal
> session.

#### D1 — Dev menu / cheat console `P0 · Risk: Low`
**Why:** Today you can only reach a state by *playing* to it — grind money,
commit crimes for stars, drive to Deb. That makes every test slow. One hidden
panel fixes it.
**Where:** new `DEV TOOLS` section, gated on `?dev=1`; a DOM overlay toggled by a
key (backtick `` ` ``). Calls existing functions/state directly (`addMoney`,
`addHeat`/`clearHeat`, `makeCar`, `spawnCopHeli`, `playCutscene`, `startMission`,
`G.*`).
**Approach:** A toggleable panel with quick actions: **+$100 / +$1000 / clear
debt**; **set stars 0–6 / clear heat**; **spawn** each vehicle (sedan/sports/
moto/heli) at the player; **god mode** (skip damage in `damageCar`/`damageArea`),
**infinite boost/ammo**; **teleport** (Deb, pizza place, mission beacon, map
corners); **force day/night & freeze time**; **trigger/skip/complete mission**;
**play any cutscene by id**; **wipe save**. Keep it a thin set of buttons wired to
existing functions — don't duplicate game logic.
**Acceptance:** With `?dev=1`, backtick opens the panel; each action has the
obvious immediate effect; god mode makes you unkillable; without `?dev=1` the
panel and keybind do nothing. No dev code runs in a normal session.

#### D2 — Fast-boot & scene-jump flags `P0 · Risk: Low`
**Why:** Sitting through the loader + intro cinematic + story card on **every
reload** is the biggest single time sink when testing.
**Where:** boot/`START / RESIZE` flow, intro + story-card gating.
**Approach:** `?dev=1` (or `?skipintro`) skips the loading screen, animated
intro, and Chapter-1 story card straight into gameplay. Optional
`?scene=heist|pizzawars|deb` and `?cutscene=<id>` jump directly into that state/
cutscene on load. Optional `?mode=car|heli` to start already driving/flying.
**Acceptance:** `?dev=1` lands you controllable in the city in a second or two;
`?cutscene=deb_confrontation` plays that scene immediately; normal load
(no flag) is unchanged.

#### D3 — Debug HUD overlay `P1 · Risk: Low`
**Why:** The lone `fps` readout isn't enough to diagnose behaviour.
**Where:** extend the fps block in `MAIN LOOP`; gated on `?dev=1` or a toggle.
**Approach:** A corner overlay showing player pos/heading, `G.mode`, money/heat/
stars, live entity counts (`cars`/`peds`/`cops`/`traffic`/particles), active
mission + heist phase, camera pos, and frame time. Cheap string build, toggle
with a key.
**Acceptance:** Numbers update live and match reality; toggling off removes it;
no measurable fps cost.

#### D4 — Free-fly / spectator camera `P1 · Risk: Med`
**Why:** You can't currently inspect the world, a character model, or frame a
cutscene from an arbitrary angle.
**Where:** `CAMERA`; gated dev toggle that suspends normal `updateCamera`.
**Approach:** A detached camera flown with `WASD`+drag (and up/down keys), with
gameplay frozen or continuing (your call via a toggle). Reuse existing look
math. Great for composing cutscene shots (feeds D-work in CHARACTERS.md).
**Acceptance:** Toggle → camera detaches and flies smoothly anywhere; toggle back
→ returns to normal follow-cam exactly.

#### D5 — Time controls (pause-step / slow-mo / fast-forward) `P2 · Risk: Low`
**Why:** Inspecting animations, physics, and cutscene timing needs sub-real-time
control.
**Where:** `MAIN LOOP` — introduce a `timeScale` applied to `dt` for simulation
(not for the render/UI).
**Approach:** Dev keys for `0.25×`, `1×`, `4×`, and **step one frame** while
paused. Apply `timeScale` only to the gameplay substep `dt`, never to real-time
UI. Ties into the pause menu (F2) later.
**Acceptance:** Slow-mo visibly slows cars/peds/particles without breaking
collision; step advances exactly one sim frame; `1×` is identical to today.

#### D6 — Character / model viewer (turntable) `P1 · Risk: Low`
**Why:** The **workbench** for finishing character models and building the
creator — iterate on a model in isolation instead of hunting for one in-game.
Directly serves the character-model + creator + cutscene goals.
**Where:** a dev mode (`?viewer=1`) — or a tiny separate `viewer.html` that loads
`three.min.js` and the shared person/vehicle builders — rendering one model on a
lit turntable. **Depends on / pairs with `C1`** (the spec refactor in
CHARACTERS.md).
**Approach:** Show a single `makePerson(spec)` (or a vehicle) rotating on a
platform with the game's lighting. Add live controls for every spec field once
C1 lands, plus buttons to cycle canned **poses/animations** (idle, walk, talk,
point) so you can eyeball the rig. This *is* the creator's preview surface.
**Acceptance:** `?viewer=1` shows a character turntable; changing a spec value
updates the model live; poses play correctly. Uses the same builder the game
uses (no forked model code).

#### D7 — Deterministic seed (optional) `P2 · Risk: Med`
**Why:** `Math.random()` is used everywhere, so bugs aren't reproducible.
**Where:** central RNG; city/traffic/ped/mission spawns.
**Approach:** When `?seed=<n>` is present, route randomness through a small
seedable PRNG (e.g. mulberry32) exposed as the existing `rand/randi/pick` so the
same seed reproduces the same city and spawns. No behaviour change without a
seed.
**Acceptance:** Same `?seed=123` → identical city layout and initial spawns
across reloads; no seed → unchanged random behaviour.

---

### Phase 1 — Foundations (do these first)

#### F1 — Save & restore progress `P0 · Risk: Low`
**Why:** There is **no persistence** (`localStorage` is used 0 times). Pay Deb
$800, close the tab, everything's gone. This kills any sense of progression.
**Where:** new small "SAVE SYSTEM" section; hook into boot (`START / RESIZE`),
`addMoney`, `completeMission`, `updateStory`, day/night toggle.
**Approach:** A single `save()` that writes a small JSON blob to
`localStorage['gtb4.save']` (money, debt paid, `missionsDone`, day/night, unlocked
things, settings) and a `load()` on boot. Debounce writes (e.g. save on money
change, mission complete, settings change — not every frame). Add a **"Continue /
New Game"** choice on the start screen when a save exists. Version the blob
(`{v:1, …}`) so future changes can migrate.
**Acceptance:** Earn money, reload the page → money and progress persist.
"New Game" wipes it. No per-frame writes (check no `localStorage` call inside
`loop`). Corrupt/absent save falls back cleanly to a fresh game.

#### F2 — Pause + Settings menu `P0 · Risk: Low`
**Why:** `G.paused` only reacts to portrait orientation; there's no real pause,
and no way to change anything. Every later option (volumes, quality,
sensitivity) needs a home.
**Where:** new DOM overlay in `<body>` + CSS; wire a pause button (HUD) and
`Esc`/`P` key; gate on `G.paused` (already respected by `loop()`).
**Approach:** A pause overlay with **Resume, Restart, How to Play**, and a
**Settings** panel. Settings host the sliders/toggles added by F3/F4/J1. Ensure
pausing truly freezes gameplay (loop already skips sim when `G.paused`) while the
menu is interactive. Don't let orientation-pause and menu-pause fight — track
*why* it's paused.
**Acceptance:** Tap pause (or `P`) mid-drive → world freezes, menu appears,
Resume continues exactly where you were. Works in landscape touch. Rotating to
portrait still shows the rotate warning without corrupting menu state.

#### F3 — Adaptive graphics quality `P0 · Risk: Med`
**Why:** Pixel ratio is set **once**; there's an fps readout but nothing acts on
it. On weak phones the game just chugs. This is the single biggest mobile win.
**Where:** `THREE SETUP` (renderer), `MAIN LOOP` (fps sampling already exists),
plus a manual toggle in Settings (F2).
**Approach:** Define **Low / Medium / High** tiers controlling: renderer pixel
ratio, NPC/traffic/ped counts, particle budget, draw distance / fog, and cloud/
gull density. **Auto-detect:** sample the existing fps counter; if it sits below
~40 for a few seconds, step down a tier (and optionally step back up if it's
pinned at 60). Also expose a **manual override** in Settings that disables
auto. Persist the choice (F1).
**Acceptance:** Force a low tier → visibly fewer NPCs/particles + lower internal
resolution + higher fps, no crashes, no missing-object errors. Auto-downshift
triggers when fps is throttled (test with CPU throttling in devtools). Manual
setting sticks across reloads.

#### F4 — Audio mix buses + music ducking `P1 · Risk: Low`
**Why:** Only `masterGain` exists; you can't turn music down without killing
SFX, and voiceover fights the radio.
**Where:** `AUDIO` section (bus routing), Settings (F2) for sliders.
**Approach:** Insert **`musicGain`, `sfxGain`, `voiceGain`** sub-buses between the
per-sound nodes and `masterGain`. Route radio → music, `sfx.*` → sfx, VO → voice.
Add **Master / Music / SFX / Voice** sliders in Settings (persisted, F1).
**Duck** the music bus down while voiceover/dialogue plays, ease it back after.
**Acceptance:** Each slider independently changes its category in real time and
persists. During Deb/story VO the radio dips and recovers. Muting music leaves
engine + SFX + VO intact.

---

### Phase 2 — Game Feel & Juice

#### J1 — Haptics & impact feedback `P1 · Risk: Low`
**Why:** No `navigator.vibrate` anywhere; crashes/gunshots/hits have no physical
punch on mobile. Cheap, huge feel upgrade.
**Where:** collision resolution in `carPhysics`/`damageCar`, `doAttack`/`explode`,
`busted`/`wasted`; guard with a Settings toggle (F2) + capability check.
**Approach:** A tiny `haptic(pattern)` helper wrapping `navigator.vibrate`
(feature-detect; no-op if absent). Fire short pulses on hard crash, gunfire,
explosion, ramp landing, bust. Scale to impact where it makes sense. Add a
**"Vibration" on/off** setting (default on).
**Acceptance:** On a device/emulator that supports vibration, crashes and shots
buzz; toggling it off silences all haptics. No errors on desktop/unsupported.

#### J2 — Hitstop + refined screen shake `P2 · Risk: Med`
**Why:** Big impacts read as "meh". A few frames of freeze + a tuned shake curve
makes collisions and explosions land.
**Where:** `CAMERA` (`shake`, already exists), `MAIN LOOP`, `carPhysics`/`explode`.
**Approach:** Add a very short **hitstop** (scale `dt`→~0 for 40–80ms) on big
crashes/explosions only — never during normal play, and cap it so it can't
soften controls. Tune the `shake()` magnitude/decay so light taps barely shake
and big hits kick hard. Respect a **"Reduce motion"** setting (see A2) that
disables both.
**Acceptance:** Ramp-slam into a wall → brief freeze + strong shake that settles
fast; gentle bumps do almost nothing. No input lag introduced. Reduce-motion off
switch works.

#### J3 — Camera polish (foot + car) `P2 · Risk: Med`
**Why:** The camera is already thoughtful (collision pull-in, look-hold, speed
FOV). Small tuning + options make it feel pro.
**Where:** `CAMERA` (`updateCamera`, `cameraCollide`).
**Approach:** Add a **look-sensitivity** slider and **invert-Y** toggle (Settings,
F2), applied in `applyLook`. Smooth the foot camera when strafing; make sure the
car camera doesn't feel sluggish at low speed. Don't regress the wall pull-in.
**Acceptance:** Sensitivity + invert options work and persist; camera never
clips into buildings; low-speed driving feels responsive; no motion sickness
spikes from over-fast lerps.

#### J4 — Control feel: joystick dead-zone + reverse/brake clarity `P2 · Risk: Med`
**Why:** Touch stick and the brake/reverse pedal are the highest-touch surfaces;
small tuning pays off constantly.
**Where:** `joyStart/Move/End`, `pollKeys`, `carPhysics` throttle handling,
pedals DOM.
**Approach:** Add a small joystick **dead-zone** and response curve so tiny
touches don't jitter the character. Make brake-vs-reverse legible (the physics
already brakes-then-reverses; ensure the pedal/HUD communicates it). Keep desktop
WASD identical in feel.
**Acceptance:** Standing still doesn't drift from stick noise; full-tilt still
hits max; braking to a stop then reversing feels intentional; no change to
keyboard players' experience.

---

### Phase 3 — Progression & Balance

#### P1 — Mission variety & light progression `P1 · Risk: Med`
**Why:** Five random side-missions repeat forever with only "don't repeat the
last one" logic — it goes stale fast.
**Where:** `MISSIONS` (`startMission`, `updateMission`, complete/fail).
**Approach:** Add **2–4 new mission types** in the existing data-driven style
(e.g. *getaway/escape*, *survive the ambush*, *chase-down*, *courier under
fire*). Weight selection by what the player is near / can do, and scale reward
with difficulty & distance. Introduce a **soft progression**: unlock tougher/
higher-paying missions as `missionsDone` climbs, so the loop escalates instead of
flatlining. Keep each mission self-contained and failable. Persist unlocks (F1).
**Acceptance:** You can play 15+ minutes without an obvious repeat; rewards feel
proportional; later missions are meatier than the first; nothing soft-locks if a
mission is abandoned (drive away → it fails/cleans up correctly).

#### P2 — Economy & debt-loop tuning `P2 · Risk: Med`
**Why:** The $800 debt is the spine; income sources (robberies, missions,
deliveries, air-time) should make it a satisfying push, not trivial or grindy.
**Where:** `addMoney` call sites, `STORY`, mission rewards, pizza delivery
reward.
**Approach:** Audit every money source and sink, then tune to a target: a
focused player clears the $800 in a satisfying session, a careless one takes
longer. Add clear **payday feedback** (toast + sfx already exist — make big ones
feel big). Don't touch the debt mechanic itself, just the numbers + feedback.
**Acceptance:** A test playthrough to $800 feels earned (not 2 minutes, not an
hour). Every income source is reachable and worth doing.

#### P3 — Wanted-system feel + difficulty options `P2 · Risk: Med`
**Why:** Heat/stars escalation and cop pressure drive the fun; expose it and
tune it.
**Where:** `WANTED` (`addHeat`, `clearHeat`, `updateWanted`, `spawnCop`),
`updateCops`.
**Approach:** Tune escalation/cool-down curves so chases build and resolve
readably. Add a **Difficulty** setting (Easy/Normal/Hard) in Settings (F2) that
scales cop aggression/spawn rate + damage taken. Persist it (F1). Make the star
HUD and "wanted" transitions clear.
**Acceptance:** Stars climb sensibly with crime and clear on a genuine escape;
difficulty setting visibly changes cop pressure and persists; no runaway
spawning that tanks fps (respect F3 caps).

---

### Phase 4 — Polish, UX & Accessibility

#### U1 — Objective clarity & HUD readability `P1 · Risk: Low`
**Why:** New/returning players don't always know what to do or where to go.
**Where:** `HUD / TOASTS`, `MINIMAP`, `updateStory`/`updateMission` HUD strings,
`setBeacon`.
**Approach:** Always surface the current objective (story goal vs active
mission) with an on-screen **direction + distance** and a minimap marker. Add a
tiny **minimap legend / key** for the coloured blips (cops, missions, gang
turf, Deb). Improve contrast/scale of the debt + money + stars boxes for small
screens.
**Acceptance:** At any moment it's obvious what to do next and which way to go;
minimap blips are self-explanatory; HUD is legible at phone size in bright and
dark scenes.

#### U2 — Onboarding / How-to-Play `P2 · Risk: Low`
**Why:** Controls are only a one-line hint; a short first-run guide lowers the
bounce rate.
**Where:** start flow, `controlsHint`, pause menu (F2) "How to Play".
**Approach:** A skippable, first-run **controls card** (touch + desktop),
reachable again from the pause menu. Don't gate the fun behind a tutorial —
keep it a glanceable card, remembered as "seen" via the save (F1).
**Acceptance:** First launch shows the card once; it's re-openable from pause;
skipping works; "seen" persists so it doesn't nag.

#### U3 — Death / busted / respawn flow `P2 · Risk: Med`
**Why:** `busted`/`wasted` should feel fair — clear consequence, quick recovery,
progress kept.
**Where:** `BUSTED / WASTED` (`busted`, `wasted`, `respawn`, `bigEvent`).
**Approach:** Clarify the consequence (e.g. small cash/heat penalty), keep saved
progress (F1) intact, respawn cleanly at a sensible spot without stranding the
player or leaving orphaned entities. Make the `bigEvent` screens readable and
quick to dismiss.
**Acceptance:** Getting busted/wasted never loses saved progress, always respawns
you playable (not inside a wall, not carless with no options), and reads clearly.

#### A2 — Accessibility options `P3 · Risk: Low`
**Why:** Small settings widen the audience and reduce motion sickness.
**Where:** Settings (F2), `CAMERA`, `updateStarsHUD`/minimap colours.
**Approach:** Add **Reduce Motion** (caps shake/hitstop/FOV kick — J2/J3 respect
it), a **larger-text / high-contrast HUD** toggle, and colour-blind-friendlier
marker shapes/colours on the minimap. All persisted (F1).
**Acceptance:** Each toggle has a real, visible effect and persists; reduce-motion
noticeably calms the camera; HUD text scales without breaking layout.

---

### Phase 5 — Robustness & Performance Hygiene

#### R1 — Dispose GPU resources on entity removal `P0 · Risk: Med`
**Why:** **`.dispose()` is never called.** Every despawned car/ped/particle mesh
leaks its geometry+material on the GPU; over a long session memory climbs and
mobile browsers eventually kill the tab.
**Where:** everywhere an entity is permanently removed — `damageCar` (car death),
ped/cop cleanup, rockets, gang members, expired pickups.
**Approach:** Add a small `disposeMesh(obj3d)` helper that traverses and disposes
geometries + materials (guarding shared/instanced assets — **don't** dispose
geometry/material that's shared across many entities; those should be created
once and reused, and only disposed at teardown). Call it wherever an entity is
gone for good. Audit which geometries are shared vs per-instance first.
**Acceptance:** Drive around causing lots of spawns/despawns for several minutes
→ JS heap + GPU memory stay roughly flat (check devtools Memory / Performance).
No visual regressions (shared assets still render).

#### R2 — Pool traffic / peds instead of churning them `P2 · Risk: Med`
**Why:** Cars and peds are spliced and re-`spawn`ed via timeouts, creating and
GC-ing meshes constantly. Pooling smooths frame times.
**Where:** `spawnTraffic`, `spawnPed`, `damageCar` respawn, `updateTraffic`/
`updatePeds` cleanup.
**Approach:** Maintain a small free-list of hidden car/ped objects; recycle on
despawn instead of destroy+recreate. Follow the particle pool philosophy.
Coordinate with F3's population caps and R1's disposal (pooled objects aren't
disposed until teardown).
**Acceptance:** Sustained play shows fewer GC pauses / steadier frame time (
devtools Performance); population still feels alive; no "ghost" recycled entities
appearing wrong.

#### R3 — Anti-stuck & spawn-safety `P2 · Risk: Med`
**Why:** Analytic collision can occasionally wedge the player in geometry or
spawn NPCs inside buildings.
**Where:** `resolveFootCollision`, `respawn`, `spawnPed`/`spawnTraffic`,
`randomRoadPoint`.
**Approach:** Validate spawn points against `buildingHit`/`overWater` and retry
(bounded) if invalid. Add a gentle un-stick nudge if the player is inside a
collider for more than a moment. Keep it cheap.
**Acceptance:** Extended play produces no permanently-stuck states; NPCs don't
spawn embedded in buildings or in the sea; the un-stick never fires during
normal play.

---

### Phase 6 — Structural (optional; unlocks the expansion phase)

#### X1 — Split `index.html` into ordered no-build modules `P3 · Risk: High`
**Why:** A 5,000-line file makes parallel/iterative agent work risky. Splitting
into a few plain-`<script>` files (still zero-build) reduces edit collisions.
**Only do this if/when Austin approves** — it touches everything and must not
change behaviour.
**Where:** whole file → e.g. `js/core.js` (helpers+state+audio), `js/world.js`
(three setup+city+particles), `js/vehicles.js`, `js/ai.js`, `js/game.js` (loop+
missions+story+boot), loaded via **ordered `<script>` tags** in dependency order.
No modules/bundler — globals stay global, just across files.
**Approach:** Move code **verbatim** in dependency order; change nothing else in
the same commit. Verify the game is byte-for-byte behaviourally identical before
any further edits land on top.
**Acceptance:** Game plays identically to pre-split; still zero-build; still
deploys on GitHub Pages by serving the folder; each new file is meaningfully
smaller and single-purpose.

> **Content expansion** (new districts, story chapters, new modes, more
> vehicles/weapons) is deliberately **out of scope for this pass** — it comes
> after the game *feels* finished. Capture ideas but don't build them yet.

---

## 9. Verification & Definition of Done

Before committing **any** task:

1. **It runs.** `python3 -m http.server 8099` → game boots to the title, starts,
   and plays. No console errors.
2. **Landscape phone check.** Devtools device mode, ~800×390 landscape, touch:
   the feature works and no UI overlaps controls.
3. **No fps regression.** Watch the `fps` readout during busy play (traffic +
   cops + particles). A drop is a bug.
4. **Sound on, over HTTP.** Confirm audio still works (you can't test this on
   `file://`).
5. **Save intact (once F1 lands).** Reload → progress/settings persist; "New
   Game" resets.
6. **Nothing else regressed.** Do a 2-minute smoke play: drive, shoot, get a
   wanted level and lose it, do one mission, get in/out of a car and a heli.
7. **Task acceptance criteria** for the specific card all pass.

**Commit style:** one logical change per commit, imperative subject
(`Add localStorage save/restore for money and progress`), body explaining the
*why* if non-obvious. The game must be playable at every commit.

**Branch:** work on `claude/game-improvements-architecture-hyuk48` (or the branch
Austin points you to). Push there. **Do not open a PR unless Austin asks.**

---

## 10. Suggested Order of Work

A sensible sequence that front-loads leverage and keeps the game shippable
throughout:

```
D1  Dev menu / cheat console  ← makes ALL testing faster; do this first
D2  Fast-boot & scene-jump     ← stop re-watching the intro every reload
F1  Save/restore               ← everything else persists through this
F2  Pause + Settings menu      ← the home for all options
D3  Debug HUD                  ← cheap, speeds up bug-hunting
R1  Dispose on removal          ← stop the memory leak early
F3  Adaptive quality            ← biggest mobile win
F4  Audio mix + ducking
U1  Objective clarity/HUD
J1  Haptics
P1  Mission variety
J3  Camera options
J4  Control feel
P3  Wanted + difficulty
P2  Economy tuning
J2  Hitstop + shake
U2  Onboarding
U3  Death/respawn flow
R2  Pooling
R3  Anti-stuck
A2  Accessibility
X1  (only if approved) modular split
```

**Character / cutscene track** (see `CHARACTERS.md`) runs in parallel and shares
tooling with Phase 0. Critical path there: `D6` viewer → `C1` spec refactor →
`C2` body/shoulder overhaul → `C3` paintable UV textures → `C5` paint/edit page →
`C6` character creator → `C8` cutscene actors/animation. `C6` depends on `F1` (to
save the painted character). See `CHARACTERS.md §5` for the full order.

Pick the top unclaimed task, read its card, check the acceptance criteria, build
it small, verify (§9), commit. When in doubt about a design decision, ask.
