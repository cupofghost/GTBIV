# GTB — Build Plan, Asset Pipeline & State-of-the-Game Report

> **Audience:** Austin (owner) + every agent working on *Grand Turbo Boost IV:
> San Chaos* — the Claude planning/wiring track, the Kimi coding track, and the
> image-gen art track (Nano Banana / Midjourney).
>
> **What this doc is:** the top-level map. It answers three things:
> 1. **Where the game is right now** (verified, with numbers).
> 2. **How to keep adding to it forever** without breaking mobile or the
>    zero-build, self-contained deploy — including the **Places & Loading**
>    system for moving between areas.
> 3. **How to run multiple AI agents** (code + graphics) so their output lands
>    cleanly in this repo and stays inside the code.
>
> **Where it sits vs. the other docs:**
> - `HANDOFF.md` — the engineering backlog + architecture (the *how* of the code).
> - `STORY_BIBLE.md` / `CHAPTER1.md` / `FOOTBALL_STRAND.md` — the narrative canon.
> - `CHARACTERS.md` — the character-model / creator / cutscene plan.
> - **This doc** — the strategy that ties them together and the asset pipeline.
> When a plan here becomes a concrete coding task, it gets promoted into
> `HANDOFF.md §8` as a backlog card and built there.

---

## 1. Verified state — today (2026-07-23)

Everything below was **checked, not assumed**:

| Check | Result |
| --- | --- |
| Headless regression suite (`cd tests && node run.js`) | **36 passed, 0 failed** (285s) |
| Clean boot smoke (headless Chromium, 800×390 landscape) | **Boots, starts, 0 console/page errors** |
| Three.js revision at runtime | **r128** (vendored, no CDN) — as required |
| Live world at spawn | 58 cars, 126 pedestrians, 11 jocks, football field + pizza place + light-rail train all present |
| Persistence | `localStorage['gtb4.save']` + `gtb4.settings` round-trip cleanly; no per-frame writes |

**Bottom line: the game is healthy and shippable right now.** It is a dense,
working GTA-style sandbox. Nothing below is a fire — it's a roadmap for depth
and growth.

### What already exists and works
A procedural city (blocks, roads, water, ramps, gentle terrain, elevated light
rail, climbable stairs/fire escapes, rooftop hideouts) with: driveable cars +
bikes + helicopters, cop AI + cop helis + **foot cops**, pedestrians + dogs
(strays band into gangs), a heist system, a rival pizza-gang war, ambient
**Chaos High jocks**, five random side-missions, a **30-second replay** system
with a photo-op fly-cam, a fully **procedural 80s synthwave soundtrack** (3
stations, FX rack, ducking), recorded Turbo voiceover, cutscenes, a **pause +
settings** menu, **save/continue**, and a gated **dev toolkit** (`?dev=1`:
cheat panel, scene-jump flags, debug HUD, `viewer.html` model turntable).

---

## 2. Act 1 status — "Chapter 1: Paying Debts"

**Act 1 is a complete, closed loop with a real beginning, middle, and ending.**
It is playable start-to-finish today.

