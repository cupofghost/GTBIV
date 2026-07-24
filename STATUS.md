# STATUS

Last consolidation: 2026-07-24 — Signed: Claude Code | Sonnet 5 | medium

## Active work
| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|
| 2026-07-24 | terrain / `index.html`, `tests/cases/terrain.test.js`, `tests/cases/new-features.test.js` | Implemented TERRAIN.md Tier 0 (re-seated ~25 `y=0` statics onto `groundH`) + Tier 1. Full suite green 55/55. Done. | Signed: Claude Code \| Claude \| high |
| 2026-07-24 | terrain / `index.html`, `tests/cases/terrain.test.js` | Follow-up: owner reported streets tilting sideways off the earlier continuous relief. Replaced it with a terraced block/road lattice — each block is a flat plateau, each street grades linearly only along its own direction of travel (verified numerically, <0.01u sideways tilt), intersections are flat. Added retaining-wall curb geometry for small pad/street gaps and real climbable stair/ramp meshes for gaps >1.5u. Full suite green 55/55. Done. | Signed: Claude Code \| Claude \| high |
| 2026-07-24 | Audio / `index.html` engine synth | Done. Multi-layer engine synth: sub-rumble + mechanical grit + turbo whine/blow-off layers added alongside the existing tone osc, all per-car-type (`CARTYPES[*].snd.sub/grit/turbo`). Grit+misfire pop scale with car damage; turbo whine spools with revs/boost and dumps on lift. All 9 car types re-tuned for rumbly-vs-shrill variety. Verified headless (layer values respond to damage/boost/exit) + full 49-test suite green. | Signed: Claude Code | Sonnet 5 | high |
| 2026-07-24 | index.html (updateFoot), js/person.js | Turbo stair-climb animation: fixed airborne test (was absolute, now vs ground) so elevated stairs/roofs no longer force jump pose; added high-knee stepping cycle. Done. | Claude Code \| Opus 4.8 \| medium |
| 2026-07-24 | index.html (LADDERS builder, updateClimb/mountLadder, updateFoot, doJump) | Wall-ladder climbing: bolt-on steel ladders up 12 buildings; walk into the base to grab, W/S to climb, top out on the roof, jump to bail. Hand-over-hand animation (reuses knee pivots). Placement now validates a clear climb corridor (buildings/trees/props/ramps/stairs) and tries all 4 walls. Done. | Claude Code \| Opus 4.8 \| medium |

## Shared-file touches
- `index.html` — terrain/groundH rework touches many systems (buildings, rail, pizza/chaos HQs, heli, camera, mission beacons, Deb). See Active work row above. — Signed: Claude Code | Claude | high
- js/person.js — expose knee pivots (kneeL/kneeR) in userData so limbs can bend for climbing; purely additive. Signed: Claude Code | Opus 4.8 | medium

## Known issues
- Duplicate `## 10.` heading in HANDOFF.md: "10. Suggested Order of Work" (line ~1202) and "10. Changelog — polish pass (Kimi3, 2026-07-22)" (line ~1256) share a number — pre-existing, predates this consolidation (confirmed present as of commit `9f4e220`). Cosmetic only (doesn't break the NEXT-marker workflow), left unrenumbered pending Austin's OK to touch another agent's changelog section. — 2026-07-24, Sonnet 5

## Archive
2026-07-24 | NPC types — Batches 1–8 | Created 303 total character types across 8 batches: workers, professionals, styles, service, entertainment, tech, creative, transport, health, media, design, wellness, hobbies, subculture, outdoor, music, gaming, cultural, martial, fashion, academic. Comprehensive system for diverse NPC spawning. | Signed: Claude Code | Haiku 4.5 | low
- W1 (Claude Haiku 4.5, 2026-07-24): Reconciled HANDOFF.md backlog against actual code — 14 cards marked DONE, 15 marked OPEN, §10 order list corrected.
- W2 (Claude Haiku 4.5, 2026-07-24): Added 53-section code map to index.html for fast navigation.
- W5 (Claude Haiku 4.5, 2026-07-24): Added `NEXT: P2` marker at top of HANDOFF.md §10.
- W3 (Claude Haiku 4.5, 2026-07-24): Added fast pre-flight test tier — `tests/syntax-check.js` (~25ms) + `tests/cases/smoke.test.js`, wired into `tests/run.js` ahead of the full suite.
- P2 (Claude Haiku 4.5, 2026-07-24): Economy audit in HANDOFF.md — documented all money sources/sinks and playthrough-to-$800 estimate; tuning itself not yet done.
- U2 (Claude Haiku 4.5, 2026-07-24): Onboarding controls-card UI/UX spec written in HANDOFF.md; not yet implemented.
- A2 (Claude Haiku 4.5, 2026-07-24): Accessibility options spec (reduce motion, high-contrast HUD, colorblind modes) written in HANDOFF.md; not yet implemented.
- J4 partial (Claude Haiku 4.5, 2026-07-24): Brake-vs-reverse UI clarity spec written in HANDOFF.md (dead-zone half was already done pre-session); not yet implemented.
2026-07-24 | City beautification / index.html (~line 3708-3910) | Added 3D curb strips (dark grey), curbside planters, storefront awnings (box/wedge, varied size), sidewalk street trees, café tables+umbrellas outside some storefronts, and banner flags on streetlight poles. All density-graded (downtown denser, outer city sparser), cosmetic only, seated via groundH per TERRAIN.md invariant, no collision added. | Signed: Claude Code | Sonnet 5 | high
