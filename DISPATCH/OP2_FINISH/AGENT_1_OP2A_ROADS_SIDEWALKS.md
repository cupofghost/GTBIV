# Agent 1 — OP2-A: road and sidewalk visual integrity

**Model:** Sonnet 5 · **Effort:** high · **Branch:** `claude/op2a-roads-sidewalks`
**Card:** `HANDOFF.md` Phase 11 → OP2-A (`P1 · Risk: Med`)
**Signature:** `Signed: Claude Code | Sonnet 5 | high`

## Owner report

> Manhole covers and center-road stripes look like trash-quality zoomed-in
> assets; some sidewalks do not follow terrain and hang in the air.

## Read first

- `AGENTS.md`, `STATUS.md` (claim your row), then this brief.
- **`TERRAIN.md` — mandatory before touching anything terrain-seated.** Read
  the Tier 1 revision note. `groundH` is settled and is not yours to change.
- `index.html` §CITY (~1627) — street/marking construction, manhole placement
  (~1728, ~1837), kerb strips.
- `index.html` §SIDEWALKS & STOREFRONT AWNINGS (~4621) and §MORE CITY
  BEAUTIFICATION (~4730) — the sidewalk slabs and their dressing.

## Approach

**Markings.** Make road markings world-scale geometry/materials with a
consistent lane width, dash length, gap spacing, edge softness and orientation.
The current marks read as stretched or camera-scale. Pick one set of real-world
dimensions, derive every stripe from it, and align dashes along the street's
travel direction so they stay straight across graded runs.

**Manholes.** Rebuild the covers at believable street scale: a clean circular
rim, an inset lid, a restrained surface pattern. No oversized or blurry texture
treatment. Keep them where they are — the rat system reads manhole positions
(`index.html` §SEWER RATS ~7965, §MAMA RAT ~8082), so **do not move, rename or
change the count of the manhole records**. Geometry and material only.

**Sidewalks.** Seat every sidewalk vertex/segment from `groundH` at its own
world position instead of sampling one height for a long slab. A slab that
spans a grade must follow the grade. Keep sidewalks non-colliding exactly as
they are now — this is a visual conformance fix and is **not** permission to
add kerb collision or change ped/spawn pathing.

## Acceptance

- At walking and driving camera distances, stripes and covers look correctly
  scaled and stable — no shimmer, no stretch, no zoomed-asset look.
- No sidewalk edge visibly floats above or dives under a slope or knoll.
- Road and sidewalk seams stay closed; no new gaps at intersections.
- Turbo, cars, NPCs and spawns behave exactly as before.

## Tests

Add `tests/cases/road-sidewalk.test.js`: with a fixed seed, sample sidewalk
segment vertices against `groundH` at their own X/Z and assert the deviation
stays inside a tight bound on flat, graded and knoll-adjacent streets; assert
manhole count and positions are unchanged from the pre-change values.

```bash
cd tests && node syntax-check.js && node run.js road-sidewalk
```

Then inspect representative flat, graded and knoll-adjacent streets yourself
and report what you saw. Numbers alone do not close this card — it is a
looks-wrong complaint.

## Out of scope

`groundH` and the terrain lattice, kerb collision, vehicles, characters, HUD,
the code map's line numbers, and any other OP2 card.

## Done

Update your `STATUS.md` row to DONE in ≤3 lines, commit (one line what, one
line why, plus signature), push `-u origin claude/op2a-roads-sidewalks`, and
report your commit hash, test result, and what you verified by eye.
</content>
