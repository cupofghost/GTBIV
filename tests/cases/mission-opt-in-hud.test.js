'use strict';
module.exports={cases:[{
  name:'random missions offer opt-in and wanted stars render only earned count',query:'?dev=1&skipintro=1',
  run:async(page,{assert})=>{const r=await page.evaluate(()=>{
    G.started=true;G.menuPaused=false;G.replay=false;G.interior=false;G.cutscene=false;mission=null;missionCooldown=0;missionOfferT=0;
    updateMission(.1);const offered=$('missionOffer').style.display==='block'&&!mission;
    $('missionOffer').click();const started=!!mission; failMission();
    const stars=[]; for(const n of [0,1,2,5]){G.stars=n;updateStarsHUD();stars.push({n,text:$('stars').textContent,display:$('stars').style.display});}
    return {offered,started,stars};
  });assert(r.offered&&r.started,'mission should only start from its offer: '+JSON.stringify(r));assert(r.stars.every(s=>s.text.length===s.n&&(s.n? s.display==='block':s.display==='none')),'wanted stars must be exact and hidden at zero: '+JSON.stringify(r));}
},
{
  name:'OP2-E: mission chip/offer stay small, translucent, and clear of the reticule at 800x390; STEAL CAR stays prominent',
  query:'?dev=1&skipintro=1',
  run:async(page,{assert})=>{
    await page.setViewportSize({width:800,height:390});
    const r=await page.evaluate(()=>{
      G.started=true;G.menuPaused=false;G.replay=false;G.interior=false;G.cutscene=false;mission=null;missionCooldown=0;missionOfferT=0;
      updateMission(.1);
      const offerR=$('missionOffer').getBoundingClientRect();
      const offerStyle=getComputedStyle($('missionOffer'));
      setMissionHUD('<b>DELIVERY</b> — pick up the package · 40m');
      const missionR=$('mission').getBoundingClientRect();
      const missionStyle=getComputedStyle($('mission'));
      $('mission').style.display='none';
      // reticule sits dead-center of the viewport whether or not it is currently shown
      const cx=innerWidth/2, cy=innerHeight/2;
      const overlapsCenter=r=>r.left<cx&&r.right>cx&&r.top<cy&&r.bottom>cy;
      // STEAL CAR: force the context-sensitive control into its steal state and measure it
      // (touch buttons are display:none under html.is-desktop, same as sprint.test.js)
      document.documentElement.classList.remove('is-desktop'); document.documentElement.classList.add('is-touch');
      $('btnEnter').style.display='flex'; $('btnEnter').classList.add('steal'); $('btnEnter').textContent='STEAL SEDAN';
      const stealR=$('btnEnter').getBoundingClientRect();
      $('btnEnter').classList.remove('steal');
      document.documentElement.classList.remove('is-touch'); document.documentElement.classList.add('is-desktop');
      return {
        offerW:offerR.width, offerH:offerR.height, offerBg:offerStyle.backgroundColor,
        offerOverlapsCenter:overlapsCenter(offerR),
        missionW:missionR.width, missionH:missionR.height, missionBg:missionStyle.backgroundColor,
        missionOverlapsCenter:overlapsCenter(missionR),
        stealW:stealR.width, stealH:stealR.height,
      };
    });
    assert(r.offerW<260&&r.offerH<40, 'mission offer chip should be small, not a full-screen dialog: '+JSON.stringify(r));
    assert(r.missionW<300&&r.missionH<40, 'mission status chip should be small: '+JSON.stringify(r));
    assert(!r.offerOverlapsCenter&&!r.missionOverlapsCenter, 'mission UI must stay clear of the reticule at screen-center on an 800x390 phone: '+JSON.stringify(r));
    const alpha=s=>{const m=/rgba?\([^)]+,\s*([\d.]+)\)/.exec(s); return m?parseFloat(m[1]):1;};
    assert(alpha(r.offerBg)<=0.6&&alpha(r.missionBg)<=0.6, 'mission chips should be translucent, not solid: '+JSON.stringify(r));
    assert(r.stealW>=140&&r.stealH>=48, 'STEAL CAR must stay a large, prominent control: '+JSON.stringify(r));
  }
}]};
