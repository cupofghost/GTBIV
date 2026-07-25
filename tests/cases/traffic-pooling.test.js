'use strict';

// Focused lifecycle coverage for R2. Each case gets a fresh game page, so the
// pools start empty and the assertions can identify the object being recycled.
module.exports = [
  {
    name: 'generic traffic retires inactive and reuses its mesh',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        mission=null;
        const car=traffic[0], mesh=car.mesh;
        killCar(car,false);
        const retired={ active:traffic.includes(car)||cars.includes(car), hidden:!mesh.visible,
          pooled:trafficPool.includes(car), poolSize:trafficPool.length };
        spawnTraffic(1);
        return { retired, reused:traffic.includes(car), sameMesh:car.mesh===mesh,
          poolSize:trafficPool.length, activeOnly:traffic.every(c=>c.mesh.visible&&cars.includes(c)) };
      });
      assert(!r.retired.active, 'retired traffic must leave both active arrays');
      assert(r.retired.hidden&&r.retired.pooled, 'retired traffic must be hidden in the free-list');
      assert(r.reused&&r.sameMesh&&r.poolSize===0, 'spawn should reuse the pooled car mesh');
      assert(r.activeOnly, 'only visible traffic may remain active');
    },
  },
  {
    name: 'downed ped releases its dog and stale UI links before reuse',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        pedPool.pop(); // the live boot can fill the bounded pool before this focused case starts
        const ped=peds[0], partner=peds[1];
        if(!ped.dog) attachDog(ped);
        const dog=ped.dog;
        ped.partner=partner; partner.partner=ped; partner.kind='chat';
        ped.bub=document.createElement('div'); document.body.appendChild(ped.bub);
        ped.state='down'; ped.downT=0;
        retirePed(ped,true);
        const retired={ pooled:pedPool.includes(ped), inactive:!peds.includes(ped)&&!ped.mesh.visible,
          stray:strayDogs.some(d=>d.mesh===dog.mesh&&d.orphaned), partnerCleared:partner.partner===null&&partner.kind==='local' };
        const revived=spawnPed(pick(blockInfo));
        return { retired, reused:revived===ped, dog:revived.dog, bub:revived.bub,
          partner:revived.partner, active:peds.includes(revived)&&revived.mesh.visible };
      });
      assert(r.retired.pooled&&r.retired.inactive, 'downed ped must leave active simulation before pooling');
      assert(r.retired.stray, 'a downed ped\'s dog must become an orphaned stray');
      assert(r.retired.partnerCleared, 'the former chat partner must not retain a pooled reference');
      assert(r.reused&&r.active&&!r.dog&&!r.bub&&!r.partner, 'revived ped must not inherit dog, bubble, or partner state');
    },
  },
  {
    name: 'F3 population trimming pools only inactive entities',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        TRAFFIC_CAP=1; PED_CAP=1; trimToCaps();
        return {
          trafficCap:traffic.length<=TRAFFIC_CAP, pedCap:peds.length<=PED_CAP,
          trafficInactive:trafficPool.every(c=>!c.mesh.visible&&!traffic.includes(c)&&!cars.includes(c)),
          pedsInactive:pedPool.every(p=>!p.mesh.visible&&!peds.includes(p)),
        };
      });
      assert(r.trafficCap&&r.pedCap, 'trim must honor the active F3 caps');
      assert(r.trafficInactive&&r.pedsInactive, 'pooled entities must stay outside active arrays');
    },
  },
  {
    name: 'mission target traffic is permanently retired, never recycled early',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const car=traffic[0]; mission={type:'takedown',car,timer:50,reward:260};
        killCar(car,false);
        spawnTraffic(1);
        return { dead:car.dead, pooled:trafficPool.includes(car), active:traffic.includes(car)||cars.includes(car),
          reused:traffic.includes(car), missionStillPoints:mission.car===car };
      });
      assert(r.dead&&r.missionStillPoints, 'the mission must retain its dead target until it resolves');
      assert(!r.pooled&&!r.active&&!r.reused, 'a mission target must not enter or return from the traffic pool');
    },
  },
];
