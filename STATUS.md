# STATUS

Last consolidation: (never)

## Active work
| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|
| 2026-07-24 | terrain / `index.html`, `tests/cases/terrain.test.js`, `tests/cases/new-features.test.js` | Implemented TERRAIN.md Tier 0 (re-seated ~25 `y=0` statics onto `groundH`) + Tier 1. Full suite green 55/55. Done. | Signed: Claude Code \| Claude \| high |
| 2026-07-24 | terrain / `index.html`, `tests/cases/terrain.test.js` | Follow-up: owner reported streets tilting sideways off the earlier continuous relief. Replaced it with a terraced block/road lattice — each block is a flat plateau, each street grades linearly only along its own direction of travel (verified numerically, <0.01u sideways tilt), intersections are flat. Added retaining-wall curb geometry for small pad/street gaps and real climbable stair/ramp meshes for gaps >1.5u. Full suite green 55/55. Done. | Signed: Claude Code \| Claude \| high |

## Shared-file touches
- `index.html` — terrain/groundH rework touches many systems (buildings, rail, pizza/chaos HQs, heli, camera, mission beacons, Deb). See Active work row above. — Signed: Claude Code | Claude | high

## Known issues
(one line each: what, where, date noticed, signature)

## Archive
(completed entries moved here during consolidation — one line each)
