// PV11 — §RAMPAGE: the escalation ladder for vehicle carnage.
//
// The things worth pinning: a tier fires exactly once per crossing, the window
// expires, death clears it, and the payout stays proportionate to the economy
// so one good night can't make Deb's $800 debt — the spine of Chapter 1 —
// irrelevant.

module.exports = [
  {
    name: 'Rampage: the ladder climbs, and each tier fires exactly once',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        endRampage();
        const seen = [];
        let lastTier = -1;
        for (let i = 1; i <= 14; i++) {
          rampageHit();
          if (RAMPAGE.tier !== lastTier) { seen.push({ at: RAMPAGE.combo, tier: RAMPAGE.tier }); lastTier = RAMPAGE.tier; }
        }
        const out = { seen, combo: RAMPAGE.combo, tier: RAMPAGE.tier,
                      thresholds: RAMPAGE_TIERS.map(t => t.n), top: RAMPAGE_TIERS.length - 1 };
        endRampage();
        return out;
      });
      assert(r.combo === 14, `14 wrecks should be a ×14 combo (got ${r.combo})`);
      assert(r.tier === r.top, 'the ladder should reach its top tier');
      assert(r.seen.length === r.thresholds.length,
        `each tier should fire once — expected ${r.thresholds.length} crossings, got ${r.seen.length}`);
      r.seen.forEach((s, i) => assert(s.at === r.thresholds[i],
        `tier ${i} should fire at ${r.thresholds[i]}, fired at ${s.at}`));
    }
  },

  {
    name: 'Rampage: payout stays proportionate to the economy',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        endRampage();
        const before = G.money;
        for (let i = 0; i < 12; i++) rampageHit();
        const total = G.money - before;
        G.money = before; $('money').textContent = '$' + G.money;
        endRampage();
        return { total, ladder: RAMPAGE_TIERS.reduce((n, t) => n + t.cash, 0) };
      });
      assert(r.total === r.ladder, `the whole ladder should pay its listed sum (${r.total} vs ${r.ladder})`);
      // A full rampage should sit alongside a big heist, not replace the chapter.
      assert(r.total < 800, `a full rampage must not out-earn Deb's $800 debt (paid ${r.total})`);
      assert(r.total > 200, `a full rampage should still be worth doing (paid ${r.total})`);
    }
  },

  {
    name: 'Rampage: the window expires and resets the ladder',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        endRampage();
        for (let i = 0; i < 4; i++) rampageHit();
        const held = { combo: RAMPAGE.combo, t: RAMPAGE.t };
        // keep hitting inside the window — it should refresh, not lapse
        for (let i = 0; i < 3; i++) { for (let k = 0; k < 100; k++) updateRampage(0.016); rampageHit(); }
        const sustained = RAMPAGE.combo;
        for (let i = 0; i < 400; i++) updateRampage(0.016);   // well past WINDOW
        const lapsed = { combo: RAMPAGE.combo, tier: RAMPAGE.tier, best: RAMPAGE.best };
        endRampage();
        return { held, sustained, lapsed, window: RAMPAGE.WINDOW };
      });
      assert(r.held.combo === 4, 'four wrecks should be a ×4');
      assert(Math.abs(r.held.t - r.window) < 1e-6, 'each wreck should refresh the full window');
      assert(r.sustained === 7, `hits inside the window should keep the combo alive (got ${r.sustained})`);
      assert(r.lapsed.combo === 0, 'letting the window lapse should reset the combo');
      assert(r.lapsed.tier === -1, 'lapsing should reset the tier so it can fire again');
      assert(r.lapsed.best >= 7, 'the session best should survive the reset');
    }
  },

  {
    name: 'Rampage: the top tier bends time, lower tiers do not',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        endRampage(); resetSlowmo(); setReduceMotion(false);
        for (let i = 0; i < 7; i++) rampageHit();       // CARNAGE, one below the top
        const belowTop = SLOWMO.autoT;
        for (let i = 0; i < 3; i++) rampageHit();       // crosses CITY ON FIRE
        const atTop = SLOWMO.autoT;
        endRampage(); resetSlowmo();
        return { belowTop, atTop };
      });
      assert(r.belowTop === 0, 'tiers below the top should not trigger the free time bend');
      assert(r.atTop > 0.5, `the top tier should earn a cinematic beat (got ${r.atTop})`);
    }
  },

  {
    name: 'Rampage: death and arrest end the combo',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const out = {};
        for (const which of ['busted', 'wasted']) {
          endRampage();
          for (let i = 0; i < 6; i++) rampageHit();
          out[which + 'Before'] = RAMPAGE.combo;
          G.over = false;
          if (which === 'busted') busted(); else wasted();
          out[which + 'After'] = RAMPAGE.combo;
          out[which + 'Tier'] = RAMPAGE.tier;
          G.over = false;
        }
        endRampage();
        return out;
      });
      for (const w of ['busted', 'wasted']) {
        assert(r[w + 'Before'] === 6, `${w}: combo should have been running`);
        assert(r[w + 'After'] === 0, `${w} should end the combo`);
        assert(r[w + 'Tier'] === -1, `${w} should reset the tier`);
      }
    }
  },

  {
    name: 'Rampage: blowing up a car is what scores, and the chip shows it',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        // rampageHit() is gated on !G.over, and killCar(_, true) runs a real
        // bigExplosion whose damageArea can reach the player and WASTE him — at
        // which point the second wreck silently scores nothing. Blow the cars up
        // well away from Turbo and make him unkillable for the duration, so this
        // case measures the ladder rather than his luck. (It passed alone and
        // failed in a full-suite run for exactly this reason.)
        endRampage();
        const wasGod = DEV_STATE.god;
        DEV_STATE.god = true; G.over = false;
        const node = intersections[52];
        player.x = node.x + 120; player.z = node.z + 120;
        const c = makeCar('sedan', node.x, node.z, 0, { parked: true });
        killCar(c, true);
        const chip = document.getElementById('combo');
        const first = { combo: RAMPAGE.combo, shown: chip.style.display };
        const c2 = makeCar('sedan', node.x + 3, node.z, 0, { parked: true });
        killCar(c2, true);
        DEV_STATE.god = wasGod;
        const second = { combo: RAMPAGE.combo, shown: chip.style.display,
                         mult: document.getElementById('comboMult').textContent };
        endRampage();
        return { first, second, hidden: chip.style.display };
      });
      assert(r.first.combo === 1, 'one wreck should score one');
      assert(r.first.shown === 'none', 'the chip should stay hidden below a ×2');
      assert(r.second.combo === 2, 'a second wreck should score two');
      assert(r.second.shown === 'flex', 'the chip should appear at ×2');
      assert(r.second.mult === '×2', `the chip should read the multiplier (got ${r.second.mult})`);
      assert(r.hidden === 'none', 'ending the combo should hide the chip');
    }
  },
];
