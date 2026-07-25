// R3 — bounded generic placement and static-only Turbo recovery.
module.exports = {
  cases: [
    {
      name: 'generic placement rejects water and static blockers with bounded clear candidates',
      query: '?dev=1&skipintro=1&seed=303',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const clear = intersections.find(p => genericSpawnClear(p, 0.5));
          const b = buildings[0];
          const fromWater = safeGenericSpawnPoint({ x: WATER_R + 8, z: 0 }, () => clear, 0.5, 1);
          const fromBuilding = safeGenericSpawnPoint({ x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 }, () => clear, 0.5, 1);
          return { clear: !!clear, waterClear: genericSpawnClear(fromWater, 0.5), buildingClear: genericSpawnClear(fromBuilding, 0.5) };
        });
        assert(r.clear && r.waterClear && r.buildingClear, 'expected water/building candidates to retry to a clear bounded point');
      },
    },
    {
      name: 'generic traffic and pedestrians stay clear when recycled from R2 pools',
      query: '?dev=1&skipintro=1&seed=304',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const before = traffic.length;
          spawnTraffic(1); const freshCar = traffic[traffic.length - 1];
          const freshCarClear = genericSpawnClear(freshCar, Math.max(CARTYPES[freshCar.type].w, CARTYPES[freshCar.type].l) * 0.5);
          retireTraffic(freshCar); spawnTraffic(1); const recycledCar = traffic[traffic.length - 1];
          const recycledCarClear = genericSpawnClear(recycledCar, Math.max(CARTYPES[recycledCar.type].w, CARTYPES[recycledCar.type].l) * 0.5);
          const b = blockInfo.find(b => b.type !== 'water');
          const freshPed = spawnPed(b); const freshPedClear = genericSpawnClear(freshPed, 0.42);
          retirePed(freshPed, false); const recycledPed = spawnPed(b); const recycledPedClear = genericSpawnClear(recycledPed, 0.42);
          return { before, traffic: traffic.length, freshCarClear, recycledCarClear, freshPedClear, recycledPedClear, reusedCar: recycledCar === freshCar, reusedPed: recycledPed === freshPed };
        });
        assert(r.traffic === r.before + 1 && r.freshCarClear && r.recycledCarClear && r.freshPedClear && r.recycledPedClear,
          'expected generic fresh/recycled traffic and peds to be clear of water/static blockers');
        assert(r.reusedCar && r.reusedPed, 'expected the test entities to exercise both R2 pools');
      },
    },
    {
      name: 'normal static collision clears immediately; persistent overlap gets one terrain-seated recovery',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const b = buildings[0], normal = { x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 };
          resolveFootCollision(normal, 0.5);
          const normalHit = buildingHit(normal.x, normal.z, 0.5);
          const normalClear = !normalHit || normalHit.depth <= 1e-6;
          const oldHit = staticBlockerHit, oldResolve = resolveStaticFootCollision;
          staticBlockerHit = () => ({ nx: 1, nz: 0, depth: 1 });
          resolveStaticFootCollision = () => {};
          const p = player; p.x = intersections[0].x; p.z = intersections[0].z; p.y = groundH(p.x, p.z); p.vy = 3;
          p.climb = null; p.bailing = false; G.mode = 'foot'; G.replay = false; activeCutscene = null; resetFootStuck(p);
          for (let i = 0; i < 5; i++) updateFootStuckRecovery(p, 0.1);
          const recovered = { nudged: p.stuckNudged, y: p.y, ground: footGround(p), vy: p.vy, x: p.x };
          updateFootStuckRecovery(p, 0.2); const oneNudgeX = p.x;
          staticBlockerHit = oldHit; resolveStaticFootCollision = oldResolve;
          return { normalClear, recovered, oneNudgeX };
        });
        assert(r.normalClear, 'expected normal resolveFootCollision to clear an artificial building overlap immediately');
        assert(r.recovered.nudged && Math.abs(r.recovered.y - r.recovered.ground) < 0.001 && r.recovered.vy === 0,
          'expected persistent static overlap to get one terrain-seated recovery');
        assert(r.oneNudgeX === r.recovered.x, 'expected persistent overlap recovery to make only one bounded nudge');
      },
    },
    {
      name: 'custom respawns and climb/bail/cinema states bypass generic recovery',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(async () => {
          const oldHit = staticBlockerHit, oldResolve = resolveStaticFootCollision;
          staticBlockerHit = () => ({ nx: 1, nz: 0, depth: 1 }); resolveStaticFootCollision = () => {};
          const p = player; p.x = intersections[0].x; p.z = intersections[0].z; p.y = groundH(p.x, p.z); G.mode = 'foot';
          const still = state => { p.climb = state === 'climb' ? {} : null; p.bailing = state === 'bail'; G.replay = state === 'cinema'; activeCutscene = null; const x = p.x, z = p.z; updateFootStuckRecovery(p, 1); return x === p.x && z === p.z; };
          const guarded = ['climb', 'bail', 'cinema'].every(still);
          p.climb = null; p.bailing = false; G.replay = false; staticBlockerHit = oldHit; resolveStaticFootCollision = oldResolve;
          const spot = { x: WATER_R - 5, z: 0 }; respawn(spot); await new Promise(resolve => setTimeout(resolve, 1900));
          return { guarded, x: player.x, z: player.z, spot };
        });
        assert(r.guarded, 'expected climbing, bailing, and cinema control to bypass recovery');
        assert(r.x === r.spot.x && r.z === r.spot.z, 'expected a custom shore respawn spot to remain exact');
      },
    },
  ],
};
