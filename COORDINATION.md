# Lightweight Coordination for Multi-Agent Workflow

Reference: `AGENTS.md` §1–9. This file details the `STATUS.md` practices those rules assume but don't specify.

## For every agent session: claim your work

When you start, add ONE line to `STATUS.md` **Active work** table:

```
| 2026-07-24 | src/audio/ | Wiring voice ducking for new cutscene (add playVOFile to showDialogue). In progress. | Signed: Claude Code \| Opus 4.8 \| medium |
```

- **Date**: today (YYYY-MM-DD)
- **Area / files**: which directories/files you own (e.g. `src/audio/`, `docs/`, `index.html` if you're touching display)
- **Task & state**: one sentence what + current state. Omit if you're done and closing the line.
- **Signature**: `Signed: <program> | <model> | <effort>` (low/medium/high)

## When you find a conflict: flag it early

If your area overlaps with an active entry (same files, same feature), add a line to **Shared-file touches**:

```
| src/audio/index.html | Added voiceGain bus on line 142–156; audio-wiring.test.js also touches this file. | Signed: Claude Code \| Sonnet 5 \| medium |
```

- **File + what changed**: one line what you changed, which lines if specific
- **Note conflict**: "also touches X" or "depends on Y being ready" — tell the owner, don't hide it
- **Signature**: your signature

Owner will either:
- Tell you to wait for the other agent to finish first
- Tell you it's safe to merge (they coordinated offline)
- Tell you to coordinate inside this chat

## When you finish: update and close

Replace your line's task column with ONE of:

**Done:** `DONE — added voice ducking to showDialogue; test suite green (48/48).`

**Handoff:** `HOLD — voice ducking wired, but cutscene pacing needs re-timing before merge. Next: run playtest at 2x speed to find overruns.`

**Blocked:** `BLOCKED — waiting for audio-bus merge from another agent; uncommitted on this branch.`

Then sign off in your commit message (AGENTS.md §6).

## Consolidation: the lightweight handoff (Haiku runs this)

When the owner says "run consolidation" or 2+ weeks pass without a consolidation:

### Checklist (quick read, ~10 min)

1. **Read STATUS.md** fully. Look for:
   - Entries older than 2 weeks (move to Archive, mark stale)
   - Overlapping work in **Active work** or **Shared-file touches** (flag the owner, don't resolve)
   - Multiple agents touching the same file (likely needs coordination)

2. **Archive completed work** — move DONE lines to Archive section:
   ```
   | 2026-07-20 | src/voice/ | Voice wiring for robbery/debt cutscenes (J1). | Signed: Claude Code \| Sonnet 5 \| high |
   ```

3. **Reconcile the board** (AGENTS.md board + GAME_PLAN.md, or equiv for other repos):
   - Grep main for shipped features (e.g. grep for `disposeMesh` if R1 claims it's done)
   - If claimed-done features are present, mark them done on the board
   - If dependencies have shipped, unblock the next items

4. **Scan for secrets** (AGENTS.md §3):
   - Quick grep for email addresses, API keys, usernames in recent commits
   - Report to owner, don't delete silently

5. **Stamp the consolidation**:
   ```
   Last consolidation: 2026-07-24 — Signed: Claude Code | Haiku 4.5 | low
   ```

6. **Report in one sentence** (AGENTS.md §7):
   - "No consolidation needed yet." or
   - "Consolidation recommended: 2 agents touched src/audio/ since last run." or
   - "Consolidation done: archived 3 entries, reconciled board, 0 issues found."

## When work collides: the owner decides, agents implement

If consolidation finds real conflicts (two agents claimed the same file):

1. **Owner chooses resolution** (merge, rebase, restart one agent on a different task)
2. **Next agent** implements the resolution (rebase, cherry-pick, etc.) — this is AGENTS.md's "restarted merged branch" scenario

Coordination doesn't prevent conflicts; it **surfaces them early** so the owner can decide before tokens are wasted on conflicting code.

## Why this is cheap

- Agents: 30-second table edit at session start + commit message signature (already required)
- Haiku: 10-minute consolidation pass every 2 weeks, no re-verification
- No expensive re-reads, no duplicate testing, no "wait, did they already do that?"

**The owner pays once (consolidation); expensive models pay zero times (they trust the board).**
