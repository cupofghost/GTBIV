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

- **W2 — The single ~11.9k-line `index.html` taxes every edit.** `P1 · Risk: High`
  (this is **X1**, but the cost is felt on *all* tasks, not just refactors). One
  ~565 KB `<script>` block means every Grep/Read/Edit fights the file size and it
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

- The **entire game is one file**: `index.html` (~11,850 lines, ~565 KB). Markup
  + CSS + ~11,100 lines of game JS. Three.js is vendored as `three.min.js`
  (r128). These figures are refreshed by `node tools/codemap.js --write` — if
  they look wrong, run it rather than trusting them.
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
lines     1–  14  <head>, meta, PWA links
lines    15– 452  <style>   — all CSS (HUD, controls, overlays, cinematics)
lines   454– 711  <body>    — DOM: HUD, joystick, pedals, buttons, overlays
line    712        <script src="three.min.js">
lines   715–11852 <script>  — the entire game (see the Code Map in §5)
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
| top of `<script>` | **Helpers & global state** — `rand/randi/pick/clamp/lerp/angDiff`, `TAU`, `$`, and the two master state objects **`G`** and **`WORLD`** (see §6.1). A `// CODE MAP` comment block right below lists every banner with its current line range |
| `DEVICE / ORIENTATION` | `IS_TOUCH`, self-rotating portrait phones (`ROTATED`, `vw`/`vh`, `remapXY`) |
| `AUDIO` | `initAudio` (+ `buildMusicRack`/`makeIR` FX rack), engine synth layers, heli rotor chop, `sfx` object, `WEAPON_SFX` voices |
| `PROCEDURAL 80s SYNTHWAVE SOUNDTRACK` | `SW_SONGS`, `STATIONS`, `scheduleMusic`/`stepSong`, `sw*` instruments, hot-loop swap under heat |
| `THREE SETUP` | `scene`, `camera`, `renderer`, sky/sun textures, lights |
| `CITY` | Procedural block/building/road generation, `intersections`, **terrain** (`VERT_H`, `groundH`, `terrainLines`/`terrainGeo` ground + beach meshes — see `TERRAIN.md`), water, ramps, street furniture, collision helpers (`buildingHit`, `rampHit`, `resolveFootCollision`) |
| `RADIO TOWERS` (inside `CITY`) | One tall guyed mast on an open block + rooftop masts on the tallest buildings, `updateRadioTowers` blinking obstruction lamps. Decorative — never added to `buildings` |
| `FOOTBALL FIELD` | Wildcats turf, goalposts, bleachers, scoreboard |
| `ELEVATED LIGHT RAIL` | `RAILPATH`, stations, variable-length pillars, the animated train |
| `STAIRS & FIRE ESCAPES` | `STAIR_RUNS`, `stairHitRun`/`stairH` — climbable runs the feet follow |
| `WALL LADDERS` | `LADDERS`, `ladderGrab`, `mountLadder`, `updateClimb` |
| `PARTICLES` | Fixed-size pool (`P_MAX=360`, `parts[]`), `spawnP`, `burst`, `updateParticles`, colour constants |
| `BLOB SHADOWS` | `makeShadow` |
| `GPU RESOURCE CLEANUP` | `disposeMesh`, `_sharedGPU` (shared geometry/materials that must never be disposed) |
| `CARS` | `CARTYPES`, `makeCarMesh`, `makeCar`, traffic spawn |
| `PEDESTRIANS` | `makePerson` (rigged limbs, see `js/person.js` + `js/npc-types.js`), `spawnPed`, chatter |
| `PIZZA DELIVERY SYSTEM` | Jackable pizza cars, `activeDelivery`, delivery loop |
| `RIVAL PIZZA GANG: CHAOS PIZZA` | `chaosDrivers`, `gangMembers`, turf on minimap |
| `FOOTBALL RIVALS: CHAOS HIGH JOCKS` | `JOCK_TAUNTS`, `spawnJock`, jock AI |
| `COACH REMATCH (FB3)` | Old Scores → Rematch (`updateCoachMission`, `startOldScores`, `spawnCoach`, `hurtCoach`, `coachYields`, `coachSoftRetry`), `jocksHostile`/`jockTauntPack`, strand bark packs |
| `TURBO BOWL (FB4)` | Endless-run minigame (`updateTurboBowl`, `startTurboBowl`, `endTurboBowlRun`, `updateTbDefenders`), PLAY BALL beacon, yardage scoring + persisted best, `turbo_bowl_payoff` |
| `STRAY DOGS & DOG GANGS` | Dogs, packs, `angry` state + growl/bite cues, meat drops |
| `PIZZA WARS MISSION` | Scripted gang-war mission (`startPizzaWars`) |
| `PLAYER` | The `player` object and its initial state |
| `PIZZA PLACE & INTERIOR` | Pizza-place exterior/interior, robbery, enter/exit, heist funcs (`spawnGuards`, `updateGuards`, `updateSafeCrack`, `checkHeistTriggers`) |
| `SIDEWALKS & STOREFRONT AWNINGS` | 3D kerb strips, sidewalk slabs, awnings |
| `MORE CITY BEAUTIFICATION` | Street trees, planters, cafe tables, pole banners |
| `CITY GLOW: NEON, LIT WINDOWS & LIGHT POOLS` | `cityGlowDayNight`, facade night-window swap (`facadeMats`), instanced neon signs, streetlight glow pools |
| `DAY/NIGHT & HEIST SYSTEM` | `toggleNight`, night sky, heist triggers |
| `PICKUPS` | `pickups`, `pickupDefs`, `spawnPickup`, `scatterPickups`, `collectPickups`, `updatePickupVisuals` |
| `HELICOPTERS` | Player heli + `spawnCopHeli`/`updateCopHeli`, pilotless helis |
| `TALKING PEDS` | Speech bubbles, `wahVoice`, `doTalk` |
| `WEAPONS` | `cycleWeapon`, `doAttack`, rockets, `explode`, `damageArea`, `WEAPON_SFX` (per-weapon fire/reload synth registry), `reloadPistol`, `startMissileFlight` (spatialized flight-loop sound) |
| input | `joyStart/Move/End`, `doJump`, `applyLook`, `pollKeys` |
| `WANTED` | `addHeat`, `clearHeat`, `spawnCop`, `updateWanted` |
| `CAR PHYSICS` | `carPhysics`, `damageCar` |
| `PLAYER: FOOT & CAR` | `updateFoot`, `updateCarMode`, enter/exit, punch, horn |
| `HUD / TOASTS` | `toast`, `addMoney`, `updateStarsHUD`, `setMissionHUD`, `cycleRadio` |
| `MISSIONS` | `startMission` (5 random types), `updateMission`, complete/fail, beacon |
| `AI` | `updateTraffic`, `updateCops`, `updatePeds`, pickup visuals |
| `FOOT COPS` | `spawnFootCop`, foot-cop AI, baton/pistol drops |
| `SEWER RATS` | `RAT_POOL`, `spawnRats`, `updateRats`, manholes |
| `MAMA RAT (rat vengeance)` | `spawnMamaRat`, `updateMamaRat`, her screech/bite/death voices |
| `BUSTED / WASTED` | `bigEvent`, `respawn`, `busted`, `wasted` |
| `CAMERA` | `updateCamera`, `cameraCollide`, `shake` |
| `MINIMAP` | `drawMinimap` |
| `MAIN LOOP` | `loop()` — the one `requestAnimationFrame` driver, `bootSpawns` |
| `ORIENTATION` | `checkOrientation`, fullscreen |
| `ANIMATED INTRO` | Fly-through intro camera |
| `STORY: TURBO JONES, CHAPTER 1` | `spawnDeb`, `updateStory`, the $800 debt, story cards, store robberies |
| `CUTSCENE SYSTEM` | `CUTSCENES`, `playCutscene`, dialogue box |
| `VOICEOVER SYSTEM` / `INTRO NARRATION` | `speak`, recorded VO (`loadVOFiles`, `playVOFile`), trailer/turbo lines |
| `DEV TOOLS` | `?dev=1` panel, cheats, god mode, teleports |
| `CINEMA MODE (was REPLAY)` | `enterReplay`/`exitReplay`, `updateCinemaCam`, `cinemaCamStep` free-fly camera, the `REC_DUR` ring buffer + scrub, HIDE HUD |
| `CINEMA: SCENES & STAGING` | `cinemaPlayScene` and the scene menu — `cinemaIntro`, `cinemaCutscene`, `stageJockFight`, `stageCarBoom`, `stageShootPed`, `stageRatMother`, `cinemaStartReplay`, plus `cinemaFrame`/`cinemaClearStaged` helpers |
| `PAUSE MENU & SETTINGS` | Pause menu, volume/quality sliders |
| `CONTROLS CARD (U2 onboarding)` | `openControlsCard`/`closeControlsCard`, first-boot auto-show, tab switching |
| `SAVE SYSTEM` | `queueSave`, `restoreSave`, the localStorage blob |
| `START / RESIZE` | Boot, resize, event wiring |

---

## 6. Core Systems Reference

### 6.1 State model
Two global objects hold nearly all mutable state:

```js
const G = { mode:'foot'|'car'|'heli', money, heat, stars, carHP, boost,
            escapeT, bustT, missionsDone, over, started, paused,
            station, weapon:'fists'|'pistol'|'rpg', rockets,
            pistolAmmo, reloading };  // pistol magazine (12) + auto-reload lockout, see WEAPONS
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

#### D4 — Free-fly / spectator camera `P1 · Risk: Med` `DONE (via Cinema Mode)`
**Status: delivered as part of Cinema Mode** (originally the Replay System,
Kimi3). The cinema fly-cam is a full spectator camera: joystick/WASD moves in
the look plane, right-side
drag orbits, `E`/`Q` (or UP/DN touch buttons) for altitude, Shift for speed —
and it returns cleanly to the normal follow-cam on exit. A standalone
dev-mode detach toggle can still be added later if wanted, but the capability
(and the cutscene-shot-composition use case) is covered.

**CINEMA MODE** (player-facing, ships in normal sessions — not dev-gated;
the old REPLAY SYSTEM grown into a director. Two banners: `CINEMA MODE (was
REPLAY)` and `CINEMA: SCENES & STAGING`):
`enterReplay()` (HUD **🎬 CINEMA** button / `R` key) sets `G.replay` and enters
**live** — the sim keeps running underneath and the camera detaches into a
free-fly director (`replay.live=true`, `cinemaCamStep`/`updateCinemaCam`:
stick/WASD in the look plane, drag to orbit, `E`/`Q` or the UP/DN buttons for
altitude, Shift for speed). The director is a ghost while filming —
`DEV_STATE.god` is forced on and its previous value restored on exit — so a
staged explosion or the rat mother can't waste him mid-shot. Gameplay HUD
(`btns`, `pedals`, `mission`, `heistHUD`, `pauseBtn`) is hidden on entry and
restored from `dataset.rv` on exit.

The `#cinemaScene` dropdown drives everything (`cinemaPlayScene`): Free-Roam
Camera, Intro Flythrough (`cinemaIntro`/`updateCinemaIntro`), four scripted
convos replayed through the normal cutscene system (`cinemaCutscene` — Deb
Confrontation, Deb Payoff, First Score, Pizza Warning), five staged action
beats (`stageJockFight`, `stageCarBoom` for a civilian or cop car,
`stageShootPed`, `stageRatMother`), and **Replay (last 30s)**. Staged actors
are tracked in `replay.staged` and torn out of `jocks`/`peds`/`cars` by
`cinemaClearStaged()` before the next scene, so scenes don't accumulate;
`cinemaFrame`/`cinemaFrameOnPlayer` swing the camera onto the subject from a
3/4 angle. `HIDE HUD` (`#cinemaHud`) drops the cinema bar itself for clean
recording, leaving a small `#cinemaShow` button to bring it back.

**Replay (last 30s)** is the one scene that still freezes: a `REC_DUR=30s`
ring buffer (`recBuf`, 15Hz snapshots of the player + every entity in
`cars/peds/cops/helis/gangMembers/jocks/chaosDrivers`) recorded once per frame
inside the `!G.over` gameplay branch. `cinemaStartReplay()` clears `live`,
reveals `#cinemaScrub` (play/pause, -5s, scrub slider, "Ns ago") and plays
back snapshots lerped between frames. Entities despawned mid-window are
temporarily re-added to the scene (`_ra` flag), original mesh visibility is
preserved (`_pv`), and `restoreReplayEntities()` snaps every live entity back
to its authoritative sim state when the scene ends or on `exitReplay()`.
Needs ≥1s of buffer; no recording during intro/cutscenes/pause.

