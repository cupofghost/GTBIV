# Terra handoff — R3 anti-stuck & spawn safety

Branch: `codex/audit-fixes-1-3-5`

Draft PR: `cupofghost/GTBIV#40`

Completed in the worktree; commit/push pending. Focused syntax and
`spawn-safety.test.js` passed 4/4. The local browser runner required loopback
server permission in this environment.

## Completed task

Implement **R3 — Anti-stuck & spawn-safety**. It is the authoritative `NEXT`
item in `HANDOFF.md` §10.

Keep the change narrow: make generic pedestrian/traffic and player-respawn
placement safe, then add a conservative recovery for Turbo when static geometry
has left him embedded. Do not refactor the collision system, terrain, missions,
or R2 pools.

## Relevant code

- `index.html` collision primitives: `buildingHit`, `rampHit`, `treeHit`,
  `propHit`, `vehicleHit`, `pedHit`, and `resolveFootCollision`.
- `index.html` spawns: `randomRoadPoint`, `spawnTraffic`, `resetPed`/
  `spawnPed`, and the post-death `respawn` callback.
- `index.html` terrain floor: `footGround`, `groundH`, `roofAt`, and
  `stairHitRun`. Read `TERRAIN.md` before changing anything that samples or
  clamps terrain height.
- Existing focused coverage: `tests/cases/terrain.test.js`,
  `tests/cases/regression.test.js`, and `tests/cases/respawn-flow.test.js`.

## Required behavior and guardrails

- Add a bounded, deterministic-safe placement helper for generic spawn points.
  It must reject a point if it is over water or overlaps static blockers:
  buildings, ramps, trees, or solid props. Do not reject ordinary road traffic
  merely because another live car/ped is nearby; that can starve city
  population under caps.
- Use the helper for `randomRoadPoint`, generic traffic intersection offsets,
  generic pedestrian sidewalk positions, and the non-custom downtown respawn
  point. After bounded retries, fall back to the existing intended location
  rather than looping or allocating more entities.
- Preserve intended special placements: custom `wasted(spot)` shore recovery,
  mission/cinematic actors, cops, pizza/Chaos cars, player-owned parked cars,
  beach/commuter lanes, roofs, stairs, ladders, and interiors must not silently
  be rerouted by the generic helper.
- The anti-stuck path is for Turbo on foot only. Detect persistent overlap with
  *static* blockers after normal `resolveFootCollision`; do not treat temporary
  contact with cars, peds, jocks, or cops as a stuck state. Require a short
  grace period, then make one small bounded recovery nudge and reseat `y` via
  `footGround`. Reset the timer as soon as he is clear.
- Do not teleport through buildings, pull Turbo off a roof/stair/ladder, or
  alter jump/bail/cinema behavior. While climbing, bailing, in a vehicle/heli,
  or replay/cutscene control, recovery must be inactive.
- Preserve R2 active-only arrays and pool behavior. Spawn validation must work
  for both newly created and recycled traffic/peds, without touching their
  pool membership or disposal rules.
- Preserve offline/zero-build behavior. Add no dependencies and do not change
  recorded-VO paths.
- `index.html` is shared: claim it in `STATUS.md`, keep the diff focused, and
  regenerate the mechanical `// CODE MAP` only if line ranges move.

## Suggested focused test

Add `tests/cases/spawn-safety.test.js` with cheap deterministic assertions:

1. The generic placement helper rejects water/static-blocker candidates and
   returns a clear bounded fallback.
2. Generic traffic and pedestrian spawns—including a recycled R2 entity—are
   not placed inside a static blocker or water.
3. A normal collision resolve clears an artificial building overlap without
   triggering the delayed recovery; a persistent static overlap triggers one
   terrain-seated, clear on-foot recovery.
4. A custom respawn spot and a climbing/bailing/cinema player do not get moved
   by the generic recovery path.

Run only `node tests/syntax-check.js` and the new focused suite. Do not run the
full suite. If the local browser shell hits its known long-run timeout, record
it rather than expanding scope.

## Completion record

Implemented bounded static/water validation for generic road, traffic, ped,
and downtown-respawn placements; preserved special paths. Added grace-timed,
single-nudge static recovery that is inactive for roof/stair/ladder/bail/cinema
states. Updated the backlog and advanced `NEXT` to A2. Commit with the required
signature, push the same branch, and update PR #40; do not open a new PR.

Signed: Codex | GPT-5 | medium
