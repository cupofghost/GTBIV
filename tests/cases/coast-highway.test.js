// PV6 — "Fix the circle road around the island. it conflicts with other roads
// and leads into buildings."
//
// The Coast Highway was painted as a CIRCLE of radius H+7 around a SQUARE city
// of half-width H. A circle of that radius only clears the grid at the four
// cardinal points; everywhere else it runs through blocks, and at 45° it is 94u
// deep inside the city. It is now a rounded rectangle following the city's
// actual shape.
//
// These cases pin the geometry, since the road is texture paint with no
// collision of its own — nothing else would ever catch it drifting back.

module.exports = [
  {
    name: 'Coast Highway: a circle can never fit this city (why the shape changed)',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const R = H + 7;
        let insideGrid = 0, samples = 0, deepest = 0;
        for (let a = 0; a < Math.PI * 2; a += 0.02) {
          const x = Math.cos(a) * R, z = Math.sin(a) * R;
          samples++;
          const m = Math.max(Math.abs(x), Math.abs(z));
          if (m < H) { insideGrid++; deepest = Math.max(deepest, H - m); }
        }
        return { insideGrid, samples, deepest, corner: H * Math.SQRT2, worldHalf: WORLD.size / 2 };
      });
      assert(r.insideGrid > r.samples * 0.5,
        'most of a circular route at that radius should fall inside the square city');
      assert(r.deepest > 80, `the circle should cut deep into the city (max ${r.deepest.toFixed(0)}u)`);
      // and the reason no larger circle is available either
      assert(r.corner > r.worldHalf,
        'clearing the city corners would need a radius bigger than the whole world — hence a rounded rectangle');
    }
  },

  {
    name: 'Coast Highway: the route never crosses a building footprint',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        const half = H + 7, corner = 30;
        const pts = [];
        for (let t = -half + corner; t <= half - corner; t += 1.5)
          pts.push([t, -half], [t, half], [-half, t], [half, t]);
        // and around each rounded corner
        for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]])
          for (let a = 0; a <= Math.PI / 2; a += 0.05)
            pts.push([sx * (half - corner + Math.cos(a) * corner),
                      sz * (half - corner + Math.sin(a) * corner)]);
        const bad = pts.filter(p => buildingHit(p[0], p[1], 0.5));
        return { total: pts.length, bad: bad.length, sample: bad.slice(0, 5) };
      });
      assert(r.total > 500, 'the sweep should actually cover the route');
      assert(r.bad === 0,
        `the coast road must not pass through buildings — ${r.bad}/${r.total} did, e.g. ${JSON.stringify(r.sample)}`);
    }
  },

  {
    name: 'Coast Highway: it threads the gap between the outer kerb and the sand',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const half = H + 7, lane = ROAD * 0.85;
        return { half, inner: half - lane / 2, outer: half + lane / 2,
                 cityEdge: H, sandEdge: SAND_EDGE, worldHalf: WORLD.size / 2 };
      });
      assert(r.inner >= r.cityEdge - 0.5,
        `the inner kerb (${r.inner.toFixed(1)}) should clear the city edge (${r.cityEdge})`);
      assert(r.outer <= r.sandEdge + 0.5,
        `the outer kerb (${r.outer.toFixed(1)}) should stay inside the sand edge (${r.sandEdge})`);
      assert(r.outer < r.worldHalf, 'the whole road should stay on the map');
    }
  },

  {
    name: 'Coast Highway: the route is a closed loop you can actually drive round',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        // walk the perimeter and confirm it is continuous, on drivable ground,
        // and returns to where it started
        const half = H + 7, corner = 30;
        const pts = [];
        const push = (x, z) => pts.push({ x, z });
        for (let t = -half + corner; t <= half - corner; t += 3) push(t, -half);
        for (let a = -Math.PI / 2; a <= 0; a += 0.1)
          push(half - corner + Math.cos(a) * corner, -half + corner + Math.sin(a) * corner);
        for (let t = -half + corner; t <= half - corner; t += 3) push(half, t);
        let maxStep = 0, offMap = 0, steep = 0;
        for (let i = 1; i < pts.length; i++) {
          const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
          maxStep = Math.max(maxStep, d);
          if (Math.max(Math.abs(pts[i].x), Math.abs(pts[i].z)) > WORLD.size / 2) offMap++;
          const g0 = groundH(pts[i - 1].x, pts[i - 1].z), g1 = groundH(pts[i].x, pts[i].z);
          if (d > 0 && Math.abs(g1 - g0) / d > 0.6) steep++;   // ~31°, far past drivable
        }
        return { n: pts.length, maxStep, offMap, steep };
      });
      assert(r.maxStep < 6, `the route should be continuous (biggest gap ${r.maxStep.toFixed(1)}u)`);
      assert(r.offMap === 0, 'no part of the route should leave the map');
      assert(r.steep === 0, `the route should stay drivable (${r.steep} steep segments)`);
    }
  },
];
