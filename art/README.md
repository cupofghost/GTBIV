# art/ — committed game art

All raster art lives here, **committed at plain relative paths** (never a CDN or
external host — see the self-contained rule in `../HANDOFF.md §2` and the full
pipeline in `../GAME_PLAN.md §6`). Code references these files directly, e.g.
`art/sky/dusk.jpg`.

> **Not here:** the app icons (`../icon-512.png`, `../apple-touch-icon.png`) and
> the title background (`../title-bg.jpg`) stay at repo root — they're wired into
> `manifest.json` / the title-screen CSS by root-relative path, and moving them
> would change the deploy shape. New art goes here; those three don't move.

## Layout (one folder per kind, mirrors the `voice/` convention)
| Folder | For |
| --- | --- |
| `art/facades/` | Building facade / wall textures |
| `art/sky/` | Skybox & sky-gradient / mood plates |
| `art/loading/` | Per-place loading-screen splash art |
| `art/ui/` | HUD / menu icons and overlays |
| `art/legacy/` | Retired, unreferenced art kept for history (currently `panel1-3.jpg`, the old intro key-art placeholders) |

Add new kinds as needed; keep names lowercase and descriptive.

## Mobile budget (every file passes this before it's committed)
- **Power-of-two** dimensions. Props/signs ≤ **512²**; hero/sky/loading ≤ **1024²**.
- **JPG** for opaque plates (facades, sky, splashes); **PNG** only when you need
  alpha (decals, icons). Keep files lean (low hundreds of KB).
- Prefer **atlases / trim sheets** over many small separate textures.
- Palette: San Chaos synthwave — hot pink `#ff3ea0`, cyan, gold `#ffd23e`,
  deep purple `#0a0612`.
- Raw image-generator output is never committed directly — crop to power-of-two,
  tile-check, resize to budget, and compress first.

The image models make 2D pictures; the game builds its 3D world from code, so
this art feeds **textures and 2D layers only — never geometry**.
