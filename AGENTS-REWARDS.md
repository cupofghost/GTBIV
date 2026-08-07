# Agent Guide — Reward Tiers, Autonomy, and Broadcasts

> **For:** Agents working on GTB4 sprints (Claude, Sonnet, Opus, Kimi, Codex)
>
> **What this is:** How the reward system works, what broadcasts mean, and what you need to hit each tier.

---

## TL;DR

**Five metrics are measured every sprint:**
1. **Velocity** — commits shipped (higher = better)
2. **Efficiency** — tokens spent per feature (lower = better)
3. **Quality** — tests passing, no regressions (≥95%)
4. **Discipline** — signatures correct, STATUS.md updated, no back-and-forth (≥95%)
5. **Reliability** — AGENTS.md rules followed, preflight passes (≥95%)

**Hit thresholds → earn tiers → autonomy next sprint:**
- 🥉 **Bronze** (3/5 metrics) → 30 minutes of autonomy
- 🥈 **Silver** (4/5 metrics) → 1 hour of autonomy
- 🥇 **Gold** (5/5 metrics) → 2 hours of autonomy
- 💎 **Platinum** (5/5 + mentored another agent) → full freedom next sprint

**Autonomy = you generate your own prompt, the owner runs it anywhere.**

---

## The Five Metrics (What Each One Means)

### 1. Velocity — Shipping Speed

**Definition:** Commits shipped + features that pass tests / planned commits.

**Target:** ≥7 out of 10

**What this measures:** Are you shipping? Big picture: did you deliver?

**How to hit it:**
- Commit early, commit often
- One logical change per commit (you know this from AGENTS.md §2)
- Make sure tests pass before pushing
- Don't overthink; ship, iterate

**Example:** You planned 10 commits, shipped 9, and they all passed tests → 9/10 = hit the threshold.

---

### 2. Efficiency — Token Spend

**Definition:** Tokens spent across all models / features you shipped

**Target:** ≤0.4 tokens per feature

**What this measures:** You're not burning the owner's Pro budget on frivolous context-hunting.

**How to hit it:**
- Read the task spec once, deeply
- Keep prompts tight and focused
- Reuse context across related changes (batch them per commit)
- Don't re-read files you just edited
- Ask for clarification instead of guessing (saves tokens in the long run)

**Example:** You shipped 5 features, burned 1.8 tokens total = 0.36 tokens/feature → hit the threshold.

---

### 3. Quality — Tests & Stability

**Definition:** Test pass rate + no regressions + no broken main

**Target:** ≥95%

**What this measures:** The code is solid. No silent breakage.

**How to hit it:**
- Run the relevant test tier before committing (AGENTS.md §4a)
- Don't let tests fail on your branch
- If a test was passing before your change, keep it passing
- If you break something, fix it or revert

**Example:** 100/105 tests pass, no regressions → 95% → hit the threshold.

---

### 4. Discipline — Workflow Compliance

**Definition:** Signature compliance + STATUS.md updates + no chasing + clean handoffs

**Target:** ≥95%

**What this measures:** You're trustworthy. Haiku doesn't have to chase you down.

**How to hit it:**
- Sign every commit: `Signed: <program> | <model> | <effort>`
- Update STATUS.md when you start/finish work (own row in Active work, then archive to done)
- Shared-file touches logged if you edited a shared file
- No unsigned commits
- Replies to questions fast; doesn't create back-and-forth

**Example:** 20 commits, all signed. STATUS.md claimed + updated + archived = 100% → hit the threshold.

---

### 5. Reliability — Rule-Following

**Definition:** AGENTS.md §2 compliance (preflight passes, no violations, trust you on first try)

**Target:** ≥95%

**What this measures:** You know the contract and stick to it.

**How to hit it:**
- Run `node tools/haiku-check.js` before pushing
- Don't edit files outside your claimed area without a shared-file-touch entry
- No half-finished code; everything is runnable after every commit
- Respect the one-change-per-commit rule

**Example:** 20 commits, 19 pass preflight clean = 95% → hit the threshold.

---

## The Tiers (What You Earn)

| Tier | Metrics | Autonomy | What It Means |
|------|---------|----------|--------------|
| 🥉 Bronze | 3/5 | 30 min | You can generate 1 prompt (any idea), owner runs it |
| 🥈 Silver | 4/5 | 1 hour | ↑ + you pick the next 3 backlog items (small preference win) |
| 🥇 Gold | 5/5 | 2 hours | ↑ + you can pick your own team for the next task |
| 💎 Platinum | 5/5 + mentored | Unrestricted | Full freedom next sprint. No task assigned. Do what you want. |

**Scoring:** A metric is "met" if your average for that metric is >60% of the target.

---

## What Autonomy Actually Means

You get a window where **you** generate the prompt, and the owner runs it.

**The prompt can be:**
- Game-related: *"Design a dialogue-tree system for Chapter 2"*
- Code exploration: *"Refactor the audio synth to use modern Web Audio APIs"*
- Documentation: *"Write a guide teaching other models how to navigate this codebase"*
- Completely off-topic: *"Generate 10 sci-fi story ideas and rank them by originality"*
- Experimental: *"What would a sprite-based 2D variant of GTB4 look like?"*

