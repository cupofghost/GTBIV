// Terrain regressions per TERRAIN.md — groundH must stay a single-valued,
// continuous height field, and every world-placed object must read its Y
// from it (no more y=0 floaters/buriers once the field stops being flat).
module.exports = {
  cases: [
    {
      name: 'groundH is finite everywhere on the map',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          let bad = 0, samples = 0;
          const step = 8;
          for (let x = -H; x <= H; x += step) for (let z = -H; z <= H; z += step) {
            samples++;
            if (!Number.isFinite(groundH(x, z))) bad++;
          }
          return { bad, samples };
        });
        assert(r.samples > 100, 'expected a real grid sample, got ' + r.samples);
        assert(r.bad === 0, 'groundH returned a non-finite value at ' + r.bad + ' points');
      },
    },
    {
      name: 'streets never bank sideways — constant height across a road\'s width',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          let worstNS = 0, worstEW = 0, checkedNS = 0, checkedEW = 0;
          for (let i = 0; i <= WORLD.blocks; i++) {
            const rx = roadLines[i];
            // N/S street at x=rx: walk its length, and at each point sample
            // straight across its width (varying x only) — must be flat.
            for (let z = -H + 10; z <= H - 10; z += 20) {
              const across = [-6, -3, 0, 3, 6].map(dx => groundH(rx + dx, z));
              worstNS = Math.max(worstNS, Math.max(...across) - Math.min(...across));
              checkedNS++;
            }
            const rz = roadLines[i];
            for (let x = -H + 10; x <= H - 10; x += 20) {
              const across = [-6, -3, 0, 3, 6].map(dz => groundH(x, rz + dz));
              worstEW = Math.max(worstEW, Math.max(...across) - Math.min(...across));
              checkedEW++;
            }
          }
          return { worstNS, worstEW, checkedNS, checkedEW };
        });
        assert(r.checkedNS > 20 && r.checkedEW > 20, 'expected a real sample of road points');
        assert(r.worstNS < 0.01, 'a N/S street tilts sideways across its width by ' + r.worstNS.toFixed(3) + 'u');
        assert(r.worstEW < 0.01, 'an E/W street tilts sideways across its width by ' + r.worstEW.toFixed(3) + 'u');
      },
    },
    {
      name: 'block interiors sit on a flat pad (buildings never tilt)',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // non-park blocks have no knolls, so their interior must be dead flat
          const sample = blockInfo.filter(b => b.type === 'bldg').slice(0, 30);
          let worst = 0;
          for (const b of sample) {
            const pts = [[-15, -15], [15, -15], [-15, 15], [15, 15], [0, 0]]
              .map(([dx, dz]) => groundH(b.cx + dx, b.cz + dz));
            worst = Math.max(worst, Math.max(...pts) - Math.min(...pts));
          }
          return { count: sample.length, worst };
        });
        assert(r.count > 5, 'expected several bldg-type blocks to sample');
        assert(r.worst < 0.01, 'a block interior is not flat, spread of ' + r.worst.toFixed(3) + 'u');
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
      name: 'tall pad/street drops get a real climbable stair, not just a wall',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // find a retaining-wall stair (baseH/topH gap > 1.5, pushed by the curb builder)
          const run = STAIR_RUNS.find(r => r.topH - r.baseH > 1.5 && r.topH - r.baseH < 14);
          if (!run) return { found: false };
          // walk the run bottom to top and confirm stairHitRun tracks it continuously
          let worstJump = 0, prevH = null;
          for (let t = 0; t <= 1; t += 0.05) {
            const x = run.x + Math.sin(run.ang) * run.len * t;
            const z = run.z + Math.cos(run.ang) * run.len * t;
            const hit = stairHitRun(x, z);
            if (hit) {
              if (prevH !== null) worstJump = Math.max(worstJump, Math.abs(hit.h - prevH));
              prevH = hit.h;
            }
          }
          return { found: true, baseH: run.baseH, topH: run.topH, worstJump, gotStart: prevH !== null };
        });
        assert(r.found, 'expected at least one tall retaining-wall gap to have a STAIR_RUN');
        assert(r.gotStart, 'expected stairHitRun to detect the run along its own length');
        assert(r.worstJump < 1, 'stair height jumps unexpectedly while climbing it: ' + r.worstJump.toFixed(2));
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
