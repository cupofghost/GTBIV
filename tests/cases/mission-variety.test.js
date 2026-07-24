// P1 — mission variety & soft progression (HANDOFF.md §8). Three new
// mission types (courier/takedown/getaway) unlock as G.missionsDone climbs,
// and completed missions pay a bit more at higher tiers. Exercises the
// unlock gating, each new type's win path, and the busted()/heat interplay
// for the two heat-driven types.
module.exports = {
  cases: [
    {
      name: 'no new mission types leak in before missionsDone reaches the tier-1 threshold',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.missionsDone = 0;
          const seen = new Set();
          for (let i = 0; i < 40; i++) {
            mission = null; missionCooldown = 0; lastType = '';
            startMission();
            if (mission) seen.add(mission.type);
          }
          return [...seen].sort();
        });
        assert(!r.includes('courier') && !r.includes('takedown') && !r.includes('getaway'),
          'expected no tiered mission types at missionsDone=0, got: ' + r.join(','));
      },
    },
    {
      name: 'courier and takedown unlock at tier 1, getaway stays locked',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.missionsDone = 5; // tier 1
          const seen = new Set();
          for (let i = 0; i < 60 && !(seen.has('courier') && seen.has('takedown')); i++) {
            mission = null; missionCooldown = 0; lastType = '';
            startMission();
            if (mission) seen.add(mission.type);
          }
          return [...seen].sort();
        });
        assert(r.includes('courier'), 'expected courier to unlock at tier 1, saw: ' + r.join(','));
        assert(r.includes('takedown'), 'expected takedown to unlock at tier 1, saw: ' + r.join(','));
        assert(!r.includes('getaway'), 'getaway should still be locked at tier 1, saw: ' + r.join(','));
      },
    },
    {
      name: 'getaway unlocks at tier 2',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.missionsDone = 15; // tier 2
          const seen = new Set();
          for (let i = 0; i < 60 && !seen.has('getaway'); i++) {
            mission = null; missionCooldown = 0; lastType = '';
            startMission();
            if (mission) seen.add(mission.type);
          }
          return [...seen].sort();
        });
        assert(r.includes('getaway'), 'expected getaway to unlock at tier 2, saw: ' + r.join(','));
      },
    },
    {
      name: 'completeMission pays a tiered bonus on top of the base reward',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.missionsDone = 0; G.money = 0;
          mission = { type: 'delivery', reward: 100 };
          completeMission(0);
          const tier0 = G.money;
          G.missionsDone = 10; G.money = 0; // tier 2
          mission = { type: 'delivery', reward: 100 };
          completeMission(0);
          const tier2 = G.money;
          return { tier0, tier2 };
        });
        assert(r.tier0 === 100, 'expected the base $100 reward at tier 0, got ' + r.tier0);
        assert(r.tier2 === 130, 'expected a +30% tiered bonus at tier 2 ($130), got ' + r.tier2);
      },
    },
    {
      name: 'takedown mission completes once the flagged car is destroyed',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const car = traffic[0];
          mission = { type: 'takedown', car, timer: 50, reward: 260 };
          G.money = 0;
          car.dead = true;
          updateMission(0.1);
          return { missionGone: mission === null, money: G.money };
        });
        assert(r.missionGone, 'expected the takedown mission to complete once the car is dead');
        assert(r.money === 260, 'expected the full $260 reward at tier 0, got ' + r.money);
      },
    },
    {
      name: 'takedown mission fails on timeout while the car survives',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const car = traffic[0];
          car.dead = false;
          mission = { type: 'takedown', car, timer: 0.05, reward: 260 };
          updateMission(0.1);
          return mission === null;
        });
        assert(r, 'expected the takedown mission to fail once its timer runs out');
      },
    },
    {
      name: 'courier mission raises the wanted heat once the package is picked up',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const a = { x: 10, z: 10 }, b = { x: 200, z: 200 };
          mission = { type: 'courier', stage: 0, a, b, timer: 0, reward: 200 };
          player.x = a.x; player.z = a.z;
          G.heat = 0;
          updateMission(0.1);
          return { stage: mission.stage, heat: G.heat };
        });
        assert(r.stage === 1, 'expected the courier mission to advance to the drop-off stage');
        assert(r.heat >= 40, 'expected picking up the hot package to raise heat to at least 40, got ' + r.heat);
      },
    },
    {
      name: 'getaway mission completes on reaching the safehouse, with a time-remaining bonus',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const a = { x: 30, z: 30 };
          mission = { type: 'getaway', a, timer: 40, reward: 320 };
          player.x = a.x; player.z = a.z;
          G.money = 0; G.missionsDone = 0;
          updateMission(0.1);
          return { missionGone: mission === null, money: G.money };
        });
        assert(r.missionGone, 'expected the getaway mission to complete on reaching the safehouse');
        assert(r.money > 320, 'expected the base reward plus a time-remaining bonus, got ' + r.money);
      },
    },
    {
      name: 'busted() fails an in-progress courier mission like it already does for heat',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        // one fresh page per busted() call: respawn() latches G.over=true for
        // 1.8s (its teleport delay), so a second synchronous busted() in the
        // same tick would no-op on the guard — not what's under test here.
        const r = await page.evaluate(() => {
          mission = { type: 'courier', stage: 1, a: { x: 0, z: 0 }, b: { x: 10, z: 10 }, timer: 20, reward: 200 };
          busted();
          return mission === null;
        });
        assert(r, 'expected busted() to fail an in-progress courier mission');
      },
    },
    {
      name: 'busted() fails an in-progress getaway mission like it already does for heat',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          mission = { type: 'getaway', a: { x: 0, z: 0 }, timer: 20, reward: 320 };
          busted();
          return mission === null;
        });
        assert(r, 'expected busted() to fail an in-progress getaway mission');
      },
    },
  ],
};
