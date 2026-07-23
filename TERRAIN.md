# Terrain & Verticality — Analysis and Proposal

**Goal:** make the world more interesting than a flat plane — real height, hills,
and streets with grade — *without breaking everything.*

This document is written to be handed to whoever implements the next terrain
pass. It describes exactly what exists today, why the naive "add hills"
approach breaks the game, the one invariant that keeps it safe, and a tiered
plan that gets to graded streets and signature hills while the rest of the game
keeps working.

---

## TL;DR

- **The movement code is already slope-aware.** Cars settle onto slopes, pitch
  with the grade under the tires, and launch off ramps; the player walks up
  hills, climbs stairs, and stands on roofs. This half of the job is done.
- **The danger is *not* the hills — it's the ~two dozen things bolted to
  absolute `y = 0`.** Buildings, rail pillars, the pizza place, football
  bleachers, parked cars, doors, and a couple of camera/water constants assume
  the ground is a flat plane at height zero. Put a grade under them and they
  float or sink. That is the "breaks everything" you saw.
- **One invariant keeps you safe:** `groundH(x, z)` must stay a *single-valued,
  continuous height field* — exactly one ground height per `(x, z)` column.
  Everything already routes through it. Enrich it, and re-seat the y=0 objects
  onto it, and nothing breaks.
- **The thing that genuinely *would* break the engine** is stacked drivable
  surfaces — overpasses, tunnels, driving under the rail, multi-level parking.
  Those violate the single-height-per-column model the whole collision system
  is built on. Defer them. You do not need them to get hills and graded streets.

---

## 1. What exists today (the starting point)

### 1.1 The height field: `groundH(x, z)`

`index.html:1169` — a pure function, one height per column:

```js
function groundH(x,z){
  let h=0;
  for(const k of KNOLLS){                 // radial cosine bumps, parks only
    const dx=x-k.x, dz=z-k.z, d2=dx*dx+dz*dz;
    if(d2<k.r*k.r) h+=k.h*0.5*(1+Math.cos(Math.PI*Math.sqrt(d2)/k.r));
  }
  const m=Math.max(Math.abs(x),Math.abs(z));
  if(m>H+16){ /* rolling dunes out past the beach ring */ }
  return h;
}
```

- `KNOLLS` (`index.html:1164`) are placed **only in park blocks** that aren't
  helipads or the football field, radius 11–15, height 2–3.
- A park block is 50u wide (`WORLD.block`); its knoll radius tops out ~15u, and
  the road starts 25u from block center. **So knolls never reach the roads —
  every street in the game is currently dead flat (grade 0).** That's why
  "streets with grade" is genuinely new territory and not just a bigger knoll.

### 1.2 The ground mesh follows the field for free

`index.html:1326`:

```js
const groundGeo=new THREE.PlaneGeometry(WORLD.size,WORLD.size,120,120);
for(let i=0;i<pa.count;i++) pa.setZ(i,groundH(pa.getX(i),-pa.getY(i)));
groundGeo.computeVertexNormals();
```

Key numbers: world is `WORLD.size = 716`u across, meshed at 120×120 segments →
**~6u per cell** (121² = 14,641 verts, normals computed once at load). The sand
ring does the same.

**Roads and all their markings are painted into `groundCanvas`
(`index.html:1228`+) and applied as the mesh's texture** — lane lines,
crosswalks, block fills, helipad "H", the football field. Because it's a
texture on the *displaced* mesh, **every road marking already drapes over the
terrain automatically.** This is a big deal: you do not have to re-place a
single road decal to give streets grade. That work is free.

### 1.3 Movement already consumes the height field correctly

Everything that *moves* is already slope-aware:

| System | Where | Behavior |
|---|---|---|
| Car vertical | `index.html:4882` | settles onto slopes; `car.y` tracks `groundH` |
| Car pitch | `index.html:4979` | samples `groundH` fore/aft, pitches the body |
| Car ramps/air | `index.html:4865` | ramp launch, airborne arc, landing impact |
| Player walk | `index.html:5083` | `ground = max(groundH, stairs, roof)`; gravity/jump |
| Stairs | `index.html:1190` `stairHitRun` | climbable runs; feet follow the steps |
| Roofs | `index.html:2041` `roofAt` | building tops are floors, not walls |
| Peds / jocks / Deb / gang / cops / trees / props | many | all seat on `groundH(x,z)` |

