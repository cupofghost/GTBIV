# Lessons learned — PV production-value pass (2026-08-07)

One session, one branch (`claude/game-production-value-dzzac5`), 15 commits.
Shipped the post-FX stack, slow motion, the action bail-out, explosion carnage,
rampage combos, mp3-only voice, bike riders, the coast highway, the beach shelf
and half the skyline work. Details are in `HANDOFF.md` Phase 13. This page is
only the process findings — the things that should change how the next batch is
planned.

## 1. Per-feature tests passed. The full suite found a real bug.

I wrote 11 test files (~60 cases) and every one was green. The cross-cutting run
then caught a genuine gameplay defect: three ground-height lookups had a hidden
"never below zero" floor, left over from an era when the terrain never went
negative. With the new beach, **Turbo would have walked across the top of the
sea.**

My own beach tests missed it because they measured the height *field* and never
put a moving body through it. A test from a different feature, about falling,
caught it.

**Takeaway:** on anything touching the render path, terrain or the main loop,
the full suite is the gate — not the feature's own tests. It costs ~28 minutes.
Budget it.

## 2. A test that only passes in isolation is worse than no test.

Two of my own tests passed alone and failed in the full run, because they
assumed a quiet world: they set up state in one step and asserted in the next,
while the live game loop kept running in between. The isolated pass is the one
you look at, so this actively misleads.

**Takeaway:** new tests should be run inside a full suite at least once before
they are trusted. "Green on my feature" is not a signal.

## 3. Single-seed tests give false confidence.

Several existing tests pin one random seed and treat one sample as proof. Any
change to world generation re-rolls the world for that seed, so they fail for
reasons unrelated to the change — and they were only ever passing by luck.

Measured on **untouched `main`**: the traffic pile-up case fails on 4 of 16
seeds (25%), and the stair-descent case fails on seed 777. Both were "passing"
before purely because their pinned seed happened to dodge the problem.

**Takeaway:** these tests are hiding two real, live defects. They should sample
several seeds, or the underlying behaviour should be fixed. Right now they are
scoring the dice, not the code. Logged in `STATUS.md`.

## 4. Performance could not be measured here at all.

The dev environment renders in software, which has nothing in common with a
phone GPU — it reported the cheaper graphics tier as 2.5× *slower* than the
expensive one. I stopped rather than quote a number, because a misleading
figure is worse than none.

**Takeaway:** the new visual effects are unverified on real hardware. They have
a quality tier and an off switch (**Settings → FILM FX**), but a device
playtest is the only real check. Visual work needs a device gate in the
schedule; "tests pass" is not performance evidence.

## 5. Long-settled invariants are expensive to change.

The beach change was one line of maths in one function, gated to the shoreline.
It still broke four tests, because an unwritten assumption — "ground is never
below zero" — had been baked into three separate places over time.

**Takeaway:** when a change touches a documented contract (here, `TERRAIN.md`),
the cost is not the edit. It is finding everything that quietly depended on the
old shape. Scope those tasks accordingly.

## Recommended next steps

1. **Consolidate this branch before another agent opens `index.html`.** It adds
   five new sections and touches the terrain field, the audio graph and the main
   loop.
2. **Device playtest**, in this order: the beach, slow motion, then a car
   explosion. Those are the newest and least covered.
3. **Decide on the seed-pinned tests** — fix the behaviour or make them sample
   properly. They are currently a source of noise that trains people to ignore
   red.

Signed: Claude Code | Opus 5 | high
