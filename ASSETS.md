# ASSETS.md — Generating Art for *Grand Turbo Boost IV: San Chaos*

> **Audience:** Austin (at the image tools) **and** every agent that requests,
> makes, processes, or wires art. This is the *how-to-actually-make-it* guide.
> The *who-does-what* and the request queue live in **`AGENTS.md §4`**; the
> pipeline strategy lives in **`GAME_PLAN.md §6`**. This doc is the third leg:
> **how to prompt Midjourney / Nano Banana / Kimi so the output looks great,
> matches San Chaos, and drops into the engine without overloading it.**

---

## 0. The one rule that shapes everything (read first)

**Image models make flat 2D pictures. This engine builds its 3D world from
code** (procedural Three.js primitives, r128, vendored). So when you ask for a
"car," a "tree," a "building," or a "person," you are **never** generating a 3D
model to drop in — there is no model loader and there never will be (it would
break the zero-build, self-contained deploy).

What you *are* generating is one of **three things** (§3). Every recipe in this
doc tells you which one you're making. Get this right and art slots in at a
fixed file path with little or no code change. Get it wrong and you've made a
pretty picture the engine can't use.

> If a *shape* has to change (a new car silhouette, a taller building), that's a
> **code task** for Kimi/Claude, not an art task. Art changes the *skin*, not
> the *bones*.

---

## 1. The San Chaos style DNA (bake this into every prompt)

Everything must read as one world: **1980s neon-noir, synthwave, sun-baked
crime-comedy city at magic hour.** Consistency beats individual brilliance — a
gorgeous asset in the wrong palette is a bug.

**Canonical palette** (copy verbatim into prompts and into any code that tints
art):

| Role | Hex | Name |
| --- | --- | --- |
| Primary neon | `#ff3ea0` | hot pink |
| Secondary neon | `#24d0e0` | cyan |
| Accent / highlight | `#ffd23e` | gold |
| Base / shadow | `#0a0612` | deep purple-black |

**Style suffix — paste at the end of every prompt** (tune only the subject):

```
…, 1980s synthwave neon-noir aesthetic, San Chaos crime-comedy city, magic-hour
sunset lighting with hot-pink #ff3ea0 and cyan #24d0e0 rim light and gold #ffd23e
highlights over deep purple-black #0a0612 shadows, bold clean shapes, slightly
stylized not photoreal, high contrast, no text, no watermark, no logo
```

**Always include:** flat/even lighting for *textures* (so the engine can light
them), the palette, "slightly stylized." **Always avoid:** baked-in hard
shadows on tiling textures, lens flare on assets meant to be lit in-engine,
real brand names/logos, legible gibberish text (add real text in code instead —
see §4 Signage), and photoreal skin/grit that fights the toy-city look.

---

## 2. The three generators — pick the right tool

| Tool | Best at | Reach for it when | Weak at |
| --- | --- | --- | --- |
| **Midjourney** | High-craft **hero & mood** images — title/loading splashes, skyboxes, mood plates, a first "hero" texture with real style | The image is *seen big* or sets the look; you want the most beautiful single frame | Precise text; making a *matched set*; iterating on one fixed subject |
| **Nano Banana** (Gemini image) | **Consistency & editing** — variant sets from one hero, in-painting fixes, decals/liveries, character "paint" sheets, day/night of the same sign | You need *four of the same thing*, or to edit an existing asset while keeping it on-model | The single most beautiful hero frame |
| **Kimi** *(optional / experimental)* | Fast iterations, quick concept refs, cheap variations, a second opinion on a prompt | You want throwaway concept exploration or a fallback generator; treat output as a *starting point* | Anything final without a Nano Banana / processing pass |

**Routing rule:** *Midjourney makes the hero → Nano Banana makes the set and the
fixes → Kimi is optional scratch/overflow.* Whatever the source, **every image
goes through the same §5 processing and the same fixed-path commit.** The
generator is an implementation detail; the pipeline is the contract.

> Note: "Kimi" is also the **coding** agent in `AGENTS.md`. Here it means Kimi's
> image generation, used only as an optional art source. Its code lane is
> unchanged.

---

## 3. What you're actually making — the three output kinds

Every asset is one of these. Recipes in §4 are tagged with which one.

**(A) Detail / tiling texture** — a flat image painted onto in-engine geometry
(a building face, the road, turf, a car body). The engine already textures this
way: it draws to a `<canvas>` and wraps it in `THREE.CanvasTexture` (see
`groundTex`, the pizza sign, the football-field texture in `index.html`). Your
image **replaces or composites into** that canvas. Must tile seamlessly if it
repeats; must be **evenly lit** so the engine's lights do the shading.

