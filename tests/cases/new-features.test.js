'use strict';
// Smoke coverage for the polish pass: heli rework, bail/parachute, dog
// packs, jock collision, twin-stick gun, burning cars, tree collision.
// These drive the same globals the game uses; keep them cheap and forgiving.

module.exports = [
  {
    name: 'heli nose points +z and shadow stays on the ground while flying',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const h = helis[0];
        // nose child sits at +z after the flip
        const noseZ = h.mesh.children[1].position.z;
        // simulate flight and check the shadow did not ride up
        h.y = 40; updateHeliShadow(h);
        const out = { noseZ, shadowY: h.shadow.position.y, vis: h.shadow.visible };
        h.y = 0; updateHeliShadow(h);
        return out;
      });
      assert(r.noseZ > 0, 'heli nose should be at +z, got ' + r.noseZ);
      assert(r.shadowY < 1, 'shadow should stay near ground, got y=' + r.shadowY);
    },
  },
  {
    name: 'bail out at altitude, parachute opens, soft landing',
    run: async (page, { assert }) => {
      const r = await page.evaluate(async () => {
        const h = helis[0];
        // put the player in the heli, airborne
        player.x = h.x; player.z = h.z;
        G.mode = 'heli'; player.heli = h; h.driver = 'player'; h.landed = false;
        h.y = 50; h.spin = 1;
        bailOut();
        const bailing = !!player.bailing, mode = G.mode, pilotless = !!h.pilotless;
        openChute();
        const chute = player.chute;
        // ride the bail physics to the ground
        let guard = 4000;
        while (player.bailing && guard-- > 0) updateBail(0.016);
        return { bailing, mode, pilotless, chute,
          landedY: player.y, groundY: groundH(player.x, player.z), over: G.over, stillBailing: player.bailing };
      });
      assert(r.bailing && r.mode === 'foot', 'bail should drop to foot mode mid-air');
      assert(r.pilotless, 'abandoned heli should be pilotless');
      assert(r.chute, 'chute should open');
      assert(!r.stillBailing, 'bail should end on touchdown');
      assert(!r.over, 'chute landing should not waste the player');
      // terrain isn't flat (hills, city relief) — compare against the ground field, not a flat y=0
      assert(Math.abs(r.landedY - r.groundY) < 1, 'should be back on the ground, y=' + r.landedY + ' vs groundH=' + r.groundY);
    },
  },
  {
    name: 'no-chute fall from height wastes the player',
    run: async (page, { assert }) => {
      const r = await page.evaluate(async () => {
        G.over = false;
        player.bailing = true; player.chute = false;
        player.x = 0; player.z = 0; player.y = 60; player.vy = -30;
        player.fallVX = 0; player.fallVZ = 0;
        let guard = 200;
        while (player.bailing && guard-- > 0) updateBail(0.016);
        return { over: G.over };
      });
      assert(r.over, 'freefall from 60 without a chute should waste the player');
      await page.evaluate(() => { G.over = false; player.stunT = 0; });
    },
  },
  {
    name: 'dead owner\'s dog becomes a stray, strays band into a gang',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const before = strayDogs.length;
        // fake two orphaned dogs side by side
        for (let k = 0; k < 2; k++) {
          const mesh = makeDog(); scene.add(mesh);
          makeStray({ mesh, x: player.x + 4 + k, z: player.z + 4, phase: 0 });
        }
        // run the banding logic until they pack up
        let guard = 40;
        while (guard-- > 0 && !strayDogs[strayDogs.length - 1].gang) updateStrayDogs(0.1);
        const lastTwo = strayDogs.slice(-2);
        return { before, after: strayDogs.length,
          banded: !!(lastTwo[0].gang && lastTwo[0].gang === lastTwo[1].gang) };
      });
      assert(r.after === r.before + 2, 'both strays should persist');
      assert(r.banded, 'nearby lone strays should band into one gang');
    },
  },
  {
    name: 'feed a pack 3 meats and it follows; scram releases it',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        G.meat = 3;
        const mesh = makeDog(); scene.add(mesh);
        makeStray({ mesh, x: player.x + 2, z: player.z + 2, phase: 0 });
        const d = strayDogs[strayDogs.length - 1];
        feedDogs(); feedDogs(); feedDogs();
        const g = d.gang;
        const tame = g && g.state === 'tame' && g.trust >= 3;
        scramDogs();
        return { meat: G.meat, tame, roam: g.state === 'roam' };
      });
      assert(r.meat === 0, 'three feeds should eat three meat');
      assert(r.tame, 'pack should turn tame at 3 trust');
      assert(r.roam, 'scram should release the pack to roam');
    },
  },
  {
    name: 'jocks wear letterman jackets and collide instead of melding',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const j = jocks[0];
        const u = j.mesh.userData;
        // jacket: torso extras (rib/collar/snaps/patch) beyond the base body
        const extras = u.torso.children.length;
        // collision: drop the player right on top of the jock and resolve
        j.x = player.x; j.z = player.z;
        const hit = jockHit(player.x, player.z, 0.5);
        const obj = { x: player.x, z: player.z };
        resolveFootCollision(obj, 0.5);
        const sep = Math.hypot(obj.x - j.x, obj.z - j.z);
        return { extras, hit: !!hit, sep };
      });
      assert(r.extras >= 5, 'letterman jacket adds torso extras, got ' + r.extras);
      assert(r.hit, 'jockHit should register');
      assert(r.sep > 0.8, 'player should be pushed out, sep=' + r.sep);
    },
  },
  {
    name: 'pistol equips a visible gun, reticule, and aim-follows-camera',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        G.mode = 'foot'; G.weapon = 'pistol'; player.bailing = false; player.stunT = 0;
        refreshButtons();
        const u = player.mesh.userData;
        footCamYaw = 1.2;
        input.jx = 0; input.jy = 0;
        updateFoot(0.016);
        return { gun: !!(u.gun && u.gun.visible),
          ret: document.getElementById('reticule').style.display,
          heading: player.heading,
          arm: u.armR.rotation.x };
      });
      assert(r.gun, 'gun mesh should be visible with pistol equipped');
      assert(r.ret === 'block', 'reticule should show');
      assert(Math.abs(r.heading - 1.2) < 0.01, 'Turbo should face the camera aim');
      assert(r.arm < -1.2, 'gun arm should be leveled, got ' + r.arm);
      await page.evaluate(() => { G.weapon = 'fists'; refreshButtons(); });
    },
  },
  {
    name: 'wounded player car burns, then blows with a boom camera beat',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const c = cars.find(c2 => !c2.dead && !c2.driver);
        player.car = c; G.mode = 'car';
        damageCar(c, c.maxhp - 10, 'crash');   // down under 22 hp
        const burning = !!c.burning, fuse = c.burnT;
        c.burnT = 0.01;                        // fast-forward the fuse
        return { burning, fuse };
      });
      assert(r.burning, 'car under 22hp should catch fire');
      assert(r.fuse >= 29, 'default fuse should be ~30s, got ' + r.fuse);
      await page.waitForTimeout(300);
      const r2 = await page.evaluate(() => ({
        gone: !cars.includes(cars.find(c2 => c2 === (window.__pc || null))),
        boom: !!G.boomCam,
      }));
      assert(r2.boom, 'explosion should trigger the boom camera');
      await page.evaluate(() => {
        G.mode = 'foot'; player.car = null; G.over = false;
        player.x = 0; player.z = 0; player.stunT = 0;
      });
    },
  },
  {
    name: 'trees are solid to foot traffic',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const t = treeSpots[0];
        const hit = treeHit(t.x, t.z, 0.5);
        const obj = { x: t.x, z: t.z };
        resolveFootCollision(obj, 0.5);
        return { hit: !!hit, sep: Math.hypot(obj.x - t.x, obj.z - t.z) };
      });
      assert(r.hit, 'treeHit should register at a tree');
      assert(r.sep > 0.8, 'player should be pushed out of the trunk');
    },
  },
];