The collision model is **2D (x, z) plus a separately-sampled height** — walls
and props are resolved in the plane, and `y` is looked up from `groundH` /
`stairH` / `roofAt`. This is exactly the model that makes single-valued terrain
cheap and safe. Keep it.

---

## 2. Why the naive "just add hills" breaks everything

If you do the obvious thing — `h += bigNoise(x, z)` across the whole map — the
*terrain mesh and roads* look great immediately (they drape), but the game
breaks in four specific, bounded ways:

### 2.1 The y=0 objects — the real blast radius

These are placed at **absolute `y = 0`** and never sample `groundH`. Under a
grade they float or bury:

| Object | Where | Current seat |
|---|---|---|
| **Buildings** (bodies) | `index.html:1401` | `pos.set(cx, 0, cz)`, span 0→`b.h` |
| Building crowns / parapet lips | `index.html:1413`+ | pinned to `b.h` (absolute) |
| Building AC units / water tanks / antennas | `index.html:1438`+ | pinned to `b.h` |
| **Rail pillars** | `index.html:1842` | `pos.set(pt.x, 0, pt.z)`, fixed 7u tall |
| Rail beams / stations | `index.html:1831` | fixed elevated `y` |
| **Pizza place** | `index.html:3291`+ | body base at 0 |
| Football bleachers / goalposts / scoreboard | football builder | baked at 0 |
| Parked cars, doors (`PIZZA.doorX/Z`), markers, manholes | various | 0 / single-point |

There are ~23 `set(…, 0, …)` placements. **This is the whole problem, and it's a
finite list.** None of it is subtle physics — it's static geometry that needs
its Y read from the height field instead of hardcoded.

### 2.2 Buildings can't sit flat on a slope

A block footprint is 50u across. On any real grade the four corners of a
building are at different ground heights, so a flat-bottomed box either gaps on
the downhill side or sinks on the uphill side. A building is not a car — it
can't "pitch with the slope." It needs **either** a flat pad to stand on **or**
a foundation skirt that reaches down to its lowest corner. (§4 picks pads.)

### 2.3 Physics tuning goes sideways on steep grade

- The ramp-launch check (`index.html:4873`) fires when forward speed into an
  "uphill" exceeds a threshold. A steep enough *natural* slope can start acting
  like a ramp, launching cars off hillsides.
- Car pitch is clamped to ±0.4 rad (`index.html:4981`); grades steeper than
  ~23° will visually clip through that clamp.
- Walk speed doesn't cost anything to climb, so very steep terrain becomes a
  free elevator.

None of these *crash* — but they feel wrong. They set a **maximum grade budget**
(see §5 guardrails).

### 2.4 A handful of absolute-Y constants

- Foot camera clamp `if(camPos.y<0.45)` (`index.html:6154`) assumes ground ≈ 0;
  on a hill the camera can dip into the slope.
- Sea plane at `y=-0.34` and sand at `-0.06` (`index.html:1340`,`1357`) are
  absolute; terrain that dips below them inland would poke through the "water."
- `overWater` / `WATER_R` (`index.html:1358`) is a pure x/z test — fine, leave it.
- Minimap is 2D top-down — **completely unaffected**, no work needed.

---

## 3. The one invariant that keeps you safe

> **`groundH(x, z)` returns exactly one height per column, and stays
> continuous. Every world-placed object reads its Y from it. No new `y = 0`.**

As long as that holds:

- The mesh drapes, roads drape, markings drape — **for free.**
- The movement code already works — **no changes needed** to the car/foot
  integrators beyond tuning.
- A *continuous* field has **no cliffs anywhere**, so intersections stay
  consistent automatically — you don't get faults where four roads meet.

