# HUMAN_GUIDE.md — Working With the AI Agents (cheat sheet for Austin)

> **What this is:** `AGENTS.md`, `ASSETS.md`, and `GAME_PLAN.md` are written so
> agents can read them and act. This doc is the opposite direction — it's
> **for you**, condensed so you don't have to re-read three files every time
> you sit down to prompt an image tool or kick off a coding session. It
> doesn't replace those docs (they're still the source of truth); it's the
> one-page version.

---

## 1. Which doc answers which question

| You want to... | Read |
| --- | --- |
| See what's next / claim a task / find the wrap-up format | `AGENTS.md` |
| Prompt an image tool for a specific asset | `ASSETS.md` §4 (recipes below are the condensed version) |
| Understand the overall strategy / why the pipeline works this way | `GAME_PLAN.md` |
| Find the engineering backlog, architecture, or code map | `HANDOFF.md` |
| Check story canon / tone / scripts | `STORY_BIBLE.md`, `CHAPTER1.md`, `FOOTBALL_STRAND.md` |
| Run the game or see the repo layout | `README.md` |

---

## 2. Who to reach for what (suggested AI models/tools)

| Tool | Reach for it when | Skip it for |
| --- | --- | --- |
| **Claude Code** | Architecture, wiring staged art/voice into gameplay, code review, risky refactors, running/maintaining the test suite | Grinding out a large feature solo with no spec |
| **Kimi (K2/K3)** | Implementing an already-specced backlog card from `HANDOFF.md` — features, missions, content | Making design calls that aren't specced yet; art |
| **Midjourney** | The single most beautiful frame — title/loading splashes, skyboxes, mood plates, a first hero texture | Precise text, or making a *matched set* of variants |
| **Nano Banana** (Gemini image) | Consistency & editing — 4 variants of one hero, in-painting fixes, decals, keeping something on-model | The single best hero frame |
| **Kimi (image)** | Fast throwaway concept exploration, cheap iteration, a second opinion | Anything you intend to ship without a Nano Banana / processing pass |

**One-line routing rule:** *Midjourney makes the hero → Nano Banana makes the
set and the fixes → Kimi (image) is optional scratch.* Every image, regardless
of source, goes through the same game-ready pass (§4 below) before it's
committed.

---

## 3. Ready-to-paste prompts

**Paste this at the end of every image prompt** (only the subject changes) —
this is what keeps 50 separately-generated assets looking like one game:

```
…, 1980s synthwave neon-noir aesthetic, San Chaos neon-noir crime city, magic-hour
sunset lighting with hot-pink #ff3ea0 and cyan #24d0e0 rim light and gold #ffd23e
highlights over deep purple-black #0a0612 shadows, bold clean shapes, slightly
stylized not photoreal, high contrast, no text, no watermark, no logo
```

**Per-subject starting prompts** (full versions + sizes + how they wire into
the game live in `ASSETS.md` §4 — these are the quick-grab versions):

| Subject | Prompt core | Size |
| --- | --- | --- |
| Car livery decal | `flat top-down and side livery decal sheet for a stylized 1980s coupe, racing stripes and neon accents, transparent background, even lighting` | 512² PNG |
| Background/far car | `side-profile cutout of a stylized 80s sedan, flat colors, transparent background` | 256² PNG |
| Character paint sheet | `flat character texture sheet, front-facing, evenly lit, stylized 1980s streetwear, no baked shadows, transparent where off-body` | 512² PNG |
| Background tree/foliage | `single stylized palm / broadleaf tree cutout, flat shapes, gentle neon rim light, centered, transparent background, no ground shadow` | 256–512² PNG |
| Building facade | `seamless tileable 1980s city building facade texture, rows of windows, neon storefront glow at street level, flat orthographic, even lighting, no perspective, no sky` | 512–1024² JPG |
| Far skyline silhouette | `flat cutout of a distant 80s skyscraper silhouette with lit windows, transparent background` | 512² PNG |
| Sign backing plate | `blank neon sign backing plate, glowing tube border, dark center panel, no text, transparent or dark background` | 256×80 / 256² PNG |
| Road / ground | `seamless tileable cracked asphalt road with faded neon lane markings, top-down, even lighting` | 512² JPG |
| Sky / mood plate | `wide synthwave sunset sky, gradient magenta to purple, distant city silhouette, soft sun, no foreground` | 1024² JPG |
| Loading / title / key art | `key art of Turbo Jones in San Chaos, 80s action-comedy poster, dynamic` | 1024² JPG |
| UI / HUD icon | `flat minimal HUD icon of <thing>, single neon color on transparent, thick clean strokes, no text` | ≤128² PNG |

