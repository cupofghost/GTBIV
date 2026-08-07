// PV9 — slow motion. Held, metered, ramped, and it must always give the world
// back exactly as it found it.
//
// Everything here drives updateSlowmo() with a simulated dt rather than waiting
// on wall clock: headless rAF is throttled to a few frames a second, so a real
// -time ramp test would be both slow and flaky.

module.exports = [
  {
    name: 'Slow motion: holding it ramps time down and releasing ramps it back',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        resetSlowmo();
        const first = (() => { input.slow = true; updateSlowmo(0.016); return SLOWMO.scale; })();
        for (let i = 0; i < 90; i++) updateSlowmo(0.016);
        const held = SLOWMO.scale;
        input.slow = false;
        const releasedFirst = (() => { updateSlowmo(0.016); return SLOWMO.scale; })();
        for (let i = 0; i < 200; i++) updateSlowmo(0.016);
        const back = SLOWMO.scale;
        resetSlowmo();
        return { first, held, releasedFirst, back, target: SLOWMO.SCALE };
      });
      assert(r.first < 1 && r.first > r.target,
        `the first slowed frame should be a ramp, not a snap (got ${r.first})`);
      assert(Math.abs(r.held - r.target) < 0.01,
        `holding should settle at SLOWMO.SCALE ${r.target}, got ${r.held}`);
      assert(r.releasedFirst > r.held, 'releasing should start easing back up immediately');
      assert(r.back === 1, `time should return exactly to 1, got ${r.back}`);
    }
  },

  {
    name: 'Slow motion: the meter drains, cuts you off at empty, and refills',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        resetSlowmo();
        input.slow = true;
        let ranDry = false;
        for (let i = 0; i < 600; i++) { updateSlowmo(0.016); if (SLOWMO.meter <= 0) ranDry = true; }
        const emptied = { active: SLOWMO.active, meter: SLOWMO.meter };
        input.slow = false;
        for (let i = 0; i < 300; i++) updateSlowmo(0.016);
        const refilled = SLOWMO.meter;
        resetSlowmo();
        return { ranDry, emptied, refilled };
      });
      assert(r.ranDry, 'holding slow motion should be able to empty the meter');
      assert(r.emptied.active === false, 'an empty meter must cut slow motion off');
      assert(r.refilled > 40, `the meter should refill when released, got ${r.refilled}`);
    }
  },

  {
    name: 'Slow motion: an empty meter cannot be stutter-restarted',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        resetSlowmo();
        SLOWMO.meter = SLOWMO.MIN_START - 1;      // just under the floor
        input.slow = true; updateSlowmo(0.016);
        const belowFloor = SLOWMO.active;
        input.slow = false; updateSlowmo(0.016);
        SLOWMO.meter = SLOWMO.MIN_START + 1;      // just over it
        input.slow = true; updateSlowmo(0.016);
        const aboveFloor = SLOWMO.active;
        resetSlowmo();
        return { belowFloor, aboveFloor };
      });
      assert(r.belowFloor === false, 'below MIN_START, holding should not trigger');
      assert(r.aboveFloor === true, 'above MIN_START, holding should trigger');
    }
  },

  {
    name: 'Slow motion: presentation ramps with depth and fully restores',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        resetSlowmo();
        const base = { sat: FX_BASE_SAT, bloom: FX_BASE_BLOOM, vig: FX_BASE_VIGNETTE };
        input.slow = true;
        for (let i = 0; i < 90; i++) updateSlowmo(0.016);
        const deep = { sat: FX.sat, bloom: FX.bloom, vig: FX.vignette, ab: FX.slowAberr, fov: slowmoFov(), depth: slowmoDepth() };
        input.slow = false;
        for (let i = 0; i < 250; i++) updateSlowmo(0.016);
        const rest = { sat: FX.sat, bloom: FX.bloom, vig: FX.vignette, ab: FX.slowAberr, fov: slowmoFov() };
        resetSlowmo();
        return { base, deep, rest };
      });
      assert(r.deep.depth > 0.95, 'held to the floor, depth should be ~1');
      // Owner direction: keep it vibrant. Slow motion pushes saturation UP —
      // the desaturated-slowmo cliche greys out the best thing in the picture.
      assert(r.deep.sat > r.base.sat + 0.2, `slow motion should push colour, not drain it (got ${r.deep.sat})`);
      assert(r.deep.bloom > r.base.bloom + 0.2, `slow motion should lift bloom (got ${r.deep.bloom})`);
      assert(r.deep.ab > 0.05, `slow motion should strain the lens (got ${r.deep.ab})`);
      assert(r.deep.fov > 5, `slow motion should widen the camera (got ${r.deep.fov})`);
      // exact restore — a drifting base value would compound every use
      assert(r.rest.sat === r.base.sat, `saturation should restore exactly (${r.rest.sat} vs ${r.base.sat})`);
      assert(r.rest.bloom === r.base.bloom, 'bloom should restore exactly');
      assert(r.rest.vig === r.base.vig, 'vignette should restore exactly');
      assert(r.rest.ab === 0, 'the slow-motion aberration term should return to 0');
      assert(r.rest.fov === 0, 'the slow-motion FOV term should return to 0');
    }
  },

  {
    name: 'Slow motion: one authoritative time scale, composed with the dev control',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const src = await page.evaluate(() => loop.toString());
      assert(/simDt\s*=\s*dt\s*\*\s*TIME_SCALE\s*\*\s*SLOWMO\.scale/.test(src),
        'the loop should derive simDt from one TIME_SCALE * SLOWMO.scale product');
      assert(/updateSlowmo\(dt\)/.test(src),
        'updateSlowmo should be driven by real dt from the loop');
    }
  },

  {
    name: 'Slow motion: unavailable during cutscenes, pause and death',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        resetSlowmo();
        const live = slowmoAvailable();
        G.paused = true; const paused = slowmoAvailable(); G.paused = false;
        G.over = true; const over = slowmoAvailable(); G.over = false;
        activeCutscene = { id: 'x' }; const cut = slowmoAvailable(); activeCutscene = null;
        // and holding through an unavailable window must not stretch time
        G.paused = true; input.slow = true;
        for (let i = 0; i < 40; i++) updateSlowmo(0.016);
        const scaleWhilePaused = SLOWMO.scale;
        G.paused = false; input.slow = false; resetSlowmo();
        return { live, paused, over, cut, scaleWhilePaused };
      });
      assert(r.live === true, 'slow motion should be available during normal play');
      assert(r.paused === false, 'not while paused');
      assert(r.over === false, 'not while dead');
      assert(r.cut === false, 'not during a cutscene');
      assert(r.scaleWhilePaused === 1, 'holding through a pause must not slow time');
    }
  },

  {
    name: 'Slow motion: BUSTED and WASTED reset the clock',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const out = {};
        for (const which of ['busted', 'wasted']) {
          resetSlowmo();
          input.slow = true;
          for (let i = 0; i < 60; i++) updateSlowmo(0.016);
          out[which + 'Before'] = SLOWMO.scale;
          G.over = false;
          if (which === 'busted') busted(); else wasted();
          out[which + 'After'] = SLOWMO.scale;
          out[which + 'Input'] = input.slow;
          G.over = false; resetSlowmo();
        }
        return out;
      });
      for (const w of ['busted', 'wasted']) {
        assert(r[w + 'Before'] < 0.5, `${w}: time should have been slowed first`);
        assert(r[w + 'After'] === 1, `${w} should reset the time scale to 1`);
        assert(r[w + 'Input'] === false, `${w} should clear the held input`);
      }
    }
  },
];
