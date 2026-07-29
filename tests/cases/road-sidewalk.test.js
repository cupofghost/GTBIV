// OP2-A — road & sidewalk visual integrity. Regression coverage for two
// fixes: (1) curb/sidewalk strips are now segmented and each segment is
// seated between its own groundH samples instead of one sample for a whole
// 49u block edge (the "sidewalks hang in the air on a grade" defect), and
// (2) MANHOLE_SPOTS — the sewer-rat system's source of truth — stays
// untouched by the manhole visual rework (still 26 spots, still
// deterministic under the seeded RNG).
module.exports = {
  cases: [
    {
      name: 'sidewalk segments track groundH within a tight bound across the city',
      query: '?dev=1&skipintro=1&seed=424242',
      start: false,
      run: async (page, { assert }) => {
        const result = await page.evaluate(() => {
          const TOL = 0.6; // world units; a 49u single-sample slab would miss by several u on a graded block
          let maxDev = 0, checked = 0;
          for (const s of SIDEWALK_SEG_SAMPLES) {
            const dev = Math.abs(s.y - groundH(s.x, s.z));
            if (dev > maxDev) maxDev = dev;
            checked++;
          }
          return { count: SIDEWALK_SEG_SAMPLES.length, maxDev, checked, TOL };
        });
        assert(result.count > 100, `expected many sidewalk segments, got ${result.count}`);
        assert(result.maxDev < result.TOL, `sidewalk segment deviated ${result.maxDev.toFixed(3)}u from groundH (tolerance ${result.TOL}u)`);
      },
    },
    {
      name: 'manhole spots unchanged: 26 deterministic positions, untouched by the visual rework',
      query: '?dev=1&skipintro=1&seed=424242',
      start: false,
      run: async (page, { assert, assertEqual }) => {
        const first = await page.evaluate(() => MANHOLE_SPOTS.map(p => [p.x, p.z]));
        assertEqual(first.length, 26, 'expected MANHOLE_SPOTS to still have 26 entries');
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(800);
        const second = await page.evaluate(() => MANHOLE_SPOTS.map(p => [p.x, p.z]));
        assertEqual(JSON.stringify(first), JSON.stringify(second), 'seeded manhole positions should reproduce exactly across reloads');
        // rim + lid instanced meshes should exist, one instance per manhole
        const geomCounts = await page.evaluate(() => {
          const counts = [];
          scene.traverse(o => { if (o.isInstancedMesh && o.count === MANHOLE_SPOTS.length && (o.geometry.type === 'CylinderGeometry' || o.geometry.type === 'TorusGeometry')) counts.push(o.count); });
          return counts;
        });
        assert(geomCounts.length >= 2, `expected rim + lid instanced manhole meshes, found ${geomCounts.length} matching instanced cylinder meshes`);
      },
    },
  ],
};
