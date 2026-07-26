'use strict';

const fs=require('fs');
const path=require('path');
const artifactDir=process.env.GTB_TEST_ARTIFACT_DIR||'';

module.exports={cases:[
  {
    name:'charged punch and kick start after one second, complete three rounds, and restore the pose',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player, spot=intersections[0],u=p.mesh.userData;
        const prep=()=>{
          interruptMelee();
          G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.replay=false;G.interior=false;G.weapon='fists';G.crouching=false;
          p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.vy=0;p.heading=0;p.climb=null;p.bailing=false;p.stunT=0;
          p.mesh.position.set(p.x,p.y,p.z);p.mesh.rotation.set(0,0,0);
          u.armL.rotation.x=0;u.armR.rotation.x=0;u.legL.rotation.x=0;u.legR.rotation.x=0;
          if(u.kneeL)u.kneeL.rotation.x=0;if(u.kneeR)u.kneeR.rotation.x=0;
          if(u.torso){u.torso.rotation.x=0;u.torso.rotation.y=0;}
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
    name:'windmill and planted spin-kick hit only geometry crossed by their visible strikes',
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
        const kick={type:'kick',t:.1,dur:1.05,x:p.x,z:p.z,y:p.y,heading:0,lastRev:-1,hits:new Set(),
          strikeTurns:.75,sweepFrom:Math.PI/2-.08,sweepTo:Math.PI/2+.08};
        chargedMeleeHit(kick);
        [front,back,side,kickSide].forEach(a=>{const i=jocks.indexOf(a);if(i>=0)jocks.splice(i,1);});
        return {first,duplicate,nextRound,kickSide:kickSide.hp};
      });
      assert(r.first.front===78&&r.first.back===78&&r.first.side===100,'windmill should hit front/rear only: '+JSON.stringify(r));
      assert(r.duplicate.front===78&&r.duplicate.back===78,'an enemy should be hit at most once per round: '+JSON.stringify(r));
      assert(r.nextRound.front===56&&r.nextRound.back===56&&r.nextRound.side===100,'next revolution should permit one more front/rear hit: '+JSON.stringify(r));
      assert(r.kickSide===72,'spin kick should hit a target crossed by the visible rear leg: '+JSON.stringify(r));
    }
  },
  {
    name:'120 mixed tap/hold attacks complete without a timer, charge, pointer, or pose lockout',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player,u=p.mesh.userData,spot=intersections[2];
        const prep=()=>{
          interruptMelee();G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.replay=false;
          G.interior=false;G.weapon='fists';G.crouching=false;p.climb=null;p.bailing=false;p.stunT=0;p.vy=0;
          p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;p.phase=0;
          p.mesh.position.set(p.x,p.y,p.z);p.mesh.rotation.set(0,0,0);
          input.jx=0;input.jy=0;input.sprint=false;
        };
        const neutral=()=>!meleeCharge&&!p.meleeSpecial&&p.punchT===0&&p.kickT===0&&
          Math.abs(u.armL.rotation.x)<1e-6&&Math.abs(u.armR.rotation.x)<1e-6&&
          Math.abs(u.legR.rotation.x)<1e-6&&Math.abs(u.torso.rotation.x)<1e-6&&Math.abs(u.torso.rotation.y)<1e-6;
        prep();
        let accepted=0,completed=0,maxFrames=0;
        for(let i=0;i<120;i++){
          const type=i%2?'kick':'punch',charged=i%4>=2;
          meleePress(type);
          if(charged){updateFoot(.5);updateFoot(.501);}
          else {updateFoot(.12);meleeRelease(type);}
          if((charged&&p.meleeSpecial)||(!charged&&(p.punchT>0||p.kickT>0))) accepted++;
          let frames=0;
          while(hasMeleeAction(p)&&frames<120){updateFoot(1/60);frames++;}
          maxFrames=Math.max(maxFrames,frames);
          if(neutral())completed++;
        }
        return {accepted,completed,maxFrames,neutral:neutral(),pointer:meleePointer};
      });
      assert(r.accepted===120&&r.completed===120&&r.neutral&&!r.pointer,
        'all 120 mixed attacks must accept, finish, and restore neutral: '+JSON.stringify(r));
      assert(r.maxFrames<120,'no attack should need the lockout guard limit: '+JSON.stringify(r));
    }
  },
  {
    name:'punch, kick, and both charged moves neutralize across every interruption and accept the next input',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(async()=>{
        const p=player,u=p.mesh.userData,spot=intersections[3];
        const actions=['punch','kick','charged-punch','charged-kick'];
        const interruptions=['vehicle','pause','stun','respawn','cinema','cutscene','cancel'];
        const prep=()=>{
          interruptMelee();G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.paused=false;G.replay=false;
          G.interior=false;G.weapon='fists';G.crouching=false;activeCutscene=null;
          p.climb=null;p.bailing=false;p.stunT=0;p.vy=0;p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;
          p.mesh.position.set(p.x,p.y,p.z);p.mesh.rotation.set(0,0,0);
        };
        const begin=a=>{
          if(a==='punch')doPunch(false,false);
          else if(a==='kick')doPunch(false,true);
          else startChargedMelee(a.endsWith('kick')?'kick':'punch');
          return hasMeleeAction(p);
        };
        const neutral=()=>!meleeCharge&&!p.meleeSpecial&&p.punchT===0&&p.kickT===0&&
          Math.abs(u.armL.rotation.x)<1e-6&&Math.abs(u.armR.rotation.x)<1e-6&&Math.abs(u.legR.rotation.x)<1e-6;
        const results=[];
        for(const a of actions) for(const stop of interruptions){
          prep();const began=begin(a);
          if(stop==='vehicle'){G.mode='car';disarmSprint();await Promise.resolve();G.mode='foot';}
          else if(stop==='pause'){pauseGame();await Promise.resolve();resumeGame();}
          else if(stop==='stun'){p.stunT=.5;updateFoot(.01);p.stunT=0;p.mesh.rotation.x=0;}
          else if(stop==='respawn'){G.over=true;exitCarSoft();await Promise.resolve();G.over=false;}
          else if(stop==='cinema'){G.replay=true;clearSprint();await Promise.resolve();G.replay=false;}
          else if(stop==='cutscene'){updateFoot(.01);activeCutscene={};await Promise.resolve();activeCutscene=null;}
          else interruptMelee();
          const clean=neutral();
          const restarted=begin(a);interruptMelee();
          results.push({a,stop,began,clean,restarted});
        }
        prep();
        meleePointer={id:77,type:'kick'};meleeCharge={type:'kick',t:.2,started:false};
        $('btnKick').dispatchEvent(new PointerEvent('lostpointercapture',{pointerId:77}));
        return {results,lostCaptureCleared:!meleePointer&&!meleeCharge};
      });
      assert(r.results.every(x=>x.began&&x.clean&&x.restarted),
        'each attack must neutralize and restart after every interruption: '+JSON.stringify(r.results.filter(x=>!x.began||!x.clean||!x.restarted)));
      assert(r.lostCaptureCleared,'lost pointer capture must clear both input and charge latches');
    }
  },
  {
    name:'planted charged-kick peak stays terrain-seated, horizontal, straight-limbed, and screenshotable',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const metrics=await page.evaluate(()=>{
        const p=player,u=p.mesh.userData,h=SIGNATURE_HILLS[0],x=h.x+h.r*.34,z=h.z+h.r*.12;
        interruptMelee();G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.replay=false;G.paused=true;
        G.interior=false;G.weapon='fists';G.crouching=false;p.climb=null;p.bailing=false;p.stunT=0;p.vy=0;
        p.x=x;p.z=z;p.y=groundH(x,z);p.heading=Math.atan2(1,.35);p.mesh.position.set(x,p.y,z);p.mesh.rotation.set(0,p.heading,0);
        startChargedMelee('kick');updateChargedMelee(.525);p.mesh.updateMatrixWorld(true);
        const shoeL=u.kneeL.children[2],shoeR=u.kneeR.children[2],wp=o=>o.getWorldPosition(new THREE.Vector3());
        const hip=wp(u.legL),support=wp(shoeL),rear=wp(shoeR),torsoQ=u.torso.getWorldQuaternion(new THREE.Quaternion());
        const armLQ=u.armL.getWorldQuaternion(new THREE.Quaternion()),armRQ=u.armR.getWorldQuaternion(new THREE.Quaternion());
        const rearQ=u.legR.getWorldQuaternion(new THREE.Quaternion());
        const torsoAxis=new THREE.Vector3(0,1,0).applyQuaternion(torsoQ);
        const armLAxis=new THREE.Vector3(0,-1,0).applyQuaternion(armLQ),armRAxis=new THREE.Vector3(0,-1,0).applyQuaternion(armRQ);
        const rearAxis=new THREE.Vector3(0,-1,0).applyQuaternion(rearQ);
        const boxMin=o=>new THREE.Box3().setFromObject(o).min.y;
        const ground=p.y;
        ['hud','btns','pedals','pauseBtn','btnReplay','debugHud'].forEach(id=>{const e=$(id);if(e){e.dataset.meleeDisplay=e.style.display;e.style.display='none';}});
        camera.fov=45;camera.updateProjectionMatrix();
        camera.position.set(p.x+5,p.y+1.65,p.z);camera.lookAt(p.x,p.y+1.02,p.z);renderer.render(scene,camera);
        return {
          rootY:p.y,startY:ground,meshY:p.mesh.position.y,supportY:support.y,supportGround:groundH(support.x,support.z),
          supportLean:Math.hypot(hip.x-support.x,hip.z-support.z),rearY:rear.y,rearGround:groundH(rear.x,rear.z),
          torsoVertical:Math.abs(torsoAxis.y),armLVertical:Math.abs(armLAxis.y),armRVertical:Math.abs(armRAxis.y),
          rearVertical:Math.abs(rearAxis.y),armsOpposeRear:Math.max(armLAxis.dot(rearAxis),armRAxis.dot(rearAxis)),
          torsoMin:boxMin(u.torso),headMin:boxMin(u.head),armMin:Math.min(boxMin(u.armL),boxMin(u.armR)),
          rearMin:boxMin(u.legR),ground,heading:p.mesh.rotation.y
        };
      });
      assert(Math.abs(metrics.rootY-metrics.startY)<1e-6,'collision root must not move vertically: '+JSON.stringify(metrics));
      assert(metrics.supportLean<.09&&Math.abs(metrics.supportY-metrics.supportGround)<.09,
        'support leg must be vertical with its foot planted on the local slope: '+JSON.stringify(metrics));
      assert(metrics.rearY>metrics.rearGround+.55&&metrics.torsoVertical<.08&&metrics.armLVertical<.08&&
        metrics.armRVertical<.08&&metrics.rearVertical<.08&&metrics.armsOpposeRear<-.8,
        'torso/arms/rear leg must form the straight horizontal silhouette: '+JSON.stringify(metrics));
      assert(Math.min(metrics.torsoMin,metrics.headMin,metrics.armMin,metrics.rearMin)>metrics.ground+.45,
        'only the support foot may approach terrain: '+JSON.stringify(metrics));
      if(artifactDir){
        fs.mkdirSync(artifactDir,{recursive:true});
        await page.screenshot({path:path.join(artifactDir,'op2-c-planted-kick-side.png')});
        await page.evaluate(()=>{
          const p=player,forward={x:Math.sin(p.mesh.rotation.y),z:Math.cos(p.mesh.rotation.y)};
          camera.position.set(p.x+forward.x*5,p.y+1.55,p.z+forward.z*5);
          camera.lookAt(p.x,p.y+1.02,p.z);renderer.render(scene,camera);
        });
        await page.screenshot({path:path.join(artifactDir,'op2-c-planted-kick-front.png')});
      }
      await page.evaluate(()=>{
        if(player.meleeSpecial)finishChargedMelee(player.meleeSpecial);
        G.paused=false;
        ['hud','btns','pedals','pauseBtn','btnReplay','debugHud'].forEach(id=>{const e=$(id);if(e&&e.dataset.meleeDisplay!==undefined){e.style.display=e.dataset.meleeDisplay;delete e.dataset.meleeDisplay;}});
      });
    }
  }
]};
