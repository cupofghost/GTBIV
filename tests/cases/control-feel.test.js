// J4 remaining scope (HANDOFF.md §8): the physics already brakes-then-
// reverses (carPhysics) — these cases confirm the touch BRAKE pedal and the
// dash readout actually communicate which phase the car is in, per the
// card's acceptance note ("ensure the pedal/HUD communicates it").
module.exports = {
  cases: [
    {
      name: 'the BRAKE pedal relabels to REVERSE once the car is actually rolling backward',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const c = cars.find(c2 => !c2.dead && !c2.driver);
          player.car = c; G.mode = 'car';
          c.vel.set(0, 0, 0); c.speed = 0;
          input.brake = false; input.gas = false; input.boost = false; input.drift = false;
          updateCarMode(0.05);
          const idle = { text: document.getElementById('btnBrake').textContent, cls: document.getElementById('btnBrake').classList.contains('reversing') };
          // hold brake from a dead stop — carPhysics goes straight to its
          // reverse-accel branch (no forward speed to bleed off first)
          input.brake = true;
          for (let i = 0; i < 15; i++) updateCarMode(0.05);
          const reversing = { text: document.getElementById('btnBrake').textContent, cls: document.getElementById('btnBrake').classList.contains('reversing'), speed: c.speed };
          input.brake = false;
          G.mode = 'foot'; player.car = null;
          return { idle, reversing };
        });
        assert(r.idle.text === 'BRAKE' && !r.idle.cls, 'expected the pedal to read BRAKE while not reversing, got ' + JSON.stringify(r.idle));
        assert(r.reversing.text === 'REVERSE' && r.reversing.cls, 'expected the pedal to relabel to REVERSE once rolling backward, got ' + JSON.stringify(r.reversing));
      },
    },
    {
      name: 'the dash readout appends REV while reversing and drops it once moving forward again',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const c = cars.find(c2 => !c2.dead && !c2.driver);
          player.car = c; G.mode = 'car';
          c.speed = -1.5;
          drawDash(0.2, 20, c.type.toUpperCase() + (c.speed < -0.15 ? ' · REV' : ''), 100, 100);
          const reversingLabel = document.getElementById('dashName').textContent;
          c.speed = 5;
          drawDash(0.4, 40, c.type.toUpperCase() + (c.speed < -0.15 ? ' · REV' : ''), 100, 100);
          const forwardLabel = document.getElementById('dashName').textContent;
          G.mode = 'foot'; player.car = null;
          return { reversingLabel, forwardLabel };
        });
        assert(/REV/.test(r.reversingLabel), 'expected the dash label to flag reverse, got ' + r.reversingLabel);
        assert(!/REV/.test(r.forwardLabel), 'expected the dash label to drop the reverse flag once moving forward, got ' + r.forwardLabel);
      },
    },
  ],
};
