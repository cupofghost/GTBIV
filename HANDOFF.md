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

## 0. Tooling & Workflow Friction — fix these to speed every future session

> Compiled from real time/token sinks hit while implementing tasks. These are
> **meta-tasks**: none change the game, but each one recurs on *every* piece of
> work, so paying them down once pays off across all later chats. Pick them up
> like any backlog card. Ordered by how often they bite.

- **W1 — Reconcile the backlog against the actual code (recurring drift).**
  `P0 · Risk: Low`. Tasks get implemented in `index.html` but their §8 card and
  the §10 order list don't get the `DONE` marker (hit this session: **F3** and
  **R1** were fully shipped in commits `8aa7cfc`/`20593e0` yet still read as
  open). The next agent then can't trust the doc and has to `git log`/`git show`
  to reverse-engineer what's real — slow and token-heavy. *Fix:* one pass that,
  for every card, greps the code for the feature and sets status to match; then
  going forward, **treat "update the card + §10 line to DONE" as part of the
  task, not optional.** Consider a tiny `tests/handoff-sync` check that fails if
  a card says DONE but a named function is missing (or vice-versa).

- **W2 — The single ~8k-line `index.html` taxes every edit.** `P1 · Risk: High`
  (this is **X1**, but the cost is felt on *all* tasks, not just refactors). One
  328 KB `<script>` block means every Grep/Read/Edit fights the file size and it
  never fits in context; locating a function is always grep-for-line then
  read-a-window. *Cheap interim win without the full modular split:* commit a
  **code map** (a `CODEMAP.md` or a comment index near the top: section name →
  line range, major function → line) and keep it current, so navigation is a
  lookup instead of a search. The full ordered-`<script src>` split (X1) is the
  real fix when approved.

- **W3 — No fast pre-flight; the only check is slow Playwright.** `P1 · Risk:
  Low`. The suite launches headless Chromium with an ~800 ms settle per case and
  relaunches contexts; the **full run exceeds 120 s** (it timed out a foreground
  call this session and had to be backgrounded). There's no sub-10 s "did I
  break the syntax / does it still boot" gate, so I hand-rolled a
  `new Function(scriptBody)` parse check to catch typos in seconds. *Fix:* commit
  that as `tests/syntax-check.js` (extract the `<script>` body, `new Function`
  it, exit non-zero on `SyntaxError`) **and** a single-boot smoke test that just
  loads the page and asserts zero console errors. Wire both as a fast tier run
  before the full suite.

- **W4 — Speed up the full suite itself.** `P2 · Risk: Low`. Beyond W3's fast
  tier, the suite is slow because every case pays a fresh context + page reload
  and headless rAF throttling forces manual `updateX(dt)` stepping. *Fix:* share
  one booted page across the read-only cases, and/or run the `cases/*.test.js`
  files in parallel workers. Cuts the feedback loop on every future change.

- **W5 — "Work the next item" requires archaeology.** `P2 · Risk: Low`. The
  README says read HANDOFF and do the next item, but finding it means opening
  this file, grepping phase headers, and cross-referencing §10's order list
  against per-card DONE markers — which (see W1) can disagree with the code.
  *Fix:* keep a single authoritative **`NEXT: <task id>`** line at the top of §10
  (or here) updated as the last step of every task, so the next chat starts in
  one read instead of five.

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

