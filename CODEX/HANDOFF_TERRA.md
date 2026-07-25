# Terra handoff — requested gameplay pass

Branch: `codex/audit-fixes-1-3-5`  
Draft PR: `cupofghost/GTBIV#40`  
Checkpoint base: `d3e5859`

Read root `AGENTS.md`, `STATUS.md`, and `TERRAIN.md` before continuing. Keep
using this branch and PR. Do not change offline behavior. Dogs must not simply
disappear: ownerless dogs become an internal stray population.

## Implemented in the Codex checkpoint

- Added `CODEX/README.md` and named Codex in the unified agent workflow.
- Added obstacle-aware intro-camera routing around building, tree, prop,
  vehicle, and ramp volumes; the final shots acquire Turbo, pan down, and move
  in while keeping him as the look target.
- Seated parked/moving cars, pedestrians, dogs, gang members, jocks, guards,
  foot cops, and helicopters on `groundH` at creation. Parked cars also start
  pitched to the grade.
- Civilian traffic now faces its selected adjacent intersection before moving.
  Grounded cars resample terrain after horizontal integration/collision, fixing
  the one-frame hill lag that buried uphill tyres and floated downhill tyres.
- Turbo now has deterministic short spiky blond hair, no beard, and a pink
  geometry `T` on the back of his blue shirt.
- Restored full on-foot control layout before proximity early-returns, and made
  normal/soft car exits reset visibility, speedometer, labels, and layout.
- Kept `G`/SWAP as the weapon cycle, clarified labels/help, and added an
  unarmed `K`/KICK action. Kicks have a slower 0.9s animation, 44 damage, longer
  reach, and twice the normal knockback.
- Added close left-shoulder firearm framing: the camera moves about two-thirds
  closer, Turbo appears to the right of the reticule, and his body becomes
  transparent while the weapon remains opaque.
- Dead-owner dogs persist nearby. Beyond one full block they are removed from
  the live scene, increment persisted `G.strayDogCount`, and later regenerate
  as capped city packs whose size grows with the count.

## Still required from the owner's request

1. Replace the current explosion rise particles with a longer-lived red sphere
   that rises after blooming and becomes the cap of a solid mushroom-cloud
   stem. Remove the rising sparkle emitter.
2. Make every Turbo path MP3-only. In particular, remove generated-speech
   fallbacks in `updateIntroNarration()` and the `showDialogue()` override.
   Unrecorded Turbo lines should stay silent/subtitled until recordings exist;
   Deb/NPC generated speech may remain.
3. Add focused Playwright coverage for the new checkpoint behavior and visually
   tune the intro/aim camera if needed.
4. Regenerate the mechanical `// CODE MAP` line ranges after the remaining
   `index.html` edits; do not hand-adjust them mid-pass.

## Validation state

- `node tests/syntax-check.js`: PASS.
- Focused Playwright run could not start Chromium in the Codex macOS sandbox:
  `MachPortRendezvousServer ... Permission denied (1100)`. The suite did not
  reach a game test. Use GitHub Actions or a normal local shell; do not treat
  this as a test failure.
- Run at minimum: `intro-camera`, `terrain`, `control-feel`, `camera-polish`,
  `new-features`, and `weapon-sounds`, plus any new focused cases.

When finished, update the active `STATUS.md` row, use the required signed
commit message, push this same branch, and update draft PR #40.
