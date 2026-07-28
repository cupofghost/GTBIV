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
  },
  {
    // OP2-C. The charged-melee pass gated every attack on canChargeMelee(), so an
    // ordinary punch or kick was swallowed whole in states the wind-up refuses.
    // These are the states the owner actually plays through.
    name:'an ordinary punch and kick still land while crouched, indoors, airborne or up on something',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player, spot=intersections[0];
        const base=()=>{ G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.paused=false;
          G.replay=false;G.interior=false;G.weapon='fists';G.crouching=false;
          p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.vy=0;p.climb=null;p.bailing=false;p.stunT=0;
          p.punchT=0;p.kickT=0;p.meleeSpecial=null;meleeCharge=null; };
        const tap=kind=>{ p.punchT=0;p.kickT=0; meleePress(kind); meleeRelease(kind);
          return kind==='kick'?p.kickT>0:p.punchT>0; };
        const at=setup=>{ base(); setup(); return {punch:tap('punch'),kick:tap('kick')}; };
        return {
          flat:at(()=>{}),
          jumping:at(()=>{ p.vy=8.6; p.y=footGround(p)+0.5; }),
          crouched:at(()=>{ G.crouching=true; }),
          indoors:at(()=>{ G.interior=true; }),
          onALedge:at(()=>{ p.y=footGround(p)+0.5; p.vy=0; }),
          // the wind-up is still refused in every one of those
          chargeable:(()=>{ base(); const flat=canChargeMelee(); G.crouching=true; const c=canChargeMelee();
            G.crouching=false; p.y=footGround(p)+0.5; const air=canChargeMelee(); base();
            return {flat,crouched:c,airborne:air}; })(),
          // and a state where he genuinely cannot fight still refuses
          stunned:at(()=>{ p.stunT=0.4; }),
        };
      });
      ['flat','jumping','crouched','indoors','onALedge'].forEach(k=>
        assert(r[k].punch&&r[k].kick,`ordinary melee should land while ${k}: `+JSON.stringify(r)));
      assert(r.chargeable.flat&&!r.chargeable.crouched&&!r.chargeable.airborne,
        'the charged wind-up should still need both feet planted: '+JSON.stringify(r));
      assert(!r.stunned.punch&&!r.stunned.kick,'a stunned Turbo should not swing: '+JSON.stringify(r));
    }
  },
  {
    name:'melee survives 120 mixed attacks across every interruption and always ends neutral',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player, spot=intersections[0];
        const place=()=>{ p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.vy=0;p.heading=0; };
        const revive=()=>{ G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.paused=false;
          G.replay=false;G.interior=false;G.weapon='fists';G.crouching=false;
          p.climb=null;p.bailing=false;p.stunT=0; place(); };
        revive(); p.punchT=0;p.kickT=0;p.meleeSpecial=null;meleeCharge=null;
        // deterministic order, so a failure is reproducible
        let rs=987654321; const rnd=()=>{rs=(rs*1664525+1013904223)>>>0; return rs/4294967296;};
        const cuts=[
          ['enter a car',   ()=>{ endMelee(); G.mode='car'; }],
          ['bail out',      ()=>{ endMelee(); p.bailing=true; p.chute=false; p.fallVX=0; p.fallVZ=0; p.y=footGround(p)+9; }],
          ['pause',         ()=>{ endMelee(); G.menuPaused=true;G.paused=true; }],
          ['cinema',        ()=>{ endMelee(); G.replay=true; }],
          ['wasted',        ()=>{ endMelee(); G.over=true; }],
          ['grab a ladder', ()=>{ endMelee(); if(LADDERS[0]) mountLadder({L:LADDERS[0],from:'bottom'}); }],
          ['take a hit',    ()=>{ p.stunT=0.6; }],
          ['swap weapon',   ()=>{ G.weapon='pistol'; }],
          ['crouch',        ()=>{ G.crouching=true; }],
          ['uninterrupted', ()=>{}],
        ];
        const run=(n,dt)=>{ for(let i=0;i<n;i++) if(G.mode==='foot'&&!G.over&&!G.paused&&!G.replay) updateFoot(dt); };
        let landed=0, swallowed=[], stuck=[];
        for(let i=0;i<120;i++){
          const kind=rnd()<0.5?'punch':'kick', hold=rnd()<0.45;
          meleePress(kind);
          if(hold) run(70,0.017);            // >1s: escalates into the special
          meleeRelease(kind);
          if(p.meleeSpecial||p.punchT>0||p.kickT>0) landed++;
          else if(swallowed.length<6) swallowed.push({i,kind,hold});
          const [name,cut]=cuts[Math.floor(rnd()*cuts.length)];
          run(1+Math.floor(rnd()*22),0.017);  // interrupt part-way through
          cut();
          run(4,0.017); revive(); run(90,0.017);
          if((p.meleeSpecial||p.punchT>0||p.kickT>0||meleeCharge)&&stuck.length<6)
            stuck.push({i,kind,hold,cut:name,punchT:+p.punchT.toFixed(3),kickT:+p.kickT.toFixed(3),
              special:p.meleeSpecial&&p.meleeSpecial.type,charge:!!meleeCharge});
        }
        const u=p.mesh.userData;
        return {landed,swallowed,stuck,canStillCharge:canChargeMelee(),canStillMelee:canMelee(),
          neutral:{pitch:+p.mesh.rotation.x.toFixed(4),order:p.mesh.rotation.order,
            armL:+u.armL.rotation.x.toFixed(4),armR:+u.armR.rotation.x.toFixed(4),
            legL:+u.legL.rotation.x.toFixed(4),legR:+u.legR.rotation.x.toFixed(4)}};
      });
      assert(r.landed===120,'every one of 120 mixed attacks should register: '+JSON.stringify(r.swallowed));
      assert(r.stuck.length===0,'no attack should outlive its interruption: '+JSON.stringify(r.stuck));
      assert(r.canStillMelee&&r.canStillCharge,'melee should still be available at the end: '+JSON.stringify(r));
      const n=r.neutral;
      assert(n.pitch===0&&n.order==='XYZ'&&n.armL===0&&n.armR===0&&n.legL===0&&n.legR===0,
        'the rig should be back at neutral: '+JSON.stringify(n));
    }
  },
  {
    // The peak of the charged kick: a standing, planted, horizontal figure —
    // not a body laid flat in the asphalt, which is what rotating the whole rig
    // about its floor-level origin used to give.
    name:'the charged kick holds a planted horizontal pose with only the support foot on the ground',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player,u=p.mesh.userData,spot=intersections[0];
        G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.replay=false;G.interior=false;
        G.weapon='fists';G.crouching=false;
        p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0.7;p.climb=null;p.bailing=false;
        p.stunT=0;p.punchT=0;p.kickT=0;p.meleeSpecial=null;meleeCharge=null;
        const ground=groundH(p.x,p.z), root={x:p.x,y:p.y,z:p.z};
        const V=new THREE.Vector3(), Q=new THREE.Quaternion();
        const world=o=>{ o.getWorldPosition(V); return {x:V.x,y:V.y,z:V.z}; };
        const limbDir=o=>{ o.getWorldQuaternion(Q); return new THREE.Vector3(0,-1,0).applyQuaternion(Q); };
        // lowest point of any mesh in the rig, ignoring the ground-plane blob shadow
        const lowest=()=>{ let lo=1e9;
          p.mesh.traverse(o=>{ const gm=o.geometry;
            if(!gm||!gm.attributes||!gm.attributes.position||gm.type==='CircleGeometry') return;
            const a=gm.attributes.position;
            for(let i=0;i<a.count;i++){ V.fromBufferAttribute(a,i); o.localToWorld(V); if(V.y<lo) lo=V.y; } });
          return lo; };
        meleePress('kick'); updateFoot(1.001);
        let held=0, worstLow=1e9, rootDrift=0, peak=null, spins=new Set();
        for(let i=0;i<80;i++){
          updateFoot(0.017); if(!p.meleeSpecial) break;
          p.mesh.updateMatrixWorld(true);
          rootDrift=Math.max(rootDrift,Math.hypot(p.x-root.x,p.z-root.z),Math.abs(p.y-root.y));
          worstLow=Math.min(worstLow,lowest()-ground);
          if(Math.abs(p.mesh.rotation.x-Math.PI/2)>1e-3) continue;
          held++;
          spins.add(Math.round(p.mesh.rotation.y*4/Math.PI));
          const yaw=p.mesh.rotation.y, f={x:Math.sin(yaw),z:Math.cos(yaw)};
          const dL=limbDir(u.legL), dR=limbDir(u.legR), aR=limbDir(u.armR), aL=limbDir(u.armL);
          const foot=u.kneeL.localToWorld(new THREE.Vector3(0,-0.42,0));
          const torso=world(u.torso), head=world(u.head), sh=world(u.armR);
          peak={
            supportLegDown:+dL.y.toFixed(3),
            plantedFootY:+(foot.y-ground).toFixed(3),
            plantedFootOverHip:+Math.hypot(foot.x-p.x,foot.z-p.z).toFixed(2),
            freeLegBack:+(dR.x*f.x+dR.z*f.z).toFixed(3), freeLegLevel:+dR.y.toFixed(3),
            armRFwd:+(aR.x*f.x+aR.z*f.z).toFixed(3), armLFwd:+(aL.x*f.x+aL.z*f.z).toFixed(3),
            armLevel:+aR.y.toFixed(3),
            torsoY:+(torso.y-ground).toFixed(3), headY:+(head.y-ground).toFixed(3),
            shoulderY:+(sh.y-ground).toFixed(3),
          };
        }
        return {held,worstLow:+worstLow.toFixed(3),rootDrift:+rootDrift.toFixed(4),peak,
          spinSamples:spins.size,ended:!p.meleeSpecial,
          rest:{pitch:+p.mesh.rotation.x.toFixed(4),y:+(p.mesh.position.y-p.y).toFixed(4)}};
      });
      assert(r.held>10,'the silhouette should be held, not flashed through: '+JSON.stringify(r));
      const k=r.peak;
      assert(k.supportLegDown<-0.999,'the support leg should be dead vertical: '+JSON.stringify(k));
      assert(Math.abs(k.plantedFootY)<0.06&&k.plantedFootOverHip<0.25,
        'the support foot should be planted on the ground under the hip: '+JSON.stringify(k));
      assert(k.freeLegBack<-0.99&&Math.abs(k.freeLegLevel)<0.02,
        'the free leg should extend straight back and level: '+JSON.stringify(k));
      assert(k.armRFwd>0.99&&k.armLFwd>0.99&&Math.abs(k.armLevel)<0.02,
        'both arms should extend straight forward and level: '+JSON.stringify(k));
      // torso, head and shoulders all ride the same horizontal line at waist height
      assert(Math.abs(k.torsoY-k.headY)<0.02&&Math.abs(k.torsoY-k.shoulderY)<0.02,
        'the body should be parallel to the ground: '+JSON.stringify(k));
      assert(k.torsoY>0.6&&k.torsoY<1.2,'the body should sit at about waist height: '+JSON.stringify(k));
      assert(r.worstLow>-0.06,'nothing but the planted foot should enter the ground: '+JSON.stringify(r));
      assert(r.rootDrift===0,'the collision root must not move or change height: '+JSON.stringify(r));
      assert(r.spinSamples>3,'the kick should still spin through the hold: '+JSON.stringify(r));
      assert(r.ended&&r.rest.pitch===0&&r.rest.y===0,'it should end flat and back on its feet: '+JSON.stringify(r));
    }
  }
]};
