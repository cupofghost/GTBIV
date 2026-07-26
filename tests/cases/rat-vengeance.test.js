'use strict';
// Rat Vengeance: the lightweight swarm and fully articulated Mama Rat share a
// readable +Z-forward rig; Mama emerges, turns, hunts, bites, reacts, and dies.

module.exports = [
  {
    name: 'shooting a rat swarm kills a random slice and summons mama rat',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        // fake a downed ped near a manhole and let the swarm recruit it
        const mh = MANHOLE_SPOTS[0];
        const ped = peds[0];
        ped.state = 'down'; ped.eaten = false; ped.ratSwarm = false; ped.eatParts = null;
        ped.x = mh.x + 1; ped.z = mh.z;
        player.x = mh.x; player.z = mh.z;   // recruiting requires the player nearby
        let guard = 200;
        while (guard-- > 0 && !RAT_POOL.some(rt => rt.tgt === ped && (rt.state === 'go' || rt.state === 'eat'))) {
          updateRats(0.1);
        }
        const before = RAT_POOL.filter(rt => rt.tgt === ped && (rt.state === 'go' || rt.state === 'eat')).length;
        const killed = killSomeRats(ped);
        const after = RAT_POOL.filter(rt => rt.tgt === ped && (rt.state === 'go' || rt.state === 'eat')).length;
        spawnMamaRat(mh);
        const rig = RAT_POOL.find(rt => rt.mesh.visible).mesh.userData;
        return {
          before, killed, after, mamaSpawned: !!mamaRat, mamaState: mamaRat && mamaRat.state,
          rigged: rig.forwardAxis === '+z' && rig.ears.length === 2 && rig.eyes.length === 2
            && rig.feet.length === 4 && !!rig.head && !!rig.jaw && !!rig.tail && !!rig.tailTip,
        };
      });
      assert(r.before > 0, 'swarm should have recruited at least one live rat');
      assert(r.killed >= 1 && r.killed <= r.before, `killed should be 1..swarm size, got ${r.killed}/${r.before}`);
      assert(r.after === r.before - r.killed, 'killed rats should leave the live pool');
      assert(r.mamaSpawned, 'mama rat should spawn after rats are shot');
      assert(r.mamaState === 'emerge', 'mama rat should start in the emerge state');
      assert(r.rigged, 'swarm rats should expose the complete low-poly rat rig');
      await page.evaluate(() => { if (mamaRat) { scene.remove(mamaRat.mesh); mamaRat = null; } });
    },
  },
  {
    name: 'mama rat is visually three times Turbo\'s height, emerges, then hunts the player',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const th = turboHeight();
        spawnMamaRat(MANHOLE_SPOTS[0]);
        const h = mamaRat.h;
        const box = new THREE.Box3().setFromObject(mamaRat.mesh);
        const visualH = box.max.y - box.min.y;
        // run past the emerge window
        let guard = 400;
        while (guard-- > 0 && mamaRat.state === 'emerge') updateMamaRat(0.02);
        const emerged = mamaRat.state === 'hunt';
        // place player far away and let her close the distance
        player.x = mamaRat.x + 40; player.z = mamaRat.z;
        const d0 = Math.hypot(player.x - mamaRat.x, player.z - mamaRat.z);
        for (let k = 0; k < 60; k++) updateMamaRat(0.1);
        const d1 = Math.hypot(player.x - mamaRat.x, player.z - mamaRat.z);
        return { th, h, visualH, emerged, d0, d1 };
      });
      assert(Math.abs(r.h - r.th * 3) < 0.01, `mama rat height should be 3x Turbo (${r.th}), got ${r.h}`);
      assert(Math.abs(r.visualH - r.th * 3) < 0.01,
        `visible mama rig should be 3x Turbo (${r.th}), got ${r.visualH}`);
      assert(r.emerged, 'mama rat should transition from emerge to hunt');
      assert(r.d1 < r.d0, `mama rat should slowly close the distance, ${r.d0} -> ${r.d1}`);
      await page.evaluate(() => { if (mamaRat) { scene.remove(mamaRat.mesh); mamaRat = null; } });
    },
  },
  {
    name: 'mama rat turns to face every pursuit direction before walking forward',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        spawnMamaRat(MANHOLE_SPOTS[0]);
        mamaRat.state = 'hunt'; mamaRat.y = groundH(0, 0);
        const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
        let minFaceDot = 1, minMoveDot = 1, maxStride = 0, sawTurn = false, sawWalk = false;
        for (const [rx, rz] of dirs) {
          const len = Math.hypot(rx, rz), vx = rx / len, vz = rz / len;
          mamaRat.x = 0; mamaRat.z = 0; mamaRat.y = groundH(0, 0);
          player.x = vx * 40; player.z = vz * 40;
          mamaRat.heading = Math.atan2(vx, vz) + Math.PI;
          mamaRat.mesh.rotation.y = mamaRat.heading;
          const x0 = mamaRat.x, z0 = mamaRat.z;
          for (let k = 0; k < 24; k++) {
            updateMamaRat(0.05);
            sawTurn = sawTurn || mamaRat.mesh.userData.animState === 'turn';
            sawWalk = sawWalk || mamaRat.mesh.userData.animState === 'walk';
            maxStride = Math.max(maxStride, Math.abs(
              mamaRat.mesh.userData.footFL.rotation.x - mamaRat.mesh.userData.footFR.rotation.x));
          }
          const tx = player.x - mamaRat.x, tz = player.z - mamaRat.z, td = Math.hypot(tx, tz);
          const fx = Math.sin(mamaRat.heading), fz = Math.cos(mamaRat.heading);
          minFaceDot = Math.min(minFaceDot, fx * tx / td + fz * tz / td);
          const mx = mamaRat.x - x0, mz = mamaRat.z - z0, md = Math.hypot(mx, mz);
          minMoveDot = Math.min(minMoveDot, md ? (fx * mx + fz * mz) / md : -1);
        }
        return { minFaceDot, minMoveDot, maxStride, sawTurn, sawWalk, pitch: mamaRat.mesh.rotation.x };
      });
      assert(r.sawTurn && r.sawWalk, 'pursuit should visibly transition from turn to walk');
      assert(r.minFaceDot > 0.995, `eyes/mouth should face Turbo in every direction, min dot ${r.minFaceDot}`);
      assert(r.minMoveDot > 0.995, `Mama should move along her forward axis, min dot ${r.minMoveDot}`);
      assert(r.maxStride > 0.5, `opposed feet should visibly stride while pursuing, got ${r.maxStride}`);
      assert(r.pitch === 0, 'pursuit yaw must not pitch Mama into the terrain');
      await page.evaluate(() => { if (mamaRat) { scene.remove(mamaRat.mesh); mamaRat = null; } });
    },
  },
  {
    name: 'mama rat bite damage lands at the jaw snap and animation states clean up',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        G.mode = 'foot'; G.hp = 100; G.over = false; DEV_STATE.god = false;
        spawnMamaRat(MANHOLE_SPOTS[0]);
        mamaRat.state = 'hunt';
        player.x = mamaRat.x; player.z = mamaRat.z;
        updateMamaRat(0.02);
        const hpAtWindup = G.hp;
        for (let k = 0; k < 12; k++) updateMamaRat(0.02);
        const hpBeforeSnap = G.hp;
        const jawOpen = mamaRat.mesh.userData.jaw.rotation.x;
        updateMamaRat(0.04);
        const hpAfterBite = G.hp;
        damageMamaRat(34);
        updateMamaRat(0.02);
        const damageState = mamaRat.mesh.userData.animState;
        for (let k = 0; k < 12; k++) updateMamaRat(0.02);
        const idleState = mamaRat.mesh.userData.animState;
        // shoot her down and let the death pose clean itself out
        let guard = 20;
        while (guard-- > 0 && mamaRat && mamaRat.state !== 'dying') damageMamaRat(34);
        const dying = mamaRat && mamaRat.state === 'dying';
        let steps = 60;
        while (steps-- > 0 && mamaRat) updateMamaRat(0.02);
        return { hpAtWindup, hpBeforeSnap, hpAfterBite, jawOpen, damageState, idleState, dying, gone: !mamaRat };
      });
      assert(r.hpAtWindup === 100 && r.hpBeforeSnap === 100,
        'bite windup must not damage Turbo before the visible jaw snap');
      assert(r.hpAfterBite < 100, 'standing next to mama rat should take a bite of damage');
      assert(r.jawOpen > 0.25, `jaw should visibly open during bite windup, got ${r.jawOpen}`);
      assert(r.damageState === 'damage', `expected damage reaction, got ${r.damageState}`);
      assert(r.idleState === 'idle', `damage/bite joints should clean back to idle, got ${r.idleState}`);
      assert(r.dying, 'enough gunfire should drop mama rat into the dying state');
      assert(r.gone, 'mama rat should be fully removed after the dying animation');
      await page.evaluate(() => { G.hp = 100; });
    },
  },
  {
    name: 'mama rat has her own screech/bite/death voice (RV3), not reused sfx.punch()/sfx.bigCrash()',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        if (!AC) initAudio();
        let threw = null;
        try { sfx.ratScreech(); sfx.ratBite(); sfx.ratDeath(); } catch (e) { threw = e.message; }
        return { threw,
          distinct: typeof sfx.ratScreech === 'function' && typeof sfx.ratBite === 'function'
            && typeof sfx.ratDeath === 'function' && sfx.ratBite !== sfx.punch && sfx.ratScreech !== sfx.bigCrash };
      });
      assert(r.threw === null, 'mama rat voices should never throw, got: ' + r.threw);
      assert(r.distinct, 'expected sfx.ratScreech/ratBite/ratDeath as distinct functions from punch/bigCrash');
    },
  },
];
