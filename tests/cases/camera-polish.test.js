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
          // Stub out world occlusion: which parked car this map happens to
          // hand back (and what's next to it) is unseeded per HANDOFF's D7,
          // so without this the tie between camPos/tgt distances below is
          // only reliable when that car's surroundings are clear — flaky
          // otherwise. This test is about the follow-rate formula, not
          // cameraCollide's wall/vehicle pull-in (already exercised live by
          // every other test that drives around).
          const origBH = buildingHit, origVH = vehicleHit;
          buildingHit = () => null; vehicleHit = () => null;
          // Start the camera right at the car — clearly closer than any
          // chase distance, so this is unambiguously the eased "ease back
          // out" branch (not the instant occlusion snap, which always jumps
          // straight to tgt regardless of speed and isn't what this card's
          // follow-rate tweak touches). Measuring the fraction of the gap
          // closed (not the raw distance moved) keeps this independent of
          // the chase distance itself growing with speed.
          const testFollowFactor = (speed) => {
            c.speed = speed;
            const dist = 9.5 + Math.abs(speed) * 0.07; // mirrors updateCamera's own formula
            const h = 4.3; // camPitch=0
            const bx = -Math.sin(c.heading + camYawOff), bz = -Math.cos(c.heading + camYawOff);
            const tgt = new THREE.Vector3(c.x + bx * dist, c.y + h, c.z + bz * dist);
            const start = new THREE.Vector3(c.x, c.y + h, c.z);
            camPos.copy(start);
            const initialGap = camPos.distanceTo(tgt);
            updateCamera(0.05);
            const remainingGap = camPos.distanceTo(tgt);
            return 1 - remainingGap / initialGap; // the lerp factor actually applied
          };
          const factorLow = testFollowFactor(0);
          const factorHigh = testFollowFactor(30);
          G.mode = 'foot'; player.car = null;
          buildingHit = origBH; vehicleHit = origVH;
          return { factorLow, factorHigh };
        });
        assert(r.factorLow > r.factorHigh, 'expected the low-speed camera to use a higher follow-rate lerp factor than the high-speed camera, got ' + JSON.stringify(r));
      },
    },
    {
      name: 'foot aim camera blends through intermediate position and FOV values',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.mode='foot'; G.started=true; G.weapon='fists'; player.bailing=false; player.moveMag=0;
          player.x=intersections[0].x; player.z=intersections[0].z; player.y=groundH(player.x,player.z);
          footCamYaw=0; camPitch=0; aimBlend=0; camPos.set(player.x,player.y+3,player.z+7); updateCamera(.016);
          const before={x:camera.position.x,z:camera.position.z,fov:camera.fov};
          G.weapon='pistol'; updateCamera(.016); const first={x:camera.position.x,z:camera.position.z,fov:camera.fov,blend:aimBlend};
          updateCamera(.12); const middle={x:camera.position.x,z:camera.position.z,fov:camera.fov,blend:aimBlend};
          return {before,first,middle};
        });
        assert(r.first.blend>0&&r.first.blend<1&&r.middle.blend>r.first.blend&&r.middle.blend<1, 'aim blend should progress over multiple frames: '+JSON.stringify(r));
        assert(r.first.fov<r.before.fov&&r.middle.fov<r.first.fov, 'FOV should ease toward aim rather than jump: '+JSON.stringify(r));
      },
    },
    {
      name: 'normal and charged melee poses do not jostle the foot camera',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const p=player,spot=intersections[0],dir=new THREE.Vector3();
          G.mode='foot';G.started=true;G.over=false;G.weapon='fists';G.crouching=false;
          p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;p.moveMag=0;p.punchT=0;p.kickT=0;p.meleeSpecial=null;
          footCamYaw=0;camPitch=0;aimBlend=0;camPos.set(p.x,p.y+2.9,p.z-6.5);
          for(let i=0;i<60;i++)updateCamera(1/60);
          const before=camera.position.clone();camera.getWorldDirection(dir);const beforeDir=dir.clone();
          doPunch(false,false);updateFoot(1/60);updateCamera(1/60);
          const punchMove=camera.position.distanceTo(before);camera.getWorldDirection(dir);const punchAngle=dir.angleTo(beforeDir);
          p.punchT=0;startChargedMelee('punch');updateChargedMelee(.14);const specialBefore=camera.position.clone();camera.getWorldDirection(dir);const specialDir=dir.clone();
          updateCamera(1/60);
          const specialMove=camera.position.distanceTo(specialBefore);camera.getWorldDirection(dir);const specialAngle=dir.angleTo(specialDir);
          finishChargedMelee(p.meleeSpecial);
          return {punchMove,punchAngle,specialMove,specialAngle};
        });
        assert(r.punchMove<0.2&&r.punchAngle<0.03,'ordinary melee should not jostle the settled foot camera: '+JSON.stringify(r));
        assert(r.specialMove<0.2&&r.specialAngle<0.03,'charged melee pose rotation should not jostle the foot camera: '+JSON.stringify(r));
      },
    },
  ],
};