**What violates the invariant (and therefore breaks the collision engine):**
overpasses, tunnels, driving *under* the elevated rail as real geometry,
multi-level parking ramps — anything where one `(x, z)` column has two drivable
surfaces. The current elevated rail is safe precisely because it's *decorative*
(props + a train on rails you can't drive on). **If the next plan introduces
stacked drivable decks, that is the thing that breaks everything — not hills.**
Keep terrain single-valued; get verticality from *elevation changes*, stairs,
roofs, and the existing rail, not from stacked road decks.

---

## 4. Proposal — a tiered plan

Ordered so each tier is independently shippable and testable. Tier 0 is a
prerequisite; Tiers 1–2 are the payoff; Tier 3 is explicitly deferred.

### Tier 0 — Make `groundH` the single source of truth (prerequisite)

No new hills yet. Just re-seat the y=0 objects so that *when* you add grade,
nothing floats. Do this first and ship it invisibly (terrain is still flat, so
nothing moves — but the code is now grade-ready).

1. **Buildings** seat on a per-footprint ground height. Add a `baseY` to each
   building = the ground height sampled across its footprint (use the **min**
   corner so it never floats), and drop a **foundation skirt** from `baseY` down
   a couple meters so the uphill gap is hidden. Update `roofAt` to return
   `baseY + b.h` instead of `b.h`, and offset crowns/AC/lips by `baseY`.
2. **Rail pillars** grow from `groundH(pt.x, pt.z)` up to the fixed beam height
   (variable-length pillars) instead of a fixed 7u from y=0.
3. **Pizza place, football props, parked cars, doors, markers** — swap each
   `0` for `groundH(x, z)` (most already have the x/z; it's a one-line change
   each).
4. **Camera clamp** → make it relative: `if(camPos.y < groundH(camPos.x,
   camPos.z)+0.4)`.

*Risk: low. Effort: ~a day. Payoff: the game is now safe to grade.*

### Tier 1 — Terraced blocks + graded streets (the main event)

This is the classic city-on-hills trick (think San Francisco / Pittsburgh) and
it solves buildings-on-slopes and streets-with-grade *at the same time*:

- **Each city block is a flat plateau.** Its pad height = a smooth low-frequency
  field sampled at the block center. Buildings on that block stand on the pad —
  flat, no skirt gymnastics.
- **Each road segment grades linearly** between the two intersection heights it
  connects. Intersections are shared plateaus, so adjacent roads agree —
  no cliffs.
- The result: streets visibly rise and fall block to block, blocks sit level
  like real city lots, and the whole thing is still one continuous single-valued
  field.

Sketch for `groundH` (replaces the flat road assumption):

```js
// low-frequency city relief — whole map gently rolls, ~0..CITY_AMP meters
function cityRelief(x,z){
  return CITY_AMP * (0.5 + 0.5*Math.sin(x*0.011+1.3)*Math.cos(z*0.013));
}
// block pads: quantize to the block grid, sample relief at each block center,
// then bilinearly blend between the four surrounding block/intersection heights
// so roads ramp smoothly and each block interior is (near) flat.
function groundH(x,z){
  const pad = terracedGrid(x,z);   // plateaus + linearly-graded roads between
  let h = pad;
  for(const k of KNOLLS) h += knoll(k,x,z);   // parks still bulge on top
  h += edgeDunes(x,z);
  return h;
}
```

`terracedGrid` is the only new machinery: map `(x,z)` to its block cell, look up
that cell's pad height, and within the road gutters blend toward the neighbor
cells' pads so the street surface ramps. Keep `CITY_AMP` modest (a few meters
over the whole map) for the baseline; the *slope* between neighboring blocks is
what reads as "streets with grade," not the absolute height.

