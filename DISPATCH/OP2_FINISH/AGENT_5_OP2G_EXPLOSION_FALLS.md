# Agent 5 — OP2-G: faster car failure, one better explosion, lethal falls

**Model:** Sonnet 5 · **Effort:** high · **Branch:** `claude/op2g-explosion-falls`
**Card:** `HANDOFF.md` Phase 11 → OP2-G (`P1 · Risk: Med`)
**Signature:** `Signed: Claude Code | Sonnet 5 | high`

## Owner direction

> Once the player's car reaches its damaged/critical state, it should explode
> in roughly half the current time. Remove the redundant mushroom-cloud layer;
> keep the better quick explosion, slow that visual slightly, and increase its
> damaging blast radius modestly. A fall of about four Turbo body heights onto
> solid ground should splat and trigger WASTED.

## Read first

`AGENTS.md`, `STATUS.md`, then `index.html` §CAR PHYSICS (~6711) for the damage
and critical state, the explosion block around `boomFx` (~6296 — "the BIG one:
fireball, mushroom cloud, shockwave") and `sfx.carBoom` (~1060), §PLAYER: FOOT
& CAR (~6938) for airborne tracking and `turboHeight()`, the parachute at
~5544, and §BUSTED / WASTED (~8449). Existing coverage:
`tests/cases/vehicle-sanity.test.js`, `respawn-flow.test.js`.

Deliver as **two commits**: explosion first, falls second.

## Commit 1 — car failure and one explosion

Keep **one** authoritative vehicle-explosion event and **one** visual effect.

- **Halve the critical fuse** — the timer from critical state to detonation —
  rather than doubling damage updates, so timing stays deterministic and the
  explosion cannot fire twice.
- **Remove only the mushroom-cloud presentation.** Cleanup, sound, heat, shake
  and damage hooks shared by the retained effect stay exactly as they are.
  Note that Cinema's staged "blow up a car" scene calls into this path — it
  must still work.
- **Slow the retained animation** enough to read, without making gameplay wait
  on it.
- **Define one slightly larger blast radius** as a single named constant used
  by both the damage query and the tests. No second radius anywhere.

## Commit 2 — lethal falls

Track real unsupported fall distance from the airborne high point relative to
`groundH` / the landing surface, measured in `turboHeight()` units. At roughly
`4 × turboHeight()` onto solid ground, play a short splat/impact beat and route
into the **existing** WASTED flow — do not fork a second death path.

These must **not** create false falls: ordinary jumps, stairs and fire escapes,
moving terrain samples, scripted camera moves, teleports and recovery,
vehicle state changes, and a successfully deployed parachute. Preserve the
existing water and bail-out behavior exactly.

## Acceptance

- Measured critical-to-explosion time is about half the baseline; record both
  numbers in your report.
- Exactly one explosion renders per event and damages inside its documented
  radius; no mushroom cloud is created anywhere.
- Drops below the threshold survive as before; drops at or above it onto solid
  ground reliably WASTE Turbo **once**.
- Parachute, respawn and terrain transitions never false-fire the fall death.

## Tests

Extend `tests/cases/vehicle-sanity.test.js` with the fuse timing (baseline vs.
new), a single-detonation assertion and the radius constant, and add
`tests/cases/fall-damage.test.js` covering below-threshold survival,
at-threshold single WASTED, and the false-fire cases above (stairs, parachute,
respawn, vehicle exit).

```bash
cd tests && node syntax-check.js && node run.js vehicle-sanity && node run.js fall-damage
```

Then watch one car explosion and take one lethal fall yourself.

## Out of scope

Traffic steering and spawn logic (OP2-B is done and signed — do not touch it),
road visuals, cinema camera paths, HUD layout, and any other OP2 card.

## Done

Update your `STATUS.md` row to DONE in ≤3 lines, push
`-u origin claude/op2g-explosion-falls`, and report both commit hashes, the
before/after fuse numbers, and your test results.
</content>
