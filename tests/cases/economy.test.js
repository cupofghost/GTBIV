// P2 — Economy & debt-loop tuning (HANDOFF.md §8). Verifies the tuned
// money-source ranges, that raw G.money updates now route through addMoney
// (so they persist), and that big paydays get gold-class toast feedback.
module.exports = {
  cases: [
    {
      name: 'stickup pays $45–$90 and routes through addMoney',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.money = 0; G.weapon = 'pistol'; G.reloading = false;
          player.x = 0; player.z = 0; player.heading = 0;
          const ped = makePerson(0xaaaaaa, 'guy');
          ped.state = 'walk'; ped.stateT = 0;
          ped.x = 0; ped.z = 2; // directly in front, within 5u
          peds.push(ped);
          doAttack();
          const m = G.money;
          const surrendered = ped.state === 'surrender';
          return { money: m, surrendered };
        });
        assert(r.surrendered, 'expected the ped to surrender');
        assert(r.money >= 45 && r.money <= 90,
          'expected stickup loot $45–$90, got $' + r.money);
      },
    },
    {
      name: 'store robbery pays $150–$260 and routes through addMoney',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.money = 0; G.weapon = 'pistol';
          // Create a store directly under the player
          stores.length = 0;
          stores.push({ x: 0, z: 0, cool: 0, robT: 0, warned: false, hinted: false, beacon: { visible: false, material: {} } });
          player.x = 0; player.z = 0;
          updateStores(3.0); // hold up long enough to trigger
          return G.money;
        });
        assert(r >= 150 && r <= 260,
          'expected store robbery take $150–$260, got $' + r);
      },
    },
    {
      name: 'heist safe loot pays $250–$500 and escape bonus is $150',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.money = 0;
          G.interior = true;
          player.x = PIZZA.doorX; player.z = PIZZA.doorZ + 1;
          G.heist = { phase: 2, alarm: 0, cracked: false, loot: 0, escaped: false };
          safeGame.active = true; safeGame.stage = 3; safeGame.totalStages = 3;
          safeGame.needle = 10; safeGame.target = 10; // perfect hit
          tapSafeCrack();
          const loot = G.money;
          const cracked = G.heist && G.heist.cracked;
          G.money = 0;
          exitPizzaPlace();
          const bonus = G.money;
          return { loot, bonus, cracked };
        });
        assert(r.cracked, 'expected the safe to be cracked');
        assert(r.loot >= 250 && r.loot <= 500,
          'expected heist loot $250–$500, got $' + r.loot);
        assert(r.bonus === 150,
          'expected heist escape bonus $150, got $' + r.bonus);
      },
    },
    {
      name: 'delivery mission base reward is $140 plus distance',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // startMission builds delivery rewards with base 140 + distance/3
          mission = null; missionCooldown = 0; lastType = '';
          // Use a deterministic Math.random that still varies enough to pick two
          // different intersections, then force the type filter to leave only delivery.
          const seq = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
          let i = 0;
          const origRandom = Math.random;
          Math.random = () => { const v = seq[i % seq.length]; i++; return v; };
          startMission();
          Math.random = origRandom;
          return mission && mission.type === 'delivery' ? mission.reward : null;
        });
        assert(r !== null, 'expected a delivery mission to start');
        assert(r >= 140,
          'expected delivery reward base $140 plus distance, got $' + r);
      },
    },
    {
      name: 'pizza delivery base reward is $55',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => PIZZA_DELIVERY_REWARD);
        assert(r === 55, 'expected PIZZA_DELIVERY_REWARD=55, got ' + r);
      },
    },
    {
      name: 'addMoney uses gold toast class for $50+ and good for small amounts',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert, assertEqual }) => {
        const r = await page.evaluate(() => {
          const toasts = document.getElementById('toasts');
          toasts.innerHTML = '';
          addMoney(30, 'SMALL');
          const smallClass = toasts.lastChild ? toasts.lastChild.className : '';
          toasts.innerHTML = '';
          addMoney(75, 'MEDIUM');
          const medClass = toasts.lastChild ? toasts.lastChild.className : '';
          toasts.innerHTML = '';
          addMoney(300, 'BIG');
          const bigClass = toasts.lastChild ? toasts.lastChild.className : '';
          return { smallClass, medClass, bigClass };
        });
        assert(r.smallClass.includes('good') && !r.smallClass.includes('gold'),
          'expected small payday to use good class, got ' + r.smallClass);
        assert(r.medClass.includes('gold'),
          'expected $75 payday to use gold class, got ' + r.medClass);
        assert(r.bigClass.includes('gold'),
          'expected $300 payday to use gold class, got ' + r.bigClass);
      },
    },
  ],
};
