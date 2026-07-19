# Grand Turbo Boost IV: San Chaos

A neon-soaked, top-down/3D open-world action game for mobile browsers. Play as
**Turbo Jones**, fresh out of minimum security with twelve dollars and a bus
pass — and an ex-wife who wants $800 in child support by tonight. Steal cars,
fly helis, dodge cops, and cause chaos in San Chaos City.

Built as a single self-contained HTML5 page using [three.js](https://threejs.org)
for the 3D world and the Web Audio API for engine sounds, procedural music, and
recorded voiceover. Designed for **landscape** phones and installable as a PWA.

<p align="center"><img src="icon-512.png" width="140" alt="GTB IV icon"></p>

## Play it

The game loads its audio with `fetch()`, so it **must be served over HTTP** —
opening `index.html` directly from the filesystem (`file://`) will silently drop
the sound. Any static server works:

```bash
# from the repo root
python3 -m http.server 8099
# then open http://localhost:8099/index.html
```

### Host it on GitHub Pages

This repo is a static site at the root, so it deploys with no build step:

1. Push this branch to GitHub.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Pick the branch and the **`/ (root)`** folder, save.
4. Open the published URL on your phone and **Add to Home Screen** to install
   it as a fullscreen app (uses `manifest.json` + the app icons).

## Controls

| Action | Touch | Desktop |
| --- | --- | --- |
| Move | Left thumb stick | `W` `A` `S` `D` |
| Look around | Swipe right side of screen | Drag right side |
| Drive | On-screen pedals | `W` / `S` |
| Enter / steal vehicle | On-screen button | `F` |
| Punch / fists | On-screen button | `E` |
| Gun | On-screen button | `G` |
| Jump | On-screen button | Space |
| Radio | Tap ♪ | `Q` |
| Day / night | — | `N` |
| Crouch | — | `C` |
| Pizza Wars mission | — | `M` |

Objectives: stick people up with the pistol, rob glowing stores, and pay Deb her
$800 before the cops catch up. Your wanted level climbs with every crime.

## Repo layout

Everything sits flat at the repo root because the game references assets with
plain relative paths.

| File | Purpose |
| --- | --- |
| `index.html` | The entire game (markup, styles, and logic) |
| `HANDOFF.md` | Engineering handoff — architecture, code map, and the prioritised improvement backlog for contributors |
| `CHARACTERS.md` | Character-model, paint/creator, and cutscene-rendering plan (companion to `HANDOFF.md`) |
| `STORY_BIBLE.md` | Story & script-writing framework — canon, voice, world, and mission/cutscene templates for narrative work |
| `three.min.js` | Vendored three.js r128 (see note below) |
| `manifest.json` | PWA manifest — name, icons, fullscreen/landscape |
| `icon-512.png`, `apple-touch-icon.png` | App / home-screen icons |
| `title-bg.jpg` | Title-screen background art |
| `panel1.jpg`, `panel2.jpg`, `panel3.jpg` | Legacy key-art panels (no longer referenced) |
| `vo1.mp3` – `vo4.mp3` | Turbo Jones intro narration (with subtitles) |
| `t_run1.mp3` – `t_run7.mp3` | "Run someone over" catchphrases |
| `t_shoot1.mp3` – `t_shoot6.mp3` | Shooting catchphrases |
| `t_approach1.mp3` – `t_approach12.mp3` | Talking to a pedestrian |
| `t_punch1.mp3` – `t_punch11.mp3` | Punch catchphrases |
| `t_slow1.mp3` – `t_slow9.mp3` | Driving too slow catchphrases |
| `t_stopsign1.mp3` – `t_stopsign9.mp3` | Running a red light catchphrases |
| `t_cops1.mp3` – `t_cops11.mp3` | Cop-chase catchphrases |
| `t_car1.mp3` – `t_car6.mp3` | Stealing a car catchphrases |
| `Turbo Jones Voice MP3s/` | Unused voice-casting auditions (two takes of the intro line) kept for reference — not wired into the game |

### three.js is vendored, not from a CDN

The original build pulled three.js r128 from a CDN. It's now committed locally as
`three.min.js` (the official npm `three@0.128.0` build) and loaded with a
relative `<script src="three.min.js">`. This makes the game self-contained: no
external dependency, no single point of failure, and it works offline once the
page is cached.

### Placeholder art

`panel1–3.jpg` and the two app icons in this commit are **synthwave placeholders**
generated to match the game's aesthetic so nothing renders blank. Drop the final
concept-art files in at the same paths/filenames to replace them — no code
changes needed.

## Credits

- Game design & code prototyped with **Kimi**.
- Composed, wired up, tested, and vendored into this repo with **Claude Code**.
- Voiceover & sound effects: provided audio assets.
