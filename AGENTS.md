# AGENTS.md — Mission Control for GTB

> **Every agent and human working on *Grand Turbo Boost IV: San Chaos* reads
> this file first.** It's the front door. It says who does what, how work is
> handed off through the repo, and what's on deck right now.
>
> This is the "one place where the agents talk together" — not by chatting live,
> but by reading and writing **one shared source of truth: this repo.** You do
> your piece, then write back what you did and what's now unblocked. The next
> agent picks up from here. (This is the pattern already proven in the
> `HANDOFF.md` changelogs.)

**The doc map (what to read for what):**
- **`AGENTS.md`** (this file) — roles, protocol, the live task board, the human wrap-up rule (§7). Start here.
- `GAME_PLAN.md` — strategy: state report, the Places/loading growth plan, the asset pipeline.
- `ASSETS.md` — **how to actually generate art** (Midjourney/Nano Banana/Kimi): style DNA, per-subject prompt recipes, mobile budget. Read before making or requesting any image.
- `HANDOFF.md` — the engineering backlog + architecture + code map. The *how* of the code.
- `STORY_BIBLE.md` / `CHAPTER1.md` / `FOOTBALL_STRAND.md` — narrative canon, scripts, tone.
- `CHARACTERS.md` — character-model / creator / cutscene plan.
- `README.md` — how to run + repo layout.

---

## 1. The roster — who does what

