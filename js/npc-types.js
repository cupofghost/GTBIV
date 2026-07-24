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
