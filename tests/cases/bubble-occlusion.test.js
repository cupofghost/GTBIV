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
  {
    name: 'OP2-E: bubble tails rotate to face the projected head, including when the box is edge-clamped',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      await page.setViewportSize({ width: 800, height: 390 });
      const r = await page.evaluate(() => {
        const el = makeChatBubble(); setChatBubbleText(el, 'Hey, over here!');
        const angDiff = (a, b) => { let d = (a - b + 540) % 360 - 180; return d; };
        const sample = (rawX, rawY) => {
          orientBubbleTail(el, el._tail, rawX, rawY);
          const left = parseFloat(el.style.left), top = parseFloat(el.style.top);
          const cx = left + el._bw / 2, cy = top + el._bh / 2;
          const expected = Math.atan2(rawY - cy, rawX - cx) * 180 / Math.PI - 90;
          const m = /rotate\(([-\d.]+)deg\)/.exec(el._tail.style.transform);
          const actual = m ? parseFloat(m[1]) : NaN;
          return { left, top, angleError: Math.abs(angDiff(actual, expected)) };
        };
        // a head roughly centered in the viewport — box should sit unclamped above it
        const center = sample(400, 150);
        const centeredBox = Math.abs(center.left - (400 - el._bw / 2)) < 0.5;
        // a head pinned to the far left edge — box must clamp horizontally,
        // and the tail must still swing around to point at the true (unclamped) head
        const edge = sample(2, 60);
        const wasClamped = edge.left > 2; // margin, not the naive rawX-bw/2 (deeply negative)
        el.remove();
        return { centerAngleError: center.angleError, edgeAngleError: edge.angleError, centeredBox, wasClamped };
      });
      assert(r.centeredBox, 'an unclamped bubble should sit directly centered over its speaker: ' + JSON.stringify(r));
      assert(r.centerAngleError < 1, 'centered tail angle should match the head direction: ' + JSON.stringify(r));
      assert(r.wasClamped, 'a head near the screen edge should force the box to clamp: ' + JSON.stringify(r));
      assert(r.edgeAngleError < 1, 'a clamped bubble tail must still point at the true head position: ' + JSON.stringify(r));
    },
  },
] };