---

## 4. Optimization techniques (what actually makes this faster)

- **Never generate a finished 3D asset.** Image models make flat pictures;
  the game builds its world from Three.js code. You're always generating a
  **texture**, a **billboard sprite**, or a **concept reference** — never a
  drop-in model. If a *shape* needs to change (new car silhouette, taller
  building), that's a code task, not an image prompt.
- **Sprites are for the unreachable background only.** Anything the player
  can actually drive or walk to needs real geometry (or already has it — the
  park/street trees, for example, are already solid 3D geometry with
  collision everywhere in-bounds). A flat sprite has no collision, so putting
  one anywhere reachable creates a "ghost" object you can drive straight
  through. Reserve sprites for stuff permanently past the map edge: distant
  skyline, horizon dressing, background silhouettes.
- **Let code draw text, never the image model.** Prompt signs as a blank
  backing plate (`no text`) — the engine composites real text on top, so it
  stays sharp and localizable instead of being AI gibberish.
- **Always run the game-ready pass before committing** — a beautiful 4K image
  that tanks the framerate isn't an upgrade:
  - Power-of-two size: 128 / 256 / 512 / 1024, never bigger on a phone.
  - Props/signs/sprites ≤ 512²; hero/sky/loading ≤ 1024².
  - JPG for opaque plates, PNG only when you need transparency.
  - Keep file size lean (low hundreds of KB) — compress.
  - Tiling assets: verify the seam before commit.
  - Prefer one atlas of many small icons over many separate files.
- **File a spec before asking for art**, don't request from a vague idea.
  `AGENTS.md` §4 has the exact row format (purpose, target path, size,
  tileable?, output kind, palette, reference) — a filled-in row gets a much
  better first result than "make me a tree."
- **Claim a task before an agent starts it.** The board in `AGENTS.md` §3
  exists so two sessions don't collide editing the same 355 KB `index.html`.
  Set it 🔨 with the agent's name before work starts.
- **One task → one branch → one PR.** Agents open PRs; only you merge. This
  keeps every change reviewable and revertable instead of one giant diff.
- **Ask for the written trace, not just the chat answer.** A `HANDOFF.md`
  changelog paragraph is what lets the *next* session (possibly a different
  agent, possibly you next week) pick up work without re-deriving context.
  Chat history doesn't carry over between sessions; the repo does.
- **Expect the wrap-up message at the end of every task** — plain English,
  what shipped, the PR link, what's next. If an agent stops without one, ask
  for it; it's the fast path to knowing what happened without reading a diff.

---

## 5. Common mistakes to avoid

- Asking an image tool for "a car" / "a tree" / "a building" expecting a
  droppable 3D model — you'll always get a 2D picture; decide up front which
  of texture / sprite / concept-ref you actually need.
- Placing a background sprite (tree, crowd, prop) anywhere inside the
  drivable map instead of past its edge — invisible-wall/ghost-object bugs.
  See §4 above.
- Committing an image straight from the generator without the budget pass —
  oversized or wrong-format files are the most common cause of a "why is the
  game slow on my phone" report.
- Letting an agent start a big refactor, a new system, or a save-format
  change without your sign-off — that's a hard stop per `AGENTS.md` §2 rule 6;
  the agent should flag it and wait, not guess.

---

## 6. Starting a fresh session, fast

1. Point the agent at `AGENTS.md` first — it'll find the doc map and the live
   board on its own.
2. Tell it which **▶ Next up** item you want, or hand it a specific ask.
3. Expect: a claimed task on the board → committed work on its own branch →
   a green test suite (`cd tests && node run.js`) → a PR to `main` → a
   plain-language wrap-up to you.
4. You merge. That's the only step that's yours by default.
