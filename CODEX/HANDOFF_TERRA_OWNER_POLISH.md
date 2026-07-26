# Terra handoff — owner playtest polish

Base: local handoff branch `codex/terra-owner-polish-handoff`, built directly
on current `main` after consolidation commit `ebde46c`

Suggested implementation branch: create `terra/owner-playtest-polish` from the
handoff branch so this plan remains in the implementation history.

Status: plan only. No gameplay changes from this planning pass.

## Owner intent

The latest phone playtest exposed a cluster of control, camera, combat, mission,
and HUD issues. Treat this batch as the authoritative `NEXT` work before FB3.
The goal is to make free-roam readable and pleasant before adding another story
mission.

Deliver the work as five ordered, independently playable commits. All five
touch `index.html`, so keep them sequential. Do not refactor unrelated systems,
add dependencies, change recorded-VO paths, or reopen terrain generation.

## Commit 1 — Restore sprint and blend the aim camera

### Observed problems

- Sprint works initially but no longer works after Turbo exits a car.
- Switching between aimed and unaimed foot cameras is a hard jump.

### Relevant code

- Input/mode UI: `input`, `btnHold`, `clearSprint`, `pollKeys`,
  `refreshButtons`, `doEnterExit`, `exitCar`, and `exitCarSoft`.
- Sprint: `canSprint` and `updateFoot`.
- Foot camera: the `G.mode==='foot'` branch in `updateCamera`,
  `isRangedWeapon`, `footCamYaw`, `camPos`, and `setTurboAimTransparency`.
- Existing coverage: `tests/cases/sprint.test.js` and
  `tests/cases/camera-polish.test.js`.

### Required behavior

- Reproduce the car-exit failure before changing it. Fix the mode/input
  lifecycle rather than adding a one-off forced sprint state.
- Entering a vehicle may clear a held sprint. After a normal `exitCar()` or
  recovery `exitCarSoft()`, a fresh touch press on SPRINT and a fresh desktop
  Shift press must both work immediately.
- Do not make a held vehicle BOOST automatically become sprint on exit. Require
  release and a fresh press if the same physical Shift/touch hold crossed the
  mode change.
- Preserve sprint cancellation for attack, crouch, climb, bail, stun, pause,
  replay, and touch-cancel.
- Add a persistent `aimBlend` (0 unaimed → 1 aimed) driven by time-based easing,
  not a frame-count lerp. Interpolate camera distance, shoulder offset, height,
  look target, FOV, and Turbo transparency through that blend.
- Entry and exit should take roughly 0.2–0.35 seconds and remain collision-safe.
  A real wall may pull the camera inward quickly, but toggling aim in clear
  space must never teleport the camera.

### Focused acceptance

1. Boot on foot, sprint, enter a car, exit, release, and press sprint again:
   Turbo reaches sprint speed and uses the sprint pose.
2. Repeat through `exitCarSoft()`; touch and keyboard paths both recover.
3. Holding vehicle BOOST across the exit does not latch sprint.
4. Aim on/off camera position and FOV move through intermediate values over
   multiple frames, with no one-frame hard jump.

Extend `tests/cases/sprint.test.js` and `tests/cases/camera-polish.test.js`.

## Commit 2 — Make dogs mortal and add 30-second ghosts

### Observed problem

Dogs can attack Turbo but cannot be killed. The owner wants every dog to be
mortal; each dead dog should release a translucent ghost that haunts Turbo for
30 seconds.

### Relevant code

- Dog construction/ownership: `makeDog`, `attachDog`, `updateDog`,
  `releasePedReferences`.
- Strays/packs: `strayDogs`, `dogGangs`, `makeStray`, `removeStrayDog`,
  `antagonizeDogs`, and `updateStrayDogs`.
- Player damage paths: `doAttack`, `doPunch`/`doKick`, pistol/RPG impact and
  explosion-radius handling.
- Cleanup/persistence: `disposeMesh`, `G.strayDogCount`, and `queueSave`.
- Existing coverage: dog cases in `tests/cases/new-features.test.js` and
  `tests/cases/traffic-pooling.test.js`.

### Required behavior

- Give both leashed and stray dogs a small explicit health value and one shared,
  idempotent damage/death path.
- Fists, kicks, baton, pistol, RPG direct/splash damage, and other existing
  combat damage that physically reaches a dog must damage it. Preserve the
  current first-hit pack antagonism.
