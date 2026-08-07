// PV5 (partial) — "Make the city more city shaped and less like a square."
//
// Building height used to be a hard step at r=170: rand(24,64) inside,
// rand(10,30) outside. From the air that reads as a square of tall boxes inside
// a square of short ones. It is now a smooth falloff from a downtown core whose
// radius wanders with bearing.
//
// Scope: heights only. The road lattice and the building COUNT are untouched —
// groundH and every static's Y are built on that lattice, and thinning blocks
// would move collision, stairs, ladders and store/heist placement. The
// remaining half of PV5 (an irregular outer footprint) is still open.

module.exports = [
  {
    name: 'Skyline: height falls off smoothly from a downtown core',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        const at = (lo, hi) => {
          const v = buildings
            .filter(b => { const d = Math.hypot((b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2); return d >= lo && d < hi; })
            .map(b => b.h);
          return v.length ? v.reduce((a, c) => a + c, 0) / v.length : null;
        };
        return { core: at(0, 80), mid: at(80, 160), outer: at(160, 240), edge: at(240, 999) };
      });
      assert(r.core !== null && r.edge !== null, 'the sweep should find buildings at both ends');
      assert(r.core > r.mid && r.mid > r.outer && r.outer > r.edge,
        `mean height should decrease monotonically outward, got ${JSON.stringify(r)}`);
      assert(r.core / r.edge > 2.5,
        `downtown should be markedly taller than the edge (ratio ${(r.core / r.edge).toFixed(1)})`);
    }
  },

  {
    name: 'Skyline: the crest wanders with bearing instead of sitting on a ring',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        // sample a fixed radius band and look at the tallest building per sector
        const ring = buildings
          .map(b => ({ h: b.h, x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 }))
          .map(o => ({ ...o, d: Math.hypot(o.x, o.z), a: Math.atan2(o.z, o.x) }))
          .filter(o => o.d > 140 && o.d < 200);
        const sectors = [];
        for (let k = 0; k < 8; k++) {
          const lo = -Math.PI + k * Math.PI / 4;
          const v = ring.filter(o => o.a >= lo && o.a < lo + Math.PI / 4).map(o => o.h);
          if (v.length) sectors.push(Math.max(...v));
        }
        return { sectors, n: ring.length };
      });
      assert(r.sectors.length >= 6, 'the ring band should cover most bearings');
      const lo = Math.min(...r.sectors), hi = Math.max(...r.sectors);
      // A ring would give near-identical maxima all the way round.
      assert(hi / lo > 1.6,
        `the skyline crest should vary with bearing, not sit on a circle (${lo}..${hi})`);
    }
  },

  {
    name: 'Skyline: no hard step survives at the old r=170 boundary',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        const mean = (lo, hi) => {
          const v = buildings
            .filter(b => { const d = Math.hypot((b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2); return d >= lo && d < hi; })
            .map(b => b.h);
          return v.length ? v.reduce((a, c) => a + c, 0) / v.length : null;
        };
        // straddle the old threshold with two narrow bands
        return { inside: mean(150, 170), outside: mean(170, 190) };
      });
      assert(r.inside !== null && r.outside !== null, 'both bands should contain buildings');
      // The old code jumped from a rand(24,64) mean (~44) to a rand(10,30) mean
      // (~20) across this line — better than a 2x step. A smooth field should
      // barely notice the boundary.
      const step = r.inside / r.outside;
      assert(step < 1.6,
        `height should not step at the old r=170 line (inside ${r.inside.toFixed(1)}, outside ${r.outside.toFixed(1)}, ratio ${step.toFixed(2)})`);
    }
  },

  {
    name: 'Skyline: the lattice and the building count are untouched',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        // every building must still sit inside a block, clear of the roadway
        let onRoad = 0;
        for (const b of buildings) {
          const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
          if (onRoadway(cx, cz, -2)) onRoad++;
        }
        return { count: buildings.length, onRoad,
                 heights: { min: Math.min(...buildings.map(b => b.h)),
                            max: Math.max(...buildings.map(b => b.h)) } };
      });
      assert(r.count > 80, `the city should still be built out (${r.count} buildings)`);
      assert(r.onRoad === 0, `${r.onRoad} buildings ended up centred on a road`);
      assert(r.heights.min > 3, `no degenerate flat buildings (min ${r.heights.min.toFixed(1)})`);
      assert(r.heights.max < 90, `no runaway towers (max ${r.heights.max.toFixed(1)})`);
    }
  },
];
