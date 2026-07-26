# Agent 2 — OP2-A Roads, Manholes, and Sidewalks

```text
Required model: gpt-5.6-sol
Required reasoning effort: high
Required branch: codex/op2-road-sidewalk
Required base: commit 1abc365 or a descendant

Implement HANDOFF.md task OP2-A — Road and sidewalk visual integrity.

START
1. Verify `git merge-base --is-ancestor 1abc365 HEAD` succeeds and the worktree
   starts clean. Stop if it does not.
2. Read AGENTS.md, STATUS.md, TERRAIN.md, and HANDOFF.md OP2-A.
3. Claim OP2-A in STATUS.md using:
   Signed: Codex | GPT-5.6 | high
4. Stay inside road markings, manholes, sidewalk geometry, focused tests, and
   your STATUS row. Do not edit HANDOFF.md or CODEX/OP2_CONCURRENT/.

OWNER PROBLEMS
- Center-road stripes look like extremely zoomed-in low-quality assets.
- Manhole covers look incorrectly scaled and low quality.
- Some sidewalk slabs do not follow terrain and hang in the air.

WORK
- Make road stripes world-scale geometry/materials with consistent width, dash
  length, spacing, orientation, and restrained edge softness.
- Ensure markings are not stretched or camera-scale-dependent.
- Rebuild manhole covers at believable street scale with a circular rim, inset
  lid, restrained readable surface pattern, and no oversized blurry treatment.
- Seat sidewalks from groundH at each relevant vertex/segment rather than one
  sample for a long slab.
- Keep road/curb/sidewalk seams visually closed on slopes.
- Preserve sidewalks as non-colliding visual geometry. Do not add curb
  collision.
- Do not alter the groundH contract, terrain grades, spawn behavior, traffic,
  or building footprints.
- Reuse geometry/materials and preserve mobile performance.

ACCEPTANCE
- Stripes and covers look normally scaled from foot and driving cameras.
- No sidewalk edge floats or dives under graded terrain/knolls.
- No new collision or spawn behavior.
- Add a deterministic geometry/terrain-conformance check.
- Run syntax and terrain-focused tests once at the end.
- Capture flat-street, slope, intersection, and knoll-adjacent screenshots.

FINISH
- Update your STATUS row with the exact result.
- Scan the diff for secrets/PII.
- Commit once with an imperative subject and:
  Signed: Codex | GPT-5.6 | high
- Push only the feature branch and open a draft PR if available; never merge.
- Report commit hash, touched files, tests, screenshots, uncertainties, and
  the consolidation check.
```
