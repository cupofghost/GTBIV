// D7 — deterministic seed: ?seed=<n> reproduces the same RNG stream, city,
// and character appearance across the inline game and external modules.
module.exports = {
  cases: [
    {
      name: 'same seed reproduces the same first rand value and city snapshot across reloads',
      query: '?dev=1&skipintro=1&seed=123',
      start: false,
      run: async (page, { assert, assertEqual }) => {
        const first = await page.evaluate(() => ({
          rand: rand(0, 1),
          buildings: buildings.length,
          roadPoint: randomRoadPoint(),
          person: randomPersonSpec(0xabcdef),
          npcType: randomNPCType().build(),
        }));
        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(800);
        const second = await page.evaluate(() => ({
          rand: rand(0, 1),
          buildings: buildings.length,
          roadPoint: randomRoadPoint(),
          person: randomPersonSpec(0xabcdef),
          npcType: randomNPCType().build(),
        }));
        assertEqual(first.rand, second.rand, 'first rand mismatch across reloads');
        assertEqual(first.buildings, second.buildings, 'building count mismatch across reloads');
        assertEqual(JSON.stringify(first.roadPoint), JSON.stringify(second.roadPoint), 'randomRoadPoint mismatch across reloads');
        assertEqual(JSON.stringify(first.person), JSON.stringify(second.person), 'person module RNG mismatch across reloads');
        assertEqual(JSON.stringify(first.npcType), JSON.stringify(second.npcType), 'NPC type module RNG mismatch across reloads');
        assert(first.rand >= 0 && first.rand < 1, 'rand should be in [0,1)');
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