**(B) Billboard sprite / impostor** — a 2D cutout on a camera-facing quad, used
for the **far / background layer**: distant trees, background skyline buildings,
crowds, sun, particles. The engine already uses `THREE.Sprite` for exactly this.
Sprites are *cheap* — this is how you get a lush, dense-looking world **without
overloading the code**: near objects are real geometry, the far layer is
sprites. Needs a **transparent background (PNG with clean alpha)**.

**(C) Concept reference** — art nobody commits to the runtime. It's a visual
spec *for the coder* building or tuning the procedural geometry (a car
silhouette, a building proportion study, a character turnaround). Lands in
`art/concept/` or attached to a `HANDOFF.md` card, **never loaded by the game.**

> **Choosing near vs. far (the quality-vs-budget call):** the handful of things
> the player is *next to* get real geometry + an (A) texture. Everything in the
> distance is a (B) sprite. This split is the whole trick to "looks as good as
> possible, doesn't overload the code."

---

## 4. Per-subject recipes

Each recipe: **what to actually make**, a **ready-to-paste prompt** (append the
§1 style suffix), the **size/format**, and **how it lands** in the engine. Sizes
obey the §5 budget.

### 🚗 Cars
- **Near (player/traffic cars):** geometry stays code. Art = **(A) livery/paint
  decal** and **(C) concept silhouettes**. Don't try to generate a whole car as
  a usable asset.
  - *Decal prompt:* `flat top-down and side livery decal sheet for a stylized
    1980s coupe, racing stripes and neon accents, transparent background, even
    lighting` → **512² PNG**, alpha → lands as a decal texture tinted in code.
  - *Concept prompt:* `three-quarter concept render of a boxy 80s muscle car,
    clean stylized shapes` → **(C)** ref only, `art/concept/cars/`.
- **Far (parked/background traffic):** **(B) sprite.** `side-profile cutout of a
  stylized 80s sedan, flat colors, transparent background` → **256² PNG** →
  billboard.

### 🧍 People / Characters
- Bodies are procedural (see `js/person.js`, `CHARACTERS.md`). Art = **(A)
  character "paint" / UV texture** once the paintable-UV system (C3) lands, plus
  **(C)** turnarounds now.
  - *Paint prompt:* `flat character texture sheet, front-facing, evenly lit,
    stylized 1980s streetwear, no baked shadows, transparent where off-body` →
    **512² PNG** → paints onto the character mesh's UVs.
  - *Turnaround (concept):* `front/side/back turnaround of <character from
    CHARACTERS.md>, model sheet, neutral pose` → **(C)** `art/concept/chars/`.
- **Crowds (far):** **(B) sprite** cutouts, 3–4 silhouetted pedestrians, **256²
  PNG** alpha → billboards for background density.

### 🌳 Trees / Foliage
- **The sprite win.** Trees are the textbook **(B) impostor** — real tree
  geometry is expensive and pointless at distance.
  - *Prompt:* `single stylized palm / broadleaf tree cutout, flat shapes, gentle
    neon rim light, centered, transparent background, no ground shadow` → **256²
    or 512² PNG**, alpha → camera-facing sprite. Make a **set of 3–4** via Nano
    Banana so the park doesn't look cloned.
- **Near hero tree (rare):** a low-poly code trunk + **(A)** canopy texture only
  if the player stands under it.

### 🏢 Buildings / Facades
- **Near buildings:** box geometry in code + **(A) facade texture** (windows,
  storefronts, neon). This is the highest-impact texture in the game.
  - *Prompt:* `seamless tileable 1980s city building facade texture, rows of
    windows, neon storefront glow at street level, flat orthographic, even
    lighting, no perspective, no sky` → **512² (props) or 1024² (hero) JPG**,
    **tileable** → wraps the building mesh.
  - Make **variants** (office / apartment / neon-strip / industrial) as a Nano
    Banana set so blocks vary.
- **Far skyline:** **(B) sprite** — `flat cutout of a distant 80s skyscraper
  silhouette with lit windows, transparent background` → **512² PNG** →
  background billboards behind the play area.

### 🪧 Signage / Decals / Storefronts
- **(A)** the *plate* only — **let code draw the words.** The engine composites a
  loaded background image + code-drawn text on one canvas (that's how the pizza
  sign works), so text stays razor-sharp and localizable.
  - *Prompt:* `blank neon sign backing plate, glowing tube border, dark center
    panel, no text, transparent or dark background` → **256×80 or 256² PNG** →
    code writes the store name on top. **Never rely on the model for text.**

### 🛣️ Ground / Road / Turf
- **(A) seamless tiling texture.** `seamless tileable cracked asphalt road with
  faded neon lane markings, top-down, even lighting` / `…turf…` / `…sidewalk…`
  → **512² JPG**, **power-of-two, verified tiling** → replaces/composites into
  the ground canvas (`groundTex`).

