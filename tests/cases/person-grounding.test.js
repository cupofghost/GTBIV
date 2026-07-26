'use strict';

const fs=require('fs');
const path=require('path');
const artifactDir=process.env.GTB_TEST_ARTIFACT_DIR||'';

module.exports={cases:[
  {
    name:'Turbo, pedestrians, jocks, foot cops, and staged people keep flat easing body shadows',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const samples=[];
        const sample=(label,mesh,down)=>{
          const sh=mesh.userData.personShadow;
          mesh.rotation.x=down?-Math.PI/2:0;mesh.updateMatrixWorld(true);
          for(let i=0;i<5;i++)sh.userData.step(.05);
          const pos=new THREE.Vector3(),q=new THREE.Quaternion(),scale=new THREE.Vector3();
          sh.matrixWorld.decompose(pos,q,scale);
          const normal=new THREE.Vector3(0,0,1).applyQuaternion(q);
          samples.push({label,down,normalY:normal.y,y:pos.y,ground:groundH(pos.x,pos.z),
            x:pos.x,z:pos.z,scaleX:scale.x,scaleY:scale.y});
          return sh;
        };
        const ped=peds[0],j=spawnJock(player.x+8,player.z+8),fc=makeCopPerson(player.x-8,player.z-8);
        footCops.push(fc);
        const staged=makePerson(0xff3ea0,'girl');staged.position.set(player.x+12,groundH(player.x+12,player.z),player.z);scene.add(staged);
        const actors=[['turbo',player.mesh],['ped',ped.mesh],['jock',j.mesh],['foot-cop',fc.mesh],['staged',staged]];
        actors.forEach(([label,mesh])=>sample(label,mesh,false));
        actors.forEach(([label,mesh])=>sample(label,mesh,true));
        actors.forEach(([label,mesh])=>sample(label+'-recovered',mesh,false));
        const stagedShadow=staged.userData.personShadow;scene.remove(staged);disposeMesh(staged);
        const stagedGone=!scene.getObjectById(staged.id)&&!scene.getObjectById(stagedShadow.id);
        [ped.mesh,j.mesh,fc.mesh,player.mesh].forEach(mesh=>{mesh.rotation.x=0;mesh.updateMatrixWorld(true);});
        const ji=jocks.indexOf(j);if(ji>=0){jocks.splice(ji,1);scene.remove(j.mesh);disposeMesh(j.mesh);}
        const fi=footCops.indexOf(fc);if(fi>=0){footCops.splice(fi,1);scene.remove(fc.mesh);disposeMesh(fc.mesh);}
        return {samples,stagedGone};
      });
      const upright=r.samples.filter(s=>!s.down&&!s.label.endsWith('-recovered'));
      const fallen=r.samples.filter(s=>s.down);
      const recovered=r.samples.filter(s=>s.label.endsWith('-recovered'));
      assert(r.samples.every(s=>Math.abs(s.normalY-1)<1e-5),
        'every person shadow must remain a horizontal ground projection: '+JSON.stringify(r.samples));
      assert(r.samples.every(s=>Math.abs(s.y-(s.ground+.03))<.001),
        'person shadows must remain at local groundH + .03: '+JSON.stringify(r.samples));
      assert(fallen.every((s,i)=>s.scaleY>upright[i].scaleY*2.5&&s.scaleX<=upright[i].scaleX),
        'fallen people need longer, slightly narrower body shadows: '+JSON.stringify(r.samples));
      assert(recovered.every((s,i)=>Math.abs(s.scaleY-upright[i].scaleY)<.001),
        'recovery must ease each body shadow back to upright proportions: '+JSON.stringify(r.samples));
      assert(r.stagedGone,'a removed staged actor must not leave its child shadow in the scene');
    }
  },
  {
    name:'pooled and permanently removed people hide, reuse, or remove their exact shadow with the actor',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const ped=peds[0],pedShadow=ped.mesh.userData.personShadow;
        if(pedPool.length>=PED_POOL_CAP)pedPool.pop();
        retirePed(ped,true);
        const pooled={actorDetached:!scene.getObjectById(ped.mesh.id),shadowDetached:!scene.getObjectById(pedShadow.id),
          pooled:pedPool.includes(ped)};
        const revived=spawnPed(pick(blockInfo));
        revived.mesh.updateMatrixWorld(true);
        const reused={same:revived===ped,sameShadow:revived.mesh.userData.personShadow===pedShadow,
          actorLive:!!scene.getObjectById(revived.mesh.id),shadowLive:!!scene.getObjectById(pedShadow.id)};
        const j=spawnJock(player.x+10,player.z),jShadow=j.mesh.userData.personShadow;
        downJock(j,false);j.downT=0;updateJocks(.01);
        const jockGone=!scene.getObjectById(j.mesh.id)&&!scene.getObjectById(jShadow.id)&&!jocks.includes(j);
        const fc=makeCopPerson(player.x-10,player.z);footCops.push(fc);
        const fcShadow=fc.mesh.userData.personShadow;downFootCop(fc);fc.downT=0;updateFootCops(.01);
        const copGone=!scene.getObjectById(fc.mesh.id)&&!scene.getObjectById(fcShadow.id)&&!footCops.includes(fc);
        return {pooled,reused,jockGone,copGone};
      });
      assert(r.pooled.actorDetached&&r.pooled.shadowDetached&&r.pooled.pooled,
        'pooling must detach the actor and its shadow together: '+JSON.stringify(r));
      assert(r.reused.same&&r.reused.sameShadow&&r.reused.actorLive&&r.reused.shadowLive,
        'pool reuse must restore the same bounded shadow with its actor: '+JSON.stringify(r));
      assert(r.jockGone&&r.copGone,'permanent jock/cop removal must leave no live shadow: '+JSON.stringify(r));
    }
  },
  {
    name:'gait crossings emit one alternating planted step with walk/run/sprint cadence and catch-up cap',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player,origStep=sfx.turboStep,steps=[];
        sfx.turboStep=(surface,side,speed,scale)=>steps.push({surface,side,speed,scale});
        G.started=true;G.over=false;G.mode='foot';G.paused=false;G.menuPaused=false;G.replay=false;activeCutscene=null;
        p.stunT=0;p.bailing=false;p.climb=null;p.x=roadLines[4];p.z=roadLines[4];p.y=groundH(p.x,p.z);
        const cadence=speed=>{
          steps.length=0;p.phase=0;p.footstepPhaseIndex=undefined;
          updateTurboFootsteps(p,{mag:1,airborne:false,speed,roofHere:0,onStairs:false,landed:false,impact:0});
          for(let t=0;t<1;t+=.02){
            p.phase+=.02*speed*2.2;
            updateTurboFootsteps(p,{mag:1,airborne:false,speed,roofHere:0,onStairs:false,landed:false,impact:0});
          }
          return steps.map(s=>s.side);
        };
        const walk=cadence(4.6),run=cadence(8.2),sprint=cadence(12);
        steps.length=0;p.phase=0;p.footstepPhaseIndex=undefined;
        updateTurboFootsteps(p,{mag:1,airborne:false,speed:12,roofHere:0,onStairs:false,landed:false,impact:0});
        p.phase+=Math.PI*3.4;
        updateTurboFootsteps(p,{mag:1,airborne:false,speed:12,roofHere:0,onStairs:false,landed:false,impact:0});
        const caughtUp=steps.length;
        sfx.turboStep=origStep;
        return {walk,run,sprint,caughtUp};
      });
      const alternates=a=>a.every((v,i)=>i===0||v!==a[i-1]);
      assert(r.walk.length<r.run.length&&r.run.length<r.sprint.length,
        'gait cadence must increase from walk to run to sprint: '+JSON.stringify(r));
      assert(alternates(r.walk)&&alternates(r.run)&&alternates(r.sprint),
        'normal gait crossings must alternate left/right: '+JSON.stringify(r));
      assert(r.caughtUp===1,'a skipped frame crossing several plants must emit only one catch-up step');
    }
  },
  {
    name:'surface voices, silence guards, and one weighted landing are coherent',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player,origStep=sfx.turboStep,origLand=sfx.turboLand,steps=[],lands=[];
        sfx.turboStep=(...a)=>steps.push(a);sfx.turboLand=(...a)=>lands.push(a);
        G.started=true;G.over=false;G.mode='foot';G.paused=false;G.menuPaused=false;G.replay=false;G.interior=false;activeCutscene=null;
        p.stunT=0;p.bailing=false;p.climb=null;p.punchT=0;p.kickT=0;
        const park=blockInfo.find(b=>b.type==='park'&&!b.helipad),concrete=blockInfo.find(b=>b.type!=='park');
        p.x=roadLines[4];p.z=roadLines[4];p.y=groundH(p.x,p.z);const asphalt=turboFootSurface(p,0,false);
        p.x=park.cx;p.z=park.cz;p.y=groundH(p.x,p.z);const grass=turboFootSurface(p,0,false);
        p.x=concrete.cx;p.z=concrete.cz;p.y=groundH(p.x,p.z);const hard=turboFootSurface(p,0,false);
        p.x=SAND_EDGE+2;p.z=0;p.y=groundH(p.x,p.z);const sand=turboFootSurface(p,0,false);
        p.y=10;const roof=turboFootSurface(p,10,false);G.interior=true;const interior=turboFootSurface(p,0,false);G.interior=false;
        const silence=[];
        const tryState=(name,mut,state)=>{
          steps.length=0;p.phase=0;p.footstepPhaseIndex=0;
          mut();p.phase=Math.PI;
          updateTurboFootsteps(p,Object.assign({mag:1,airborne:false,speed:8.2,roofHere:0,onStairs:false,landed:false,impact:0},state||{}));
          silence.push({name,count:steps.length});
          G.mode='foot';G.paused=false;G.menuPaused=false;G.replay=false;activeCutscene=null;
          p.stunT=0;p.bailing=false;p.climb=null;p.punchT=0;
        };
        tryState('idle',()=>{},{mag:0});
        tryState('airborne',()=>{},{airborne:true});
        tryState('stunned',()=>{p.stunT=.5;});
        tryState('paused',()=>{G.paused=true;});
        tryState('vehicle',()=>{G.mode='car';});
        tryState('replay',()=>{G.replay=true;});
        tryState('cutscene',()=>{activeCutscene={};});
        tryState('bailing',()=>{p.bailing=true;});
        tryState('climbing',()=>{p.climb={};});
        tryState('stationary-attack',()=>{p.punchT=.3;},{mag:0});
        p.phase=0;p.footstepPhaseIndex=0;p.wasAirborne=true;
        updateTurboFootsteps(p,{mag:0,airborne:false,speed:0,roofHere:0,onStairs:false,landed:true,impact:7});
        updateTurboFootsteps(p,{mag:0,airborne:false,speed:0,roofHere:0,onStairs:false,landed:false,impact:0});
        sfx.turboStep=origStep;sfx.turboLand=origLand;
        return {surfaces:{asphalt,grass,hard,sand,roof,interior},silence,landCount:lands.length,land:lands[0],
          distinct:origStep!==sfx.punch&&origLand!==sfx.crash};
      });
      assert(JSON.stringify(r.surfaces)===JSON.stringify({asphalt:'asphalt',grass:'grass',hard:'concrete',sand:'sand',roof:'roof',interior:'roof'}),
        'expected coherent asphalt/concrete, grass, sand, and roof/interior routing: '+JSON.stringify(r.surfaces));
      assert(r.silence.every(s=>s.count===0),'silent states emitted footsteps: '+JSON.stringify(r.silence));
      assert(r.landCount===1&&r.land[1]===7,'landing must emit one separate impact-weighted thump: '+JSON.stringify(r));
      assert(r.distinct,'Turbo step and landing voices must be distinct from punch/crash SFX');
    }
  },
  {
    name:'fallen body-shadow projection is available for visual review',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const p=player,sh=p.mesh.userData.personShadow,spot=intersections[5];
        G.paused=true;G.menuPaused=false;G.mode='foot';G.interior=false;
        p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=.65;
        p.mesh.position.set(p.x,p.y+.3,p.z);p.mesh.rotation.set(-Math.PI/2,p.heading,0);
        p.mesh.updateMatrixWorld(true);for(let i=0;i<5;i++)sh.userData.step(.05);
        const pos=new THREE.Vector3(),q=new THREE.Quaternion(),scale=new THREE.Vector3();
        sh.matrixWorld.decompose(pos,q,scale);
        const normal=new THREE.Vector3(0,0,1).applyQuaternion(q);
        ['hud','btns','pedals','pauseBtn','btnReplay','debugHud'].forEach(id=>{const e=$(id);if(e){e.dataset.shadowDisplay=e.style.display;e.style.display='none';}});
        camera.fov=43;camera.updateProjectionMatrix();
        camera.position.set(p.x+5,p.y+3,p.z+6);camera.lookAt(p.x,p.y+.5,p.z);renderer.render(scene,camera);
        return {normalY:normal.y,y:pos.y,ground:groundH(pos.x,pos.z),long:scale.y,wide:scale.x};
      });
      assert(Math.abs(r.normalY-1)<1e-5&&Math.abs(r.y-(r.ground+.03))<.001&&r.long>r.wide*2.5,
        'visual-review body shadow must remain long, flat, and terrain-seated: '+JSON.stringify(r));
      if(artifactDir){
        fs.mkdirSync(artifactDir,{recursive:true});
        await page.screenshot({path:path.join(artifactDir,'op2-d-fallen-body-shadow.png')});
      }
      await page.evaluate(()=>{
        const p=player;p.mesh.rotation.x=0;p.mesh.position.set(p.x,p.y,p.z);p.mesh.updateMatrixWorld(true);
        for(let i=0;i<5;i++)p.mesh.userData.personShadow.userData.step(.05);
        G.paused=false;
        ['hud','btns','pedals','pauseBtn','btnReplay','debugHud'].forEach(id=>{const e=$(id);if(e&&e.dataset.shadowDisplay!==undefined){e.style.display=e.dataset.shadowDisplay;delete e.dataset.shadowDisplay;}});
      });
    }
  }
]};
