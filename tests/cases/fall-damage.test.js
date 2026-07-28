// OP2-G — lethal falls. A real unsupported drop of roughly 4x Turbo's own
// height onto solid ground should splat him into the existing WASTED flow;
// ordinary jumps, stairs/fire escapes, graded terrain, the parachute, and
// vehicle/respawn transitions must never be mistaken for one.
module.exports = {
  cases: [
    {
      name: 'a drop below the lethal fall threshold survives with no WASTED',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          DEV_STATE.god = false; G.mode = 'foot'; G.over = false; G.hp = 100;
          player.car = null; player.climb = null; player.bailing = false; player.stunT = 0;
          player.x = H + 100; player.z = H + 100;   // flat open ground past the city
          input.jx = 0; input.jy = 0; input.sprint = false;
          const ground = groundH(player.x, player.z);
          const th = turboHeight();
          player.y = ground + 3.0 * th; player.vy = 0; player.fallPeakY = null;
          let landed = false;
          for (let i = 0; i < 400 && !landed; i++) {
            updateFoot(0.05);
            landed = player.y <= ground + 0.001 && player.fallPeakY === null;
          }
          return { over: G.over, hp: G.hp, finalY: player.y, ground };
        });
        assert(r.over === false && r.hp === 100, 'a sub-threshold drop must not WASTE or damage Turbo: ' + JSON.stringify(r));
        assert(Math.abs(r.finalY - r.ground) < 0.01, 'the drop must actually land on the ground: ' + JSON.stringify(r));
      },
    },
    {
      name: 'a drop at or above the lethal fall threshold onto solid ground reliably WASTEs Turbo once',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          DEV_STATE.god = false; G.mode = 'foot'; G.over = false; G.hp = 100;
          player.car = null; player.climb = null; player.bailing = false; player.stunT = 0;
          player.x = H + 100; player.z = H + 100;
          input.jx = 0; input.jy = 0; input.sprint = false;
          const ground = groundH(player.x, player.z);
          const th = turboHeight();
          player.y = ground + 4.2 * th; player.vy = 0; player.fallPeakY = null;
          let landedFrame = -1;
          // G.over latches true until the real (wall-clock) respawn timer fires, so
          // just record the first frame it flips and prove it never un-flips early
          for (let i = 0; i < 60; i++) {
            updateFoot(0.05);
            if (G.over && landedFrame < 0) landedFrame = i;
            if (landedFrame >= 0 && !G.over) landedFrame = -2;   // flipped back off early: a bug
          }
          return { over: G.over, landedFrame, threshold: FALL_LETHAL_MULT, th };
        });
        assert(r.threshold === 4, 'documented lethal-fall multiplier must stay 4x: ' + JSON.stringify(r));
        assert(r.over === true && r.landedFrame >= 0,
          'a drop at/above 4x Turbo height onto solid ground must WASTE him exactly once: ' + JSON.stringify(r));
      },
    },
    {
      name: 'descending a real fire-escape/stair run never creates a false fall despite a large height change',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          DEV_STATE.god = false; G.mode = 'foot'; G.over = false; G.hp = 100;
          player.car = null; player.climb = null; player.bailing = false; player.stunT = 0;
          input.jx = 0; input.jy = 0; input.sprint = false;
          const run = STAIR_RUNS.reduce((best, x) => (x.topH - x.baseH) > (best.topH - best.baseH) ? x : best);
          const heightDrop = run.topH - run.baseH;
          const th = turboHeight();
          const N = 90;
          player.x = run.x + Math.sin(run.ang) * run.len;
          player.z = run.z + Math.cos(run.ang) * run.len;
          player.y = run.topH; player.vy = 0; player.fallPeakY = null;
          let wastedDuring = false;
          for (let i = 1; i <= N; i++) {
            const f = 1 - i / N;
            player.x = run.x + f * run.len * Math.sin(run.ang);
            player.z = run.z + f * run.len * Math.cos(run.ang);
            updateFoot(0.05);
            if (G.over) wastedDuring = true;
          }
          return { wastedDuring, heightDrop, lethal: 4 * th, endY: player.y, baseH: run.baseH };
        });
        assert(r.heightDrop >= r.lethal, 'test picked a run whose height change should exceed the lethal threshold: ' + JSON.stringify(r));
        assert(r.wastedDuring === false, 'descending stairs/a fire escape must never false-fire the fall death: ' + JSON.stringify(r));
        assert(Math.abs(r.endY - r.baseH) < 0.5, 'the descent must actually reach the base of the run: ' + JSON.stringify(r));
      },
    },
    {
      name: 'walking down a graded signature hill never creates a false fall despite the elevation loss',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          DEV_STATE.god = false; G.mode = 'foot'; G.over = false; G.hp = 100;
          player.car = null; player.climb = null; player.bailing = false; player.stunT = 0;
          input.jx = 0; input.jy = 0; input.sprint = false;
          const hill = SIGNATURE_HILLS[0];
          const th = turboHeight();
          player.x = hill.x; player.z = hill.z;
          player.y = groundH(player.x, player.z); player.vy = 0; player.fallPeakY = null;
          const peakY = player.y;
          const N = 140, span = hill.r + 20;
          let wastedDuring = false;
          for (let i = 1; i <= N; i++) {
            player.x = hill.x + (i / N) * span;
            updateFoot(0.05);
            if (G.over) wastedDuring = true;
          }
          const flatY = groundH(player.x, player.z);
          return { wastedDuring, drop: peakY - flatY, lethal: 4 * th };
        });
        assert(r.drop > 3, 'test should walk down a meaningful hill elevation loss: ' + JSON.stringify(r));
        assert(r.wastedDuring === false, 'walking down graded terrain must never false-fire the fall death: ' + JSON.stringify(r));
      },
    },
    {
      name: 'a full parachute descent from high altitude lands safely and clears the fall tracker',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          DEV_STATE.god = false; G.mode = 'foot'; G.over = false; G.hp = 100;
          player.car = null; player.climb = null; player.stunT = 0;
          input.jx = 0; input.jy = 0; input.sprint = false;
          player.x = H + 100; player.z = H + 100;
          const ground = groundH(player.x, player.z);
          player.bailing = true; player.chute = true; player.fallVX = 0; player.fallVZ = 0;
          player.y = ground + 80; player.vy = -1;
          let steps = 0;
          while (player.bailing && steps < 800) { updateFoot(0.05); steps++; }
          const overAfterChute = G.over;
          updateFoot(0.05);   // one more frame back on normal foot physics
          return { overAfterChute, overAfterOneMore: G.over, fallPeakYNull: player.fallPeakY == null, steps };
        });
        assert(r.overAfterChute === false, 'a chuted landing must not WASTE Turbo: ' + JSON.stringify(r));
        assert(r.overAfterOneMore === false && r.fallPeakYNull, 'the fall tracker must clear after a chute landing: ' + JSON.stringify(r));
      },
    },
    {
      name: 'vehicle exits and respawn always clear any in-progress fall tracker',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(async () => {
          DEV_STATE.god = false; G.mode = 'car'; G.over = false; G.hp = 100;
          const node = intersections[7];
          const car = makeCar('sedan', node.x, node.z, 0, { parked: true, driver: 'player' });
          player.car = car; player.fallPeakY = 999;   // simulate a fall in progress at the moment of exit
          exitCar();
          const clearedByExit = player.fallPeakY === null;
          G.mode = 'foot'; updateFoot(0.016);
          const overAfterExit = G.over;

          player.fallPeakY = 999; G.mode = 'car'; player.car = car; car.driver = 'player';
          exitCarSoft();
          const clearedBySoftExit = player.fallPeakY === null;

          player.fallPeakY = 999; G.over = false;
          respawn();
          await new Promise(resolve => setTimeout(resolve, 1900));
          const clearedByRespawn = player.fallPeakY === null;
          G.mode = 'foot'; updateFoot(0.016);
          const overAfterRespawn = G.over;
          return { clearedByExit, overAfterExit, clearedBySoftExit, clearedByRespawn, overAfterRespawn };
        });
        assert(r.clearedByExit && !r.overAfterExit, 'exitCar must clear the fall tracker and never false-fire: ' + JSON.stringify(r));
        assert(r.clearedBySoftExit, 'exitCarSoft must clear the fall tracker: ' + JSON.stringify(r));
        assert(r.clearedByRespawn && !r.overAfterRespawn, 'respawn must clear the fall tracker and never false-fire: ' + JSON.stringify(r));
      },
    },
  ],
};
