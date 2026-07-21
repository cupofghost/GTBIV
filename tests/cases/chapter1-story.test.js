// Chapter 1 state machine — the engineering flags from CHAPTER1.md §7.
// These drive updateStory()/addHeat()/doPizzaJack() directly rather than
// waiting on real gameplay, since the thing under test is the trigger
// logic and its guards, not the 3D world.
module.exports = {
  cases: [
    {
      name: 'first_score cutscene fires once Chapter-1 earnings cross $200',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800; G.money = 250;
          updateStory(0.1);
          return { fired: !!activeCutscene, id: activeCutscene && activeCutscene.id, flag: G.story.firstScoreShown };
        });
        assert(r.fired && r.id === 'first_score', 'expected first_score to start, got ' + JSON.stringify(r));
        assert(r.flag === true, 'expected G.story.firstScoreShown to be set');
      },
    },
    {
      name: 'first_score does not re-fire once shown',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800; G.money = 250; G.story.firstScoreShown = true;
          updateStory(0.1);
          return { fired: !!activeCutscene };
        });
        assert(r.fired === false, 'first_score should not fire twice');
      },
    },
    {
      name: 'pizza_warning fires once pizzaHeat crosses 3 near Chaos Pizza HQ',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800; G.story.firstScoreShown = true;
          G.story.pizzaHeat = 3;
          player.x = CHAOS.x + 5; player.z = CHAOS.z + 5;
          updateStory(0.1);
          return { fired: !!activeCutscene, id: activeCutscene && activeCutscene.id, flag: G.story.pizzaWarned };
        });
        assert(r.fired && r.id === 'pizza_warning', 'expected pizza_warning to start, got ' + JSON.stringify(r));
        assert(r.flag === true, 'expected G.story.pizzaWarned to be set');
      },
    },
    {
      name: 'pizza_warning does not fire while player is far from Chaos Pizza HQ',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800; G.story.firstScoreShown = true;
          G.story.pizzaHeat = 10;
          player.x = CHAOS.x + 500; player.z = CHAOS.z + 500; // well outside the trigger radius
          updateStory(0.1);
          return { fired: !!activeCutscene };
        });
        assert(r.fired === false, 'pizza_warning should stay dormant far from Chaos Pizza turf');
      },
    },
    {
      name: 'pizza_warning is guarded off once Chaos Pizza HQ is already destroyed',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800; G.story.firstScoreShown = true;
          G.story.pizzaHeat = 10;
          CHAOS.exterior = null; // simulates Pizza Wars having destroyed the HQ
          player.x = CHAOS.x + 5; player.z = CHAOS.z + 5;
          updateStory(0.1);
          return { fired: !!activeCutscene, pizzaWarned: G.story.pizzaWarned };
        });
        assert(r.fired === false, 'pizza_warning must not fire once Chaos Pizza HQ is destroyed');
        assert(r.pizzaWarned === false, 'pizzaWarned should stay false when the cutscene never fired');
      },
    },
    {
      name: 'doPizzaJack increments pizzaHeat and uses the pizza_jack bark',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const car = makePizzaCar(player.x + 1, player.z, 0);
          car.pizzaState = 'delivering';
          car.pizzaDest = { x: player.x + 100, z: player.z + 100 };
          const heatBefore = G.story.pizzaHeat;
          doPizzaJack();
          return { heatBefore, heatAfter: G.story.pizzaHeat, mode: G.mode, activeDelivery: !!activeDelivery };
        });
        assert(r.heatAfter === r.heatBefore + 1, 'expected pizzaHeat to increment by exactly 1 per jack');
        assert(r.mode === 'car' && r.activeDelivery, 'expected the existing jack-and-deliver mechanic to still work');
      },
    },
    {
      name: 'Donna repeat-offense bark fires once pizzaHeat crosses 6 after being warned',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.story.pizzaWarned = true; G.story.pizzaHeat = 5;
          const car = makePizzaCar(player.x + 1, player.z, 0);
          car.pizzaState = 'delivering';
          car.pizzaDest = { x: player.x + 100, z: player.z + 100 };
          doPizzaJack();
          return { pizzaHeat: G.story.pizzaHeat, repeatWarned: G.story.pizzaRepeatWarned };
        });
        assert(r.pizzaHeat === 6, 'expected pizzaHeat to reach 6');
        assert(r.repeatWarned === true, 'expected pizzaRepeatWarned to flip once heat hits the repeat threshold');
      },
    },
    {
      name: 'Hardcastle bark fires exactly once, the first time a session hits 3 stars',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.heat = 0; G.stars = 0; G.story.hardcastleShown = false;
          addHeat(50); // crosses into 3 stars
          const first = { stars: G.stars, shown: G.story.hardcastleShown };
          G.heat = 0; G.stars = 0;
          addHeat(50); // crosses into 3 stars again, same session
          const second = { stars: G.stars, shown: G.story.hardcastleShown };
          return { first, second };
        });
        assert(r.first.stars === 3 && r.first.shown === true, 'expected the first 3-star crossing to set hardcastleShown');
        assert(r.second.stars === 3 && r.second.shown === true, 'expected the flag to stay set (no re-fire) on a later crossing');
      },
    },
    {
      name: 'the $800 payoff still fires once earnings/heat milestones are already past',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        // Realistic ordering: by the time a player has $800, they will have
        // already crossed the $200 first_score checkpoint on an earlier frame.
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800; G.money = 800; G.story.firstScoreShown = true;
          player.x = deb.x + 1; player.z = deb.z;
          updateStory(0.1);
          let n = 0; while (activeCutscene && n < 4000) { updateCutscene(0.02); n++; }
          return { paidOff: G.story.paidOff, money: G.money, debt: G.story.debt };
        });
        assert(r.paidOff === true, 'expected the debt to be paid off');
        assert(r.money === 0 && r.debt === 0, 'expected the $800 to be deducted and the debt cleared');
      },
    },
  ],
};
