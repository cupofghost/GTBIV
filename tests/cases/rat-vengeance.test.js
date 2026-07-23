'use strict';
// Rat Vengeance (placeholder, see HANDOFF.md): shooting a swarm kills a
// random slice of it and summons a mama rat — 3x Turbo's height — that
// climbs out of the manhole and slowly closes in on the player.

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
        return { before, killed, after, mamaSpawned: !!mamaRat, mamaState: mamaRat && mamaRat.state };
      });
      assert(r.before > 0, 'swarm should have recruited at least one live rat');
      assert(r.killed >= 1 && r.killed <= r.before, `killed should be 1..swarm size, got ${r.killed}/${r.before}`);
      assert(r.after === r.before - r.killed, 'killed rats should leave the live pool');
      assert(r.mamaSpawned, 'mama rat should spawn after rats are shot');
      assert(r.mamaState === 'emerge', 'mama rat should start in the emerge state');
      await page.evaluate(() => { if (mamaRat) { scene.remove(mamaRat.mesh); mamaRat = null; } });
    },
  },
  {
    name: 'mama rat is three times Turbo\'s height, emerges, then hunts the player',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const th = turboHeight();
        spawnMamaRat(MANHOLE_SPOTS[0]);
        const h = mamaRat.h;
        // run past the emerge window
        let guard = 400;
        while (guard-- > 0 && mamaRat.state === 'emerge') updateMamaRat(0.02);
        const emerged = mamaRat.state === 'hunt';
        // place player far away and let her close the distance
        player.x = mamaRat.x + 40; player.z = mamaRat.z;
        const d0 = Math.hypot(player.x - mamaRat.x, player.z - mamaRat.z);
        for (let k = 0; k < 60; k++) updateMamaRat(0.1);
        const d1 = Math.hypot(player.x - mamaRat.x, player.z - mamaRat.z);
        return { th, h, emerged, d0, d1 };
      });
      assert(Math.abs(r.h - r.th * 3) < 0.01, `mama rat height should be 3x Turbo (${r.th}), got ${r.h}`);
      assert(r.emerged, 'mama rat should transition from emerge to hunt');
      assert(r.d1 < r.d0, `mama rat should slowly close the distance, ${r.d0} -> ${r.d1}`);
      await page.evaluate(() => { if (mamaRat) { scene.remove(mamaRat.mesh); mamaRat = null; } });
    },
  },
  {
    name: 'mama rat bites a nearby player on foot and can be shot down',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        G.mode = 'foot'; G.hp = 100; G.over = false; DEV_STATE.god = false;
        spawnMamaRat(MANHOLE_SPOTS[0]);
        mamaRat.state = 'hunt';
        player.x = mamaRat.x; player.z = mamaRat.z;
        updateMamaRat(0.02);
        const hpAfterBite = G.hp;
        // shoot her down
        let guard = 20;
        while (guard-- > 0 && mamaRat && mamaRat.state !== 'dying') damageMamaRat(34);
        const dying = mamaRat && mamaRat.state === 'dying';
        let steps = 60;
        while (steps-- > 0 && mamaRat) updateMamaRat(0.02);
        return { hpAfterBite, dying, gone: !mamaRat };
      });
      assert(r.hpAfterBite < 100, 'standing next to mama rat should take a bite of damage');
      assert(r.dying, 'enough gunfire should drop mama rat into the dying state');
      assert(r.gone, 'mama rat should be fully removed after the dying animation');
      await page.evaluate(() => { G.hp = 100; });
    },
  },
];
