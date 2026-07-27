# Agent 2 — OP2-C + OP2-D: reliable melee, grounded shadows, footsteps

**Model:** Opus 5 · **Effort:** xhigh (sign as `high`) · **Branch:** `claude/op2cd-melee-grounding`
**Cards:** `HANDOFF.md` Phase 11 → OP2-C (`P0 · Risk: Med–High`), OP2-D (`P1 · Risk: Med`)
**Signature:** `Signed: Claude Code | Opus 5 | high`

This is the hardest card in the batch: a P0 state-machine bug plus animation
and audio work. Deliver it as **two commits** — OP2-C first, then OP2-D on top,
because the shadow work depends on corrected knockdown/melee states.

## Owner report

> Punch and kick stop working after extended play, and Turbo's kick drives his
> body into the ground instead of showing the intended pose.
> Person blob shadows stay attached to the feet and rotate vertical when a
> character falls. Turbo's current footstep sound is poor.

## Read first

`AGENTS.md`, `STATUS.md`, then `index.html` §WEAPONS (~5902, melee lives at the
end of it), §PLAYER: FOOT & CAR (~6938) and `updateFoot()` (~6951), §BLOB
SHADOWS (~3053) and `makeShadow` (~3056), §AUDIO (~849) for the SFX bus,
`js/person.js` for the shared rig and its shadow child, and
`tests/cases/charged-melee.test.js` + `sprint.test.js` for the existing
coverage you are extending.

`js/person.js` is a shared rig (`STATUS.md` → Shared-file touches): additions
must stay backward-compatible, since several animation paths read its limbs.

## Commit 1 — OP2-C: melee reliability and the planted kick

**Reproduce before you change anything.** Drive the lockout out in the open:
repeated attacks, held attacks, mode changes, car enter/exit, pause, hit
reactions, respawn, and Cinema transitions. Then fix the owning
timer/state/input-reset invariant. **Do not add a watchdog that resets a stuck
attack** — that hides the bug. Every attack must return to neutral even when
interrupted, and its hit window must stay synchronized with its pose.

**The planted kick pose.** At the signature kick's peak, Turbo reads as a
standing, planted horizontal figure:

- one support leg straight and vertical, foot planted on `groundH`;
- pelvis/torso at roughly waist height;
- torso straight, face-down, parallel to the ground;
- both arms extended straight forward;
- the other leg extended straight backward.

Like he is lying flat on his stomach in midair, held up by the single vertical
leg. Nothing but the planted foot enters the ground. Blend in and out of this
silhouette without teleporting the root or changing collision height.

**Acceptance:** punch, normal kick, charged windmill punch and charged planted
kick all still work after ≥100 mixed attacks and every interruption listed
above; no stuck input or state; the planted foot follows slopes while hips,
torso, arms and rear leg stay above terrain; hit geometry matches the visible
attack.

## Commit 2 — OP2-D: shadows and footsteps

**Shadows.** A person shadow is a ground-plane projection and must never
inherit the character mesh's fall rotation. Give each live person a cheap
ground-anchored shadow update following world X/Z at `groundH + 0.03`. Upright:
the current compact foot/torso ellipse. As knockdown or death tips the body
over, ease across ~0.15–0.25 s into a longer body-shaped horizontal shadow
aligned under the fallen torso and legs; reverse on recovery. Share geometry
and materials, preserve pooling, and hide or dispose the shadow exactly with
its actor. **No real-time shadow maps** — this is a mobile browser game.

**Footsteps.** Replace the current footstep with a Turbo-only system driven by
real left/right gait-phase crossings in `updateFoot()`, not a per-frame timer.
Restrained alternating variants for asphalt/concrete, grass, sand and
roof/interior, plus a separate landing thump. Cadence follows walk/run/sprint;
volume, low-end and pitch respond subtly to speed and Turbo's scale without
going cartoony or machine-gun. Silence steps while airborne, stationary,
stunned, attacking without foot motion, in vehicles, paused, replaying or in
cutscenes. Use the existing SFX mix/unlock path and cap overlap so a dropped
frame cannot emit several steps at once.

§AUDIO's `let AC=null,…` declaration line and the `exitCarSoft()` reset block
are the repo's most-conflicted lines. Add the minimum here and flag it under
**Shared-file touches**.

**Acceptance:** upright shadows stay flat at the feet; falling characters
visibly transition to a horizontal body shadow; no shadow goes vertical,
floats, survives pooling/removal, or stays body-shaped after recovery. One
alternating step per planted stride at walk/run/sprint; surface changes
audible but coherent; landings have weight; no airborne or idle spam.

## Tests

Extend `tests/cases/charged-melee.test.js` with the lockout stress (≥100 mixed
attacks across interruptions, asserting a neutral end state) and pose sampling
at the kick peak. Add `tests/cases/shadow-footsteps.test.js` for shadow
orientation/lifecycle and footstep cadence/gating state.

```bash
cd tests && node syntax-check.js && node run.js charged-melee && node run.js shadow-footsteps
```

Then take side and front screenshots of the kick peak, and listen to the steps
at all three speeds. **The final sound quality cannot be approved by
assertions** — say in your report that it needs the owner's ears.

## Out of scope

Traffic, roads, rats, Cinema, Turbo Mode, mission UI, explosions.

## Done

Update your `STATUS.md` row to DONE in ≤3 lines, push
`-u origin claude/op2cd-melee-grounding`, and report both commit hashes, both
test results, and exactly what still needs an owner playtest.
</content>
