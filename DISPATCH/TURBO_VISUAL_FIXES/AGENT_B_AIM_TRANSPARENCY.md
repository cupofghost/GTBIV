# Agent B — backside-only aim ghost

**Model:** Sonnet 5 · **Effort:** medium · **Branch:** `claude/turbo-visual-aim`
**Signature:** `Signed: Claude Code | Sonnet 5 | medium`

One change, in `index.html`. Small in lines, fiddly in detail — the traps are
listed below and every one of them is real.

## Owner report

> When I'm in gun mode and aiming, having his whole body be seen and
> transparent looks weird. Maybe just the back side of him should be seen and
> transparent.

## Read first

`AGENTS.md`, `STATUS.md` (add your **Active work** row), then this brief. Then
only the line ranges below. Do not read the whole repo.

## Current behavior

`setTurboAimTransparency()` at `index.html:6219` traverses the **entire**
player rig and drops every non-weapon material to `opacity 0.38` with
`depthWrite=false`:

```js
m.transparent = amount>0.01 ? true : base.transparent;
m.opacity     = lerp(base.opacity, 0.38, amount);
m.depthWrite  = amount>0.01 ? false : base.depthWrite;
```

So all of Turbo goes ghostly and you see his far side through his near side —
which is what reads as "weird". The aim camera is a close left-shoulder rig
(`index.html:9006-9009`): `back` lerps 6.5 → 2.5 and `side` 0 → −0.95 as
`aimBlend` rises, so what sits between the player and the reticule is his back
and left shoulder.

## Approach

Recommended: while ghosted, also set `m.side = THREE.BackSide`. That culls the
surfaces facing the camera (his back) and draws only the far/inner ones — so
you see *through* his back while his front silhouette still reads solid, which
is exactly what the owner described. Consider raising the opacity somewhat
from 0.38 now that far less geometry is being drawn.

If `BackSide` turns out to look wrong in practice, the fallback is to fade
only the parts nearest the camera (torso + head) and leave arms and legs
opaque. Try `BackSide` first; it is the cleaner result.

## Traps — all four are real, handle each

1. **`turboAimMats` does not cache `side`.** The base record at
   `index.html:6231` saves only `{transparent, opacity, depthWrite}`. If you
   change `side` without adding it to that record and restoring it, Turbo
   stays inside-out permanently after holstering. This is the one that will
   bite you.

2. **Two callers, two value types.** `refreshButtons` calls it with a boolean
   (`index.html:6214`); the camera calls it every frame with the fractional
   `aimBlend` (`index.html:8994`). The early-out at `index.html:6221`
   (`Math.abs(amount-turboAimTransparent)<0.01`) means your `side` change must
   land on the first frame the blend crosses the threshold and revert when it
   returns to 0 — verify both edges, not just the entry.

3. **`u.backT`** — the pink T mark on Turbo's back (`index.html:4652-4660`) is
   a `MeshBasicMaterial` group parented to `u.torso`. `BackSide` will cull it,
   since it sits on the exact surface you are culling. Decide whether it
   should stay visible and handle it explicitly either way; say which you
   chose and why in your commit message.

4. **Weapon meshes must stay solid.** The existing traverse walks up the
   parent chain to skip anything under `u.gun`/`u.rpg`/`u.baton`
   (`index.html:6226-6229`). Keep that exclusion intact — the gun going
   see-through would be a regression.

## Constraint

Turbo's materials are created fresh per `makePerson()` call
(`js/person.js:203-207`), so nothing you change here can leak onto NPCs.
**Confirm that is still true after your edit** — if you find yourself reaching
for a shared or cached material, stop.

Do not touch the aim camera, FOV, reticule, or `aimBlend` easing. Material
state only.

## Acceptance

- Aiming (pistol **and** RPG): you can see past Turbo to the reticule, his
  front silhouette still reads solid, the gun is opaque.
- Holstering fully restores him — opacity, `transparent`, `depthWrite` **and**
  `side`. Orbit him after holstering and confirm no inside-out surfaces.
- Switching weapons mid-aim (`cycleWeapon`, `index.html:6241`) does not strand
  him transparent or inside-out.
- Entering a car or dying while aiming restores him — `exitCarSoft`
  (`index.html:8837`) sets `player.mesh.visible=true` but knows nothing about
  material state, so check that path.

## Tests

Focused only, per `AGENTS.md` §4 — **do not run the full suite**:

```bash
cd tests && node run.js weapon-sounds && node run.js camera-polish \
  && node run.js regression && node run.js smoke
```

No new test case required — the suite tests state and logic, and this is a
material/render change only a human eye can judge. Verify in the running game
(the `/run` skill launches it). Before/after screenshots of the shoulder cam
while aiming would be useful in your report.

## Report back

One paragraph: what you changed, whether `BackSide` or the fallback won, what
you did about `u.backT`, which restore paths you exercised, and your test
results. **Do not push and do not open a PR** — the integrator merges this
branch.
