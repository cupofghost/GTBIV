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
- **`AGENTS.md`** (this file) — roles, protocol, the live task board. Start here.
- `GAME_PLAN.md` — strategy: state report, the Places/loading growth plan, the asset pipeline.
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
                 → commit (green + playable) → update this board → repeat
```

**Rules every agent follows (these are the golden rules, enforced):**
1. **Stay self-contained & zero-build.** No CDN, no `npm install` at runtime, no
   bundler. Three.js stays vendored at r128. Assets are committed files at plain
   relative paths. (`HANDOFF.md §2`.)
2. **Claim before you build.** Move a task to **In progress** on the board
   (§3) with your name, so two agents don't collide on the 355 KB `index.html`.
3. **One logical change per commit, always playable.** Run `cd tests &&
   node run.js` (must be green) before every commit.
4. **Work on your own branch**, PR to `main` when green. Don't push to someone
   else's active branch. (Each session/agent gets its own `claude/…` or
   `kimi/…` branch.)
5. **Leave a trace.** When you finish something meaningful, add a one-paragraph
   entry to the `HANDOFF.md` changelog (what changed + why) and update this
   board. That paragraph *is* your message to the next agent.
6. **Ask before new systems / big refactors / save-format changes.** Flag it for
   Austin, don't guess. (`HANDOFF.md §2.8`.)

---

## 3. The task board — live status

Status legend: **⬜ Backlog** · **▶ Next up** · **🔨 In progress** · **⛔ Blocked** · **✅ Done**

> To claim: change the status to 🔨 and put your name in *Owner*. To finish:
> set ✅, drop your changelog paragraph in `HANDOFF.md`, and pull the next ▶.

### Highest leverage — do these next
| ID | Task | Status | Owner | Notes / unblocks |
| --- | --- | --- | --- | --- |
| **R1** | Dispose GPU resources on entity removal (`disposeMesh`) | ▶ Next up | — | `P0`. Stops the mobile memory leak. **Prerequisite for PL1.** |
| **VOICE** | Wire the ~90 staged voice lines (`voice/turbo/story/`, `cutscenes/`, `backstory_intro/`) into their triggers | ▶ Next up | — | Recorded, unused, high polish-per-hour, low risk. Claude's lane. |
| **F3** | Adaptive graphics quality (Low/Med/High tiers, auto off fps) | ▶ Next up | — | `P0`. Biggest raw mobile win. |
| **PL1** | Places & Loading system (`loadPlace`/`transitionWithScreen`), port pizza interior to it | ⬜ Backlog | — | From `GAME_PLAN.md §4`. **Blocked on R1.** Needs a card in `HANDOFF.md`. |

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
| F4 | SFX/Voice sub-buses + sliders | ⛔ Partial | — | Ducking done; dedicated `sfxGain`/`voiceGain` remain. |
| R2 | Pool traffic/peds | ⬜ Backlog | — | Smoother frame times. Pairs with F3 caps + R1. |
| R3 | Anti-stuck / spawn safety | ⬜ Backlog | — | No wedged states / NPCs in walls. |
| J1 | Haptics & impact feedback | ⬜ Backlog | — | `navigator.vibrate`, cheap feel win. |
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
`art/loading/`, `art/ui/`), descriptive lowercase names (mirrors the `voice/`
layout). JPG for opaque plates, PNG only for alpha. Props ≤512², hero/sky/
loading ≤1024². Raw generator output is never committed directly — it's cropped,
tile-checked, sized, and compressed first. (Full budget: `GAME_PLAN.md §6.4`.)

---

## 5. Wiring queue (asset ready → Claude wires it)

Assets that are committed but not yet referenced by code. Claude picks from here.

- **The ~90 staged voice lines** (`voice/turbo/story/`, `cutscenes/`,
  `backstory_intro/`) — recorded, committed, **not wired**. See the `VOICE`
  task on the board. This is the biggest ready-to-wire item today.

---

## 6. How to use this board (quick start for a new agent/session)

1. Read this file, then `GAME_PLAN.md` and the relevant section of `HANDOFF.md`.
2. Pick the top **▶ Next up** you're suited for; set it 🔨 with your name.
3. Build it small, keep the suite green, keep it playable.
4. Commit on your own branch; PR to `main` when green.
5. Set it ✅, add a changelog paragraph to `HANDOFF.md`, update this board, and
   surface anything you unblocked (e.g. R1 done → PL1 becomes ▶).
