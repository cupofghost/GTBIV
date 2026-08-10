// PV7 — "make the motorcycles have real guys on them. when turbo steals one,
// turbos model should be on the bike."
//
// Bikes used to carry a rider welded into the vehicle mesh out of primitives —
// a cylinder torso, a sphere helmet, four tubes — so jacking one still showed a
// faceless blob riding away. Now it's a js/person.js rig that gets hidden when
// Turbo takes the seat.

function spawnBike(page, opts) {
  return page.evaluate((opts) => {
    const node = intersections[36];
    const b = makeCar('moto', node.x, node.z, 0, opts || { parked: true });
    scene.updateMatrixWorld(true);
    return { x: b.x, z: b.z };
  }, opts);
}

module.exports = [
  {
    name: 'Bike rider: every motorcycle carries a real person rig',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1400);
      const r = await page.evaluate(() => {
        const bikes = cars.filter(c => c.type === 'moto' && !c.dead);
        const info = bikes.map(b => {
          const rider = b.mesh.userData.rider;
          const u = rider && rider.userData;
          return { has: !!rider, visible: !!(rider && rider.visible),
                   rig: !!(u && u.legL && u.armL && u.head && u.torso) };
        });
        return { count: bikes.length, info };
      });
      assert(r.count > 0, 'the world should have spawned at least one motorcycle');
      r.info.forEach((b, i) => {
        assert(b.has, `bike ${i} should carry a rider`);
        assert(b.visible, `bike ${i}'s rider should be visible`);
        assert(b.rig, `bike ${i}'s rider should be a real person rig, not a primitive blob`);
      });
    }
  },

  {
    name: 'Bike rider: the rider actually sits on the seat',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await spawnBike(page);
      const r = await page.evaluate(() => {
        const b = cars.filter(c => c.type === 'moto' && !c.dead).pop();
        scene.updateMatrixWorld(true);
        const rider = b.mesh.userData.rider;
        // the rig puts the pelvis at y=0.95 in its own space; the bike's seat
        // mesh top is ~0.785 above the bike origin
        const pelvis = rider.localToWorld(new THREE.Vector3(0, 0.95, 0));
        const seat = b.mesh.localToWorld(new THREE.Vector3(0, 0.785, 0));
        const feet = rider.localToWorld(new THREE.Vector3(0, 0, 0));
        return { gap: pelvis.y - seat.y, feetBelowSeat: seat.y - feet.y,
                 posed: rider.userData.legL.rotation.x !== 0 };
      });
      assert(Math.abs(r.gap) < 0.35,
        `the rider's hips should be at seat height, not floating (off by ${r.gap.toFixed(2)})`);
      assert(r.feetBelowSeat > 0, 'the rider should be sitting above his own feet');
      assert(r.posed, 'the rider should be posed, not standing to attention');
    }
  },

  {
    name: 'Bike rider: jacking a bike puts Turbo\'s own model on it',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await spawnBike(page);
      const r = await page.evaluate(() => {
        const b = cars.filter(c => c.type === 'moto' && !c.dead).pop();
        player.x = b.x; player.z = b.z; G.mode = 'foot'; player.car = null;
        doEnterExit();
        scene.updateMatrixWorld(true);
        const onBike = player.car === b;
        const seat = b.mesh.localToWorld(new THREE.Vector3(0, 0.785, 0));
        return {
          onBike, mode: G.mode,
          turboVisible: player.mesh.visible,
          npcHidden: !b.mesh.userData.rider.visible,
          posed: player.mesh.userData.legL.rotation.x !== 0,
          gap: player.mesh.localToWorld(new THREE.Vector3(0, 0.95, 0)).y - seat.y,
          ownShadowOff: player.mesh.userData.shadow ? !player.mesh.userData.shadow.visible : true,
        };
      });
      assert(r.onBike && r.mode === 'car', 'the bike should have been jacked');
      assert(r.turboVisible, "Turbo's model must stay visible on a bike (a car hides him, a bike must not)");
      assert(r.npcHidden, 'the NPC rider should give up the seat');
      assert(r.posed, 'Turbo should be posed as a rider');
      assert(Math.abs(r.gap) < 0.35, `Turbo should sit on the seat (off by ${r.gap.toFixed(2)})`);
      assert(r.ownShadowOff, 'Turbo should drop his own blob shadow — the bike casts one');
    }
  },

  {
    name: 'Bike rider: stepping off restores the NPC, the pose and the shadow',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await spawnBike(page);
      const r = await page.evaluate(() => {
        const b = cars.filter(c => c.type === 'moto' && !c.dead).pop();
        player.x = b.x; player.z = b.z; G.mode = 'foot'; player.car = null;
        doEnterExit();
        b.speed = 0;                    // slow exit, so no bail dive
        exitCar();
        const u = player.mesh.userData;
        return {
          mode: G.mode, visible: player.mesh.visible,
          npcBack: b.mesh.userData.rider.visible,
          legX: u.legL.rotation.x, armX: u.armL.rotation.x,
          torsoX: u.torso ? u.torso.rotation.x : 0,
          shadowBack: u.shadow ? u.shadow.visible : true,
          quat: [player.mesh.quaternion.x, player.mesh.quaternion.z],
        };
      });
      assert(r.mode === 'foot', 'exiting should put Turbo on foot');
      assert(r.visible, 'Turbo should still be visible on foot');
      assert(r.npcBack, 'the NPC rider should get his seat back');
      // He shares one rig with the walk cycle — leaving it posed means he walks
      // away still crouched over invisible handlebars.
      assert(r.legX === 0 && r.armX === 0 && r.torsoX === 0,
        `the rig must be handed back neutral (leg ${r.legX}, arm ${r.armX}, torso ${r.torsoX})`);
      assert(Math.abs(r.quat[0]) < 1e-6 && Math.abs(r.quat[1]) < 1e-6,
        'the bike lean must not be left on Turbo after dismounting');
      assert(r.shadowBack, 'his own shadow should come back on foot');
    }
  },

  {
    name: 'Bike rider: repeated jack/exit cycles leak nothing',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      await spawnBike(page);
      const r = await page.evaluate(() => {
        const b = cars.filter(c => c.type === 'moto' && !c.dead).pop();
        const countKids = () => { let n = 0; scene.traverse(() => n++); return n; };
        const before = countKids();
        for (let i = 0; i < 10; i++) {
          player.x = b.x; player.z = b.z; G.mode = 'foot'; player.car = null;
          doEnterExit();
          if (player.car) { player.car.speed = 0; exitCar(); }
        }
        const u = player.mesh.userData;
        return { before, after: countKids(),
                 riderVisible: b.mesh.userData.rider.visible,
                 legX: u.legL.rotation.x, mode: G.mode };
      });
      // a few nodes of drift is fine (toasts, particles); a rig per cycle is not
      assert(r.after - r.before < 20,
        `10 jack/exit cycles should not grow the scene (${r.before} -> ${r.after})`);
      assert(r.riderVisible, 'the NPC rider should be visible after the last exit');
      assert(r.legX === 0, 'Turbo should end neutral after 10 cycles');
      assert(r.mode === 'foot', 'Turbo should end on foot');
    }
  },
];
