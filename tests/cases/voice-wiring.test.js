'use strict';
// Guards the staged-voice wiring: the story bark pools must exist, be
// non-empty, and every `src` must point at a real committed mp3. This is the
// regression net for pulling `voice/turbo/story/` lines out of the "staged but
// unwired" pile — if a category or a file goes missing, this goes red.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

// Categories that were wired out of the staged pool, and the trigger each one
// rides on (kept here as living documentation of the hookup).
const WIRED = {
  robbery: { min: 9, trigger: 'point-blank stickup in doAttack()' },
  robbery_take: { min: 5, trigger: 'safe-crack payoff in tapSafeCrack()' },
  pizza_jack: { min: 7, trigger: 'jacking a marked pizza car in doPizzaJack()' },
  debt_grumble: { min: 7, trigger: 'ambient mutter while the $800 is unpaid' },
};

module.exports = [
  {
    name: 'wired story barks exist and every mp3 resolves to a real file',
    run: async (page, { assert }) => {
      const pools = await page.evaluate((cats) => {
        const out = {};
        for (const cat of cats) {
          const arr = (typeof TURBO_LINES !== 'undefined' && TURBO_LINES[cat]) || null;
          out[cat] = arr && arr.map(l => l.src);
        }
        return out;
      }, Object.keys(WIRED));

      for (const [cat, spec] of Object.entries(WIRED)) {
        const srcs = pools[cat];
        assert(Array.isArray(srcs), `TURBO_LINES.${cat} should be a wired pool`);
        assert(srcs.length >= spec.min,
          `${cat} should have >= ${spec.min} lines (${spec.trigger}), got ${srcs.length}`);
        srcs.forEach(src => {
          assert(typeof src === 'string' && src.startsWith('voice/turbo/story/'),
            `${cat} line should be a recorded story mp3, got ${src}`);
          assert(fs.existsSync(path.join(ROOT, src)),
            `${cat} references a missing file: ${src}`);
        });
      }
    },
  },
];
