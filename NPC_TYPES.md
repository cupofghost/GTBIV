# NPC Character Types — Reference Guide

The `NPC_TYPES` library (`js/npc-types.js`) defines reusable character archetypes and styles for diverse, memorable NPCs throughout the game. Each type specifies appearance preferences, outfit colors, and behavioral hints.

## Usage

### Basic spawn with a type

```js
// Get an NPC type and build a PersonSpec
const spec = NPC_TYPES.beach_babe.build();
const mesh = makePerson(spec);
```

### With overrides

```js
// Override specific attributes
const spec = NPC_TYPES.business_man.buildWith({
  skin: 0xc89060,
  gender: 'guy',
  height: 1.05,
});
const mesh = makePerson(spec);
```

### Random type

```js
// Pick a random NPC type
const type = randomNPCType();
const spec = type.build();
```

### Integrating with spawnPed

Enhance `spawnPed(block, kind)` to accept type names:

```js
function spawnPed(b, kind) {
  let spec;
  
  // If kind matches a type name, use it; otherwise fall back to random
  if (kind && NPC_TYPES[kind]) {
    spec = NPC_TYPES[kind].build();
  } else {
    spec = randomPersonSpec(pick(PEDCOLS));
  }
  
  const mesh = makePerson(spec);
  // ... rest of spawn logic
}

// Now spawn typed NPCs:
spawnPed(blockInfo[0], 'beach_babe');
spawnPed(blockInfo[1], 'business_man');
spawnPed(blockInfo[2], 'punk');
```

---

## Type Catalog

### Generic / Crowd
- **local**: Standard random crowd member. No specialization.
- **commuter**: Slightly less varied, walks predictably (road/sidewalk).

### Beach Crowd
- **beach_babe**: Fashionable, athletic beach goer (female bias). Tank top, shorts, bright colours.
- **surfer**: Beach-casual with longer hair. Always shorts.
- **sunbather**: Athletic, minimal clothing. Tank top, shorts, tan palette.
- **jogger**: Athletic wear (bright shirts, shorts). Lean build.

### Business / Professional
- **business_man**: Male professional. Business palette (dark/white), minimal tank wear, fade/short/buzz hair.
- **business_woman**: Female professional. Business palette, sometimes dress.
- **delivery_driver**: Orange/red shirt uniform, delivery-themed. Alert bearing.
- **cop**: Dark blue uniform-inspired shirt. Short/buzz hair. Sturdy build.

### Style / Subculture
- **punk**: Dark outfit, neon hair (optional). Small/lean build. Rebellious edge.
- **goth**: Dark monochrome. Long or short dark hair. Any build.
- **skater**: Urban streetwear. Casual sneakers. Lean build.
- **grunge**: Vintage earthy palette. Long or short hair. Relaxed build.
- **hipster**: Thrift-store vintage. Short/fade hair. Lean build.
- **neon_raver**: Bright neon outfit, neon hair. Athletic build. High-energy vibe.

### Character Archetypes
- **jock**: Athletic muscular build. Bright tank top/shorts. Buzz/short hair. Confident presence.
- **fashionista**: Female-biased. Colorful, trendy outfit. Dress sometimes. Long/ponytail hair.
- **tourist**: Bright outdoorsy clothes. Shorts/tank often. Casual, observant.
- **street_musician**: Vintage palette. Any gender. Long or short hair. Relaxed bearing.
- **street_vendor**: Standard appearance, observant presence. Any gender.

### Eccentric / Character
- **cat_lady**: Female-biased. Casual outfit. Larger build. Blonde/grey hair, long/bun styles. Quirky vibe.
- **crazy_person**: Highly varied appearance. Any build, any hair. Unpredictable energy.
- **old_timer**: Vintage palette. Grey/silver/beige hair (buzz/short/bald). Smaller build. Weathered.
- **mall_rat**: Female-biased. Bright trendy outfit. Long/ponytail. Energetic vibe.

