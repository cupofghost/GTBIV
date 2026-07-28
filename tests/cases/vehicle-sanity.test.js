'use strict';

module.exports = {
  cases: [
    {
      name: 'seeded civilian traffic stays lane-bounded and travels several blocks without embeds or pileups',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.mode = 'foot'; G.replay = false; activeCutscene = null;
          player.car = null; player.x = H + 100; player.z = H + 100;
          const metrics = new Map(traffic.map(c => [c, {
            distance: 0, maxHeadingStep: 0, straightSteerFlips: 0, lastStraightSign: 0, embeds: 0,
          }]));
          let massPileupFrames = 0, maxClosePairs = 0;
          for (let frame = 0; frame < 1200; frame++) {
            const before = new Map(traffic.map(c => [c, {
              x: c.x, z: c.z, heading: c.heading, recoveries: c.recoveryCount || 0,
            }]));
            updateLights(0.05);
            updateTraffic(0.05);
            let closePairs = 0;
            for (let i = 0; i < traffic.length; i++) {
              const c = traffic[i], b = before.get(c), m = metrics.get(c);
              if (!b || !m) continue;
              m.distance += Math.hypot(c.x - b.x, c.z - b.z);
              if ((c.recoveryCount || 0) === b.recoveries)
                m.maxHeadingStep = Math.max(m.maxHeadingStep, Math.abs(angDiff(b.heading, c.heading)));
              if (trafficStaticEmbedded(c)) m.embeds++;
              if (c.trafficPhase === 'drive') {
                const d = Math.hypot(c.laneTarget.x - c.x, c.laneTarget.z - c.z);
                if (d > 18) {
                  const sign = Math.abs(angDiff(c.heading, Math.atan2(c.laneTarget.x - c.x, c.laneTarget.z - c.z))) > 0.08
                    ? Math.sign(angDiff(c.heading, Math.atan2(c.laneTarget.x - c.x, c.laneTarget.z - c.z))) : 0;
                  if (sign && m.lastStraightSign && sign !== m.lastStraightSign) m.straightSteerFlips++;
                  if (sign) m.lastStraightSign = sign;
                }
              }
              for (let j = i + 1; j < traffic.length; j++) {
                if (Math.hypot(c.x - traffic[j].x, c.z - traffic[j].z) < 2.2) closePairs++;
              }
            }
            maxClosePairs = Math.max(maxClosePairs, closePairs);
            if (closePairs >= 4) massPileupFrames++;
          }
          const values = [...metrics.values()];
          return {
            count: traffic.length,
            meanDistance: values.reduce((n, m) => n + m.distance, 0) / values.length,
            maxHeadingStep: Math.max(...values.map(m => m.maxHeadingStep)),
            carsWithEmbeds: values.filter(m => m.embeds > 0).length,
            totalEmbedFrames: values.reduce((n, m) => n + m.embeds, 0),
            meanStraightFlips: values.reduce((n, m) => n + m.straightSteerFlips, 0) / values.length,
            maxStraightFlips: Math.max(...values.map(m => m.straightSteerFlips)),
            maxClosePairs, massPileupFrames,
          };
        });
        assert(r.count >= 28, 'traffic density collapsed: ' + JSON.stringify(r));
        assert(r.meanDistance > 264, 'traffic did not average several blocks: ' + JSON.stringify(r));
        assert(r.maxHeadingStep < 0.065, 'a civilian car spun or exceeded bounded steering: ' + JSON.stringify(r));
        assert(r.carsWithEmbeds === 0 && r.totalEmbedFrames === 0, 'civilian traffic entered static footprints: ' + JSON.stringify(r));
        assert(r.meanStraightFlips < 3 && r.maxStraightFlips < 12, 'traffic chronically weaved on straight legs: ' + JSON.stringify(r));
        assert(r.maxClosePairs < 4 && r.massPileupFrames === 0, 'traffic formed a mass pileup: ' + JSON.stringify(r));
      },
    },
    {
      name: 'ordinary civilian traffic is explicitly jackable and leaves traffic control when stolen',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          mission = null; G.mode = 'foot'; player.car = null;
          const sample = traffic.filter(c => c.driver === 'civ' && c.type !== 'cop').slice(0, 12);
          const explicit = sample.every(c => c.jackable === true && isCarJackable(c));
          const car = sample[0];
          player.x = car.x + Math.cos(car.heading) * 2.6;
          player.z = car.z - Math.sin(car.heading) * 2.6;
          player.y = groundH(player.x, player.z);
          updateFoot(0.01);
          const label = document.getElementById('btnEnter').textContent;
          const stealClass = document.getElementById('btnEnter').classList.contains('steal');
          doEnterExit();
          const claimed = G.mode === 'car' && player.car === car && car.driver === 'player' &&
            cars.includes(car) && !traffic.includes(car);
          exitCar();
          player.x = car.x + Math.cos(car.heading) * 2.6;
          player.z = car.z - Math.sin(car.heading) * 2.6;
          const nearbyAgain = nearestVehicle(player.x, player.z, 3.6);
          const rejackable = isCarJackable(car) && nearbyAgain && nearbyAgain.v === car;
          const cop = makeCar('cop', car.x + 20, car.z, 0, { driver: 'cop' });
          const copBlocked = !isCarJackable(cop);
          const missionCar = sample[1]; mission = { type: 'takedown', car: missionCar, timer: 50, reward: 260 };
          const missionBlocked = !isCarJackable(missionCar);
          mission = null;
          return { sampled: sample.length, explicit, label, stealClass, claimed, rejackable, copBlocked, missionBlocked };
        });
        assert(r.sampled === 12 && r.explicit, 'sampled ordinary civilian cars must be explicitly jackable: ' + JSON.stringify(r));
        assert(/^STEAL /.test(r.label) && r.stealClass, 'live civilian traffic must use the large STEAL control: ' + JSON.stringify(r));
        assert(r.claimed && r.rejackable, 'stale traffic state must not survive a jack/exit cycle: ' + JSON.stringify(r));
        assert(r.copBlocked && r.missionBlocked, 'documented police/mission classes must remain non-jackable: ' + JSON.stringify(r));
      },
    },
    {
      name: 'embedded generic traffic recovers to a valid road or retires while protected classes stay untouched',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          mission = null;
          const b = buildings[0], cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
          const recoveredCar = traffic[0];
          recoveredCar.x = cx; recoveredCar.z = cz; recoveredCar.mesh.position.set(cx, groundH(cx, cz), cz);
          const wasEmbedded = trafficStaticEmbedded(recoveredCar);
          const recovered = recoverEmbeddedTraffic(recoveredCar);
          const recoveredClear = !trafficStaticEmbedded(recoveredCar) &&
            genericSpawnClear(recoveredCar, trafficCarRadius(recoveredCar));
          const recoveredActive = traffic.includes(recoveredCar) && cars.includes(recoveredCar) &&
            recoveredCar.mesh.visible && isCarJackable(recoveredCar);

          const protectedCar = traffic[1];
          protectedCar.x = cx; protectedCar.z = cz; mission = { type: 'takedown', car: protectedCar, timer: 50, reward: 260 };
          const protectedX = protectedCar.x, protectedZ = protectedCar.z;
          const protectedResult = recoverEmbeddedTraffic(protectedCar);
          const protectedUntouched = protectedResult === 'protected' && protectedCar.x === protectedX &&
            protectedCar.z === protectedZ && traffic.includes(protectedCar) && cars.includes(protectedCar);
          mission = null;

          const failedCar = traffic.find(c => c !== recoveredCar && c !== protectedCar);
          failedCar.x = cx; failedCar.z = cz;
          const oldClear = trafficSpawnClear;
          trafficSpawnClear = () => false;
          const failedResult = recoverEmbeddedTraffic(failedCar);
          trafficSpawnClear = oldClear;
          const safelyRetired = failedResult === 'retired' && !traffic.includes(failedCar) &&
            !cars.includes(failedCar) && trafficPool.includes(failedCar) && !failedCar.mesh.visible;
          return { wasEmbedded, recovered, recoveredClear, recoveredActive, protectedUntouched, safelyRetired };
        });
        assert(r.wasEmbedded && r.recovered === 'recovered' && r.recoveredClear && r.recoveredActive,
          'embedded generic car did not recover to an active, clear, jackable road state: ' + JSON.stringify(r));
        assert(r.protectedUntouched, 'mission traffic must not be recovered or recycled: ' + JSON.stringify(r));
        assert(r.safelyRetired, 'failed generic recovery must leave no stranded/unjackable active car: ' + JSON.stringify(r));
      },
    },
    {
      name: 'car impacts scale with relative speed and fire once per contact window',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          DEV_STATE.god = false; G.mode = 'foot'; G.over = false; player.car = null;
          player.moveMag = 0; player.sprinting = false;
          const node = intersections[5], car = makeCar('sedan', node.x, node.z, 0, { parked: true });
          const hitAt = speed => {
            G.hp = 100; G.hpT = 0; G.over = false; player.stunT = 0;
            player.x = car.x; player.z = car.z + 0.6; player.y = groundH(player.x, player.z);
            car.vel.set(0, 0, speed); car.speed = speed; car.turboContact = false; car.turboImpactT = 0;
            applyCarTurboImpact(car);
            return { damage: 100 - G.hp, stun: player.stunT || 0 };
          };
          const impacts = [2, 8, 16, 30].map(hitAt);

          G.hp = 100; G.over = false; player.stunT = 0;
          player.x = car.x; player.z = car.z + 0.6;
          car.vel.set(0, 0, 20); car.turboContact = false; car.turboImpactT = 0;
          const first = applyCarTurboImpact(car), hpAfterFirst = G.hp;
          player.x = car.x; player.z = car.z + 0.6;
          const sameOverlap = applyCarTurboImpact(car), hpAfterOverlap = G.hp;
          player.x = car.x + 20; player.z = car.z; applyCarTurboImpact(car);
          player.x = car.x; player.z = car.z + 0.6;
          const duringCooldown = applyCarTurboImpact(car), hpDuringCooldown = G.hp;
          player.x = car.x + 20; applyCarTurboImpact(car);
          car.turboImpactT = 0; player.x = car.x; player.z = car.z + 0.6;
          const nextContact = applyCarTurboImpact(car);

          const extreme = hitAt(60);
          return {
            impacts, first, hpAfterFirst, sameOverlap, hpAfterOverlap,
            duringCooldown, hpDuringCooldown, nextContact, extreme, wasted: G.over,
          };
        });
        const d = r.impacts.map(v => v.damage);
        assert(d[0] === 0 && d[1] > d[0] && d[2] > d[1] && d[3] > d[2],
          'impact damage must rise monotonically from a harmless nudge: ' + JSON.stringify(r));
        assert(r.impacts[1].stun > 0 && r.first > 0, 'a meaningful hit must damage and react: ' + JSON.stringify(r));
        assert(r.sameOverlap === 0 && r.hpAfterOverlap === r.hpAfterFirst &&
          r.duringCooldown === 0 && r.hpDuringCooldown === r.hpAfterFirst && r.nextContact > 0,
          'one overlap/cooldown window must create exactly one damage event: ' + JSON.stringify(r));
        assert(r.extreme.damage >= 100 && r.wasted, 'an extreme hit must use the normal WASTED flow: ' + JSON.stringify(r));
      },
    },
    {
      name: 'OP2-G: critical car damage halves the detonation fuse into one retained explosion with no mushroom cloud',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const node = intersections[6];
          const car = makeCar('sedan', node.x, node.z, 0, { parked: true });
          player.car = car; car.burning = false; car.burnT = 0;
          damageCar(car, car.maxhp - 20); // hp -> 20, crossing the <=22 critical threshold without reaching 0
          const fuseAtCritical = car.burnT;
          const noMushroomGlobals = typeof boomFx === 'undefined' && typeof makeMushroomCloud === 'undefined';
          const fireballsBefore = fireballs.length;
          const nearCar = makeCar('sedan', car.x + CAR_BOOM_RADIUS - 1, car.z, 0, { parked: true });
          const farCar = makeCar('sedan', car.x + CAR_BOOM_RADIUS + 3, car.z, 0, { parked: true });
          killCar(car, true);
          const fireballsAfter = fireballs.length;
          const nearDamaged = nearCar.hp < nearCar.maxhp;
          const farUntouched = farCar.hp === farCar.maxhp;
          const stillDead = car.dead;
          killCar(car, true); // a dead car must never detonate twice
          const fireballsAfterRepeat = fireballs.length;
          return {
            fuseAtCritical, noMushroomGlobals, fireballsBefore, fireballsAfter, fireballsAfterRepeat,
            nearDamaged, farUntouched, stillDead, radius: CAR_BOOM_RADIUS, fuseConst: CAR_CRITICAL_FUSE,
          };
        });
        assert(r.fuseConst === 15 && r.fuseAtCritical === 15,
          'critical fuse must be halved from the 30s baseline to 15s: ' + JSON.stringify(r));
        assert(r.noMushroomGlobals, 'the mushroom-cloud presentation must be fully removed: ' + JSON.stringify(r));
        assert(r.fireballsAfter === r.fireballsBefore + 1,
          'exactly one retained explosion effect must spawn per detonation: ' + JSON.stringify(r));
        assert(r.nearDamaged && r.farUntouched,
          'blast damage must match the single documented CAR_BOOM_RADIUS constant: ' + JSON.stringify(r));
        assert(r.stillDead && r.fireballsAfterRepeat === r.fireballsAfter,
          'a dead car must not detonate a second time: ' + JSON.stringify(r));
      },
    },
  ],
};
