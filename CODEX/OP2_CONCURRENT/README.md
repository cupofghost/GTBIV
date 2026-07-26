# OP2 Concurrent Agent Dispatch

This directory is the tracked launch packet for four concurrent GTB4
improvement agents. It does not change the authoritative `NEXT: FB3` marker.
Use it only when the owner explicitly starts this batch.

## Required base

Every agent must start from commit `1abc365` or a descendant containing:

- the owner-expanded RV2 Mama Rat specification;
- `HANDOFF.md` Phase 11 (`OP2-A` through `OP2-G`);
- `HANDOFF.md` Phase 12 (Turbo Mode; not part of this batch).

Before editing, verify:

```bash
git merge-base --is-ancestor 1abc365 HEAD
git status --short --branch
```

If the ancestry check fails or the worktree is dirty, stop and report it.
Never copy the game into this dispatch directory. Game changes stay in the
normal root files (`index.html`, `js/`, and `tests/`) on isolated branches.

## Agent assignments

| Agent | Brief | Required model | Effort | Branch |
|---|---|---|---|---|
| 1 | [Mama Rat model and animation](AGENT_1_RV2_MAMA_RAT.md) | `gpt-5.6-sol` | `high` | `codex/rv2-mama-rat` |
| 2 | [Roads, manholes, and sidewalks](AGENT_2_OP2A_ROADS_SIDEWALKS.md) | `gpt-5.6-sol` | `high` | `codex/op2-road-sidewalk` |
| 3 | [Vehicle sanity and impact damage](AGENT_3_OP2B_VEHICLES.md) | `gpt-5.6-sol` | `xhigh` | `codex/op2-vehicle-sanity` |
| 4 | [Melee, shadows, and footsteps](AGENT_4_OP2C_D_MELEE_GROUNDING.md) | `gpt-5.6-sol` | `xhigh` | `codex/op2-melee-grounding` |

Each agent receives only its linked brief. The model and execution effort are
required, not suggestions. `AGENTS.md` limits its signature effort field to
`low / medium / high`, so an agent running at `xhigh` reasoning records
`high` in commits and `STATUS.md`:

```text
Signed: Codex | GPT-5.6 | high
```

## Concurrency and ownership

- Use four isolated branches/worktrees. Never run all four agents in one
  working directory.
- Every agent reads `AGENTS.md` and `STATUS.md`, then claims its exact card.
- Each agent may edit only its assigned runtime sections, focused tests, and
  its own `STATUS.md` claim/handoff row.
- Do not edit `HANDOFF.md` or this dispatch directory during implementation.
- Do not merge, push, or fast-forward `main`.
- A feature branch may be pushed and opened as a draft PR when available.
- `STATUS.md` conflicts are expected during integration; preserve every
  agent's completed row instead of taking one branch's whole file.
- If two agents discover they need the same runtime function, both stop that
  part and report the overlap to the integrator. Do not silently widen scope.

Primary code ownership:

| Agent | Owned areas | Avoid |
|---|---|---|
| 1 | Rat mesh, Mama Rat update/animation, rat tests | General person rig, terrain generation, vehicles |
| 2 | Road markings, manholes, sidewalks, terrain-conformance tests | `groundH` contract changes, vehicles, characters |
| 3 | Traffic steering/spawn/recovery, jackability, car→Turbo impact | Road visuals, melee, Cinema, explosions |
| 4 | Melee/updateFoot, person shadows, Turbo footsteps, focused tests | Traffic, roads, rats, Cinema, Turbo Mode |

## Integration

Do not integrate until all four agents report their commit hashes and focused
test results. Recommended order:

1. Agent 2 — OP2-A terrain/road visuals.
2. Agent 1 — RV2 Mama Rat.
3. Agent 3 — OP2-B vehicles.
4. Agent 4 commit 1 — OP2-C melee.
5. Agent 4 commit 2 — OP2-D shadows/footsteps.

After each integration, resolve only real overlaps, regenerate the `index.html`
code map if line numbers moved, and run the newly integrated task's focused
tests. Run the full suite once after the final branch is integrated, then do
the required visual/listening playtests. Do not automatically begin OP2-E,
OP2-F, OP2-G, AF, FB3, or Turbo Mode.
