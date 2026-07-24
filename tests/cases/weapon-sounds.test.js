'use strict';
// Weapon sound synthesis: WEAPON_SFX is a small per-weapon voice registry
// (fire()/reload(), built from the shared blip/noiseBurst primitives) meant
// to make it trivial to add a future weapon type. These tests don't (can't,
// headless) assert on actual audio output — they assert on the state machine
// wired to it: firing spends ammo/rockets, an empty pistol mag auto-reloads
// and refills, and a live rocket carries a flight-loop handle that gets
// cleaned up on impact. See tests/README.md's "drive state directly" pattern.

module.exports = {
  cases: [
    {
      name: 'WEAPON_SFX exposes fire()/reload() per weapon and every voice fires without throwing',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!AC) initAudio();
          const shapeOk = ['pistol', 'rpg'].every(w =>
            typeof WEAPON_SFX[w].fire === 'function' && typeof WEAPON_SFX[w].reload === 'function');
          let threw = null;
          try {
            WEAPON_SFX.pistol.fire(); WEAPON_SFX.pistol.reload();
            WEAPON_SFX.rpg.fire(); WEAPON_SFX.rpg.reload();
            sfx.gunshot(); sfx.rocket(); sfx.rpgBoom();
            const flight = startMissileFlight();
            flight.update(player.x + 5, 1, player.z);
            flight.stop();
          } catch (e) { threw = e.message; }
          return { shapeOk, threw, mag: WEAPON_SFX.pistol.mag };
        });
        assert(r.shapeOk, 'expected fire()/reload() functions on WEAPON_SFX.pistol and .rpg');
        assert(r.threw === null, 'weapon voices should never throw, got: ' + r.threw);
        assert(r.mag === 12, 'expected a 12-round pistol magazine, got ' + r.mag);
      },
    },
    {
      name: 'firing the last pistol round auto-reloads (sound + lockout) and refills the magazine',
      run: async (page, { assert }) => {
        const mid = await page.evaluate(() => {
          if (!AC) initAudio();
          G.mode = 'foot'; G.started = true; G.over = false;
          peds.length = 0;               // no ped in range to trigger a stickup instead of a shot
          player.punchT = 0;
          G.weapon = 'pistol'; G.pistolAmmo = 1; G.reloading = false;
          doAttack();
          return { ammo: G.pistolAmmo, reloading: G.reloading, fired: player.punchT > 0 };
        });
        assert(mid.fired, 'expected the shot to fire (punchT should be set)');
        assert(mid.ammo === 0, 'expected the round to be spent, got ammo=' + mid.ammo);
        assert(mid.reloading === true, 'emptying the mag should start a reload');

        await page.waitForFunction(() => G.reloading === false, { timeout: 3000 });
        const after = await page.evaluate(() => G.pistolAmmo);
        assert(after === 12, 'expected the magazine to refill to 12 after reloading, got ' + after);
      },
    },
    {
      name: 'RPG fire carries a flying-missile sound handle that stops cleanly on impact',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!AC) initAudio();
          G.mode = 'foot'; G.started = true; G.over = false;
          player.punchT = 0; camPitch = 0;
          G.weapon = 'rpg'; G.rockets = 1; DEV_STATE.inf = false;
          doAttack();
          const spawned = rockets.length === 1;
          const snd = spawned ? rockets[0].snd : null;
          const hasHandle = !!snd && typeof snd.update === 'function' && typeof snd.stop === 'function';
          if (spawned) rockets[0].life = 0;   // force an immediate impact next substep
          updateRockets(0.016);
          return { spawned, hasHandle, weaponAfter: G.weapon, rocketsLeft: rockets.length };
        });
        assert(r.spawned, 'expected doAttack() to push one rocket');
        assert(r.hasHandle, 'expected the rocket to carry a flight-sound handle with update()/stop()');
        assert(r.rocketsLeft === 0, 'expected the rocket to resolve (explode + despawn) after life<=0');
        assert(r.weaponAfter === 'pistol', 'firing the only rocket should fall back to the pistol');
      },
    },
  ],
};
