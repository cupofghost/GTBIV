// ================= NPC CHARACTER TYPES =================
// Defines archetypes and character types for diverse NPCs.
// Each type specifies outfit preferences, appearance traits, and behavioral hints.
// Usage: personSpec = getNPCType(typeName).build()
// Or: personSpec = getNPCType(typeName).buildWith({...overrides})

(function(){

// Color palettes for consistent theming
const PALETTES = {
  business: {
    shirts: [0x1a1a1a, 0x2a2a2a, 0xf0f0f0, 0xf0e8d8, 0x4a7c9e, 0x2a5c8a],
    pants: [0x2a2a2a, 0x1a1a1a, 0x3a4a5c],
    shoes: [0x1a1a1a, 0x3a3a3a, 0x6b4a2a],
  },
  casual: {
    shirts: [0xff6b9d, 0x6bc8ff, 0xffd23e, 0x8aff6b, 0xd98aff, 0xff8a5c, 0x5cffd4, 0xf0f0f0],
    pants: [0x2a3a5c, 0x3a2a2a, 0x2a2a2a, 0x4a3a5c, 0x50422a, 0x5c2a3a],
    shoes: [0x1a1a1a, 0xf0f0f0, 0x6b3a1a, 0x2a2a4a],
  },
  beach: {
    shirts: [0xff6b9d, 0x6bc8ff, 0xffd23e, 0x8aff6b, 0xff8a5c, 0x5cffd4],
    pants: [0xf0e8d8, 0xd9b890, 0xf0d8b0],
    shoes: [0xf0f0f0, 0xff6b9d, 0x6bc8ff],
  },
  dark: {
    shirts: [0x1a1a1a, 0x2a2a2a, 0x3a1a3a, 0x1a3a3a, 0x2a1a1a],
    pants: [0x1a1a1a, 0x2a1a1a, 0x1a2a2a],
    shoes: [0x1a1a1a, 0x2a1a1a, 0x4a2a2a],
  },
  neon: {
    shirts: [0xff00ff, 0x00ffff, 0xffff00, 0xff0099, 0x00ff99],
    pants: [0x1a1a1a, 0x2a2a2a],
    shoes: [0xff00ff, 0x00ffff, 0xffff00],
  },
  vintage: {
    shirts: [0x8a6030, 0xb88a60, 0xa0707a, 0x6a7a8a],
    pants: [0x3a2a2a, 0x4a3a2a, 0x5a4a3a],
    shoes: [0x4a3a2a, 0x6b4a2a, 0x3a2a2a],
  },
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(a, b) { return a + Math.random() * (b - a); }

// Base template builder
function createNPCType(name, config) {
  return {
    name,
    genderBias: config.genderBias || 'neutral', // 'guy', 'girl', 'neutral'
    build: function(overrides = {}) {
      return buildPersonSpec(config, overrides);
    },
    buildWith: function(overrides) {
      return this.build(overrides);
    },
  };
}

function buildPersonSpec(config, overrides = {}) {
  const palette = config.palette || PALETTES.casual;
  const gender = overrides.gender || getGenderForType(config);

  return Object.assign({
    gender,
    detail: 'crowd',
    height: rand(0.94, 1.06),
    build: rand((config.buildRange ? config.buildRange[0] : 0.88),
                (config.buildRange ? config.buildRange[1] : 1.14)),
    skin: overrides.skin || pick(config.skins || [0xf0c8a0, 0xc89060, 0x8a5c30, 0xffd9b0]),
    hair: Object.assign({
      style: config.hairStyles ? pick(config.hairStyles) : getDefaultHairStyle(gender),
      color: overrides.hairColor || pick(config.hairColors || [0x1a1a1a, 0x3a2a1a, 0x6b4a2f, 0x8a8a8a, 0xd9b44f, 0xb44f2a]),
      beard: config.beard !== false && gender === 'guy' && Math.random() < 0.3,
    }, overrides.hair || {}),
    outfit: Object.assign({
      shirt: { color: pick(palette.shirts), tex: null },
      pants: { color: pick(palette.pants), tex: null, shorts: config.shorts || Math.random() < 0.3 },
      shoes: { color: pick(palette.shoes) },
      dress: config.dress || (gender === 'girl' && Math.random() < 0.4),
      tank: config.tank || Math.random() < 0.3,
    }, overrides.outfit || {}),
    face: { tex: null },
  }, overrides);
}

function getGenderForType(config) {
  if (config.genderBias === 'guy') return 'guy';
  if (config.genderBias === 'girl') return 'girl';
  return Math.random() < 0.5 ? 'guy' : 'girl';
}

function getDefaultHairStyle(gender) {
  if (gender === 'girl') return Math.random() < 0.5 ? 'long' : 'ponytail';
  if (Math.random() < 0.12) return 'bald';
  return Math.random() < 0.5 ? 'buzz' : 'short';
}

// ============= NPC TYPES LIBRARY =============

window.NPC_TYPES = {
  // === GENERIC / CROWD ===
  local: createNPCType('local', {
    palette: PALETTES.casual,
    // standard random crowd
  }),

  commuter: createNPCType('commuter', {
    palette: PALETTES.casual,
    buildRange: [0.95, 1.05], // slightly less variation
    tank: 0.15, // fewer tanks
  }),

  // === BEACH CROWD ===
  beach_babe: createNPCType('beach_babe', {
    genderBias: 'girl',
    palette: PALETTES.beach,
    buildRange: [0.95, 1.08],
    shorts: true,
    tank: 0.7,
    hairStyles: ['long', 'ponytail'],
    skins: [0xf0c8a0, 0xc89060, 0xffd9b0],
  }),

  surfer: createNPCType('surfer', {
    palette: PALETTES.beach,
    hairStyles: ['long', 'short'],
    shorts: true,
  }),

  sunbather: createNPCType('sunbather', {
    palette: PALETTES.beach,
    buildRange: [0.9, 1.2],
    shorts: true,
    tank: 1.0,
  }),

  jogger: createNPCType('jogger', {
    palette: {
      shirts: [0xff6b9d, 0x6bc8ff, 0xff8a5c],
      pants: [0x4a4a4a, 0x2a2a2a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.85, 1.02],
    shorts: true,
    tank: 0.6,
  }),

  // === BUSINESS / PROFESSIONAL ===
  business_man: createNPCType('business_man', {
    genderBias: 'guy',
    palette: PALETTES.business,
    buildRange: [0.95, 1.15],
    dress: false,
    tank: 0,
    hairStyles: ['buzz', 'short', 'fade'],
  }),

  business_woman: createNPCType('business_woman', {
    genderBias: 'girl',
    palette: PALETTES.business,
    dress: 0.5, // sometimes
    tank: 0,
    hairStyles: ['long', 'ponytail', 'bun'],
  }),

  delivery_driver: createNPCType('delivery_driver', {
    palette: {
      shirts: [0xff6b1a, 0xd96b3a, 0x3a6b9d],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.1],
    hairStyles: ['buzz', 'short', 'bald'],
  }),

  cop: createNPCType('cop', {
    palette: {
      shirts: [0x1a2a6b, 0x3a4a8a],
      pants: [0x1a1a1a, 0x2a2a3a],
      shoes: [0x1a1a1a],
    },
    buildRange: [1.0, 1.15],
    tank: 0,
    hairStyles: ['buzz', 'short'],
  }),

  // === STYLE / SUBCULTURE ===
  punk: createNPCType('punk', {
    palette: PALETTES.dark,
    hairStyles: ['short', 'buzz', 'bald'],
    hairColors: [0x1a1a1a, 0xff00ff, 0x00ffff, 0xffff00],
    buildRange: [0.85, 1.05],
    skins: [0xf0c8a0, 0xc89060],
  }),

  goth: createNPCType('goth', {
    palette: PALETTES.dark,
    hairStyles: ['long', 'short'],
    hairColors: [0x1a1a1a],
    buildRange: [0.9, 1.1],
  }),

  skater: createNPCType('skater', {
    palette: {
      shirts: [0x2a2a2a, 0x3a3a3a, 0xf0f0f0, 0xff6b9d],
      pants: [0x2a2a2a, 0x4a4a4a, 0x5c5c5c],
      shoes: [0x1a1a1a, 0xf0f0f0, 0x6b3a1a],
    },
    buildRange: [0.85, 1.05],
    shorts: 0.2,
    hairStyles: ['short', 'buzz', 'long'],
  }),

  grunge: createNPCType('grunge', {
    palette: PALETTES.vintage,
    buildRange: [0.9, 1.15],
    hairStyles: ['long', 'short'],
  }),

  hipster: createNPCType('hipster', {
    palette: {
      shirts: [0x8a6030, 0xb88a60, 0x6b6b5a],
      pants: [0x3a3a2a, 0x4a4a3a],
      shoes: [0x4a3a2a, 0x6b4a2a],
    },
    buildRange: [0.88, 1.02],
    hairStyles: ['short', 'fade'],
  }),

  neon_raver: createNPCType('neon_raver', {
    palette: PALETTES.neon,
    hairColors: [0xff00ff, 0x00ffff, 0xffff00, 0x1a1a1a],
    buildRange: [0.85, 1.08],
    tank: 0.7,
    shorts: 0.5,
  }),

  // === CHARACTER ARCHETYPES ===
  jock: createNPCType('jock', {
    palette: {
      shirts: [0xff6b9d, 0x6bc8ff, 0x8aff6b],
      pants: [0x2a3a5c, 0x3a2a2a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [1.02, 1.18],
    shorts: true,
    tank: 0.6,
    hairStyles: ['buzz', 'short'],
  }),

  fashionista: createNPCType('fashionista', {
    genderBias: 'girl',
    palette: {
      shirts: [0xff6b9d, 0xd98aff, 0xffd23e],
      pants: [0x2a2a2a, 0x5c2a3a],
      shoes: [0xff6b9d, 0xd98aff, 0xf0f0f0],
    },
    buildRange: [0.88, 1.05],
    dress: 0.3,
  }),

  tourist: createNPCType('tourist', {
    palette: {
      shirts: [0xffd23e, 0xff8a5c, 0x6bc8ff],
      pants: [0x2a3a5c, 0xd9b890],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    shorts: 0.5,
    tank: 0.4,
  }),

  street_musician: createNPCType('street_musician', {
    palette: PALETTES.vintage,
    hairStyles: ['long', 'short'],
    buildRange: [0.88, 1.1],
  }),

  street_vendor: createNPCType('street_vendor', {
    palette: PALETTES.casual,
    buildRange: [0.95, 1.15],
    hairStyles: ['buzz', 'short', 'bald'],
  }),

  // === ECCENTRIC / CHARACTER ===
  cat_lady: createNPCType('cat_lady', {
    genderBias: 'girl',
    palette: PALETTES.casual,
    buildRange: [0.95, 1.2],
    hairColors: [0xd9b44f, 0x8a8a8a, 0xb44f2a],
    hairStyles: ['long', 'bun'],
  }),

  crazy_person: createNPCType('crazy_person', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.2],
    hairColors: [0x1a1a1a, 0x8a8a8a, 0xd9b44f],
    hairStyles: ['long', 'buzz', 'bald'],
  }),

  old_timer: createNPCType('old_timer', {
    palette: PALETTES.vintage,
    buildRange: [0.95, 1.08],
    hairColors: [0xd9d9d9, 0xa0a0a0, 0x8a8a8a],
    hairStyles: ['buzz', 'short', 'bald'],
  }),

  mall_rat: createNPCType('mall_rat', {
    genderBias: 'girl',
    palette: {
      shirts: [0xff6b9d, 0xd98aff, 0x6bc8ff],
      pants: [0x2a2a2a, 0x4a3a5c],
      shoes: [0xf0f0f0, 0xff6b9d],
    },
    buildRange: [0.9, 1.08],
    hairStyles: ['long', 'ponytail'],
  }),

  // === ACTIVITY-BASED ===
  shopper: createNPCType('shopper', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    shorts: 0.2,
  }),

  gang_member: createNPCType('gang_member', {
    palette: PALETTES.dark,
    buildRange: [1.0, 1.15],
    hairStyles: ['buzz', 'short'],
    hairColors: [0x1a1a1a, 0x6b4a2f],
  }),

  drunk: createNPCType('drunk', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.2],
    tank: 0.5,
  }),

  // === MISC ===
  none: createNPCType('none', {
    // Truly random
    palette: PALETTES.casual,
  }),
};

// Utility: get all type names
window.NPC_TYPE_NAMES = Object.keys(window.NPC_TYPES);

// Utility: spawn an NPC with a random type
window.randomNPCType = function() {
  const name = window.NPC_TYPE_NAMES[Math.floor(Math.random() * window.NPC_TYPE_NAMES.length)];
  return window.NPC_TYPES[name];
};

})();
