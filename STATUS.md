# STATUS

Last consolidation: 2026-07-24 (second pass) — Signed: Claude Code | Claude | high

## Active work
| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|
| _(none — everything below is archived; claim your area here before you start)_ | | | |

## Shared-file touches
Standing list of what's hot. If you must edit one of these, make the smallest
possible change and add a line here.
- `index.html` — the whole game. Currently hottest: the terrain/ground block (`groundH`, `terrainLines`/`terrainGeo`), the AUDIO section (`let AC=null,…` declaration line and the `exitCarSoft()` reset block both grow a variable every time someone adds a sound layer — merge conflicts land there), and `updateFoot`.
- `HANDOFF.md` — §5 code map and §8 backlog get edited by most sessions; edit the row, not the structure.
- `TERRAIN.md` — the terrain contract. Read the Tier 1 revision note before touching `groundH`.
- `js/person.js` — shared rig; additions must stay backward-compatible (limbs are read by several animation paths).

## Known issues
- ~~PII in the docs~~ **RESOLVED — owner's decision, 2026-07-24:** the owner's first name in `HANDOFF.md`/`GAME_PLAN.md`/`ASSETS.md`/`STORY_BIBLE.md`/`CHARACTERS.md` is fine and does not need scrubbing. Do not re-flag it. The rest of AGENTS.md §3 still applies in full — no surnames, emails, phone numbers, addresses, other-platform usernames, or credentials of any kind. Latest scan found none of those. — 2026-07-24, Claude
- Duplicate `## 10.` heading in HANDOFF.md ("Suggested Order of Work" and "Changelog — polish pass (Kimi3)"). Still open: renumbering the duplicate cascades through §§11–15 and every cross-reference to them, so it is not the one-line fix it looks like. Cosmetic only — the NEXT-marker workflow is unaffected. Leave it unless the owner asks. — 2026-07-24, Claude
- Park knolls keep ~0.15u of sag between the drawn lawn and `groundH` (a dome sampled every ~3u). Harmless at that size; only worth revisiting if props on a knoll ever look sunk. — 2026-07-24, Claude

## Archive
- Terrain (Claude, high, 2026-07-24): hills + graded streets, landed over three passes. Final state — `groundH` is a continuous lattice: streets run level across their width and grade only along travel, each block is the bilinear patch joining its four kerb lines, signature hills sit inside a 12° grade budget. Ground and beach meshes are built on the road lattice so the drawn surface matches the field; every static reads its Y from `groundH`. Terraced pads, retaining walls and seam stairs were tried and removed — see the revision note in `TERRAIN.md`. Suite 70/70.
- Audio — weapons (Sonnet 5, medium, 2026-07-24): `WEAPON_SFX` registry — pistol crack, RPG launch/flight/boom, reload, melee (fists/baton) voices, dedicated `sfx.carBoom`.
- Audio — creatures (Sonnet 5, medium, 2026-07-24): Mama Rat screech/bite/death and stray-dog growl/bite cues, replacing reused `sfx.punch()`/`sfx.bigCrash()`.
- Audio — vehicles (Sonnet 5, high, 2026-07-24): multi-layer engine synth (sub/grit/turbo per car type, scaling with damage and boost) and a noise-fed helicopter rotor chop.
- Animation (Opus 4.8, medium, 2026-07-24): Turbo's stair-climb stride (airborne test now measured against the floor under his feet, not y=0), plus wall-ladder climbing up 12 buildings with a validated climb corridor.
- City beautification (Sonnet 5, high, 2026-07-24): 3D kerb strips, planters, awnings, street trees, café tables, pole banners — density-graded, cosmetic, seated via `groundH`.
- NPC types (Haiku 4.5, low, 2026-07-24): 303 character archetypes across 8 batches for diverse NPC spawning.
- Docs & tooling (Haiku 4.5, 2026-07-24): backlog reconciled against real code (W1), `NEXT: P2` marker (W5), fast pre-flight test tier — `tests/syntax-check.js` + `smoke.test.js` (W3), plus specs written but not implemented: economy audit (P2), onboarding controls card (U2), accessibility options (A2), brake-vs-reverse clarity (J4).
- Navigation (Claude, high, 2026-07-24): `index.html`'s `// CODE MAP` recomputed from the real banners (was ~58 lines adrift, missing 3 sections) and HANDOFF.md §5 re-synced to every banner in file order.
