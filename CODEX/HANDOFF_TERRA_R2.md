# Terra handoff — R2 traffic/ped pooling

Branch: `codex/audit-fixes-1-3-5`

Draft PR: `cupofghost/GTBIV#40`

Completed on `codex/audit-fixes-1-3-5`. PR #40 had no reviewer feedback before
implementation; its CI was in progress at claim time. The focused syntax check
and `traffic-pooling` suite passed after the implementation.

## Delivered

**R2 — Pool traffic / peds instead of churning them** is complete. The
authoritative `NEXT` item in `HANDOFF.md` §10 is now R3.

The goal is to recycle generic civilian traffic and pedestrians instead of
destroying their meshes and allocating replacements. Keep the change narrowly
inside the existing car/ped lifecycle; do not refactor unrelated AI, missions,
or the Three.js scene.

## Relevant code

- `index.html` `CARS`: `makeCar`, `spawnTraffic`, and the `traffic`/`cars`
  arrays.
- `index.html` `PEDESTRIANS`: `spawnPed` and the `peds` array.
- `killCar()` removes civilian traffic and schedules a replacement.
- `updatePeds()` removes downed peds and spawns a replacement.
- `trimToCaps()` removes excess entities on an F3 quality downshift.
- `updateTraffic()` and `updatePeds()` are the active-array consumers.

## Required behavior and guardrails

- Add bounded free-lists for *generic* traffic and pedestrians. Reuse a hidden
  mesh/object by fully resetting its position, terrain height, rotation,
  physics/AI timers, appearance state, and active-array membership.
- Pooling must not call `disposeMesh`; it is for temporary reuse. Keep R1's
  permanent-disposal behavior for entities that are genuinely gone.
- Coordinate with `TRAFFIC_CAP`/`PED_CAP`: quality downshifts should pool the
  trimmed generic entities instead of disposing them. Do not let a pool grow
  without a modest cap.
- Keep `cars`, `traffic`, and `peds` as active-only arrays. A pooled entity must
  be hidden, absent from those arrays, and unable to update/collide/render.
- Do not pool special mission/cinematic/cop/pizza/Chaos vehicles or staged
  cinema actors. A destroyed traffic car referenced by `mission.car` must stay
  dead until that mission resolves; never recycle that object underneath the
  mission reference.
- Preserve the ownerless-dog rule exactly: when a downed ped leaves play, its
  dog becomes an internal stray via `makeStray(...,{orphaned:true})`. Clear the
  pooled ped's dog/DOM-bubble/partner references so no revived ped inherits a
  dog or UI from a prior owner.
- Preserve offline, zero-build behavior. Do not add dependencies or change
  recorded-VO paths.
- `index.html` is shared: claim it in `STATUS.md`, keep the diff focused, and
  regenerate the mechanical `// CODE MAP` only if its ranges move.

## Suggested focused test

Add `tests/cases/traffic-pooling.test.js` that proves, without relying on
timing-heavy soak tests:

1. A generic traffic despawn is removed from active arrays, hidden, and later
   reused without growing the pool or creating a new mesh.
2. A downed generic ped transitions its dog to the stray population and a
   reused ped has no stale dog/bubble/partner state.
3. `trimToCaps()` honors F3 caps while pooled entities remain inactive.
4. A mission-target traffic car is not reused before `mission` clears.

Run only `node tests/syntax-check.js` and the new focused suite. Do not rerun
the full suite. If the local browser shell hits its known long-run timeout,
record it rather than expanding scope.

## Validation

Ran only `node tests/syntax-check.js` and `node tests/run.js traffic-pooling`.
The focused suite covers traffic mesh reuse, ped dog/UI/link cleanup, F3 caps,
and mission-target non-reuse. No dependencies or VO paths changed.

Signed: Codex | GPT-5 | high
