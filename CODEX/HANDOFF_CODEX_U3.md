# Codex handoff — U3 respawn flow

Branch: `codex/audit-fixes-1-3-5`

Draft PR: `cupofghost/GTBIV#40`

## Completed

- U3 recovery now saves the BUSTED fine and WASTED hospital bill immediately,
  before the `G.over` respawn lock can suppress an unload-time save.
- Both outcomes clear heat, stars, and every pursuit timer before recovery.
- The existing downtown respawn remains terrain-seated, healthy, on foot, with
  a nearby sedan; focused coverage asserts that state.

## Validation

- `node tests/syntax-check.js`: PASS.
- `node tests/run.js respawn-flow`: PASS (2/2).

## Next step

PR #40 had no failing CI checks or reviewer feedback before this U3 pass.
Push this commit to the same draft PR, then recheck its CI. The next backlog
card is R2 (traffic/ped pooling); it is larger than this focused fix, so claim
it separately only after PR #40 is clean.
