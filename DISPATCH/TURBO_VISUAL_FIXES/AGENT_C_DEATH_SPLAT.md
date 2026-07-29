# Agent C — death splat and break-apart

**Model:** Opus 5 · **Effort:** high · **Branch:** `claude/turbo-visual-splat`
**Signature:** `Signed: Claude Code | Opus 5 | high`

This is the only card in the packet that is a **new feature** rather than a
bug fix, and the only one that adds real surface area. Take it slowly.

## Owner report

> When Turbo falls and is wasted he needs to turn into a red splat and his
> parts kinda break apart.

## Read first

`AGENTS.md`, `STATUS.md` (add your **Active work** row), then this brief. Then
only the line ranges below. Do not read the whole repo.

## What exists today

`wasted()` (`index.html:8884`) plays a crash sound, blows up the car or heli
you were in, fires a smoke burst, and calls `respawn()` (`index.html:8852`) —
which waits **1800 ms** before resetting the player. Turbo's body just stands
there through that entire window. That 1.8s is your runway and nothing else
uses it.

Lethal falls reach this through `applyFallImpact()` (`index.html:7228`), which
fires when an unsupported drop exceeds `FALL_LETHAL_MULT` (4×) his own height,
measured by `turboHeight()` (`index.html:8471`).

## Materials you have

- **The rig.** `player.mesh` from `makePerson(TURBO_SPEC)` (`js/person.js:189`)
  exposes `legL`, `legR`, `kneeL`, `kneeR`, `armL`, `armR`, `body`, `torso`,
  `head`, `jaw`, `mouth`, `shadow` in `userData` (`js/person.js:199-205`).
  Those groups are your break-apart pieces — the rig is already articulated,
  you do not need to author new geometry.
- **A decal pattern.** `makeShadow()` (`index.html:3209`) is a flat circle at
  `y+0.03` on a shared `shMat`. That is the pattern for the ground splat —
  tint red and scale it. **Clone the material**, don't mutate `shMat`; every
  blob shadow in the game shares it. `makeHeliShadow()` (`index.html:5559`)
  shows the clone idiom already in use.
- **Particles.** `burst(x,y,z,n,cols,speed,life,grav)` (`index.html:3172`)
  takes a palette. The `COL_*` set at `index.html:3195-3199` has **no red** —
  add one (e.g. `COL_GORE`) alongside the others rather than inlining literals.
  Note `P_MAX` is 360 and `spawnP` is a ring buffer, so a huge burst will evict
  live particles; `PARTICLE_SCALE` already scales counts for quality settings.

## The hard requirement — it must fully restore

`respawn()` sets `player.mesh.visible=true` and resets `mesh.rotation.x`
(`index.html:8864`), but knows **nothing** about detached limbs. Whatever you
take apart, you re-assemble: re-parent every piece to its original parent,
zero its local position and rotation, clear the splat decal, and restore
`userData.shadow` before the player is playable again.

Get this wrong and the failure mode is a permanently dismembered Turbo, which
is worse than the bug you're fixing. Build the restore path *first*, then the
death animation.

Also note `player.mesh` carries two extra attachments the plain rig does not:
`u.backT` (the pink T, `index.html:4652`) and `u.shades`
(`index.html:4662`, normally hidden, shown in cinema mode). Don't lose them.

## Scope decisions — make them and state them in your commit

The owner left these open:

1. **All deaths, or fall deaths only?** The phrasing says "when Turbo falls",
   but a car explosion or a cop shooting leaving him standing intact would
   look inconsistent. **Recommendation: all deaths.** `wasted()` is the single
   choke point for every death path, so this is the cheap option too.
2. **How gory?** The game's tone is cartoon/arcade, not horror. Read the room —
   `CHARACTERS.md` and `STORY_BIBLE.md` set the tone if you need a reference.
3. **`SETTINGS.reduceMotion`.** Check how other effects honor it — `shake()`
   at `index.html:8923` early-returns on it. Decide whether the break-apart
   should soften and follow the established pattern.

## Death paths to verify (all route through `wasted()`)

| path | site |
|---|---|
| lethal fall | `index.html:7233` via `applyFallImpact` |
| no-chute bail impact | `index.html:5868` |
| drowning / ocean | `index.html:5860` |
| player heli destroyed | `index.html:5594` |
| explosion proximity | `index.html:6614` |
| HP depleted (gunfire, melee) | `index.html:8335` |
| car destroyed while driving | `index.html:9199` |
| car into water | `index.html:7628` |

Two of these pass a `spot` argument (`5860`, `7628` — the shore respawn), so
your sequence must not break that. `DEV_STATE.god` (`index.html:10683`, cinema
mode) suppresses several of them.

## Acceptance

- On death, limbs detach and tumble outward with gravity, a red burst fires,
  and a splat decal lands on the ground beneath him and holds for a beat —
  all inside the 1800 ms window, finishing before the respawn.
- **After every respawn Turbo is fully intact and animating normally.** Die
  repeatedly by at least four different paths from the table and confirm.
- Walk, sprint, climb, crouch and melee poses in `updateFoot`
  (`index.html:7235+`) still drive the limbs afterward — those paths write
  `u.legL.rotation.x` and friends directly, so a mis-parented limb will show
  up as a broken walk cycle rather than an error.
- A death during a mission, a cutscene, or cinema mode does not strand a splat
  or a floating limb in the world.
- No leaked geometry or materials across repeated deaths — `disposeMesh()`
  (`index.html:3270`) is the established cleanup helper.

## Tests

Add `tests/cases/death-splat.test.js` covering the **restore path** — that a
death followed by a respawn leaves the rig re-assembled (every `userData`
limb back under its original parent with zeroed local transforms) and the
splat cleaned up. Follow the style of `tests/cases/fall-damage.test.js`, which
already covers the lethal-fall trigger and is the closest model.

Focused only, per `AGENTS.md` §4 — **do not run the full suite**:

```bash
cd tests && node run.js death-splat && node run.js fall-damage \
  && node run.js respawn-flow && node run.js regression && node run.js smoke
```

Also verify visually in the running game — the `/run` skill launches it. A
capture of the death sequence would be useful in your report.

## Integration note

You are merged **last** (after `claude/turbo-visual-geom` and
`claude/turbo-visual-aim`). Neither of those touches your regions, so you
should not conflict — but if the integrator asks you to rebase, do that before
you finish.

## Report back

One paragraph: what the sequence does, the three scope decisions you made and
why, which death paths you exercised, and your test results. **Do not push and
do not open a PR** — the integrator merges this branch.
