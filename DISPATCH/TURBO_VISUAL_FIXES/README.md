# Turbo Visual Fixes — three-agent concurrent dispatch

Tracked launch packet for **three concurrent Claude agents** covering the
owner's 2026-07-29 playtest report: four visual defects, three of them with a
confirmed root cause.

This packet does not move the authoritative `NEXT` marker in `HANDOFF.md` §10.

## Owner report (verbatim)

> When turbo falls and is wasted he needs to turn into a red splat and his
> parts kinda break apart. Also the helicopter leans the wrong way when I
> steer it. It should lean forward while going forward. Also, there is a
> flickering effect on the back of cars i want fixed. Also, when im in gun
> mode and aiming, having his whole body be seen and transparent looks weird.
> Maybe just the back side of him should be seen and transparent.

## Base

Every agent starts from the branch that carries this packet:

```bash
git checkout -b <your card branch> claude/turbo-animation-visual-bugs-rr843y
test -f DISPATCH/TURBO_VISUAL_FIXES/README.md && git status --short --branch
```

That branch is `main` plus these documents — no game-code changes. If the file
check fails or your worktree is dirty, stop and report it.

## Cards

| Agent | Card | Brief | Model | Effort | Branch |
|---|---|---|---|---|---|
| A | Heli lean + car rear flicker | [AGENT_A_GEOMETRY_ORIENTATION.md](AGENT_A_GEOMETRY_ORIENTATION.md) | Sonnet 5 | medium | `claude/turbo-visual-geom` |
| B | Backside-only aim ghost | [AGENT_B_AIM_TRANSPARENCY.md](AGENT_B_AIM_TRANSPARENCY.md) | Sonnet 5 | medium | `claude/turbo-visual-aim` |
| C | Death splat + break-apart | [AGENT_C_DEATH_SPLAT.md](AGENT_C_DEATH_SPLAT.md) | Opus 5 | high | `claude/turbo-visual-splat` |

Cards are **assigned**, not self-claimed — the integrator launches all three
directly. Take only your own card. The model and effort are requirements of
the card, not suggestions.

A and B are ~30-line surgical fixes with a confirmed root cause. C is the only
card that adds real surface area, and it is a new feature rather than a bug
fix.

## Code ownership — `index.html` regions

All three cards touch `index.html`, but in disjoint regions. Stay inside
yours. If you believe you must edit outside it, stop and report instead.

| Agent | Owned regions |
|---|---|
| A | `wedgeGeo` + `makeCarMesh` wedge block (~3308–3390); `makeHeliMesh` (~5525); `updateHeliMode` visuals (~5692–5697); optional car-pitch commit (~7124–7134, ~3450, ~3543) |
| B | `setTurboAimTransparency` + `turboAimMats` (~6216–6239); `player.mesh.userData.backT` setup (~4652–4660) if needed |
| C | `wasted`/`respawn` (~8852–8919); `applyFallImpact` (~7228); `COL_*` palette line (~3195–3199); new death-sequence code and its main-loop tick |

Nobody edits the `// CODE MAP` comment block (~736). It is regenerated
mechanically at integration.

## Integration

Merge order is **A → B → C**, smallest first, so C rebases onto settled code.

Agents commit on their own branch and **do not push and do not open a PR** —
the integrator merges all three into
`claude/turbo-animation-visual-bugs-rr843y` and pushes once.

## Testing

Per `AGENTS.md` §4: test only what you changed, once, at the end. Do not run
the full 198-case suite and do not re-verify another agent's work. Per-card
test lists are in each brief. Known-flaky in this sandbox (see `STATUS.md`
**Known issues**): `save-restore.test.js` and the tail of long runs.

## Signature

Every commit and every `STATUS.md` row ends with `AGENTS.md` §5's signature.
Escape the pipes in the `STATUS.md` table row as `\|` or the table breaks.

```text
Signed: Claude Code | Sonnet 5 | medium
```
