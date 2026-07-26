# Agent 3 — OP2-B Vehicle Sanity, Jackability, and Impact Damage

```text
Required model: gpt-5.6-sol
Required reasoning effort: xhigh
Required branch: codex/op2-vehicle-sanity
Required base: commit 1abc365 or a descendant

Implement HANDOFF.md task OP2-B — Civilian vehicle sanity, jackability, and
impact damage.

START
1. Verify `git merge-base --is-ancestor 1abc365 HEAD` succeeds and the worktree
   starts clean. Stop if it does not.
2. Read AGENTS.md, STATUS.md, HANDOFF.md OP2-B, then only relevant traffic,
   pooling, spawn-safety, car physics, collision, and enter/exit code.
3. Claim OP2-B in STATUS.md using:
   Signed: Codex | GPT-5.6 | high
4. Do not edit road visuals, melee, Cinema, explosions, Turbo Mode, HANDOFF.md,
   or CODEX/OP2_CONCURRENT/.

OWNER PROBLEMS
- Traffic frequently drives erratically.
- Cars clip into buildings.
- Many ordinary cars become impossible to steal.
- A sufficiently fast car hitting Turbo should damage him.

WORK
- Reproduce and measure erratic traffic before tuning.
- Keep generic traffic lane-aligned with bounded steering/speed correction.
- Improve avoidance/recovery without making all cars slow or sparse.
- Prevent generic vehicle spawns inside building/static footprints.
- Recover an embedded generic car to a valid road, or safely retire/recycle it
  if recovery fails.
- Never recycle player, police, mission, special parked, or Cinema vehicles.
- Make every reachable ordinary civilian car explicitly jackable.
- Document intentional non-jackable classes.
- Ensure clipping/stale traffic state cannot accidentally disable carjacking.
- Add car→Turbo damage from relative horizontal impact speed:
  trivial nudge = none/negligible; meaningful hit = damage/reaction; extreme
  hit may use normal WASTED flow.
- Add a per-contact cooldown so one overlap cannot damage Turbo every frame.
- Preserve deterministic RNG, density, pools, wanted behavior, missions, car
  audio, and the large STEAL CAR control.

ACCEPTANCE
- Seeded traffic travels several blocks without chronic weaving, spins,
  building embeds, or mass pileups.
- Sampled ordinary civilian cars remain jackable.
- Embedded recovery leaves no stranded unjackable generic car.
- Impact damage increases monotonically with relative speed.
- One collision creates one damage event per contact window.
- Add focused vehicle-sanity tests.
- Run syntax, traffic-pooling, spawn-safety, control-feel, and the new focused
  tests once at the end.
- Perform one short downtown driving/carjacking check.

FINISH
- Update your STATUS row with measurements and results.
- Scan the diff for secrets/PII.
- Commit once with an imperative subject and:
  Signed: Codex | GPT-5.6 | high
- Push only the feature branch and open a draft PR if available; never merge.
- Report commit hash, touched files, tests, measurements, uncertainties, and
  the consolidation check.
```
