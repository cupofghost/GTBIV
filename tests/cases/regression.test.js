// Broad, shallow coverage of the systems most likely to break silently
// when unrelated code changes: the side-mission pool, the wanted/star
// escalation, and the pizza-jack mechanic. Not exhaustive — this is a
// tripwire suite, not a physics/rendering test.
module.exports = {
  cases: [
    {
      name: 'startMission() can produce all five mission types without throwing',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const seen = new Set();
          for (let i = 0; i < 30 && seen.size < 5; i++) {
            mission = null; missionCooldown = 0; lastType = '';
            startMission();
            if (mission) seen.add(mission.type);
          }
          return [...seen].sort();
        });
        assert(r.length === 5, 'expected to observe all 5 mission types (delivery/style/checkpoints/rampage/heat), got: ' + r.join(','));
      },
    },
    {
      name: 'addHeat escalates stars 0 through 5 and clearHeat resets them',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.heat = 0; G.stars = 0;
          addHeat(100); // max out heat -> should reach 5 stars
          const maxed = G.stars;
          clearHeat(false);
          const cleared = { heat: G.heat, stars: G.stars };
          return { maxed, cleared };
        });
        assert(r.maxed === 5, 'expected addHeat(100) to reach 5 stars, got ' + r.maxed);
        assert(r.cleared.heat === 0 && r.cleared.stars === 0, 'expected clearHeat to zero both heat and stars');
      },
    },
    {
      name: 'jacking a pizza delivery car still hands the player the delivery',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const car = makePizzaCar(player.x + 1, player.z, 0);
          car.pizzaState = 'delivering';
          car.pizzaDest = { x: player.x + 50, z: player.z + 50 };
          doPizzaJack();
          return { mode: G.mode, hasDelivery: !!activeDelivery, carHP: G.carHP };
        });
        assert(r.mode === 'car', 'expected G.mode to switch to car after jacking');
        assert(r.hasDelivery, 'expected activeDelivery to be set');
        assert(r.carHP > 0, 'expected G.carHP to be populated from the jacked car');
      },
    },
    {
      name: 'Deb\'s intro lecture sets the $800 debt after her 3rd line',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; // skip straight to her lecture, past the confrontation trigger
          player.x = deb.x + 2; player.z = deb.z; // stay within earshot (d<8) the whole time
          let ticks = 0;
          while (G.story.debt === 0 && ticks < 2000) { updateStory(0.1); ticks++; }
          return { debt: G.story.debt, lineIdx: deb.lineIdx, ticks };
        });
        assert(r.lineIdx === 3, 'expected all 3 of Deb\'s locked lines to have played, got lineIdx=' + r.lineIdx);
        assert(r.debt === 800, 'expected the debt to be set to exactly $800, got ' + r.debt);
      },
    },
    {
      name: 'Turbo can jump while standing on elevated terrain',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const hill = SIGNATURE_HILLS[0];
          player.x = hill.x; player.z = hill.z; player.y = groundH(hill.x, hill.z); player.vy = 0;
          player.car = null; G.mode = 'foot'; player.climb = null;
          const before = { y: player.y, vy: player.vy };
          doJump();
          return { beforeY: before.y, afterY: player.y, afterVy: player.vy, hillH: before.y };
        });
        assert(r.hillH > 1, 'expected a signature hill to be elevated, got ' + r.hillH.toFixed(2));
        assert(r.afterVy > 0, 'expected doJump() to give vertical velocity on a hill, got vy=' + r.afterVy);
        assert(r.afterY > r.beforeY, 'expected Turbo to leave the ground, y before=' + r.beforeY.toFixed(2) + ' after=' + r.afterY.toFixed(2));
      },
    },
    {
      name: 'jocks are killable with fists',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // spawn a jock directly in front of Turbo and punch repeatedly
          const j = spawnJock(player.x, player.z + 0.4);
          const startHp = j.hp;
          G.mode = 'foot'; G.weapon = 'fists'; G.started = true; G.over = false; player.punchT = 0;
          let punches = 0;
          while (j.state !== 'down' && punches < 10) {
            player.x = j.x; player.z = j.z - 0.4;
            player.heading = Math.atan2(j.x - player.x, j.z - player.z);
            player.punchT = 0;
            doPunch(false);
            punches++;
          }
          return { startHp, endHp: j.hp, state: j.state, punches };
        });
        assert(r.startHp > 0, 'expected spawned jock to have positive HP');
        assert(r.state === 'down', 'expected jock to be knocked down, got state=' + r.state + ' after ' + r.punches + ' punches, hp=' + r.endHp);
      },
    },
    {
      name: 'foot cops are killable with fists',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const fc = makeCopPerson(player.x, player.z + 0.4);
          footCops.push(fc);
          const startHp = fc.hp;
          G.mode = 'foot'; G.weapon = 'fists'; G.started = true; G.over = false; player.punchT = 0;
          let punches = 0;
          while (fc.state !== 'down' && punches < 10) {
            player.x = fc.x; player.z = fc.z - 0.4;
            player.heading = Math.atan2(fc.x - player.x, fc.z - player.z);
            player.punchT = 0;
            doPunch(false);
            punches++;
          }
          return { startHp, endHp: fc.hp, state: fc.state, punches };
        });
        assert(r.startHp > 0, 'expected spawned cop to have positive HP');
        assert(r.state === 'down', 'expected foot cop to be knocked down, got state=' + r.state + ' after ' + r.punches + ' punches');
      },
    },
  ],
};
