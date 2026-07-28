'use strict';
// OP2-D — ground-anchored person shadows, and Turbo's gait-driven footsteps.
// What assertions can reach: orientation, anchoring, lifecycle, cadence, gating,
// surface routing, and that the synthesis actually emits a signal. What they
// cannot reach is whether it SOUNDS good — that needs the owner's ears.

const PREP = `(()=>{
  const p=player;
  G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.paused=false;
  G.replay=false;G.interior=false;G.weapon='fists';G.crouching=false;
  p.vy=0;p.climb=null;p.bailing=false;p.stunT=0;
  p.punchT=0;p.kickT=0;p.meleeSpecial=null;meleeCharge=null;p.phase=0;p.stepK=null;
})()`;

module.exports={cases:[
  {
    name:'a person shadow stays flat on the ground however the body is lying',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const ped=peds.find(x=>x&&x.mesh&&x.state!=='down');
        if(!ped) return {none:true};
        const sh=ped.mesh.userData.shadow;
        const N=new THREE.Vector3(), P=new THREE.Vector3(), S=new THREE.Vector3(), Q=new THREE.Quaternion();
        const probe=()=>{
          ped.mesh.updateMatrixWorld(true);
          // the shadow drives its own local matrix, so read the world transform
          sh.matrixWorld.decompose(P,Q,S);
          N.set(0,0,1).applyQuaternion(Q);   // the disc's normal
          const gr=groundH(ped.mesh.position.x,ped.mesh.position.z);
          return {normalY:+N.y.toFixed(4),above:+(P.y-gr).toFixed(4),
            offset:+Math.hypot(P.x-ped.mesh.position.x,P.z-ped.mesh.position.z).toFixed(3),
            along:+S.y.toFixed(3),across:+S.x.toFixed(3),
            fall:+(sh.userData.fall||0).toFixed(3)};
        };
        const settle=n=>{ for(let i=0;i<n;i++) updatePersonShadows(0.017); };
        ped.mesh.rotation.set(0,1.1,0); ped.mesh.position.y=groundH(ped.x,ped.z);
        settle(60); const upright=probe();
        ped.mesh.rotation.x=-Math.PI/2; ped.mesh.position.y=groundH(ped.x,ped.z)+0.3;  // knockPed()
        settle(1); const first=probe();
        settle(8); const mid=probe();            // ~0.15s in
        settle(90); const fallen=probe();
        ped.mesh.rotation.x=0; ped.mesh.position.y=groundH(ped.x,ped.z);
        settle(90); const back=probe();
        return {isChild:sh.parent===ped.mesh,shared:sh.geometry===shGeo&&sh.material===shMat,
          upright,first,mid,fallen,back};
      });
      assert(!r.none,'expected at least one live ped');
      assert(r.isChild&&r.shared,'the shadow should still be a pooled child on shared assets: '+JSON.stringify(r));
      [['upright',r.upright],['first',r.first],['mid',r.mid],['fallen',r.fallen],['back',r.back]]
        .forEach(([k,v])=>{
          assert(v.normalY>0.999,`the shadow went off the ground plane while ${k}: `+JSON.stringify(v));
          assert(Math.abs(v.above-0.03)<0.002,`the shadow left the terrain while ${k}: `+JSON.stringify(v));
        });
      assert(r.upright.fall===0&&r.upright.offset<0.02,'upright: a compact shadow at the feet: '+JSON.stringify(r.upright));
      assert(r.first.fall<0.2&&r.mid.fall>r.first.fall&&r.mid.fall<0.95,
        'the change should ease in, not snap: '+JSON.stringify({first:r.first,mid:r.mid}));
      assert(r.fallen.fall>0.95,'a body left down should finish the transition: '+JSON.stringify(r.fallen));
      assert(r.fallen.along>r.upright.along*2&&r.fallen.offset>0.6,
        'a fallen body needs a long shadow, slid under the torso: '+JSON.stringify(r.fallen));
      assert(r.back.fall<0.05&&r.back.offset<0.05,'getting up should bring the foot shadow back: '+JSON.stringify(r.back));
    }
  },
  {
    name:'the shadow lives and dies with its actor, and the spin kick keeps a standing shadow',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        // hidden actors are skipped, and the shadow is disposed with the body
        const ped=peds.find(x=>x&&x.mesh);
        const sh=ped.mesh.userData.shadow;
        ped.mesh.visible=false;
        const before=sh.matrix.elements.slice();
        ped.mesh.rotation.x=-Math.PI/2;
        for(let i=0;i<40;i++) updatePersonShadows(0.017);
        const untouchedWhileHidden=sh.matrix.elements.every((v,i)=>v===before[i]);
        ped.mesh.rotation.x=0; ped.mesh.visible=true;
        // shGeo/shMat are shared, so disposing an actor must not free them
        disposeMesh(ped.mesh);
        const geoAlive=!!(shGeo.attributes&&shGeo.attributes.position);
        // Turbo mid-spin-kick is horizontal, but he is NOT down — he keeps his feet
        const p=player,spot=intersections[0];
        G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.replay=false;G.interior=false;
        G.weapon='fists';G.crouching=false;
        p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;p.climb=null;p.bailing=false;
        p.stunT=0;p.punchT=0;p.kickT=0;p.meleeSpecial=null;meleeCharge=null;
        const ps=p.mesh.userData.shadow, N=new THREE.Vector3(), Q=new THREE.Quaternion();
        meleePress('kick'); updateFoot(1.001);
        let maxFall=0,minNormal=1,frames=0;
        for(let i=0;i<60;i++){
          updateFoot(0.017); updatePersonShadows(0.017);
          if(!p.meleeSpecial) break;
          frames++;
          p.mesh.updateMatrixWorld(true);
          ps.getWorldQuaternion(Q); N.set(0,0,1).applyQuaternion(Q);
          maxFall=Math.max(maxFall,ps.userData.fall||0);
          minNormal=Math.min(minNormal,N.y);
        }
        return {untouchedWhileHidden,geoAlive,frames,maxFall:+maxFall.toFixed(3),minNormal:+minNormal.toFixed(4)};
      });
      assert(r.untouchedWhileHidden,'a hidden actor should cost nothing');
      assert(r.geoAlive,'disposing an actor must not free the shared blob geometry');
      assert(r.frames>20,'expected the kick to run: '+JSON.stringify(r));
      assert(r.maxFall<0.05,'a spin kick is not a knockdown — keep the standing shadow: '+JSON.stringify(r));
      assert(r.minNormal>0.999,'the shadow should stay flat through the kick: '+JSON.stringify(r));
    }
  },
  {
    name:'footsteps follow the gait: one alternating step per stride, faster with speed',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate((PREP)=>{
        const p=player,spot=intersections[0];
        const steps=[]; const real=window.footstep;
        window.footstep=(s,f,sp,sc)=>{ steps.push({s,f,sp,sc}); return true; };
        const place=()=>{ p.x=spot.x;p.z=spot.z;p.y=groundH(spot.x,spot.z); eval(PREP); };
        const go=(sec,{sprint=false,mag=1}={})=>{ place(); steps.length=0;
          input.jx=0; input.jy=-mag; input.sprint=sprint;
          for(let i=0;i<Math.round(sec/0.017);i++) updateFoot(0.017);
          input.jy=0; input.sprint=false; return steps.slice(); };
        const alt=a=>a.length>1&&a.every((c,i)=>i===0||c.f!==a[i-1].f);
        const walk=go(3,{mag:0.5}), run=go(3,{mag:1}), sprint=go(3,{sprint:true,mag:1});
        // one long frame must not fire a burst
        place(); steps.length=0; input.jy=-1; input.sprint=true;
        updateFoot(0.017); updateFoot(0.5); input.jy=0; input.sprint=false;
        const longFrame=steps.length;
        window.footstep=real;
        return {walk:{n:walk.length,alt:alt(walk),sp:walk[0]&&walk[0].sp},
          run:{n:run.length,alt:alt(run),sp:run[0]&&run[0].sp},
          sprint:{n:sprint.length,alt:alt(sprint),sp:sprint[0]&&sprint[0].sp},
          longFrame,scale:+(p.mesh.scale.y).toFixed(2)};
      },PREP);
      assert(r.walk.n>0&&r.run.n>r.walk.n&&r.sprint.n>r.run.n,
        'cadence should rise with walk < run < sprint: '+JSON.stringify(r));
      assert(r.walk.alt&&r.run.alt&&r.sprint.alt,'steps should alternate feet: '+JSON.stringify(r));
      assert(r.walk.sp<r.run.sp&&r.run.sp<r.sprint.sp&&r.sprint.sp===1,
        'the speed the sound is shaped by should track the gait: '+JSON.stringify(r));
      assert(r.longFrame<=1,'a dropped frame must not emit a burst of steps: '+JSON.stringify(r));
      assert(r.scale>1,"steps should be told Turbo's scale: "+JSON.stringify(r));
    }
  },
  {
    name:'footsteps stay silent when there is no stride, and name the surface underfoot',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate((PREP)=>{
        const p=player,spot=intersections[0];
        const steps=[],lands=[]; const rs=window.footstep, rl=window.footLand;
        window.footstep=(s,f,sp,sc)=>{ steps.push({s,f,sp}); return true; };
        window.footLand=(s,d,sc)=>{ lands.push({s,d}); };
        const place=(x,z)=>{ p.x=x;p.z=z;p.y=groundH(x,z); eval(PREP); };
        const run=(sec,setup)=>{ place(spot.x,spot.z); if(setup) setup();
          steps.length=0; lands.length=0; input.jx=0; input.jy=-1;
          for(let i=0;i<Math.round(sec/0.017);i++) updateFoot(0.017);
          input.jy=0; return {steps:steps.length,lands:lands.length}; };
        const moving=run(1.2);
        const still=(()=>{ place(spot.x,spot.z); steps.length=0; input.jx=0; input.jy=0;
          for(let i=0;i<70;i++) updateFoot(0.017); return steps.length; })();
        const punching=run(0.45,()=>{ p.punchT=0.5; });
        const kicking=run(0.8,()=>{ p.kickT=0.9; });
        const stunned=run(0.6,()=>{ p.stunT=0.6; });
        // a jump: quiet in the air, one landing thump on the way down
        place(spot.x,spot.z); steps.length=0; lands.length=0;
        p.vy=8.6; p.y=footGround(p)+0.06; input.jy=-1;
        let airborneSteps=0;
        for(let i=0;i<90;i++){ updateFoot(0.017); if(!lands.length) airborneSteps=steps.length; }
        input.jy=0;
        const jump={airborneSteps,lands:lands.length,landSurface:lands[0]&&lands[0].s,
          landWeight:lands[0]&&+lands[0].d.toFixed(2)};
        const park=blockInfo.find(b=>b.type==='park');
        const surfaces={street:stepSurface(spot.x,spot.z,false),
          grass:park?stepSurface(park.cx,park.cz,false):null,
          sand:stepSurface(WORLD.half+40,0,false),
          roofOrStairs:stepSurface(spot.x,spot.z,true),
          indoors:(()=>{ G.interior=true; const s=stepSurface(spot.x,spot.z,false); G.interior=false; return s; })()};
        window.footstep=rs; window.footLand=rl;
        return {moving,still,punching,kicking,stunned,jump,surfaces};
      },PREP);
      assert(r.moving.steps>0,'walking should make steps: '+JSON.stringify(r.moving));
      assert(r.still===0,'standing still should be silent');
      assert(r.punching.steps===0,'a punch is arms only — no steps: '+JSON.stringify(r.punching));
      assert(r.kicking.steps===0,'a kick is planted — no steps: '+JSON.stringify(r.kicking));
      assert(r.stunned.steps===0,'a stunned Turbo takes no steps: '+JSON.stringify(r.stunned));
      assert(r.jump.airborneSteps===0,'no steps while airborne: '+JSON.stringify(r.jump));
      assert(r.jump.lands===1&&r.jump.landWeight>0,'exactly one landing, with weight: '+JSON.stringify(r.jump));
      const s=r.surfaces;
      assert(s.street==='street'&&s.sand==='sand'&&s.roofOrStairs==='roof'&&s.indoors==='roof',
        'surfaces should route to their own voice: '+JSON.stringify(s));
      assert(s.grass===null||s.grass==='grass','a park block should read as grass: '+JSON.stringify(s));
    }
  },
  {
    name:'the footstep voices actually synthesise, and differ by surface and foot',
    query:'?dev=1&skipintro=1',
    run:async(page,{assert})=>{
      const r=await page.evaluate(async()=>{
        // Render the real synthesis offline — headless has no output device, but
        // OfflineAudioContext runs the same graph and hands back the samples.
        const keepAC=AC, keepSfx=sfxGain, keepMaster=masterGain, keepNoise=_stepNoise;
        const render=async(fn)=>{
          const off=new OfflineAudioContext(1,44100,44100);
          AC=off; masterGain=off.createGain(); masterGain.connect(off.destination);
          sfxGain=off.createGain(); sfxGain.gain.value=1; sfxGain.connect(masterGain);
          _stepNoise=null; _stepLastT=-1;
          fn();
          const buf=await off.startRendering(), d=buf.getChannelData(0);
          let peak=0,sum=0,lowSum=0,acc=0;
          for(let i=0;i<d.length;i++){ const v=d[i]; peak=Math.max(peak,Math.abs(v)); sum+=v*v;
            acc+=(v-acc)*0.02; lowSum+=acc*acc; }   // crude one-pole: how much low end
          return {peak:+peak.toFixed(4),rms:+Math.sqrt(sum/d.length).toFixed(5),
            low:+Math.sqrt(lowSum/d.length).toFixed(5)};
        };
        const out={
          street:await render(()=>footstep('street',0,0.5,1.04)),
          grass :await render(()=>footstep('grass', 0,0.5,1.04)),
          sand  :await render(()=>footstep('sand',  0,0.5,1.04)),
          roof  :await render(()=>footstep('roof',  0,0.5,1.04)),
          left  :await render(()=>footstep('street',0,0.5,1.04)),
          right :await render(()=>footstep('street',1,0.5,1.04)),
          slow  :await render(()=>footstep('street',0,0.0,1.04)),
          fast  :await render(()=>footstep('street',0,1.0,1.04)),
          land  :await render(()=>footLand('street',1.0,1.04)),
          silent:await render(()=>{}),
        };
        // the overlap cap, measured on the real clock
        const capped=await render(()=>{ footstep('street',0,0.5,1.04); footstep('street',1,0.5,1.04); });
        AC=keepAC; sfxGain=keepSfx; masterGain=keepMaster; _stepNoise=keepNoise; _stepLastT=-1;
        return Object.assign(out,{capped});
      });
      assert(r.silent.peak===0,'the offline harness should be quiet with no step: '+JSON.stringify(r.silent));
      ['street','grass','sand','roof','land'].forEach(k=>{
        assert(r[k].peak>0.005,`${k} should make a sound: `+JSON.stringify(r[k]));
        assert(r[k].peak<0.95,`${k} should not clip: `+JSON.stringify(r[k]));
      });
      assert(r.sand.low<r.street.low,'sand should carry less low end than asphalt: '+JSON.stringify(r));
      assert(r.land.low>r.street.low,'a landing should have more weight than a step: '+JSON.stringify(r));
      assert(r.right.peak!==r.left.peak,'left and right feet should not be identical: '+JSON.stringify(r));
      assert(r.fast.peak>r.slow.peak,'a faster plant should hit harder: '+JSON.stringify(r));
      assert(Math.abs(r.capped.rms-r.street.rms)/r.street.rms<0.35,
        'two steps in the same instant should be capped to about one: '+JSON.stringify(r));
    }
  }
]};
