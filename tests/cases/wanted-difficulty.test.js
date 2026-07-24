// P3 — wanted-system difficulty (HANDOFF.md §8). Easy/Normal/Hard scales
// cop spawn pressure, detection range, and damage taken; persisted in
// SETTINGS like every other option. The underlying escalation/HUD-hint
// logic (star thresholds, "THEY SEE YOU"/"CLEAR"/"HIDDEN" states) predates
// this card and is already covered by regression.test.js's addHeat case —
// these cases are scoped to what P3 actually added.
module.exports = {
  cases: [
    {
      name: 'difficulty defaults to normal on a fresh boot',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => SETTINGS.difficulty);
        assert(r === 'normal', 'expected default difficulty of normal, got ' + r);
      },
    },
    {
      name: 'wantedCount scales with difficulty at the same star level',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.stars = 3;
          SETTINGS.difficulty = 'easy'; const easy = wantedCount();
          SETTINGS.difficulty = 'normal'; const normal = wantedCount();
          SETTINGS.difficulty = 'hard'; const hard = wantedCount();
          SETTINGS.difficulty = 'normal';
          return { easy, normal, hard };
        });
        assert(r.easy < r.normal, 'expected easy to spawn fewer cops than normal, got ' + JSON.stringify(r));
        assert(r.hard > r.normal, 'expected hard to spawn more cops than normal, got ' + JSON.stringify(r));
      },
    },
    {
      name: 'wantedCount is capped at 8 even at 5 stars on hard',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.stars = 5; SETTINGS.difficulty = 'hard';
          const w = wantedCount();
          SETTINGS.difficulty = 'normal';
          return w;
        });
        assert(r <= 8, 'expected wantedCount to stay capped at 8 regardless of difficulty, got ' + r);
      },
    },
    {
      name: 'wantedCount is 0 with zero stars regardless of difficulty',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.stars = 0; SETTINGS.difficulty = 'hard';
          const w = wantedCount();
          SETTINGS.difficulty = 'normal';
          return w;
        });
        assert(r === 0, 'expected wantedCount to stay 0 at zero stars, got ' + r);
      },
    },
    {
      name: 'damagePlayer scales HP loss by difficulty',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          DEV_STATE.god = false;
          SETTINGS.difficulty = 'easy'; G.hp = 100; damagePlayer(20); const easyHp = G.hp;
          SETTINGS.difficulty = 'normal'; G.hp = 100; damagePlayer(20); const normalHp = G.hp;
          SETTINGS.difficulty = 'hard'; G.hp = 100; damagePlayer(20); const hardHp = G.hp;
          SETTINGS.difficulty = 'normal'; G.hp = 100;
          return { easyHp, normalHp, hardHp };
        });
        assert(r.easyHp > r.normalHp, 'expected easy to take less damage than normal, got ' + JSON.stringify(r));
        assert(r.hardHp < r.normalHp, 'expected hard to take more damage than normal, got ' + JSON.stringify(r));
      },
    },
    {
      name: 'hard mode spots the player from farther away than normal',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.stars = 3;
          // stub out line-of-sight so this only tests the aggro-range math,
          // not whether the test's chosen coordinates happen to clear a
          // building on the procedurally-laid-out map
          const origLos = losClear; losClear = () => true;
          const cop = makeCar('cop', player.x + 75, player.z, 0, { driver: 'cop' });
          cops.push(cop);
          SETTINGS.difficulty = 'normal';
          updateWanted(0.1);
          const seenNormal = $('heatHint').textContent.includes('THEY SEE YOU');
          G.escapeT = 0; G.hiddenT = 0;
          SETTINGS.difficulty = 'hard';
          updateWanted(0.1);
          const seenHard = $('heatHint').textContent.includes('THEY SEE YOU');
          SETTINGS.difficulty = 'normal'; G.stars = 0; losClear = origLos;
          return { seenNormal, seenHard };
        });
        assert(!r.seenNormal, 'expected the cop at 75m to be out of normal-difficulty detection range, got seen=' + r.seenNormal);
        assert(r.seenHard, 'expected the same cop at 75m to spot the player on hard difficulty, got seen=' + r.seenHard);
      },
    },
    {
      name: 'difficulty persists across a reload like the other settings',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const before = await page.evaluate(() => {
          setDifficulty('hard');
          return JSON.parse(localStorage.getItem('gtb4.settings')).difficulty;
        });
        assert(before === 'hard', 'expected hard written to localStorage after setDifficulty, got ' + before);
        await page.reload();
        await page.waitForFunction(() => typeof SETTINGS !== 'undefined');
        const after = await page.evaluate(() => SETTINGS.difficulty);
        assert(after === 'hard', 'expected difficulty to survive reload, got ' + after);
      },
    },
  ],
};
