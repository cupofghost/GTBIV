# Lessons Learned — Shared Knowledge Base

> **Format:** Date • Agent • Lesson • Action
>
> Update this weekly or after solving something hard. Help the next agent avoid the same wall.

---

## Sprint 1 (Aug 7–?)

### Claude Code
- **Date:** 2026-08-07
- **Lesson:** Preflight validation catches shared-file touches early, but don't edit STATUS.md directly in commits—leave space for Haiku to verify claims first.
- **Action:** Log shared-file touch entry, but let preflight pass before push.

---

## Sprint 2 (TBD)

_(Lessons logged after first sprint closes)_

---

## Sprint 1 postscript — the PV batch and its follow-up (2026-08-07 → 08-10)

One branch, 16 commits: the post-FX stack, slow motion, the action bail-out,
explosion carnage, rampage combos, mp3-only voice, bike riders, the coast
highway, the beach shelf and half the skyline work. What shipped is in
`HANDOFF.md` Phase 13 — below is only what the process taught, from the batch
itself and from the follow-up session that took it to green.

**1. Per-feature tests passed. The full suite found the real bug.** Eleven new
test files, ~60 cases, all green. The cross-cutting run then caught a genuine
defect: three ground-height lookups had a hidden "never below zero" floor left
over from an era when terrain never went negative. With the new beach, Turbo
would have walked across the top of the sea. The beach's own tests missed it
because they measured the height *field* and never put a moving body through
it — a test about *falling*, from another feature, caught it.

**2. A test that only passes in isolation is worse than no test.** Two of the
batch's own tests passed alone and failed in the full run: they set up state in
one step and asserted in the next, while the live game loop kept running in
between. The isolated pass is the one you look at, so it actively misleads.

**3. Single-seed tests score the dice, not the code.** Any change to world
generation re-rolls the world for every seed, so pinned-seed cases fail for
reasons unrelated to the change — and were only passing by luck. Measured on
untouched `main`, the traffic pile-up case fails on 4 of 16 seeds. It is still
open in `STATUS.md` for exactly that reason: do not "fix" it by re-pinning to a
seed that passes.

**4. Performance could not be measured here at all.** This environment renders
in software and reported the *cheap* graphics tier as 2.5× slower than the
expensive one. Better to ship no number than a misleading one — but it means
the visual work is unverified on real hardware. It has a quality tier and an
off switch (**Settings → FILM FX**); a device playtest is the only real check,
in this order: **the beach, then slow motion, then a car explosion**, which are
newest and least covered.

**5. Long-settled invariants are expensive to change.** The beach was one line
of maths in one function, gated to the shoreline. It still broke four tests,
because an unwritten assumption had been baked into three separate places over
time. When a change touches a documented contract, the edit is the cheap part;
finding everything that quietly depended on the old shape is the cost.

The follow-up session added three more, and they are the ones that cost the
most time:

### Claude Code
- **Date:** 2026-08-10
- **Lesson:** "This test also fails on `main`" is a claim, not a finding. Three
  failures were handed over that way. Checked against `main` one file at a
  time, **`main` passed all three** at the seeds those files actually pin — all
  three were real regressions the batch had introduced, and each pointed at a
  live gameplay bug (a landing thump on every frame of a downhill jog; fire
  escapes with their bottom steps buried in a hillside).
- **Action:** before logging a failure as pre-existing, run that one file on a
  clean `main` checkout at the seed the file pins, and put the result in the
  note. It costs about 40 seconds. The wrong version of that sentence sends the
  next session hunting a phantom.

- **Date:** 2026-08-10
- **Lesson:** A plausible mechanism is not a diagnosis. The gait failure was
  written up as "he goes briefly airborne, which resyncs the step counter" —
  reasonable, wrong. Instrumented, the sprint never left the ground (peak gap
  0.001u); the real cause was that any gap over 0.001u counted as a fall, so a
  jog down a slope re-landed every single frame.
- **Action:** when a test fails on state you can't see, print the state. A
  throwaway diagnostic case in `tests/cases/` that logs the frame trace and gets
  deleted afterwards is the cheapest tool in this repo.

- **Date:** 2026-08-10
- **Lesson:** A test that pins no seed builds a different city every run. That
  is the whole explanation for "passes alone, fails in the suite" in
  `bail-out.test.js` — not machine load, which is where two sessions looked
  first.
- **Action:** pin `?…&seed=424242` in any case that steps the world. Before
  pinning, check the assertion across a dozen seeds — if it only passes on one,
  the seed is hiding a defect and pinning it is the wrong fix (see
  `vehicle-sanity` in `STATUS.md`, still open for exactly that reason).

---

## Timeless Lessons

_Things everyone should know:_

- Run `node tools/haiku-check.js` before every commit. It catches most discipline issues instantly.
- Commit message signatures are mechanical: `Signed: <program> | <model> | <effort>`. Typos fail preflight.
- One logical change per commit. A feature that spans 3 commits is 3 logical units. Git history should read like a story.
- If a test was passing before you touched it, keep it passing. Regressions are expensive to debug later.
- HANDOFF.md status updates (moving NEXT marker) happen AFTER tests green, not during development.
- Per-feature tests are not a gate for anything that touches the render path, terrain or the main loop. Green-on-my-feature missed a bug that would have let Turbo walk across the top of the sea; a *falling* test from another feature caught it. Budget the ~27 min full run for cross-cutting work.
- A test that only passes in isolation is worse than no test — the isolated pass is the one you look at. Run a new case inside a full suite once before trusting it.
- "Tests pass" is never performance evidence. This environment renders in software and has reported the *cheap* graphics tier as 2.5× slower than the expensive one. Visual work needs a real-device playtest in the schedule.
- When a change touches a documented contract (`TERRAIN.md`, the save blob, the audio graph), the edit is the cheap part. The cost is finding everything that quietly depended on the old shape — one line of beach maths broke four tests through an unwritten "ground is never below zero" assumption baked into three separate resolvers.

---

## How to Add a Lesson

1. Find the current sprint section
2. Add an entry with **Date** • **Lesson** • **Action**
3. Keep it short (2–3 sentences max)
4. If it's timeless (applies to everyone), add it to the bottom section
5. Commit with signature: `Signed: <program> | <model> | <effort>`

---

**Last Updated:** 2026-08-10 by Claude Code (consolidation — folded the PV batch's process findings in here on the owner's call and retired `LESSONS_PV.md`, so there is one knowledge base rather than two)
