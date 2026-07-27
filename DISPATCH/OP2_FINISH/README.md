# OP2 Finish — five-agent concurrent dispatch

This is the tracked launch packet for **five concurrent Claude agents** that
finish HANDOFF.md **Phase 11 (OP2)**. OP2-B (vehicle sanity) already landed as
`13150f8`; the five cards here are the remaining OP2-A, C, D, E, F, G.

This packet does not change the authoritative `NEXT: FB3` marker in
`HANDOFF.md` §10. Use it only when the owner starts this batch.

## Base

Every agent starts from the branch that carries this packet:

```bash
git fetch origin claude/gtbiv-concurrent-agents-wy8o5n
git checkout -b <your card branch> origin/claude/gtbiv-concurrent-agents-wy8o5n
test -f DISPATCH/OP2_FINISH/README.md && git status --short --branch
```

That branch is `main` plus these documents — no game-code changes. If the
file check fails or your worktree is dirty, stop and report it.

## Cards

| Agent | Card | Brief | Model | Effort | Branch |
|---|---|---|---|---|---|
| 1 | OP2-A road & sidewalk visual integrity | [AGENT_1_OP2A_ROADS_SIDEWALKS.md](AGENT_1_OP2A_ROADS_SIDEWALKS.md) | Sonnet 5 | high | `claude/op2a-roads-sidewalks` |
| 2 | OP2-C + OP2-D melee, shadows, footsteps | [AGENT_2_OP2CD_MELEE_GROUNDING.md](AGENT_2_OP2CD_MELEE_GROUNDING.md) | Opus 5 | xhigh | `claude/op2cd-melee-grounding` |
| 3 | OP2-E quiet mission UI & bubble tails | [AGENT_3_OP2E_MISSION_UI_BUBBLES.md](AGENT_3_OP2E_MISSION_UI_BUBBLES.md) | Sonnet 5 | medium | `claude/op2e-mission-ui-bubbles` |
| 4 | OP2-F planned cinematic camera routes | [AGENT_4_OP2F_CINEMATIC_ROUTES.md](AGENT_4_OP2F_CINEMATIC_ROUTES.md) | Opus 5 | high | `claude/op2f-cinematic-routes` |
| 5 | OP2-G car failure, one explosion, lethal falls | [AGENT_5_OP2G_EXPLOSION_FALLS.md](AGENT_5_OP2G_EXPLOSION_FALLS.md) | Sonnet 5 | high | `claude/op2g-explosion-falls` |

The model and effort are requirements of the card, not suggestions. Cards 2
and 4 are the high-risk state-machine and geometry-reasoning work; cards 1, 3
and 5 are bounded enough for Sonnet.

`AGENTS.md` §5 limits the signature effort field to `low / medium / high`, so
an agent running at `xhigh` records `high`:

```text
Signed: Claude Code | Opus 5 | high
```

## Self-claim protocol (all five agents get the same prompt)

1. Work out which model you are running.
2. Read the table top to bottom. Take the **first** card whose Model column
   matches yours and whose branch is absent from
   `git ls-remote --heads origin`.
3. Create that branch off the base, add your `STATUS.md` **Active work** row
   (per `AGENTS.md` §1.3, escaping the pipes in your signature as `\|`), commit
   it as your claim, and `git push -u origin <branch>` **before writing any
   game code**.
4. If that push is rejected because another agent got there first, reset to the
   base, move to the next matching unclaimed card, and repeat.
5. If no unclaimed card matches your model, take the first unclaimed card of
   any model and say so in your report.

The claim commit is the lock. A branch that exists on `origin` is taken.

## Ownership

| Agent | Owns | Must not touch |
|---|---|---|
| 1 | Road markings, manhole meshes, sidewalk seating, §CITY street dressing, §SIDEWALKS & STOREFRONT AWNINGS | `groundH` itself, vehicles, characters, HUD |
| 2 | Melee state/timers, `updateFoot()` poses, `makeShadow`/§BLOB SHADOWS, `js/person.js` shadow child, footstep SFX in §AUDIO | Roads, traffic, Cinema, mission UI, explosions |
| 3 | §HUD / TOASTS mission chips, §MISSIONS notification calls, speech-bubble DOM/projection in §TALKING PEDS | 3D world geometry, camera, combat, audio |
| 4 | §ANIMATED INTRO `flySample`/route planning, §CINEMA MODE, §CINEMA: SCENES & STAGING camera paths | Scene *content* other agents own, explosions, melee |
| 5 | Car damage/critical fuse in §CAR PHYSICS, `boomFx` explosion effect, fall tracking into §BUSTED / WASTED | Traffic steering, road visuals, cinema camera, HUD layout |

Everyone owns their own focused tests under `tests/cases/` and their own
`STATUS.md` row. Nobody edits `HANDOFF.md`, this packet, `TERRAIN.md`, or
another agent's row.

## Standing rules

- One card, one branch, one worktree. Never run two of these agents in the
  same working directory.
- Do not merge, rebase onto, or push `main`. Do not merge another agent's
  branch into yours.
- Preserve, in every card: deterministic `_rng`, the `groundH` contract, pool
  bounds and mission/Cinema pool exclusions, save-blob compatibility, phone
  safe areas at 800×390, and the zero-build deploy (no bundler, no CDN).
- Shared-file touches beyond your owned sections go in `STATUS.md` under
  **Shared-file touches**, smallest possible change, flagged.
- If your card turns out to need a function another agent owns, stop that part,
  leave it undone, and report the overlap. Do not widen scope silently.
- `index.html`'s `// CODE MAP` line numbers will go stale on every branch.
  Leave them alone — the integrator regenerates them once at the end.

## Testing

```bash
cd tests
node syntax-check.js
node run.js <your-test-substring>
```

Test only what you changed, once, at the end (`AGENTS.md` §4). Do not run the
full suite and do not re-verify other agents' signed work. `save-restore` and
later cases are known to time out in some sandboxes — see **Known issues** in
`STATUS.md`; that is environmental, not yours to fix.

Cards 2, 3, 4 and 5 each end in something assertions cannot approve — a pose,
a layout, a camera move, a sound. Say plainly in your report what still needs
the owner's eyes or ears.

## Integration (owner or integrator, after all five report)

Merge in this order, resolving only real overlaps, and running just the newly
merged card's focused tests after each step:

1. Agent 1 — OP2-A road/sidewalk geometry (world base).
2. Agent 5 — OP2-G explosion and fall damage.
3. Agent 2 — OP2-C/D melee, shadows, footsteps.
4. Agent 3 — OP2-E mission UI and bubble tails.
5. Agent 4 — OP2-F cinematic routes (last: it frames everything above).

`STATUS.md` will conflict at every step. Keep every agent's completed row;
never take one branch's whole file. After the last merge, regenerate the
`index.html` code map from the section banners, run the full suite once, then
do the owner playtest: a drive, a fight, a cutscene, a car explosion, a fall.

Do not roll on into RV2 (Mama Rat), Phase 10 (AF), FB3, or Turbo Mode.
</content>
</invoke>