- On death, detach the dog from its owner and gang, stop bites/AI immediately,
  remove and dispose the living mesh once, and update persistent counted-stray
  bookkeeping once. Do not let the existing orphan/archive path resurrect or
  double-count it.
- Spawn one ghost at the death point. A practical interpretation of “haunts” is
  visual pursuit/orbit only: it rises out of the body, then floats after Turbo
  for 30 seconds without dealing damage or blocking movement.
- The ghost should read as the same dog silhouette, use cloned transparent
  materials (`transparent:true`, opacity around `0.3–0.45`, `depthWrite:false`),
  bob/float above ground, fade during its final seconds, then be removed and
  disposed.
- Multiple ghosts are allowed but must be bounded (suggested cap: 8); removing
  the oldest at the cap must dispose it. Ghosts must not enter dog gangs,
  targeting, saves, minimap, replay actor arrays, or collision checks.

### Focused acceptance

1. A leashed dog and a hostile stray can each take damage and die exactly once.
2. Death clears owner/gang references and prevents any later bite.
3. One translucent ghost rises, follows/orbits Turbo, remains non-damaging, and
   expires at 30 seconds.
4. Counted-stray persistence changes once; orphan/archive bookkeeping cannot
   re-add the dead dog.
5. Repeated deaths stay within the ghost cap and leave no mesh/material leak.

Add `tests/cases/dog-ghost.test.js`.

## Commit 3 — Route cinematic cameras gracefully and keep Deb above ground

### Observed problems

- The intro camera no longer tunnels straight through buildings, but it visibly
  runs into façades and slides along them.
- The Deb confrontation camera still goes underground.

### Relevant code

- Intro/cinema intro: `INTRO_PATH`, `cinematicCameraBlocked`,
  `routeCinematicCamera`, `flySample`, `updateIntroCam`, and
  `updateCinemaIntro`.
- Cutscenes: `CUTSCENES.deb_confrontation`, `CUTSCENES.deb_payoff`,
  `playCutscene`, `initShot`, and `updateCutscene`.
- Terrain/collision: `groundH` and the existing cinematic building/prop
  blockers. Read `TERRAIN.md`; do not change terrain.
- Existing coverage: `tests/cases/intro-camera.test.js`,
  `tests/cases/cinema-mode.test.js`, and cutscene cases in
  `tests/cases/chapter1-story.test.js`.

### Required behavior

- Replace per-frame “push to the nearest façade and slide” as the primary intro
  routing behavior. Resolve each path segment into a smooth clearance route
  that anticipates blockers—prefer a gentle elevated or lateral detour—then
  ease through that route with continuous position and look direction.
- The intro and Cinema Mode’s intro scene must share the same routing result.
  Do not maintain two subtly different camera paths.
- Keep at least the existing terrain clearance and a visible building/prop
  margin throughout. Avoid large single-frame position, yaw, pitch, or FOV
  changes at segment boundaries.
- Outdoor cutscene shot heights are currently treated as absolute world Y.
  Add an explicit terrain-safe outdoor-shot mode and opt the Deb confrontation
  and payoff into it. Resolve shot camera and look targets relative to local
  `groundH`, clamp interpolation throughout the shot, and retain the authored
  composition as closely as possible.
- Do not apply terrain clamping blindly to interiors or every cutscene.

### Focused acceptance

1. Every sampled intro frame clears terrain and cinematic blockers.
2. No frame shows the camera first contacting a building and then travelling
   along its face; motion remains continuous through the detour.
3. Segment boundaries stay under a reasonable step-distance/angle threshold at
   the test timestep.
4. Every Deb confrontation/payoff frame keeps the camera and look target above
   local terrain, including a test anchor placed on a hill.
5. Existing cutscene timing, dialogue, skip, and Cinema Mode handoff still work.

Extend `tests/cases/intro-camera.test.js` and add focused Deb terrain assertions
to `tests/cases/chapter1-story.test.js`.

## Commit 4 — Make missions opt-in and reflow the phone HUD

### Observed problems

- Random missions auto-start after a short cooldown, adding pressure and
  information before the player chooses it.
- The wanted HUD always shows five star slots even at zero stars.
- The left HUD is cramped and can sit under an iPhone Dynamic Island/cutout.

### Relevant code

- Missions: `mission`, `missionCooldown`, `startMission`, `updateMission`,
  `setMissionHUD`, and the dev MISSION controls.
- HUD: `#hud`, `#money`, `#debtHud`, `#footHp`, `#stars`, `#mission`,
  `#storyObj`, `#minimap`, `#radioBtn`, `#fsBtn`, `#pauseBtn`,
  `updateStarsHUD`, and `refreshButtons`.
