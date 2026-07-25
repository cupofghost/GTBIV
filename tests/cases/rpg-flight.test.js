'use strict';

module.exports = { cases: [
  {
    name: 'RPG direction is frozen: level and pitched rounds keep their original straight slope',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const oldGround=groundH, oldBuildings=buildings.splice(0,buildings.length);
        groundH=()=>-1000;
        const mk=(dir)=>{ const mesh=new THREE.Object3D(); scene.add(mesh); const r={x:0,y:10,z:0,dir,speed:46,life:3,mesh,snd:null}; rockets.push(r); return r; };
        const flat=mk({x:1,y:0,z:0}), up=mk({x:0,y:0.5,z:Math.sqrt(.75)}), down=mk({x:0,y:-0.5,z:Math.sqrt(.75)});
        updateRockets(.1); const a=[flat.y,up.y,down.y];
        player.heading=2.2; camPitch=.9; updateRockets(.1); const b=[flat.y,up.y,down.y];
        for(const q of [flat,up,down]){ scene.remove(q.mesh); rockets.splice(rockets.indexOf(q),1); }
        buildings.push(...oldBuildings); groundH=oldGround;
        return { a,b, flatX:flat.x, upZ:up.z, downZ:down.z };
      });
      assert(r.a[0] === 10 && r.b[0] === 10, 'horizontal RPG should keep a constant altitude');
      assert(Math.abs((r.b[1]-r.a[1])-2.3)<.001 && Math.abs((r.b[2]-r.a[2])+2.3)<.001,
        'upward/downward RPGs should preserve their initial slope after camera/player changes');
      assert(r.flatX > 9 && r.upZ > 7 && r.downZ > 7, 'stored direction should continue advancing each rocket');
    },
  },
  {
    name: 'RPG substeps hit thin buildings/cars and terrain, then clean up exactly once',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const oldGround=groundH, oldBuildings=buildings.splice(0,buildings.length), oldCars=cars.splice(0,cars.length), oldExplode=explode;
        let booms=0, stops=0; explode=()=>booms++;
        const launch=(dir,y=5)=>{ const mesh=new THREE.Object3D(); scene.add(mesh); const q={x:0,y,z:0,dir,speed:46,life:3,mesh,snd:{update(){},stop(){stops++;}}}; rockets.push(q); return q; };
        groundH=()=>-1000; buildings.push({minX:2,maxX:2.2,minZ:-1,maxZ:1,baseY:0,h:20}); launch({x:1,y:0,z:0}); updateRockets(.05);
        buildings.length=0; cars.push({x:2,z:0,dead:false}); launch({x:1,y:0,z:0}); updateRockets(.05);
        cars.length=0; groundH=()=>5; launch({x:1,y:0,z:0}); updateRockets(.05);
        groundH=()=>-1000; const expired=launch({x:1,y:0,z:0}); expired.life=0; updateRockets(.016);
        explode=oldExplode; groundH=oldGround; buildings.push(...oldBuildings); cars.push(...oldCars);
        return { booms,stops,left:rockets.length };
      });
      assert(r.booms===4 && r.stops===4 && r.left===0, 'each terrain/object/expiry impact should explode and dispose exactly once: '+JSON.stringify(r));
    },
  },
] };