**Turbo photo-op controls** (available in any scene): `TALK` toggles a
jaw-flap animation (`userData.jaw`/`mouth`, exposed on the `makePerson` rig),
`🕶 ON/OFF` slides a sunglasses prop on/off his face (built onto Turbo's
`headG` at boot, `userData.shades`, player-only; state survives exiting
cinema, jaw always resets to neutral).
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

#### D5 — Time controls (pause-step / slow-mo / fast-forward) `P2 · Risk: Low` `DONE`
**Status: implemented & verified** (OpenCode | Kimi K2). `TIME_SCALE` global (default `1`) scales the gameplay simulation dt in `MAIN LOOP` while keeping UI, recording, and fps counters on real time. Dev-only hotkeys `1` (1×), `2` (0.25×), `3` (4×), `0` (step one frame) plus dev-panel TIME row buttons `1×`/`0.25×`/`4×`/`Step`. `STEP_FRAMES` queues a single forced sim frame even while the pause menu is open, using a fixed `0.017s` step. Debug HUD shows the current speed. World visuals (particles, clouds, camera, burning cars, alarms, traffic lights, radio towers) scale with the time control; `recTick(dt)` stays on wall-clock time. Verified: `tests/cases/time-controls.test.js` 5/5 green; boot, controls-card, cinema-mode, regression, mission-variety, economy, camera-polish, hud-objective, smoke, and intro-camera suites green.
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

#### D7 — Deterministic seed (optional) `P2 · Risk: Med` `DONE`
**Status: implemented & verified** (OpenCode | Kimi K2). Added `_rng` as the central random source: it defaults to `Math.random`, and when `?seed=<n>` is present it swaps to a `mulberry32` generator. `rand`, `randi`, and `pick` now call `_rng`; every `Math.random()` call inside `index.html` was mechanicaly replaced with `_rng()`. `?seed=123` reproduces the same `rand(0,1)` sequence, `buildings.length`, and `randomRoadPoint()` across reloads; no seed leaves behavior unchanged. The `economy.test.js` mission-start helper was updated to override `_rng` instead of `Math.random`. Verified: `tests/cases/deterministic-seed.test.js` 3/3 green; boot, smoke, regression, economy, mission-variety, controls-card, cinema-mode, camera-polish, hud-objective, intro-camera, and time-controls suites green.
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

#### J2 — Hitstop + refined screen shake `P2 · Risk: Med` `DONE`
**Status: implemented & verified** (OpenCode | Kimi K2). Added `HIT_STOP` global and `triggerHitStop(ms)`; the `MAIN LOOP` scales `simDt` near-zero while `HIT_STOP` is active (capped at 80ms, decays by real dt). Triggered on player building/tree/prop crashes and hard landings in `carPhysics`, plus `explode` and `bigExplosion`. `shake()` now early-returns if `SETTINGS.reduceMotion` is on, and `updateCamera` uses `Math.pow(camShake,1.6)` displacement with speed-sensitive decay (slower decay for big shakes, faster for tiny taps). The car camera's boost FOV kick is also disabled when Reduce Motion is on. A **REDUCE MOTION** ON/OFF row was added to the pause-menu Settings panel, persisted in the `SETTINGS` blob. Verified: `tests/cases/hitstop.test.js` 5/5 green; boot, smoke, economy, camera-polish, controls-card, and haptics suites green.
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

