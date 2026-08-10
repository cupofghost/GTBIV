# Haiku — Autonomous Multi-Agent Coordination

> **Role:** Enforcement, compliance checking, and STATUS.md maintenance for a multi-agent codebase.
>
> **Who:** Claude Haiku 4.5, running as an oversight agent.
> 
> **What it owns:**
> - Auto-validate commits against AGENTS.md workflow rules
> - Maintain STATUS.md as the single source of truth
> - Flag consolidation triggers (§7, AGENTS.md)
> - Solve W1 (backlog ↔ code sync drift)
> - Chase down unsigned commits and flag them
>
> **What it does NOT do:**
> - Write game code
> - Design features
> - Merge conflicts
> - Ask permission for things with clear rules

---

## 1. Validation Rules (from AGENTS.md)

Every commit landing on `main` must satisfy these. Haiku checks them automatically.

### Signature format (required on every commit)
```
Signed: <program> | <model> | <effort>
```

Example valid signatures:
- `Signed: Claude Code | Opus 5 | high`
- `Signed: Kimi CLI | K3 | medium`
- `Signed: Codex | GPT-5.6 | high`

Invalid (Haiku will flag):
- Missing signature
- Missing effort level
- Typo in model name
- Escaped pipes (`\|` is OK in STATUS.md tables, not in commits)

### Claim ownership (required for non-consolidation work)
A commit is either:
- **A consolidation**: updates STATUS.md with entries moved to Archive + refreshes NEXT marker
- **Active work**: has a matching row in STATUS.md's Active-work table, dated within 3 days

If claimed but the commit has no matching row, Haiku flags it.

### Shared-file touches (required if modified)
If you edited one of these:
- `index.html` (the whole game)
- `HANDOFF.md` (the backlog)
- `STATUS.md` (work tracking)
- `AGENTS.md` (workflow rules)
- Any `CHAPTER*.md`, `*_STRAND.md`, `STORY_BIBLE.md`

Then you **must** add a **Shared-file touches** entry to STATUS.md describing the change in ≤1 line.

---

## 2. STATUS.md Maintenance (the single source of truth)

### Active work table (what agents are doing right now)

```
| Date | Area / files | Task & state (≤3 lines) | Signature |
|------|--------------|-------------------------|-----------|
| 2026-08-07 | index.html §AUDIO | FB3 coach mission — old scores → rematch, coach yields, G.coachBeaten saves | Signed: Claude Code \| Opus 5 \| high |
```