### Activity-Based
- **shopper**: Standard casual appearance. Varied build. Shopping demeanor.
- **gang_member**: Dark palette. Sturdy build. Buzz/short hair. Guarded, territorial.
- **drunk**: Casual outfit, varied appearance. Can be any build. Unsteady, casual bearing.

### Special
- **none**: Truly random (same as `local`). Used as a fallback.

---

## Type Properties

Each type is defined by:

| Property | Description | Example |
|----------|-------------|---------|
| **genderBias** | Preferred gender: `'guy'`, `'girl'`, or `'neutral'` | `'girl'` for beach_babe |
| **palette** | Color set for outfit: `{shirts, pants, shoes}` | `PALETTES.business` |
| **buildRange** | `[min, max]` body width multiplier | `[0.85, 1.05]` for skater |
| **shorts** | Force/disallow shorts: `true`, `false`, or probability `0–1` | `true` for jogger |
| **tank** | Tank top probability: `0–1` or boolean | `0.7` for beach_babe |
| **dress** | Dress probability for females: `0–1` or boolean | `0.5` for business_woman |
| **hairStyles** | Array of preferred hair styles | `['long', 'ponytail']` for fashionista |
| **hairColors** | Array of preferred hair colors | neon array for `neon_raver` |
| **skins** | Array of skin tones | defaults to standard palette |
| **beard** | Beard probability for males (default `0.3` if not specified) | `false` for jock |

---

## Extending the System

### Add a new type

```js
// In NPC_TYPES library:
musician: createNPCType('musician', {
  palette: PALETTES.vintage,
  genderBias: 'neutral',
  hairStyles: ['long', 'short'],
  buildRange: [0.9, 1.1],
  tank: 0.2,
})
```

### Add a new palette

```js
// In PALETTES:
professional_tech: {
  shirts: [0x1a1a1a, 0x2a5c8a, 0x3a4a6b],
  pants: [0x2a2a2a, 0x3a3a3a],
  shoes: [0x1a1a1a, 0x4a4a4a],
},
```

### Create a "factory" for themed groups

```js
// Spawn a beach resort scene
const beachGroup = [
  NPC_TYPES.beach_babe,
  NPC_TYPES.beach_babe,
  NPC_TYPES.surfer,
  NPC_TYPES.sunbather,
  NPC_TYPES.tourist,
];

beachGroup.forEach(type => {
  spawnPed(blockInfo[nearBeach], type.name);
});
```

---

## Coloring Consistency

All types use named color palettes (defined at the top of `js/npc-types.js`):
- **casual**: Primary streetwear palette (vivid, varied).
- **business**: Professional dark/neutral palette (ties, formal wear).
- **beach**: Tropical, tan, bright palette (swimwear, casual).
- **dark**: Monochrome, goth-aligned palette.
- **neon**: Bright synthetic palette (raver/80s vibes).
- **vintage**: Earth tones, thrift-store palette.

Each palette defines `{shirts, pants, shoes}` colour arrays. Types can override to mix colours (e.g., jock uses bright shirts + casual dark pants).

---

## Performance Notes

- Each type is **zero-cost** at definition time (just object specs).
- Building a PersonSpec is **instant** (one randomization pass).
- `makePerson(spec)` handles rendering the same way for all types — no type-specific rendering cost.
- Use types to ensure crowd variety without increasing draw calls or geometry.

---

## Testing

In the `viewer.html` (D6), you can now add buttons to spawn each type:

```js
// Add to the buttons section
Object.keys(NPC_TYPES).forEach(typeName => {
  if (typeName === 'none') return; // skip the default
  const btn = document.createElement('button');
  btn.textContent = typeName.replace('_', ' ');
  btn.onclick = () => rebuild(NPC_TYPES[typeName].build());
  panel.appendChild(btn);
});
```

This lets you preview every type's appearance and tweak as needed.
