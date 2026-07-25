// D7 — deterministic seed: ?seed=<n> reproduces the same RNG stream, city,
// and character appearance across the inline game and external modules.
module.exports = {
  cases: [
    {
      name: 'same seed reproduces the city snapshot and shared character-module RNG',
      query: '?dev=1&skipintro=1&seed=123',
      start: false,
      run: async (page, { assert, assertEqual }) => {
        const first = await page.evaluate(() => ({
          buildings: buildings.map(b => [b.minX, b.maxX, b.minZ, b.maxZ, b.h, b.baseY]),
          manholes: MANHOLE_SPOTS.map(p => [p.x, p.z]),
          trees: treeSpots.map(p => [p.x, p.z]),
        }));
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(800);
        const second = await page.evaluate(() => ({
          buildings: buildings.map(b => [b.minX, b.maxX, b.minZ, b.maxZ, b.h, b.baseY]),
          manholes: MANHOLE_SPOTS.map(p => [p.x, p.z]),
          trees: treeSpots.map(p => [p.x, p.z]),
        }));
        assertEqual(JSON.stringify(first), JSON.stringify(second), 'seeded city snapshot mismatch across reloads');

        const modules = await page.evaluate(() => {
          const original = window.GTB_RNG;
          const sample = () => {
            let state = 123;
            window.GTB_RNG = () => {
              let t = state += 0x6D2B79F5;
              t = Math.imul(t ^ (t >>> 15), t | 1);
              t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
              return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
            return {
              person: randomPersonSpec(0xabcdef),
              npcType: randomNPCType().build(),
            };
          };
          try { return [sample(), sample()]; }
          finally { window.GTB_RNG = original; }
        });
        assertEqual(JSON.stringify(modules[0]), JSON.stringify(modules[1]), 'character modules should share the seeded RNG');
      },
    },
    {
      name: 'different seeds produce different first rand values',
      query: '?dev=1&skipintro=1&seed=123',
      start: false,
      run: async (page, { assert }) => {
        const v123 = await page.evaluate(() => rand(0, 1));
        await page.goto(page.url().replace('seed=123', 'seed=456'), { waitUntil: 'load' });
        await page.waitForTimeout(800);
        const v456 = await page.evaluate(() => rand(0, 1));
        assert(v123 !== v456, 'expected different seeds to produce different first rand values');
      },
    },
    {
      name: 'no seed leaves RNG on Math.random (first rand values differ across reloads)',
      query: '?dev=1&skipintro=1',
      start: false,
      run: async (page, { assert }) => {
        const first = await page.evaluate(() => rand(0, 1));
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(800);
        const second = await page.evaluate(() => rand(0, 1));
        assert(first !== second, 'expected unseeded reloads to produce different first rand values');
      },
    },
  ],
};
