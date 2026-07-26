'use strict';

module.exports={cases:[
  {
    name:'charged punch and kick start after one second, complete three rounds, and restore the pose',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player, spot=intersections[0],u=p.mesh.userData;
        const prep=()=>{
          G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.replay=false;G.interior=false;G.weapon='fists';G.crouching=false;
          p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;p.climb=null;p.bailing=false;p.stunT=0;p.punchT=0;p.kickT=0;p.meleeSpecial=null;meleeCharge=null;
          p.mesh.rotation.set(0,0,0);u.armL.rotation.x=0;u.armR.rotation.x=0;u.legL.rotation.x=0;u.legR.rotation.x=0;
        };
        prep(); meleePress('kick'); updateFoot(.99); const tap=!!p.meleeSpecial; meleeRelease('kick'); const ordinary=p.kickT>0;
        prep(); meleePress('kick'); updateFoot(1.001); const kick=p.meleeSpecial; updateFoot(1.05);
        const kickDone=!p.meleeSpecial&&p.mesh.rotation.x===0&&u.armL.rotation.x===0&&u.legR.rotation.x===0;
        prep(); meleePress('punch'); const punchCharged=!!meleeCharge, punchEligible=canChargeMelee(); updateFoot(1.001); const punch=p.meleeSpecial, punchChargeAfter=meleeCharge&&{t:meleeCharge.t,started:meleeCharge.started};
        updateFoot(.84);
        const punchDone=!p.meleeSpecial&&p.mesh.rotation.x===0&&u.armL.rotation.x===0&&u.armR.rotation.x===0;
        return {tap,ordinary,punchCharged,punchEligible,punchChargeAfter,kickTurns:kick&&kick.dur===1.05,kickDone,punchTurns:punch&&punch.dur===.84,punchDone,
          state:{mode:G.mode,weapon:G.weapon,crouching:G.crouching,y:p.y,ground:footGround(p),stun:p.stunT,punchT:p.punchT,kickT:p.kickT}};
      });
      assert(!r.tap&&r.ordinary,'short hold should make exactly one ordinary kick: '+JSON.stringify(r));
      assert(r.punchCharged&&r.kickTurns&&r.kickDone&&r.punchTurns&&r.punchDone,'both charged moves should run, complete, and restore their pose: '+JSON.stringify(r));
    }
  },
  {
    name:'windmill hits front and rear but not sides; spin kick hits the full radius once per round',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player,spot=intersections[0];
        G.mode='foot';G.started=true;G.over=false;G.weapon='fists';G.heat=0;
        p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;
        const make=(x,z)=>({x,z,hp:100,state:'chase'});
        const front=make(p.x,p.z+2),back=make(p.x,p.z-2),side=make(p.x+2,p.z);
        jocks.push(front,back,side);
        const punch={type:'punch',t:.1,dur:.84,x:p.x,z:p.z,y:p.y,heading:0,lastRev:-1,hits:new Set()};
        chargedMeleeHit(punch); const first={front:front.hp,back:back.hp,side:side.hp};
        chargedMeleeHit(punch); const duplicate={front:front.hp,back:back.hp,side:side.hp};
        front.x=p.x;front.z=p.z+2;back.x=p.x;back.z=p.z-2;punch.t=.3;chargedMeleeHit(punch);
        const nextRound={front:front.hp,back:back.hp,side:side.hp};
        const kickSide=make(p.x+2,p.z);jocks.push(kickSide);
        const kick={type:'kick',t:.1,dur:1.05,x:p.x,z:p.z,y:p.y,heading:0,lastRev:-1,hits:new Set()};
        chargedMeleeHit(kick);
        [front,back,side,kickSide].forEach(a=>{const i=jocks.indexOf(a);if(i>=0)jocks.splice(i,1);});
        return {first,duplicate,nextRound,kickSide:kickSide.hp};
      });
      assert(r.first.front===78&&r.first.back===78&&r.first.side===100,'windmill should hit front/rear only: '+JSON.stringify(r));
      assert(r.duplicate.front===78&&r.duplicate.back===78,'an enemy should be hit at most once per round: '+JSON.stringify(r));
      assert(r.nextRound.front===56&&r.nextRound.back===56&&r.nextRound.side===100,'next revolution should permit one more front/rear hit: '+JSON.stringify(r));
      assert(r.kickSide===72,'spin kick should hit a side target inside its full radius: '+JSON.stringify(r));
    }
  }
]};
