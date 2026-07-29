# Agent 3 — OP2-E: quieter mission UI and head-anchored speech bubbles

**Model:** Sonnet 5 · **Effort:** medium · **Branch:** `claude/op2e-mission-ui-bubbles`
**Card:** `HANDOFF.md` Phase 11 → OP2-E (`P1 · Risk: Low–Med`)
**Signature:** `Signed: Claude Code | Sonnet 5 | medium`

## Owner direction

> Mission buttons and notifications should be smaller, more translucent, and
> out of the way. The context-sensitive STEAL CAR control is the only current
> large action button to preserve. Speech-bubble tails should appear to come
> from the speaking NPC's head from the current camera view.

## Read first

`AGENTS.md`, `STATUS.md`, then `index.html` §HUD / TOASTS (~7580), §MISSIONS
(~7624) for the offer/status notices, §TALKING PEDS (~5785) for the bubble
system, and `tests/cases/bubble-occlusion.test.js` +
`mission-opt-in-hud.test.js` for the behavior you must not break. The CSS lives
in the `<style>` block near the top of `index.html`.

## Approach

**Mission UI.** Convert mission offers and status notices into compact
translucent edge/corner chips. They must avoid the reticule, the wanted stars,
the Turbo Mode slot (top-right, reserved by Phase 12 — leave it clear), the
touch controls and phone cutouts. Critical text stays readable and tappable;
mission state must never become invisible. **Preserve the large STEAL CAR
control** at its current prominence whenever a valid car is in range — it is
the one big button the owner wants kept.

**Bubble tails.** Project the speaker's head position to screen, place and size
the bubble as it is placed today, then position, rotate and clamp its tail
along the bubble edge pointing back at that projected head. Share one
calculation across generic speech, chats, jocks and Deb — do not fork it four
ways. Preserve the existing building occlusion, range and expiry rules, and the
**no-per-frame-DOM-allocation** rule: reuse nodes, write transforms.

## Acceptance

- Mission UI never dominates the center of the screen on desktop or at
  800×390; buttons stay usable at that size; STEAL CAR stays prominent.
- Every visible bubble tail points back at its speaker's projected head as the
  camera moves, including edge-clamped bubbles.
- Occluded speakers still hide their bubbles; range and expiry unchanged.
- No new per-frame DOM allocation.

## Tests

Extend `tests/cases/mission-opt-in-hud.test.js` for chip geometry inside the
800×390 safe area and for STEAL CAR's preserved size, and add tail-direction
assertions (tail angle vs. projected head direction, including a clamped-edge
case) to `tests/cases/bubble-occlusion.test.js`.

```bash
cd tests && node syntax-check.js && node run.js mission-opt-in-hud && node run.js bubble-occlusion
```

Then screenshot the HUD at 800×390 and at desktop width with a mission offer
up and an NPC talking. Layout is an eyeball judgement — include those shots or
describe them in your report.

## Out of scope

3D world geometry, camera behavior, combat, audio, the Turbo Mode button
itself (Phase 12 owns it — just leave its slot free), and any other OP2 card.

## Done

Update your `STATUS.md` row to DONE in ≤3 lines, push
`-u origin claude/op2e-mission-ui-bubbles`, and report your commit hash, test
results, and what the owner should look at.
</content>
