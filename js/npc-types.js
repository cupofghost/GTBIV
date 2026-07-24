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
  worker: {
    shirts: [0xff6b1a, 0xd96b3a, 0x8a6030, 0x3a6b9d, 0x6b6b2a],
    pants: [0x3a2a2a, 0x4a4a4a, 0x5a5a5a],
    shoes: [0x2a1a1a, 0x4a4a4a, 0x5a3a2a],
  },
  military: {
    shirts: [0x3a5a2a, 0x5a4a3a, 0x2a3a5a],
    pants: [0x2a3a2a, 0x3a2a1a, 0x1a2a3a],
    shoes: [0x1a1a1a, 0x2a2a2a],
  },
  upscale: {
    shirts: [0xf0f0f0, 0xd9d9c9, 0x6b7c9e, 0x8a7c5a],
    pants: [0x3a3a3a, 0x4a4a4a, 0x5a5a5a],
    shoes: [0x4a3a2a, 0x3a3a3a, 0x6b5a4a],
  },
  hippie: {
    shirts: [0xb88a60, 0x8a6030, 0xd99060, 0xa0704a],
    pants: [0x5a5a5a, 0x6b5a4a, 0x5a4a3a],
    shoes: [0x8a6030, 0x6b5a4a],
  },
  athletic: {
    shirts: [0xff6b9d, 0x6bc8ff, 0x8aff6b, 0xffd23e],
    pants: [0x2a2a2a, 0x3a3a3a],
    shoes: [0xf0f0f0, 0x1a1a1a, 0xff6b9d],
  },
  preppy: {
    shirts: [0xf0f0f0, 0x6b7c9e, 0xff6b9d],
    pants: [0x2a3a5c, 0x4a5a6b],
    shoes: [0xf0f0f0, 0x1a1a1a],
  },
  biker: {
    shirts: [0x1a1a1a, 0x2a1a1a, 0x3a1a3a],
    pants: [0x1a1a1a, 0x2a1a1a],
    shoes: [0x1a1a1a, 0x3a2a1a],
  },
  gamer: {
    shirts: [0x1a1a1a, 0x2a1a3a, 0x1a2a3a, 0x3a1a1a],
    pants: [0x2a2a2a, 0x3a3a3a],
    shoes: [0x1a1a1a, 0xff00ff],
  },
  sleazy: {
    shirts: [0xff6b9d, 0xd98aff, 0xf0a070],
    pants: [0x2a2a2a, 0x4a2a3a],
    shoes: [0xff6b9d, 0xf0f0f0],
  },
  homeless: {
    shirts: [0x6b5a4a, 0x5a5a5a, 0x4a4a3a],
    pants: [0x4a3a2a, 0x5a5a5a, 0x3a3a3a],
    shoes: [0x3a2a1a, 0x4a4a4a],
  },
  futuristic: {
    shirts: [0x00ffff, 0xff00ff, 0xffff00, 0x1a1a1a],
    pants: [0x1a1a1a, 0x2a2a4a],
    shoes: [0x00ffff, 0xff00ff, 0x1a1a1a],
  },
  western: {
    shirts: [0x8a6030, 0xb88a60, 0xa0704a],
    pants: [0x3a2a1a, 0x4a3a2a],
    shoes: [0x6b4a2a, 0x5a3a2a],
  },
  athletic_wear: {
    shirts: [0xff6b9d, 0x6bc8ff, 0x8aff6b],
    pants: [0x1a1a1a, 0x2a2a2a],
    shoes: [0xf0f0f0, 0x6b3a1a],
  },
  cyber: {
    shirts: [0x1a1a1a, 0x00ffff, 0xff00ff],
    pants: [0x1a1a1a, 0x2a1a3a],
    shoes: [0x00ffff, 0xff00ff, 0x1a1a1a],
  },
  avant_garde: {
    shirts: [0xff6b9d, 0xd98aff, 0x6b7c9e],
    pants: [0x1a1a1a, 0x2a2a2a],
    shoes: [0xff6b9d, 0xd98aff],
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

  // === WORKERS / BLUE COLLAR ===
  construction_worker: createNPCType('construction_worker', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.2],
    shorts: 0.4,
    tank: 0.3,
    hairStyles: ['buzz', 'short', 'bald'],
    skins: [0xf0c8a0, 0xc89060],
  }),

  electrician: createNPCType('electrician', {
    palette: PALETTES.worker,
    buildRange: [0.95, 1.1],
    hairStyles: ['short', 'buzz'],
  }),

  security_guard: createNPCType('security_guard', {
    palette: {
      shirts: [0x1a1a1a, 0x2a2a2a, 0x3a3a3a],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0x1a1a1a],
    },
    buildRange: [1.05, 1.2],
    hairStyles: ['buzz', 'short'],
  }),

  nurse: createNPCType('nurse', {
    genderBias: 'girl',
    palette: {
      shirts: [0xf0f0f0, 0xf0e8d8],
      pants: [0xf0f0f0, 0xe8e0d8],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    tank: 0,
    hairStyles: ['long', 'ponytail', 'bun'],
  }),

  doctor: createNPCType('doctor', {
    palette: PALETTES.upscale,
    tank: 0,
    hairStyles: ['short', 'buzz', 'long'],
  }),

  fast_food_worker: createNPCType('fast_food_worker', {
    palette: {
      shirts: [0xff6b1a, 0xffd23e, 0x6bc8ff],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.88, 1.1],
    tank: 0.2,
  }),

  bartender: createNPCType('bartender', {
    palette: PALETTES.business,
    buildRange: [0.9, 1.08],
    tank: 0,
  }),

  waiter: createNPCType('waiter', {
    palette: PALETTES.business,
    tank: 0,
    hairStyles: ['short', 'buzz', 'long'],
  }),

  // === STYLE / AESTHETIC ===
  biker_gang: createNPCType('biker_gang', {
    palette: PALETTES.biker,
    buildRange: [1.0, 1.2],
    hairStyles: ['long', 'short', 'bald'],
    beard: true,
  }),

  hippie: createNPCType('hippie', {
    palette: PALETTES.hippie,
    buildRange: [0.88, 1.15],
    hairStyles: ['long'],
    hairColors: [0x6b4a2f, 0x8a6030, 0xb88a60],
  }),

  metalhead: createNPCType('metalhead', {
    palette: PALETTES.dark,
    hairStyles: ['long', 'short'],
    hairColors: [0x1a1a1a],
    buildRange: [0.88, 1.1],
  }),

  emo: createNPCType('emo', {
    palette: PALETTES.dark,
    hairColors: [0x1a1a1a, 0xd9d9d9],
    hairStyles: ['long', 'short'],
    buildRange: [0.85, 1.05],
  }),

  preppy: createNPCType('preppy', {
    palette: PALETTES.preppy,
    buildRange: [0.9, 1.05],
    tank: 0,
    hairStyles: ['short', 'long', 'ponytail'],
  }),

  bohemian: createNPCType('bohemian', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.1],
    hairColors: [0x8a6030, 0xb88a60, 0xd9b44f],
  }),

  influencer: createNPCType('influencer', {
    genderBias: 'girl',
    palette: {
      shirts: [0xff6b9d, 0xd98aff, 0xffd23e, 0x6bc8ff],
      pants: [0x2a2a2a, 0x3a2a3a],
      shoes: [0xff6b9d, 0x6bc8ff, 0xf0f0f0],
    },
    buildRange: [0.88, 1.05],
    hairStyles: ['long', 'ponytail'],
  }),

  athlete: createNPCType('athlete', {
    palette: PALETTES.athletic,
    buildRange: [1.05, 1.2],
    shorts: true,
    tank: 0.7,
    hairStyles: ['short', 'buzz'],
  }),

  // === CHARACTER ARCHETYPES (EXPANDED) ===
  preacher: createNPCType('preacher', {
    palette: PALETTES.business,
    buildRange: [0.95, 1.15],
    hairColors: [0x1a1a1a, 0x8a8a8a, 0xd9d9d9],
    hairStyles: ['short', 'bald'],
  }),

  street_performer: createNPCType('street_performer', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    hairStyles: ['long', 'short'],
    hairColors: [0x1a1a1a, 0x6b4a2f, 0xd9b44f],
  }),

  mime: createNPCType('mime', {
    palette: {
      shirts: [0xf0f0f0, 0x1a1a1a],
      pants: [0x1a1a1a, 0xf0f0f0],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    tank: 0,
    hairStyles: ['short'],
    hairColors: [0x1a1a1a],
  }),

  clown: createNPCType('clown', {
    palette: {
      shirts: [0xff6b9d, 0xffd23e, 0x6bc8ff],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0xff6b9d, 0xffd23e],
    },
    buildRange: [0.88, 1.2],
    hairColors: [0xff6b9d, 0xffd23e, 0x6bc8ff],
  }),

  tourist_family: createNPCType('tourist_family', {
    palette: PALETTES.beach,
    buildRange: [0.9, 1.15],
    shorts: 0.6,
    tank: 0.5,
  }),

  backpacker: createNPCType('backpacker', {
    palette: {
      shirts: [0x8a6030, 0xb88a60, 0x6bc8ff],
      pants: [0x4a4a4a, 0x5a5a5a],
      shoes: [0x4a4a4a, 0x6b5a4a],
    },
    buildRange: [0.88, 1.08],
  }),

  // === LOCATION-BASED ===
  park_goer: createNPCType('park_goer', {
    palette: PALETTES.casual,
    shorts: 0.5,
    tank: 0.4,
  }),

  mall_employee: createNPCType('mall_employee', {
    palette: {
      shirts: [0x1a1a1a, 0x2a2a2a, 0x6b7c9e],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.9, 1.1],
  }),

  librarian: createNPCType('librarian', {
    palette: PALETTES.vintage,
    buildRange: [0.9, 1.1],
    hairStyles: ['bun', 'long', 'short'],
  }),

  gym_rat: createNPCType('gym_rat', {
    palette: PALETTES.athletic,
    buildRange: [1.08, 1.25],
    shorts: true,
    tank: 0.8,
    hairStyles: ['short', 'buzz'],
  }),

  office_worker: createNPCType('office_worker', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.1],
    tank: 0,
    hairStyles: ['short', 'buzz', 'long'],
  }),

  // === ECCENTRIC / MEMORABLE ===
  alien_enthusiast: createNPCType('alien_enthusiast', {
    palette: PALETTES.neon,
    hairColors: [0xff00ff, 0x00ffff, 0xffff00],
    buildRange: [0.88, 1.1],
  }),

  conspiracy_theorist: createNPCType('conspiracy_theorist', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.2],
    hairStyles: ['long', 'bald'],
  }),

  astrologer: createNPCType('astrologer', {
    genderBias: 'girl',
    palette: {
      shirts: [0x9060b0, 0x6b7c9e, 0xb88a60],
      pants: [0x3a2a3a, 0x4a3a2a],
      shoes: [0x3a2a2a, 0x6b5a4a],
    },
    hairColors: [0x8a6030, 0xb88a60, 0xd9b44f],
  }),

  vintage_enthusiast: createNPCType('vintage_enthusiast', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.12],
    hairColors: [0x8a6030, 0xa0707a, 0x6a7a8a],
  }),

  influencer_wannabe: createNPCType('influencer_wannabe', {
    palette: PALETTES.sleazy,
    buildRange: [0.88, 1.08],
    tank: 0.6,
    shorts: 0.5,
    hairStyles: ['long', 'short'],
  }),

  fitness_model: createNPCType('fitness_model', {
    palette: PALETTES.athletic,
    buildRange: [1.05, 1.15],
    shorts: true,
    tank: 0.8,
  }),

  // === LOW-LIFE / SKETCHY ===
  panhandler: createNPCType('panhandler', {
    palette: PALETTES.homeless,
    buildRange: [0.88, 1.15],
    hairColors: [0x8a8a8a, 0x6b6b6b, 0x4a4a4a],
  }),

  hustler: createNPCType('hustler', {
    palette: PALETTES.sleazy,
    buildRange: [0.95, 1.1],
    hairStyles: ['short', 'buzz'],
  }),

  dealer: createNPCType('dealer', {
    palette: PALETTES.dark,
    buildRange: [0.95, 1.15],
    hairStyles: ['short', 'buzz', 'long'],
  }),

  addict: createNPCType('addict', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.05],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  // === NICHE / SPECIFIC ROLES ===
  taxi_driver: createNPCType('taxi_driver', {
    palette: {
      shirts: [0xffd23e, 0xf0e8d8, 0x2a2a2a],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.15],
    hairStyles: ['short', 'buzz', 'bald'],
  }),

  mechanic: createNPCType('mechanic', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.2],
    hairStyles: ['short', 'buzz', 'bald'],
  }),

  pizza_guy: createNPCType('pizza_guy', {
    palette: {
      shirts: [0xff6b1a, 0xd96b3a],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.15],
  }),

  florist: createNPCType('florist', {
    genderBias: 'girl',
    palette: {
      shirts: [0xff6b9d, 0xd98aff, 0xf0e8d8],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.88, 1.08],
  }),

  antique_dealer: createNPCType('antique_dealer', {
    palette: PALETTES.vintage,
    buildRange: [0.9, 1.15],
    hairColors: [0x8a8a8a, 0xd9d9d9, 0x6b4a2f],
  }),

  pawn_shop_owner: createNPCType('pawn_shop_owner', {
    palette: PALETTES.business,
    buildRange: [0.95, 1.2],
    hairColors: [0x8a8a8a, 0xd9d9d9],
  }),

  bookstore_clerk: createNPCType('bookstore_clerk', {
    palette: {
      shirts: [0x2a2a2a, 0x6b7c9e, 0xf0f0f0],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.88, 1.08],
  }),

  tattoo_artist: createNPCType('tattoo_artist', {
    palette: PALETTES.dark,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a, 0xff00ff, 0x00ffff],
  }),

  hairdresser: createNPCType('hairdresser', {
    genderBias: 'girl',
    palette: {
      shirts: [0xf0f0f0, 0xff6b9d, 0xd98aff],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.88, 1.05],
  }),

  pet_walker: createNPCType('pet_walker', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    shorts: 0.6,
  }),

  // === GENDER-SPECIFIC VARIANTS ===
  soccer_mom: createNPCType('soccer_mom', {
    genderBias: 'girl',
    palette: PALETTES.upscale,
    buildRange: [0.9, 1.15],
    hairStyles: ['long', 'ponytail'],
    tank: 0,
  }),

  gym_bro: createNPCType('gym_bro', {
    genderBias: 'guy',
    palette: PALETTES.athletic,
    buildRange: [1.1, 1.25],
    shorts: true,
    tank: 0.8,
    hairStyles: ['buzz', 'short'],
  }),

  gamer_girl: createNPCType('gamer_girl', {
    genderBias: 'girl',
    palette: PALETTES.gamer,
    buildRange: [0.88, 1.08],
    hairStyles: ['long', 'ponytail', 'short'],
  }),

  dad_bod: createNPCType('dad_bod', {
    genderBias: 'guy',
    palette: PALETTES.casual,
    buildRange: [1.08, 1.25],
    shorts: 0.5,
    tank: 0.4,
    hairColors: [0x8a8a8a, 0xd9d9d9, 0x6b4a2f],
  }),

  // === SCENE / EVENT TYPES ===
  party_goer: createNPCType('party_goer', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.1],
    shorts: 0.5,
    tank: 0.6,
  }),

  concert_fan: createNPCType('concert_fan', {
    palette: PALETTES.dark,
    buildRange: [0.85, 1.1],
    hairColors: [0x1a1a1a, 0xff00ff, 0xffff00],
  }),

  protester: createNPCType('protester', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    hairStyles: ['long', 'short', 'buzz'],
  }),

  festival_goer: createNPCType('festival_goer', {
    palette: PALETTES.hippie,
    buildRange: [0.88, 1.15],
    shorts: 0.7,
    tank: 0.6,
  }),

  rave_kid: createNPCType('rave_kid', {
    palette: PALETTES.neon,
    buildRange: [0.85, 1.05],
    shorts: true,
    tank: 0.8,
    hairColors: [0xff00ff, 0x00ffff, 0xffff00],
  }),

  // === FANTASY / COSPLAY ===
  cosplayer: createNPCType('cosplayer', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.15],
    hairColors: [0xff00ff, 0x00ffff, 0xffff00, 0x1a1a1a],
  }),

  superhero_enthusiast: createNPCType('superhero_enthusiast', {
    palette: {
      shirts: [0xff0000, 0x0000ff, 0xffff00],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0xff0000, 0x0000ff],
    },
    buildRange: [0.9, 1.15],
  }),

  // === DISTINCTIVE / MEMORABLE ===
  long_hair_guy: createNPCType('long_hair_guy', {
    genderBias: 'guy',
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    hairStyles: ['long'],
    hairColors: [0x1a1a1a, 0x6b4a2f, 0x8a6030],
  }),

  bald_woman: createNPCType('bald_woman', {
    genderBias: 'girl',
    palette: PALETTES.casual,
    buildRange: [0.9, 1.15],
    hairStyles: ['bald'],
  }),

  twins: createNPCType('twins', {
    palette: PALETTES.casual,
    buildRange: [0.92, 0.98], // narrow range for similarity
    hairColors: [0x6b4a2f],
  }),

  look_alike: createNPCType('look_alike', {
    palette: PALETTES.casual,
    buildRange: [0.95, 1.05],
    hairColors: [0x1a1a1a],
  }),

  // === WEALTHY / CLASS TYPES ===
  wealthy_socialite: createNPCType('wealthy_socialite', {
    genderBias: 'girl',
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.05],
    hairStyles: ['long', 'bun'],
    tank: 0,
  }),

  yacht_club_type: createNPCType('yacht_club_type', {
    palette: PALETTES.preppy,
    buildRange: [0.95, 1.1],
    tank: 0,
  }),

  // === WORKING CLASS / GRITTY ===
  dock_worker: createNPCType('dock_worker', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.25],
    hairStyles: ['short', 'buzz', 'bald'],
  }),

  warehouse_worker: createNPCType('warehouse_worker', {
    palette: PALETTES.worker,
    buildRange: [1.02, 1.2],
    hairStyles: ['short', 'buzz'],
  }),

  street_sweeper: createNPCType('street_sweeper', {
    palette: PALETTES.worker,
    buildRange: [0.95, 1.15],
    hairColors: [0x8a8a8a, 0xd9d9d9, 0x6b6b6b],
  }),

  // === ACTIVITY-BASED (EXPANDED) ===
  dog_owner: createNPCType('dog_owner', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    hairStyles: ['long', 'short', 'ponytail'],
  }),

  window_shopper: createNPCType('window_shopper', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  food_truck_guy: createNPCType('food_truck_guy', {
    palette: {
      shirts: [0xff6b1a, 0xffd23e, 0x8aff6b],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.2],
  }),

  hot_dog_vendor: createNPCType('hot_dog_vendor', {
    palette: {
      shirts: [0xff6b1a, 0x8aff6b],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a],
    },
    buildRange: [0.98, 1.18],
  }),

  newspaper_seller: createNPCType('newspaper_seller', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.12],
    hairColors: [0x1a1a1a, 0x8a8a8a, 0xd9d9d9],
  }),

  flower_girl: createNPCType('flower_girl', {
    genderBias: 'girl',
    palette: {
      shirts: [0xff6b9d, 0xd98aff, 0xf0e8d8],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.88, 1.05],
  }),

  street_photographer: createNPCType('street_photographer', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    hairStyles: ['long', 'short'],
  }),

  cyclist: createNPCType('cyclist', {
    palette: PALETTES.athletic,
    buildRange: [0.85, 1.08],
    shorts: true,
    tank: 0.6,
  }),

  skateboard_kid: createNPCType('skateboard_kid', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.0],
    shorts: true,
    tank: 0.5,
  }),

  student: createNPCType('student', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    shorts: 0.3,
    tank: 0.2,
  }),

  // === MOOD / STATE TYPES ===
  tired_commuter: createNPCType('tired_commuter', {
    palette: PALETTES.business,
    buildRange: [0.9, 1.12],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  stressed_professional: createNPCType('stressed_professional', {
    palette: PALETTES.business,
    buildRange: [0.9, 1.1],
    tank: 0,
  }),

  relaxed_dude: createNPCType('relaxed_dude', {
    palette: PALETTES.hippie,
    buildRange: [0.9, 1.15],
    shorts: 0.5,
    tank: 0.4,
  }),

  anxious_person: createNPCType('anxious_person', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.05],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  excited_kid: createNPCType('excited_kid', {
    palette: PALETTES.casual,
    buildRange: [0.85, 0.95],
    shorts: true,
    tank: 0.5,
  }),

  // === BODY TYPE VARIANTS ===
  bodybuilder: createNPCType('bodybuilder', {
    palette: PALETTES.athletic,
    buildRange: [1.2, 1.3],
    shorts: true,
    tank: 1.0,
  }),

  lean_runner: createNPCType('lean_runner', {
    palette: PALETTES.athletic,
    buildRange: [0.8, 0.92],
    shorts: true,
    tank: 0.8,
  }),

  stocky_build: createNPCType('stocky_build', {
    palette: PALETTES.casual,
    buildRange: [1.08, 1.25],
  }),

  petite: createNPCType('petite', {
    genderBias: 'girl',
    palette: PALETTES.casual,
    buildRange: [0.85, 0.95],
    hairStyles: ['long', 'ponytail'],
  }),

  // === REGIONAL / CULTURAL ===
  hipster_barista: createNPCType('hipster_barista', {
    palette: PALETTES.hipster,
    buildRange: [0.88, 1.05],
    hairStyles: ['short', 'long'],
    hairColors: [0x1a1a1a, 0x8a6030],
  }),

  coffee_addict: createNPCType('coffee_addict', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    hairStyles: ['short', 'long', 'ponytail'],
  }),

  yoga_instructor: createNPCType('yoga_instructor', {
    genderBias: 'girl',
    palette: PALETTES.athletic,
    buildRange: [0.88, 1.02],
    shorts: true,
    tank: 0.8,
  }),

  wellness_coach: createNPCType('wellness_coach', {
    palette: PALETTES.upscale,
    buildRange: [0.95, 1.08],
    shorts: 0.3,
    tank: 0.3,
  }),

  vegan_activist: createNPCType('vegan_activist', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    hairColors: [0x1a1a1a, 0x8a6030],
  }),

  // === RANDOM MEMORABLE TYPES ===
  person_with_beard: createNPCType('person_with_beard', {
    genderBias: 'guy',
    palette: PALETTES.casual,
    buildRange: [0.95, 1.15],
    beard: true,
    hairStyles: ['short', 'buzz'],
  }),

  hat_person: createNPCType('hat_person', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    hairStyles: ['short', 'bald', 'buzz'],
  }),

  sunglasses_type: createNPCType('sunglasses_type', {
    palette: PALETTES.upscale,
    buildRange: [0.95, 1.12],
    shorts: 0.4,
  }),

  fashionable_guy: createNPCType('fashionable_guy', {
    genderBias: 'guy',
    palette: {
      shirts: [0xff6b9d, 0xd98aff, 0x6b7c9e],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0xff6b9d, 0xf0f0f0],
    },
    buildRange: [0.88, 1.05],
  }),

  goth_girl: createNPCType('goth_girl', {
    genderBias: 'girl',
    palette: PALETTES.dark,
    hairColors: [0x1a1a1a],
    hairStyles: ['long', 'short'],
  }),

  punk_girl: createNPCType('punk_girl', {
    genderBias: 'girl',
    palette: PALETTES.dark,
    hairColors: [0x1a1a1a, 0xff00ff, 0xffff00],
    hairStyles: ['short', 'buzz'],
  }),

  beach_boy: createNPCType('beach_boy', {
    genderBias: 'guy',
    palette: PALETTES.beach,
    buildRange: [0.95, 1.15],
    shorts: true,
    tank: 0.7,
    hairStyles: ['long', 'short'],
    hairColors: [0xd9b44f, 0x8a6030],
  }),

  outdoorsy_type: createNPCType('outdoorsy_type', {
    palette: {
      shirts: [0x6b7c9e, 0x8a6030, 0x4a7c4a],
      pants: [0x4a4a4a, 0x5a5a5a],
      shoes: [0x4a4a4a, 0x6b5a4a],
    },
    buildRange: [0.95, 1.12],
  }),

  // === ENTERTAINMENT / PERFORMANCE ===
  magician: createNPCType('magician', {
    palette: {
      shirts: [0x1a1a1a, 0x2a2a2a, 0xf0f0f0],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a],
  }),

  juggler: createNPCType('juggler', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    shorts: 0.5,
    tank: 0.4,
  }),

  acrobat: createNPCType('acrobat', {
    palette: PALETTES.athletic,
    buildRange: [0.85, 1.05],
    shorts: true,
    tank: 0.8,
  }),

  dancer: createNPCType('dancer', {
    palette: PALETTES.athletic,
    buildRange: [0.88, 1.08],
    shorts: true,
    tank: 0.7,
  }),

  dj: createNPCType('dj', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a, 0xff00ff, 0x00ffff],
  }),

  // === TECH / MODERN PROFESSIONAL ===
  startup_founder: createNPCType('startup_founder', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    hairColors: [0x1a1a1a, 0x6b4a2f],
    hairStyles: ['short', 'long'],
  }),

  software_engineer: createNPCType('software_engineer', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.12],
    tank: 0,
    shorts: 0.2,
  }),

  tech_bro: createNPCType('tech_bro', {
    genderBias: 'guy',
    palette: {
      shirts: [0x1a1a1a, 0x2a5c8a, 0x3a6b9e],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.9, 1.1],
  }),

  social_media_influencer: createNPCType('social_media_influencer', {
    genderBias: 'girl',
    palette: PALETTES.sleazy,
    buildRange: [0.88, 1.05],
    shorts: 0.5,
    tank: 0.5,
  }),

  // === CREATIVE PROFESSIONALS ===
  graphic_designer: createNPCType('graphic_designer', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    hairColors: [0x1a1a1a, 0xff00ff, 0x8a6030],
  }),

  photographer: createNPCType('photographer', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  artist: createNPCType('artist', {
    palette: PALETTES.vintage,
    buildRange: [0.85, 1.15],
    hairStyles: ['long', 'short'],
  }),

  writer: createNPCType('writer', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.12],
    hairStyles: ['long', 'short', 'buzz'],
  }),

  // === FOOD SERVICE (EXPANDED) ===
  chef: createNPCType('chef', {
    palette: {
      shirts: [0xf0f0f0, 0xf0e8d8],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.2],
    hairStyles: ['short', 'buzz'],
  }),

  line_cook: createNPCType('line_cook', {
    palette: {
      shirts: [0xf0f0f0, 0xf0e8d8, 0xff6b1a],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.15],
  }),

  ice_cream_man: createNPCType('ice_cream_man', {
    palette: {
      shirts: [0xff6b9d, 0xffd23e],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.98, 1.2],
  }),

  bartender_cool: createNPCType('bartender_cool', {
    palette: PALETTES.business,
    buildRange: [0.9, 1.1],
    tank: 0,
    hairStyles: ['short', 'long'],
  }),

  // === ATHLETIC / SPORTS ===
  soccer_player: createNPCType('soccer_player', {
    palette: PALETTES.athletic,
    buildRange: [0.95, 1.12],
    shorts: true,
    tank: 0.7,
    hairStyles: ['short', 'buzz'],
  }),

  basketball_player: createNPCType('basketball_player', {
    palette: PALETTES.athletic,
    buildRange: [1.05, 1.25],
    shorts: true,
    tank: 1.0,
  }),

  boxer: createNPCType('boxer', {
    palette: PALETTES.athletic,
    buildRange: [1.0, 1.2],
    shorts: true,
    tank: 1.0,
  }),

  martial_artist: createNPCType('martial_artist', {
    palette: PALETTES.athletic,
    buildRange: [1.0, 1.15],
    shorts: true,
    tank: 0.8,
  }),

  // === SECURITY / DEFENSE ===
  bouncer: createNPCType('bouncer', {
    palette: PALETTES.dark,
    buildRange: [1.1, 1.3],
    hairStyles: ['buzz', 'short', 'bald'],
  }),

  private_investigator: createNPCType('private_investigator', {
    palette: PALETTES.business,
    buildRange: [0.95, 1.1],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  bodyguard: createNPCType('bodyguard', {
    palette: PALETTES.dark,
    buildRange: [1.05, 1.25],
    hairStyles: ['buzz', 'short', 'bald'],
  }),

  // === QUIRKY / UNIQUE ===
  conspiracy_nut: createNPCType('conspiracy_nut', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.2],
    hairStyles: ['long', 'bald', 'short'],
  }),

  fortune_teller: createNPCType('fortune_teller', {
    genderBias: 'girl',
    palette: {
      shirts: [0x9060b0, 0x6b7c9e, 0xd98aff],
      pants: [0x3a2a3a, 0x4a3a2a],
      shoes: [0x3a2a2a, 0x6b5a4a],
    },
    hairColors: [0x8a6030, 0xd9b44f],
  }),

  life_coach: createNPCType('life_coach', {
    palette: PALETTES.upscale,
    buildRange: [0.95, 1.12],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  personal_trainer: createNPCType('personal_trainer', {
    palette: PALETTES.athletic,
    buildRange: [1.05, 1.2],
    shorts: true,
    tank: 0.8,
  }),

  // === RETAIL / SHOPPING ===
  boutique_owner: createNPCType('boutique_owner', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.08],
    tank: 0,
  }),

  clothing_clerk: createNPCType('clothing_clerk', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
  }),

  electronics_geek: createNPCType('electronics_geek', {
    palette: PALETTES.gamer,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  bargain_hunter: createNPCType('bargain_hunter', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    hairColors: [0x1a1a1a, 0x8a8a8a, 0xd9d9d9],
  }),

  // === TRANSPORTATION ===
  bus_driver: createNPCType('bus_driver', {
    palette: {
      shirts: [0x1a1a1a, 0x2a2a2a, 0x3a5a9e],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.2],
    hairStyles: ['short', 'buzz', 'bald'],
  }),

  truck_driver: createNPCType('truck_driver', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.25],
    hairStyles: ['short', 'buzz', 'bald'],
    beard: true,
  }),

  parking_attendant: createNPCType('parking_attendant', {
    palette: {
      shirts: [0x3a6b9d, 0x6b7c9e],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.15],
  }),

  valet: createNPCType('valet', {
    palette: PALETTES.business,
    buildRange: [0.9, 1.08],
    tank: 0,
  }),

  // === HEALTH / WELLNESS (EXPANDED) ===
  therapist: createNPCType('therapist', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.1],
    hairStyles: ['long', 'short', 'bun'],
  }),

  dentist: createNPCType('dentist', {
    palette: PALETTES.upscale,
    buildRange: [0.9, 1.1],
    tank: 0,
  }),

  pharmacist: createNPCType('pharmacist', {
    palette: {
      shirts: [0xf0f0f0, 0xf0e8d8],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.88, 1.08],
  }),

  physical_therapist: createNPCType('physical_therapist', {
    palette: PALETTES.athletic,
    buildRange: [0.9, 1.1],
    tank: 0.3,
  }),

  meditation_enthusiast: createNPCType('meditation_enthusiast', {
    palette: PALETTES.hippie,
    buildRange: [0.88, 1.15],
    hairStyles: ['long', 'short'],
  }),

  // === ENVIRONMENTAL ===
  park_ranger: createNPCType('park_ranger', {
    palette: {
      shirts: [0x4a7c4a, 0x5a6b3a],
      pants: [0x3a2a1a, 0x4a3a2a],
      shoes: [0x4a3a2a, 0x5a4a3a],
    },
    buildRange: [0.95, 1.15],
  }),

  environmental_activist: createNPCType('environmental_activist', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a, 0x8a6030],
  }),

  gardener: createNPCType('gardener', {
    palette: PALETTES.worker,
    buildRange: [0.95, 1.15],
    hairColors: [0x8a8a8a, 0xd9d9d9, 0x6b4a2f],
  }),

  // === MEDIA / COMMUNICATION ===
  journalist: createNPCType('journalist', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.1],
    tank: 0,
    hairStyles: ['short', 'long', 'ponytail'],
  }),

  news_anchor: createNPCType('news_anchor', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.08],
    tank: 0,
    hairStyles: ['short', 'long'],
  }),

  radio_host: createNPCType('radio_host', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    hairStyles: ['short', 'long', 'buzz'],
  }),

  podcast_bro: createNPCType('podcast_bro', {
    genderBias: 'guy',
    palette: PALETTES.casual,
    buildRange: [0.9, 1.15],
    shorts: 0.4,
    tank: 0.3,
  }),

  // === EDUCATION ===
  teacher: createNPCType('teacher', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.1],
    tank: 0,
  }),

  professor: createNPCType('professor', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.12],
    hairColors: [0x8a8a8a, 0xd9d9d9, 0x6b4a2f],
  }),

  tutor: createNPCType('tutor', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
  }),

  student_nerd: createNPCType('student_nerd', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.05],
    shorts: 0.2,
    tank: 0.1,
  }),

  // === EMERGENCY / SERVICES ===
  firefighter: createNPCType('firefighter', {
    palette: {
      shirts: [0xff6b1a, 0xd96b3a],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [1.05, 1.2],
  }),

  paramedic: createNPCType('paramedic', {
    palette: {
      shirts: [0x6b8a2a, 0x8a9a4a],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.15],
  }),

  animal_control: createNPCType('animal_control', {
    palette: PALETTES.worker,
    buildRange: [0.95, 1.15],
  }),

  // === ARTS / DESIGN ===
  fashion_designer: createNPCType('fashion_designer', {
    genderBias: 'girl',
    palette: PALETTES.avant_garde,
    buildRange: [0.88, 1.05],
    tank: 0.3,
  }),

  interior_designer: createNPCType('interior_designer', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.08],
    shorts: 0.2,
  }),

  makeup_artist: createNPCType('makeup_artist', {
    genderBias: 'girl',
    palette: PALETTES.sleazy,
    buildRange: [0.88, 1.05],
  }),

  stylist: createNPCType('stylist', {
    genderBias: 'girl',
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.08],
    hairStyles: ['long', 'short', 'bun'],
  }),

  // === FINANCE / BUSINESS ===
  accountant: createNPCType('accountant', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.1],
    tank: 0,
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  realtor: createNPCType('realtor', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.08],
    tank: 0,
    hairStyles: ['long', 'short'],
  }),

  banker: createNPCType('banker', {
    palette: PALETTES.business,
    buildRange: [0.9, 1.1],
    tank: 0,
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  investment_bro: createNPCType('investment_bro', {
    genderBias: 'guy',
    palette: PALETTES.upscale,
    buildRange: [0.95, 1.12],
    tank: 0,
  }),

  // === UNIQUE / UNLIKELY ===
  time_traveler: createNPCType('time_traveler', {
    palette: PALETTES.futuristic,
    buildRange: [0.88, 1.12],
    hairColors: [0x1a1a1a, 0x00ffff],
  }),

  space_cadet: createNPCType('space_cadet', {
    palette: PALETTES.neon,
    buildRange: [0.85, 1.1],
    hairColors: [0xff00ff, 0x00ffff, 0xffff00],
  }),

  wild_west_fan: createNPCType('wild_west_fan', {
    palette: PALETTES.western,
    buildRange: [0.95, 1.15],
    hairStyles: ['short', 'buzz', 'long'],
  }),

  retro_enthusiast: createNPCType('retro_enthusiast', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.1],
    hairColors: [0x8a6030, 0xb88a60, 0xd9b44f],
  }),

  futurism_nerd: createNPCType('futurism_nerd', {
    palette: PALETTES.futuristic,
    buildRange: [0.85, 1.05],
  }),

  // === REGIONAL VARIETIES ===
  downtown_type: createNPCType('downtown_type', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  suburb_resident: createNPCType('suburb_resident', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
  }),

  industrial_worker: createNPCType('industrial_worker', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.2],
    hairStyles: ['short', 'buzz', 'bald'],
  }),

  port_worker: createNPCType('port_worker', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.25],
    hairStyles: ['short', 'buzz', 'bald'],
    beard: 0.4,
  }),

  // === NICHE PROFESSIONS ===
  florist_male: createNPCType('florist_male', {
    genderBias: 'guy',
    palette: {
      shirts: [0xff6b9d, 0xd98aff, 0xf0e8d8],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.88, 1.08],
  }),

  jewelry_maker: createNPCType('jewelry_maker', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.08],
    hairStyles: ['long', 'short'],
  }),

  glass_blower: createNPCType('glass_blower', {
    palette: PALETTES.worker,
    buildRange: [0.95, 1.15],
    hairStyles: ['short', 'bald', 'buzz'],
  }),

  woodworker: createNPCType('woodworker', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.2],
    hairStyles: ['short', 'buzz'],
    beard: 0.5,
  }),

  seamstress: createNPCType('seamstress', {
    genderBias: 'girl',
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.1],
    hairStyles: ['long', 'bun', 'short'],
  }),

  leather_worker: createNPCType('leather_worker', {
    palette: PALETTES.worker,
    buildRange: [1.0, 1.18],
    hairStyles: ['short', 'buzz', 'long'],
  }),

  blacksmith: createNPCType('blacksmith', {
    palette: PALETTES.worker,
    buildRange: [1.05, 1.3],
    hairStyles: ['short', 'bald', 'buzz'],
    beard: true,
  }),

  potter: createNPCType('potter', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.15],
    hairStyles: ['long', 'short'],
  }),

  // === VINTAGE / RETRO CAREER TYPES ===
  telegraph_operator: createNPCType('telegraph_operator', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.08],
    hairColors: [0x8a6030, 0x1a1a1a],
  }),

  film_projectionist: createNPCType('film_projectionist', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.1],
  }),

  typewriter_enthusiast: createNPCType('typewriter_enthusiast', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.1],
    hairColors: [0x8a6030, 0xb88a60],
  }),

  vintage_car_collector: createNPCType('vintage_car_collector', {
    palette: PALETTES.western,
    buildRange: [0.95, 1.2],
  }),

  vinyl_collector: createNPCType('vinyl_collector', {
    palette: PALETTES.dark,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a],
  }),

  // === LIFESTYLE / WELLNESS ===
  crossfit_enthusiast: createNPCType('crossfit_enthusiast', {
    palette: PALETTES.athletic,
    buildRange: [1.05, 1.2],
    shorts: true,
    tank: 0.9,
  }),

  pilates_instructor: createNPCType('pilates_instructor', {
    genderBias: 'girl',
    palette: PALETTES.athletic,
    buildRange: [0.88, 1.05],
    shorts: true,
    tank: 0.7,
  }),

  nutrition_coach: createNPCType('nutrition_coach', {
    palette: PALETTES.upscale,
    buildRange: [0.95, 1.08],
  }),

  supplement_junkie: createNPCType('supplement_junkie', {
    palette: PALETTES.athletic,
    buildRange: [1.05, 1.2],
    shorts: 0.5,
    tank: 0.6,
  }),

  juice_cleanse_person: createNPCType('juice_cleanse_person', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.02],
    hairStyles: ['long', 'ponytail'],
  }),

  // === HOBBIES / OBSESSIONS ===
  toy_collector: createNPCType('toy_collector', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
  }),

  board_game_enthusiast: createNPCType('board_game_enthusiast', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
  }),

  comic_book_nerd: createNPCType('comic_book_nerd', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.12],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  model_train_guy: createNPCType('model_train_guy', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.2],
    hairColors: [0x8a8a8a, 0xd9d9d9],
  }),

  rc_car_racer: createNPCType('rc_car_racer', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  drone_pilot: createNPCType('drone_pilot', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    shorts: 0.3,
  }),

  // === DISTINCTIVE TRAITS ===
  tattoo_sleeve_guy: createNPCType('tattoo_sleeve_guy', {
    genderBias: 'guy',
    palette: PALETTES.dark,
    buildRange: [0.95, 1.15],
    shorts: 0.5,
    tank: 0.7,
  }),

  piercing_enthusiast: createNPCType('piercing_enthusiast', {
    palette: PALETTES.dark,
    buildRange: [0.88, 1.08],
    hairColors: [0x1a1a1a, 0xff00ff],
  }),

  dyed_hair_person: createNPCType('dyed_hair_person', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    hairColors: [0xff00ff, 0x00ffff, 0xffff00],
  }),

  freckled_girl: createNPCType('freckled_girl', {
    genderBias: 'girl',
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
    skins: [0xf0c8a0, 0xffd9b0],
    hairColors: [0x6b4a2f, 0x8a6030],
  }),

  tall_person: createNPCType('tall_person', {
    palette: PALETTES.casual,
    buildRange: [1.1, 1.25],
    height: 1.15,
  }),

  short_person: createNPCType('short_person', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.02],
    height: 0.92,
  }),

  // === SITUATIONAL / CONTEXT ===
  morning_jogger: createNPCType('morning_jogger', {
    palette: PALETTES.athletic,
    buildRange: [0.88, 1.05],
    shorts: true,
    tank: 0.8,
  }),

  night_shift_worker: createNPCType('night_shift_worker', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  weekend_warrior: createNPCType('weekend_warrior', {
    palette: PALETTES.athletic,
    buildRange: [0.95, 1.15],
    shorts: true,
    tank: 0.6,
  }),

  parent_with_kids: createNPCType('parent_with_kids', {
    palette: PALETTES.casual,
    buildRange: [0.95, 1.15],
  }),

  retired_person: createNPCType('retired_person', {
    palette: PALETTES.vintage,
    buildRange: [0.95, 1.15],
    hairColors: [0xd9d9d9, 0xa0a0a0, 0x8a8a8a],
  }),

  // === SUBCULTURE VARIANTS ===
  rockabilly: createNPCType('rockabilly', {
    palette: {
      shirts: [0x1a1a1a, 0x2a2a2a, 0xff6b9d],
      pants: [0x1a1a1a, 0x2a1a1a],
      shoes: [0x1a1a1a, 0xff6b9d],
    },
    buildRange: [0.95, 1.15],
    hairColors: [0x1a1a1a, 0xd9b44f],
    hairStyles: ['short', 'buzz'],
  }),

  mod: createNPCType('mod', {
    palette: {
      shirts: [0xf0f0f0, 0x1a1a1a, 0x6b7c9e],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.88, 1.05],
  }),

  rocker: createNPCType('rocker', {
    palette: PALETTES.dark,
    buildRange: [0.88, 1.15],
    hairColors: [0x1a1a1a],
    hairStyles: ['long', 'short'],
  }),

  cyberpunk: createNPCType('cyberpunk', {
    palette: PALETTES.cyber,
    buildRange: [0.88, 1.1],
    hairColors: [0x00ffff, 0xff00ff, 0x1a1a1a],
  }),

  steampunk: createNPCType('steampunk', {
    palette: PALETTES.western,
    buildRange: [0.88, 1.15],
    shorts: 0,
  }),

  anime_fan: createNPCType('anime_fan', {
    palette: PALETTES.neon,
    buildRange: [0.85, 1.08],
    hairColors: [0xff00ff, 0x00ffff, 0xffff00],
  }),

  gamer_dude: createNPCType('gamer_dude', {
    genderBias: 'guy',
    palette: PALETTES.gamer,
    buildRange: [0.88, 1.15],
    hairColors: [0x1a1a1a, 0x2a1a3a],
  }),

  // === OUTDOOR / ADVENTURE ===
  hiker: createNPCType('hiker', {
    palette: {
      shirts: [0x6b7c9e, 0x8a6030, 0x4a7c4a],
      pants: [0x4a4a4a, 0x5a5a5a],
      shoes: [0x6b5a4a, 0x4a4a4a],
    },
    buildRange: [0.95, 1.12],
  }),

  rock_climber: createNPCType('rock_climber', {
    palette: PALETTES.athletic,
    buildRange: [0.95, 1.15],
    shorts: true,
    tank: 0.7,
  }),

  skier: createNPCType('skier', {
    palette: PALETTES.upscale,
    buildRange: [0.95, 1.12],
    shorts: 0.1,
  }),

  fisherman: createNPCType('fisherman', {
    palette: PALETTES.worker,
    buildRange: [0.95, 1.2],
    hairColors: [0x8a8a8a, 0xd9d9d9, 0x6b4a2f],
    beard: 0.4,
  }),

  kayak_enthusiast: createNPCType('kayak_enthusiast', {
    palette: PALETTES.beach,
    buildRange: [0.95, 1.12],
    shorts: true,
    tank: 0.6,
  }),

  camper: createNPCType('camper', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
  }),

  // === ALTERNATIVE LIFESTYLE ===
  vegan_label_reader: createNPCType('vegan_label_reader', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
  }),

  zero_waste_warrior: createNPCType('zero_waste_warrior', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  minimalist: createNPCType('minimalist', {
    palette: {
      shirts: [0xf0f0f0, 0x1a1a1a],
      pants: [0x1a1a1a, 0x2a2a2a],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.88, 1.08],
  }),

  maximalist: createNPCType('maximalist', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.15],
  }),

  sustainable_shopper: createNPCType('sustainable_shopper', {
    palette: PALETTES.hippie,
    buildRange: [0.88, 1.1],
  }),

  // === MUSIC / SOUND ===
  vinyl_guy: createNPCType('vinyl_guy', {
    genderBias: 'guy',
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.12],
    hairColors: [0x8a6030, 0x1a1a1a],
  }),

  synthwave_fan: createNPCType('synthwave_fan', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a, 0xff00ff],
  }),

  lo_fi_listener: createNPCType('lo_fi_listener', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  metal_fan: createNPCType('metal_fan', {
    palette: PALETTES.dark,
    buildRange: [0.88, 1.15],
    hairColors: [0x1a1a1a],
  }),

  classical_snob: createNPCType('classical_snob', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.1],
    tank: 0,
  }),

  // === GAMING / ESPORTS ===
  esports_pro: createNPCType('esports_pro', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.05],
    shorts: 0.2,
    tank: 0.1,
  }),

  speedrunner: createNPCType('speedrunner', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.08],
  }),

  retro_gamer: createNPCType('retro_gamer', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.15],
  }),

  mobile_gamer: createNPCType('mobile_gamer', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
  }),

  vr_enthusiast: createNPCType('vr_enthusiast', {
    palette: PALETTES.futuristic,
    buildRange: [0.88, 1.1],
  }),

  // === PET PEOPLE ===
  cat_lover: createNPCType('cat_lover', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  dog_lover: createNPCType('dog_lover', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.12],
  }),

  exotic_pet_owner: createNPCType('exotic_pet_owner', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.15],
    hairColors: [0x1a1a1a, 0xff00ff],
  }),

  horse_enthusiast: createNPCType('horse_enthusiast', {
    palette: PALETTES.upscale,
    buildRange: [0.95, 1.12],
  }),

  bird_watcher: createNPCType('bird_watcher', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.15],
    hairColors: [0x8a8a8a, 0xd9d9d9],
  }),

  // === CULTURAL / SPIRITUAL ===
  buddhist_monk_aesthetic: createNPCType('buddhist_monk_aesthetic', {
    palette: {
      shirts: [0x9a7a4a, 0xb88a60],
      pants: [0x8a7a5a, 0xa08a6a],
      shoes: [0x6b5a4a, 0x7a6a5a],
    },
    buildRange: [0.88, 1.1],
  }),

  jewish_traditional: createNPCType('jewish_traditional', {
    genderBias: 'guy',
    palette: PALETTES.business,
    buildRange: [0.88, 1.15],
    hairStyles: ['short', 'buzz'],
  }),

  hindu_festival_goer: createNPCType('hindu_festival_goer', {
    palette: {
      shirts: [0xff6b9d, 0xffd23e, 0x6bc8ff],
      pants: [0x2a3a5c, 0x4a3a5c],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.88, 1.15],
  }),

  muslim_modest_dresser: createNPCType('muslim_modest_dresser', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.15],
    tank: 0,
  }),

  // === MARTIAL ARTS ===
  karate_kid: createNPCType('karate_kid', {
    palette: PALETTES.athletic,
    buildRange: [0.88, 1.05],
    shorts: true,
    tank: 0.6,
  }),

  kung_fu_master: createNPCType('kung_fu_master', {
    palette: PALETTES.athletic,
    buildRange: [0.95, 1.15],
    hairStyles: ['short', 'bald', 'buzz'],
  }),

  tai_chi_enthusiast: createNPCType('tai_chi_enthusiast', {
    palette: PALETTES.hippie,
    buildRange: [0.88, 1.12],
    shorts: 0.5,
    tank: 0.4,
  }),

  // === FASHION AESTHETICS ===
  grunge_chic: createNPCType('grunge_chic', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a, 0x8a6030],
    hairStyles: ['long', 'short'],
  }),

  cottagecore: createNPCType('cottagecore', {
    genderBias: 'girl',
    palette: {
      shirts: [0xf0e8d8, 0xd9b890, 0xb88a60],
      pants: [0x6b5a4a, 0x5a4a3a],
      shoes: [0x8a6030, 0x6b5a4a],
    },
    buildRange: [0.88, 1.08],
  }),

  dark_academia: createNPCType('dark_academia', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.08],
    tank: 0,
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  fairycore: createNPCType('fairycore', {
    genderBias: 'girl',
    palette: PALETTES.neon,
    buildRange: [0.85, 1.05],
    hairColors: [0xff00ff, 0x00ffff],
  }),

  // === RETRO AESTHETIC ===
  80s_enthusiast: createNPCType('80s_enthusiast', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.12],
    shorts: 0.5,
    tank: 0.4,
  }),

  90s_kid: createNPCType('90s_kid', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    shorts: 0.4,
  }),

  70s_throwback: createNPCType('70s_throwback', {
    palette: PALETTES.hippie,
    buildRange: [0.95, 1.2],
    shorts: true,
  }),

  // === ACADEMIC ===
  philosophy_student: createNPCType('philosophy_student', {
    palette: PALETTES.dark,
    buildRange: [0.85, 1.08],
  }),

  physics_nerd: createNPCType('physics_nerd', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  chemistry_student: createNPCType('chemistry_student', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
  }),

  biology_nerd: createNPCType('biology_nerd', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  // === SERVICE / HOSPITALITY ===
  concierge: createNPCType('concierge', {
    palette: PALETTES.business,
    buildRange: [0.88, 1.08],
    tank: 0,
  }),

  hotel_manager: createNPCType('hotel_manager', {
    palette: PALETTES.upscale,
    buildRange: [0.9, 1.1],
    tank: 0,
  }),

  resort_staff: createNPCType('resort_staff', {
    palette: {
      shirts: [0xf0f0f0, 0xf0e8d8, 0x6b7c9e],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.88, 1.08],
  }),

  cruise_ship_worker: createNPCType('cruise_ship_worker', {
    palette: PALETTES.business,
    buildRange: [0.9, 1.1],
    tank: 0,
  }),

  theme_park_employee: createNPCType('theme_park_employee', {
    palette: {
      shirts: [0xff6b9d, 0x6bc8ff, 0xffd23e],
      pants: [0x2a2a2a, 0x3a3a3a],
      shoes: [0xf0f0f0, 0x1a1a1a],
    },
    buildRange: [0.88, 1.1],
  }),

  // === MEMORY / EMOTION TYPES ===
  nostalgic: createNPCType('nostalgic', {
    palette: PALETTES.vintage,
    buildRange: [0.88, 1.15],
    hairColors: [0x8a8a8a, 0xd9d9d9],
  }),

  perpetually_cheerful: createNPCType('perpetually_cheerful', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.05],
    hairColors: [0xd9b44f, 0x6bc8ff],
  }),

  always_tired: createNPCType('always_tired', {
    palette: PALETTES.casual,
    buildRange: [0.85, 1.15],
    hairColors: [0x1a1a1a, 0x8a8a8a],
  }),

  eternally_optimistic: createNPCType('eternally_optimistic', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.08],
  }),

  // === FINAL DISTINCTIVE TYPES ===
  identical_twin: createNPCType('identical_twin', {
    palette: PALETTES.casual,
    buildRange: [0.94, 0.96],
    hairColors: [0x6b4a2f],
  }),

  signature_outfit_person: createNPCType('signature_outfit_person', {
    palette: PALETTES.casual,
    buildRange: [0.88, 1.1],
  }),

  color_coordinated: createNPCType('color_coordinated', {
    palette: PALETTES.upscale,
    buildRange: [0.88, 1.08],
  }),

  monochrome_dresser: createNPCType('monochrome_dresser', {
    palette: {
      shirts: [0x1a1a1a, 0xf0f0f0],
      pants: [0x1a1a1a, 0xf0f0f0],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.88, 1.1],
  }),

  rainbow_dresser: createNPCType('rainbow_dresser', {
    palette: PALETTES.neon,
    buildRange: [0.88, 1.1],
    hairColors: [0xff00ff, 0x00ffff, 0xffff00],
  }),

  leather_enthusiast: createNPCType('leather_enthusiast', {
    palette: PALETTES.dark,
    buildRange: [0.95, 1.15],
    shorts: 0.1,
  }),

  denim_lover: createNPCType('denim_lover', {
    palette: {
      shirts: [0x2a3a5c, 0x3a4a5c],
      pants: [0x2a3a5c, 0x3a4a5c],
      shoes: [0x1a1a1a, 0xf0f0f0],
    },
    buildRange: [0.88, 1.15],
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