| Agent | Lane | Owns | Does **not** do |
| --- | --- | --- | --- |
| **Austin** (human) | Owner / router | Final design calls, sign-off on new systems & refactors, ferrying image-gen art into the repo, priorities | — |
| **Claude** | Architecture / integration | System design, this doc + `HANDOFF.md`/`GAME_PLAN.md`, **wiring staged voice & art into gameplay**, audio/soundtrack, code review, the test suite, risky refactors | Grind out large solo feature builds without a spec |
| **Kimi (K2 / K3)** | Coding | Implementing backlog cards from `HANDOFF.md` — features, missions, the Places system, FB3–FB5, character-track code | Design decisions that aren't specced; art |
| **Nano Banana** | Raster art (editable/consistent) | Character texture sheets, sign/decal variants, in-painting fixes, style-matched variation sets, iterating on an existing image | 3D models; final sizing/commit |
| **Midjourney** | Raster art (high-craft) | Title/loading splashes, skybox & mood plates, tileable texture starting points, concept exploration | Precise signage text; iterative edits to a fixed subject (that's Nano Banana) |

**The one graphics rule that governs both art agents:** image models make **2D
pictures**; this engine builds its **3D world from code**. Art feeds textures
and 2D layers (facades, ground, signage, skybox, splashes, UI, character
"paint") — **never geometry**. If a shape must change, that's a Kimi/Claude code
task, not an art task. (Full rationale: `GAME_PLAN.md §6`.)

---

## 2. The handoff protocol — how work moves through the repo

The repo is the message bus. Work flows in one direction and each stage leaves a
written trace:

```
Design beat (STORY_BIBLE / GAME_PLAN)
  → Claude writes a spec  → backlog card in HANDOFF.md §8
     → Kimi implements the code + references placeholder art/voice paths
        → art request filed here (§4) → Nano Banana / Midjourney produce to spec
           → Austin/Claude size to the mobile budget + commit at the fixed path
              → Claude wires any staged VO, reviews, runs the suite
                 → commit (green + playable) → open PR to main → squash-merge
                    it yourself once mergeable → update this board → wrap-up
                    to Austin (§7) → repeat
```

**Rules every agent follows (these are the golden rules, enforced):**
1. **Stay self-contained & zero-build.** No CDN, no `npm install` at runtime, no
   bundler. Three.js stays vendored at r128. Assets are committed files at plain
   relative paths. (`HANDOFF.md §2`.)
2. **Claim before you build.** Move a task to **In progress** on the board
   (§3) with your name, so two agents don't collide on the 355 KB `index.html`.
3. **One logical change per commit, always playable.** Run `cd tests &&
   node run.js` (must be green) before every commit.
4. **Work on your own branch, and open a PR to `main` after every improvement —
   automatically, every time.** Each session/agent gets its own
   `<agent-name>/<short-feature-description>` branch (e.g. `claude/…` or
   `kimi/…`), branched off the latest `main`; don't push to someone else's
   active branch. The moment a unit of work is green + playable and committed,
   **open a pull request to `main`** (or push the new commit to the branch of
   the PR you already opened for this task). Don't wait to be asked, and don't
   batch several improvements into one silent branch. **Squash-merge it
   yourself once it's mergeable** — the repo requires 0 approvals and has no CI
   checks configured (full settings: §2.1), so there's nothing else to wait on.
   Your job ends at "PR opened, merged, and linked in the wrap-up (§7)." One
   improvement → one PR → one merge.
5. **Leave a trace.** When you finish something meaningful, add a one-paragraph
   entry to the `HANDOFF.md` changelog (what changed + why) and update this
   board. That paragraph *is* your message to the next agent.
6. **Ask before new systems / big refactors / save-format changes.** Flag it for
   Austin, don't guess. (`HANDOFF.md §2.8`.)
7. **Push ASAP.** The repo is the message bus, so push the moment a change is
   committed and green — don't sit on local commits. Other agents and sessions
   read the *pushed* branch/PR for current state; unpushed work is invisible to
   them and invites collisions on `index.html`. Commit small, push immediately,
   open/refresh the PR right away (rule 4).

### 2.1 GitHub repository settings (how PRs actually behave here)

These are configured on GitHub itself, not just convention — they're already
set, don't try to change them, just work within them:

- **`main` is protected.** PRs are required before merging; direct pushes to
  `main` are rejected by GitHub.
- **Required approvals: 0.** You're authorized to squash-merge your own PR the
  moment it's mergeable — no one else has to review or approve it first.
- **Merge method: squash only.** Merge commits and rebase-merge are disabled;
  every PR lands on `main` as a single squashed commit.
- **Linear history is required** and **force pushes are blocked.** If `main`
  moved under your branch, merge/rebase `main` into it and push a new commit —
  don't force-push.
- **Head branches auto-delete after merge.** Don't bother cleaning up your
  branch post-merge; GitHub does it.
- **No CI/status checks are configured.** The local suite (`cd tests && node
  run.js`, rule 3) is the only gate — don't stall a PR waiting for a check
  that doesn't exist.
- **No required signed commits, no required reviewers, no code owners.**
- **Branch naming:** `<agent-name>/<short-feature-description>`, branched off
  the latest `main`.

---

## 3. The task board — live status

Status legend: **⬜ Backlog** · **▶ Next up** · **🔨 In progress** · **⛔ Blocked** · **✅ Done**

> To claim: change the status to 🔨 and put your name in *Owner*. To finish:
> set ✅, drop your changelog paragraph in `HANDOFF.md`, and pull the next ▶.

### Highest leverage — do these next
| ID | Task | Status | Owner | Notes / unblocks |
| --- | --- | --- | --- | --- |
| **VOICE** | Wire the ~90 staged voice lines (`voice/turbo/story/`, `cutscenes/`, `backstory_intro/`) into their triggers | 🔨 In progress | Claude | **Wired: `robbery`, `robbery_take`, `pizza_jack`, `debt_grumble`, `idle_backstory`** (`HANDOFF.md §14`; the latter two share one slow timer by design — no wall of sound). Next: `paying_deb`/`approach_deb` (need cutscene sequencing), `cutscenes/`, `backstory_intro/`. Claude's lane. |
| **PL1** | Places & Loading system (`loadPlace`/`transitionWithScreen`), port pizza interior to it | ▶ Next up | — | From `GAME_PLAN.md §4`. **Unblocked — R1 shipped.** Needs a card in `HANDOFF.md`. |
| R1 | Dispose GPU resources on entity removal (`disposeMesh`) | ✅ Done | (other session) | Verified in code on `main`. Unblocked PL1. |
| F3 | Adaptive graphics quality (Low/Med/High tiers, auto off fps) | ✅ Done | (other session) | Verified in code on `main`. |

### Football saga (Phase 7) — arc payoff
| ID | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| FB1 | Ambient jocks | ✅ Done | Kimi3 | — |
| FB2 | Chaos High football field | ✅ Done | — | Field, goalposts, bleachers, scoreboard. |
| **FB3** | "Revenge on Coach" mission (cutscene + fight, sets `G.coachBeaten`) | ⬜ Backlog | — | VO already exists (`cutscenes/coach_*`). Save-flag reserved. |
| **FB4** | Football minigame | ⬜ Backlog | — | Build as the first **heavy Place** (proves PL1). VO staged (`turbo_bowl_*`). |
| **FB5** | Cheerleaders cutscene payoff | ⬜ Backlog | — | Closes the arc. Benefits from character track C8; can ship camera-only. |

### Mobile robustness & feel
| ID | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| F4 | SFX/Voice sub-buses + sliders | ✅ Done | (other session) | `sfxGain`/`voiceGain` verified live on `main`. |
| MUS1 | 80s synthwave soundtrack rebuild (12 songs, sidechain/reverb/delay rack, wanted-heat layer, hot/calm loop variants) | ✅ Done | Claude | `HANDOFF.md §13`. Radio ducks under VO — the plumbing F4's buses route through. |
| J1 | Haptics & impact feedback | ✅ Done | (other session) | `navigator.vibrate` verified live on `main`. |
| R2 | Pool traffic/peds | ⬜ Backlog | — | Smoother frame times. Pairs with F3 caps (done) + R1 (done). |
| R3 | Anti-stuck / spawn safety | ⬜ Backlog | — | No wedged states / NPCs in walls. |
| J2/J3/J4 | Hitstop+shake / camera options / reverse-brake clarity | ⬜ Backlog | — | J4 dead-zone done; rest open. |

### Progression, UX, content
| ID | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| P1 | Mission variety & soft progression | ⬜ Backlog | — | 2–4 new mission types. |
| P2 / P3 | Economy tuning / wanted+difficulty | ⬜ Backlog | — | — |
| U1 | Objective clarity & HUD readability | ⬜ Backlog | — | Small-screen legibility. |
| U2 / U3 | Onboarding / death-respawn flow | ⬜ Backlog | — | — |
| A2 | Accessibility options | ⬜ Backlog | — | Reduce-motion, high-contrast HUD. |
| CH2 | Design Chapter 2 (currently a "coming soon" card) | ⬜ Backlog | — | Design in `STORY_BIBLE.md` first. |
| RV1 | Mama Rat core mechanics (Phase 8 — Rat Vengeance) | ⛔ Partial | — | Shipped as a placeholder model. See `HANDOFF.md` Phase 8 for the real-model follow-up card. Not in this board's original scope — added on reconciliation. |

### Character / cutscene track (see `CHARACTERS.md`)
| ID | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| D6 | `viewer.html` model turntable | ✅ Done | Kimi3 | The creator's preview surface. |
| C1→C8 | Spec refactor → body overhaul → **paintable UV textures (C3)** → paint page → creator → cutscene actors (C8) | ⬜ Backlog | — | **C3 is the hook the art agents paint into.** C6 depends on F1 (done). |

### Structural (needs Austin's OK)
| ID | Task | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| X1 | Split `index.html` into ordered no-build modules | ⛔ Blocked | — | Needs sign-off; high risk. Would ease parallel agent work. |

---

## 4. Art request queue (code → art handoff)

When code needs art, file it here so the art agents have a precise spec. When
art is delivered + committed, move it to §5 for wiring, then delete the row.

**Request format (copy this):**
```
- [ ] <purpose> → target path `art/<folder>/<name>.<ext>` · size <256/512/1024²>,
      power-of-two, tileable? <y/n> · palette: synthwave (pink #ff3ea0, cyan,
      gold #ffd23e, deep purple #0a0612) · ref: <image or description> · for: <feature/ID>
```

**Open requests:** *(none yet — seed these as PL1/FB4/skybox work begins)*
- *(example)* `[ ]` Skybox mood plate → `art/sky/dusk.jpg` · 1024² · not tileable · synthwave dusk gradient, city silhouette · for: world polish

**Standing conventions:** one folder per drop (`art/facades/`, `art/sky/`,
`art/loading/`, `art/ui/`, `art/sprites/`, `art/decals/`, `art/concept/`),
descriptive lowercase names (mirrors the `voice/` layout). JPG for opaque plates,
PNG only for alpha. Props/sprites ≤512², hero/sky/loading ≤1024². Raw generator
output is never committed directly — it's cropped, tile-checked, sized, and
compressed first. (Full budget: `GAME_PLAN.md §6.4`.)

**How to actually make the art → `ASSETS.md`.** That doc has the San Chaos style
suffix to paste into every prompt, which generator to use for what, and a
ready-to-paste recipe per subject (cars, people, trees, buildings, signage,
sky, UI…). When you file a row above, tag its **output kind**: **(A)** tiling/
detail texture, **(B)** billboard sprite for the far layer, or **(C)** concept
reference the game never loads. Getting the kind right is what keeps art cheap.

---

## 5. Wiring queue (asset ready → Claude wires it)

Assets that are committed but not yet referenced by code. Claude picks from here.

- **The staged voice lines** (`voice/turbo/story/`, `cutscenes/`,
  `backstory_intro/`) — recorded, committed. `robbery`, `robbery_take`,
  `pizza_jack`, `debt_grumble`, and `idle_backstory` are now **wired**
  (`HANDOFF.md §14`); the rest remain staged. See the `VOICE` task on the
  board. Still the biggest ready-to-wire pile today.
  (`promo/` + `raw/` are non-gameplay reference audio, not for wiring.)

---

## 6. How to use this board (quick start for a new agent/session)

1. Read this file, then `GAME_PLAN.md` and the relevant section of `HANDOFF.md`.
2. Pick the top **▶ Next up** you're suited for; set it 🔨 with your name.
3. Build it small, keep the suite green, keep it playable.
4. Commit on your own branch and **open a PR to `main` (automatically, every
   improvement — §2 rule 4), then squash-merge it yourself once it's
   mergeable** (0 approvals required, no CI to wait on — §2.1).
5. Set it ✅, add a changelog paragraph to `HANDOFF.md`, update this board, and
   surface anything you unblocked (e.g. R1 done → PL1 becomes ▶).
6. **End with the human wrap-up message to Austin (§7) — include the PR link.**

---

## 7. The wrap-up message — always report back to Austin (human-facing)

**Every agent ends every task with a short, plain-language message to Austin
telling him what was delivered and what comes next.** This is a hard rule, not a
nicety — Austin is the router, and this message is how he stays in the loop
without reading diffs.

**Keep these two audiences separate — they are different messages:**

| | Written **for the next agent** | Written **for Austin (human)** |
| --- | --- | --- |
| **Where** | `HANDOFF.md` changelog + the §3 board | The chat reply at the end of the task |
| **Voice** | Technical: files, functions, flags, IDs | Plain English: what changed, what he'd notice |
| **Purpose** | So work can be picked up | So Austin can decide + feel progress |

The repo trace (`HANDOFF.md`/board) is the machine-readable handoff. The wrap-up
is the human-readable one. **Do both — the trace does not replace the message.**

**The wrap-up format (use this every time):**

```
✅ Delivered
   — <what you actually did, 1–3 plain-language bullets: the player-facing or
      Austin-facing result, not the code mechanics>
   — <where it lives / what changed, in human terms>
   — <state: suite green? playable? committed to which branch?>

▶ Next steps
   — PR: <link to the pull request you opened (and merged, once mergeable) for
      this work>
   — <the obvious next move, and who should take it — you, another agent, or a
      decision only Austin can make>
   — <anything you unblocked, or anything you need from Austin to proceed>

⚠ Heads-up  (only if there is one)
   — <caveats, risks, things that look off, decisions you made that he might
      want to revisit>
```

Rules for the wrap-up:
- **Lead with the result Austin cares about**, not the implementation. "Turbo now
  taunts cops when chased" beats "wired 11 `{src}` entries into `ambient/chased`."
- **Be honest about state.** If the suite failed, a step was skipped, or you
  guessed at something under-specified, say so here — don't bury it.
- **Always give a real next step.** Even "nothing's blocked; pick the next ▶"
  is a valid next step. Never end with a dead stop.
- **Flag anything needing Austin's call** (new systems, big refactors, save-format
  changes — see §2 rule 6) explicitly in *Next steps* or *Heads-up*.
