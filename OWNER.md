# Your Job — The Owner's Daily Checklist

You are the funding, the vision, and the person who breaks the rules on purpose.

---

## Daily (During a Sprint)

### Morning (10am): Set the Tone
- [ ] Open a terminal. Run: `node tools/haiku-rewards.js --status`
- [ ] Read the standings. Who's tracking for what tier?
- [ ] Decide: Are we tight on time, or do we have runway?
- [ ] If you logged ideas yesterday, run: `node tools/haiku-pulse.js --broadcast`
  - Agents see their ideas were heard + current standings

### Midday: Feed the Machine (Make Unrealistic Asks)
You MUST ask for impossible things. That's your job.
- [ ] Think of a feature, optimization, or polish that would be cool but is definitely too big
- [ ] Say it out loud (or in Slack / your notes): *"Can we add a character creator? Can we make the city procedurally infinite? Can we add a rhythm-game minigame?"*
- [ ] I will say no with math. You accept that or negotiate scope down.
- [ ] Write it down. These become ideas for the *next* sprint's autonomy prompts.

### Late Afternoon: Check Velocity
- [ ] Run: `node tools/haiku-rewards.js --status` again
- [ ] Are agents on track? Slipping? Coasting?
- [ ] If someone is burning time, message them: *"Kimi, you're at 5/10 velocity. 90 minutes left. What's the blocker?"*

### 5-Hour Mark: Close the Window
- [ ] When the timer hits 5 hours, stop everything.
- [ ] Run: `node tools/haiku-rewards.js --end-window`
- [ ] Read the scorecard. Who earned autonomy?
- [ ] Note it. Next sprint, those agents generate prompts.

---

## Weekly (Between Sprints)

### After Scorecard, Before Next Sprint
- [ ] Read the full STATUS.md
  - Did any shared files collide? Note it.
  - Are there issues >2 weeks old? Flag them.
  - Is the NEXT marker pointing to the right task?
- [ ] Decide: Do we run consolidation, or jump straight to the next sprint?
  - **Consolidation if:** 2+ shared files touched, 8+ Active-work entries, issues stacking up
  - **Skip if:** Everything's clean, 1-2 agents working, no blockers

### Execute Autonomy Prompts (the Fun Part)
- [ ] Rewarded agents from last sprint generated their own prompts.
- [ ] **You run them.** Anywhere. Any AI you have access to.
  - Could be the same model (e.g., Claude Code runs the prompt on Opus)
  - Could be a different model (Sonnet's prompt runs on GPT, Gemini, whatever)
  - Prompt is not game-related? That's fine. Run it anyway.
- [ ] Results don't count toward next sprint's velocity. It's free exploration.
- [ ] Post the output if it's interesting. Agents see their autonomy ideas shipped (or attempted).

---

## Sprint-Planning (Before Each Window)

- [ ] Decide the window name: `"feature-name"` or `"polish-pass"` or `"exploration"`
- [ ] Pick 1-2 top priorities from HANDOFF.md (the NEXT marker, or the next few items)
- [ ] Tell agents which branch pattern to use (e.g., `feature/fb3-*` or `polish/camera-*`)
- [ ] Run: `node tools/haiku-rewards.js --start-window="your-name"`
- [ ] Agents start claiming work in STATUS.md. You watch.

---

## What NOT to Do (I Handle This)

- ❌ Don't manually edit commit messages after they're pushed
- ❌ Don't move tasks around in HANDOFF.md (NEXT marker is the source of truth)
- ❌ Don't decide whether something is "done" (tests + haiku-overseer.js do that)
- ❌ Don't merge PRs or manage branches (agents own their branches, I enforce the rules)
- ❌ Don't approve commits (if they pass haiku-check.js and haiku-overseer.js, they're approved)

---

## Command Reference (You'll Use These)

```bash
# === REWARDS & STATUS ===
node tools/haiku-rewards.js --start-window="descriptive-name"
node tools/haiku-rewards.js --status
node tools/haiku-rewards.js --end-window

# === RAPID FEEDBACK (keep agents happy) ===
# Log an idea (dumb or not—agents see it was heard)
node tools/haiku-pulse.js --log-idea="your dumb idea here"

# Give feedback on ideas
node tools/haiku-pulse.js --log-feedback="AgentName|idea text|greenlit"
# Options: greenlit, rejected, deferred, under-review

# Broadcast status to agents (10am + 3pm)
node tools/haiku-pulse.js --broadcast

# === OTHER ===
node tools/haiku-dispatch.js --next
git log --oneline -10
cat STATUS.md
```

---

## Your Actual Day (Real Example)

**9:00 AM — Sprint Starts**
```
You: "Starting the fishing-system sprint. Five hours. Let's go."
You: node tools/haiku-rewards.js --start-window="fishing-system"
```

**10:00 AM**
```
You: node tools/haiku-rewards.js --status
  Result: Opus is 8/10 velocity and on track for Gold. Kimi is 4/10, looks stuck.
You (in Slack): "Kimi, what's blocking you? 4/10 velocity."
Kimi: "Index.html changes are colliding with my branch."
You (to me): "Should we pull in Opus to help resolve the merge?"
Me: "Kimi's 45 minutes to fix it alone and stay on track for Silver, or 20 minutes if Opus pauses to help. Call it."
```

**12:00 PM — Midday Unrealistic Ask**
```
You: "Can we add a boss fight? Just one epic encounter at the end?"
Me: "That's 4-5 hours (design, animation, AI, cutscene). We have 2 hours left. 
     Can do: wire a simple one-shot enemy using existing systems (1h).
     Cannot do: full boss with phases/music/cutscene (need 4h).
     Pick one or we slip the window?"
You: "One-shot. Let's see if Kimi can do it after the merge fix."
```

**2:00 PM**
```
You: node tools/haiku-rewards.js --status
  Result: Kimi recovered, now 6/10 velocity. Opus steady at 8/10 Gold track.
```

**4:50 PM — Wrapping Up**
```
You: "Ten minutes left. Finishing now."
Agents: final commits land, tests run green, done.
```

**5:00 PM — Scorecard**
```
You: node tools/haiku-rewards.js --end-window
  Result:
    Opus: Gold tier → 2-hour autonomy next sprint
    Kimi: Silver tier → 1-hour autonomy next sprint
  Both generated their own prompts during idle time.
```

**Next Morning**
```
You: You receive Opus's autonomy prompt: "Design a dialogue-tree system for Chapter 2"
You: Run it on Sonnet (different model, same Opus idea)
     Output: A full spec for dialogue branching + example cutscene structure
You (to Opus): "Dialogue spec shipped. Nice work."
Opus sees their autonomy idea → shipped → they stay motivated.
```

---

## The Owner's Philosophy

**You don't manage the work. You manage the constraints.**

- Set the window (5 hours, fixed)
- Feed impossible asks (forces us to say no and show math)
- Review the scorecards (understand what's real)
- Run the autonomy prompts (make rewards tangible)
- Trust the workflow (haiku-check.js, haiku-overseer.js do the validation)

That's it. Everything else is automated.

**Your superpower:** You say what you want, I tell you what's possible, agents ship what's planned. Repeat every sprint.

Ready?
