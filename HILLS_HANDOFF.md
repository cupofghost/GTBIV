# Hills Handoff — start here for the terrain-relief pass

> **You are picking up:** giving *Grand Turbo Boost IV* real terrain — rolling
> relief and **streets with grade** — without floating the city or breaking the
> collision model. The scary-sounding groundwork is already done; this is now a
> bounded, testable job.
>
> **Read in this order:** (1) this file, (2) `TERRAIN.md` for the full analysis
> and the *why*, (3) `HANDOFF.md` §2 Golden Rules + §3 How to Run. Don't skip the
> golden rules — zero-build, vendored Three.js r128, one file.

---

## 0. The one rule you cannot break

`groundH(x, z)` (`index.html:1169`) is a **single-valued, continuous height
field** — exactly one ground height per column. Every moving thing already reads
its Y from it. Your job is to make it *interesting*, not to make it return two
values. Stacked drivable surfaces (garage decks) are a **separate** system that
rides on top via the resolver (§4); they are NOT how you add hills. If you find
yourself wanting `groundH` to return two heights for one `(x,z)`, stop — that's
the rewrite `TERRAIN.md` says to avoid.

---

## 1. What already shipped (build on this — don't redo it)

**Tier 0 (grade-ready seating) + Tier 3a (surface resolver) are done and tested**
(`tests/cases/terrain.test.js`, 4 cases; full suite green). Specifically:

- **`supportY(x,z,curY,opt)`** (`index.html:2072`) — the single "what floor is
  under me?" function. Returns the highest of {terrain `groundH`, building roof,
  stair run, registered decks} at/just below `curY`. Foot movement
  (`index.html:5120`) and parachute/fall (`index.html:4096`) both route through
  it. This is behaviour-identical to the old hand-rolled pick (there's a
  regression test proving it).
- **`registerSurface(s)` + `DECK_SURFACES`** (`index.html:2069`) — the extension
  point for garage decks (Tier 3b), unused for now. Ignore for hills.
- **Buildings seat on the ground.** `addBuilding` computes `b.baseY` =
  min `groundH` over the footprint (`index.html:1214`); bodies, roofs
  (`roofAt` returns `baseY+h`), crowns, parapet lips, AC/water-tank/antenna
  clutter, and a **foundation skirt** (4u apron, buried on flat ground) all
  offset by `baseY`. On today's flat map every `baseY===0`, so nothing moved —
  it's pure grade-ready plumbing. **When you raise terrain, buildings follow
  automatically.**
- **Rail pillars** stretch from `groundH` up to the beam (`index.html:1842`).
- **Pizza place & Chaos Pizza** exteriors seat on `groundH` (`3374`, `2739`).
- **Foot camera floor clamp** is now `groundH`-relative (`6191`).
- **Cars** already settle to `groundH` and pitch with the slope at runtime
  (`index.html:4940`) — parked and moving alike. No work needed.

## 2. Tier 0 loose ends to finish FIRST (so nothing floats when you raise ground)

These are still seated at absolute `y=0` because they live in the football park
or on sidewalks — fine today (flat), wrong the moment those spots get relief.
Knock them out before or alongside Tier 1:

- **Football field props** — `FOOTBALL` builder (`index.html:1759`+): goalposts,
  bleachers, scoreboard pole. Add a `baseY = groundH(field center)` and offset
  them (same pattern as buildings). The turf itself is painted into the ground
  texture, so it drapes for free.
- **Building stair runs / fire escapes** — `STAIR_RUNS.push({… baseH:0 …})` at
  `index.html:1978` and `1990`. `baseH` should be `groundH(foot)` and `topH`
  should be `building.baseY + reach`, so a fire escape on a hillside building
  starts at the sidewalk and ends at the (raised) roof.
- **Rail station stairs + step visuals** — `index.html:1881` (`baseH:0`) and the
  step loop just below. Foot of the run → `groundH(stx,stz)`.
- **Pickups** — verify `makePickupMesh`/drop placement (`index.html:3780`+) uses
  `groundH` for its Y; sensored pickups on a slope shouldn't hover.

`tests/cases/terrain.test.js` already asserts "no building floats on flat ground";
extend it (see §5) to assert the same after you raise terrain.

---

## 3. Tier 1 — the hills themselves (terraced blocks + graded streets)

This is the payoff and the bulk of the work. The design (full rationale in
`TERRAIN.md` §4 Tier 1): **each city block is a flat plateau; roads ramp linearly
between block/intersection heights.** That gives visible street grade *and* keeps
every block buildable, and because the field stays continuous, intersections are
automatically consistent (no cliffs).

### Where to build it

All inside **`groundH`** (`index.html:1169`). Today it's knolls-in-parks + edge
dunes. Add a terraced base layer *under* those:

