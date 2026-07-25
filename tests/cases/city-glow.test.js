// City Glow — the carry-over beautification systems: lit-window night swap on
// the facade buckets, neon sign seating, streetlight pool seating + visibility.
// Placement/state logic is the deliverable (textures are placeholders by
// design), so these tests lock the logic, not the look.
module.exports = {
  cases: [
    {
      name: 'applyDayNight swaps facade windows, neon brightness, and pool visibility',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const night = await page.evaluate(() => ({
          night: G.night,
          emisNight: facadeMats.every(f => f.mat.emissiveMap === f.nightTex && f.mat.emissiveIntensity > 0.9),
          pools: glowPools && glowPools.visible,
          neon: neonSets.length && neonSets.every(s => s.mat.color.r > 1.1),
        }));
        assert(night.night === true && night.emisNight === true, 'game starts at night with lit windows, got ' + JSON.stringify(night));
        assert(night.pools === true, 'light pools should be visible at night');
        assert(night.neon > 0, 'neon should be boosted at night');

        const day = await page.evaluate(() => {
          toggleNight();
          return {
            emisDay: facadeMats.every(f => f.mat.emissiveMap === f.dayTex && f.mat.emissiveIntensity < 0.3),
            pools: glowPools.visible,
            neon: neonSets.every(s => s.mat.color.r < 0.9),
          };
        });
        assert(day.emisDay === true, 'day should restore flat facades, got ' + JSON.stringify(day));
        assert(day.pools === false, 'light pools should hide by day');
        assert(day.neon === true, 'neon should dim by day');
        await page.evaluate(() => toggleNight()); // put night back
      },
    },
    {
      name: 'streetlight pools are seated above the terrain',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const m = new THREE.Matrix4(), e = m.elements;
          let worst = Infinity, n = glowPools.count;
          for (let i = 0; i < n; i += 7) { // sample every 7th
            glowPools.getMatrixAt(i, m);
            const x = e[12], y = e[13], z = e[14];
            worst = Math.min(worst, y - groundH(x, z));
          }
          return { worst, n };
        });
        assert(r.n > 50, 'expected a real pool field, got ' + r.n);
        assert(r.worst >= 0.02, 'a pool is sunk into the street: ' + r.worst.toFixed(3));
      },
    },
    {
      name: 'neon signs are seated on facades above the sidewalk',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const m = new THREE.Matrix4(), e = m.elements;
          let total = 0, worst = Infinity;
          neonSets.forEach(s => {
            for (let i = 0; i < s.inst.count; i++) {
              s.inst.getMatrixAt(i, m);
              worst = Math.min(worst, e[13] - groundH(e[12], e[14]));
              total++;
            }
          });
          return { total, worst };
        });
        assert(r.total > 20, 'expected a meaningful sign count, got ' + r.total);
        assert(r.worst >= 2.0, 'a sign is buried: lowest clearance ' + r.worst.toFixed(2));
      },
    },
  ],
};
