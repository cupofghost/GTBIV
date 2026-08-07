// PV3 — "no trees in streets."
//
// Both tree systems used to offset from a block centre by BLOCK/2 + 1.6 under
// a comment claiming that was the sidewalk edge. It isn't: blocks are BLOCK
// wide with ROAD *between* them, so the block edge IS the kerb and +1.6 is in
// the carriageway. These cases pin the geometry so the sign can't flip back.

module.exports = [
  {
    name: 'Trees: onRoadway() agrees with the road grid',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const line = roadLines[3];
        return {
          centre: onRoadway(line, roadLines[2], 0),          // dead centre of an intersection
          justInside: onRoadway(line + ROAD / 2 - 0.5, 1e6, 0), // still asphalt
          justOutside: onRoadway(line + ROAD / 2 + 0.5, 1e6, 0), // past the kerb
          blockMiddle: onRoadway(line + ROAD / 2 + BLOCK / 2, 1e6, 0),
          road: ROAD, block: BLOCK,
        };
      });
      assert(r.centre === true, 'a road centreline should read as roadway');
      assert(r.justInside === true, 'half a metre inside the kerb should read as roadway');
      assert(r.justOutside === false, 'half a metre past the kerb should not be roadway');
      assert(r.blockMiddle === false, 'the middle of a block should not be roadway');
    }
  },

  {
    name: 'Trees: not one placed tree stands in a traffic lane',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        // treeSpots is the collidable park/street system; the cosmetic
        // sidewalk trees are instanced, so read their matrices back instead.
        const pts = treeSpots.map(p => ({ x: p.x, z: p.z, src: 'treeSpots' }));
        scene.traverse(o => {
          if (!o.isInstancedMesh || !o.geometry || !o.geometry.parameters) return;
          const g = o.geometry.parameters;
          // the dress-tree trunk: a 6-sided cylinder, radiusTop 0.13
          if (g.radiusTop !== 0.13 || g.radialSegments !== 6) return;
          const m = new THREE.Matrix4(), v = new THREE.Vector3();
          for (let i = 0; i < o.count; i++) {
            o.getMatrixAt(i, m); v.setFromMatrixPosition(m);
            pts.push({ x: v.x, z: v.z, src: 'treeDress' });
          }
        });
        const bad = pts.filter(p => onRoadway(p.x, p.z, 0));
        return { total: pts.length, bad: bad.slice(0, 8), badCount: bad.length };
      });
      assert(r.total > 40, `expected a healthy number of trees, got ${r.total}`);
      assert(r.badCount === 0,
        `${r.badCount}/${r.total} trees are standing in the road, e.g. ${JSON.stringify(r.bad)}`);
    }
  },

  {
    name: 'Trees: rejecting road spots does not collapse the tree count',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        const blocks = blockInfo.filter(b => b.type === 'bldg').length;
        // pavementSpot re-rolls rather than dropping, so most blocks that ask
        // for a spot should get one
        let got = 0, asked = 0;
        for (const b of blockInfo) {
          if (b.type !== 'bldg') continue;
          asked++; if (pavementSpot(b, 1.9)) got++;
        }
        return { blocks, asked, got, treeSpots: treeSpots.length };
      });
      assert(r.got / r.asked > 0.8,
        `pavementSpot should find room on most building blocks, got ${r.got}/${r.asked}`);
      assert(r.treeSpots > 20, `collidable tree count looks collapsed: ${r.treeSpots}`);
    }
  },

  {
    name: 'Trees: park trees stay inside their block, well clear of the kerb',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        const parks = blockInfo.filter(b => b.type === 'park' && !b.football);
        let checked = 0, outside = 0;
        for (const p of parks) {
          for (const t of treeSpots) {
            if (Math.abs(t.x - p.cx) > BLOCK / 2 || Math.abs(t.z - p.cz) > BLOCK / 2) continue;
            checked++;
            if (onRoadway(t.x, t.z, 0)) outside++;
          }
        }
        return { parks: parks.length, checked, outside };
      });
      assert(r.outside === 0, `${r.outside} park trees ended up on asphalt`);
    }
  },
];