**There's a headless regression suite** at `tests/` (`cd tests && node run.js`)
covering state/logic — boot, cutscenes, the Chapter 1 story machine,
save/restore, and a shallow sweep of missions/wanted. Run it before every
commit; it catches silent state-machine breakage in seconds. It does **not**
replace playing — it can't judge feel, framing, or fps. For every change,
still run the relevant [Verification Checklist](#9-verification--definition-of-done)
in a **landscape phone-sized viewport** (browser devtools device mode), with
sound on, and confirm nothing regressed. Watch the on-screen `fps` readout
(top-of-loop, id `fpsWarn`) — a change that drops it is a bug. See
`tests/README.md` for how the suite works and how to add a case.

---

## 4. Architecture Overview

### Tech
- **Rendering:** Three.js r128 (`three.min.js`), one `WebGLRenderer`
  (`antialias:true`, `powerPreference:'high-performance'`, pixel ratio capped
  at `min(devicePixelRatio, 1.75)`). No shadow maps — the game uses cheap
  **blob shadows** (`makeShadow`) and instanced meshes for density.
- **Audio:** Raw **Web Audio API** — one `AudioContext` (`AC`), a `masterGain`,
  a live engine synth (oscillators + filters), a fully **procedural 80s
  synthwave soundtrack** (3 radio stations, each a *playlist* of through-
  composed songs in `SW_SONGS`, driven by `scheduleMusic`/`stepSong` through an
  FX rack — sidechain **pump**, convolver **reverb**, ping-pong **delay**, bus
  compressor), a `sfx` object of one-shot synth effects, and a **voiceover**
  system that plays recorded `.mp3` narration (ducking the music under it) and
  synthesises "wah-wah" NPC speech.
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
| `voice/turbo/intro/`, `voice/turbo/ambient/*/` | Recorded intro narration + catchphrases (wired — see §6.6) |
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
| `AUDIO` | `initAudio` (+ `buildMusicRack`/`makeIR` FX rack), engine synth, `sfx` object, synthwave soundtrack (`SW_SONGS`, `STATIONS`, `scheduleMusic`/`stepSong`, `sw*` instruments), dash gauge drawing |
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
- **`G.paused`** is `G.started && G.menuPaused` (see `syncPause()`) — set by the
  pause menu (F2). There's no separate portrait-orientation freeze anymore: a
  portrait touch device self-rotates via CSS instead of pausing (§6.9-adjacent —
  see `updateOrientationMode`/`ROTATED` near the top of the script).
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
No physics engine. Collision is hand-rolled, all circle-vs-shape: `buildingHit(x,z,r)`
returns a push-out normal + depth against building AABBs; `orientedBoxHit(x,z,r,bx,bz,
dir,halfW,halfD)` is the shared oriented-box-vs-circle primitive (`rampHit` and
`vehicleHit` are both one-line wrappers around it — add new oriented-box colliders
the same way rather than re-deriving the rotation math). `pedHit` is a plain
circle-vs-circle check against `peds` (skips `state==='down'` — you can step over a
knocked-out ped). `resolveFootCollision(obj,r)` runs all four (buildings, ramps,
cars, peds) in sequence and is what the player resolves against every substep in
`updateFoot` — **NPCs and traffic do not run through it**, they have their own
movement/avoidance, so this only stops the *player* from walking through
things. `roofAt` handles rooftop-as-floor separately. `cameraCollide` (§6's
`CAMERA` section) ray-marches 10 steps and now also treats a car as an occluder
via `vehicleHit`, but only below roof height (`y<1.6`) — otherwise the camera
would yank in every time its arc passed over a parked car's footprint. Keep new
colliders in this cheap analytic style.

### 6.6 Audio
- `initAudio()` must run **after a user gesture** (autoplay policy) — it's wired
  to the start flow. `AC` is the context, `masterGain` the master bus.
- **`sfx`** is an object of one-shot synth effects (`sfx.crash`, `sfx.coin`,
  `sfx.jump`, `sfx.mission`, `sfx.fail`, …). Add new effects here.
- Radio is a procedural **synthwave soundtrack**: each `STATIONS[]` entry is a
  playlist of songs from `SW_SONGS` (**12 songs, 4 per station** — VICE FM /
  TURBO FM / MIRAGE 105). `scheduleMusic()` clocks ahead of the audio clock and
  hands each 16th to `stepSong()`, which reads the current song's arrangement
  (`sections` with an `e`nergy that morphs the drum kit + filter brightness),
  chord `prog`, `bass`, and `lead` melody, then triggers the `sw*` instruments.
  Everything routes through the FX rack built in `initAudio` (`musicPump`
  sidechain, `musicVerbIn` reverb send, `musicDelayIn` ping-pong, a bus
  compressor) → `musicGain` → `musicVODuck` → `masterGain`. **To add a song,
  append to `SW_SONGS`** (never insert — `STATIONS[].songs` reference it by
  index, and those indices must stay stable) and reference it from a station's
  `songs`.
- **Wanted-level heat reacts on top of the current song two ways.** First, in
  place: `updateHeatLevel()` (called once per `scheduleMusic()` tick) smoothly
  tracks `G.stars` into `heatLevel` (0..1 — fast rise, slower cooldown; it also
  maintains `calmT`, seconds spent clean) and `heatEnergy(sec)` blends it into
  each section's authored energy, so the kit gets busier/brighter, an extra
  off-beat kick pulse kicks in past `heatLevel>0.55`, and a tension
  `swChaseStab` cuts in past `heatLevel>0.8`. Second, **every song can hand off
  to a dedicated loop variant** — `song.hotLoop` (a tight, hard-hitting 4-bar
  vamp built from that song's own chords, via `makeHotLoop`/bespoke for a few
  flagships) and `song.calmLoop` (a sparse ambient wash, via `makeCalmLoop`).
  `desiredSwMode()` picks `'normal' | 'hot' | 'calm'` with hysteresis (hot
  enters >0.65, exits <0.45; calm needs `calmT>6` — not just low heat, so a
  fresh boot doesn't start in the ambient loop instead of the authored
  arrangement) and `scheduleMusic()` only swaps at a bar boundary, **freezing
  the normal arrangement's position** while a loop plays so it resumes exactly
  where it left off once the heat settles. A `swCrash()` stings the entrance
  into hot mode. All of this happens **without switching playlist tracks** —
  a chase makes whatever's already playing hit harder, then hand off to its
  own "chase mix," then hand back.
- Voiceover: `speak()` for synth NPC "wah" voice; `playVOFile`/`playVOLine` for
  recorded narration. Any active narration **ducks the radio** via the
  ref-counted `voDuckOn/Off` → `duckMusicForVO` (F4's "music dips during VO").
- Music/Master volume mix via the `SETTINGS` sliders (`musicVolVal` → `musicGain`).
- **Recorded voice lives under `voice/<character>/…`** (today only
  `voice/turbo/`, see `README.md` for the full folder map). `INTRO_LINES`
  (top of `VOICEOVER SYSTEM`) points at `voice/turbo/intro/`; `TURBO_LINES`
  points each ambient category (`approach`, `punch`, `slow`, `stopsign`,
  `cops`, `runover`, `shoot`, `car`) at its matching `voice/turbo/ambient/*/`
  folder. Everything else under `voice/turbo/` (`story/`, `cutscenes/`,
  `backstory_intro/`, `promo/`, `raw/`) is recorded but **not yet referenced
  by any code** — it's staged for the `CHAPTER1.md`/`FOOTBALL_STRAND.md`
  missions and cutscenes that will consume it. To wire a staged line in: add
  a `{src:'voice/turbo/<folder>/<file>.mp3', text:'…'}` entry wherever that
  scene/trigger lives, same pattern as the ambient categories.
- **New voice-acting drops:** add them as a new folder under `voice/<character>/`
  (new characters get their own top-level folder, e.g. `voice/deb/`) using the
  `category/lowercase_line_slug.mp3` naming already in place — no reorganizing
  needed, just add the array entries once a drop is ready to wire up.

### 6.7 DOM / HUD layer
UI is DOM, not canvas (except the minimap + dash gauge, which are 2D canvases).
Grab elements with `$('id')`. Key ids you'll touch:
- HUD: `money`, `debtHud`/`debtNum`, `stars`, `mission`, `minimap`, `speedo`
  (`gauge`, `dashName`, `hpfill`, `boostfill`), `toasts`, `fpsWarn`.
- Controls: `joy`/`joyKnob`, `pedals`/`pedalCol`, `btns` (`btnGas`, `btnBrake`,
  `btnBoost`, `btnDrift`, `btnEnter`, `btnPunch`, `btnGun`, `btnHorn`, `btnJump`,
  `btnTalk`, `btnCrouch`), `radioBtn`, `fsBtn`. These (plus `.touch-hint`) are
  touch-only — hidden on desktop via `html.is-desktop` (see `IS_TOUCH` near the
  top of the script); `.desktop-hint` is the reverse.
- Overlays: `start`, `loadScreen`, `storyCard`, `bigEvent`, `dialogueBox`,
  `heistHUD`, `safeCrack`, `fadeOverlay`, `nightOverlay`, cinematic bars
  (`cineTop/Bot/Vignette/Grain`). There's no more `rotate`/"please rotate"
  overlay — a portrait touch device self-rotates the page instead (see
  `updateOrientationMode`/`ROTATED`/`vw()`/`vh()`/`remapXY()` near the top of
  the script, and the `html.gtb-rotated` CSS rule).
- `toast(msg, cls)` is the standard transient-message helper (`cls` ∈
  `'gold'|'bad'|…`). Use it; don't invent new notification systems.

### 6.8 Missions & story
> **Tone: play it straight.** Whenever you write or wire narrative — mission
> briefings, barks, story beats, cutscene dialogue — treat San Chaos and Turbo's
> predicament as real, serious, and high-stakes. Never write toward a laugh,
> wink at the player, or signal that a moment is a joke; the premise is absurd
> but the delivery never is. The definitive tone rule and voice samples live in
> `STORY_BIBLE.md §2` and `§4` — follow them.

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

#### D1 — Dev menu / cheat console `P0 · Risk: Low` `DONE`
**Status: implemented & verified** (Kimi3). `?dev=1` gates everything; backtick toggles
`#devPanel` (see `DEV TOOLS` section). Money/debt, stars/heat, vehicle + heli spawns,
god mode, infinite boost/ammo (`DEV_STATE.god/inf` already respected in `damageCar`,
`damageArea`, rocket/boost spend, water death), teleports (Deb/Pizza/corner/random),
day/night, mission trigger/complete/fail, cutscene shortcuts, wipe save. Panel and
keybind are inert without `?dev=1`.
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

#### D2 — Fast-boot & scene-jump flags `P0 · Risk: Low` `DONE`
**Status: implemented & verified** (Kimi3). `?dev=1` or `?skipintro` skips loader
wait + intro + story card via `skipToGameplay()`. `?scene=heist|pizzawars|deb`,
`?mode=car|heli`, `?cutscene=<id>` all handled in `applySceneJump()` (called from
both the start button and `endIntro()` when skipping). Normal load unchanged.
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

#### D3 — Debug HUD overlay `P1 · Risk: Low` `DONE`
**Status: implemented & verified** (Claude). A `#debugHud` panel (top-right,
below the minimap — clear of the joystick/pedals/buttons) shown only when
`DEV_STATE.hud` is on; toggled by the `Z` key (`?dev=1` only) or the dev
panel's "Debug HUD (Z)" button. `updateDebugHud()` runs once per frame from
`loop()` (gated `if(DEV)`, cheap template-literal string build, no work at all
when off) and reports player pos/heading/`G.mode`, money/heat/stars, live
counts (`cars`/`traffic`/`peds`/`cops`/`jocks`/`gangMembers`/`helis`/active
particles out of `P_MAX`), the active `mission.type` or Pizza Wars/heist phase,
camera position, and per-frame time in ms. Verified: `tests/` suite green
36/36; a standalone Playwright smoke check confirmed the panel starts hidden,
`toggleDebugHud()` shows it with live-updating text that changes as the
player moves, and toggling off hides it again — zero console errors.
**Why:** The lone `fps` readout isn't enough to diagnose behaviour.
**Where:** extend the fps block in `MAIN LOOP`; gated on `?dev=1` or a toggle.
**Approach:** A corner overlay showing player pos/heading, `G.mode`, money/heat/
stars, live entity counts (`cars`/`peds`/`cops`/`traffic`/particles), active
mission + heist phase, camera pos, and frame time. Cheap string build, toggle
with a key.
**Acceptance:** Numbers update live and match reality; toggling off removes it;
no measurable fps cost.

#### D4 — Free-fly / spectator camera `P1 · Risk: Med` `DONE (via Replay)`
**Status: delivered as part of the Replay System** (Kimi3). The replay's fly-cam
is a full spectator camera: joystick/WASD moves in the look plane, right-side
drag orbits, `E`/`Q` (or UP/DN touch buttons) for altitude, Shift for speed —
and it returns cleanly to the normal follow-cam on exit. A standalone
dev-mode detach toggle can still be added later if wanted, but the capability
(and the cutscene-shot-composition use case) is covered.

**REPLAY SYSTEM** (player-facing, ships in normal sessions — not dev-gated):
a `REC_DUR=30s` ring buffer (`recBuf`, 15Hz snapshots of the player + every
entity in `cars/peds/cops/helis/gangMembers/jocks/chaosDrivers`) is recorded
once per frame inside the `!G.over` gameplay branch. `enterReplay()` (HUD
**REPLAY** button / `R` key) freezes the sim via a dedicated `G.replay` branch
at the top of `loop()`, hands the camera to `updateReplay()`, and plays back
snapshots lerped between frames. Entities despawned mid-window are temporarily
re-added to the scene (`_ra` flag) and original mesh visibility is preserved
(`_pv`) and restored on `exitReplay()`; meshes of live entities snap back to
their authoritative sim state on exit. UI: `#replayBar` (play/pause, -5s,
scrub slider, "Ns ago", UP/DN, EXIT) plus **Turbo photo-op controls**: `TALK`
toggles a jaw-flap animation (`userData.jaw`/`mouth`, exposed on the
`makePerson` rig), `🕶 ON/OFF` slides a sunglasses prop on/off his face (built
onto Turbo's `headG` at boot, `userData.shades`, player-only; state survives
exiting replay, jaw always resets to neutral). No recording during
intro/cutscenes/pause; needs ≥1s of buffer to enter.
**Camera note:** the fly-cam right vector is `(-cos yaw, 0, sin yaw)` —
screen-right for this codebase's `dir=(sin h,0,cos h)` +Z convention. Don't
"fix" it back; the naive `(cos, 0, -sin)` form inverts A/D.
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

#### D6 — Character / model viewer (turntable) `P1 · Risk: Low` `DONE`
**Status: implemented** (Kimi3) as a standalone **`viewer.html`** (dev tool, not linked
from the game). Loads `three.min.js` + the shared `js/person.js` builder, shows one
character on a lit turntable with orbit/zoom, live controls for every `PersonSpec`
field (gender/build/height/skin, hair style/colour/beard, outfit colours +
dress/shorts/tank), canned poses driving the real rig joints (idle/walk/talk/point/
armsCrossed), Random NPC / Turbo / Deb presets, and spec JSON export/import. The
creator's preview surface (C5/C6) should reuse this page.
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

#### F1 — Save & restore progress `P0 · Risk: Low` `DONE`
**Status: implemented & verified** (Kimi3). `SAVE SYSTEM` section (just before
`START / RESIZE`): versioned blob `{v:1, money, missionsDone, night, station,
coachBeaten, story:{metDeb,debt,paidOff}}` at `localStorage['gtb4.save']`.
Writes go through `queueSave()` (800ms debounce) hooked into `addMoney`,
`toggleNight`, `cycleRadio`, meeting Deb, the $800 debt being set, and paying Deb
off — plus unconditional `pagehide`/`visibilitychange` flushes so mobile Safari
backgrounding never loses progress. Boot: loader completion shows **CONTINUE /
NEW GAME** when a save exists (`#continueBtn`/`#newGameBtn`); CONTINUE calls
`restoreSave()` — straight into gameplay (no intro/card replay), Deb respawned
with her intro lecture skipped (`deb.lineIdx=DEB_LINES.length`), debt HUD
restored; NEW GAME wipes the save and plays the full intro. `G.coachBeaten` is
already in the blob for **FB3**. Verified headless (Chromium, 800×390): earn →
reload → Continue restores money/day-night/station/Deb; New Game wipes; absent
or corrupt save falls back to a fresh game; no writes inside `loop()`.
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

#### F2 — Pause + Settings menu `P0 · Risk: Low` `DONE`
**Status: implemented & verified.** `PAUSE MENU & SETTINGS` section: `G.menuPaused`
is tracked independently of orientation-pause and combined via `syncPause()`
(the sole writer of `G.paused`). `pauseBtn` (HUD) and the existing pause flow
open `#pauseMenu` with **Resume / Restart / How to Play** and a **Settings**
panel (`pmMain`/`pmSettings`/`pmHow`); Master + Music sliders live there,
persisted via `SETTINGS`/`saveSettings()` (`gtb4.settings`). Pausing suspends
the `AudioContext` (so the radio resumes in sync) and pauses any active VO,
and doubles as a save checkpoint. Restart is a double-tap-armed reload.
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

#### F3 — Adaptive graphics quality `P0 · Risk: Med` `DONE`
**Status: implemented & verified** (Claude). New `adaptive graphics quality`
block in `PAUSE MENU & SETTINGS` defines `QUALITY_TIERS` (`low`/`medium`/`high`)
covering renderer pixel ratio, `TRAFFIC_CAP`/`PED_CAP` population limits,
`PARTICLE_SCALE` (applied in `burst()`), and fog near/far. A **QUALITY** row in
the Settings panel (AUTO/LOW/MED/HIGH buttons) calls `setQualityMode()`,
persisted in `SETTINGS.quality` (default `'auto'`) alongside the volume sliders.
`autoQualityTick(fps)` runs from the existing 2s fps-sample window in `loop()`:
two consecutive windows under 40fps step the tier down, six consecutive
windows pinned at 56+ step it back up; manual modes disable the auto
state machine. `applyQuality()` calls `trimToCaps()` to shed live
traffic/peds immediately via R1's `disposeMesh()` rather than waiting for
natural despawns, so a downshift is visible right away.
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
setting sticks across reloads. Verified: full headless suite green (36/36),
plus a standalone Playwright smoke pass confirming live trim on downshift,
cap/pixel-ratio changes on tier switch, settings persistence across reload,
and the auto up/down state machine.

#### F4 — Audio mix buses + music ducking `P1 · Risk: Low` `DONE`
**Status: implemented & verified** (Claude). Shipped alongside the
80s-synthwave-soundtrack rebuild: a `musicGain` bus feeds an FX rack (sidechain
**pump**, convolver **reverb**, ping-pong **delay**, bus compressor) →
`musicGain` → **`musicVODuck`** → `masterGain`. Voiceover **ducks the radio**
via ref-counted `voDuckOn/Off` → `duckMusicForVO` on both the mp3
(`playVOFile`/`playVOLine`) and TTS (`processVOQueue`) paths, and un-ducks
cleanly (`stopVoiceOver` → `voDuckReset`). Covered by
`tests/cases/soundtrack.test.js`.
**SFX/Voice buses (closed out):** dedicated **`sfxGain`** and **`voiceGain`**
sub-buses sit between the per-sound nodes and `masterGain`. `blip`/`noiseBurst`
(the shared one-shot helpers behind every `sfx.*` entry) plus the continuous
engine/skid/siren loops route through `sfxGain`; `wahVoice` (ambient NPC
chatter), `procVoice` (TTS fallback), and the recorded-VO players
(`playVOLine`/`playVOFile`) route through `voiceGain` — `speakLine`'s
browser-TTS path scales `utterance.volume` by the same slider since
SpeechSynthesis has no Web Audio node to route. **Master / Music / SFX /
Voice** sliders all live in Settings, persisted in the same `SETTINGS` blob
(F1's localStorage pattern).
**Why:** Only `masterGain` existed; you couldn't turn music down without
killing SFX, and voiceover fought the radio.
**Acceptance:** each slider independently changes its category in real time
and persists; during Deb/story VO the radio dips and recovers; muting music
leaves engine + SFX + VO intact.

---

### Phase 2 — Game Feel & Juice

#### J1 — Haptics & impact feedback `P1 · Risk: Low` `DONE`
**Status: implemented & verified** (Claude). New `haptics (J1)` block in
`PAUSE MENU & SETTINGS` adds `haptic(pattern)` — feature-detected
(`navigator.vibrate`) and gated by `SETTINGS.vibrate` (default `true`,
persisted in the same blob as the volume sliders/quality mode) — plus
`hapticCrash(impact)` scaling a single pulse (`30+impact*4`, capped 200ms) for
physical hits. Wired into: all four `carPhysics` impact sites (building, tree,
street-furniture, hard ramp landing); the pistol shot and RPG launch in
`doAttack`; `explode`/`bigExplosion` (short double/triple pulses); and
`busted`/`wasted` (a solid buzz vs. a strong double-buzz for death). A
**VIBRATE ON/OFF** row sits in the Settings panel next to QUALITY, same
`qGroup`/`qBtn` button pattern, wired through `setVibrateMode()`.
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
Verified: `tests/cases/haptics.test.js` (4 cases: fires on enabled/supported,
silenced when the setting is off, never throws when `navigator.vibrate` is
absent, and the setting round-trips a reload) plus the full headless suite
green (43/43, up from 39 with the four new haptics cases).

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

#### J4 — Control feel: joystick dead-zone + reverse/brake clarity `P2 · Risk: Med` `PARTIAL`
**Status: dead-zone done**, reverse/brake clarity still open. `joyMove` now has
a 10px radial dead zone with a linear rescale back to full magnitude at the
55px max travel (no dead jump right past the threshold) — standing still no
longer drifts from thumb jitter, full-tilt still hits `|input.jx,jy|`=1.
Brake-vs-reverse legibility is untouched.
**Why:** Touch stick and the brake/reverse pedal are the highest-touch surfaces;
small tuning pays off constantly.
**Where:** `joyStart/Move/End`, `pollKeys`, `carPhysics` throttle handling,
pedals DOM.
**Remaining:** Make brake-vs-reverse legible (the physics already
brakes-then-reverses; ensure the pedal/HUD communicates it). Keep desktop
WASD identical in feel (already true for the dead-zone change — `pollKeys`
sets `input.jx/jy` directly, bypassing `joyMove`).

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

#### U1 — Objective clarity & HUD readability `P1 · Risk: Low` `PARTIAL`
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
**Status:** the story-objective half shipped — see §16. Remaining: the debt/
money/stars boxes were reviewed against the acceptance bar and already read
clearly at phone size (dark chip background + text-shadow, existing shrink
breakpoint), so no change was made there; revisit only if a real-device test
says otherwise.

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

#### R1 — Dispose GPU resources on entity removal `P0 · Risk: Med` `DONE`
**Status: implemented & verified** (Claude). New `GPU RESOURCE CLEANUP` section
(right after the shadow helpers) adds `disposeMesh(obj)`: a lazily-built
`_sharedGPU` set (`groundGeo`, `sandGeo`, `pGeo`, `shGeo`, `shMat`, `fbGeo`) plus
a `traverse()` that disposes every other child's geometry/material (and its
`.map` texture) while skipping anything in that shared set. Called alongside
every permanent `scene.remove()` — car deaths (`killCar`, water sink, wanted
cleanup), ped/foot-cop deaths and the eaten-corpse path, cop helis and
pilotless-heli crashes/water deaths (plus the player's own heli shadow on a
`wasted()` explosion, previously leaked), rockets, stray-dog churn, meat
drops, and the Chaos Pizza exterior mesh on Pizza Wars completion.
**Why:** **`.dispose()` was never called.** Every despawned car/ped/particle mesh
leaked its geometry+material on the GPU; over a long session memory climbed and
mobile browsers eventually killed the tab.
**Where:** everywhere an entity is permanently removed — `damageCar` (car death),
ped/cop cleanup, rockets, gang members, expired pickups.
**Approach:** Add a small `disposeMesh(obj3d)` helper that traverses and disposes
geometries + materials (guarding shared/instanced assets — **don't** dispose
geometry/material that's shared across many entities; those should be created
once and reused, and only disposed at teardown). Call it wherever an entity is
gone for good. Audit which geometries are shared vs per-instance first.
**Acceptance:** Drive around causing lots of spawns/despawns for several minutes
→ JS heap + GPU memory stay roughly flat (check devtools Memory / Performance).
No visual regressions (shared assets still render). Verified: full headless
suite green (36/36), plus a standalone Playwright smoke pass confirming
disposed meshes revive cleanly when the Replay system re-adds a recently-killed
entity mid-scrub (no console errors, clean exit).

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
> vehicles/weapons) was originally scoped **out of this pass** — general polish
> first. **Austin has since greenlit one deliberate exception: Turbo's football
> backstory (Phase 7 below)** is now a first-class content arc, not a someday
> idea. Keep other new-content ideas parked until the game feels finished;
> Phase 7 is the one exception, and it's actively being built.

---

### Phase 7 — Turbo's Football Saga `content expansion — approved`

Turbo's backstory (former high-school football star, banned from the locker
room, his dad's religious rule against dating cheerleaders, the impulsive
spending that torched his child-support money) is now **locked canon** — see
`STORY_BIBLE.md §3` and `§6` for the full write-up, voice samples, and the
structured mission/cutscene specs. This phase is the implementation side.
Build in order; each step depends on the previous existing in the world.