*Risk: medium (it's the real design work). Effort: a few days. Payoff: this is
the whole ask — hills + graded streets, buildable and drivable.*

### Tier 2 — Signature hills (set-pieces)

Once terracing exists, a few **named hills** are cheap: raise a broad, smooth
region (one big low-frequency bump), and the terraced grid drapes over it as a
staircase of level blocks joined by steep streets — instant SF hill-chase
energy, great camera vistas, a natural spot for a rooftop hideout cluster. Still
single-valued; still buildable. Pick 1–2 so it's a landmark, not noise.

*Risk: medium. Effort: ~a day on top of Tier 1. Payoff: memorable geography.*

### Tier 3 — True multi-level (DEFER)

Overpasses, tunnels, driveable rail deck, multi-level garages. **These break the
single-height-per-column model** and need a different collision representation
(per-surface layers, portal volumes, or a nav graph). Big rewrite, high risk,
not needed for "hills and graded streets." Note it as a someday item. The
elevated rail already gives the *read* of verticality for free.

---

## 5. Guardrails to hand the implementer

Non-negotiables that keep the game working:

1. **`groundH` stays pure and single-valued.** No per-frame state, no two
   heights per column. One `(x,z)` → one `y`.
2. **Keep it continuous.** No hard steps in the field itself. (Visible curbs, if
   wanted, are separate cosmetic geometry — not discontinuities in `groundH`.)
3. **Every placed object reads Y from the field.** Grep for `set(<x>, 0, <z>)`
   before you ship — that pattern should be gone for anything on the ground.
4. **Buildings live on block pads (flat), never straddling a road grade.**
5. **Cap the grade.** Target max street grade ≲ 12° (≈0.21 rad). Above that,
   cars fight the ramp-launch heuristic and the ±0.4 pitch clamp, and it stops
   being drivable. Tune `CITY_AMP` and block spacing to respect this.
6. **Re-check the ramp launcher** (`index.html:4873`) against the steepest
   natural slope so hills don't accidentally launch cars; raise its threshold or
   gate it to actual ramp props.
7. **Watch mesh resolution.** 120×120 (~6u/cell) resolves block-scale relief
   fine. If you add crisp small hills, bump to ~160–200 segments and re-time the
   load; `computeVertexNormals` is one-time so it's cheap.
8. **Watch `groundH` call cost.** It's called per-entity per-frame (twice for
   car pitch). Keep it to a few trig ops + the block lookup. If you ever go to
   multi-octave noise, cache per-tile or precompute — don't sample expensive
   noise dozens of times a frame.

---

## 6. Test plan (extend `tests/cases/`)

The suite is headless Playwright over the real page (`tests/run.js`, 36 cases
currently green). Add terrain regressions so the next pass can't silently break
seating:

- **No floaters:** for a sample of buildings, assert
  `|building.baseY − groundH(footprint corner)| < ε` on the downhill side, and
  no gap beyond the skirt.
- **Streets are drivable, not launch ramps:** drive a car up the steepest graded
  street; assert `car.y` tracks `groundH` within tolerance and `car.airborne`
  stays false (no accidental launch).
- **Player seats on grade:** walk onto a hill; assert `player.y ≈ groundH`.
- **Rail pillars reach the ground:** assert each pillar's base ≈
  `groundH(pillar.x, pillar.z)` (no floating/buried pillars).
- **Field is single-valued & continuous:** sample `groundH` on a fine grid;
  assert finite, and neighbor-to-neighbor delta below a cliff threshold.

---

## 7. Risk / effort summary

| Tier | What you get | Risk | Effort | Breaks anything? |
|---|---|---|---|---|
| 0 | y=0 objects re-seated; grade-ready | Low | ~1 day | No (terrain still flat) |
| 1 | Terraced blocks + graded streets | Med | ~few days | No, if invariant held |
| 2 | Named signature hills | Med | ~1 day | No |
| 3 | Overpasses/tunnels/multi-level | High | Rewrite | **Yes — defer** |

**Bottom line for the worry that started this:** adding height and graded
streets does **not** have to break everything. The movement half is already
done. The breakage is a finite list of static objects nailed to `y = 0`, plus a
few constants — fixable in a focused Tier 0 pass. The one thing that *would*
break the engine is stacked drivable surfaces; keep the terrain a single-valued
height field and you get hills, grade, and city-on-a-hill drama with the rest of
the game intact.
