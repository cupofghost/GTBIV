// PV10 — §CARNAGE: debris, scorch marks, chain reactions, and the automatic
// slow-motion "money shot".
//
// The spectacle itself can't be asserted headlessly. What these pin down is
// that it is BOUNDED: both pools are fixed-size and recycle, the chain reaction
// is capped per blast and globally rate-limited, and the free slow-motion beat
// can't be farmed for infinite time-bending.

module.exports = [
  {
    name: 'Carnage: an explosion throws debris that settles and recycles',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        for (const d of debris) { d.life = 0; d.mesh.visible = false; }
        spawnDebris(player.x + 6, 1, player.z, 14, 0xff00aa, 13);
        const live = debris.filter(d => d.life > 0).length;
        const airborne = debris.filter(d => d.life > 0 && d.vy > 0).length;
        for (let i = 0; i < 400; i++) updateDebris(0.016);   // ~6.4s, past max life
        const after = debris.filter(d => d.life > 0).length;
        const visible = debris.filter(d => d.mesh.visible).length;
        return { live, airborne, after, visible, cap: DEBRIS_MAX };
      });
      assert(r.live > 6, `an explosion should throw a handful of chunks (got ${r.live})`);
      assert(r.airborne > 0, 'debris should be launched upward, not just dropped');
      assert(r.after === 0, `all debris should expire (${r.after} still live)`);
      assert(r.visible === 0, 'expired debris must be hidden, not left in the scene');
    }
  },

  {
    name: 'Carnage: the debris pool is bounded and never allocates',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const before = debris.length;
        // far more than the pool can hold, from many blasts at once
        for (let k = 0; k < 40; k++) spawnDebris(player.x + k, 1, player.z, 30, 0x334455, 12);
        return { before, after: debris.length, live: debris.filter(d => d.life > 0).length, cap: DEBRIS_MAX };
      });
      assert(r.after === r.before, `the pool must not grow (${r.before} -> ${r.after})`);
      assert(r.live <= r.cap, `live debris must stay within the pool (${r.live} > ${r.cap})`);
    }
  },

  {
    name: 'Carnage: scorch marks fade out and recycle through a fixed pool',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const before = scorches.length;
        for (let i = 0; i < 25; i++) addScorch(player.x + i * 3, player.z, 4);
        const live = scorches.filter(s => s.life > 0).length;
        for (let i = 0; i < 1200; i++) updateScorch(0.016);   // ~19s, past the 14s life
        return { before, after: scorches.length, live,
                 stillLive: scorches.filter(s => s.life > 0).length,
                 visible: scorches.filter(s => s.mesh.visible).length, cap: SCORCH_MAX };
      });
      assert(r.after === r.before, 'the scorch pool must not grow');
      assert(r.live <= r.cap, 'live scorches must stay within the pool');
      assert(r.stillLive === 0, `scorches should fade away (${r.stillLive} still live)`);
      assert(r.visible === 0, 'faded scorches must be hidden');
    }
  },

  {
    name: 'Carnage: a blast lights neighbours on a staggered fuse, capped per blast',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        chainBudget = CHAIN_BUDGET_MAX;
        const node = intersections[30];
        for (let i = 0; i < 8; i++) {
          const c = makeCar('sedan', node.x + (i - 4) * 2, node.z, 0, { parked: true });
          c.burning = false;
        }
        // chainReact picks from the GLOBAL car list, so measure what it actually
        // lit rather than only the cars this case happened to add
        const before = new Set(cars.filter(c => c.burning));
        const lit = chainReact(node.x, node.z, null);
        const fuses = cars.filter(c => c.burning && !before.has(c)).map(c => c.burnT);
        const spread = fuses.length > 1 ? Math.max(...fuses) - Math.min(...fuses) : 0;
        return { lit, burning: fuses.length, fuses, spread, max: CHAIN_MAX,
                 allFused: fuses.length > 0 && fuses.every(f => f > 0 && f < 1.5) };
      });
      assert(r.lit > 0, 'a blast surrounded by cars should light at least one');
      assert(r.lit <= r.max, `a single blast must not light more than CHAIN_MAX (${r.lit} > ${r.max})`);
      assert(r.allFused, 'chained cars should get a short fuse, not detonate instantly');
      assert(r.burning === r.lit, `every car chainReact counted should be burning (${r.lit} vs ${r.burning})`);
      assert(r.lit < 2 || r.spread > 0.02,
        `fuses should be staggered so the cascade is ragged, not one bang (fuses ${JSON.stringify(r.fuses)})`);
    }
  },

  {
    name: 'Carnage: the global chain budget stops a pile-up cascading the map',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        chainBudget = CHAIN_BUDGET_MAX;
        const node = intersections[40];
        for (let i = 0; i < 60; i++)
          makeCar('sedan', node.x + (i % 10) * 2 - 10, node.z + Math.floor(i / 10) * 2 - 6, 0, { parked: true });
        let total = 0;
        for (let blast = 0; blast < 20; blast++) total += chainReact(node.x, node.z, null);
        const exhausted = chainBudget;
        // and it refills over time rather than staying dead
        for (let i = 0; i < 600; i++) updateChainBudget(0.016);
        return { total, exhausted, refilled: chainBudget, cap: CHAIN_BUDGET_MAX };
      });
      assert(r.total <= r.cap, `20 blasts must not exceed the global budget (${r.total} > ${r.cap})`);
      assert(r.exhausted < 1, 'the budget should actually be spent down');
      assert(r.refilled > 4, `the budget should refill over time (got ${r.refilled})`);
      assert(r.refilled <= r.cap, 'the budget must not refill past its cap');
    }
  },

  {
    name: 'Carnage: a near blast bends time for free, without charging the meter',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        resetSlowmo();
        input.slow = false;
        const meter0 = SLOWMO.meter;
        slowmoBurst(0.75);
        const armed = SLOWMO.autoT;
        for (let i = 0; i < 20; i++) updateSlowmo(0.016);   // ~0.3s in
        const during = { scale: SLOWMO.scale, active: SLOWMO.active, meter: SLOWMO.meter };
        for (let i = 0; i < 300; i++) updateSlowmo(0.016);  // well past the window
        const after = { scale: SLOWMO.scale, active: SLOWMO.active, autoT: SLOWMO.autoT };
        resetSlowmo();
        return { meter0, armed, during, after };
      });
      assert(r.armed > 0.5, 'the burst should arm a cinematic window');
      assert(r.during.active === true, 'the window should slow time without a button held');
      assert(r.during.scale < 1, 'time should actually be slowed during the window');
      assert(r.during.meter >= r.meter0,
        `a free beat must not charge the meter (${r.meter0} -> ${r.during.meter})`);
      assert(r.after.active === false, 'the window should end on its own');
      assert(r.after.scale === 1, 'time should return exactly to 1 after the window');
    }
  },

  {
    name: 'Carnage: the free beat respects reduce-motion and cutscene lockout',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        resetSlowmo();
        setReduceMotion(true);
        slowmoBurst(0.75);
        const reduced = SLOWMO.autoT;
        setReduceMotion(false);

        activeCutscene = { id: 'x' };
        slowmoBurst(0.75);
        const inCutscene = SLOWMO.autoT;
        activeCutscene = null;

        // and one already running must be cancelled if a cutscene starts
        slowmoBurst(0.75);
        activeCutscene = { id: 'y' };
        updateSlowmo(0.016);
        const cancelled = SLOWMO.autoT;
        activeCutscene = null;
        resetSlowmo();
        return { reduced, inCutscene, cancelled };
      });
      assert(r.reduced === 0, 'reduce-motion should suppress the automatic time bend');
      assert(r.inCutscene === 0, 'a cutscene should refuse the automatic time bend');
      assert(r.cancelled === 0, 'a cutscene starting mid-beat should cancel it');
    }
  },
];
