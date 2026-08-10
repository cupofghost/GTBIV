// PV4 — "Make the beach go down into the water on the edge of the map. like
// real life."
//
// The dunes used to be the last word: sand rose to the mesh edge and the ocean
// was a flat plane butted against a wall of beach. The shore now descends
// through the waterline to a sea floor.
//
// This touches groundH, which TERRAIN.md treats as a settled contract, so these
// cases guard the two things that killed the previous local-elevation attempt:
// a discontinuity in the field, and the drawn mesh disagreeing with it.

const WATER_Y = -0.34;   // the sea plane (index.html: water.position.y)

module.exports = [
  {
    name: 'Shore: the beach descends continuously through the waterline',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      // groundH measures distance from the centre as max(|x|,|z|) — a SQUARE
      // metric, matching the square city and its square beach ring. Probing
      // along a radial ray would leave the 45deg direction never reaching the
      // shelf at all, so walk outward in that same metric: pick a point on the
      // square of side 2m and step m outward.
      const r = await page.evaluate((WATER_Y) => {
        const probe = (edge, t) => {   // edge 0..3, t = -1..1 along that edge
          let cross = null, minH = 1e9, maxStep = 0, prev = null;
          for (let m = 320; m <= SHORE_END + 6; m += 0.25) {
            const off = t * m;
            const p = edge === 0 ? [m, off] : edge === 1 ? [-m, off]
                    : edge === 2 ? [off, m] : [off, -m];
            const h = groundH(p[0], p[1]);
            if (prev !== null) maxStep = Math.max(maxStep, Math.abs(h - prev));
            prev = h;
            if (cross === null && h < WATER_Y) cross = m;
            minH = Math.min(minH, h);
          }
          return { cross, minH, maxStep };
        };
        return {
          east: probe(0, 0), west: probe(1, 0.4), north: probe(2, -0.6), corner: probe(3, 0.95),
          seaFloor: SEA_FLOOR, shoreStart: SHORE_START, shoreEnd: SHORE_END,
        };
      }, WATER_Y);
      for (const [name, p] of Object.entries({ east: r.east, west: r.west, north: r.north, corner: r.corner })) {
        assert(p.cross !== null, `${name}: walking out to sea should cross the waterline`);
        assert(p.minH <= r.seaFloor + 0.05,
          `${name}: the shelf should reach the sea floor (got ${p.minH.toFixed(2)}, want ${r.seaFloor})`);
        assert(p.maxStep < 0.12,
          `${name}: the descent must be continuous — biggest step was ${p.maxStep.toFixed(3)}u`);
      }
    }
  },

  {
    name: 'Shore: the slope stays inside the terrain grade budget',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      // Again in the square metric, and only over the shelf band itself —
      // sampling radially would pick up the signature hills inside the city
      // and report them as beach grade.
      const r = await page.evaluate(() => {
        let worst = 0, at = 0;
        for (let edge = 0; edge < 4; edge++) {
          for (let t = -1; t <= 1; t += 0.05) {
            for (let m = SHORE_START - 6; m <= SHORE_END; m += 0.5) {
              const pt = (mm) => {
                const off = t * mm;
                return edge === 0 ? [mm, off] : edge === 1 ? [-mm, off]
                     : edge === 2 ? [off, mm] : [off, -mm];
              };
              const a = pt(m), b = pt(m + 0.5);
              const step = Math.hypot(b[0] - a[0], b[1] - a[1]);
              const g = Math.abs(groundH(b[0], b[1]) - groundH(a[0], a[1])) / step;
              if (g > worst) { worst = g; at = m; }
            }
          }
        }
        return { deg: Math.atan(worst) * 180 / Math.PI, at };
      });
      // TERRAIN.md's drivable/walkable cap is 12 degrees for streets; a beach
      // may be a touch steeper but must stay somewhere a person can walk.
      // The steepest point is the beach face right at the waterline. 25.7deg
      // before the run was lengthened; a shelf you can walk down now.
      assert(r.deg < 18, `the shore should stay walkable (${r.deg.toFixed(1)}deg at ${r.at.toFixed(0)}u)`);
    }
  },

  {
    name: 'Shore: the drawn sand still agrees with the field',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        const pos = sand.geometry.attributes.position;
        let worst = 0, n = 0;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i), z = pos.getZ(i), y = pos.getY(i);
          if (Math.max(Math.abs(x), Math.abs(z)) < WORLD.half - 20) continue;
          worst = Math.max(worst, Math.abs(y - (groundH(x, z) + sandOffset(x, z))));
          n++;
        }
        return { worst, n };
      });
      assert(r.n > 500, 'the sweep should cover the beach vertices');
      // This is the failure that killed the terraced-terrain version: the mesh
      // and the field disagreeing, so props seated on groundH sank into it.
      assert(r.worst < 0.01,
        `the sand mesh must track groundH exactly (worst ${r.worst.toFixed(4)}u over ${r.n} verts)`);
    }
  },

  {
    name: 'Shore: nothing inside the city moved',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        // the shelf term is gated on m > SHORE_START; prove no part of the city,
        // its roads or any building footprint reaches that far
        let maxCity = 0;
        for (const b of buildings)
          maxCity = Math.max(maxCity, Math.abs(b.minX), Math.abs(b.maxX), Math.abs(b.minZ), Math.abs(b.maxZ));
        const outerRoad = Math.max(...roadLines.map(Math.abs)) + ROAD / 2;
        return { maxCity, outerRoad, shoreStart: SHORE_START };
      });
      assert(r.maxCity < r.shoreStart,
        `no building may reach the shelf (furthest ${r.maxCity.toFixed(0)}, shelf starts ${r.shoreStart})`);
      assert(r.outerRoad < r.shoreStart,
        `no road may reach the shelf (outer kerb ${r.outerRoad}, shelf starts ${r.shoreStart})`);
    }
  },

  {
    name: 'Shore: there is a wadeable shallow strip before the game calls it swimming',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate((WATER_Y) => {
        let cross = null;
        for (let d = 320; d <= SHORE_END; d += 0.25)
          if (groundH(d, 0) < WATER_Y) { cross = d; break; }
        return { cross, waterR: WATER_R, depthAtWaterR: groundH(WATER_R, 0) };
      }, WATER_Y);
      assert(r.cross !== null, 'there should be a waterline');
      // The two boundaries do not have to coincide, but the ORDER matters. The
      // sand must go under BEFORE overWater() starts calling it swimming —
      // the gap is then a shallow strip you wade through, which is the point.
      // The other way round you would be "swimming" while stood on dry beach.
      assert(r.cross <= r.waterR,
        `the sand must go under before overWater() starts (waterline ${r.cross}, boundary ${r.waterR})`);
      assert(r.waterR - r.cross < 16,
        `the wading strip should be a strip, not a lagoon (${(r.waterR - r.cross).toFixed(1)}u)`);
      assert(r.depthAtWaterR < WATER_Y,
        'the ground should already be under water where overWater() starts');
    }
  },
];