- Mobile layout: `viewport-fit=cover`, the safe-area CSS, `gtb-rotated`,
  `--lvw`/`--lvh`, and the `max-height:430px` rules.
- Existing coverage: `tests/cases/mission-variety.test.js`,
  `tests/cases/hud-objective.test.js`, and mobile checks in
  `tests/cases/sprint.test.js`.

### Required behavior

- Random side missions never auto-start. When the idle cooldown elapses, show
  a temporary translucent `START MISSION` button centered in the safe gameplay
  area. Only a click/tap on that button calls `startMission()`.
- The offer should remain for about 8 seconds. If ignored, hide it and wait
  roughly 15–25 seconds before offering again. Hide/cancel it during active
  missions, story/cutscene overlays, pause, replay, interiors, death/respawn,
  and other modal activity.
- Starting, completing, and failing a mission must hide the offer and preserve
  the current mission pool, progression, rewards, beacon, and dev controls.
  Story missions and Pizza Wars remain explicitly triggered by their existing
  interactions; this change is for the timed random-mission loop.
- At zero wanted stars, `#stars` is hidden and occupies no visual box. At level
  N, render exactly N stars—no empty placeholders. Use a pink, translucent
  treatment at about half the current 24px size; keep contrast/readability via
  a subtle shadow rather than an opaque HUD panel.
- Reflow the phone HUD around all safe-area edges, not only the top inset.
  Introduce reusable logical safe-inset CSS variables and correctly remap them
  for the auto-rotated portrait mode.
- Keep money/debt/health as a compact safe top-left stack, wanted state at safe
  top-center, mission/story text centered below it, and minimap at safe
  top-right. Move or space radio/fullscreen/pause so they do not collide with
  the left status stack. Do not cover touch controls.
- Verify both native landscape and the app’s auto-rotated portrait path with an
  iPhone-style left cutout/Dynamic Island inset and at 800×390.

### Focused acceptance

1. Waiting indefinitely never starts a random mission.
2. The temporary offer appears, expires, and reappears later; tapping it starts
   exactly one mission and removes it.
3. Modal states suppress the offer without losing cooldown consistency.
4. Wanted levels 0/1/2/5 render 0/1/2/5 small translucent pink stars.
5. Simulated left/right cutout insets produce no overlap among the left status
   stack, mission/story prompt, wanted stars, minimap, and touch controls.

Add `tests/cases/mission-opt-in-hud.test.js` and keep the test seam small enough
to simulate logical safe insets without device-specific user-agent hacks.

## Commit 5 — Smooth melee camera and add the three-spin hold kick

### Owner direction

- Punching and kicking currently jostle the camera too much. Keep the action
  readable, but make the camera smooth.
- Holding KICK for one second should launch a fast special attack: Turbo plants
  one foot, holds the rest of his body horizontally with both arms stretched
  ahead and the free leg behind, then rotates three full turns around the
  planted foot. Every enemy touched is hurt and knocked back.

### Relevant code

- Input: the standalone `btnKick` touch/mouse listeners, keyboard `KeyK`,
  `keys`, and mode/reset paths. KICK is not currently part of `btnHold`.
- Combat: `doPunch`, `doKick`, `knockPed`, `downJock`, `downFootCop`, the dog
  damage/death helper added by commit 2, and any existing mission-combat actor
  damage functions.
- Animation/state: `player.kickT`, the kick pose in `updateFoot`, exposed
  `player.mesh.userData` limbs, sprint/crouch/climb/bail/stun guards, and
  `footGround`.
- Camera/impact: `updateCamera`, `camPos`, `camShake`, `shake`,
  `triggerHitStop`, and haptics.
- Existing coverage: `tests/cases/regression.test.js`,
  `tests/cases/hitstop.test.js`, and `tests/cases/camera-polish.test.js`.

### Required behavior

- Change KICK to press/hold/release semantics on touch, mouse, and desktop K:
  releasing before one second performs the existing ordinary kick once;
  reaching one continuous second starts the special and suppresses the tap
  kick. Ignore keyboard auto-repeat and touch/mouse duplicate events.
- Charging is valid only on foot, grounded, unarmed/fists, alive, and outside
  crouch, climb, bail, stun, pause, replay, cutscene, interior transition, or
  another attack. Invalidating the state cancels the charge safely.