#### J3 — Camera polish (foot + car) `P2 · Risk: Med` `PARTIAL`
**Status:** sensitivity/invert-Y and the low-speed car-cam follow-rate
shipped — see `§18`. The foot-camera-while-strafing smoothing bullet is
feel-tuning that needs an actual playtest to judge (this suite explicitly
can't — see `tests/README.md`); reviewed the existing `moveMag>0.12` +
`lookHoldT` gating and it already reads as reasonable on inspection, so left
untouched rather than guess at a change with no way to verify it helped.
Revisit with a real device/playtest pass if it still reads as whippy.
(A concurrent reconciliation pass on `main` had marked this `OPEN` — it
predates §18 landing; `PARTIAL` is correct post-merge.)
**Why:** The camera is already thoughtful (collision pull-in, look-hold, speed
FOV). Small tuning + options make it feel pro.
**Where:** `CAMERA` (`updateCamera`, `cameraCollide`), `applyLook`, Settings
(F2) panel.
**Approach:** Add a **look-sensitivity** slider and **invert-Y** toggle (Settings,
F2), applied in `applyLook`. Smooth the foot camera when strafing; make sure the
car camera doesn't feel sluggish at low speed. Don't regress the wall pull-in.
**Acceptance:** Sensitivity + invert options work and persist; camera never
clips into buildings; low-speed driving feels responsive; no motion sickness
spikes from over-fast lerps.

#### J4 — Control feel: joystick dead-zone + reverse/brake clarity `P2 · Risk: Med` `DONE`
**Status: done.** Dead-zone shipped earlier (see above); brake-vs-reverse
legibility shipped in `§17`. `joyMove` has a 10px radial dead zone with a
linear rescale back to full magnitude at the 55px max travel (no dead jump
right past the threshold) — standing still no longer drifts from thumb
jitter, full-tilt still hits `|input.jx,jy|`=1. The touch `#btnBrake` pedal
now relabels to **REVERSE** (with a distinct amber tint) once `player.car.
speed<-0.15` — i.e. once `carPhysics`'s existing brake-then-reverse behavior
has actually kicked into reverse — and the analog dash appends **· REV** to
the car-type readout at the same threshold, so desktop (which hides the touch
pedals) gets the same cue on the always-visible gauge cluster.
**Why:** Touch stick and the brake/reverse pedal are the highest-touch surfaces;
small tuning pays off constantly.
**Where:** `joyStart/Move/End`, `pollKeys`, `carPhysics` throttle handling,
`updateCarMode` (new `btnBrakeReversing` edge-detect), pedals DOM, the
`drawDash` call site in the main loop.

**Brake vs. Reverse Clarity Spec (for J4 reverse/brake part):**

**Physics Status:** `carPhysics` already implements correct brake→reverse sequence:
- Engine off or moving forward: brake (velocity toward 0)
- Stopped and reverse input held: engage reverse (backward acceleration)
- Current code: correct; issue is only **UI clarity**, not mechanics

**UI Problem:** Touch/desktop both show a single "BRAKE" button. On press, physics do the right thing (brake if moving, reverse if stopped), but the player doesn't know which mode is active. Result: confusion on first reverse ("why isn't the car going backward?").

**Solution — Three changes:**

1. **Touch Pedal Button (DOM):**
   - Rename `#btnBrake` to `#pedBrake` (internal ID, no user-facing change)
   - Add dynamic `data-state="brake"|"reverse"` attribute
   - CSS: button text swaps based on state: `data-state[brake] { content: 'BRAKE'; }` vs `data-state[reverse] { content: 'REVERSE'; }`
   - Update: in `carPhysics`, after `car.vel.length() < 0.1` (stopped), set `$('pedBrake').dataset.state = 'reverse'`
   - Clear: in `carPhysics`, if moving forward, set back to `'brake'`
   - *Effect:* Touch players see "BRAKE" when moving, "REVERSE" when stopped

2. **Desktop Keyboard (HUD Hint):**
   - Add a tiny indicator below the speedometer: `[S = BRAKE]` when moving, `[S = REVERSE]` when stopped
   - Same state-tracking as above, just in the speedometer UI code instead of DOM

3. **Color Feedback (Optional):**
   - Button background tint: brake = red-ish, reverse = purple-ish (or invert)
   - Reinforces the mode switch visually

**Code Hook Points:**
- [ ] `carPhysics`: after velocity check (~line 5200–5250), dispatch state change
- [ ] Touch pedal: bind to dynamic CSS via `dataset.state` (~50 characters of CSS)
- [ ] Desktop HUD: speedo text update in `updateDash` (~line 5700, small addition)

**Testing/Acceptance for J4 reverse part:**
- [ ] Touch: press brake while moving → button says "BRAKE"; stop car completely → button changes to "REVERSE" immediately
- [ ] Desktop: same state reflected in HUD hint below speedometer
- [ ] No input lag or flicker on state change; feels instant
- [ ] Gameplay unchanged (physics identical); only UI changes

---

### Phase 3 — Progression & Balance

#### P1 — Mission variety & light progression `P1 · Risk: Med` `DONE`
**Status: done** — see `§17`. Three new types (`courier`, `takedown`,
`getaway`) join the original five, gated behind `missionTier()` (reads
`missionsDone`, already persisted by `F1`) instead of a new save field.
**Why:** Five random side-missions repeat forever with only "don't repeat the
last one" logic — it goes stale fast.
**Where:** `MISSIONS` (`startMission`, `updateMission`, complete/fail), plus
`busted()`'s heat-driven-mission-fail branch.
**Approach:** Add **2–4 new mission types** in the existing data-driven style
(e.g. *getaway/escape*, *survive the ambush*, *chase-down*, *courier under
fire*). Weight selection by what the player is near / can do, and scale reward
with difficulty & distance. Introduce a **soft progression**: unlock tougher/
higher-paying missions as `missionsDone` climbs, so the loop escalates instead of
flatlining. Keep each mission self-contained and failable. Persist unlocks (F1).
**Acceptance:** You can play 15+ minutes without an obvious repeat; rewards feel
proportional; later missions are meatier than the first; nothing soft-locks if a
mission is abandoned (drive away → it fails/cleans up correctly).

#### P2 — Economy & debt-loop tuning `P2 · Risk: Med` `DONE`
**Status: done** — shipped in #38. Heist no longer solo-funds the debt, stickups
and stores are worth doing, and every payout routes through `addMoney()` so it
persists and gets consistent toast feedback. Big paydays ($50+) use the gold
class and larger amounts ($200+) get a longer toast.
**Why:** The $800 debt is the spine; income sources (robberies, missions,
deliveries, air-time) should make it a satisfying push, not trivial or grindy.
**Where:** `addMoney` call sites, `STORY`, mission rewards, pizza delivery
reward.
**Approach:** Audit every money source and sink, then tune to a target: a
focused player clears the $800 in a satisfying session, a careless one takes
longer. Add clear **payday feedback**.
**Acceptance:** A test playthrough to $800 feels earned. Every income source is
reachable and worth doing.

**Economy Audit (final tuned values, 2026-07-25):**

| Activity | Amount | Notes |
|----------|--------|-------|
| **Robbery** | | |
| — Stickup (pedestrian at gunpoint) | $45–90 | Base income, always available |
| — Store robbery (glowing stores) | $150–260 | 90s cooldown, high heat |
| — Pizza heist (crack safe) | $250–500 + $150 escape | One-time per chapter, high-reward encounter |
| **Missions** | $140–200+ | Base $140 + distance/3; every 5th mission bonus $500 |
| **Deliveries** | $55 + time bonus | Pizza-jack delivery reward |
| **Passive** | | |
| — Heat loss (cool down after escape) | $G.stars×60 | Encourages heat-cooldown play (stars 1–6 = $60–360) |
| — Helicopter air time | $airT×110 | Bonus for time spent flying (~$110–500+ per flight) |
| — Chopper shot down | $150 | One-off reward |
| — Mama rat killed | $150 | One-off reward |
| **Pickups** | $15–25 | Random money on street (minimal) |
| **Chapter milestones** | $500 | Every 5 missions |
| **Debt** | $800 | Target to pay Deb; once paid, game continues |

#### P3 — Wanted-system feel + difficulty options `P2 · Risk: Med` `DONE`
**Status: done** — see `§19`. The escalation curve, HUD hints ("THEY SEE
YOU"/"CLEAR"/"HIDDEN"), and star thresholds already read clearly pre-existing
this card, so the actual gap was the missing **Difficulty** setting; that's
what shipped. (A concurrent reconciliation pass on `main` had marked this
`OPEN` — it predates §19 landing.)
**Why:** Heat/stars escalation and cop pressure drive the fun; expose it and
tune it.
**Where:** `WANTED` (`addHeat`, `clearHeat`, `updateWanted`, `spawnCop`,
`wantedCount`), `updateCops`, `updateFootCops`, `damagePlayer`, Settings (F2).
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

#### U2 — Onboarding / How-to-Play `P2 · Risk: Low` `DONE`
**Status: implemented & verified** (Kimi K3). `#controlsCard` overlay in the new
`CONTROLS CARD (U2 onboarding)` section: TOUCH/DESKTOP tabs (default follows
`IS_TOUCH`), THE JOB footer, GOT IT on first boot / CLOSE from the pause menu.
Auto-shows once in `dismissStoryCard()` and in `restoreSave()` for pre-flag
saves; `G.controlsCardSeen` persists in the save blob. The old `pmHow` pause
panel was replaced — HOW TO PLAY now opens this card over the pause menu.
Suite: `tests/cases/controls-card.test.js` 5/5 green; save-restore and boot
suites green alongside.
**Why:** Controls are only a one-line hint; a short first-run guide lowers the
bounce rate.
**Where:** start flow, `controlsHint`, pause menu (F2) "How to Play".
**Approach:** A skippable, first-run **controls card** (touch + desktop),
reachable again from the pause menu. Don't gate the fun behind a tutorial —
keep it a glanceable card, remembered as "seen" via the save (F1).
**Acceptance:** First launch shows the card once; it's re-openable from pause;
skipping works; "seen" persists so it doesn't nag.

**Onboarding Design (for U2 implementation):**

**Controls Card Spec:**

*Presentation:* A centered modal overlay (like `#bigEvent` or pause menu) that slides in on first boot, after the animated intro clears but before gameplay. Tap/click anywhere or click "GOT IT" to dismiss. Clicking "HOW TO PLAY" in pause menu recalls it anytime (with a close button instead of "GOT IT").

*Content Structure:*
```
CONTROLS
═══════════════════════════════════════════════════════════════

[TAB: TOUCH]  [TAB: DESKTOP]  ← Tab buttons, one per input method

TOUCH TAB:
📱 MOVE: Left thumb stick
👁 LOOK: Swipe right side
⚡ GAS/BRAKE: Bottom pedals
🔥 BOOST/DRIFT: Pedal buttons
🎯 SHOOT/PUNCH: Action buttons
[Fine print: Rotate phone to landscape for best play]

DESKTOP TAB:
⌨️ MOVE: W A S D
👁 LOOK: Drag right mouse button
⚡ GAS/BRAKE: W / S
🔥 BOOST: Shift  |  DRIFT: Space
🎯 PUNCH: F  |  SHOOT: G
[Fine print: No keyboard config yet—these are hardcoded]

═══════════════════════════════════════════════════════════════
THE JOB: Deb wants $800 by tonight. Rob stores. Run missions.
Avoid the cops. Use [HOW TO PLAY] anytime to re-read this.
═══════════════════════════════════════════════════════════════

[GOT IT]  (or [CLOSE] if called from pause menu)
```

*Implementation Notes:*
- Style: match the existing `#bigEvent` / `#pauseMenu` look (dark overlay, bold fonts, neon accents)
- Tab switching: simple CSS-based toggle (show/hide tab content on click)
- Storage: add `G.controlsCardSeen` to the save blob (F1), default false. On boot, if false, show card auto. "GOT IT" sets it true and saves.
- Reachability: wire a "HOW TO PLAY" button into the pause menu (F2) that recalls the card. Must work whether seen before or not.
- Responsive: ensure font sizes and layout work at 800×390 landscape (phone minimum).

*Acceptance for U2:*
- First launch shows card auto, dismissing lands you in gameplay without losing progress
- Pause menu has "HOW TO PLAY" button that re-opens the card
- Card is skippable (doesn't nag on revisit)
- "Seen" flag persists after reload (once F1 is confirmed working)
- All button/tab interactions are smooth and responsive at mobile touch speed

#### U3 — Death / busted / respawn flow `P2 · Risk: Med` `DONE`
**Status: implemented & verified** (Codex). BUSTED fines and WASTED hospital
bills now persist immediately before the `G.over` respawn lock; both clear all
pursuit timers. The existing downtown recovery returns Turbo terrain-seated,
healthy, on foot, with a nearby sedan. `tests/cases/respawn-flow.test.js` is
green (2/2).
**Why:** `busted`/`wasted` should feel fair — clear consequence, quick recovery,
progress kept.
**Where:** `BUSTED / WASTED` (`busted`, `wasted`, `respawn`, `bigEvent`).
**Approach:** Clarify the consequence (e.g. small cash/heat penalty), keep saved
progress (F1) intact, respawn cleanly at a sensible spot without stranding the
player or leaving orphaned entities. Make the `bigEvent` screens readable and
quick to dismiss.
**Acceptance:** Getting busted/wasted never loses saved progress, always respawns
you playable (not inside a wall, not carless with no options), and reads clearly.

#### A2 — Accessibility options `P3 · Risk: Low` `DEFERRED — LOWEST PRIORITY`
**Owner direction (2026-07-25):** this is a personal game, so accessibility
work is not worth prioritising right now. Keep the spec for possible future
use, but do not select A2 through the `NEXT` workflow while any other approved
backlog item remains open. The already-shipped Reduce Motion setting stays;
no accessibility work needs to be removed.
**Why:** Small settings widen the audience and reduce motion sickness.
**Where:** Settings (F2), `CAMERA`, `updateStarsHUD`/minimap colours.
**Approach:** Add **Reduce Motion** (caps shake/hitstop/FOV kick — J2/J3 respect
it), a **larger-text / high-contrast HUD** toggle, and colour-blind-friendlier
marker shapes/colours on the minimap. All persisted (F1).
**Acceptance:** Each toggle has a real, visible effect and persists; reduce-motion
noticeably calms the camera; HUD text scales without breaking layout.

**Accessibility Options Spec (for A2 implementation):**

Three toggles in Settings panel (F2), each with visual on/off indicator:

| Setting | Type | Effect | Code Hook |
|---------|------|--------|-----------|
| **Reduce Motion** | Toggle | Caps camera shake, disables hitstop on impact, disables FOV kick | `SETTINGS.reduceMotion` → respected in `shake()`, J2/J3 code paths |
| **High Contrast HUD** | Toggle | HUD text +20% size, darker backgrounds, stronger borders; keeps layout stable | `SETTINGS.highContrast` → CSS class on `#hud` + font-size override |
| **Colorblind Mode** | Dropdown: OFF / Deuteranopia / Protanopia / Tritanopia | Minimap marker colors shift to accessible palettes (per mode); star/heat HUD text bolded | `SETTINGS.colorblindMode` → CSS class on `#minimap` + marker remap |

**Settings Panel Integration:**
- Add three rows in the existing Settings pane (`#pmSettings` in pause menu)
- **Reduce Motion**: checkbox toggle (already familiar pattern from F2)
- **High Contrast**: checkbox toggle
- **Colorblind**: dropdown (OFF / Deuteranopia / Protanopia / Tritanopia)
- All stored in `SETTINGS` blob via `saveSettings()` (already in F2)

**Implementation Checklist:**

*Canvas/3D (in `CAMERA`/`loop`):*
- [ ] `if(SETTINGS.reduceMotion) { shake() returns immediately; hitstop skipped; FOV kick clamped to 0; }`
- Line references: `shake()` around line 6500, hitstop in `carPhysics` (~5200), FOV kick in `updateCamera` (~6480)

*DOM/CSS (HUD):*
- [ ] Add `.gtb-high-contrast` class rules for `#money`, `#debt`, `#stars`, `#heatHint`, `#mission`
  - Font-size: +20% (e.g., `1.2em`)
  - Background: darker (e.g., `rgba(0,0,0,0.8)`)
  - Border: thicker (e.g., `2px` solid) and brighter
- [ ] Add `.gtb-colorblind-deut` / `-prot` / `-trit` classes for minimap marker colors

*Minimap Colors (per mode):*
- **Normal**: Blue cops, red gang, green mission, yellow Deb, cyan helis
- **Deuteranopia** (red-green weakness): Blue cops, purple gang, yellow mission, orange Deb, cyan helis
- **Protanopia** (red-green weakness variant): Blue cops, teal gang, white mission, orange Deb, magenta helis
- **Tritanopia** (blue-yellow weakness): Red cops, green gang, magenta mission, pink Deb, cyan helis

*Acceptance for A2:*
- [ ] Toggling reduce-motion visibly stops screen shake + hitstop in gameplay
- [ ] High-contrast mode renders HUD larger + darker; layout doesn't break at 800×390
- [ ] Colorblind mode changes minimap markers correctly; all three variants tested
- [ ] All three settings persist after reload (test with F1 save system)
- [ ] No console errors; performance unchanged

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

#### R2 — Pool traffic / peds instead of churning them `P2 · Risk: Med` `DONE`
**Why:** Cars and peds are spliced and re-`spawn`ed via timeouts, creating and
GC-ing meshes constantly. Pooling smooths frame times.
**Where:** `spawnTraffic`, `spawnPed`, `damageCar` respawn, `updateTraffic`/
`updatePeds` cleanup.
**Approach:** Maintain a small free-list of hidden car/ped objects; recycle on
despawn instead of destroy+recreate. Follow the particle pool philosophy.
Coordinate with F3's population caps and R1's disposal (pooled objects aren't
disposed until teardown).
**Delivered:** Bounded active-only free-lists recycle generic civilian traffic
and pedestrians. Reuse resets terrain placement, physics/AI/animation state,
and ped dog/bubble/partner links; a downed owner's dog remains an orphaned
stray. F3 trimming pools eligible entities, while mission targets and cinema
actors are permanently retired. Focused coverage: `traffic-pooling.test.js`.

#### R3 — Anti-stuck & spawn-safety `P2 · Risk: Med` `DONE`
**Why:** Analytic collision can occasionally wedge the player in geometry or
spawn NPCs inside buildings.
**Where:** `resolveFootCollision`, `respawn`, `spawnPed`/`spawnTraffic`,
`randomRoadPoint`.
**Approach:** Validate spawn points against `buildingHit`/`overWater` and retry
(bounded) if invalid. Add a gentle un-stick nudge if the player is inside a
collider for more than a moment. Keep it cheap.
**Delivered:** Bounded seeded generic placement rejects water, buildings,
ramps, trees, and solid props for road traffic, sidewalk peds, and downtown
respawns. Turbo gets one terrain-seated recovery only after persistent
static overlap; roofs, stairs, ladders, bailouts, and cinema/cutscenes bypass
it. Focused coverage: `spawn-safety.test.js`.

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
jacket" look once `CHARACTERS.md`'s paint system (C3) lands; tying jock density
to the football field once **FB2** exists instead of pure random blocks. (The
knockdown/defeat state was added in the 2026-07-25 bug-fix pass — jocks are now
killable by fists, gunfire, car hits, and explosions.)

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

#### FB3 — "Revenge on Coach" mission `P1 · Risk: Med` `DONE — Claude Code | Opus 5 | high (2026-08-02)`
**Status: implemented & verified.** Built as `index.html` §COACH REMATCH (FB3),
between §FOOTBALL RIVALS and §STRAY DOGS. Old Scores opens by walking to
Wildcats Field and is bounded both ways — three staged Alumni Wildcats through
the existing `spawnJock`, and it lets go on its own if Turbo drives off, then
re-opens when he walks back. Clearing it plays `coach_rematch_intro` straight
into a fists-only Rematch against a single named 240-HP Coach who barks
`coach_taunt` at HP thresholds. He **yields** — upright, winded, no `knockPed`
ragdoll — into `coach_defeat`, which sets and saves `G.coachBeaten`; ambient
jocks then go non-hostile and switch to the `jock_post_rematch` pack. A Turbo
loss is a soft retry at the field: no BUSTED/WASTED, no fine, Coach resets and
the round restarts. Nothing in the strand calls `addHeat`.
**FB4 was not built** — it still needs the owner's go-ahead; see its card.
**Focused test:** `tests/cases/fb3-coach.test.js` (10/10).

**Why:** The dramatic payoff of the backstory — Turbo settles the score with
the man who ended his football career.
**Canonical spec:** use `FOOTBALL_STRAND.md` §§3–6 for the detailed Old
Scores → Rematch flow, dialogue, soft retry, and cutscenes. The shorter
`STORY_BIBLE.md` worked example predates that expansion; keep it as background,
not as the implementation contract where the two differ.
**Where:** a new mission, built like the existing heist system
(`spawnGuards`/`updateGuards`/`checkHeistTriggers` is the closest existing
model for a "triggered, staged encounter with a named NPC") rather than the
random `startMission()` pool — this is a **story/side mission**, one-shot, not
part of the repeating rotation.
**Approach:** Reaching **FB2**'s field starts a bounded warm-up against existing
jocks, then `coach_rematch_intro` leads into a fists-only fight against a named
Coach NPC. Coach yields rather than dies; a Turbo loss soft-retries at the
field instead of using WASTED/BUSTED. On winning, play `coach_defeat`, set and
save the existing `G.coachBeaten` flag, and make ambient jocks non-hostile.
That flag unlocks **FB4**.
**Acceptance:** the mission triggers once, plays a real cutscene, resolves to
a clear win state, sets the unlock flag, persists across reload (once `F1`
exists), and doesn't re-trigger after being beaten.

#### FB4 — Football minigame `P2 · Risk: High` `DONE — Claude Code | Opus 5 | high (2026-08-02)`
**Status: implemented & verified.** The owner gave the go-ahead on 2026-08-02;
built to `FOOTBALL_STRAND.md` §5's locked Endless Run design as
`index.html` §TURBO BOWL (FB4). A PLAY BALL beacon appears at midfield once
`G.coachBeaten` is set and nowhere else; walking into it kicks off. Turbo takes
the ball on his own goal line and runs the field's 34u (scored as 100 yards)
while Alumni Wildcats converge with the same close-the-distance shape as the cop
chase, minus the lethality. Touching one is a **soft fail** — no WASTED, no
fine, no health loss, no heat — and the beacon is immediately back for a retry.
Reaching the far end zone scores. Yardage banks a best either way, persisted in
the save blob alongside a run count that adds a defender per touchdown (3→6).
Defenders and the sideline cast are in their own arrays, never `jocks`, so the
hostile faction can't reach them. No new input, no new verb, no new asset
pipeline — `updateFoot` is untouched.
**Payoff:** `turbo_bowl_payoff` fires on the **first** win only; later wins get a
toast and a bark. That cutscene is also **FB5** — see its card.
**Focused test:** `tests/cases/turbo-bowl.test.js` (8/8).

<details><summary>original card</summary>

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
</details>

#### FB5 — Cheerleaders cutscene (solo Turbo, no Dad on-screen) `P2 · Risk: Med` `DONE — Claude Code | Opus 5 | high (2026-08-02)`
**Status: implemented & verified**, as the `turbo_bowl_payoff` entry in
`CUTSCENES`, fired by FB4's first touchdown. Built to **this card**, not to
`FOOTBALL_STRAND.md` §6's version of the same scene — the two scripts
contradict each other and the owner's call (2026-08-02) was this one. Beats:
Turbo spikes the ball; the squad jogs over and Amber gets the strand's one named
line; Turbo starts his usual line, **stops himself**, and cites his father
unprompted; the squad leaves of its own accord; he's alone on the field, pleased
with himself. **No Dad actor exists anywhere in the code** — a test asserts no
shot has `DAD` as its speaker, so a future session can't quietly add one.
It plays once (`G.turboBowlWon`, persisted); replays get a toast and a bark.

<details><summary>original card</summary>

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
</details>

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
**Approach:** Design a readable low-poly rat that holds up both tiny (swarm,
~0.3u) and huge (mama rat, 3×Turbo). She needs visible ears, eyes, an opening
mouth/jaw, four feet, proper body/leg/tail proportions instead of a uniformly
scaled sphere-and-cylinder blob, an idle/walk cycle, and a distinct lunge/bite
animation instead of the current slide/bob and stationary flash. Her face and
body must point toward Turbo while she follows him; calibrate the mesh's forward
axis once, then drive yaw from the horizontal Mama→Turbo direction without
pitching her into the terrain. Turn smoothly enough to read as a pursuing
animal, but quickly enough that she never walks backward or sideways at Turbo.
If it is a real rig (not a fixed mesh), reuse the `mesh.userData`
joint-exposure pattern from `js/person.js` so `updateMamaRat` can drive feet,
jaw, head, and tail the way `updateFoot`/`updateFootCops` drive exposed joints.
**Acceptance:** swarm rats and mama rat both use the new model; mama rat
still measures out to 3× `turboHeight()`; from every approach direction her
eyes/mouth face Turbo and her feet animate in the direction of travel; idle,
walk, turn, lunge, bite, damage, and death remain visually coherent; no
regression in
`tests/cases/rat-vengeance.test.js` or the rest of the suite; holds framerate
with a swarm on screen (the pool is 16 rats, cheap instancing/geometry
matters more there than for the single mama rat).

#### RV3 — Follow-on polish (not yet scoped) `P3 · Risk: Low`
**Why:** RV1 is a minimum-viable vengeance loop. Once RV2's model lands there's
room to make her a proper set-piece encounter instead of a slow blob that
either bites you or doesn't.
**Ideas, unscoped, pick up only after RV1/RV2 are solid:** building/prop
avoidance so she can't be trivially juked through a wall; ~~a growl/screech
`sfx` cue and dedicated voice/bark line instead of reused `sfx.punch()`/
`sfx.bigCrash()`~~ **DONE (Claude Code, Sonnet 5, 2026-07-24)** — `sfx.ratScreech`
(emergence), `sfx.ratBite` (contact), `sfx.ratDeath` (kill), owner live-approved
during a weapon-sound-synthesis session; still no dedicated *voice/bark line*
(that's the VOICEOVER SYSTEM, separate scope); car interaction (run her over,
or she flips/damages a car that gets too close); heat/wanted interaction (does
summoning her raise `G.heat`, the way shooting a ped already does via
`addHeat(18)` in the `'ped'` branch — right now `'rat'` doesn't call `addHeat`
at all beyond the flat `addHeat(4)` every pistol shot already applies); a cap
or cooldown if repeat testing shows player-summoned mama rats becoming a
farmable money loop (`$150` "RAT SLAYER" payout on kill has no gate today).
Ask Austin before committing to any of the remaining ideas — they're still
unapproved scope.

---

### Phase 9 — Owner-directed immediate gameplay pass `approved`

These four tasks supersede FB3 in the immediate `NEXT` sequence. Build them as
four focused commits in order; they share `index.html`, so one agent should
carry the sequence rather than several agents editing the hot file in parallel.

#### OD1 — Straight-flight RPGs `P0 · Risk: Low` `DONE — Codex | GPT-5 | high (2026-07-25)`
**Owner direction:** RPG rounds must fly in a straight line.
**Where:** `doAttack()`'s RPG branch and `updateRockets()`.
**Approach:** Freeze one normalized 3D direction vector at launch from Turbo's
heading plus camera pitch, then move the rocket at constant speed along that
vector. Remove gravity/drop and do not home or re-read aim after launch. Align
the mesh to the frozen trajectory. Preserve lifetime, smoke, flight audio,
heat, explosions, car/heli damage, and cleanup. Use terrain-aware ground impact
(`groundH`) and bounded swept/substep collision so a fast rocket cannot tunnel
through a building or car during a long frame.
**Acceptance:** horizontal, upward, and downward shots follow a constant line;
turning/aiming after firing does not bend them; impacts still resolve once and
clean up mesh/audio; seeded runs stay deterministic.
**Focused test:** `tests/cases/rpg-flight.test.js`.

#### OD2 — Speech-bubble building occlusion `P0 · Risk: Low` `DONE — Codex | GPT-5 | high (2026-07-25)`
**Owner direction:** speech bubbles must not appear through buildings.
**Where:** `positionBubble()`, `positionChatBubbles()`, and Deb's bubble
projection in `updateStory()`.
**Approach:** add one allocation-light world-to-bubble placement helper shared
by all three paths. In addition to clip-space/range checks, test the segment
from `camera.position` to the speaker's head against the existing building
AABBs including `baseY`/roof height. Hide an occluded bubble without cancelling
its remaining lifetime, so it can reappear if the camera clears the corner.
Do not use `buildingHit()` alone: its 2D footprint would incorrectly hide a
rooftop speaker when the sightline passes above the roof.
**Acceptance:** generic TALK/yell bubbles, ambient chat bubbles, jock bubbles,
and Deb bubbles all hide behind a building, reappear during their remaining
time when visible again, and still hide off-screen/expired/far away. No
per-frame DOM creation or raycaster allocation.
**Focused test:** `tests/cases/bubble-occlusion.test.js`.

#### OD3 — Turbo sprint control and animation `P0 · Risk: Med` `DONE — Codex | GPT-5 | high (2026-07-25)`
**Owner direction:** add a sprint button and sprint animation for Turbo.
**Where:** touch HUD/buttons, input polling, controls card/hints,
`refreshButtons()`, and `updateFoot()`. Keep `js/person.js` backward-compatible;
the required joints are already exposed.
**Approach:** add explicit `input.sprint`. On desktop, Shift means sprint only
on foot and keeps its existing boost/up meaning in vehicles. On touch, put a
hold-style **SPRINT** button beside JUMP (remove JUMP's two-column span) so the
existing four-row action cluster does not grow taller. Sprint activates only
while moving strongly on foot and not crouching, climbing, bailing, stunned,
or in an attack. It needs no stamina system or new HUD bar. Target roughly
12u/s versus the current 8.2u/s full-stick run.

Give sprint a distinct cycle: faster cadence, longer leg drive/knee bend,
strong opposite arm pump, forward torso lean, and slightly reduced vertical
bob. Sprint locomotion wins over the ranged aiming pose; attacking cancels
sprint for that attack. Preserve stairs, slopes, roofs, jumping, collision,
anti-stuck recovery, and ordinary walk/run animation.
**Acceptance:** holding the touch button or Shift makes Turbo materially faster
and visibly sprint; releasing returns immediately to the normal run; no stuck
input after touch cancel, mode change, pause, or entering a car; the 800×390
touch layout does not overlap.
**Focused test:** `tests/cases/sprint.test.js`.

#### OD4 — Denser traffic and street life `P0 · Risk: Med` `DONE — Codex | GPT-5 | high (2026-07-25)`
**Owner direction:** the streets feel empty; add more cars and life.
**Where:** generic traffic/ped boot spawns, R2 pools, F3 quality tiers,
`spawnTraffic()`/`spawnPed()`, and the main-loop population maintenance path.
**Approach:** raising global caps alone is insufficient because entities spread
across the whole city. Increase the quality-tier targets, then add a throttled
local population maintainer that reuses the R2 pools to keep generic traffic
and pedestrians near Turbo as he moves.

Starting targets (tune down only if the focused busy-scene check proves they
are too expensive):

| Tier | Moving traffic | Generic pedestrians |
|------|----------------|---------------------|
| Low | 12 | 24 |
| Medium | 22 | 44 |
| High / Auto start | 30 | 60 |

Run maintenance about once per second, adding at most 2 cars and 4 peds per
tick. Prefer clear road intersections/sidewalk blocks in a roughly 55–140u
annulus around the player, ideally just off-screen. If the active arrays are
at cap but the nearby streets are sparse, retire only far-away, off-screen
generic civilians (roughly 180u+) and recycle them nearby. Never recycle the
player's vehicle, parked/special/mission/cinema cars, cops, downed peds, Deb,
jocks, dogs, named/story actors, or mission targets. Preserve R2 active-only
arrays, spawn-safety validation, deterministic `_rng`, and F3 downshift
trimming. Grow the pool caps to the high-tier maxima and let tier changes refill
gradually rather than in one hitch.
**Acceptance:** after settling near ordinary downtown roads, High has visibly
more moving cars and pedestrians near Turbo than the current build; travelling
several blocks repopulates the new area without visible pop-in; counts remain
bounded by the active tier; Auto can still downshift; no meaningful busy-scene
fps regression or unbounded mesh/DOM growth.
**Focused test:** `tests/cases/street-density.test.js`.

#### OP1 — Owner playtest polish `P0 · Risk: Med–High` `DONE`
**Owner direction:** stabilize the current free-roam experience before adding
FB3. Fix sprint after vehicle exit; make aim-camera transitions smooth; make
dogs mortal and release a translucent, non-damaging 30-second ghost on death;
route the intro camera gracefully around buildings; keep the Deb cutscene above
terrain; hide empty wanted stars and render only the earned count as smaller
translucent pink stars; make random missions opt-in through a temporary centered
START MISSION button; and reflow the phone HUD around Dynamic Island/cutout safe
areas.
**Plan:** deliver five sequential commits because each touches `index.html`:
controls/aim camera, dog mortality/ghosts, cinematic camera safety, then
mission/HUD/mobile layout, followed by smooth melee camera plus one-second hold
specials: a three-spin planted kick and a quicker three-round opposing-arm
windmill punch that hits only front/rear targets. The implementation contract,
exact code paths, guardrails, acceptance criteria, and focused tests are in
`CODEX/HANDOFF_TERRA_OWNER_POLISH.md`.
**Acceptance:** all eleven owner-reported issues are reproducible before their
fix and covered afterward; no random mission begins without an explicit tap;
phone HUD elements clear simulated landscape and auto-rotated cutouts; existing
mission progression, dog-pack behavior, terrain, VO, and zero-build startup
remain intact.
**Delivered 2026-07-25:** commits `bee4f7a`, `3c89352`, and `a2ad228` add the
dog/ghost death path, elevated shared intro routing plus terrain-safe Deb shots,
and opt-in mission/HUD behavior. Focused syntax, dog-ghost, charged melee,
intro camera, and mission/HUD checks passed. Signed: Codex | GPT-5 | high

### Phase 10 — Codex audit follow-up `OPTIONAL · OWNER-TRIGGERED`

**Authored by:** Codex | GPT-5 | high (2026-07-25), from a three-part audit of
Git history, runtime/tests, and assets/docs/security.

**Activation phrase:** the owner must explicitly say **"run the Codex audit
follow-up"** (or name one of AF1–AF4). This project is not the authoritative
`NEXT` task, does not replace **FB3**, and must not be started merely because an
agent notices it in the backlog.

**Audit baseline:** no valuable implementation was found missing from `main`;
no tracked asset was confirmed junk; all literal runtime asset paths resolved.
Preserve all voice/audio, art, `three.min.js`, `viewer.html`, terrain/spawn
safety, pooling exclusions, respawn save flushes, and Cinema replay restoration
unless the owner separately changes scope.

#### AF1 — Cinema staged-actor lifecycle `P2 · Risk: Med` `OPTIONAL`

**Finding:** `cinemaClearStaged()` removes staged jock/ped meshes without the
same disposal discipline used for staged cars, including attached dog meshes.
`stageShootPed()` also leaves a delayed callback able to act on a pedestrian
after a different Cinema scene has cleared it.

**Approach:** give delayed Cinema actions a scene-generation token or explicit
cancellation guard, and retire/dispose every staged actor exactly once without
touching pooled or live-world entities. Preserve replay restoration and current
mission/Cinema exclusions.

**Acceptance:** rapidly select **Shoot Pedestrian**, switch scenes within one
second, and repeat staging at least ten times: no orphaned hit/effect fires, no
removed actor is mutated, and staged meshes/dogs are disposed once. Add focused
regression coverage, then run the Cinema-focused tests plus syntax once.

#### AF2 — Save-field normalization `P2 · Risk: Low` `OPTIONAL`

**Finding:** a version-valid but malformed local save can restore `G.station`
outside the `STATIONS` range.

**Approach:** normalize restored enum/index values at the load boundary while
preserving every valid existing save and the current corrupt/absent-save
fallback. Audit only adjacent bounded fields needed to implement this safely;
do not redesign the save schema.

**Acceptance:** valid saves round-trip unchanged; negative, oversized,
non-numeric, and missing station values fall back to a valid station without a
boot or radio error. Extend `save-restore.test.js` with focused cases.

#### AF3 — Documentation truth pass `P3 · Risk: Low` `OPTIONAL`

**Scope:** documentation only. Reconcile it with the shipped code:

- Correct `README.md` and `GAME_PLAN.md`: 39/47 story clips and 2/12 cutscene
  clips are wired; eight football story clips, ten cutscene clips, all 13
  backstory-intro clips, promo, and raw auditions remain staged/unwired.
- Replace the unsupported dependable-offline claim: the project has installable
  manifest metadata but no service worker/cache implementation.
- Correct the old root `panel1-3.jpg` path to `art/legacy/panel1-3.jpg`.
- Refresh `tests/README.md` so its inventory does not imply only seven case
  files exist; describe `op1-touch-smoke` as viewport smoke, not real touch
  dispatch.
- Rename the obsolete Mama Rat `PLACEHOLDER` section label without changing
  the still-placeholder creature-art status.
- Record Three.js r128 vendoring provenance and a checksum without replacing or
  upgrading the runtime.

**Acceptance:** claims and counts match code/assets at the commit being edited;
links resolve with exact case; no gameplay file changes except a comment/banner
rename if included.

#### AF4 — Provenance and junk cleanup `P3 · Risk: Low` `OPTIONAL · ASK FIRST`

**Guardrail:** this is destructive/organizational work. Obtain a fresh,
item-specific owner approval before deleting or moving anything. Do not combine
it with AF1–AF3.

**Candidates after a fresh remote/PR check:** archive completed
`CODEX/HANDOFF_*` records; optionally remove ignored/reproducible local
`tests/node_modules/`; and consider retiring branches whose implementation is
already on `main` (`codex/audit-fixes-1-3-5`,
`codex/consolidate-od1-od4-20260725`,
`codex/terra-owner-polish-handoff`, `terra/owner-playtest-polish`, and remote
`terra/owner-playtest-polish`). Preserve desired PR #40 granular provenance
before removing its last ref.

**Do not delete as junk:** staged football/backstory/cutscene VO, promo/raw
voice source material, `art/legacy/panel1-3.jpg`, `CLAUDE.md`, `GEMINI.md`,
`CODEX/README.md`, or working source-order wrappers in `index.html`. The
wrappers are architectural risk, not dead code; replacing them is a separate
high-risk refactor.

**Acceptance:** every removed item has written evidence that it is duplicated,
superseded, reproducible, or owner-abandoned; recovery/provenance is preserved;
runtime behavior and the authoritative `NEXT` marker are unchanged.

### Phase 11 — Owner playtest correction pass 2 `OP2 · OWNER-TRIGGERED`

**Source:** owner playtest notes, 2026-07-26. These are approved requirements
but are not automatically the authoritative `NEXT` task. Start the full pass
only when the owner says **"run OP2"**, or start one named card when the owner
names it. Do not silently fold these changes into FB3 or unrelated work.

**Coordination:** nearly every card touches the hot `index.html`. One agent
should claim and deliver OP2-A through OP2-G sequentially, one focused commit
per card. RV2 may run separately only if its agent stays inside the rat
model/update section. Preserve deterministic `_rng`, `groundH`, pool
exclusions, save compatibility, phone safe areas, and zero-build deployment.
Reproduce each reported defect before changing it; a vague visual complaint is
not permission for a broad rewrite.

**Four-agent launch packet:** when the owner requests the concurrent first
batch, dispatch the tracked briefs in `CODEX/OP2_CONCURRENT/README.md`. They
pin each agent's model, effort, base commit, branch, code ownership, tests, and
integration order. Agents work on isolated branches/worktrees and never merge
`main` themselves.

#### OP2-A — Road and sidewalk visual integrity `P1 · Risk: Med` `DONE`

**Owner report:** manhole covers and center-road stripes look like
trash-quality zoomed-in assets; some sidewalks do not follow terrain and hang
in the air.

**Where:** road/marking/manhole construction, sidewalk geometry, and the
`groundH` terrain contract. Read `TERRAIN.md` before editing any terrain-seated
mesh.

**Approach:** make road markings world-scale geometry/materials with consistent
lane width, dash length, spacing, edge softness, and orientation instead of
stretched or camera-scale-looking marks. Rebuild manhole covers at believable
street scale with a clean circular rim, inset lid, restrained surface pattern,
and no oversized/blurry texture treatment. Seat every sidewalk vertex/segment
from `groundH` at its own world position rather than sampling one height for a
long slab. Preserve the present non-colliding sidewalk behavior; this card is a
visual terrain-conformance fix, not permission to add curb collision.

**Acceptance:** at walking and driving camera distances, stripes and covers
look correctly scaled and stable; no sidewalk edge visibly floats above or
dives under slopes/knolls; road and sidewalk seams remain closed; Turbo, cars,
NPCs, and spawns behave exactly as before. Add a seeded terrain/geometry check
and manually inspect representative flat, graded, and knoll-adjacent streets.

#### OP2-B — Civilian vehicle sanity, jackability, and impact damage
`P0 · Risk: High` `DONE`

**Owner report:** traffic often drives erratically; many cars cannot be
carjacked, especially after clipping into buildings; being hit by a fast car
does not reliably hurt Turbo.

**Where:** generic traffic steering/lane following, spawn/anti-stuck,
building/vehicle collision, generic-car pooling, `doEnterExit()` wrappers,
carjack eligibility, and car→Turbo collision.

**Approach:** diagnose before tuning. Keep ordinary traffic lane-aligned with
bounded steering, speed, avoidance, and recovery; do not fix craziness by
making all cars slow or sparse. Prevent/recover generic cars embedded in
building AABBs, and retire/recycle an unrecoverable generic car without
touching player, police, mission, parked-special, or Cinema cars. Make every
ordinary reachable civilian car explicitly jackable; special non-jackable
classes must be deliberate and documented, not an accidental consequence of a
bad state or clipping.

Car impacts use relative horizontal speed and one short per-car/per-player
cooldown. Low-speed nudges do little or nothing; a meaningful hit damages and
knocks Turbo consistently; very fast impacts may be lethal through the normal
WASTED path. Do not allow one overlapping car to damage him every frame.

**Acceptance:** seeded traffic drives several blocks without chronic weaving,
spinning, building embeds, or mass pileups; every sampled ordinary civilian
car can be stolen from a valid approach; an embedded-car recovery test leaves
no stranded unjackable car; impact damage is monotonic with relative speed and
fires once per contact window. Preserve wanted logic, pooling bounds,
determinism, car audio, missions, and the existing large STEAL CAR button.

#### OP2-C — Reliable melee and the planted horizontal kick pose
`P0 · Risk: Med–High` `DONE`

**Owner report:** punch and kick stop working after extended play, and Turbo's
kick drives his body into the ground instead of showing the intended pose.

**Approach:** reproduce the lockout across repeated attacks, holds, mode
changes, car enter/exit, pause, hit reactions, respawn, and Cinema transitions.
Fix the owning timer/state/input-reset invariant; do not add a watchdog that
merely hides a stuck attack. Every attack must return to a neutral state even
when interrupted, and its hit window must stay synchronized with its pose.

At the signature kick's peak, pose Turbo like a standing, planted horizontal
figure: one support leg is straight and vertical with its foot planted on
`groundH`; pelvis/torso stay roughly at waist height; torso is straight and
face-down, parallel to the ground; both arms extend straight forward; the
other leg extends straight backward. It should read like he is lying flat on
his stomach in midair while held up by the single vertical leg. Nothing except
the planted foot enters the ground. Blend into and out of this silhouette
without teleporting the root or changing collision height.

**Acceptance:** punch, normal kick, charged windmill punch, and charged planted
kick still work after at least 100 mixed attacks and every listed interruption;
no stuck input/state; the planted foot follows slopes while hips, torso, arms,
and rear leg stay above terrain; hit geometry matches the visible attack.
Extend focused melee tests and perform a side/front screenshot review.

#### OP2-D — Grounded character shadows and better Turbo footsteps
`P1 · Risk: Med` `DONE`

**Owner report:** person blob shadows stay attached to the feet and rotate
vertical when a character falls. Turbo's current footstep sound is poor.

**Where:** `makeShadow`, the person builder's child shadow, player/ped/jock/
foot-cop knockdown poses and lifecycle updates, `updateFoot()` gait phases, and
the SFX bus. This card follows OP2-C so it can use the corrected melee/
knockdown states.

**Shadow approach:** a person shadow must remain a ground-plane projection, not
inherit the character mesh's fall rotation. Give each live person a cheap
ground-anchored shadow update that follows world X/Z and `groundH + 0.03`.
While upright, use the current compact foot/torso ellipse. As knockdown or death
tips the body over, ease over roughly 0.15–0.25 seconds into a longer,
body-shaped horizontal shadow aligned under the fallen torso/legs. Reverse the
transition on recovery. Share geometry/materials, preserve pooling, and dispose
or hide the shadow exactly with its actor; do not introduce real-time shadow
maps.

**Footstep approach:** replace the current footstep with a small Turbo-only
footstep system driven by actual left/right gait-phase crossings, not a
per-frame timer. Provide restrained alternating variants for asphalt/concrete,
grass, sand, roof/interior, plus a separate landing thump. Cadence follows
walk/run/sprint animation; volume, low-end, and pitch respond subtly to speed
and Turbo's scale without becoming cartoony or machine-gun-like. Silence steps
while airborne, stationary, stunned, attacking without foot motion, in
vehicles, paused, replaying, or in cutscenes. Use the existing SFX mix/unlock
path and cap overlap so missed frames cannot emit several steps at once.

**Acceptance:** upright shadows remain flat at the feet; falling characters
visibly transition to a horizontal body shadow; no shadow becomes vertical,
floats, survives pooling/removal, or stays body-shaped after recovery. Turbo
produces one alternating step per planted stride at walk/run/sprint speeds,
surface changes are audible but coherent, landings have weight, and no
airborne/idle spam occurs. Add state/cadence/lifecycle coverage, then perform an
owner listening pass—the final sound quality cannot be approved by assertions
alone.

#### OP2-E — Quieter mission UI and head-anchored speech bubbles
`P1 · Risk: Low–Med` `DONE`

**Owner direction:** mission buttons and notifications should be smaller, more
translucent, and out of the way. The context-sensitive STEAL CAR control is the
only current large action button to preserve. Speech-bubble tails should appear
to come from the speaking NPC's head from the current camera view.

**Approach:** convert mission offers/status notices into compact translucent
edge/corner chips that avoid the reticule, wanted stars, Turbo Mode slot, touch
controls, and phone cutouts. Keep critical text readable and tappable; do not
hide mission state. Preserve the large STEAL CAR control when a valid car is in
range.

For bubbles, project the speaker's head and position each bubble normally, then
place/rotate/clamp its tail along the bubble edge toward that projected head.
Share the calculation for generic speech, chats, jocks, and Deb. Preserve the
existing building occlusion, range, expiry, and no-per-frame-DOM-allocation
rules.

**Acceptance:** mission UI never dominates the center of a desktop or 800×390
phone screen; buttons remain usable; STEAL CAR stays prominent; every visible
bubble tail points back to its speaker's projected head as the camera moves,
including edge-clamped bubbles, and remains hidden when the speaker is
occluded.

#### OP2-F — Planned cinematic camera routes `P0 · Risk: High` `DONE`

**Owner report:** some Cinema scenes still send the camera through terrain.
The intro route avoids more collisions but looks reactive and janky instead of
moving like a movie camera.

**Approach:** replace last-moment collision shoves with a small deterministic
route planner used by the intro and applicable live Cinema shots. Build a few
candidate elevated waypoints around intervening building AABBs, reject segments
that violate building or `groundH` clearance (including interpolated curve
samples), choose a short clear route, and travel it with a smooth spline/eased
speed profile. Smooth look-at targets separately so framing does not snap when
the path bends. Prefer intentional arcs, cranes, and reveals; if no cinematic
route is valid, cut to a known-safe shot rather than scraping along geometry.
Keep Deb shots terrain-safe and preserve replay/free-fly behavior.

**Acceptance:** across representative deterministic seeds and every staged
scene, dense path sampling stays above terrain and outside buildings; speed,
acceleration, and look direction have no abrupt collision-correction spikes;
the intro reads as one planned movie move. Add route-clearance regression
coverage and conduct a full visual review—numeric safety alone is insufficient.

#### OP2-G — Faster car failure, one better explosion, and lethal falls
`P1 · Risk: Med` `DONE`

**Owner direction:** once the player's car reaches its damaged/critical state,
it should explode in roughly half the current time. Remove the redundant
mushroom-cloud layer; keep the better quick explosion, slow that visual
slightly, and increase its damaging blast radius modestly. A fall of about four
Turbo body heights onto solid ground should splat and trigger WASTED.

**Approach:** keep one authoritative vehicle-explosion event and one visual
effect. Halve the critical fuse rather than doubling damage updates, so timing
is deterministic and the explosion cannot fire twice. Remove only the
mushroom-cloud presentation, not cleanup, sound, heat, shake, or damage hooks
shared by the retained effect. Lengthen the retained animation enough to read
without making gameplay wait for it, and define one slightly larger radius
used consistently by damage and tests.

Track real unsupported fall distance from the airborne high point relative to
`groundH`/landing surface and `turboHeight()`. On a solid-ground impact at
roughly `4 × turboHeight()`, play a short splat/impact beat and use the existing
WASTED flow. Ordinary jumps, stairs, moving terrain samples, scripted camera
moves, teleports/recovery, vehicle state, and a successfully deployed parachute
must not create false falls; preserve existing water/bail behavior.

**Acceptance:** the player car's measured critical-to-explosion time is about
half the baseline; exactly one slowed retained explosion renders and damages
inside its documented radius; no mushroom cloud is created. Drops below the
threshold survive as before, drops at/above it onto solid ground reliably
WASTE Turbo once, and parachute/respawn/terrain transitions do not false-fire.

### Phase 12 — Turbo Mode `TM · OWNER-TRIGGERED FEATURE`

**Activation:** start only when the owner says **"build Turbo Mode"** or names
TM1–TM3. This is a feature track, not a bug fix and not part of OP2. Deliver it
after the melee, vehicle, save, HUD, and Cinema systems it extends are stable.
One agent should carry the three commits because they share player state,
rendering, controls, combat, audio, saves, and `index.html`.

**Playtest economy contract:** reaching `$800` reveals the small Turbo button
and offers the choice to invest in Turbo instead of immediately paying Deb.
For the first implementation, active time is unlimited/free so it can be
playtested: define the future rate as `$500 per active minute`, but keep billing
disabled behind one obvious playtest constant. Do not invent a one-time charge,
deduct the `$800`, or alter Deb/debt progression until the owner separately
approves the final economy behavior.

#### TM1 — Unlock, toggle, state, and HUD `P1 · Risk: Med` `OPEN`

Add explicit saved `turboModeUnlocked` state and transient
`turboModeActive` state. At `$800`, show one small translucent **TURBO** button
in the top-right safe area without overlapping wanted stars, notifications, or
phone cutouts. First activation unlocks the mode and plays TM2; later taps
toggle it on/off. Active state defaults off after reload/new game unless the
owner later requests persistence. Centralize `enterTurboMode()` and
`exitTurboMode()` so death, bust, Cinema, vehicle entry, and New Game cannot
leave half-applied modifiers.

**Acceptance:** threshold/button/save behavior is deterministic; toggling never
charges money in the playtest build; every exit path restores normal Turbo
exactly; disabling free play later has one explicit `$500/minute` billing hook.

#### TM2 — Golden transformation and presentation `P1 · Risk: Med` `OPEN`

On every off→on activation, play a short skippable close-up cutscene: frame
Turbo's face safely above terrain, place his sunglasses on, and play the exact
line **"Screw Deb, it's Turbo time."** Then reveal a golden shirt with a clear
star on the back, visible biceps added to both arms, sunglasses, and a
`1.5 ×` larger Turbo. Use reversible appearance layers; do not permanently
scale the shared person rig or leak meshes/materials after repeated toggles.
Frame the transformation through the planned-camera rules from OP2-E if that
work has landed; otherwise use a fixed validated safe shot.

**Acceptance:** ten on/off transformations preserve the original shirt, scale,
rig, weapons, collision/terrain seating, and camera state on exit; the gold
shirt/star, glasses, biceps, and 50% size increase read clearly from front and
back; cutscene skip and interruption clean up safely.

#### TM3 — Powers, combat, and Turbo-only voice `P1 · Risk: High` `OPEN`

While active, Turbo runs and jumps dramatically higher/faster; held pistol and
other guns fire automatically; ammunition never decreases; and punches/kicks
launch affected enemies far into the distance. Scale movement, jump, weapon
cadence, melee reach/impulse, camera framing, and terrain clearance through
central Turbo modifiers—not scattered permanent mutations. Turning the mode
off restores the exact prior ammo, rates, damage, size, camera, and melee
behavior. Do not make enemies/mission targets disappear before their normal
downed/mission-resolution logic records the hit.

Create a separate Turbo Mode voice registry that plays only while active,
including:

- "This shirt was totally worth it."
- "What does child support even mean?"
- "I'm investing in myself."

Use text/subtitles immediately; audio files may be added later through the
existing lazy VO registry. Keep cooldown/deduplication so automatic fire and
rapid hits do not create overlapping bark spam.

**Acceptance:** measurable active-vs-normal tests cover run speed, jump height,
automatic fire, unchanged ammo, scale, and launch impulse; toggling off restores
baseline values exactly; repeated toggles, WASTED/BUSTED, car/heli entry, saves,
missions, and Cinema leave no stale modifier; busy-scene performance remains
bounded.

---

### Phase 13 — Production value `PV · OWNER-DIRECTED`

**Origin:** the owner's 2026-08-07 direction — *"make things more like a real
game, I want production value"* — plus the follow-up punch list given the same
night. Everything below except `PV1` came straight from that list; the owner's
wording is quoted in each card so intent survives the handoff.

These are largely independent of each other and of Phases 10–12. `PV2`, `PV3`,
`PV7`, `PV8` and `PV9` are self-contained and can be picked up in any order.
`PV4`, `PV5` and `PV6` all reshape the world and **must be sequenced together**
by one agent — see the warning on `PV5`.

#### PV1 — Screen-space post FX `P1 · Risk: Med` `DONE (2026-08-07)`

`index.html` §POST FX. Every render now goes through `renderFrame()` into an
offscreen target and comes back graded: threshold+blur bloom (two mips), a
synthwave split-tone grade, soft highlight rolloff, vignette, film grain, faint
scanlines, and radial chromatic aberration that scales with speed. Gameplay
drives it through three one-line impulse calls — `fxFlash()` (explosions),
`fxDamage()` (taking a hit) and `fxImpact()` (lens punch) — plus a sustained
low-health red throb and desaturation. Tiers follow `applyQuality()`; **Settings
→ FILM FX** turns the whole thing off back to the plain render path.

#### PV2 — MP3-only voice, no synthesis `P1 · Risk: Low` `DONE (2026-08-07)`

> *"no more synthesized voice. turbos mp3 voice or bust."*

Kill both synthetic voice paths in §VOICEOVER SYSTEM: `speakLine()` (browser
`SpeechSynthesis`) and `procVoice()` (the sawtooth word-blip fallback), plus the
`speak()` dispatcher that chooses between them. Recorded audio under
`voice/turbo/…` is the only thing that may ever produce a voice.

Call sites today are `index.html:8125` (a bark), `:11069` (the long backstory
narration) and `:11868` (the generic talking-ped line). Each one must become
either a real mp3 from the registry or **text only** — the subtitle/chat bubble
still shows, nothing speaks. Do not silently drop the line's text: a line with
no recording is a caption, not a deletion. `README.md`'s voice table lists which
folders are recorded-but-unwired (`voice/turbo/story/`, `voice/turbo/cutscenes/`)
— prefer wiring a real take over captioning where one exists.

**Acceptance:** `window.speechSynthesis` is never called and no oscillator is
ever routed to `voiceGain` for speech; every previously-spoken line still
appears on screen; the radio duck (`voDuckOn`/`voDuckOff`) stays balanced so
music still dips for mp3 narration and recovers after it.

#### PV3 — No trees in the roadway `P2 · Risk: Low` `DONE (2026-08-07)`

> *"no trees in streets."*

Two independent tree systems place spots and neither is fully road-aware:
`treeSpots` in §STAIRS & FIRE ESCAPES / park dressing (`index.html:~2891–2897`)
and `treeDressSpots` in §MORE CITY BEAUTIFICATION (`:~6214–6227`). Both offset
from a block centre by a half-block plus a fixed margin, which lands in the
carriageway wherever the block is smaller than assumed or the offset overshoots
the kerb.

Add one shared predicate — "is this point on pavement, not asphalt" — - built
from the existing `roadLines`/`ROAD` geometry rather than a new constant, and
reject any spot that fails it. Trees on sidewalks, in parks and on the beach
are all fine; trees between the kerbs are not.

**Acceptance:** a headless sweep over every placed tree asserts none is within
`ROAD/2` of a road centreline; visual check at 800×390 down a long avenue shows
no tree in a driving lane; tree count doesn't collapse (rejecting a spot should
re-roll, not just drop it).

#### PV4 — The beach shelves into the sea `P2 · Risk: Med` `DONE (2026-08-07)`

> *"Make the beach go down into the water on the edge of the map. like real
> life."*

Today the sand meets the water at a hard edge. Grade the last stretch of beach
so it descends continuously below the waterline, and carry that grade into
`groundH` so Turbo wades and sinks instead of walking on a shelf.

**Read `TERRAIN.md`'s Tier 1 revision note before touching `groundH`** — terrain
is a settled contract as of PR #31 and several earlier attempts at local
elevation edits (terraced pads, retaining walls, seam stairs) were tried and
deliberately removed. This card changes the *seaward* margin only; it must not
perturb the road lattice or block patches.

**Acceptance:** walking straight out to sea produces a smooth descent with no
step at the shoreline; the drawn sand and `groundH` agree within the existing
tolerance; `tests/cases/terrain.test.js` still passes unmodified.

*Built note.* One term in `groundH`, gated on `m > SHORE_START` (= `H+14`), so
it is beach only — no road, block or building footprint reaches that far and
the city's grade/no-ledge guardrails are untouched. `terrainGeo()` samples
`groundH` per vertex, so the drawn sand follows it automatically; measured mesh
-vs-field error is **0.0000u across 6061 verts**, which is the exact
disagreement that killed the terraced version.

Two things worth knowing before tuning it:

- `groundH` measures distance from the centre as **`max(|x|,|z|)`**, a square
  metric matching the square city. Probing the shore along a radial ray is
  wrong — the 45° direction never reaches the shelf at all. Walk outward in the
  square metric.
- **Fading the dunes out across the shelf makes the beach face steeper, not
  gentler** (25.7° → 27.9°): dropping a positive dune to zero is one more
  downward slope in series with the shelf. Tried and reverted. The lever that
  works is the *length of the run* — smoothstep's peak gradient is
  `1.5 × drop/run`, so a 5u drop over 40u is ~10°. Final worst face: 14.3°.

The waterline lands ~11u inside `overWater()`'s boundary on purpose, so there is
a shallow strip you wade through before the game calls it swimming. The order
matters and the test asserts it: sand under *before* `overWater()` flips, never
the reverse.

#### PV5 — A city that isn't a square `P3 · Risk: High` `PARTIAL (2026-08-07)` — skyline done, footprint open

> *"Make the city more city shaped and less like a square."*

The city is a uniform `WORLD.blocks²` grid to the map edge, which is what makes
it read as a board rather than a place. Give it a shape: a dense downtown core
with the tall towers, mid-rise around it, low buildings and gaps toward the
edges, and an irregular outer boundary that dissolves into beach/water/lots
instead of stopping square.

**Sequencing warning:** this shares the road lattice with `PV4` and `PV6`, and
the lattice is also what `groundH` and every static's Y are built on. One agent
takes `PV4` → `PV6` → `PV5` in that order, or they will fight.

**Acceptance:** silhouette from a helicopter reads as a skyline with a centre,
not a slab; traffic and pathing still route everywhere they did; no building
intersects a road; frame cost at 800×390 is no worse than before.

*Built note — HALF of this is done.* The **skyline** half landed: height was a
hard step at `r=170` (`rand(24,64)` inside, `rand(10,30)` outside), which from
the air is a square of tall boxes inside a square of short ones. It is now a
smooth exponential falloff from a downtown core whose radius *wanders with
bearing*, so the crest is an irregular ridge rather than a ring. Measured mean
height by band: 0–80 → 80–160 → 160–240 → 240+ decreases monotonically, the
core/edge ratio is >2.5×, and the tallest building per bearing sector varies
>1.6× around a fixed radius band. `skyline.test.js` pins all of that.

**Still open: the FOOTPRINT.** The city still ends on a hard square boundary. It
was left alone deliberately — `groundH` and every static's Y are built on the
road lattice, and thinning or irregularising blocks moves collision, stairs,
ladders and store/heist placement with it. That is the high-risk part of this
card and it still needs the `PV4 → PV6 → PV5` single-agent sequencing above.

#### PV6 — Fix the island ring road `P2 · Risk: Med` `DONE (2026-08-07)` *(paint only — see note)*

> *"Fix the circle road around the island. it conflicts with other roads and
> leads into buildings."*

The curved perimeter road is generated independently of the orthogonal grid, so
it crosses grid roads at unresolved junctions and terminates inside building
footprints. Either give it real intersections with the grid (and clear the
building footprints it passes through), or replace it with a perimeter route
that follows the lattice. Whichever way, no drivable road may dead-end inside
geometry.

**Acceptance:** driving the full ring never enters a building or a dead end;
every crossing with a grid road is a junction traffic can take; AI traffic
routed onto the ring completes a lap.

*Built note — read before reopening this.* The diagnosis was not what the card
assumed. The Coast Highway is **not generated geometry at all**: it is a canvas
arc painted into `groundTex`, with no collision, no junctions and no traffic
routing. It was drawn as a **circle of radius `H+7`** around a **square** city
of half-width `H`, and a circle of that radius only clears the grid at the four
cardinal points — at 15° it is already inside the outer blocks and at 45° it
runs 94u deep into the city. Measured: 27 of 315 points along the old route sat
inside a building footprint.

No circle can fix it. Clearing the corners of a square city needs radius
`H*sqrt(2)` = 478 and the entire world is 358 from centre. It is now a **rounded
rectangle** threading the 14u gap between the outermost kerb (±338) and the sand
(±352): 0 of 1264 sampled points hit a building. `coast-highway.test.js` pins
the geometry, including the arithmetic proving a circle can't fit.

**Still open:** it remains paint. Making it a genuine drivable route — real
junctions with the grid, traffic routed onto it, a lap that AI can complete —
is a separate job and the acceptance criteria above still describe it.

#### PV7 — Real riders on motorcycles `P2 · Risk: Med` `DONE (2026-08-07)`

> *"make the motorcycles have real guys on them. when turbo steals one, turbos
> model should be on the bike."*

`moto` is a `CARTYPES` entry (`index.html:~3691`) that renders as a bare bike
with an invisible driver. Two halves:

1. **Traffic bikes carry a rider.** Build the rider from the shared
   `js/person.js` rig so it inherits the existing materials, shadows and NPC
   variety, seated and leaning with the bike's existing lean logic (`:~8358`).
2. **Turbo rides his own model.** Stealing a bike should keep `player.mesh`
   visible, parented to (or positioned on) the bike, rather than hiding it the
   way a car does. Everything that assumes "in a vehicle ⇒ player mesh hidden"
   needs to tolerate the bike case — check `exitCar`, the camera, aim
   transparency and the person-shadow pass.

**Acceptance:** every spawned `moto` has a visible seated rider; jacking one
throws the rider off and seats Turbo's actual model; exiting returns him to foot
with no duplicated or orphaned mesh; ten jack/exit cycles leak nothing
(`js/person.js` additions stay backward-compatible per `STATUS.md`).

*Built note:* Turbo's rig is **not** reparented to the bike — several systems
write `player.mesh.position` in world space, and handing ownership to a vehicle
group would make those silently wrong. `seatTurboOnBike()` copies the bike's
world seat point and quaternion each frame instead, which gets lean and pitch
for free. `js/person.js` was not modified at all. Watch the shared-rig hazard:
he uses the same rig as the walk cycle, so `dismountBike()` must hand it back
neutral or he walks away crouched over invisible handlebars — `bike-rider.test.js`
asserts exactly that.

#### PV8 — Action-movie bail-out `P2 · Risk: Med` `DONE (2026-08-07)`

> *"When turbo bails out of cars while they're driving he needs to come flying
> out the side and roll on the ground for a bit. like an action movie."*

`exitCar()` (`index.html:~8772`) teleports Turbo 2.2u to the side at any speed.
Above a speed threshold it should instead launch him: lateral + forward velocity
inherited from the car, a short airborne arc, then a ground roll that bleeds
speed over a second or so before he pops back up. Below the threshold, keep
today's clean step-out.

Reuse what exists rather than inventing a second knockdown: there is already a
stun/knockdown vocabulary (`p.stunT`), a fall-damage path (OP2-G) and person
shadows that smear on knockdown (OP2-D). The driverless car must keep going and
behave like any other runaway.

**Acceptance:** bailing at speed never leaves Turbo inside the car or inside
geometry; the roll ends with him standing and fully controllable; bailing into
a wall or off a ledge resolves through the existing collision/fall paths, not a
special case; low-speed exit is unchanged.

#### PV9 — Slow motion `P2 · Risk: Med` `DONE (2026-08-07)`

> *"Add a slow motion mechanic. idk how, just make it rad."*

The plumbing already exists and is proven: the main loop scales `simDt` by
`TIME_SCALE` while keeping UI and recording on real time (D5 dev time controls),
and `HIT_STOP` already does a micro-freeze on impacts. Slow motion is that
mechanic promoted from a dev tool to a player one.

Design intent — *rad*, so make it feel bought rather than free:

- A player-facing trigger (button + key), with a meter that drains while active
  and refills over time, so it's a resource and not a toggle.
- Sell it with the systems that now exist: push `FX` hard while it's live
  (desaturate, lift the bloom, wind the chromatic aberration up), pitch the
  engine and radio down through the existing audio graph, and widen the camera
  slightly.
- Entry and exit are ramps, not steps — snapping time scale is what makes slow
  motion feel cheap.

**Sequencing note:** it multiplies whatever `TIME_SCALE` the dev controls set;
keep one authoritative product rather than two competing writers.

**Acceptance:** physics stay stable at the lowest time scale (the loop's
substep clamp is `Math.min(4, …)` — verify it doesn't starve); audio pitch
returns exactly on exit; the meter persists sensibly across BUSTED/WASTED,
cutscenes and Cinema; `SETTINGS.reduceMotion` still gets a sane experience.

*Built note:* the substep concern turned out to be backwards — slowing time
makes the sim **more** stable, since substeps are `ceil(simDt/0.017)` and a
smaller `simDt` is simply one short step. Slow motion also does **not**
desaturate: the owner's direction mid-build was *"not a fan of the desaturated
look, keep it vibrant"*, so it pushes saturation up instead. Don't "fix" that
back to the film-school default.

#### PV10 — Carnage: debris, scorch, chain reactions `P2 · Risk: Med` `DONE (2026-08-07)`

> *"Explosions, action … anything that would make a 22 year old guy with pizza
> stains on his shirt go sweeeeet."*

`index.html` §CARNAGE. Explosions gained physical mass: pooled debris chunks
that arc, bounce, tumble and settle in the paint colour of the wreck they came
off; scorch marks on the road; and chain reactions that put neighbouring cars
on short random fuses so a pile-up goes up as a ragged sequence. Both pools are
fixed-size; the chain is capped per blast (`CHAIN_MAX`) **and** globally rate-
limited (`chainBudget`) so dense traffic can't cascade the map.

Plus the money shot: `slowmoBurst()` bends time for 0.75s when a blast goes off
within 30u of you — free, never charging the §SLOW MOTION meter.

#### PV11 — Rampage combos `P3 · Risk: Low` `DONE (2026-08-07)`

`index.html` §RAMPAGE. Vehicles wrecked inside a rolling 4.2s window build a
combo; crossing 2/3/5/7/10 fires an escalating callout, flash, shake, stinger
and payout, and the top rung earns a cinematic time bend.

It scores **vehicles, not people** — deliberately, so the ladder pays for
spectacle rather than for running pedestrians down. Payouts total 550 for the
whole ladder, sized against a big heist; `rampage.test.js` asserts it stays
under Deb's $800 so one good night can't make Chapter 1's spine irrelevant.

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

**NEXT: (owner's call)** — the Football Saga is **complete**: FB1–FB5 all
done as of 2026-08-02. Everything still open is owner-triggered — `RV2` (mama
rat model), `RV3` (rat polish, unscoped), `TM` (Turbo Mode), `AF` (audit
follow-up), `X1` (modular split). Nothing here should be picked up as "the next
task" without you saying so first.

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
✔ U1  Objective clarity/HUD      DONE (story-goal half; see §16)
✔ P1  Mission variety            DONE (courier/takedown/getaway + base; see §17)
✔ J4  Control feel               DONE (dead-zone + brake/reverse clarity; see §17)
✔ J3  Camera options             DONE (sens/invert/low-speed follow; see §18)
✔ P3  Wanted + difficulty        DONE (Easy/Normal/Hard; see §19)
✔ FB1 Jock NPCs                  DONE
✔ FB2 Football field             DONE
✔ RV1 Mama rat mechanics         DONE (placeholder)
✔ P2  Economy tuning              DONE (#38)
✔ U2  Onboarding                 DONE (controls card #35)
✔ D5  Time controls             DONE
✔ D7  Deterministic seed        DONE
—  J2  Hitstop + shake           DONE
✔ U3  Death/respawn flow         DONE
✔ R2  Pooling traffic/peds       DONE
✔ R3  Anti-stuck & spawn-safety  DONE
✔ OD1 Straight-flight RPGs       DONE
✔ OD2 Bubble building occlusion  DONE
✔ OD3 Turbo sprint               DONE
✔ OD4 Denser street life         DONE
✔ OP1 Owner playtest polish     DONE
✔ FB3 Coach mission             DONE (Old Scores → Rematch; sets G.coachBeaten)
✔ FB4 Football minigame         DONE (Turbo Bowl endless run)
✔ FB5 Cheerleaders cutscene     DONE (turbo_bowl_payoff; solo Turbo)
—  RV2 Mama rat model/animation  OPEN (owner-expanded)
—  RV3 Rat vengeance polish      OPEN (unscoped)
✔ OP2 Owner playtest corrections DONE (A–G; B via #41, rest in the five-agent batch)
—  TM  Turbo Mode                 OPEN (owner-triggered, after OP2)
—  AF  Codex audit follow-up      OPEN (owner-triggered)
—  X1  Modular split (if approved) OPEN
—  A2  Accessibility             DEFERRED — LOWEST PRIORITY (owner direction)
```

**Character / cutscene track** (see `CHARACTERS.md`) runs in parallel and shares
tooling with Phase 0. Critical path there: `D6` viewer → `C1` spec refactor →
`C2` body/shoulder overhaul → `C3` paintable UV textures → `C5` paint/edit page →
`C6` character creator → `C8` cutscene actors/animation. `C6` depends on `F1` (to
save the painted character). See `CHARACTERS.md §5` for the full order.

**Football saga track** (Phase 7, above) is **complete** — `FB1` (ambient
jocks), `FB2` (field), `FB3` (Coach mission), `FB4` (Turbo Bowl) and `FB5`
(the payoff cutscene) all landed. `G.coachBeaten` gates the minigame;
`G.turboBowlBest`/`turboBowlWon` persist the score and the one-time payoff.
The one loose thread the strand still describes but nobody has built is
`danny_apology` (`FOOTBALL_STRAND.md` §6) — the equipment-shed scene where
Turbo gives his first undeflected apology. It has no backlog card; add one if
you want it. Note that `FOOTBALL_STRAND.md` §6 and this file's FB5 card
disagree about the Turbo Bowl payoff — see Known issues in `STATUS.md`.

**Rat Vengeance track** (Phase 8, above) is a small ongoing side-track — `RV1`
(shoot the swarm → mama rat spawns, hunts, bites, and can be killed) is done
with a throwaway placeholder model. Next up is `RV2`: give her (and the regular
swarm) a real model/animation with ears, eyes, mouth, feet, and correct
face-Turbo pursuit orientation in `makeRatMesh`/`makeMamaRatMesh`. `RV3` is
unscoped follow-on polish — don't start it without checking in first.

**Owner playtest correction track** (Phase 11) is independent of the Football
Saga and begins only on owner instruction: `OP2-A` road/sidewalk visuals →
`OP2-B` vehicle sanity/jackability/impact damage → `OP2-C` melee reliability
and planted kick pose → `OP2-D` grounded body shadows/Turbo footsteps →
`OP2-E` quieter HUD/head-anchored bubbles → `OP2-F` planned cinematic routes →
`OP2-G` explosion/fall lethality. Because all seven
touch `index.html`, run them sequentially rather than assigning concurrent
agents to the same hot file.

**Turbo Mode track** (Phase 12) begins only on owner instruction and should
follow the OP2 systems it extends: `TM1` unlock/toggle/state → `TM2` golden
transformation/cutscene → `TM3` powers/combat/voice. The first playtest build is
free and infinite; `$500/minute` is recorded but billing remains disabled until
the owner approves the final economy behavior.

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

---

## 17. Changelog — P1 mission variety + J4 brake/reverse clarity (Claude, 2026-07-24)

Continuing down `§10`'s suggested order: **P1** (mission variety) and the
remaining half of **J4** (control feel).

**P1 — three new mission types + soft progression.** The five-type pool
(`delivery/style/checkpoints/rampage/heat`) went stale after a few loops —
"don't repeat the last type" was the only variety mechanism. Added:

- **`courier`** — a `delivery` variant where Chaos Pizza has already tipped
  off the cops: picking up the package sets `G.heat=Math.max(G.heat,40)`
  (same `addHeat(0)`-to-recompute-stars pattern the existing `heat` type
  uses), so the drop-off leg plays out under real cop pressure. Pays ~80%
  more than a plain delivery for the added risk.
- **`takedown`** — flags a live civilian `traffic[]` car (never the player's)
  and reuses the existing mission `beacon` to *follow* it every frame
  (`setBeacon(mission.car.x, mission.car.z)` inside `updateMission`), so it's
  trackable on the minimap even while it's still driving around. Wins the
  instant `mission.car.dead` flips — already true whether the player shoots
  it (`damageCar` via the pistol branch in `doAttack`), ends it with an RPG,
  or it simply wrecks itself into a tree (civilian traffic already takes
  crash damage the same way cop cars do). No new AI or damage system needed.
- **`getaway`** — like `heat` but with an actual destination: forces
  `G.heat=Math.max(G.heat,70)` and gives the player a beacon to reach within
  a timer. Rewards a time-remaining bonus on top of the base $320, so a fast
  runner cashes in more than someone who barely makes it.
- **Soft progression:** `missionTier()` (`0/1/2`, stepping every 5
  `missionsDone`) gates the pool — `courier`/`takedown` unlock at tier 1,
  `getaway` at tier 2 — and `completeMission()` now applies a `+15%`-per-tier
  reward multiplier across **every** mission type, so the original five keep
  paying better too as the session goes on. No new save field: `missionsDone`
  already persists via `F1`, so unlocks and the pay bump survive a reload for
  free.
- `busted()` already force-failed an in-progress `heat` mission (elevated
  wanted level makes no sense to keep chasing post-respawn); extended that
  same guard to `courier` and `getaway` since they force heat too.

**J4 remainder — brake-vs-reverse legibility.** `carPhysics` already brakes
then reverses on one held input; nothing told the player which phase they
were in. Two additive, read-only-of-state cues, no physics touched:

- `updateCarMode` edge-detects `player.car.speed<-0.15` and relabels the
  touch `#btnBrake` pedal from **BRAKE** to **REVERSE**, toggling a new
  `.reversing` class (amber tint, `#ffd23e` border) so it reads as a
  distinct state at a glance, not just a text swap.
- The main-loop `drawDash(...)` call site appends **`· REV`** to the
  car-type name at the same threshold — this lands on the always-visible
  analog gauge cluster (`#speedo`, not gated by `html.is-desktop`), so
  desktop/keyboard players — who never see the touch pedals — get the same
  cue.

New `tests/cases/mission-variety.test.js` (10 cases: tier-gating in both
directions, the tiered reward multiplier, each new type's win/fail path, and
the `busted()` guard — courier and getaway get their own fresh-page cases
since `respawn()` latches `G.over=true` for its 1.8s teleport delay, so two
synchronous `busted()` calls in one page would have the second no-op on that
guard) and `tests/cases/control-feel.test.js` (2 cases: pedal relabel/class
toggle, dash label appends/drops `REV`).

Full suite: `cd tests && node run.js` — **65/65 green** (up from 53; 12 new
cases), zero console errors.

Signed: Claude Code | Sonnet 5 | medium

---

## 18. Changelog — J3 camera polish: sensitivity, invert-Y, low-speed follow (Claude, 2026-07-24)

Picked up **J3** next per `§10`. Landed the concrete, verifiable half of the
card; deferred the one feel-tuning bullet (see the card's new `PARTIAL`
status note above) rather than guess at a change this suite can't judge.

- **Look-sensitivity slider + invert-Y toggle** (Settings → F2, new
  `#volLookSens` range input and `#invertYGroup` on/off pair, styled
  identically to the existing volume sliders and the `VIBRATE` toggle).
  Both persist in the same `SETTINGS` blob (`gtb4.settings`) — `lookSens`
  defaults to `100` (%), `invertY` to `false`. Applied at the single choke
  point every look input already funnels through, `applyLook(dx,dy)`: yaw
  and pitch deltas are scaled by `SETTINGS.lookSens/100`, and pitch is
  negated when `invertY` is on. Touch drag, mouse drag, and replay-camera
  scrubbing all call `applyLook`, so this covers every input path without
  touching the touch/mouse listeners themselves.
  - Generalized the settings-panel `slider(id,key)` helper to take an
    optional `onInput` callback (defaults to the existing `applyVolumes`,
    so the four volume sliders are untouched) since a look-sensitivity
    change has nothing to "apply" beyond the `SETTINGS` write `applyLook`
    already reads live.
- **Low-speed car-camera follow rate.** The chase-cam's ease-back-out lerp
  used a fixed `5/s` rate regardless of speed; pulling out from a stop (or a
  tight three-point turn) meant the camera visibly lagged the car's new
  heading for a beat. It now ramps up to `8/s` as speed drops to zero
  (`followRate=5+3*(1-clamp(|speed|/8,0,1))`) and eases back to the original
  `5/s` above ~8 u/s, so normal-speed driving feels identical. The instant
  "never clip into a wall" snap branch (`cameraCollide` pulling the camera in
  when a building gets between it and the car) is untouched — this only
  changes the ease-back-out rate.
- Foot-camera-while-strafing smoothing and "no motion sickness spikes" are
  feel-tuning with no automated way to verify improvement (`tests/README.md`
  is explicit that this suite tests state/logic, not feel) — reviewed the
  existing `moveMag>0.12`/`lookHoldT` gate in `updateCamera`'s foot branch,
  didn't find a concrete issue on inspection, left it as-is rather than churn
  numbers with no way to confirm they helped. Flagged on the card for a real
  playtest pass.

New `tests/cases/camera-polish.test.js` (5 cases): default settings values,
`applyLook` scaling proportionally with `lookSens`, `invertY` flipping pitch
sign, both settings surviving a reload, and the low-speed-vs-speed car-camera
follow-rate comparison (same synthetic offset, same `dt`, asserts the
low-speed case closes more distance in one frame).

Full suite: `cd tests && node run.js` — **70/70 green** (up from 65; 5 new
cases), zero console errors.

Signed: Claude Code | Sonnet 5 | medium

---

## 19. Changelog — P3 difficulty options (Easy/Normal/Hard) (Claude, 2026-07-24)

Next per `§10`. The wanted system's escalation curve and HUD hints already
read clearly (star thresholds, "THEY SEE YOU"/"CLEAR — STAY AWAY"/"HIDDEN —
LAY LOW" with live countdowns) — nothing there needed retuning. The actual
gap was the card's other ask: a difficulty setting that actually changes
something. Added:

- **`DIFFICULTY_TIERS`** (`easy`/`normal`/`hard`, next to `spawnCop`): three
  multipliers — `spawnMult` (cop pressure), `aggroMult` (detection/escape
  range), `dmgMult` (damage taken) — read through a `difficulty()` helper
  keyed off `SETTINGS.difficulty` (new, defaults `'normal'`, persisted in the
  existing `SETTINGS` blob).
- **`wantedCount()`** now scales `(1+G.stars)` by `spawnMult`, **capped at 8**
  regardless of difficulty — "harder" means denser pressure per star, not an
  unbounded swarm; respects the same don't-tank-fps intent as `F3`'s
  traffic/ped caps without needing a new cap system.
- **`updateWanted()`**'s three detection ranges (car cop `70`, foot cop `50`,
  cop heli `130`) and the "CLEAR" escape distance (`85`) all scale by
  `aggroMult` — hard spots the player from farther away *and* makes losing
  the heat require getting farther away, easy does the opposite.
- **Damage taken** scales by `dmgMult` at every cop-inflicted damage site:
  `damagePlayer()` (the shared choke point for footcop gunfire/baton hits —
  also happens to cover mama-rat bites, a reasonable read of a general
  "damage taken" difficulty lever) plus the two `damageCar(player.car,...)`
  sites for cop gunfire and cop-car ramming.
- New Settings (F2) row: `#difficultyGroup`, a 3-button toggle following the
  exact `qualityGroup`/`vibrateGroup` pattern (`refreshDifficultyButtons` +
  `setDifficulty` + a standalone `initDifficultyUI()` IIFE).
- Widened `.pmRow label` from `58px`→`80px` while adding J3's rows last
  session — the two-word "LOOK SENS." label was still wrapping to two lines
  at 70px; 80px was needed to fit it on one, verified with a live phone-
  viewport screenshot (800×390, scrolled to the bottom of the now-8-row
  panel — it's `overflow:auto` per the existing `.pmPanel` rule, so the
  extra row doesn't overlap anything, just adds one more scroll step).

New `tests/cases/wanted-difficulty.test.js` (7 cases): default value, spawn-
count scaling in both directions, the 8-cap holding at 5 stars on hard,
zero-stars staying zero regardless of difficulty, damage scaling in both
directions, hard spotting the player from a distance normal can't (with
`losClear` stubbed so the assertion tests the range math, not whether the
test's chosen coordinates happen to clear a procedurally-placed building),
and persistence across reload.

Full suite: `cd tests && node run.js` — **77/77 green** (up from 70; 7 new
cases), zero console errors.

Signed: Claude Code | Sonnet 5 | medium
