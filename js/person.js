// ================= PERSON BUILDER (shared: game + viewer) =================
// C1: makePerson(spec) builds deterministically from a PersonSpec (see
// CHARACTERS.md §3). randomPersonSpec() reproduces the old random NPC look.
// Legacy shim: makePerson(shirtColor, gender) still works for old call sites.
(function(){
const R=(a,b)=>a+Math.random()*(b-a);
const PK=arr=>arr[Math.floor(Math.random()*arr.length)];

const SKINS=[0xf0c8a0,0xc89060,0x8a5c30,0xffd9b0];
const PANTS=[0x2a3a5c,0x3a2a2a,0x2a2a2a,0x4a3a5c,0x50422a,0x5c2a3a];
const HAIRS=[0x1a1a1a,0x3a2a1a,0x6b4a2f,0x8a8a8a,0xd9b44f,0xb44f2a];
const SHOES=[0x1a1a1a,0xf0f0f0,0x6b3a1a,0x2a2a4a];
const SHIRTS=[0xff6b9d,0x6bc8ff,0xffd23e,0x8aff6b,0xd98aff,0xff8a5c,0x5cffd4,0xf0f0f0];

// Reproduces the pre-refactor random look: same distributions, same rolls.
function randomPersonSpec(shirt,gender){
  gender=gender||(Math.random()<0.5?'guy':'girl');
  const dress=gender==='girl'&&Math.random()<0.4;
  const style=Math.random();               // one roll drives hair, like before
  let hstyle, beard=false;
  if(gender==='girl') hstyle=style<0.5?'long':'ponytail';
  else if(style<0.12) hstyle='bald';
  else { hstyle=style<0.5?'buzz':'short'; beard=style<0.4; }
  return {
    gender, detail:'crowd',
    height:R(0.94,1.06), build:R(0.88,1.14),
    skin:PK(SKINS),
    hair:{style:hstyle,color:PK(HAIRS),beard},
    outfit:{
      shirt:{color:(typeof shirt==='number')?shirt:PK(SHIRTS),tex:null},
      pants:{color:PK(PANTS),tex:null,shorts:!dress&&Math.random()<0.3},
      shoes:{color:PK(SHOES)},
      dress, tank:Math.random()<0.3,
    },
    face:{tex:null},
  };
}

function makePerson(spec,gender){
  // legacy shim: makePerson(shirt[,gender])
  if(typeof spec==='number'||spec==null) spec=randomPersonSpec(spec,gender);
  else { // fill gaps (missing fields fall back to random NPC defaults)
    const base=randomPersonSpec();
    spec=Object.assign(base,spec);
    spec.hair=Object.assign(base.hair,spec.hair||{});
    spec.outfit=Object.assign(base.outfit,spec.outfit||{});
    ['shirt','pants','shoes'].forEach(k=>spec.outfit[k]=Object.assign(base.outfit[k]||{},(spec.outfit||{})[k]||{}));
    spec.face=Object.assign({tex:null},spec.face||{});
  }
  gender=spec.gender;
  const g=new THREE.Group();
  const skin=new THREE.MeshLambertMaterial({color:spec.skin});
  const pantsMat=new THREE.MeshLambertMaterial({color:spec.outfit.pants.color});
  const hairMat=new THREE.MeshLambertMaterial({color:spec.hair.color});
  const shirtMat=new THREE.MeshLambertMaterial({color:spec.outfit.shirt.color});
  const shoeMat=new THREE.MeshLambertMaterial({color:spec.outfit.shoes.color});
  // realistic-ish proportions, GTA scale: ~7 heads tall, varied build
  const wid=spec.build;
  const bw=(gender==='guy'?0.5:0.4)*wid, bd=(gender==='guy'?0.28:0.23)*wid;
  const dress=!!spec.outfit.dress, shorts=!!spec.outfit.pants.shorts, tank=!!spec.outfit.tank;
  const legSkin=(dress||shorts)?skin:pantsMat;
  // ---- legs: hip pivot → thigh, knee pivot → shin + shoe (rounded limbs)
  function makeLeg(side){
    const hip=new THREE.Group(); hip.position.set(side*bw*0.26,0.86,0);
    const thigh=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.09,0.44,12),dress?skin:pantsMat);
    thigh.position.y=-0.21; hip.add(thigh);
    const knee=new THREE.Group(); knee.position.y=-0.43; hip.add(knee);
    hip.userData.knee=knee;   // exposed so the leg can bend (e.g. stair climbing)
    const kneecap=new THREE.Mesh(new THREE.SphereGeometry(0.07,12,10),legSkin);
    knee.add(kneecap);
    const shin=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.075,0.42,12),legSkin);
    shin.position.y=-0.21; knee.add(shin);
    const shoe=new THREE.Mesh(new THREE.SphereGeometry(0.085,12,10),shoeMat);
    shoe.scale.set(1,0.62,1.9); shoe.position.set(0,-0.42,0.05); knee.add(shoe);
    g.add(hip); return hip;
  }
  const legL=makeLeg(-1), legR=makeLeg(1);
  // ---- hips + torso (tapered, rounded — no more box body)
  const pelvis=new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8),dress?shirtMat:pantsMat);
  pelvis.scale.set(bw*0.95,0.24,bd*1.05); pelvis.position.y=0.95; g.add(pelvis);
  // articulated torso: twists and leans with the walk cycle
  const torsoG=new THREE.Group(); torsoG.position.y=1.02; g.add(torsoG);
  // C2: one lathe torso — waist → chest → sloped deltoids → neck. Kills the
  // shoulder-pad balls and gives a continuous wrap UV for painting (C3).
  const TORSO_PROFILE=[[0.34,-0.04],[0.37,0.06],[0.40,0.16],[0.44,0.28],[0.50,0.38],
    [0.48,0.44],[0.40,0.50],[0.26,0.55],[0.14,0.58]].map(p=>new THREE.Vector2(p[0],p[1]));
  const body=new THREE.Mesh(new THREE.LatheGeometry(TORSO_PROFILE,14),shirtMat);
  body.scale.set(bw,1,bd); torsoG.add(body);
  if(gender==='girl'&&!dress){
    const bust=new THREE.Mesh(new THREE.SphereGeometry(0.5,14,10),shirtMat);
    bust.scale.set(bw*0.66,0.13,bd*0.5); bust.position.set(0,0.36,bd*0.34); torsoG.add(bust);
  }
  if(dress){
    const skirt=new THREE.Mesh(new THREE.CylinderGeometry(bw*0.45,bw*0.68,0.52,10),shirtMat);
    skirt.position.y=0.68; g.add(skirt);
  } else {
    const belt=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.07,10),
      new THREE.MeshLambertMaterial({color:0x1c1410}));
    belt.scale.set(bw*0.98,1,bd*1.06); belt.position.y=1.05; g.add(belt);
  }
  // ---- arms: shoulder pivot → upper arm, elbow pivot → forearm + hand
  function makeArm(side){
    // pivot tucked under the deltoid — no visible shoulder ball (C2)
    const sh=new THREE.Group(); sh.position.set(side*bw*0.42,1.52,0);
    const upper=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.062,0.36,12),tank?skin:shirtMat);
    upper.position.y=-0.16; sh.add(upper);
    const elb=new THREE.Group(); elb.position.y=-0.34; elb.rotation.x=-0.16; sh.add(elb);
    const elbow=new THREE.Mesh(new THREE.SphereGeometry(0.052,12,10),skin);
    elb.add(elbow);
    const fore=new THREE.Mesh(new THREE.CylinderGeometry(0.042,0.052,0.28,12),skin);
    fore.position.y=-0.15; elb.add(fore);
    const hand=new THREE.Mesh(new THREE.SphereGeometry(0.068,12,10),skin);
    hand.scale.set(0.85,1.15,0.9); hand.position.y=-0.33; elb.add(hand);
    const thumb=new THREE.Mesh(new THREE.BoxGeometry(0.032,0.085,0.032),skin);
    thumb.position.set(side*0.055,-0.3,0.045); thumb.rotation.z=side*0.55; elb.add(thumb);
    g.add(sh); return sh;
  }
  const armL=makeArm(-1), armR=makeArm(1);
  // ---- neck + head + face
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.065,0.1,8),skin);
  neck.position.y=1.57; g.add(neck);
  const headG=new THREE.Group(); headG.position.y=1.71; g.add(headG);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.155,20,16),skin);
  head.scale.set(0.92,1.08,0.96); headG.add(head);
  const jaw=new THREE.Mesh(new THREE.SphereGeometry(0.1,14,10),skin);
  jaw.scale.set(0.92,0.62,0.88); jaw.position.set(0,-0.105,0.045); headG.add(jaw);
  // eyes: white + pupil
  const white=new THREE.MeshBasicMaterial({color:0xf4f4f4});
  const dark=new THREE.MeshBasicMaterial({color:0x14101c});
  [-1,1].forEach(s=>{
    const w=new THREE.Mesh(new THREE.SphereGeometry(0.027,6,5),white);
    w.position.set(s*0.058,0.015,0.128); headG.add(w);
    const p=new THREE.Mesh(new THREE.SphereGeometry(0.013,5,4),dark);
    p.position.set(s*0.058,0.015,0.15); headG.add(p);
    const brow=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.014,0.015),hairMat);
    brow.position.set(s*0.058,0.062,0.138); headG.add(brow);
  });
  const nose=new THREE.Mesh(new THREE.BoxGeometry(0.032,0.055,0.04),skin);
  nose.position.set(0,-0.025,0.152); headG.add(nose);
  const mouth=new THREE.Mesh(new THREE.BoxGeometry(0.055,0.014,0.012),dark);
  mouth.position.set(0,-0.085,0.132); headG.add(mouth);
  // ears
  [-1,1].forEach(s=>{
    const ear=new THREE.Mesh(new THREE.SphereGeometry(0.028,6,5),skin);
    ear.position.set(s*0.14,0,0); headG.add(ear);
  });
  // ---- C4 hair library: named styles, each builds onto headG, tinted by hair.color.
  // Beard is an independent add-on. New styles = new entries.
  const HAIR_STYLES={
    bald(){},
    buzz(h){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.162,16,12),h);
      c.scale.set(0.98,0.55,1); c.position.y=0.075; headG.add(c); },
    short(h){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.162,16,12),h);
      c.scale.set(0.98,0.75,1); c.position.y=0.075; headG.add(c); },
    fade(h){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.162,16,12),h);
      c.scale.set(0.9,0.5,0.92); c.position.y=0.095; headG.add(c);
      const top=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.06,0.2),h);
      top.position.y=0.14; headG.add(top); },
    long(h){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.168,16,12),h);
      c.scale.set(1,0.85,1.03); c.position.y=0.055; headG.add(c);
      const back=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.46,0.11),h);
      back.position.set(0,-0.24,-0.14); headG.add(back); },
    ponytail(h){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.168,16,12),h);
      c.scale.set(1,0.85,1.03); c.position.y=0.055; headG.add(c);
      const tail=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.34,0.09),h);
      tail.position.set(0,-0.2,-0.17); tail.rotation.x=0.25; headG.add(tail); },
    bun(h){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.166,16,12),h);
      c.scale.set(1,0.8,1.02); c.position.y=0.06; headG.add(c);
      const b=new THREE.Mesh(new THREE.SphereGeometry(0.07,10,8),h);
      b.position.set(0,0.16,-0.1); headG.add(b); },
    afro(h){ const a=new THREE.Mesh(new THREE.SphereGeometry(0.21,14,12),h);
      a.scale.set(1,0.95,1); a.position.y=0.08; headG.add(a); },
    cap(h){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.168,16,12),h);
      c.scale.set(1,0.7,1.02); c.position.y=0.07; headG.add(c);
      const brim=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.02,0.1),h);
      brim.position.set(0,0.045,0.18); headG.add(brim); },
  };
  (HAIR_STYLES[spec.hair.style]||HAIR_STYLES.short)(hairMat);
  if(spec.hair.beard&&spec.hair.style!=='bald'){
    const beard=new THREE.Mesh(new THREE.BoxGeometry(0.19,0.09,0.05),hairMat);
    beard.position.set(0,-0.11,0.1); headG.add(beard);
  }
  g.scale.y=spec.height;
  g.userData={legL,legR,kneeL:legL.userData.knee,kneeR:legR.userData.knee,armL,armR,body,torso:torsoG,head:headG,jaw,mouth,gender,spec};
  if(typeof makeShadow==='function') g.add(makeShadow(0.5));
  return g;
}

window.randomPersonSpec=randomPersonSpec;
window.makePerson=makePerson;
})();