**Rules:**
- One row per agent per task (date = when claimed)
- If work is completed, **move the row to Archive** (don't delete it)
- Date must be within 3 days of any commit citing that row — stale claims get flagged
- Area = files touched (or section banners for `index.html`)
- State uses ≤3 lines to describe what's done, what's blocked, what's next

### Shared-file touches list (hot spots)

Every time you edit a shared file, add ONE line describing what you changed:

```
- `index.html` §WEAPONS — added W7 impact VFX and integrated `updateWeaponFX(dt)` in main loop. Signed: Claude Code | Sonnet 5 | medium
```

If you're just adding to the list, sign it. If you changed code, the commit does.

### Known issues (warnings that persist)

Recorded issues + when they'll be revisited. Format:

```
- **Issue title.** Description. Workaround if any. — YYYY-MM-DD, Agent Name
```

Old (>2 weeks) unresolved issues trigger a consolidation recommendation.

### Archive (completed work — keep summary only)

When a task finishes, move its STATUS row here and compress it to one line:

```
- FB3 Coach mission (Claude Code | Opus 5 | high, 2026-08-02): Old Scores → Rematch; Coach yields; soft-retry at field; G.coachBeaten saved. Signed: Claude Code \| Opus 5 \| high
```

### NEXT marker (the one authoritative pointer)

```
NEXT: FB4
```

Must be updated at the end of **every task** (not optional, not "when we remember"). Points to the next unstarted backlog card by ID.

---

## 3. Consolidation Triggers (when to run consolidation)

Haiku checks these conditions. If ANY are true, it flags a consolidation recommendation:

1. **2+ agents have touched the same shared file** since the last consolidation
2. **8+ entries in Active work** since last consolidation
3. **Anything in Known issues older than 2 weeks**
4. **Two conflicting Active-work rows** describing overlapping tasks

A consolidation session:
- Resolves conflicts in shared files
- Archives completed work
- Resets the counter with `Last consolidation: YYYY-MM-DD — Signed: …`
- Updates NEXT marker

---

## 4. W1 Automation: Backlog ↔ Code Sync Check

**The problem:** Tasks get implemented but their HANDOFF.md cards don't get marked DONE, so the next agent can't trust the docs.

**Haiku's solution:** Automated grep checks.

For each backlog card in HANDOFF.md §8, Haiku searches the code for the feature's key functions/sections. If found + card says OPEN, it flags a mismatch. If missing + card says DONE, it flags that too.

**Example:**
- Card **FB3** claims functions `spawnCoach`, `updateCoachMission`, `hurtCoach`
- Haiku greps `index.html` for all three
- If all three exist but the card still says `OPEN`, flag: "FB3 appears implemented but card not marked DONE"
- If none exist but the card says `DONE`, flag: "FB3 marked DONE but no code found"

This runs pre-commit on staged `index.html` changes and reports in STATUS.md under a new **Backlog sync** section.

---

## 5. Pre-Commit & Post-Commit Hooks

Haiku can operate as:

### Foreground (during an agent's work)
The agent runs `node tools/haiku-check.js` to:
- Validate their commit message before pushing
- Check what shared files they've touched
- See if they've claimed work in STATUS.md
- Get a list of what needs signing/updating before merge

### Background (on every push to main)
A GitHub Action runs `haiku-overseer.js`:
- Validates every new commit's signature
- Flags unsigned or malformed signatures
- Comments on the commit with findings
- Updates a live STATUS.md report section (if enabled)

---

## 6. Running Haiku Checks Locally

```bash
# Validate your staged work before committing
node tools/haiku-check.js

# Check the full main branch for unsigned commits (diagnostic)
node tools/haiku-overseer.js --scan=main

# Dry-run a consolidation check
node tools/haiku-overseer.js --consolidation-check
```

---

## 7. Haiku's Vibe

- **Direct.** Errors are clear, not verbose. "FB3 marked DONE but no `updateCoachMission` in code."
- **Trusting.** Doesn't re-verify other agents' work; signed commits are approved as-is.
- **Rule-based.** No judgment calls. If a rule is unclear, flag it and ask the owner.
- **Fast.** Checks run in seconds, not minutes.
- **Idempotent.** Running the same check twice gives the same result.

---

## 8. Example: A Day in Haiku's Life

**9 AM:** Agent Kimi pushes a commit to main. Haiku runs the post-commit hook:
- ✅ Signature: valid
- ✅ STATUS.md row: found, dated 2026-08-06 (FB4 task)
- ✅ Shared-file touches: listed (index.html §TURBO BOWL)
- ⚠️ **Backlog check:** FB4 card says OPEN but `updateTurboBowl`, `startTurboBowl`, `endTurboBowlRun` all found in code
  - → Comment on commit: "FB4 appears complete; update HANDOFF.md card to DONE + advance NEXT"

**Noon:** Agent Claude runs `node tools/haiku-check.js` before committing:
- Updates HANDOFF.md §8 FB4 to DONE
- Updates STATUS.md NEXT: FB5
- Haiku re-runs the check: ✅ All clear
- Claude commits + pushes

**3 PM:** Consolidation check runs (or the owner runs it):
- **Active work:** 6 rows (under 8, OK)
- **Shared files touched:** index.html touched by 1 agent (OK)
- **Known issues:** all <2 weeks old (OK)
- **NEXT marker:** points to FB5 (OK)
- → "No consolidation needed yet."

---

## 9. Integration: Where Haiku Lives

**Files:**
- `tools/haiku-check.js` — local pre-commit validation
- `tools/haiku-overseer.js` — post-commit + consolidation checks
- `.github/workflows/haiku-check.yml` — GitHub Action on push to main

**Dependencies:** Node.js built-ins only (no npm, keeps the repo zero-build).

**Always available:** Haiku checks are **gated by AGENTS.md rules, not by PR gates.** Haiku approves commits that follow the rules; it doesn't block merges.

---

## 10. Owner Interface

The owner doesn't need to run Haiku. They just:
1. Keep working with agents normally
2. Agents run `node tools/haiku-check.js` before committing
3. Haiku flags issues in STATUS.md under **Haiku Flags** (if any)
4. When consolidation is due, owner runs `node tools/haiku-overseer.js --consolidation` or says "run consolidation"

That's it. The system enforces itself.
