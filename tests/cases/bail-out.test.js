// PV8 — action-movie bail-out.
//
// "When turbo bails out of cars while they're driving he needs to come flying
//  out the side and roll on the ground for a bit. like an action movie."
//
// The two things that matter are that it always ENDS — standing, controllable,
// not inside geometry — and that the slow step-out is untouched.

// Put Turbo behind the wheel on a clear stretch of road, pointed down it, so a
// bail has somewhere to land that isn't the inside of a building.
function seatInCar(page, speed) {
  return page.evaluate((speed) => {
    const node = intersections[24];
    player.x = node.x; player.z = node.z;
    const c = makeCar('sports', node.x, node.z, 0, {});
    c.driver = 'player'; player.car = c; G.mode = 'car';
    player.mesh.visible = false;
    c.speed = speed;
    c.vel.set(Math.sin(c.heading) * speed, 0, Math.cos(c.heading) * speed);
    return { x: c.x, z: c.z, heading: c.heading, speed: c.speed };
  }, speed);
}

module.exports = [
  {
    name: 'Bail-out: exiting a parked car is still a clean step-out',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await seatInCar(page, 0);
      const r = await page.evaluate(() => {
        exitCar();
        return { dive: !!player.dive, mode: G.mode, visible: player.mesh.visible,
                 y: player.y, ground: groundH(player.x, player.z) };
      });
      assert(r.dive === false, 'a stationary exit must not launch a dive');
      assert(r.mode === 'foot', 'exiting should put Turbo on foot');
      assert(r.visible === true, 'Turbo should be visible again');
      assert(Math.abs(r.y - r.ground) < 0.01, 'a clean step-out should land him on the ground');
    }
  },

  {
    name: 'Bail-out: exiting at speed throws him out the side with the car\'s momentum',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const car = await seatInCar(page, 30);
      const r = await page.evaluate(() => {
        exitCar();
        const d = player.dive;
        return {
          dive: !!d, phase: d && d.phase, vy: d && d.vy,
          speed: d && Math.hypot(d.vx, d.vz),
          px: player.x, pz: player.z, py: player.y,
          ground: groundH(player.x, player.z),
        };
      });
      assert(r.dive === true, 'exiting at 30 m/s should start a dive');
      assert(r.phase === 'air', 'the dive should start airborne');
      assert(r.vy > 2, `he should be launched upward (got vy ${r.vy})`);
      assert(r.speed > 15, `the dive should inherit the car's momentum (got ${r.speed})`);
      assert(r.py > r.ground, 'he should start above the ground');
    }
  },

  {
    name: 'Bail-out: the tumble always ends standing and controllable',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await seatInCar(page, 34);
      const r = await page.evaluate(() => {
        exitCar();
        let frames = 0, sawRoll = false;
        while (player.dive && frames < 600) {
          updateBailDive(0.016);
          if (player.dive && player.dive.phase === 'roll') sawRoll = true;
          frames++;
        }
        return {
          frames, sawRoll, dive: !!player.dive,
          rotX: player.mesh.rotation.x, rotZ: player.mesh.rotation.z,
          y: player.y, ground: groundH(player.x, player.z),
          inBuilding: buildingHit(player.x, player.z, 0.4),
        };
      });
      assert(r.dive === false, `the dive must terminate (still running after ${r.frames} frames)`);
      assert(r.sawRoll, 'he should touch down and roll, not just fly');
      assert(r.frames < 600, 'the dive should end well inside its hard ceiling');
      assert(Math.abs(r.rotX) < 1e-6 && Math.abs(r.rotZ) < 1e-6,
        `he must end upright, not lying on his side (rotX ${r.rotX}, rotZ ${r.rotZ})`);
      assert(Math.abs(r.y - r.ground) < 0.01, 'he should end standing on the ground');
      assert(!r.inBuilding, 'he must not end up inside a building');
    }
  },

  {
    name: 'Bail-out: BAIL_MAX_T is a hard ceiling even if he never slows down',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await seatInCar(page, 30);
      const r = await page.evaluate(() => {
        exitCar();
        // pin the velocity high every frame so the "slow enough" exit can never
        // fire — only the timeout can end this
        let frames = 0;
        while (player.dive && frames < 1000) {
          player.dive.vx = 40; player.dive.vz = 0;
          updateBailDive(0.016);
          frames++;
        }
        return { dive: !!player.dive, frames, cap: BAIL_MAX_T };
      });
      assert(r.dive === false, 'the timeout must end a dive that never slows');
      assert(r.frames * 0.016 < r.cap + 0.1, `should end by BAIL_MAX_T (${r.cap}s), took ${(r.frames * 0.016).toFixed(2)}s`);
    }
  },

  {
    name: 'Bail-out: no sprinting, punching or jacking mid-tumble',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await seatInCar(page, 30);
      const r = await page.evaluate(() => {
        exitCar();
        input.sprint = true;
        const locked = { melee: canMelee(), sprint: canSprint(player, 1) };
        const carBefore = player.car;
        doEnterExit();                       // must be refused mid-dive
        const jacked = player.car !== carBefore;
        input.sprint = false;
        endBailDive();
        return { locked, jacked };
      });
      assert(r.locked.melee === false, 'melee should be locked out mid-tumble');
      assert(r.locked.sprint === false, 'sprint should be locked out mid-tumble');
      assert(r.jacked === false, 'you should not be able to jack a car mid-tumble');
    }
  },

  {
    name: 'Bail-out: the abandoned car keeps going, then settles',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await seatInCar(page, 30);
      const r = await page.evaluate(() => {
        const c = player.car;
        const x0 = c.x, z0 = c.z;
        exitCar();
        const queued = runaways.indexOf(c) >= 0;
        for (let i = 0; i < 60; i++) updateRunaways(0.016);   // ~1s of coasting
        const rolled = Math.hypot(c.x - x0, c.z - z0);
        for (let i = 0; i < 900; i++) updateRunaways(0.016);  // let it run down
        return { queued, rolled, stillListed: runaways.indexOf(c) >= 0, endSpeed: Math.abs(c.speed) };
      });
      assert(r.queued, 'bailing should hand the car to the runaway list');
      assert(r.rolled > 8, `the car should coast on without you (moved ${r.rolled.toFixed(1)}u in 1s)`);
      assert(r.stillListed === false, 'the runaway should retire once it stops');
      assert(r.endSpeed < 2, `it should come to rest (ended at ${r.endSpeed.toFixed(2)})`);
    }
  },

  {
    name: 'Bail-out: death mid-tumble cannot leave the rig lying down',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await seatInCar(page, 30);
      const r = await page.evaluate(() => {
        exitCar();
        for (let i = 0; i < 6; i++) updateBailDive(0.016);   // mid-air
        const midRot = player.mesh.rotation.x;
        G.over = false;
        wasted();
        const after = { dive: !!player.dive, rotX: player.mesh.rotation.x };
        G.over = false;
        return { midRot, after };
      });
      assert(Math.abs(r.midRot) > 1e-6, 'he should actually be tumbling before the test means anything');
      assert(r.after.dive === false, 'WASTED should clear the dive state');
      assert(Math.abs(r.after.rotX) < 1e-6, 'WASTED should stand the rig back up');
    }
  },
];
