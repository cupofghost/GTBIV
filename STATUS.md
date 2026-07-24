# STATUS

Last consolidation: 2026-07-24 — Signed: Claude Code | Opus 4.8 | high

## Active work
| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|

## Shared-file touches
- (none open — `index.html` verified coherent at the 2026-07-24 consolidation; full suite green 62/62)

## Known issues
- Duplicate `## 10.` heading in HANDOFF.md: "10. Suggested Order of Work" (line ~1202) and "10. Changelog — polish pass (Kimi3, 2026-07-22)" (line ~1256) share a number — pre-existing, predates this consolidation (confirmed present as of commit `9f4e220`). Cosmetic only (doesn't break the NEXT-marker workflow), left unrenumbered pending Austin's OK to touch another agent's changelog section. — 2026-07-24, Sonnet 5

## Archive
- 2026-07-24 | Cinema mode / `index.html` + `tests/cases/cinema-mode.test.js` | Replay screen grown into Cinema Mode: live free-fly director over the running world + scene dropdown (Intro flythrough, 4 scripted convos, Jock Fight, Blow Up a Car / Cop Car, Shoot a Pedestrian, Rat Mother, old Replay-last-30s scrub) + HIDE HUD toggle (SHOW BAR pill) for clean recording; director invulnerable while filming. 6 new tests, full suite green 62/62. | Signed: Claude Code | Opus 4.8 | high
- 2026-07-24 | Terrain TERRAIN.md Tier 0+1 / `index.html` + terrain/new-features tests | Re-seated ~25 `y=0` statics onto `groundH`; replaced continuous relief with a terraced block/road lattice (flat plateaus, streets grade only along travel <0.01u sideways tilt, flat intersections); curb retaining walls + climbable stair/ramp meshes for gaps >1.5u. | Signed: Claude Code | Claude | high
- 2026-07-24 | Audio engine synth / `index.html` | Multi-layer per-car engine synth (sub-rumble + mechanical grit + turbo whine/blow-off) alongside the tone osc; grit/misfire scale with damage, turbo spools with revs/boost and dumps on lift; all 9 car types re-tuned. | Signed: Claude Code | Sonnet 5 | high
- 2026-07-24 | Turbo stair-climb anim / `index.html` (updateFoot), `js/person.js` | Fixed airborne test (now vs ground) so elevated stairs/roofs no longer force the jump pose; added high-knee stepping cycle. | Signed: Claude Code | Opus 4.8 | medium
- 2026-07-24 | Wall-ladder climbing / `index.html` | Bolt-on steel ladders up 12 buildings; walk into the base to grab, W/S climb, top out on the roof, jump to bail; hand-over-hand anim (reuses knee pivots); placement validates a clear climb corridor across all 4 walls. | Signed: Claude Code | Opus 4.8 | medium
- 2026-07-24 | NPC types — Batches 1–8 | Created 303 character types across 8 batches (workers, professionals, styles, service, entertainment, tech, creative, transport, health, media, design, wellness, hobbies, subculture, outdoor, music, gaming, cultural, martial, fashion, academic). | Signed: Claude Code | Haiku 4.5 | low
- W1 (Claude Haiku 4.5, 2026-07-24): Reconciled HANDOFF.md backlog against actual code — 14 cards marked DONE, 15 marked OPEN, §10 order list corrected.
- W2 (Claude Haiku 4.5, 2026-07-24): Added 53-section code map to index.html for fast navigation.
- W5 (Claude Haiku 4.5, 2026-07-24): Added `NEXT: P2` marker at top of HANDOFF.md §10.
- W3 (Claude Haiku 4.5, 2026-07-24): Added fast pre-flight test tier — `tests/syntax-check.js` (~25ms) + `tests/cases/smoke.test.js`, wired into `tests/run.js` ahead of the full suite.
- P2 (Claude Haiku 4.5, 2026-07-24): Economy audit in HANDOFF.md — documented all money sources/sinks and playthrough-to-$800 estimate; tuning itself not yet done.
- U2 (Claude Haiku 4.5, 2026-07-24): Onboarding controls-card UI/UX spec written in HANDOFF.md; not yet implemented.
- A2 (Claude Haiku 4.5, 2026-07-24): Accessibility options spec (reduce motion, high-contrast HUD, colorblind modes) written in HANDOFF.md; not yet implemented.
- J4 partial (Claude Haiku 4.5, 2026-07-24): Brake-vs-reverse UI clarity spec written in HANDOFF.md (dead-zone half was already done pre-session); not yet implemented.
- 2026-07-24 | City beautification / index.html (~line 3708-3910) | 3D curb strips, curbside planters, storefront awnings, sidewalk street trees, café tables+umbrellas, banner flags on streetlight poles — all density-graded, cosmetic, seated via groundH, no collision. | Signed: Claude Code | Sonnet 5 | high
