// Terrain regressions per TERRAIN.md — groundH must stay a single-valued,
// continuous height field, and every world-placed object must read its Y
// from it (no more y=0 floaters/buriers once the field stops being flat).
module.exports = {
  cases: [
    {
      name: 'groundH is finite and continuous (no cliffs) across the map',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          let bad = 0, maxDelta = 0, samples = 0;
          const step = 8;
          for (let x = -H; x <= H; x += step) {
            let prev = null;
            for (let z = -H; z <= H; z += step) {
              const h = groundH(x, z);
              samples++;
              if (!Number.isFinite(h)) bad++;
              if (prev !== null) maxDelta = Math.max(maxDelta, Math.abs(h - prev));
              prev = h;
            }
          }
          return { bad, maxDelta, samples };
        });
        assert(r.samples > 100, 'expected a real grid sample, got ' + r.samples);
        assert(r.bad === 0, 'groundH returned a non-finite value at ' + r.bad + ' points');
        // step is 8u; a cliff would show up as a huge jump between neighbors
        assert(r.maxDelta < 4, 'groundH has a cliff: max neighbor delta ' + r.maxDelta.toFixed(2) + 'u over an 8u step');
      },
    },
    {
      name: 'buildings sit on the ground field — baseY matches a footprint corner, no floaters',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const sample = buildings.filter(b => b.baseY !== undefined).slice(0, 40);
          let worstFloat = 0, worstBury = 0;
          for (const b of sample) {
            const corners = [
              groundH(b.minX, b.minZ), groundH(b.minX, b.maxZ),
              groundH(b.maxX, b.minZ), groundH(b.maxX, b.maxZ),
            ];
            const lowest = Math.min(...corners);
            // baseY must be <= every corner's ground height (skirt covers the rest)
            for (const c of corners) worstFloat = Math.max(worstFloat, b.baseY - c);
            worstBury = Math.max(worstBury, lowest - b.baseY);
          }
          return { count: sample.length, worstFloat, worstBury };
        });
        assert(r.count > 0, 'expected at least one building with a baseY');
        assert(r.worstFloat <= 0.001, 'a building floats above a footprint corner by ' + r.worstFloat.toFixed(3) + 'u');
      },
    },
    {
      name: 'rail pillars reach the ground and stay a sane, non-degenerate height',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // beam sits at a fixed absolute y=7; pillars grow from local groundH up to it
          let minPh = Infinity, worstOver = -Infinity;
          for (const p of RAIL_PILLARS) {
            const gh = groundH(p.x, p.z);
            minPh = Math.min(minPh, Math.max(1, 7 - gh));
            worstOver = Math.max(worstOver, gh - 7);
          }
          return { n: RAIL_PILLARS.length, minPh, worstOver };
        });
        assert(r.n > 0, 'expected rail pillars to exist');
        assert(r.minPh >= 1, 'pillar height clamp failed, got minimum ' + r.minPh.toFixed(2));
        // generous tolerance: city relief + a stray park knoll near the loop can eat into
        // the fixed beam clearance a little, but shouldn't come anywhere close to it
        assert(r.worstOver < 4, 'terrain under the rail loop is eating the beam clearance: worst groundH is ' + r.worstOver.toFixed(2) + 'u above the fixed y=7 beam');
      },
    },
    {
      name: 'player walking onto a signature hill settles onto groundH, not a flat y=0',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const hill = SIGNATURE_HILLS[0];
          player.x = hill.x; player.z = hill.z; player.y = groundH(hill.x, hill.z) + 3; player.vy = 0;
          for (let i = 0; i < 60; i++) updateFoot(0.05);
          return { y: player.y, gh: groundH(player.x, player.z), hillH: groundH(hill.x, hill.z) };
        });
        assert(r.hillH > 1, 'expected the signature hill to actually be elevated, got groundH=' + r.hillH.toFixed(2));
        assert(Math.abs(r.y - r.gh) < 0.05, 'expected player.y to settle onto groundH on the hilltop, got y=' + r.y.toFixed(2) + ' vs groundH=' + r.gh.toFixed(2));
      },
    },
  ],
};
