'use strict';
// Guards Kimi's 239-line recorded VO batch. Two things can silently rot here:
// the manifest can drift from KIMI_TURBO_VO.md (it is generated from it), and a
// take can go missing from voice/turbo/ while the index still advertises it.
// Most of the batch is staged against chapters that aren't implemented, so
// nothing else in the game would notice either failure.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');

const BATCH_SIZE = 239;   // the delivered batch, per KIMI_TURBO_VO.md
const POOL_COUNT = 45;    // one per section of the brief

module.exports = [
  {
    name: 'the VO manifest indexes the whole batch and every mp3 is committed',
    run: async (page, { assert, assertEqual }) => {
      const data = await page.evaluate(() => {
        if (typeof TURBO_VO === 'undefined') return null;
        const pools = TURBO_VO.pools();
        return {
          pools,
          count: TURBO_VO.count(),
          srcs: pools.flatMap(p => TURBO_VO[p].map(l => l.src)),
          ids: pools.flatMap(p => TURBO_VO[p].map(l => l.id)),
          blankText: pools.flatMap(p => TURBO_VO[p].filter(l => !l.text).map(l => l.id)),
          sample: TURBO_VO.line(200),
        };
      });
      assert(data, 'TURBO_VO should be loaded from js/turbo-vo.js');
      assertEqual(data.count, BATCH_SIZE, 'the manifest should carry the whole delivered batch');
      assertEqual(data.pools.length, POOL_COUNT, 'one pool per section of the voice-direction brief');
      assertEqual(data.blankText.length, 0,
        `every take needs its spoken text for the caption: missing on #${data.blankText.join(', #')}`);
      assertEqual(new Set(data.ids).size, data.ids.length, 'line ids should be unique across pools');
      assert(data.sample && /bus_pass_200/.test(data.sample.src),
        'TURBO_VO.line(id) should resolve a take by its brief id');

      const missing = data.srcs.filter(src => !fs.existsSync(path.join(ROOT, src)));
      assertEqual(missing.length, 0, `manifest references audio that is not committed: ${missing.slice(0, 5).join(', ')}`);
    },
  },
  {
    name: 'the manifest is in sync with the voice-direction brief it was generated from',
    run: async (page, { assert }) => {
      // `node tools/vo-manifest.js` exits non-zero on drift or a missing file.
      try {
        execFileSync('node', [path.join(ROOT, 'tools', 'vo-manifest.js')], { cwd: ROOT, stdio: 'pipe' });
      } catch (e) {
        assert(false, `js/turbo-vo.js is stale — run \`node tools/vo-manifest.js --write\`\n${e.stdout || ''}${e.stderr || ''}`);
      }
    },
  },
  {
    name: 'every pool listed as wired is actually playable through TURBO_LINES',
    run: async (page, { assert }) => {
      const data = await page.evaluate(() => {
        if (typeof TURBO_VO === 'undefined') return null;
        const out = {};
        TURBO_VO.wired.forEach(pool => {
          const arr = (typeof TURBO_LINES !== 'undefined' && TURBO_LINES[pool]) || null;
          out[pool] = arr && arr.map(l => l.src);
        });
        return out;
      });
      assert(data, 'TURBO_VO should expose its wired-pool list');
      const wired = Object.keys(data);
      assert(wired.length >= 1, 'at least one pool of the batch should be wired into the shipped game');
      wired.forEach(pool => {
        const srcs = data[pool];
        assert(Array.isArray(srcs) && srcs.length,
          `TURBO_VO.wired names "${pool}" but TURBO_LINES.${pool} is empty or absent`);
        srcs.forEach(src => {
          assert(src.startsWith(`voice/turbo/story/${pool}/`),
            `${pool} bark should come from its own recorded pack, got ${src}`);
          assert(fs.existsSync(path.join(ROOT, src)), `${pool} references a missing file: ${src}`);
        });
      });
    },
  },
  {
    name: 'the bus-pass pack stays inside Chapter 1 and rides the idle timer',
    run: async (page, { assert, assertEqual }) => {
      // #203 dates itself to Chapter 2 ("forty cars in eleven days"), so it is
      // recorded and staged but deliberately not in the shipped bark pool.
      const data = await page.evaluate(() => ({
        wired: (typeof TURBO_LINES !== 'undefined' && TURBO_LINES.bus_pass || []).map(l => l.src),
        recorded: (typeof TURBO_VO !== 'undefined' && TURBO_VO.bus_pass || []).length,
        idle: typeof idleBarkT !== 'undefined' ? idleBarkT : null,
      }));
      assertEqual(data.recorded, 4, 'the bus-pass pack is four recorded takes (#200–#203)');
      assertEqual(data.wired.length, 3, 'only #200–#202 are Chapter-1-valid and wired');
      assert(!data.wired.some(src => /bus_pass_203/.test(src)),
        '#203 is a Chapter 2 line and must stay out of the Chapter 1 bark pool');
      assert(typeof data.idle === 'number' && data.idle >= 30,
        `bus-pass lines share the ambient idle timer, which must stay slow, got ${data.idle}`);
    },
  },
];