### 🌆 Sky / Mood plates
- **(A) full-frame plate** (Midjourney's strength). `wide synthwave sunset sky,
  gradient magenta to purple, distant city silhouette, soft sun, no foreground`
  → **1024² JPG**, *not* tiled → skybox / mood backdrop. Make a **day** and a
  **night** variant (the engine swaps sky day↔night).

### 🖼️ Loading / Title / Key art
- **(A) hero frame** (Midjourney). Full scene, characters, drama — this is seen
  big and sets first impressions. `key art of Turbo Jones in San Chaos, 80s
  action-comedy poster, dynamic` → **1024² JPG** → `art/loading/` or replaces
  `title-bg.jpg`. Per-place loading splashes make each destination feel distinct.

### 🔘 UI / Icons / HUD
- **(A) small alpha sprites.** `flat minimal HUD icon of <thing>, single neon
  color on transparent, thick clean strokes, no text` → **≤128² PNG**, alpha.
  Prefer **one atlas** of many icons over many files (fewer GPU uploads).

---

## 5. Make it game-ready — the budget & the processing pass

**Raw generator output is never committed.** A human or Claude does this pass
first. (Full rationale: `GAME_PLAN.md §6.4`.) "Not overloading the code" is
mostly *this checklist* — a 4K facade that tanks fps is not an upgrade.

**Budget checklist (every image, before commit):**
- ☐ **Power-of-two** dimensions: 128 · 256 · 512 · 1024. **Never larger than
  1024** on a phone.
- ☐ **Props / signs / sprites ≤ 512²** · **hero / sky / loading ≤ 1024².**
- ☐ **Format:** **JPG** for opaque plates (facades, sky, ground, splashes);
  **PNG only** when you need **alpha** (sprites, decals, icons).
- ☐ **File size lean** — target the low hundreds of KB (match the existing
  `title-bg.jpg`). Compress.
- ☐ **Tiling assets verified seamless** (offset-tile check) before commit.
- ☐ **Sprites: clean alpha**, subject centered, no stray matte fringe.
- ☐ **Prefer atlases** — one 1024² sheet of many small elements beats many files.

**Processing steps:** crop → tile-check (if tiling) → resize to budget →
flatten/clean alpha → compress → commit at the fixed path.

**Where it lands:** one folder per drop under top-level **`art/`**, descriptive
lowercase names, mirroring the `voice/` convention:
`art/facades/`, `art/sky/`, `art/loading/`, `art/ui/`, `art/sprites/`,
`art/decals/`, `art/concept/`. **Relative paths only — never an external URL.**

**How it wires (the swap-in point):** the engine draws textures onto a
`<canvas>` today. To use real art, load the committed file with
`THREE.TextureLoader` and either use it directly as `material.map` **or** draw
it into the existing canvas and keep compositing code-drawn text on top (the
signage pattern). Same fixed path in → no other code change. That's why the
request queue says *"drop the final art in at the same path and the code already
points at it."*

---

## 6. The flow (request → make → wire)

Art is pulled by a need, not pushed speculatively. Full protocol + the live
queue: **`AGENTS.md §4`.** Short version:

```
Feature needs art
  → engineer files a spec row in AGENTS.md §4  (purpose · target path · size ·
       tileable? · output kind (A/B/C) · palette · reference)
     → Midjourney heroes it  →  Nano Banana makes the set / fixes  (Kimi optional)
        → §5 processing pass  →  commit at the fixed path
           → Claude wires it, runs `cd tests && node run.js` (green)
              → changelog paragraph in HANDOFF.md  →  done
```

**Human quick-start (Austin at the tools):** grab the §4 spec row → pick the
tool from §2 → paste the subject + §1 style suffix → generate → hand the raw
file back for the §5 pass (or do it yourself) → it commits to the named path.

**Agent quick-start:** never invent art needs — pull a §4 row. Tag the **output
kind (A/B/C)**. Produce to the size/format budget. Route through §5. Leave the
trace in `HANDOFF.md`. Then give Austin the wrap-up message (below).

---

## 7. Ending a task — the human wrap-up message

**Every agent, at the end of every task** (art or not), gives Austin a short,
plain-language wrap-up: **what was delivered + next steps.** This is the
canonical standing rule and it lives in **`AGENTS.md §7`** — read it there. It is
**separate from** the `HANDOFF.md`/board trace, which is written *for the next
agent*; the wrap-up is written *for Austin, the human.* Do both, every time.

For an art task the wrap-up says, in human terms: what images landed and where,
what they're for, how they look / any caveats, and the obvious next move (wire
it, make the matching set, request the next asset).