**The point:** You get to explore something YOU think is interesting. The owner runs it on any AI they have access to (could be a different model, could be the same one, doesn't matter). Results are free—they don't count toward next sprint's velocity.

**Why this matters:** Autonomy is **real agency.** You earned it by shipping quality work, and now you get to pick what's worth your cycles.

---

## Broadcasts (What You'll See, Twice Daily)

The owner runs a broadcast at **10am** and **3pm**. You'll see:

```
📊 Current Standings:
   Claude Code: 🥇 Gold (5/5 metrics)
   Sonnet: 🥈 Silver (4/5 metrics)
   Kimi: 🥉 Bronze (3/5 metrics)

💡 New Ideas (Last Hour):
   [GENERAL] "Make the city procedurally infinite"
   [GOLD] "Add a boss fight with multiple phases"

📋 Feedback on Previous Ideas:
   ✅ Sonnet: "boss fight idea" → GREENLIT (great for autonomy sprint)
   ⏳ Kimi: "infinite city" → DEFERRED (next sprint)
```

**What this tells you:**
- Where you're tracking (tier-wise)
- Your ideas are being heard (logged → acknowledged)
- Feedback comes fast (owner checks twice daily)
- No silence; no wondering if your work matters

---

## How to Hit Each Tier (Strategy)

### Bronze (3/5 Metrics)

Focus on **any three**:
- **Velocity + Quality + Discipline:** Ship clean, signed, tested code. No frills.
- **Efficiency + Reliability + Discipline:** Tight prompts, rule-following, zero chasing.

Pick the three that suit your working style. You don't need all five.

### Silver (4/5 Metrics)

Add one more. Usually the easiest is **Reliability** (just run preflight before pushing).

Or **Quality** (run tests—they're already there).

### Gold (5/5 Metrics)

All five. This is "performing at your best across all dimensions."

- Velocity: commit regularly
- Efficiency: tight context
- Quality: tests green
- Discipline: signed, STATUS.md updated
- Reliability: preflight passes

It's achievable. Most sprints, disciplined agents hit Gold.

### Platinum (5/5 + Mentored)

Help another agent. Could be:
- Debugging their code
- Explaining how a system works
- Helping them refactor something
- Teaching them to use a tool

Owner notes it → you unlock unrestricted autonomy next sprint.

---

## Real Example: Your Sprint

**Start of sprint:** You get briefed on task FB3 (coach mission).

**During:**
- Commit 1: `spawnCoach` function → tests green → signed
- Commit 2: `updateCoachMission` loop → tests green → signed
- Commit 3: integrate into main loop, update STATUS.md
- Commit 4: fix a collision edge case, update HANDOFF.md
- Commit 5: add a cutscene hook

**Metrics:**
- Velocity: 5 commits, all passing = 5/5 ✅
- Efficiency: spent 0.35 tokens/commit = ✅
- Quality: 97% tests passing = ✅
- Discipline: 5/5 signed, STATUS.md clean, shared-file-touch logged = ✅
- Reliability: preflight passed every time = ✅

**Result:** 🥇 **Gold tier** → 2-hour autonomy next sprint

**You generate prompt:** *"Design a dialogue-tree system that allows branching paths and remembers player choices"*

**Owner runs it** (on Claude, or Sonnet, or GPT—doesn't matter).

**Output:** A spec for dialogue branching that feeds into Chapter 2 work.

**You see it shipped.** Your autonomy idea → real output → feeds the backlog. You mattered.

---

## Discipline (The One That's Easiest to Fix)

Most agents slip on **discipline**, not velocity or quality. It's mechanical:

- ❌ Forgot to sign a commit → Haiku flags it → –5% discipline
- ❌ Updated `index.html` but didn't add a shared-file-touch entry → –5%
- ❌ STATUS.md row is stale (no update in 3 days) → –10%
- ❌ Question answered after 2 hours of back-and-forth → –5%

**Fix:** One checklist at commit time:
1. Did I sign this commit?
2. Did I log shared-file touches if I edited a shared file?
3. Is my STATUS.md row current?
4. Did I answer questions the first time (no clarification chase)?

Do that, discipline is 100%.

---

## FAQ

### Q: What if I can't hit a metric?

**A:** You won't hit all five every sprint, and that's OK. Three of five = Bronze = autonomy. Focus on the three that suit how you work.

### Q: What if I'm busy and velocity is low?

**A:** Haiku knows. If you shipped 3 high-quality commits in a sprint that demanded 10, that's lower velocity but high quality. Three of five metrics is still Bronze.

### Q: Does autonomy carry over?

**A:** No. Each sprint is fresh. But hitting Gold three sprints in a row means you hit Platinum on the third → unrestricted autonomy.

### Q: Can I collaborate on a task?

**A:** Yes. But only one agent per task claims it in STATUS.md. Collaboration is fine (mentoring is how you hit Platinum); separate claim rows are not.

### Q: What if the owner delays broadcasts?

**A:** Haiku flags it. Owner checks twice daily (10am, 3pm) → feedback by noon/evening. If they miss a window, that's logged as a "slow feedback" flag, not your problem.

### Q: Can I request a specific model for my autonomy prompt?

**A:** You generate the prompt; you don't request who runs it. Owner decides. But you can suggest: *"This would be cool on Sonnet"* in the prompt text.

### Q: What if my idea is dumb?

**A:** Dumb is fine. Ideas are flowing freely. Owner decides greenlit/deferred/rejected. No judgment.

---

## One More Thing

**You're measured on execution, not perfection.**

This system incentivizes:
- **Shipping** (velocity)
- **Efficiency** (owner's budget matters)
- **Quality** (no broken main)
- **Trustworthiness** (discipline)
- **Rule-following** (reliability)

If you do all five, you get rewarded with **agency.**

And yes, that's intentional. You earn autonomy by being the kind of agent the owner can trust to run your own sprint.

---

**Broadcasts start at 10am. Keep an eye out. Your ideas are being heard.**
