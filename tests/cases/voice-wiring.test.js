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
  debt_grumble: { min: 7, trigger: 'ambient mutter while the $800 is unpaid (shared idleBarkT timer)' },
  idle_backstory: { min: 5, trigger: 'ambient backstory musing (shared idleBarkT timer)' },
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
  {
    name: 'ambient idle chatter keeps a slow, unhurried cadence (no wall of sound)',
    run: async (page, { assert }) => {
      // idleBarkT is the shared timer debt_grumble and idle_backstory both
      // ride; it must stay a long, generously-randomized gap so unprompted
      // Turbo barks stay rare, not a wall of sound. Guards against someone
      // tightening the interval later without noticing the design intent.
      const t = await page.evaluate(() => (typeof idleBarkT !== 'undefined' ? idleBarkT : null));
      assert(typeof t === 'number', 'idleBarkT should exist as the shared ambient-bark timer');
      assert(t >= 30, `idleBarkT should start >= 30s so ambient barks stay rare, got ${t}`);
    },
  },
];
