'use strict';
module.exports={cases:[{
  name:'dogs share an idempotent death path and leave capped harmless ghosts',query:'?dev=1&skipintro=1',
  run:async(page,{assert})=>{ const r=await page.evaluate(()=>{
    const pd=spawnPed(blockInfo[0],'local'); if(!pd.dog) attachDog(pd); const leash=pd.dog;
    damageDog(leash,999); const once=dogGhosts.length;
    damageDog(leash,999);
    const mesh=makeDog();scene.add(mesh);const stray=makeStray({mesh,x:player.x,z:player.z,hp:70});
    damageDog(stray,999,true); const straysGone=!strayDogs.includes(stray);
    for(let i=0;i<10;i++){ const m=makeDog();scene.add(m); const d=makeStray({mesh:m,x:player.x,z:player.z,hp:1}); damageDog(d,2,true); }
    const capped=dogGhosts.length; updateDogGhosts(30.1);
    return {once,leashGone:!pd.dog,straysGone,capped,left:dogGhosts.length};
  }); assert(r.once===1&&r.leashGone&&r.straysGone,'dogs should die once and detach: '+JSON.stringify(r)); assert(r.capped===8&&r.left===0,'ghosts should cap and expire: '+JSON.stringify(r)); }
}]};