```js
// low-frequency city relief — the whole map gently rolls; keep CITY_AMP modest
function cityRelief(bx, bz){                 // sample at BLOCK CENTERS only
  return CITY_AMP * (0.5 + 0.5*Math.sin(bx*0.011 + 1.3)*Math.cos(bz*0.013));
}
// precompute one pad height per block once (grid of blockInfo centers), then:
function terracedGrid(x, z){
  // 1. find the block cell (i,j) containing (x,z)
  // 2. if inside the block interior -> return that block's flat pad height
  // 3. if in a road gutter -> bilinearly blend the neighbouring block pads so
  //    the street SURFACE ramps between them (this is the "grade")
  // 4. at an intersection -> the shared corner value, so all 4 roads agree
}
function groundH(x, z){
  let h = terracedGrid(x, z);          // NEW base layer (plateaus + graded roads)
  for (const k of KNOLLS) h += knoll(k, x, z);   // parks still bulge on top
  h += edgeDunes(x, z);                // existing beach ring
  return h;
}
```

`terracedGrid` is the only real new machinery. Precompute the per-block pad array
at load (you already build `blockInfo` with `cx,cz` centers — `index.html:1141`).
Keep the block interior flat so `buildingBaseY` (already footprint-min) lands each
building on its pad with a near-zero skirt.

### Must-dos while you do it

- **Re-displace the ground mesh.** The terrain mesh already bakes `groundH` into
  its vertices (`index.html:1337`, a 120×120 `PlaneGeometry`) and recomputes
  normals. It'll pick up your new `groundH` for free — but 120 segments is
  ~6u/cell. Block-scale relief resolves fine; if you add crisp small hills, bump
  to ~160–200 segments and re-time the load. The **sand ring** (`index.html:1345`)
  bakes `groundH` too — keep them consistent.
- **Cap the grade.** Keep street slope ≲ **12°** (≈0.21 rad). Steeper and cars
  fight the ramp-launch heuristic (`index.html:4911`) and the ±0.4 pitch clamp,
  and it stops being drivable. Tune `CITY_AMP` + block spacing to respect it.
- **Guard the ramp launcher.** Re-check the jump/ramp code against your steepest
  street so a hillside doesn't fling cars; raise its speed-into-uphill threshold
  or gate it strictly to ramp props.
- **Water/sea.** The sea plane sits at a fixed `y` (`index.html:~1368`); don't
  let inland terrain dip below it. Keep `groundH ≥ 0` inland (the terraced base
  is `0..CITY_AMP`, so you're fine as long as you don't subtract).

## 4. Tier 2 — one or two signature hills (after Tier 1 works)

Once terracing exists, a named hill is cheap: add a broad smooth bump to
`cityRelief` over one region; the terraced grid drapes as a staircase of level
blocks joined by steep streets (SF-style). Great for chases and vistas, natural
rooftop-hideout cluster. Still single-valued. Pick 1–2 so it's a landmark.

*(Garages / multi-level = Tier 3b, a different task. `TERRAIN.md` §4 has the
`supportY`/deck plan. Don't interleave it with hills.)*

---

## 5. Definition of done + tests

Extend `tests/cases/terrain.test.js` (it's headless Playwright over the real page;
reach into globals with `page.evaluate` — `groundH`, `supportY`, `buildings`,
`player`, `cars` are all in scope). Add:

- **No floaters on grade:** after raising terrain, for a sample of buildings
  assert `|b.baseY − groundH(each footprint corner)|` leaves no gap beyond the
  skirt, and the building isn't buried.
- **Streets are drivable, not launch ramps:** drive a car up the steepest graded
  street; assert `car.y` tracks `groundH` and `car.airborne` stays false.
- **Player seats on grade:** walk onto a hill; assert `player.y ≈ groundH`.
- **Single-valued & continuous:** sample `groundH` on a fine grid; assert finite
  and neighbour-to-neighbour delta below a cliff threshold (no discontinuities).
- **Rail pillars reach ground:** assert each pillar base ≈ `groundH(pillar)`.

**Done when:** the city visibly rolls, you can drive up and down graded streets
that feel intentional, nothing floats or sinks, the full suite (`node
tests/run.js`) is green, and it still holds 60fps on a phone (spot-check
`fitScreen`/perf on mobile Safari per `HANDOFF.md`).

---

## 6. Quick reference — line anchors (as of this handoff)

| Thing | `index.html` |
|---|---|
| `groundH` (edit here) | 1169 |
| `KNOLLS` (park bumps) | 1164 |
| `blockInfo` centers (pad grid source) | 1141 |
| `addBuilding` / `buildingBaseY` | 1214 |
| Ground mesh displacement (120×120) | 1337 |
| Sand ring displacement | 1345 |
| `roofAt` (returns `baseY+h`) | 2055 |
| `supportY` resolver + `DECK_SURFACES` | 2069–2085 |
| Football props (seat these) | 1759 |
| Building stair runs `baseH:0` | 1978, 1990 |
| Rail station stairs `baseH:0` | 1881 |
| Car settle/pitch to `groundH` | 4940 |
| Foot floor via `supportY` | 5120 |
| Ramp launcher (guard vs steep slope) | 4911 |

Line numbers drift — grep the symbol if it's off by a few.
