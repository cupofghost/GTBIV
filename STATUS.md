# STATUS

Last consolidation: 2026-07-25 (eighth pass — rebased the post-PR #40 OD1–OD4 work onto current `main` and archived the completed branch records) — Signed: Codex | GPT-5 | high

## Active work
_Nothing claimed right now._ Add your row below per AGENTS.md §1.3 — and escape
the pipes in your signature as `\|`, or the table breaks.

| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|
| 2026-07-25 | `HANDOFF.md`, `CODEX/HANDOFF_TERRA_OWNER_POLISH.md`, `STATUS.md` | Done: made OP1 the authoritative NEXT task and prepared a four-commit Terra plan for controls, dogs/ghosts, cameras, mission opt-in, and phone HUD. | Signed: Codex \| GPT-5 \| high |

## Shared-file touches
Standing list of what's hot. If you must edit one of these, make the smallest
possible change and add a line here.
- `index.html` — the whole game. Hot spots, in order of how often they conflict: the AUDIO section (the `let AC=null,…` declaration line and the `exitCarSoft()` reset block each grow a variable every time someone adds a sound layer), `updateFoot`, and the terrain/ground block (`groundH`, `terrainLines`/`terrainGeo`) — terrain is settled as of #31, so read `TERRAIN.md` before reopening it.
- `index.html`'s `// CODE MAP` comment block — its line ranges go stale the moment anyone inserts code. It is mechanical to regenerate from the section banners; don't hand-edit the numbers.
- `HANDOFF.md` — §5 code map and §8 backlog get edited by most sessions; edit the row, not the structure.
- `TERRAIN.md` — the terrain contract. Read the Tier 1 revision note before touching `groundH`.
- `js/person.js` — shared rig; additions must stay backward-compatible (limbs are read by several animation paths).
- `index.html` car/ped lifecycle — R2 added bounded generic free-lists and active-array retirement; keep mission/cinema exclusions intact. Signed: Codex | GPT-5 | high
- `HANDOFF.md` — owner-deferred A2, advanced NEXT to FB3, and made `FOOTBALL_STRAND.md` the detailed FB3 implementation contract where older docs differ. Signed: Codex | GPT-5 | medium
- `HANDOFF.md` — inserted owner-approved OD1–OD4 ahead of FB3 and advanced NEXT to straight-flight RPGs; implementation stays sequential because all four touch `index.html`. Signed: Codex | GPT-5 | high
- `index.html`, `HANDOFF.md` — owner-priority OD1–OD4 sequential implementation pass; tests and per-task commits are claimed by Codex. Signed: Codex | GPT-5 | high
- `HANDOFF.md` — inserted owner playtest task OP1 ahead of FB3 and delegated its four sequential `index.html` commits through `CODEX/HANDOFF_TERRA_OWNER_POLISH.md`. Signed: Codex | GPT-5 | high

## Known issues
- ~~PII in the docs~~ **RESOLVED — owner's decision, 2026-07-24:** the owner's first name in `HANDOFF.md`/`GAME_PLAN.md`/`ASSETS.md`/`STORY_BIBLE.md`/`CHARACTERS.md` is fine and does not need scrubbing. Do not re-flag it. The rest of AGENTS.md §3 still applies in full — no surnames, emails, phone numbers, addresses, other-platform usernames, or credentials of any kind. Latest scan found none of those. — 2026-07-24, Claude
- Duplicate `## 10.` heading in HANDOFF.md ("Suggested Order of Work" and "Changelog — polish pass (Kimi3)"). Still open: renumbering the duplicate cascades through §§11–15 and every cross-reference to them, so it is not the one-line fix it looks like. Cosmetic only — the NEXT-marker workflow is unaffected. Leave it unless the owner asks. — 2026-07-24, Claude
- Park knolls keep ~0.15u of sag between the drawn lawn and `groundH` (a dome sampled every ~3u). Harmless at that size; only worth revisiting if props on a knoll ever look sunk. — 2026-07-24, Claude
- `tests/cases/save-restore.test.js` (and later files in a long run) time out loading the page in the local Playwright Chromium headless shell, with GPU stall warnings in the browser log. The same suite runs fine in other contexts; appears environmental. Syntax check, economy suite, regression, and mission-variety all pass. — 2026-07-25, OpenCode

## Archive
- Consolidation (Codex | GPT-5 | high, 2026-07-25): replayed the six post-PR #40 planning/OD commits onto current `main`, resolved bookkeeping-only conflicts, and archived the open branch records. Signed: Codex | GPT-5 | high
- OD1–OD4 gameplay pass (Codex | GPT-5 | high, 2026-07-25): straight swept RPGs, building-occluded world bubbles, hold sprint with a distinct pose, and bounded local street-density refills; focused checks green. Signed: Codex | GPT-5 | high
- Backlog planning (Codex | GPT-5 | high, 2026-07-25): specified and delivered OD1–OD4, deferred A2 by owner direction, and restored FB3 as the next canonical task. Signed: Codex | GPT-5 | high
- R2/R3 closeout (Codex | GPT-5 | high, 2026-07-25): archived pooling, spawn-safety, recovery, handoff, and focused CI-stabilization records already delivered through PR #40. Signed: Codex | GPT-5 | high
- Consolidation (Codex | GPT-5 | high, 2026-07-25): archived the completed PR #40 batch, reconciled U3 as DONE, and advanced the authoritative NEXT marker to R2. Signed: Codex | GPT-5 | high
- U3 recovery flow (Codex | GPT-5 | high, 2026-07-25): BUSTED/WASTED penalties persist before the respawn lock; pursuit clears and focused coverage verifies playable terrain-seated recovery. Signed: Codex | GPT-5 | high
- Audio/RNG/CI (Codex | GPT-5 | high, 2026-07-25): lazy cached VO, shared seeded RNG, broader syntax checks, and GitHub Actions. Signed: Codex | GPT-5 | high
- PR #40 gameplay pass (Codex | GPT-5 | high, 2026-07-25): camera/terrain/controls/dog lifecycle, solid mushroom cloud, MP3-only Turbo dialogue, and focused coverage. Signed: Codex | GPT-5 | high
- Terra follow-up (Codex | GPT-5 | high, 2026-07-25): solid mushroom cloud, MP3-only Turbo paths, regenerated code map, and focused tests. Signed: Codex | GPT-5 | high
- Terra handoff refresh (Codex | GPT-5 | medium, 2026-07-25): captured exact PR #40 validation and the next-step guidance. Signed: Codex | GPT-5 | medium
- City Glow (Kimi K3, medium, 2026-07-25): lit-window night swap, instanced neon signs on street-facing facades, grade-tilted streetlight glow pools; `facadeMats` buckets wired into `applyDayNight`. `index.html` §CITY GLOW; `tests/cases/city-glow.test.js` added. Merged to `main` as #37; suite 3/3 + boot green.
- P2 Economy tuning (OpenCode | Kimi K2 | high, 2026-07-25): flattened heist loot ($250–$500 + $150 escape), raised stickup/store/delivery/pizza payouts, routed raw payouts through `addMoney()` for persistence and gold-class feedback. `index.html` §HUD/TOASTS, §WEAPONS, §STORY, §DAY/NIGHT, §MISSIONS; `tests/cases/economy.test.js` added. Merged to `main` as #38; economy suite 6/6 + regression + mission-variety green.
- Intro camera terrain clamp (Kimi K3, medium, 2026-07-25): `flySample()` clamps flythrough cam + look target above `groundH`; Cinema Mode free-fly floor uses `groundH+0.5`. `index.html` §ANIMATED INTRO / §CINEMA MODE; `tests/cases/intro-camera.test.js` added. Merged to `main` as #36; suite 3/3 + cinema 6/6 + boot green.
- Controls card onboarding (Kimi K3, medium, 2026-07-25): first-boot TOUCH/DESKTOP tabs, `controlsCardSeen` in save blob, pause HOW TO PLAY recall (replaced `pmHow`). `index.html` §CONTROLS CARD; `tests/cases/controls-card.test.js` added. Merged to `main` as #35; suite 5/5 + save-restore + boot green.
- Cinema Mode (Opus 5, high, 2026-07-24): the REPLAY screen grown into a director interface — live free-fly camera over the running world, scene dropdown (intro flythrough, 4 scripted convos, jock fight, blow up a car/cop car, shoot a ped, rat mother), HIDE HUD for clean recording, director invulnerable while filming, old 30s buffer scrub kept as one scene option. `index.html` §CINEMA MODE (was REPLAY) + §CINEMA: SCENES & STAGING; `tests/cases/cinema-mode.test.js` added. Merged to `main` as #29; suite 105/105 green on the merge.
- Radio towers (Opus 5, medium, 2026-07-24): `index.html` §RADIO TOWERS — one 132-unit guyed mast on an open parking block plus up to 7 rooftop masts on buildings ≥30 tall, red/white banded with blinking obstruction lamps (steady mid-mast markers on the big one). Fully instanced, decorative only — not added to `buildings`, so collision and stairs are untouched; `updateRadioTowers()` is called next to `updateLights()` in the main loop, outside the cinema gate. Merged to `main` as #33.
- Player-facing polish (Sonnet 5, medium, 2026-07-24): U1 story-objective HUD (find Deb / pay the debt, live distance) + Deb minimap marker and blip legend; P1 three new mission types (courier/takedown/getaway) gated by a `missionsDone` tier; J4 BRAKE/REVERSE relabel; J3 look-sensitivity slider + invert-Y and a faster low-speed car camera; P3 Easy/Normal/Hard scaling cop pressure, detection range and damage taken. See HANDOFF.md §§16–19.
- Terrain (Claude, high, 2026-07-24): hills + graded streets, landed over three passes. Final state — `groundH` is a continuous lattice: streets run level across their width and grade only along travel, each block is the bilinear patch joining its four kerb lines, signature hills sit inside a 12° grade budget. Ground and beach meshes are built on the road lattice so the drawn surface matches the field; every static reads its Y from `groundH`. Terraced pads, retaining walls and seam stairs were tried and removed — see the revision note in `TERRAIN.md`. Merged to `main` as #31; suite 99/99 green on the merge.
- Audio — weapons (Sonnet 5, medium, 2026-07-24): `WEAPON_SFX` registry — pistol crack, RPG launch/flight/boom, reload, melee (fists/baton) voices, dedicated `sfx.carBoom`.
- Audio — creatures (Sonnet 5, medium, 2026-07-24): Mama Rat screech/bite/death and stray-dog growl/bite cues, replacing reused `sfx.punch()`/`sfx.bigCrash()`.
- Audio — vehicles (Sonnet 5, high, 2026-07-24): multi-layer engine synth (sub/grit/turbo per car type, scaling with damage and boost) and a noise-fed helicopter rotor chop.
- Animation (Opus 4.8, medium, 2026-07-24): Turbo's stair-climb stride (airborne test now measured against the floor under his feet, not y=0), plus wall-ladder climbing up 12 buildings with a validated climb corridor.
- City beautification (Sonnet 5, high, 2026-07-24): 3D kerb strips, planters, awnings, street trees, café tables, pole banners — density-graded, cosmetic, seated via `groundH`.
- NPC types (Haiku 4.5, low, 2026-07-24): 303 character archetypes across 8 batches for diverse NPC spawning.
- Docs & tooling (Haiku 4.5, 2026-07-24): backlog reconciled against real code (W1), `NEXT: P2` marker (W5), fast pre-flight test tier — `tests/syntax-check.js` + `smoke.test.js` (W3), plus specs written but not implemented: economy audit (P2), onboarding controls card (U2), accessibility options (A2), brake-vs-reverse clarity (J4).
- Navigation (Claude, high, 2026-07-24): `index.html`'s `// CODE MAP` recomputed from the real banners (was ~58 lines adrift, missing 3 sections) and HANDOFF.md §5 re-synced to every banner in file order.
- Bug-fix pass (OpenCode | Kimi K2 | high, 2026-07-25): terrain-aware jump via `footGround()`, sidewalk trees, killable jocks/cops/foot-cops; `tests/cases/regression.test.js` added/extended.
- D5 Time controls (OpenCode | Kimi K2 | medium, 2026-07-25): dev-only `TIME_SCALE`/`STEP_FRAMES`, 1×/0.25×/4× hotkeys + dev-panel buttons, debug-HUD speed readout; `tests/cases/time-controls.test.js` added.
- D7 Deterministic seed (OpenCode | Kimi K2 | medium, 2026-07-25): central `_rng` with optional `?seed=<n>` mulberry32 PRNG; all `index.html` randomness routed through it; `tests/cases/deterministic-seed.test.js` added.
- J2 Hitstop + refined shake (OpenCode | Kimi K2 | medium, 2026-07-25): `HIT_STOP` freeze on big impacts, magnitude-squared camera shake with speed-sensitive decay, `SETTINGS.reduceMotion` toggle in pause settings; `tests/cases/hitstop.test.js` added.
