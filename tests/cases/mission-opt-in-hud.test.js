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
}]};