> **Play it straight.** This arc is built on an absurd premise, and it only
> works if every beat is played completely dead straight — Coach, the jocks,
> and Turbo all mean every word; the camera never winks; nothing is staged
> or timed "for the laugh." Build the encounters, the fight, and the cutscenes
> as sincere character drama. Whatever lands, lands because the world takes
> itself seriously — never because the game is signalling that it's a joke.

#### FB1 — Ambient jock NPCs (roam, taunt, fight on sight) `DONE`
**Status: implemented** (see `JOCK_TAUNTS`, `spawnJock`/`spawnJocks`/
`updateJocks` near the `RIVAL PIZZA GANG` section, wired into `bootSpawns()`
and the main loop's substep). Mirrors the Chaos Pizza gang-member pattern
exactly: a `jocks[]` array of NPCs scattered across random city blocks
(`spawnJocks(7)`), each wandering loosely around its spawn point, showing a
taunt speech-bubble (`showBubble` + `wahVoice`) when Turbo comes within ~12
units on a cooldown, and closing to melee range to trigger the same
simplified auto-counter (`doPunch()`) the gang members use. No new UI, no new
systems — pure reuse of existing patterns.
**Left for later polish (optional, not blocking):** a distinct "letterman
jacket" look once `CHARACTERS.md`'s paint system (C3) lands; a dedicated
knockdown/defeat state (currently, like gang members, jocks can't actually be
knocked down — punching near one just triggers the same auto-counter loop);
tying jock density to the football field once **FB2** exists instead of pure
random blocks.

#### FB2 — Chaos High football field (new landmark) `P1 · Risk: Med` `DONE`
**Status: implemented & verified.** A `FOOTBALL_FIELD` section reserves one
park block (`b.football`), paints Wildcats-green turf + yard lines + end
zones + a "WILDCATS" ground legend into the map texture, and builds the
hardware: two goalposts, three-tier bleachers down both sidelines (solid —
added to `DUMPSTER_SPOTS` collision), and a lit scoreboard reading
"WILDCATS 21 / GUEST 0". Stored as the `FOOTBALL` landmark object
(`FOOTBALL.x/z`) the way `PIZZA`/`CHAOS` are, so `bootSpawns()` already
biases a handful of jocks to spawn on the field. Shipped alongside this pass:
gentle terrain (`groundH` knolls in parks + dunes past the beach ring, with
buildings/trees/props/vehicles/peds all seated on it), an elevated light-rail
loop with a looping four-car train and four walkable stations, and climbable
exterior stairs/fire escapes (`STAIR_RUNS`) tying into new rooftop **hideouts**
that the wanted system (`updateWanted`) now recognizes for losing heat by
laying low, not just fleeing. Verified: headless suite green (36/36), zero
console errors booting and playing in a 800×390 landscape smoke pass, field
visible/reachable on foot with bleachers rendering solid.
**Why:** Gives the jocks (FB1), the Coach mission (FB3), and the minigame
(FB4) a home turf — the stage for the whole arc.
**Where:** new section modeled directly on the `PIZZA PLACE` / `RIVAL PIZZA
GANG` landmark-placement pattern (`PIZZA.site`/`PIZZA.x/z`, replacing a
`blockInfo` entry). See `STORY_BIBLE.md`'s Chaos High location sheet for the
vibe/flavor to build toward.
**Approach:** Pick a `blockInfo` block (prefer a `type==='park'` block, like
the field profile in `STORY_BIBLE.md`, or clear a building block the way
PIZZA/CHAOS do) and build a simple field: a green ground plane with painted
white yard lines (reuse the canvas-texture pattern — see `groundTex`/
`waterTex` for precedent), two goalposts (thin cylinders/boxes), a small set
of bleachers. Store it as a `FOOTBALL` landmark object (`FOOTBALL.x/z/w/d`)
the way `PIZZA`/`CHAOS` are stored, so **FB1**'s jock spawns and **FB3**'s
Coach can anchor to it (`spawnJocks` can start biasing toward `FOOTBALL.x/z`
once this exists, same as gang members stay near `CHAOS`).
**Acceptance:** the field is visible and reachable on foot/by car, shows on
the minimap, doesn't break existing block/road generation, holds framerate.

#### FB3 — "Revenge on Coach" mission `P1 · Risk: Med`
**Why:** The dramatic payoff of the backstory — Turbo settles the score with
the man who ended his football career.
**Where:** a new mission, built like the existing heist system
(`spawnGuards`/`updateGuards`/`checkHeistTriggers` is the closest existing
model for a "triggered, staged encounter with a named NPC") rather than the
random `startMission()` pool — this is a **story/side mission**, one-shot, not
part of the repeating rotation. See `STORY_BIBLE.md`'s mission spec for Coach's
dialogue beats and the exact win condition.
**Approach:** A `Coach` NPC stationed at **FB2**'s field; approaching him
(or a trigger radius) starts a short cutscene (reuse the `CUTSCENES` system —
see `deb_confrontation` as the template) where Coach taunts Turbo, then a
fight begins. On winning the fight, set a persistent flag (`G.coachBeaten` —
wire into the save system, `F1`) that unlocks **FB4**.
**Acceptance:** the mission triggers once, plays a real cutscene, resolves to
a clear win state, sets the unlock flag, persists across reload (once `F1`
exists), and doesn't re-trigger after being beaten.

#### FB4 — Football minigame `P2 · Risk: High`
**Why:** The reward for beating Coach — Turbo gets to play again. This is the
biggest single new system in the arc; scope it deliberately, don't let it
balloon into a full sports sim.
**Where:** new self-contained mode, only reachable after **FB3**'s unlock flag
is set, entered at **FB2**'s field.
**Approach:** Keep it arcade-simple — e.g. a short timed "catch N passes" or
"score N touchdowns against token defenders" loop using existing movement/
collision, not a new physics system. See `STORY_BIBLE.md` for the intended
tone (quick, physical, and played straight — Turbo suiting up one more time
and meaning it) and the win condition that feeds **FB5**.
**Acceptance:** playable start-to-finish, has a clear win/lose state, doesn't
require new asset pipelines, holds framerate, ends by handing off to **FB5**
on a win.
**Flag for Austin:** if this starts requiring real sports-sim mechanics to
feel good, stop and check in rather than over-building — the FB5 cutscene
is the actual payoff, not the football mechanics themselves.

#### FB5 — Cheerleaders cutscene (solo Turbo, no Dad on-screen) `P2 · Risk: Med`
**Why:** The character beat the whole arc is building to.
**Where:** triggered on winning **FB4**; another `CUTSCENES` entry, using the
new actor/pose work from `CHARACTERS.md` (**C8**) if that's landed yet, or a
camera-only cutscene (today's cutscene capability) if not — see
`STORY_BIBLE.md`'s cutscene script for the exact beats (cheerleaders approach
→ Turbo waves them off himself, unprompted, citing his dad's rule → they leave
→ Turbo alone on the field, self-satisfied). **Dad never appears on-screen** —
he's a voice in Turbo's head, not a character in the scene; don't add a Dad
actor/model for this.
**Acceptance:** plays once on the minigame win, matches the scripted beats in
`STORY_BIBLE.md`, ends cleanly back in normal gameplay, doesn't re-trigger on
replay of the minigame (or does, deliberately — confirm with Austin which).

---

### Phase 8 — Rat Vengeance `ongoing`

The sewer rats (§11's "Foot cops & sewer rats" note) used to be purely
atmospheric — a downed ped/cop near a manhole draws a swarm (`RAT_POOL`) that
hauls the body off, no gameplay effect. **They now bite back.** This phase
turns the rat swarm into a real threat with a boss-lite payoff, built in the
same "mechanics first, model later" order as the football saga.

#### RV1 — Mama Rat core mechanics `P2 · Risk: Med` `DONE (placeholder)`
**Status: implemented & verified** (Claude, 2026-07-23). Shoot into a feeding
swarm (pistol only targets rats in `state==='go'|'eat'` via the `'rat'` kind in
`doAttack`'s `consider()`) and `killSomeRats(swarmC)` drops a random **1%–50%**
of that swarm at once (not just the rat under the crosshair — the whole
cluster panics) and, in the same shot, `spawnMamaRat(rt.home)` summons the
swarm's manhole's mama rat: **3× Turbo's current height** (`turboHeight()`,
a live `THREE.Box3` measurement of `player.mesh` so it tracks his randomized
per-boot height rather than a hardcoded constant), built from the same
`makeRatMesh(scale)` factory as the regular swarm (refactored out of the old
inline pool-init loop so both share one model). She rises out of the manhole
over ~1.8s (`state:'emerge'`), then walks straight at the player at a slow,
constant 2 u/s (`state:'hunt'`, well under the player's 4.6–8.2 u/s foot
speed — she's meant to be outrun, not outraced), and on contact bites for
8–16 HP roughly once a second (`damagePlayer`, gated to `G.mode==='foot'` and
`!DEV_STATE.god`). She's a real target: 260 HP, hittable by the pistol
(`'mamarat'` kind, 34 dmg/shot) and by RPG splash (`damageArea` now checks her
too), dies with a short shrink-out and a `$150` "RAT SLAYER" payout, and only
one exists at a time (`spawnMamaRat` no-ops while `mamaRat` is set). New
section `MAMA RAT (rat vengeance) — PLACEHOLDER` sits directly after
`updateRats`; `updateMamaRat(sdt)` runs in the main-loop substep next to
`updateRats(sdt)`. Covered by `tests/cases/rat-vengeance.test.js` (3 cases:
swarm-shot → kill-count → spawn; 3×-height + emerge→hunt distance-closing;
bite-on-contact + shot-down-and-removed) — full suite 39/39 green, verified
in a live headless smoke pass (screenshot-checked, zero console errors) that
the model renders at the right scale relative to the street.
**Explicitly a placeholder model/animation** — a scaled-up copy of the tiny
swarm rat (sphere body, two ear-balls, cylinder tail), uniformly scaled by
height ratio, so she reads as a giant blob-rat rather than a designed
creature. **This is intentionally left for Kimi to redesign** — a real mama
rat model (proper proportions instead of uniform scale blowing out length,
a crawl/lunge animation instead of a sliding lerp, a bite animation instead
of a stationary bump-and-flash) is the next step; keep reusing `makeRatMesh`'s
call sites (`spawnMamaRat`) so swapping the model is a localized change.
**Known placeholder limitations (by design, not bugs):** no obstacle
avoidance — she beelines through buildings, unlike `resolveFootCollision`-
using entities; no car interaction — driving over her doesn't hurt her and
she doesn't damage or push a car she reaches, she just stands there (the
"eat you" bite is foot-mode only); no despawn/timeout — once summoned she
persists (by design, for the "vengeance" framing) until killed or the page
reloads, including across `respawn()` after a bust/waste.
**Why this exists:** requested as a direct extension of the existing atmospheric
rat system — the swarm already existed, the ask was to make shooting it
consequential instead of just being a corpse-cleanup animation.
**Where:** `SEWER RATS` section (`makeRatMesh`, `RAT_POOL`, `updateRats`) and
the new `MAMA RAT` block immediately after it; `doAttack`'s pistol branch
(`WEAPONS` section) for the `'rat'`/`'mamarat'` target kinds; `damageArea`
(also `WEAPONS`) for RPG splash; the main loop's substep for `updateMamaRat`.

#### RV2 — Final creature design `P2 · Risk: Low` `next up for Kimi`
**Why:** RV1 deliberately shipped the mechanics with a throwaway model so the
system could be tested and tuned without blocking on art. The placeholder
blob-rat is not the intended final look.
**Where:** `makeRatMesh` (shared by the swarm and mama rat) — build the real
model here, or fork a `makeMamaRatMesh` if mama rat ends up needing rig
features the tiny swarm rat doesn't (visible bite/lunge joints, etc.).
**Approach:** Design a real low-poly rat that holds up both tiny (swarm,
~0.3u) and huge (mama rat, 3×Turbo) — proper body/leg/tail proportions
instead of a uniformly-scaled sphere-and-cylinder blob, a idle/walk
animation cycle (today she just slides with a bob), and a lunge/bite
animation for the contact state instead of the current stationary
flash-and-shake. If it's a real rig (not a fixed mesh), reuse the
`mesh.userData` joint-exposure pattern from `js/person.js` so `updateMamaRat`
can drive it the way `updateFoot`/`updateFootCops` drive their `legL/legR/
armL/armR` joints.
**Acceptance:** swarm rats and mama rat both use the new model; mama rat
still measures out to 3× `turboHeight()`; no regression in
`tests/cases/rat-vengeance.test.js` or the rest of the suite; holds framerate
with a swarm on screen (the pool is 16 rats, cheap instancing/geometry
matters more there than for the single mama rat).

#### RV3 — Follow-on polish (not yet scoped) `P3 · Risk: Low`
**Why:** RV1 is a minimum-viable vengeance loop. Once RV2's model lands there's
room to make her a proper set-piece encounter instead of a slow blob that
either bites you or doesn't.
**Ideas, unscoped, pick up only after RV1/RV2 are solid:** building/prop
avoidance so she can't be trivially juked through a wall; a growl/screech
`sfx` cue and dedicated voice/bark line instead of reused `sfx.punch()`/
`sfx.bigCrash()`; car interaction (run her over, or she flips/damages a car
that gets too close); heat/wanted interaction (does summoning her raise
`G.heat`, the way shooting a ped already does via `addHeat(18)` in the
`'ped'` branch — right now `'rat'` doesn't call `addHeat` at all beyond the
flat `addHeat(4)` every pistol shot already applies); a cap or cooldown if
repeat testing shows player-summoned mama rats becoming a farmable money
loop (`$150` "RAT SLAYER" payout on kill has no gate today). Ask Austin
before committing to any of these — they're ideas, not approved scope.

---

## 9. Verification & Definition of Done

Before committing **any** task:

0. **Automated suite is green.** `cd tests && node run.js` — catches state-
   machine and save-shape regressions before you even open a browser.
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
Austin points you to). Push there, then **always open a PR into `main`** —
don't push/fast-forward `main` directly.

---

## 10. Suggested Order of Work

A sensible sequence that front-loads leverage and keeps the game shippable
throughout:

```
✔ D1  Dev menu / cheat console   DONE
✔ D2  Fast-boot & scene-jump     DONE
✔ F1  Save/restore               DONE
✔ F2  Pause + Settings menu      DONE
✔ D3  Debug HUD                  DONE
✔ R1  Dispose on removal         DONE
✔ F3  Adaptive quality           DONE
✔ F4  Audio mix + ducking        DONE
✔ J1  Haptics & impact feedback  DONE
U1  Objective clarity/HUD       ← NEXT
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

**Football saga track** (Phase 7, above) also runs in parallel — `FB1` (ambient
jocks) and `FB2` (field) are done. Next: `FB3` Coach mission (depends on `F1`
for the persistent unlock flag, and ideally the `CUTSCENES` system) → `FB4`
minigame → `FB5` cutscene (benefits from `C8`'s actor/pose work, but
can ship camera-only if that's not ready yet). See `STORY_BIBLE.md` for every
narrative beat this track needs.

**Rat Vengeance track** (Phase 8, above) is a small ongoing side-track — `RV1`
(shoot the swarm → mama rat spawns, hunts, bites, and can be killed) is done
with a throwaway placeholder model. Next up is `RV2`: give her (and the regular
swarm) a real model/animation in `makeRatMesh`. `RV3` is unscoped follow-on
polish — don't start it without checking in first.

Pick the top unclaimed task, read its card, check the acceptance criteria, build
it small, verify (§9), commit. When in doubt about a design decision, ask.

---

## 10. Changelog — polish pass (Kimi3, 2026-07-22)

Owner-requested fixes, all verified headless (see `tests/cases/new-features.test.js`,
9 cases) plus screenshot review:

- **Helicopter orientation:** `makeHeliMesh` was built nose-at-−z while headings
  fly +z — the whole mesh was backwards. Flipped nose/tail/fin/tail-rotor to the
  car convention (+z = direction of travel).
- **Heli shadow glitch:** blob shadow was a *child* of the heli group, so it rode
  up into the sky. Shadows are now scene-level (`makeHeliShadow`/`updateHeliShadow`,
  own cloned material so altitude fades them), tracked for player, cop, and
  pilotless helis.
- **Rooftop landing / ocean leash:** `doEnterExit` now exits whenever
  `h.landed` (roof landings always worked; exiting above 1.5u didn't). Heli
  bounds widened from `H+6` to `WATER_R+160` — you can fly far out over the
  ocean (ditching still kills you).
- **Bail + parachute:** airborne EXIT becomes `BAIL OUT` → freefall state
  (`player.bailing`, `updateBail`). CHUTE button (or Space) opens a red/white
  striped canopy (`makeChuteMesh`), steerable with the left stick; land on
  streets or roofs, splash = wasted, no-chute impact > 20 = wasted. The
  abandoned heli spins down and wrecks itself (`updatePilotlessHelis`).
- **Jocks:** letterman jackets (`addLettermanJacket` — team wool torso, white
  leather sleeves, rib knit, snaps, chenille "C"), bigger builds, real collision
  (`jockHit` in `resolveFootCollision` + player/jock/jock-jock separation),
  building/tree/vehicle avoidance, and a working chase→swing→knockdown loop
  (they used to call the *player's* `doPunch`).
- **Twin-stick gun:** pistol/RPG meshes ride the right forearm
  (`updateWeaponVisual`), center-screen CSS reticule (`#reticule`), and while
  armed Turbo faces `footCamYaw` — left stick strafes, right thumb aims.
  Punch now animates the right arm (snap out + torso twist).
- **Dogs:** orphaned dogs become `strayDogs` (persist, capped at 16), band into
  `dogGangs` that roam waypoints. Punch/shoot a dog → pack goes `angry` and
  bites. `meat` pickup (brown "M") feeds packs (FEED MEAT button / `V`); 3
  chunks = pack heels behind you; THROW MEAT marks a ped for the takedown;
  GO AWAY button / `B` releases them.
- **Car audio:** 4-speed with a 0.42s clutch dwell (`car.shiftT`) instead of
  instant 5-speed jumps; LP top cut ~2.3k→~1.5k and boost whine 45→22 (no more
  shrill static at full chat); engine gain trimmed slightly.
- **Sleeker cars:** `wedgeGeo` triangular prisms — wedge hood, rear deck,
  fastback windshield + rear glass on sedan/taxi/sports/muscle/compact/cop.
  Vans/pickups stay boxy on purpose.
- **Trees are solid:** `treeHit` wired into foot, car, ped, and heli collision.
- **Boost ≠ fire:** boost exhaust is now blue `COL_NITRO`, not orange flames.
- **Burn-then-blow:** player car ≤ 22hp catches fire with a 30s fuse (2.5s if
  already ≤ 0) — bail before it goes. All car deaths go through `killCar` →
  `bigExplosion`: fireball, climbing mushroom-cloud emitter (`boomFx`),
  shockwave ring, and a 5s `G.boomCam` beat that pulls out and follows the
  cloud up. Chain reactions between cars work (dead flag set before the boom).

## 11. Changelog — GTBIV-index.html reconciliation (Claude, 2026-07-22)

A stray `GTBIV-index.html` (7,646 lines) had been uploaded to repo root
alongside `index.html` (6,765 lines) via GitHub's web upload flow, the same
pattern as the earlier `GTBIV-changes 7 20` mistake — except this one turned
out to be a coherent, further-evolved build on top of the current
`index.html`, not clutter. Confirmed via diff (984 added / 103 superseded
lines, no orphaned features) and adopted wholesale as the new `index.html`;
the stray file is deleted. New/changed since the last documented pass:

- **FB2 done:** the Wildcats football field (§8 Phase 7) — green turf +
  yard lines + end zones painted into the ground texture, goalposts,
  three-tier bleachers (solid, collidable), lit scoreboard. Stored as the
  `FOOTBALL` landmark; jocks now bias-spawn there.
- **Terrain:** `groundH(x,z)` adds gentle knolls to parks and rolling dunes
  past the beach ring; buildings/trees/props/vehicles/peds/cars all seat on
  it (car pitch now follows the slope under the tires).
- **Elevated light rail:** a looping four-car train (`railTrain`/`updateRail`)
  on a beam-and-pillar guideway around the 2nd ring, four walkable stations
  with stairs down to the sidewalk. Pillars are solid (`propHit`).
- **Stairs & fire escapes:** climbable `STAIR_RUNS` on mid-rise/tall
  buildings (straight stairs or zigzag fire escapes), several leading to new
  rooftop **hideouts** — a green ring marker.
- **Wanted-system feel (partial P3):** `updateWanted` now checks real
  line-of-sight (`losClear`) instead of raw distance, and splits "run" (get
  far away) from "hide" (break LOS and lay low, faster inside a hideout or
  `G.interior`) with a live `#heatHint` readout. Difficulty options from
  P3's card are still open.
- **Foot cops & sewer rats:** cops can bail out of a stuck/nearby cruiser and
  chase on foot (`footCops`, baton below 3 stars, sidearm at 3+), dropping a
  pickup when downed. A new `damagePlayer`/`G.hp` foot-health bar
  (`#footHp`) with passive regen after 5 quiet seconds. Downed peds/cops near
  a manhole draw a rat swarm (`RAT_POOL`) that hauls the body off piece by
  piece — atmospheric, not a game-affecting system.
- **Smaller fixes carried in the same build:** three building-facade styles
  instead of one repeated texture, roof crowns/parapet lips, more street life
  (higher ped/traffic/chat-line counts, player-aware "hey it's Turbo" chatter),
  rocket vertical aim (follows look-pitch), a proper expanding fireball on
  explosions, wider camera pitch range, a `fitScreen` watchdog for mobile
  Safari viewport wobble, and cop-pistol/nightstick pickups.
- **Docs:** `F2` (Pause + Settings) and `FB2` marked `DONE` above — both were
  already implemented in history but the status/order tables hadn't caught
  up; verified against the current code before marking.

Verified: `cd tests && node run.js` — 36/36 green, zero console errors.
Headless Playwright smoke pass at 800×390 landscape — boots, starts, zero
page/console errors, football field renders (turf, bleachers) and is
reachable on foot.

---

## 12. Changelog — mobile black-bar / left-shift fix (Claude, 2026-07-23)

Portrait phones self-present landscape by rotating `body` 90° in CSS
(`html.gtb-rotated`). That rotated box was sized in **CSS `100vh`/`100vw`
units**, but the WebGL canvas is sized in **`window.innerHeight`/`innerWidth`
pixels** (via `vw()`/`vh()` → `renderer.setSize`). On iOS Safari those two
metrics disagree — `viewport-fit=cover`, the `black-translucent` status bar,
and the collapsing address-bar toolbar all make CSS viewport units track the
*large* viewport while `innerHeight/innerWidth` track the *visual* one. The
canvas therefore filled a different rectangle than its rotated container,
leaving a **black bar** and a **left shift** on load.

Fix (layout only, no game logic touched):

- The rotated `body` box is now sized off `var(--lvw)`/`var(--lvh)` — the
  custom properties `updateOrientationMode()` already keeps in lockstep with
  `innerWidth/innerHeight` — instead of `100vh/100vw`. Canvas and container
  now share one pixel source of truth, so they can't drift apart. `100vh/100vw`
  remain only as a fallback for the single synchronous frame before JS first
  sets the vars.
- `fitScreen()` (the visualViewport-resize + 1s watchdog that re-fits the
  canvas) now also calls `updateOrientationMode()` whenever it resizes, so a
  toolbar collapse/expand can't reintroduce the mismatch mid-session.

Verified: `cd tests && node run.js` — 43/43 green, zero console errors.

---

## 13. Changelog — 80s synthwave soundtrack rebuild (Claude, 2026-07-23)

The radio was three static 16-step loops. Rebuilt into a full procedural
80s synthwave soundtrack, in three passes:

1. **Engine + FX rack.** Replaced the flat instrument set with `sw*`
   synths (kick, layered clap, snare, hats, toms, crash, riser, sub+saw
   bass, detuned-unison "supersaw" pad, plucky arp, vibrato lead) routed
   through a shared rack built in `initAudio`: sidechain **pump**
   (`musicPump`, ducks on every kick), convolver **reverb** send, ping-pong
   **delay** send tuned to each song's tempo, and a bus compressor.
   `musicGain → musicVODuck → masterGain`; the radio now **ducks under
   Turbo/Deb voiceover** (ref-counted `voDuckOn/Off` → `duckMusicForVO`,
   both the mp3 and TTS paths) — this is what F4 built its `sfxGain`/
   `voiceGain` split on top of afterward.
2. **Through-composed songs + wanted-heat layer.** Each station became a
   *playlist* of songs (`SW_SONGS`) with real arrangements (`sections`:
   intro/build/drop/breakdown, an `e`nergy that morphs the kit + filter
   brightness), chord progressions, basslines, and authored lead melodies.
   `updateHeatLevel()` smoothly tracks `G.stars` into `heatLevel` (fast
   rise, slower cooldown) and `heatEnergy(sec)` leans the *current* song
   hotter as a chase escalates — busier kit, an off-beat kick pulse past
   `heatLevel>0.55`, a `swChaseStab` past `heatLevel>0.8` — without
   switching tracks.
3. **12 songs + hot/calm loop variants.** Grew the dial to 12 songs (4 per
   station: VICE FM / TURBO FM / MIRAGE 105). Every song now also defines
   a `calmLoop` (sparse ambient wash) and `hotLoop` (tight 4-bar chase
   remix, built from that song's own chords via `makeCalmLoop`/
   `makeHotLoop`; three flagships get a bespoke `hotLoop` with its own
   riff). `desiredSwMode()` picks `'normal' | 'hot' | 'calm'` with
   hysteresis (hot enters `heatLevel>0.65`, exits `<0.45`; calm needs
   `calmT>6` real seconds clean — not just low heat, so a fresh boot
   doesn't sit in the ambient loop instead of the authored arrangement).
   `scheduleMusic()` only swaps at a bar boundary, **freezes the normal
   arrangement's position while a loop plays**, and stings the entrance
   into hot mode with `swCrash()` — so a chase makes whatever's already
   playing hit harder, hands off to its own chase mix, then hands back
   exactly where it left off.

Merged with the F4 (SFX/Voice buses), F3 (adaptive quality), J1
(haptics), R1 (dispose-on-removal), and rat-vengeance work landed on
`main` in parallel — the merge was clean (F4's buses build directly on
this work's `musicGain`/`voDuckOn` plumbing, just rerouting `sfx.*`/VO
through the new `sfxGain`/`voiceGain` sub-buses).

Added `tests/cases/soundtrack.test.js`: validates all 12 songs + their
loop variants are well-formed, schedules every song/variant through the
FX rack without throwing, checks the heat layer raises effective energy
without breaking the clamp, and drives the hot-loop state machine through
a full entry/freeze/cooldown/resume cycle.

Verified: `cd tests && node run.js` (all 9 case files run individually,
avoiding a container-load flake seen on the combined run) — 41/41 green,
zero console errors.

---

## 14. Changelog — voice wiring: robbery barks (Claude, 2026-07-23)

First slice of the **VOICE** task (wiring the ~90 staged `voice/turbo/story/`
lines that were recorded but referenced nowhere). Two bark pools pulled out of
the staged pile and hooked to the triggers they were written for:

- **`robbery`** (9 lines, `voice/turbo/story/robbery/`) → fires on the
  point-blank **stickup** in `doAttack()` (pistol, point-blank on a ped → they
  surrender their cash). The polite-stickup patter ("This is a stickup. A
  polite one.").
- **`robbery_take`** (5 lines, `voice/turbo/story/robbery_take/`) → fires when
  the **safe crack lands** in `tapSafeCrack()`. Turbo counts the take against
  Deb's $800 ("Four hundred to go.").

Both go through the existing `turboSay(cat)` dispatch (recorded-only, 2.2s
cooldown, preloaded via the `TURBO_LINES` warm-up), so no new audio plumbing —
just two `TURBO_LINES` categories and two one-line call sites. Additive, no
save-format change, no new system.

New regression guard: `tests/cases/voice-wiring.test.js` asserts every wired
story pool exists, is non-empty, and each `src` resolves to a real committed
mp3 — the net for the rest of the staged lines as they get wired.

Still staged / next in this task: `paying_deb`,
`approach_deb`, `idle_backstory`, the `cutscenes/` VO, and
`backstory_intro/`.

Verified: `cd tests && node run.js` — green, zero console errors.

**Update (same day):** two more pools were already wired to triggers but sat on
`src:null` (silent TTS) with their recordings on disk unused — filled in the
paths, no code change beyond the data:
- **`pizza_jack`** (7 lines, `voice/turbo/story/pizza_jack/`) — already fires in
  `doPizzaJack()` when you jack a marked delivery car.
- **`debt_grumble`** (7 lines, `voice/turbo/story/idle_debt/`) — the ambient
  mutter while the $800 is unpaid (`updateStory`).
Both added to the `voice-wiring.test.js` guard. `paying_deb`/`approach_deb` are
deliberately held: their moments already run a cutscene with its own VO, so
they need sequencing (not a drop-in) — a later slice.

**Update (same day, pacing pass):** wired **`idle_backstory`** (5 lines,
`voice/turbo/story/idle_backstory/`) — general backstory-callback musings, not
debt-specific. Rather than give it its own independent timer stacked on top of
`debt_grumble`'s, the two now **share one slow timer** (`idleBarkT`, renamed
from `debtGrumbleT`) that alternates which pool fires. Net effect: the total
rate of unprompted Turbo chatter *doesn't* go up just because a category was
added — if anything it eases slightly (interval widened from `rand(30,50)` to
`rand(35,60)`s). Explicit design intent: keep ambient barks rare, let the game
breathe. Guarded by a new pacing assertion in `voice-wiring.test.js` (timer
must start >= 30s) so a future change can't quietly tighten it into a wall of
sound.

---

## 15. Changelog — GitHub branch-protection settings baked into docs (Claude, 2026-07-23)

Austin shared the repo's actual GitHub settings (`main` protected, PRs
required, **0 required approvals**, squash-only merge, linear history
required, force pushes blocked, head branches auto-delete, no CI/status
checks configured, no required reviewers/code owners/signed commits, branch
naming `<agent-name>/<short-feature-description>`) so agents stop guessing at
what's enforced. Docs updated to match:

- **`AGENTS.md`** gets a new **§2.1** with the full settings list, and rule 4
  (plus the flow diagram, the quick-start in §6, and the wrap-up template in
  §7) now say agents **squash-merge their own PR once it's mergeable**, since
  0 required approvals means nothing blocks it. This flips the prior "Austin
  merges, agents never do" rule — that rule predated confirmation of the
  actual branch-protection config.
- **`CLAUDE.md`** rule 1 updated to match.

No code changed; suite untouched (still green as of the last code commit).

Next: agents doing PR work should merge their own PRs going forward instead
of leaving them open for Austin.

---

## 16. Changelog — U1 first slice: story-objective HUD + minimap legend (Claude, 2026-07-24)

Picked up **U1** (`§8`), the top of the main-track order in `§10`. Until now
"what do I do next" only existed for timed random missions (`setMissionHUD`
+ the 3D beacon) — the Chapter-1 story goal (find Deb, then pay off the $800)
had a one-time toast and an in-world pink beacon pillar, but nothing
persistent on the HUD and no minimap presence at all.

- **`updateStoryObjHUD()`** (new, next to `setMissionHUD`): a small HUD line
  (`#storyObj`, styled identically to `#mission` via a shared CSS rule) that
  shows `FIND DEB — Nm` before `G.story.metDeb`, then `PAY OFF DEBT — $N ·
  Nm` while the debt is outstanding, live distance recomputed every frame.
  It yields to `#mission` whenever a random mission is active (checked first,
  same HUD slot) so the two objective sources never fight for the screen, and
  hides once `G.story.paidOff`. Called from `updateStory(dt)`, which already
  runs every frame.
- **Deb is now a minimap blip** (`drawMinimap()`): a pink dot at her position
  whenever she exists and isn't in her post-payoff `leaving` walk-off, using
  the same rotating player-centric map (and therefore the same "which way to
  turn" read) missions already got from the gold beacon dot.
- **Minimap legend** (`#minimapLegend`, new element under the minimap): four
  lines — COPS (red), MISSION (gold), TURF (purple), DEB (pink) — the exact
  set the `U1` card asked for. Non-interactive (`pointer-events` inherited as
  `none` from `#hud`, matching the minimap itself), sized down at the
  existing `max-height:430px` shrink breakpoint alongside the minimap so it
  doesn't creep into the button/pedal area on short landscape screens.

Verified in a live headless smoke pass at an 800×390 landscape viewport (both
the pre-meet and debt-owed states) — legend and objective line render clearly
with no overlap of the minimap, mission box, or touch controls. New
`tests/cases/hud-objective.test.js` (5 cases) covers the HUD text/visibility
state machine and a minimap-draw smoke check with Deb present.

Full suite: `cd tests && node run.js` — **53/53 green** (up from 48; 5 new
cases), zero console errors.

Signed: Claude Code | Sonnet 5 | medium
