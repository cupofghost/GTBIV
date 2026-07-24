// J3 — camera polish (HANDOFF.md §8): a look-sensitivity slider and
// invert-Y toggle in Settings (applied in applyLook), plus a faster
// low-speed car-camera follow rate so pulling out from a stop doesn't lag
// behind the wheel. cameraCollide's never-clip-into-buildings behavior is
// untouched by this card and already covered indirectly by every other
// test that drives/walks around; not re-tested here.
module.exports = {
  cases: [
    {
      name: 'lookSens defaults to 100 and invertY defaults to off on a fresh boot',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => ({ lookSens: SETTINGS.lookSens, invertY: SETTINGS.invertY }));
        assert(r.lookSens === 100, 'expected default look sensitivity of 100, got ' + r.lookSens);
        assert(r.invertY === false, 'expected invert-Y to default off, got ' + r.invertY);
      },
    },
    {
      name: 'applyLook scales yaw/pitch proportionally to SETTINGS.lookSens',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.mode = 'foot'; SETTINGS.invertY = false;
          SETTINGS.lookSens = 100; footCamYaw = 0; camPitch = 0;
          applyLook(-100, 50);
          const base = { yaw: footCamYaw, pitch: camPitch };
          SETTINGS.lookSens = 200; footCamYaw = 0; camPitch = 0;
          applyLook(-100, 50);
          const doubled = { yaw: footCamYaw, pitch: camPitch };
          return { base, doubled };
        });
        assert(Math.abs(r.doubled.yaw - r.base.yaw * 2) < 1e-6, 'expected 200% sensitivity to double the yaw delta, got ' + JSON.stringify(r));
        assert(Math.abs(r.doubled.pitch - r.base.pitch * 2) < 1e-6, 'expected 200% sensitivity to double the pitch delta, got ' + JSON.stringify(r));
      },
    },
    {
      name: 'invertY flips the pitch direction from the same swipe',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.mode = 'foot'; SETTINGS.lookSens = 100;
          SETTINGS.invertY = false; camPitch = 0;
          applyLook(0, 50);
          const normal = camPitch;
          SETTINGS.invertY = true; camPitch = 0;
          applyLook(0, 50);
          const inverted = camPitch;
          return { normal, inverted };
        });
        assert(r.normal > 0, 'expected the normal (non-inverted) pitch delta to be positive, got ' + r.normal);
        assert(Math.abs(r.inverted + r.normal) < 1e-6, 'expected invertY to flip the sign of the same swipe, got ' + JSON.stringify(r));
      },
    },
    {
      name: 'lookSens and invertY persist across a reload like the other settings',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const before = await page.evaluate(() => {
          SETTINGS.lookSens = 150; SETTINGS.invertY = true; saveSettings();
          return JSON.parse(localStorage.getItem('gtb4.settings'));
        });
        assert(before.lookSens === 150 && before.invertY === true, 'expected the new settings written to localStorage, got ' + JSON.stringify(before));
        await page.reload();
        await page.waitForFunction(() => typeof SETTINGS !== 'undefined');
        const after = await page.evaluate(() => ({ lookSens: SETTINGS.lookSens, invertY: SETTINGS.invertY }));
        assert(after.lookSens === 150 && after.invertY === true, 'expected both settings to survive reload, got ' + JSON.stringify(after));
      },
    },
    {
      name: 'the car camera catches up faster at low speed than at speed',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const c = cars.find(c2 => !c2.dead && !c2.driver);
          player.car = c; G.mode = 'car';
          c.heading = 0; camYawOff = 0; camPitch = 0;
          // Put the camera at the SAME radius as the ideal chase spot but at
          // a right angle to it, so cameraCollide's tgt-vs-camPos distance
          // check is a tie (no wall in the way either) and updateCamera
          // takes the eased "swing around" branch, not the instant snap —
          // that snap branch (a genuinely-too-far camera, e.g. a wall just
          // stopped occluding) always jumps straight to tgt regardless of
          // speed, which isn't what this card's follow-rate tweak touches.
          const testFollow = (speed) => {
            c.speed = speed;
            const dist = 9.5 + Math.abs(speed) * 0.07; // mirrors updateCamera's own formula
            const start = new THREE.Vector3(c.x + dist, c.y + 4.3, c.z); // same radius, 90° off from tgt
            camPos.copy(start);
            updateCamera(0.05);
            return camPos.distanceTo(start); // how far it swung toward tgt in one frame
          };
          const movedLow = testFollow(0);
          const movedHigh = testFollow(30);
          G.mode = 'foot'; player.car = null;
          return { movedLow, movedHigh };
        });
        assert(r.movedLow > r.movedHigh, 'expected the low-speed camera to close more distance in one frame than the high-speed camera, got ' + JSON.stringify(r));
      },
    },
  ],
};
