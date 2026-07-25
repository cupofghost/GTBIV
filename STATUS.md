# STATUS

Last consolidation: 2026-07-24 (fourth pass — after radio towers (#33) and Cinema Mode (#29) landed on `main`; docs/bookkeeping only) — Signed: Claude Code | Opus 5 | high

## Active work
_Nothing claimed right now._ Add your row below per AGENTS.md §1.3 — and escape
the pipes in your signature as `\|`, or the table breaks.

| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|
| 2026-07-25 | `index.html` (ANIMATED INTRO, CINEMA flythrough + free-fly floor), `tests/cases/intro-camera.test.js` | Intro camera under terrain — DONE. `flySample()` clamps flythrough cam + look target above `groundH`; free-fly floor now terrain-aware. New suite 3/3 + cinema 6/6 + boot 3/3 green. | Signed: Kimi \| K3 \| medium |
| 2026-07-25 | `index.html` (controls card UI, pause menu, save blob), `tests/cases/controls-card.test.js` | U2 onboarding controls card — DONE. First-boot modal w/ TOUCH/DESKTOP tabs, `controlsCardSeen` in save blob, pause HOW TO PLAY recall (replaced old `pmHow` panel). CODE MAP regenerated. New suite 5/5 + save-restore + boot green. | Signed: Kimi \| K3 \| medium |
| 2026-07-25 | `index.html` (economy / addMoney / mission rewards / heist / stickup), `tests/cases/economy.test.js` | P2 Economy & debt-loop tuning — DONE. Heist loot $250–$500 (+$150 escape), stickup $45–$90, store robbery $150–$260, delivery base $140, pizza base $55; raw payouts now route through `addMoney` for save + feedback; big toasts use gold class / longer duration. New economy suite 6/6 green; regression + mission-variety green. | Signed: OpenCode \| Kimi K2 \| high |

## Shared-file touches
Standing list of what's hot. If you must edit one of these, make the smallest
possible change and add a line here.
- `index.html` — the whole game. Hot spots, in order of how often they conflict: the AUDIO section (the `let AC=null,…` declaration line and the `exitCarSoft()` reset block each grow a variable every time someone adds a sound layer), `updateFoot`, and the terrain/ground block (`groundH`, `terrainLines`/`terrainGeo`) — terrain is settled as of #31, so read `TERRAIN.md` before reopening it.
- `index.html`'s `// CODE MAP` comment block — its line ranges go stale the moment anyone inserts code. It is mechanical to regenerate from the section banners; don't hand-edit the numbers.
- `HANDOFF.md` — §5 code map and §8 backlog get edited by most sessions; edit the row, not the structure.
- `TERRAIN.md` — the terrain contract. Read the Tier 1 revision note before touching `groundH`.
- `js/person.js` — shared rig; additions must stay backward-compatible (limbs are read by several animation paths).
- 2026-07-25 (Kimi): `index.html` — added `CONTROLS CARD (U2 onboarding)` section + `#controlsCard` markup/styles, removed the `pmHow` pause panel (HOW TO PLAY now opens the card), touched the save blob (`controlsCardSeen`) and `lookSkip`'s selector. CODE MAP regenerated from banners after the insert.
- 2026-07-25 (Kimi): `index.html` — added `flySample()` to ANIMATED INTRO (terrain clamp for the flythrough cam + look target) and used it in CINEMA's `updateCinemaIntro` too; changed Cinema Mode's free-fly floor in `cinemaCamStep` from absolute `0.5` to `groundH+0.5` (owner-reported bug class: cameras under the hills — Cinema is Opus's area, change is one line, flagged here). CODE MAP regenerated again.
- 2026-07-25 (OpenCode): `index.html` — P2 economy tuning touched `addMoney()` (HUD/TOASTS), stickup (WEAPONS), store robbery + heist escape (STORY), heist safe crack (DAY/NIGHT), delivery reward (MISSIONS), and `PIZZA_DELIVERY_REWARD`. `// CODE MAP` regenerated from real banners after the inserts.

## Known issues
- ~~PII in the docs~~ **RESOLVED — owner's decision, 2026-07-24:** the owner's first name in `HANDOFF.md`/`GAME_PLAN.md`/`ASSETS.md`/`STORY_BIBLE.md`/`CHARACTERS.md` is fine and does not need scrubbing. Do not re-flag it. The rest of AGENTS.md §3 still applies in full — no surnames, emails, phone numbers, addresses, other-platform usernames, or credentials of any kind. Latest scan found none of those. — 2026-07-24, Claude
- Duplicate `## 10.` heading in HANDOFF.md ("Suggested Order of Work" and "Changelog — polish pass (Kimi3)"). Still open: renumbering the duplicate cascades through §§11–15 and every cross-reference to them, so it is not the one-line fix it looks like. Cosmetic only — the NEXT-marker workflow is unaffected. Leave it unless the owner asks. — 2026-07-24, Claude
- Park knolls keep ~0.15u of sag between the drawn lawn and `groundH` (a dome sampled every ~3u). Harmless at that size; only worth revisiting if props on a knoll ever look sunk. — 2026-07-24, Claude
- `tests/cases/save-restore.test.js` (and later files in a long run) time out loading the page in the local Playwright Chromium headless shell, with GPU stall warnings in the browser log. The same suite runs fine in other contexts; appears environmental. Syntax check, economy suite, regression, and mission-variety all pass. — 2026-07-25, OpenCode

## Archive
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
