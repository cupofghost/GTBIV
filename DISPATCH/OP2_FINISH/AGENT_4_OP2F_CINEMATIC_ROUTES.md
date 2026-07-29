# Agent 4 — OP2-F: planned cinematic camera routes

**Model:** Opus 5 · **Effort:** high · **Branch:** `claude/op2f-cinematic-routes`
**Card:** `HANDOFF.md` Phase 11 → OP2-F (`P0 · Risk: High`)
**Signature:** `Signed: Claude Code | Opus 5 | high`

## Owner report

> Some Cinema scenes still send the camera through terrain. The intro route
> avoids more collisions but looks reactive and janky instead of moving like a
> movie camera.

## Read first

`AGENTS.md`, `STATUS.md`, then `index.html` §ANIMATED INTRO (~8937) with
`flySample()` (~8996), §CINEMA MODE (~10031), §CINEMA: SCENES & STAGING
(~10164) with `updateCinemaCam()` (~10146) and `updateCinemaIntro()` (~10208),
and `tests/cases/intro-camera.test.js` + `cinema-mode.test.js`. Skim
`TERRAIN.md` for what `groundH` guarantees — do not modify it.

## Approach

Replace the last-moment collision shoves with a small **deterministic route
planner** shared by the intro and the applicable live Cinema shots:

1. Build a few candidate elevated waypoints around the intervening building
   AABBs.
2. Reject any segment that violates building or `groundH` clearance —
   including interpolated curve samples, not just the endpoints.
3. Choose a short clear route.
4. Travel it on a smooth spline with an eased speed profile.
5. Smooth the look-at target **separately**, so framing does not snap when the
   path bends.

Prefer intentional arcs, cranes and reveals. If no cinematic route is valid,
**cut to a known-safe shot** rather than scraping along geometry. Keep the Deb
shots terrain-safe and leave replay and free-fly behavior working as they do
today. Everything must run off the shared `_rng` so the same seed gives the
same route.

## Acceptance

- Across representative deterministic seeds and every staged scene, dense path
  sampling stays above terrain and outside buildings.
- Speed, acceleration and look direction show no abrupt
  collision-correction spikes.
- The intro reads as one planned movie move, not a reaction to obstacles.
- Replay scrub, free-fly and HIDE HUD still work; director invulnerability
  during filming is unchanged.

## Tests

Add `tests/cases/cinema-routes.test.js`: for each staged scene across several
seeds, sample the planned path densely and assert building/`groundH` clearance
plus bounded first and second derivatives of position and look direction
(that is what "no correction spikes" means numerically).

```bash
cd tests && node syntax-check.js && node run.js cinema-routes && node run.js intro-camera
```

Then watch the intro and every staged scene end to end. **Numeric safety is
explicitly not sufficient for this card** — the owner's complaint is that it
looks janky, so report what it looks like now.

## Out of scope

Scene *content* owned by other agents (explosion visuals, melee poses, mission
UI), `groundH`, traffic, and any other OP2 card. If a scene looks wrong because
of an effect another agent is rewriting, note it and move on.

## Done

Update your `STATUS.md` row to DONE in ≤3 lines, push
`-u origin claude/op2f-cinematic-routes`, and report your commit hash, test
results, and your visual verdict on the intro.
</content>
