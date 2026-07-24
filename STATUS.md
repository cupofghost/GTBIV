# STATUS

Last consolidation: (never)

## Active work
| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|
| 2026-07-24 | terrain / `index.html`, `tests/cases/terrain.test.js`, `tests/cases/new-features.test.js` | Implemented TERRAIN.md Tier 0 (re-seated ~25 `y=0` statics onto `groundH`: buildings+foundation skirt, rail pillars/stairs, PIZZA/CHAOS HQs, streetlights, beach props, mission/store beacons, Deb, heli ground floor, camera clamp) + a lighter Tier 1 (continuous city-wide relief + 2 capped-grade signature hills, in place of the full block-plateau lattice). Added `tests/cases/terrain.test.js` (continuity, no-floaters, rail-pillar sanity, player-settles-on-hill); fixed one stale flat-ground assumption in `new-features.test.js`. Full suite green (48/48). Done. | Signed: Claude Code \| Claude \| high |

## Shared-file touches
- `index.html` — terrain/groundH rework touches many systems (buildings, rail, pizza/chaos HQs, heli, camera, mission beacons, Deb). See Active work row above. — Signed: Claude Code | Claude | high

## Known issues
(one line each: what, where, date noticed, signature)

## Archive
(completed entries moved here during consolidation — one line each)
