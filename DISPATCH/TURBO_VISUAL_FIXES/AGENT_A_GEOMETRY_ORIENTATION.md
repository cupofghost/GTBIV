# Agent A — helicopter lean + car rear flicker

**Model:** Sonnet 5 · **Effort:** medium · **Branch:** `claude/turbo-visual-geom`
**Signature:** `Signed: Claude Code | Sonnet 5 | medium`

Two surgical fixes in `index.html`, plus one optional third commit. Both main
fixes have a root cause that was confirmed numerically before this card was
written — you do not need to re-derive them, but do verify the result.

## Read first

`AGENTS.md`, `STATUS.md` (add your **Active work** row), then this brief. Then
only the line ranges below. Do not read the whole repo.

---

## Fix 1 — the helicopter leans the wrong way (commit 1)

### Owner report

> The helicopter leans the wrong way when I steer it. It should lean forward
> while going forward.

### Root cause (confirmed)

`updateHeliMode` at `index.html:5694-5696` does:

```js
h.mesh.rotation.y=h.heading;
h.mesh.rotation.z=lerp(h.mesh.rotation.z,input.jx*0.25,0.2);
h.mesh.rotation.x=lerp(h.mesh.rotation.x,th*0.28,0.2);
```

THREE's default Euler order is `XYZ`, which composes as `RX · RY · RZ` — so
the pitch term is applied about the **world** X axis, after the heading
rotation, instead of about the helicopter's own lateral axis. Measured nose-Y
for a constant pitch of `+0.28` (negative Y = nose down = leans forward):

| heading | current (`XYZ`) | with `YXZ` |
|---|---|---|
| 0° north | −0.276 nose down ✅ | −0.276 ✅ |
| 90° east | 0.000 — no pitch, tips sideways ❌ | −0.276 ✅ |
| 180° south | **+0.276 — nose UP, leans backward** ❌ | −0.276 ✅ |
| −90° west | 0.000 — tips sideways ❌ | −0.276 ✅ |

So the lean is only correct flying north, inverted flying south, and becomes a
sideways roll flying east/west. That is the whole bug.

### The fix

Set `rotation.order = 'YXZ'` on the helicopter mesh. `YXZ` composes as
`RY · RX · RZ`: yaw in world space, then pitch about the body's lateral axis,
then roll about the nose axis — the standard aircraft order.

Do it **once at construction** in `makeHeliMesh` (`index.html:5525`), not
per-frame in the update loop.

### Constraints

- **Do not flip the pitch sign.** `th=clamp(-input.jy,-1,1)` at
  `index.html:5617`, so stick-forward gives `th>0` gives `rotation.x=+0.28`
  gives nose-down. That is already correct; only the order is wrong.
- After the order change, confirm the roll at `rotation.z=input.jx*0.25` still
  banks **into** the turn. Heading integrates as `h.heading+=-input.jx*1.6*dt`
  (`index.html:5608`), so stick-right turns right and should drop the right
  skid.
- `copHeli` uses the same `makeHeliMesh`, so it inherits the fix. Check
  `updateCopHeli` (`index.html:5892+`) and the death spin at
  `index.html:5750`/`5902` still read correctly.
- Do not change the flight model, speeds, damping, altitude clamps or input
  mapping. Orientation only.

### Acceptance

Nose pitches down when accelerating forward and up when decelerating, at
**every** heading — fly north, south, east and west and confirm. Banking still
leans into the turn. Landing, the ocean ditch and the death spiral look no
worse than before.

---

## Fix 2 — flickering on the back of cars (commit 2)

### Owner report

> There is a flickering effect on the back of cars I want fixed.

### Root cause (confirmed)

`wedgeGeo` at `index.html:3308` emits all 8 triangles with **reversed
winding**. Measured raw winding normals for `wedgeGeo(2,1,4)`:

| face | sits at | winding normal | should be |
|---|---|---|---|
| tall back (×2) | z = −hl | `(0, 0, +1)` | `−z` |
| bottom (×2) | y = 0 | `(0, +1, 0)` | `−y` |
| slope (×2) | top | `(0, −0.97, −0.24)` | up / `+z`-ish |
| left side | x = −hw | `(+1, 0, 0)` | `−x` |
| right side | x = +hw | `(−1, 0, 0)` | `+x` |

Two consequences. Lambert shading is computed from inverted normals, and —
the actual flicker — under THREE's default `FrontSide` the culler keeps the
**far** faces, so from a chase camera the rear `deck`'s *bottom* face is what
renders. That bottom face sits at exactly `y = 0.825`, the same plane as the
car body's top face (`body` is `BoxGeometry(t.w,0.55,t.l)` at `y=0.55`, so its
top is `0.55 + 0.275 = 0.825`). Two coplanar surfaces fighting for depth.

It reads worst *at the back* because the rear `deck` is the longest and
shallowest wedge — sedan: 0.15 rise over 1.53u, versus the hood's 0.18 over
1.23u — and it tapers to zero thickness right at the tail.

### The fix

1. Reverse the winding of every triangle in `wedgeGeo` so all normals point
   outward. Re-run the normal check above and confirm all 8 faces flipped.
2. Additionally sink the `hood` and `deck` wedges ~0.01u into the body
   (`index.html:3379-3383`) so no face is ever exactly coplanar with the body
   top from any camera angle. Belt and braces — do both, not one.

### Constraints

`wedgeGeo` also builds `shield` and `rearGlass` (`index.html:3384-3389`).
Those will change appearance once the normals are correct, so this is not a
blind edit: look at a sleek car (`sedan`, `taxi`, `sports`, `muscle`, `cop`,
`compact` all take the `sleek` branch) from **front, rear, side and a low
angle** and confirm the glass still reads as glass and nothing is inside-out.
`moto`, `pickup` and `van` do not use wedges but check one anyway.

Do not change car dimensions, `CARTYPES`, colors, collision or physics.

### Acceptance

No shimmer on the rear deck of a moving car at chase-camera distance, or on a
parked car orbited on foot. Body panels are lit correctly (the slope catches
light from above, not below). Glass still reads as glass.

---

## Fix 3 — cars have the same Euler bug (commit 3, OPTIONAL — keep it separate)

The owner did not report this, but it is the identical root cause as Fix 1 and
was flagged to them: `index.html:7124-7134` sets `car.mesh.rotation.y=heading`,
`rotation.z=` body roll and `rotation.x=` road-grade pitch under the same
default `XYZ` order — so a car driving east or west pitches about its own roll
axis and **leans sideways on a hill** instead of nosing up or down. Same defect
at `index.html:3450` (`makeCar` initial seating) and `index.html:3543`.

The owner has approved this **on the condition that it lands as its own
commit**, so it can be reverted alone if it looks wrong. Do it last, commit it
by itself, and say in the commit message that it is the optional car-pitch
fix.

`index.html`'s car block is listed in `STATUS.md` **Shared-file touches** as a
hot spot. Make the smallest possible change — set `rotation.order` at mesh
construction, nothing else — and add a line to that section.

### Acceptance

A car driving up a graded street noses up, and noses down going down, at every
compass heading. Body roll in corners is unchanged. Bikes (`moto`, which leans
hard via `rotation.z` at `index.html:7125`) still lean into corners.

---

## Tests

Focused only, per `AGENTS.md` §4 — **do not run the full suite**:

```bash
cd tests && node run.js vehicle-sanity && node run.js traffic-pooling \
  && node run.js regression && node run.js smoke
```

No new test case is required for this card: the suite tests state and logic,
and all three fixes are orientation/geometry that only a human eye can judge.
Verify visually in the running game instead — the `/run` skill launches it.
If you can capture before/after screenshots of a car rear and a helicopter in
forward flight at two headings, attach them to your report.

## Report back

One paragraph: what changed, which headings you checked the heli at, which car
types you eyeballed, whether you did the optional Fix 3, and your test results.
Commit each fix separately. **Do not push and do not open a PR** — the
integrator merges this branch.
