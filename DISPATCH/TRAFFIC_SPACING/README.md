# TS — Traffic spacing: the pileup `vehicle-sanity` has been hiding

Single-agent dispatch packet, opened 2026-08-10 at the thirteenth consolidation.

This card was **OP2-B's area (Codex)** and was left for them under AGENTS.md §4a
— log an unrelated failure, don't fix it unasked. The owner has reassigned it:
Codex is out of usage, and the defect has now survived two consolidations.

This packet does **not** move the authoritative `NEXT:` marker in `HANDOFF.md`
§10. Everything else open there is owner-gated; this is the one open item that
is an agent's to do.

## Base

```bash
git fetch origin main
git checkout -b claude/traffic-spacing origin/main
node tools/preflight.js --touching "index.html updateTraffic, tests/cases/vehicle-sanity.test.js"
```

Push the claim commit **before** writing game code — AGENTS.md §2a: the pushed
branch is the lock.

| | |
|---|---|
| Branch | `claude/traffic-spacing` |
| Model | Opus 5 (this is behaviour work in a live simulation, not a bounded edit) |
| Effort | high |
| Area | `index.html` `updateTraffic` (line ~10072, §CARS), `tests/cases/vehicle-sanity.test.js` |

## What is actually wrong

`tests/cases/vehicle-sanity.test.js`'s first case — *"seeded civilian traffic
stays lane-bounded and travels several blocks without embeds or pileups"* —
asserts, over 1200 frames at seed `424242`:

```js
assert(r.maxClosePairs < 4 && r.massPileupFrames === 0, 'traffic formed a mass pileup: ' + …);
```

A "close pair" is two civilian cars within **2.2u** of each other; four or more
simultaneously counts as a pileup frame.

**Measured on untouched `main`, one seed at a time: it fails on seeds 99, 11,
44 and 77 — 4 of 16 tested, a 25% real failure rate.** Seed `424242` passed for
a long time by luck. PV3 changed how many RNG draws city build consumes (tree
placement now rejection-samples), which re-rolled every seed's world, and
`424242` landed on a layout where the clustering shows: 6 cars within 2.2u for
51 of 1200 frames, with `carsWithEmbeds: 0` — so nothing is stuck inside
geometry, they are simply bunching.

The pileup is a pre-existing, layout-dependent property of `updateTraffic`.
The pinned seed was dodging it, not disproving it.

Repro on a clean `main`:

```bash
sed -i 's/seed=424242/seed=99/' tests/cases/vehicle-sanity.test.js
cd tests && node run.js vehicle-sanity
```

Note the case's own instability: it has been observed to **pass in a full-suite
run and fail when the file is run alone**. Treat "it passed once" as no signal
at all here — sample seeds explicitly.

## The job, in order

1. **Quantify before changing anything.** Run the case across a fixed seed set
   (the 16 above, or your own list — write it down) and record pass/fail plus
   `maxClosePairs` and `massPileupFrames` per seed. That table is the baseline
   the fix is judged against, and it belongs in the PR.
2. **Find why they bunch.** The interesting state is in `updateTraffic`: lane
   targets, the follow/brake logic, and what happens when several cars converge
   on the same lane target or intersection. A throwaway diagnostic case under
   `tests/cases/` that logs per-frame positions and gaps for the offending
   cars, then gets deleted, is the cheapest tool here — that is how the PV
   grounding bug was found.
3. **Fix the behaviour, not the sample.** Separation/headway in `updateTraffic`
   is the target: cars should hold a gap without deadlocking at intersections
   or collapsing density (`r.count >= 28` is asserted).
4. **Then, and only then, decide about the test.** With the behaviour fixed,
   the case should pass across the whole seed set. If you want it to keep
   sampling more than one seed, that is a welcome change.

## Acceptance

- The seed table from step 1, re-run after the fix, passes on every seed it
  covers — not just `424242`.
- The rest of that case's assertions still hold: density `>= 28`, mean distance
  `> 264`, `maxHeadingStep < 0.065`, zero embeds, `meanStraightFlips < 3` /
  `maxStraightFlips < 12`.
- `vehicle-sanity` passes **run alone and inside the full suite**.
- The full suite is green. It is ~278 cases, ~27 min, and CI owns it — but
  traffic touches spawn, missions and the car lifecycle, so this is exactly the
  cross-cutting case AGENTS.md §4a says to let CI run.

## Do not

- **Do not re-pin the seed to one that passes.** That is the single failure
  mode this card exists to prevent; it hides a 25% rate and trains people to
  ignore red.
- Do not relax `maxClosePairs`/`massPileupFrames` to make the assertion fit the
  current behaviour without saying so and explaining why the new number is the
  right one.
- Do not refactor `updateTraffic` wholesale. R2's bounded free-lists and
  active-array retirement live there, and mission/cinema exclusions must stay
  intact (`STATUS.md` → Shared-file touches).

## One thing worth checking while you are in this file

The case parks the player at `player.x = H + 100; player.z = H + 100`. In
`fall-damage.test.js` that exact position turned out to be **67u past the map
edge — open ocean**, and it only behaved like ground because `groundH` returned
a phantom positive height out there; PV4's shore shelf made it honest. Here it
is probably harmless (the intent is just to keep the player away from traffic),
but confirm it rather than assume — and if it matters, `H + 8` is real open
ground past the city.

## Not in this packet

These are open but **owner-gated** — do not pick them up as "next":

- **Post-FX cost on real hardware.** Unmeasured; this environment renders in
  software and reported the cheap tier as 2.5× *slower* than the expensive one.
  Needs the owner on a device: beach → slow motion → car explosion.
- **PV5's second half** — the city footprint is still a square.
- **Wiring the script.** `SCRIPT*.md` (#47) landed as docs; none of it is in
  the game. That is a large piece of work and needs the owner to scope it.
- `RV2`/`RV3`, `TM`, `AF`, `X1` — see `HANDOFF.md` §10.

## Housekeeping the card still owes

`AGENTS.md` §1 and §6: claim your row in `STATUS.md` **Active work** before you
write code, sign every commit and every STATUS row
(`Signed: <program> | <model> | <effort>`), and run the §7 consolidation check
at the end. If you touch `index.html`, `node tools/codemap.js --write` before
you push — CI fails on code-map drift.

Signed: Claude Code | Opus 5 | high
