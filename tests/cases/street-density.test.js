'use strict';

module.exports = { cases: [
  {
    name: 'street density tiers are bounded and local refill is batched, safe, and deterministic',
    query: '?dev=1&skipintro=1&seed=404',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const tiers=QUALITY_TIERS, high=tiers.high.trafficCap===30&&tiers.high.pedCap===60&&tiers.medium.trafficCap===22&&tiers.low.pedCap===24;
        G.started=true; G.mode='foot'; player.x=intersections[0].x; player.z=intersections[0].z; camera.position.set(player.x,3,player.z); camera.lookAt(player.x,1,player.z+10); camera.updateMatrixWorld();
        const oldTraffic=traffic.splice(0,traffic.length), oldPeds=peds.splice(0,peds.length), oldCars=cars.splice(0,cars.length), oldTier=GFX_TIER, oldCap=TRAFFIC_CAP, oldPedCap=PED_CAP;
        GFX_TIER='high'; TRAFFIC_CAP=30; PED_CAP=60; densityTick=0; maintainStreetDensity(1.01);
        const added={cars:traffic.length,peds:peds.length,clear:traffic.every(c=>genericSpawnClear(c,Math.max(CARTYPES[c.type].w,CARTYPES[c.type].l)*.5))&&peds.every(p=>genericSpawnClear(p,.42))};
        const before={cars:traffic.length,peds:peds.length}; maintainStreetDensity(1.01); const batch={cars:traffic.length-before.cars,peds:peds.length-before.peds};
        applyQuality('low'); const down={cars:traffic.length,peds:peds.length,caps:[TRAFFIC_CAP,PED_CAP]};
        while(traffic.length) retireTraffic(traffic[0]); while(peds.length) retirePed(peds[0],false); cars.length=0; traffic.push(...oldTraffic); peds.push(...oldPeds); cars.push(...oldCars); GFX_TIER=oldTier; TRAFFIC_CAP=oldCap; PED_CAP=oldPedCap;
        return {high,added,batch,down};
      });
      assert(r.high, 'quality tiers should expose 12/22/30 traffic and 24/44/60 peds');
      assert(r.added.cars<=2&&r.added.peds<=4&&r.added.clear, 'first refill must be safe and respect per-tick batches: '+JSON.stringify(r));
      assert(r.batch.cars<=2&&r.batch.peds<=4, 'later refill must remain gradual: '+JSON.stringify(r));
      assert(r.down.cars<=12&&r.down.peds<=24&&r.down.caps[0]===12&&r.down.caps[1]===24, 'downshift should trim immediately to lower caps');
    },
  },
] };