- Once the special starts, it completes three fast revolutions even if the
  button is released. Target about `0.35s` per revolution (`~1.05s` total).
  Store the planted position/ground height and prevent ordinary locomotion,
  sprint, jumping, attacks, entering a vehicle, or anti-stuck drift until the
  move finishes.
- The planted leg stays vertical with its foot at the stored ground point. Pose
  Turbo’s torso/head approximately horizontal, arms straight together ahead,
  and the non-planted leg straight behind. Rotate the visible body exactly
  `3 * TAU` around the planted foot’s vertical axis, then restore every altered
  limb/root transform and the prior heading without a pop.
- Use a swept radial contact check so a fast spin cannot tunnel through a
  target between frames. Each valid enemy may be hit at most once per
  revolution, for up to three hits across the move.
- Valid enemies are active hostile combatants: jocks, foot cops, hostile
  mission actors, Mama Rat if in range, and angry/attacking dogs through commit
  2’s shared dog-damage path. Do not hit Deb, ordinary civilians, downed/dead
  actors, tamed/passive dogs, the player, or vehicles.
- Starting damage target: about `28` per revolution with a strong outward
  knockback (`2.5–3.5u`), resolved against static collision so targets are not
  shoved through buildings. Reuse each actor type’s existing damage/down path
  and heat rules; do not invent parallel death bookkeeping.
- Keep restrained impact feedback—sound, sparks, a tiny hitstop/haptic per
  contact are fine—but do not add a camera shake per target. Cap feedback when
  several enemies are struck in one frame.
- For normal punches, normal kicks, and the special, keep the foot camera target
  on a smoothed world-space player anchor rather than letting pose/root
  articulation jerk the view. In a clear scene, attacking should not create a
  hard camera-position or look-direction jump. Preserve stronger camera shake
  when Turbo is hit, crashes, or is near an explosion.

### Focused acceptance

1. A quick KICK press produces exactly one ordinary kick; a `0.99s` hold still
   produces the ordinary kick on release; a `1.0s+` hold produces no ordinary
   kick and starts one special.
2. Touch, mouse, and keyboard K behave identically without duplicate attacks.
3. The special keeps one foot planted, completes exactly three fast rotations,
   shows the specified horizontal pose, blocks conflicting states, and restores
   a normal pose cleanly.
4. A swept test target touched during a large timestep is hit; eligible enemies
   are damaged/knocked back at most once per revolution while civilians,
   passive dogs, dead actors, and vehicles are untouched.
5. Multi-target contact does not stack unbounded shake/hitstop. Normal melee
   and special attacks keep camera position/look changes smooth, while incoming
   damage and explosions retain their existing impact feedback.
6. Cancel paths—vehicle/mode change, stun, pause, replay, cutscene, death, and
   touch-cancel during charge—leave no latched button, pose, or movement lock.

Add `tests/cases/spin-kick.test.js` and extend the melee camera case in
`tests/cases/camera-polish.test.js`.

## Delivery and validation

Before editing, check out `codex/terra-owner-polish-handoff`, read root
`AGENTS.md` and `STATUS.md`, claim the exact files, and create
`terra/owner-playtest-polish` from that handoff branch. Keep one logical commit
per section above, each ending with:

`Signed: <program> | <model> | <effort>`

Use Terra’s own program/model in the actual signature. Update the claim after
each commit. Run only:

1. `node tests/syntax-check.js`
2. the focused test files changed or added for that commit
3. one final 800×390 touch smoke covering car exit → sprint, quick kick versus
   one-second hold spin kick, dog death/ghost, mission offer, wanted stars, and
   HUD cutout layout
4. one final intro + Deb confrontation camera pass

Do not run the full suite unless a changed shared primitive makes it necessary.
Do not push directly to `main`; push the Terra branch and open one draft PR.

## Copy/paste prompt for Terra

Read `AGENTS.md`, `STATUS.md`, and
`CODEX/HANDOFF_TERRA_OWNER_POLISH.md` completely. Implement the five ordered
owner-playtest commits by checking out `codex/terra-owner-polish-handoff` and
creating `terra/owner-playtest-polish` from it. Claim the work first, keep
`index.html` changes focused, add the specified focused tests, use your required
signature on every commit and STATUS entry, push the implementation branch, and
open one draft PR into `main`. Do not start FB3, refactor unrelated systems, add
dependencies, alter terrain, or change recorded-VO paths. Report each commit,
focused validation, the phone/cutout check, and any remaining risk.

Signed: Codex | GPT-5 | high
