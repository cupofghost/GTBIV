'use strict';

module.exports = { cases: [
  {
    name: 'full-stick sprint is hold-to-use, faster than running, and suppressed by foot-state guards',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const p=player, spot=intersections[0];
        const origResolve=resolveFootCollision,origStuck=updateFootStuckRecovery;
        resolveFootCollision=()=>{};updateFootStuckRecovery=()=>{};
        const prep=()=>{ G.mode='foot'; G.started=true; G.over=false; G.crouching=false; p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.vy=0;p.climb=null;p.bailing=false;p.stunT=0;p.punchT=0;p.kickT=0;p.heading=0; input.jx=0;input.jy=-1; camera.position.set(p.x,p.y+3,p.z+10); camera.lookAt(p.x,p.y+1,p.z); camera.updateMatrixWorld(); };
        prep(); input.sprint=false; const z0=p.z; updateFoot(.1); const run=Math.hypot(p.x-spot.x,p.z-z0)/.1;
        prep(); input.sprint=true; const s0=p.z; updateFoot(.1); const sprint=Math.hypot(p.x-spot.x,p.z-s0)/.1; const sprintOn=p.sprinting;
        input.sprint=false; updateFoot(.02); const released=!p.sprinting;
        const blocked=[]; for(const state of ['crouch','climb','bail','stun','attack']){ prep(); input.sprint=true; if(state==='crouch')G.crouching=true; if(state==='climb')p.climb={}; if(state==='bail')p.bailing=true; if(state==='stun')p.stunT=1; if(state==='attack')p.punchT=.3; blocked.push(!canSprint(p,1)); }
        resolveFootCollision=origResolve;updateFootStuckRecovery=origStuck;
        return {run,sprint,sprintOn,released,blocked};
      });
      assert(r.run>7.8&&r.run<8.6, 'normal full-stick movement should remain about 8.2u/s: '+JSON.stringify(r));
      assert(r.sprint>11.5&&r.sprint<12.5&&r.sprintOn&&r.released, 'held sprint should be about 12u/s and release immediately: '+JSON.stringify(r));
      assert(r.blocked.every(Boolean), 'crouch/climb/bail/stun/attack should all suppress sprint: '+JSON.stringify(r));
    },
  },
  {
    name: 'Shift/touch sprint share input state, distinct pose, cleanup, and a four-row 800x390 layout',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        const p=player, spot=intersections[1], pose=()=>({kL:p.mesh.userData.kneeL.rotation.x,aL:p.mesh.userData.armL.rotation.x,t:p.mesh.userData.torso.rotation.x});
        G.mode='foot';G.started=true;G.crouching=false;G.weapon='fists';p.x=spot.x;p.z=spot.z;p.y=groundH(p.x,p.z);p.phase=0;p.punchT=0;p.kickT=0;p.climb=null;p.bailing=false;p.stunT=0;input.jx=0;input.jy=-1;camera.position.set(p.x,p.y+3,p.z+10);camera.lookAt(p.x,p.y+1,p.z);camera.updateMatrixWorld();
        sprintArmed=true; input.sprint=false; updateFoot(.04); const normal=pose(); p.phase=-2.2; input.sprint=true; updateFoot(.04); const sprint=pose();
        keys.ShiftLeft=true; pollKeys(); const shift=input.sprint; keys.ShiftLeft=false; btnHold.sprint=true; pollKeys(); const touch=input.sprint; clearSprint(); const cleared=!input.sprint&&!btnHold.sprint;
        document.documentElement.classList.remove('is-desktop'); document.documentElement.classList.add('is-touch'); refreshButtons(); $('btnEnter').style.display='flex'; const jump=$('btnJump').getBoundingClientRect(), sprintBtn=$('btnSprint').getBoundingClientRect(), enter=$('btnEnter').getBoundingClientRect();
        document.documentElement.classList.remove('is-touch'); document.documentElement.classList.add('is-desktop');
        return {normal,sprint,shift,touch,cleared,visible:jump.width>0&&sprintBtn.width>0,overlap:!(jump.right<=sprintBtn.left||sprintBtn.right<=jump.left||jump.bottom<=sprintBtn.top||sprintBtn.bottom<=jump.top),enterBelow:enter.top>=jump.bottom};
      });
      assert(r.shift&&r.touch&&r.cleared, 'Shift and touch must share sprint input and clear held state');
      assert(Math.abs(r.normal.kL-r.sprint.kL)>.2&&Math.abs(r.normal.aL-r.sprint.aL)>.2&&Math.abs(r.normal.t-r.sprint.t)>.1, 'sprint pose should visibly change knees, arms, and torso: '+JSON.stringify(r));
      assert(r.visible&&!r.overlap&&r.enterBelow, 'JUMP and SPRINT should be visible side by side without overlapping controls at 800x390: '+JSON.stringify(r));
    },
  },
  {
    name: 'a vehicle exit requires a fresh sprint press but restores both input paths',
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      const r = await page.evaluate(() => {
        G.mode='foot'; keys.ShiftLeft=true; disarmSprint(); pollKeys(); const heldAcrossExit=input.sprint;
        keys.ShiftLeft=false; pollKeys(); keys.ShiftLeft=true; pollKeys(); const freshShift=input.sprint;
        disarmSprint(); btnHold.sprint=true; sprintArmed=true; pollKeys(); const freshTouch=input.sprint;
        clearSprint(); keys.ShiftLeft=false; return {heldAcrossExit,freshShift,freshTouch};
      });
      assert(!r.heldAcrossExit&&r.freshShift&&r.freshTouch, 'exit must reject held boost and accept fresh Shift/touch sprint: '+JSON.stringify(r));
    },
  },
] };