**The spine (all implemented):**
1. Title → loader → Turbo narrates the setup ("$800 to Deb by tonight or back
   to jail").
2. Meet Deb (pink beacon) → **`deb_confrontation` cutscene** → her 3-line
   lecture sets the **$800 debt** and the debt HUD.
3. Earn money: **stick people up** with the pistol, **rob glowing stores**,
   run **side-missions** and pizza deliveries. Pressure beats fire on their
   own: **`first_score`** cutscene at $200, a **`pizza_warning`** cutscene if
   you provoke the pizza gang, ambient "debt grumble" barks while you owe.
4. Return to Deb with ≥ $800 → **`deb_payoff` cutscene** → `DEB PAID` →
   *"Chapter 2 coming soon…"* and Deb walks off.

**The football sub-arc (Phase 7) is half-built:**
- ✅ **FB1** Ambient jocks (roam, taunt, fight) — done.
- ✅ **FB2** Chaos High football field landmark (turf, goalposts, bleachers,
  scoreboard) — done.
- ⬜ **FB3** "Revenge on Coach" mission — **not built.** (`G.coachBeaten`
  save-flag is already reserved for it.)
- ⬜ **FB4** Football minigame — not built.
- ⬜ **FB5** Cheerleaders cutscene payoff — not built.

### What's missing / the biggest opportunities in Act 1

| Gap | Impact | Effort |
| --- | --- | --- |
| **~90 recorded Turbo voice lines are staged but not wired.** `voice/turbo/story/`, `voice/turbo/cutscenes/`, `voice/turbo/backstory_intro/` are recorded and organized but **zero** of them are referenced in code — only `intro/` + `ambient/` play. | **Huge.** The single highest polish-per-hour win in the game. Robbery, pay-Deb, pizza-jack, and all five football cutscene VO already exist as audio; they just need `{src:…}` wiring. | Low–Med |
| **FB3–FB5** — the football payoff the whole backstory builds toward. All voice + field already exist. | High (narrative payoff) | Med–High |
| **Chapter 2 is a title card, not content.** The game ends on "coming soon." | Defines the next content beat | (Design first) |
| **No memory leak cleanup (R1).** `.dispose()` is never called; long mobile sessions climb until the tab dies. | High on phones | Med |
| **No adaptive graphics quality (F3).** Pixel ratio set once; weak phones just chug. | Highest raw mobile win | Med |

Full backlog and acceptance criteria live in `HANDOFF.md §8`. The suggested
order there still holds: **R1 (stop the leak) → F3 (adaptive quality)** are the
two P0s, and **wiring the staged voice** should slot in right beside them
because the payoff is so high for so little risk.

---

## 3. The North-Star constraints (the contract for everything new)

Every future addition — a district, a mission, a texture, a chapter — must
satisfy these, or it doesn't ship. These are non-negotiable and already encoded
in `HANDOFF.md §2`; restated here because they *are* the "keep it in the code /
keep it working on phones" ask:

1. **Everything lives in the repo.** No CDN, no `npm install` at runtime, no
   external image/font/script host. Three.js stays vendored at `three.min.js`
   (r128). Assets are committed files referenced by **plain relative paths**.
   If a URL points outside this repo, it's wrong.
2. **Zero build step.** It's a static site served as-is. New JS = ordered
   `<script>` tags at most; new art = committed files.
3. **Mobile-first, landscape, 60fps target (never below ~30).** Validate every
   change at ~800×390 touch. Nothing new may overlap the joystick/pedals/
   buttons, and nothing new may allocate inside the render loop.
4. **Playable at every commit.** One logical change per commit; suite green
   (`cd tests && node run.js`) before each.

> **Why loading screens matter here:** on a phone you cannot hold the whole
> world *plus* every future district/interior/minigame in memory at full detail
> and stay at 60fps. The answer isn't a bigger world in memory — it's **swapping
> content in and out behind a short loading screen**, so any single "place" is
> cheap. Section 4 is the system that makes that safe and reusable.

---

## 4. Places & Loading — the growth architecture (the core of "keep adding")

This is how the game scales to many areas — new districts, building interiors,
the football minigame, future chapters — **without** the mobile budget
exploding. It generalizes two things the codebase already does.

### 4.1 What already exists (the seeds)
- **A boot loading screen** (`#loadScreen`, styled + animated, with rotating
  tips and a progress bar) — currently only used once, at startup
  (`runLoader()`).
- **A working interior** — the pizza place. Its interior is built **hidden at
  `y = -40`** and entering is a **teleport** down to it (`enterPizzaPlace` /
  `exitPizzaPlace` / `updateInteriorCamera`), gated on door proximity, tracked
  by `G.interior`. No streaming, no unload — it's always resident.

That teleport-to-a-hidden-room trick is the whole idea in miniature. We
formalize it into a reusable **Place** system with **lifecycle + a loading
screen** for the heavy ones.

### 4.2 The design: `Place` + `loadPlace(id)`

A **Place** is any self-contained scene you can be inside: the open city (the
"overworld"), an interior, a district, a minigame arena, a cutscene stage.

```js
// A Place is a plain object (matches the codebase's no-class style):
const PLACES = {
  city:      { heavy:false, build:null,            enter:enterCity,      exit:null },
  pizza:     { heavy:false, build:buildPizzaInt,   enter:enterPizza,     exit:exitPizza },
  turbobowl: { heavy:true,  build:buildTurboBowl,  enter:enterTurboBowl, exit:exitTurboBowl },
  // future: mall, docks, chapter2_hideout, ...
};

let CUR_PLACE = 'city';

// The one entry point everything routes through.
function loadPlace(id, opts = {}) {
  const next = PLACES[id]; if (!next || id === CUR_PLACE) return;
  const heavy = next.heavy || opts.heavy;
  const go = () => {
    PLACES[CUR_PLACE].exit && PLACES[CUR_PLACE].exit();  // tear down / hide old
    if (next.build && !next.built) { next.build(); next.built = true; } // lazy build
    next.enter(opts);                                    // teleport + camera + HUD
    CUR_PLACE = id;
  };
  if (heavy) transitionWithScreen(go);   // show loadScreen, run go() behind it
  else       go();                       // light places: instant, no screen
}
```

**The loading screen for transitions** reuses `#loadScreen` — one function:

```js
function transitionWithScreen(work, { minMs = 500 } = {}) {
  const el = $('loadScreen');
  el.style.display = 'flex'; el.classList.remove('off');   // fade in (0.8s CSS)
  const t0 = performance.now();
  requestAnimationFrame(() => requestAnimationFrame(() => {  // let the fade paint
    work();                                                  // heavy build/swap hidden behind it
    const wait = Math.max(0, minMs - (performance.now() - t0));
    setTimeout(() => { el.classList.add('off');             // fade out
      setTimeout(() => { el.style.display = 'none'; }, 800); }, wait);
  }));
}
```

### 4.3 The rules that keep it mobile-safe
- **Lazy build.** A Place's geometry/textures are built the **first time** you
  enter it (`built` flag), not at boot. Boot stays fast.
- **Only the overworld + the current place are "hot."** When you enter a heavy
  place, the loading screen hides the world swap; when you leave, its meshes are
  hidden (light places) or **disposed** (heavy places) so GPU memory drops back
  down. This is where **R1's `disposeMesh()` helper is a hard dependency** —
  build it first, then Places can lean on it to unload cleanly.
- **Light vs. heavy is a budget call, not a size call.** A one-room interior =
  light (instant teleport, stays resident, like the pizza place today). A whole
  district or a minigame arena with its own props/actors = heavy (loading
  screen, built lazily, disposed on exit).
- **The screen is a feature, not an apology.** Reuse the tip/rotating-status
  pattern already in `runLoader()` so every transition teaches or flavors.
  Later, per-place splash art (see §6) makes each destination feel distinct.

### 4.4 Where this plugs in immediately
- **FB4 football minigame** is the first natural "heavy place" — build it as
  `PLACES.turbobowl` so the pattern gets proven on real content.
- The **pizza interior** gets refactored to a light Place (behavior identical,
  now uniform) so there's one door/enter/exit convention instead of a special
  case.
- **Chapter 2** onward: new areas are new Place entries. The overworld never
  has to hold them.

> **Backlog card to promote into `HANDOFF.md` when we build this:**
> **PL1 — Places & Loading system `P1 · Risk: Med`.** Generalize the pizza
> interior + `#loadScreen` into `PLACES`/`loadPlace(id)`/`transitionWithScreen`.
> Depends on **R1** (`disposeMesh`) for heavy-place teardown. Acceptance: enter/
> exit the pizza place through the new system with identical behavior; a heavy
> test place shows the loading screen, builds lazily, and disposes on exit with
> GPU memory returning to baseline; boot time unchanged; suite green.

---

## 5. Mobile performance plan (so it stays smooth as it grows)

The Places system controls *how much world is resident*. These control *how
expensive the resident world is* — do them in this order:

1. **R1 — Dispose on removal** (`P0`). The leak fix. Add `disposeMesh(obj3d)`;
   call it on every permanent despawn and on heavy-Place unload. Without this,
   long sessions and Place-swapping both bleed memory. **Prerequisite for §4.**
2. **F3 — Adaptive graphics quality** (`P0`). Low/Med/High tiers driving pixel
   ratio + population caps + particle budget + draw distance, auto-stepping off
   the existing fps counter, with a manual override in Settings. Biggest single
   phone win.
3. **R2 — Pool traffic/peds**, **R3 — anti-stuck / spawn safety** (`P2`).
   Smoother frame times, no wedged states.
4. **Texture discipline** (see §6.4): every new art asset is sized to a mobile
   budget before it's committed. A gorgeous 4K facade texture that tanks fps is
   a bug, not an upgrade.

---

## 6. The multi-agent workflow (code + graphics, all landing in-repo)

You'll use several agents. The trick is a **clean division of labor** and a
**hand-off contract** so their output drops into the repo without anyone
untangling it later.

### 6.1 Who does what

| Agent | Owns | Does **not** do |
| --- | --- | --- |
| **Claude** (planning/architecture/wiring) | This doc + `HANDOFF.md`, system design, wiring staged assets into gameplay, audio/soundtrack, code review, tests, the risky refactors | Grind out large feature implementations solo |
| **Kimi (K2 / K3)** (coding) | Implementing backlog cards from `HANDOFF.md` — features, missions, the Places system, FB3–FB5 | Design decisions that aren't specced; art |
| **Nano Banana** (Gemini image gen) | **Consistent, editable raster art**: character texture sheets, sign/decal variants, iterating on an existing image, in-painting fixes, style-matched variations of an asset | 3D models; final sizing/commit (a human/Claude processes + commits) |
| **Midjourney** (image gen) | **High-craft key art & mood plates**: title/loading splashes, skybox/mood textures, tileable texture *starting points*, concept exploration | Precise text on signage; iterative edits to a fixed subject (Nano Banana is better at that) |

### 6.2 The most important graphics principle for THIS engine

**Image models make 2D pictures. This engine builds its 3D world from code.**
So image-gen art feeds the **texture and 2D layers**, never the geometry:

- ✅ **Great fits:** building facade textures, ground/turf/road textures,
  storefront signs and decals (the game already paints these onto canvases —
  see `groundTex`, the pizza sign, the football-field texture), **skybox / sky
  gradients**, **loading-screen splash art**, **title/key art** (`title-bg.jpg`
  already exists), HUD/menu icons, and **character "paint" textures** once
  `CHARACTERS.md`'s paintable-UV system (C3) lands.
- ❌ **Not fits (don't try):** generating `.obj`/`.glb` meshes, "make me a car
  model," anything that would add a runtime model loader or break zero-build.
  Geometry stays procedural Three.js primitives. If a shape needs to change,
  that's a Kimi/Claude code task, not an image-gen task.

This is exactly why the repo already says *"drop the final art in at the same
path/filename to replace the placeholder — no code changes needed."* The art
pipeline's job is to produce files that slot into fixed paths.

### 6.3 The hand-off contract (how art gets into the repo cleanly)

1. **Fixed destinations.** Art lives at committed relative paths. Put new art
   under a top-level **`art/`** folder (referenced relatively), or replace an
   existing placeholder at its exact path. Never reference an image by external
   URL.
2. **The engineer requests, the artist fills.** When a feature needs art,
   Claude/Kimi adds the code referencing `art/<name>.jpg` (or a placeholder),
   and files a one-line spec: *purpose, target path, pixel size, tileable?,
   palette (San Chaos synthwave — hot pink `#ff3ea0`, cyan, gold `#ffd23e`,
   deep purple `#0a0612`), reference image.* The art agent produces to that
   spec.
3. **One folder per drop, descriptive names** — mirror the `voice/` convention
   that already works (`voice/<character>/<category>/<slug>.mp3`). E.g.
   `art/facades/`, `art/sky/`, `art/loading/`, `art/ui/`.
4. **Round-trip through Nano Banana for consistency.** To make a *set* (four
   facade variants, a character's front/back, day/night of one sign), generate
   one hero image, then use Nano Banana's edit/consistency to derive the rest so
   they share a look. Midjourney for the initial hero when craft matters most.
5. **A human or Claude does the final "make it game-ready" step:** crop to
   power-of-two, tile-check, resize to the mobile budget, compress, commit. Raw
   generator output is never committed directly.

### 6.4 Mobile texture budget (commit-time checklist for every image)
- **Power-of-two** dimensions (256, 512, 1024). Props/signs ≤ **512²**; hero/
  sky/loading ≤ **1024²**. Rarely go past 1024 on a phone.
- **Format:** JPG for photographic/opaque plates (facades, sky, splashes), PNG
  only when you need alpha (decals, icons). Keep each file lean (target the
  low hundreds of KB, like the existing `title-bg.jpg`).
- **Prefer atlases / trim sheets:** one 1024² sheet of many small elements beats
  many separate textures (fewer GPU uploads, fewer draw calls).
- **Heavy textured places load behind the §4 loading screen** — that's what
  buys the swap-in time budget.

### 6.5 The loop, end to end
```
Design beat (STORY_BIBLE / this doc)
   → Claude specs it → backlog card in HANDOFF.md
      → Kimi implements the code + wires placeholder art paths
      → Nano Banana / Midjourney produce art to the spec
         → processed to mobile budget → committed at the fixed path
            → Claude wires any staged VO + reviews + runs the suite
               → commit (green, playable) → repeat
```

---

## 7. Recommended next 10 moves

In leverage order — each is small, verifiable, and keeps the game shippable:

1. **R1 — dispose GPU resources on removal.** Stops the mobile memory leak and
   unblocks the Places system. `P0`.
2. **Wire the staged robbery + pay-Deb VO** (`voice/turbo/story/robbery/`,
   `robbery_take/`, `paying_deb/`, `pizza_jack/`). Recorded, unused, high impact,
   low risk.
3. **F3 — adaptive graphics quality.** Biggest raw phone win. `P0`.
4. **PL1 — Places & Loading system** (§4). Build it, port the pizza interior to
   it. Unblocks all future areas.
5. **FB3 — "Revenge on Coach" mission** (cutscene + fight, sets `G.coachBeaten`).
   Its VO (`voice/turbo/cutscenes/coach_*`) already exists.
6. **FB4 — football minigame** as the first heavy Place (proves PL1 on real
   content). VO staged in `turbo_bowl_*`.
7. **FB5 — cheerleaders cutscene** — closes the football arc.
8. **U1 — objective clarity / HUD readability** for small screens.
9. **First art pass through the pipeline (§6):** a proper skybox + 2–3 facade
   textures + a per-place loading splash — proving the graphics workflow.
10. **Design Chapter 2** in `STORY_BIBLE.md` so "coming soon" becomes a plan.

---

## 8. Appendix — verified facts & repo deltas

- **Suite:** `36 passed, 0 failed` (2026-07-23).
- **Boot:** clean, 0 console errors, Three r128, 58 cars / 126 peds / 11 jocks.
- **Persistence keys:** `gtb4.save`, `gtb4.settings`.
- **Voice wired:** only `voice/turbo/intro/` + `voice/turbo/ambient/*/`.
  **Staged (recorded, unwired):** `story/`, `cutscenes/`, `backstory_intro/`
  (~90 lines).
- **New folder this plan introduces:** `art/` (committed, relative-path art —
  created when the first real texture lands).
- **New systems this plan introduces (not yet built):** `PLACES` /
  `loadPlace()` / `transitionWithScreen()` (§4), promoted to `HANDOFF.md` as
  **PL1** when work starts.

*Nothing in this doc changes game code. It's the map; the code changes happen
as `HANDOFF.md` backlog cards, verified green and committed one at a time.*
