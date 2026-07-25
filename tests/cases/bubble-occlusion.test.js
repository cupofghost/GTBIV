'use strict';

module.exports = { cases: [
  {
    name: 'building occlusion hides TALK, ambient chat, and Deb bubbles then restores them around a corner',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const saved=buildings.splice(0,buildings.length), pedsSaved=peds.splice(0,peds.length), oldDeb=deb, oldMet=G.story.metDeb;
        buildings.push({minX:-1,maxX:1,minZ:3,maxZ:7,baseY:0,h:5});
        const aim=(x,y,z,tx,ty,tz)=>{ camera.position.set(x,y,z); camera.lookAt(tx,ty,tz); camera.updateMatrixWorld(); camera.updateProjectionMatrix(); };
        const ped={x:0,z:0,bub:document.createElement('div'),bubT:2}; document.body.appendChild(ped.bub); peds.push(ped);
        deb={x:0,z:0,mesh:{rotation:{},position:{}},bub:document.createElement('div'),bubT:2,lineIdx:DEB_LINES.length,leaving:false}; document.body.appendChild(deb.bub); G.story.metDeb=true;
        aim(0,2,10,0,2.4,0); showBubble(ped,'TALK',5000); positionBubble(); positionChatBubbles(0); updateStory(0);
        const blocked=[$('bubble').style.display,ped.bub.style.display,deb.bub.style.display];
        aim(10,2,10,0,2.4,0); positionBubble(); positionChatBubbles(0); updateStory(0);
        const restored=[$('bubble').style.display,ped.bub.style.display,deb.bub.style.display];
        clearTimeout(bubbleT); bubblePed=null; $('bubble').style.display='none'; ped.bub.remove(); deb.bub.remove(); deb=oldDeb; G.story.metDeb=oldMet;
        peds.push(...pedsSaved); buildings.push(...saved);
        return {blocked,restored};
      });
      assert(r.blocked.every(x=>x==='none'), 'all world-space bubbles should hide behind the building: '+JSON.stringify(r));
      assert(r.restored.every(x=>x==='block'), 'all bubbles should restore while their timers remain: '+JSON.stringify(r));
    },
  },
  {
    name: 'bubble helper keeps rooftop sightlines visible and hides expired, off-screen, and far chat',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const saved=buildings.splice(0,buildings.length);
        buildings.push({minX:-1,maxX:1,minZ:3,maxZ:7,baseY:0,h:5});
        const el=document.createElement('div'); document.body.appendChild(el);
        const aim=(x,y,z,tx,ty,tz)=>{ camera.position.set(x,y,z); camera.lookAt(tx,ty,tz); camera.updateMatrixWorld(); camera.updateProjectionMatrix(); };
        aim(0,9,10,0,8,0); const roof=placeWorldBubble(el,0,8,0);
        aim(0,2,10,0,2,20); const off=placeWorldBubble(el,0,2,0);
        aim(0,2,10,0,2,0); const far=placeWorldBubble(el,100,2,0,42);
        const expired=placeWorldBubble(el,0,2,0,undefined,true);
        const display=el.style.display; el.remove(); buildings.push(...saved);
        return {roof,off,far,expired,display};
      });
      assert(r.roof, 'a sightline above the roof should remain visible');
      assert(!r.off&&!r.far&&!r.expired&&r.display==='none', 'off-screen, far, and expired bubbles should remain hidden');
    },
  },
] };
