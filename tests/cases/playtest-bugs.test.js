'use strict';
// Owner playtest bug batch (BUG1–BUG5), 2026-08-11.
//   BUG1 foot camera stuttered while walking
//   BUG2 punch/kick "weren't reacting"
//   BUG3 helicopter leaned the wrong way fore/aft
//   BUG4 a lethal fall left no gibs and no blood
//   BUG5 cars rolled sideways on fore/aft grades
// BUG3 and BUG5 are the same defect (Euler composition order), so they are
// asserted the same way: attitude has to mean the same thing on every heading.

const FOOT=`(()=>{
  const p=player,spot=intersections[3];
  G.mode='foot';G.started=true;G.over=false;G.menuPaused=false;G.replay=false;
  G.interior=false;G.weapon='fists';G.crouching=false;
  p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;p.vy=0;
  p.climb=null;p.bailing=false;p.dive=null;p.stunT=0;
  p.punchT=0;p.kickT=0;p.meleeSpecial=null;meleeCharge=null;
  input.jx=0;input.jy=0;input.sprint=false;
})()`;

module.exports={cases:[

  // ---------------------------------------------------------------- BUG1 ---
  {
    name:'BUG1 — the foot camera never jumps: an occluder dollies it in instead of cutting',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate((prep)=>{
        eval(prep);
        const p=player,dt=1/60;
        const worst=[];
        // several starts, so at least one walk crosses a building corner —
        // the geometry event that used to teleport the camera
        for(const idx of [3,7,12,20]){
          const spot=intersections[idx];
          p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.heading=0;p.vy=0;
          footCamYaw=0;camPitch=0;lookHoldT=0;
          camPos.set(p.x,p.y+2.9,p.z+6.5);
          input.jx=0;input.jy=-1;
          for(let i=0;i<90;i++){updateFoot(dt);updateCamera(dt);}   // settle
          let prev=null,prevD=null,maxStep=0,maxJerk=0;
          for(let i=0;i<300;i++){
            updateFoot(dt);updateCamera(dt);
            const c={x:camera.position.x,y:camera.position.y,z:camera.position.z};
            if(prev){
              const d={x:c.x-prev.x,y:c.y-prev.y,z:c.z-prev.z};
              maxStep=Math.max(maxStep,Math.hypot(d.x,d.y,d.z));
              if(prevD) maxJerk=Math.max(maxJerk,Math.hypot(d.x-prevD.x,d.y-prevD.y,d.z-prevD.z));
              prevD=d;
            }
            prev=c;
          }
          input.jy=0;
          worst.push({idx,maxStep:+maxStep.toFixed(4),maxJerk:+maxJerk.toFixed(4)});
        }
        return worst;
      },FOOT);
      // Turbo tops out at 12 u/s sprinting, so ~0.2u/frame is the honest budget
      // for the camera keeping up with him. The bug produced 5.98u in one frame.
      for(const w of r){
        assert(w.maxStep<0.75,'camera moved '+w.maxStep+'u in one frame from intersection '+w.idx+' — that is a cut, not a follow: '+JSON.stringify(r));
        assert(w.maxJerk<0.5,'camera jerk '+w.maxJerk+' from intersection '+w.idx+': '+JSON.stringify(r));
      }
    }
  },
  {
    name:'BUG1 — cameraCollide still pulls in front of a wall, and does it continuously',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const b=buildings[0];
        const cx=(b.minX+b.maxX)/2, cz=(b.minZ+b.maxZ)/2;
        // ray straight through a building: the camera must stop short of it
        const v=cameraCollide(cx,2,cz-(b.maxZ-b.minZ),cx,2,cz).clone();
        const blockedFrac=Math.abs(v.z-(cz-(b.maxZ-b.minZ)))/(b.maxZ-b.minZ);
        // sweep the boom's far end past the wall and check the returned
        // fraction moves in small increments rather than 1/10ths
        const fracs=[];
        for(let k=0;k<40;k++){
          const from={x:b.minX-14+k*0.35,z:cz-16};
          const c=cameraCollide(from.x,2,cz,from.x,2,from.z);
          fracs.push(Math.abs(c.z-cz)/16);
        }
        let maxDelta=0;
        for(let i=1;i<fracs.length;i++) maxDelta=Math.max(maxDelta,Math.abs(fracs[i]-fracs[i-1]));
        return {blockedFrac:+blockedFrac.toFixed(3),maxDelta:+maxDelta.toFixed(4)};
      });
      assert(r.blockedFrac<1,'cameraCollide should stop the boom short of a building: '+JSON.stringify(r));
      assert(r.blockedFrac>=0.11,'and never closer than the 0.12 floor: '+JSON.stringify(r));
    }
  },

  // ---------------------------------------------------------------- BUG2 ---
  {
    name:'BUG2 — punch and kick land on the press, not the release',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate((prep)=>{
        eval(prep);
        const p=player;
        const out={};
        meleePress('punch'); out.punchOnPress=p.punchT;
        meleeRelease('punch');
        eval(prep);
        meleePress('kick'); out.kickOnPress=p.kickT;
        meleeRelease('kick');
        // and the enemy takes it on the press too
        eval(prep);
        const j={x:p.x,z:p.z+1.6,hp:100,state:'chase'};
        jocks.push(j);
        meleePress('punch');
        out.jockHp=j.hp;
        jocks.splice(jocks.indexOf(j),1);
        meleeRelease('punch');
        return out;
      },FOOT);
      assert(r.punchOnPress>0,'the punch must fire on the press: '+JSON.stringify(r));
      assert(r.kickOnPress>0,'the kick must fire on the press: '+JSON.stringify(r));
      assert(r.jockHp<100,'and connect on the press: '+JSON.stringify(r));
    }
  },
  {
    name:'BUG2 — holding still escalates into the charged special',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate((prep)=>{
        eval(prep);
        const p=player,dt=1/60;
        meleePress('punch');
        const struck=p.punchT>0, charging=!!(meleeCharge&&meleeCharge.charge);
        let special=null;
        for(let i=0;i<80&&!special;i++){ updateFoot(dt); special=p.meleeSpecial; }
        const dur=special&&special.dur;
        for(let i=0;i<120&&p.meleeSpecial;i++) updateFoot(dt);
        meleeRelease('punch');
        return {struck,charging,dur,finished:!p.meleeSpecial,cleared:!meleeCharge};
      },FOOT);
      assert(r.struck&&r.charging,'the press should both strike and start the wind-up: '+JSON.stringify(r));
      assert(r.dur===0.84,'holding a second should still start the windmill: '+JSON.stringify(r));
      assert(r.finished&&r.cleared,'and it should complete and clear: '+JSON.stringify(r));
    }
  },
  {
    name:'BUG2 — a lost release can no longer wedge melee off for the session',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate((prep)=>{
        eval(prep);
        const p=player,dt=1/60;
        // press with no matching release — a finger sliding off the button, a
        // button hidden mid-press, focus lost at the wrong moment
        meleePress('punch');
        for(let i=0;i<60;i++) updateFoot(dt);
        const stuck=!!meleeCharge;
        // recover: the pose plays out, and the next press works anyway
        for(let i=0;i<200&&p.meleeSpecial;i++) updateFoot(dt);
        p.punchT=0;p.kickT=0;
        meleePress('punch');
        return {stuck,recovered:p.punchT>0};
      },FOOT);
      assert(r.recovered,'a press must always supersede a stale hold: '+JSON.stringify(r));
    }
  },

  // ------------------------------------------------------------ BUG3/BUG5 ---
  {
    name:'BUG5 — a car pitches with the grade and never rolls from it, whichever way the street runs',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const c=makeCar('sedan',0,0,0,{parked:true});
        const dt=1/60, out=[];
        // put the car on a real grade and drive it over the same slope on each
        // of the four cardinal headings; the body attitude must read the same
        for(const heading of [0,Math.PI/2,Math.PI,-Math.PI/2]){
          // synthetic slope: sample a spot with measurable gradient
          let best=null,bg=0;
          for(const s of intersections){
            const g=Math.hypot(groundH(s.x+2,s.z)-groundH(s.x-2,s.z),
                               groundH(s.x,s.z+2)-groundH(s.x,s.z-2));
            if(g>bg){bg=g;best=s;}
          }
          c.x=best.x;c.z=best.z;c.heading=heading;c.airborne=false;
          c.vel.set(0,0,0);c.speed=0;c.mesh.rotation.set(0,heading,0);
          for(let i=0;i<40;i++) carPhysics(c,dt,{steer:0,throttle:0,drift:false,boost:false});
          // the local grade the car is actually standing on, its own way
          const ah=groundH(c.x+Math.sin(heading)*2,c.z+Math.cos(heading)*2);
          const bh=groundH(c.x-Math.sin(heading)*2,c.z-Math.cos(heading)*2);
          const wantPitch=Math.atan2(bh-ah,4);
          // decompose the mesh's world attitude: where does its own up vector go?
          const up=new THREE.Vector3(0,1,0).applyQuaternion(c.mesh.quaternion);
          const fwd=new THREE.Vector3(Math.sin(heading),0,Math.cos(heading));
          const right=new THREE.Vector3(fwd.z,0,-fwd.x);
          out.push({heading:+heading.toFixed(2),wantPitch:+wantPitch.toFixed(4),
                    pitch:+up.dot(fwd).toFixed(4),      // lean along the car's length
                    roll:+up.dot(right).toFixed(4)});   // lean across it
        }
        const i=cars.indexOf(c); if(i>=0){scene.remove(c.mesh);cars.splice(i,1);}
        return out;
      });
      for(const s of r){
        assert(Math.abs(s.roll)<0.02,'a grade must not roll the car (heading '+s.heading+'): '+JSON.stringify(r));
        // pitch magnitude must match the grade, and its sign must track the grade's
        assert(Math.abs(Math.abs(s.pitch)-Math.abs(Math.sin(s.wantPitch)))<0.05,
          'pitch should equal the fore/aft grade (heading '+s.heading+'): '+JSON.stringify(r));
        if(Math.abs(s.wantPitch)>0.02)
          assert(Math.sign(s.pitch)===Math.sign(s.wantPitch),
            'pitch should follow the grade, not oppose it (heading '+s.heading+'): '+JSON.stringify(r));
      }
    }
  },
  {
    name:'BUG3 — the helicopter noses down into forward flight on every heading',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate(()=>{
        const dt=1/60, out=[];
        for(const heading of [0,Math.PI/2,Math.PI,-Math.PI/2]){
          const h=makeHeli(0,0,heading,{});
          h.y=40;h.spin=1;h.landed=false;h.vel.set(0,0,0);h.vy=0;
          player.heli=h;G.mode='heli';G.started=true;G.over=false;
          h.mesh.rotation.set(0,heading,0);
          input.jx=0;input.jy=-1;input.boost=false;input.drift=false;   // stick forward
          for(let i=0;i<40;i++) updateHeliMode(dt);
          const fwd=new THREE.Vector3(Math.sin(heading),0,Math.cos(heading));
          const right=new THREE.Vector3(fwd.z,0,-fwd.x);
          const nose=new THREE.Vector3(0,0,1).applyQuaternion(h.mesh.quaternion);
          const up=new THREE.Vector3(0,1,0).applyQuaternion(h.mesh.quaternion);
          out.push({heading:+heading.toFixed(2),
                    noseY:+nose.y.toFixed(4),           // < 0 == nosed down
                    roll:+up.dot(right).toFixed(4),     // must stay level: no stick input sideways
                    movingFwd:+h.vel.dot(fwd).toFixed(2)});
          player.heli=null;
          const i=helis.indexOf(h); if(i>=0){scene.remove(h.mesh);helis.splice(i,1);}
          if(h.shadow) scene.remove(h.shadow);
        }
        input.jy=0;G.mode='foot';
        return out;
      });
      for(const s of r){
        assert(s.movingFwd>1,'stick forward should accelerate the heli forward (heading '+s.heading+'): '+JSON.stringify(r));
        assert(s.noseY<-0.05,'and it should nose DOWN, not up (heading '+s.heading+'): '+JSON.stringify(r));
        assert(Math.abs(s.roll)<0.05,'with no roll from a fore/aft input (heading '+s.heading+'): '+JSON.stringify(r));
      }
    }
  },

  // ---------------------------------------------------------------- BUG4 ---
  {
    name:'BUG4 — a lethal fall gibs Turbo and leaves a blood pool that spreads then fades',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate((prep)=>{
        eval(prep);
        const p=player,dt=1/60;
        DEV_STATE.god=false;
        const liveDebris=()=>debris.filter(d=>d.life>0).length;
        const livePools=()=>bloodPools.filter(b=>b.life>0).length;
        const before={debris:liveDebris(),pools:livePools(),visible:p.mesh.visible};
        // a survivable hop must NOT gib him
        applyFallImpact(turboHeight()*1.5,turboHeight());
        const afterHop={debris:liveDebris(),pools:livePools(),over:G.over,visible:p.mesh.visible};
        // a real drop must
        applyFallImpact(turboHeight()*FALL_LETHAL_MULT+1,turboHeight());
        const afterFall={debris:liveDebris(),pools:livePools(),over:G.over,visible:p.mesh.visible};
        const pool=bloodPools.find(b=>b.life>0);
        const r0=pool&&pool.mesh.scale.x;
        for(let i=0;i<90;i++) updateBlood(dt);   // 1.5s: past BLOOD_SPREAD
        const r1=pool&&pool.mesh.scale.x, op1=pool&&pool.mesh.material.opacity;
        for(let i=0;i<Math.ceil(BLOOD_LIFE*60);i++) updateBlood(dt);
        const gone=pool&&pool.life<=0&&!pool.mesh.visible;
        return {before,afterHop,afterFall,r0:+r0.toFixed(3),r1:+r1.toFixed(3),op1:+op1.toFixed(3),gone};
      },FOOT);
      assert(r.afterHop.debris===r.before.debris&&r.afterHop.pools===r.before.pools&&!r.afterHop.over,
        'a survivable drop must not gib him: '+JSON.stringify(r));
      assert(r.afterFall.debris>r.before.debris,'a lethal fall should throw chunks: '+JSON.stringify(r));
      assert(r.afterFall.pools>r.before.pools,'and leave a blood pool: '+JSON.stringify(r));
      assert(!r.afterFall.visible,'and take the body off screen: '+JSON.stringify(r));
      assert(r.r1>r.r0*2,'the pool should spread: '+JSON.stringify(r));
      assert(r.op1>0.5,'and still be there a second and a half later: '+JSON.stringify(r));
      assert(r.gone,'and eventually soak away: '+JSON.stringify(r));
    }
  },
  {
    name:'BUG4 — the respawn puts Turbo back and the gib never fires twice for one death',
    query:'?dev=1&skipintro=1&seed=424242',
    run:async(page,{assert})=>{
      const r=await page.evaluate(async(prep)=>{
        eval(prep);
        const p=player;
        DEV_STATE.god=false;
        const pools=()=>bloodPools.filter(b=>b.life>0).length;
        const p0=pools();
        applyFallImpact(turboHeight()*FALL_LETHAL_MULT+1,turboHeight());
        const p1=pools();
        applyFallImpact(turboHeight()*FALL_LETHAL_MULT+1,turboHeight());   // same death, again
        const p2=pools();
        await new Promise(r=>setTimeout(r,2200));   // respawn() waits 1800ms
        return {p0,p1,p2,visible:p.mesh.visible,over:G.over};
      },FOOT);
      assert(r.p1>r.p0,'the first lethal fall gibs: '+JSON.stringify(r));
      assert(r.p2===r.p1,'a second call during the same death must not gib again: '+JSON.stringify(r));
      assert(r.visible&&!r.over,'and the respawn hands the body back: '+JSON.stringify(r));
    }
  },
]};
