// Death splat + break-apart. The animation is cosmetic; the RESTORE is the
// contract. respawn() knows nothing about detached limbs, so every case here
// exists to prove one thing: whatever the death sequence takes apart, the
// respawn puts back — right parent, zeroed rotation, rest position and scale,
// no stranded splat, no piece left parented to the scene. A mis-parented limb
// never throws, it just shows up as a broken walk cycle, so the last case
// drives updateFoot afterwards and watches the limbs actually move.
//
// updateDeathFx() is stepped by hand rather than left to requestAnimationFrame:
// headless Chromium throttles rAF hard (see tests/helpers.js), and stepping it
// makes the mid-sequence assertions deterministic. respawn()'s 1800 ms is a
// real setTimeout, so the restore assertions await real wall-clock time.

// Injected into the page: everything the assertions need about the rig, in one
// plain object that survives structured cloning.
const RIG_PROBE = `(function(){
  const u=player.mesh.userData, out={pieces:{},childCount:player.mesh.children.length,
    splatInScene:!!(_splatMesh&&_splatMesh.parent===scene),
    splatOpacity:_splatMesh?_splatMesh.userData.mat.opacity:0,
    active:!!deathFx, sceneChildren:scene.children.length, shadowVisible:!!(u.shadow&&u.shadow.visible)};
  for(const k of DEATH_PIECES){
    const o=u[k]; if(!o) continue;
    out.pieces[k]={
      parent: o.parent===player.mesh?'root':(o.parent===u.legL?'legL':(o.parent===u.legR?'legR':
              (o.parent===scene?'SCENE':(o.parent?'other':'DETACHED')))),
      px:o.position.x, py:o.position.y, pz:o.position.z,
      rx:o.rotation.x, ry:o.rotation.y, rz:o.rotation.z,
      sx:o.scale.x, sy:o.scale.y, sz:o.scale.z,
      visible:o.visible,
    };
  }
  return out;
})()`;

// respawn()'s 1800 ms is a wall-clock setTimeout, and it has to be awaited from
// INSIDE the page: this sandbox's headless Chromium does not run page timers
// while the driver sits in page.waitForTimeout(). fall-damage.test.js waits the
// same way for the same reason.
const awaitRespawn = page => page.evaluate(() =>
  new Promise(resolve => setTimeout(resolve, 2000)));

// Every piece back where makePerson() left it. `rest` is a probe taken before
// the first death, so this compares against the real rig rather than guesses.
function assertRestored(assert, rest, now, label) {
  const EXPECT = { legL: 'root', legR: 'root', armL: 'root', armR: 'root',
                   torso: 'root', head: 'root', kneeL: 'legL', kneeR: 'legR' };
  for (const k of Object.keys(EXPECT)) {
    const r = rest.pieces[k], n = now.pieces[k];
    assert(!!n, `${label}: rig piece ${k} vanished`);
    assert(n.parent === EXPECT[k],
      `${label}: ${k} must be re-parented to ${EXPECT[k]}, is "${n.parent}"`);
    assert(Math.abs(n.rx) < 1e-6 && Math.abs(n.ry) < 1e-6 && Math.abs(n.rz) < 1e-6,
      `${label}: ${k} local rotation must be zeroed, is ${JSON.stringify([n.rx, n.ry, n.rz])}`);
    assert(Math.abs(n.px - r.px) < 1e-6 && Math.abs(n.py - r.py) < 1e-6 && Math.abs(n.pz - r.pz) < 1e-6,
      `${label}: ${k} local position must be back at rest ${JSON.stringify([r.px, r.py, r.pz])}, is ${JSON.stringify([n.px, n.py, n.pz])}`);
    assert(Math.abs(n.sx - r.sx) < 1e-6 && Math.abs(n.sy - r.sy) < 1e-6 && Math.abs(n.sz - r.sz) < 1e-6,
      `${label}: ${k} local scale must be back at rest, is ${JSON.stringify([n.sx, n.sy, n.sz])}`);
    assert(n.visible === true, `${label}: ${k} must be visible again`);
  }
  assert(now.childCount === rest.childCount,
    `${label}: player.mesh must end with its original child count (${rest.childCount}), has ${now.childCount}`);
  assert(now.splatInScene === false, `${label}: the splat must be out of the scene`);
  assert(now.splatOpacity === 0, `${label}: the splat material must be cleared to 0 opacity`);
  assert(now.active === false, `${label}: no death sequence may still be live after the respawn`);
  assert(now.shadowVisible === true, `${label}: the blob shadow must be restored`);
}

// Drops Turbo on solid ground somewhere sane, kills him, and steps the
// sequence. Returns { rest, mid } probes; the caller awaits the respawn.
const KILL = (reduceMotion, steps) => `(function(){
  SETTINGS.reduceMotion=${reduceMotion};
  DEV_STATE.god=false; G.mode='foot'; G.over=false; G.hp=100;
  player.car=null; player.heli=null; player.climb=null; player.bailing=false; player.stunT=0;
  const spot=intersections[Math.floor(intersections.length/2)];
  player.x=spot.x+4; player.z=spot.z+4; player.y=groundH(player.x,player.z);
  player.mesh.position.set(player.x,player.y,player.z);
  input.jx=0; input.jy=0; input.sprint=false;
  const onLand=!overWater(player.x,player.z);
  const rest=${RIG_PROBE};
  wasted();
  for(let i=0;i<${steps};i++) updateDeathFx(0.05);
  const mid=${RIG_PROBE};
  return {rest,mid,onLand};
})()`;

module.exports = {
  cases: [
    {
      name: 'a death breaks the rig apart, lands a splat, and the respawn re-assembles every piece',
      query: '?dev=1&skipintro=1&seed=515151',
      run: async (page, { assert }) => {
        const r = await page.evaluate(KILL(false, 6));
        assert(r.onLand, 'the test must kill him on solid ground so the splat can land');
        // mid-sequence: actually taken apart
        assert(r.mid.active === true, 'a death must start a live sequence');
        assert(r.mid.pieces.kneeL.parent === 'root' && r.mid.pieces.kneeR.parent === 'root',
          'the knees must detach from the thighs and fly on their own: ' + JSON.stringify(r.mid.pieces.kneeL));
        const moved = Object.keys(r.mid.pieces).filter(k => {
          const a = r.rest.pieces[k], b = r.mid.pieces[k];
          return Math.hypot(b.px - a.px, b.py - a.py, b.pz - a.pz) > 0.05;
        });
        assert(moved.length === 8, 'all eight pieces must tumble away from their rest pose, moved: ' + JSON.stringify(moved));
        const spun = Object.keys(r.mid.pieces).some(k => Math.abs(r.mid.pieces[k].rx) > 0.05);
        assert(spun, 'the pieces must tumble, not just translate');
        assert(r.mid.splatInScene && r.mid.splatOpacity > 0,
          'a visible splat decal must be on the ground during the sequence: ' + JSON.stringify([r.mid.splatInScene, r.mid.splatOpacity]));
        assert(r.mid.shadowVisible === false, 'the blob shadow must go while the body is in pieces');

        await awaitRespawn(page);   // respawn()'s real 1800ms timer
        const after = await page.evaluate(RIG_PROBE);
        assertRestored(assert, r.rest, after, 'after respawn');
        const over = await page.evaluate(() => G.over);
        assert(over === false, 'the respawn must complete and hand control back');
      },
    },
    {
      name: 'the rig restores in full even when the death sequence never gets a single frame',
      query: '?dev=1&skipintro=1&seed=515151',
      run: async (page, { assert }) => {
        // The cutscene / cinema / backgrounded-tab case: loop() stops ticking
        // updateDeathFx but respawn()'s wall-clock timer fires anyway. The
        // restore must not depend on the animation having finished.
        const r = await page.evaluate(KILL(false, 0));
        assert(r.mid.active === true, 'the sequence must be armed even with no frames');
        assert(r.mid.pieces.kneeL.parent === 'root', 'pieces detach at the moment of death, not on the first frame');
        await awaitRespawn(page);
        const after = await page.evaluate(RIG_PROBE);
        assertRestored(assert, r.rest, after, 'unticked death');
      },
    },
    {
      name: 'repeated deaths strand nothing — no splat left in the scene, no piece left on the scene graph',
      query: '?dev=1&skipintro=1&seed=515151',
      run: async (page, { assert }) => {
        let rest = null;
        for (let i = 0; i < 3; i++) {
          const r = await page.evaluate(KILL(false, 12));
          if (!rest) rest = r.rest;
          await awaitRespawn(page);
          const after = await page.evaluate(RIG_PROBE);
          assertRestored(assert, rest, after, `death ${i + 1}`);
        }
        const leaks = await page.evaluate(() => {
          const u = player.mesh.userData;
          const stray = DEATH_PIECES.filter(k => u[k] && scene.children.includes(u[k]));
          return {
            stray,
            splatCopies: scene.children.filter(c => c === _splatMesh).length,
            singleSplat: _splatMesh && _splatMesh.children.length === 3,
            // the decal must never have tinted the shared blob-shadow material
            sharedShadowBlack: shMat.color.getHex() === 0x000000,
            sharedShadowOpacity: shMat.opacity,
            splatIsClone: !!_splatMesh && _splatMesh.userData.mat !== shMat,
          };
        });
        assert(leaks.stray.length === 0, 'no rig piece may be left parented to the scene: ' + JSON.stringify(leaks.stray));
        assert(leaks.splatCopies === 0, 'no splat may be left in the scene after a respawn');
        assert(leaks.singleSplat, 'the splat must be one re-used mesh, not rebuilt per death');
        assert(leaks.splatIsClone, 'the splat must use a CLONE of shMat');
        assert(leaks.sharedShadowBlack && Math.abs(leaks.sharedShadowOpacity - 0.32) < 1e-6,
          'the shared blob-shadow material must be untouched: ' + JSON.stringify(leaks));
      },
    },
    {
      name: 'reduceMotion softens the break-apart but restores through exactly the same path',
      query: '?dev=1&skipintro=1&seed=515151',
      run: async (page, { assert }) => {
        const r = await page.evaluate(KILL(true, 12));
        assert(r.mid.active === true, 'reduceMotion must still play a death, not skip it');
        assert(r.mid.pieces.kneeL.parent === 'legL' && r.mid.pieces.head.parent === 'root',
          'reduceMotion must not detach the limbs: ' + JSON.stringify(r.mid.pieces.kneeL));
        const moved = Object.keys(r.mid.pieces).some(k => {
          const a = r.rest.pieces[k], b = r.mid.pieces[k];
          return Math.hypot(b.px - a.px, b.py - a.py, b.pz - a.pz) > 1e-6;
        });
        assert(!moved, 'reduceMotion must leave the rig whole — no piece may be flung');
        assert(r.mid.splatInScene && r.mid.splatOpacity > 0,
          'reduceMotion still gets the splat: ' + JSON.stringify([r.mid.splatInScene, r.mid.splatOpacity]));
        const topple = await page.evaluate(() => player.mesh.rotation.x);
        assert(topple < -0.5, 'reduceMotion should topple him rather than whip his limbs around, rotation.x=' + topple);
        await awaitRespawn(page);
        const after = await page.evaluate(RIG_PROBE);
        assertRestored(assert, r.rest, after, 'reduceMotion death');
        const rot = await page.evaluate(() => player.mesh.rotation.x);
        assert(Math.abs(rot) < 1e-6, 'the topple must be undone on respawn, rotation.x=' + rot);
        await page.evaluate(() => { SETTINGS.reduceMotion = false; });
      },
    },
    {
      name: 'the walk cycle still drives the limbs after a death and respawn',
      query: '?dev=1&skipintro=1&seed=515151',
      run: async (page, { assert }) => {
        // A mis-parented limb never throws — it shows up as a dead walk cycle,
        // because updateFoot writes u.legL.rotation.x and friends directly.
        await page.evaluate(KILL(false, 20));
        await awaitRespawn(page);
        const r = await page.evaluate(() => {
          G.mode = 'foot'; G.over = false;
          player.car = null; player.climb = null; player.bailing = false; player.stunT = 0;
          player.y = groundH(player.x, player.z); player.vy = 0; player.fallPeakY = null;
          const u = player.mesh.userData;
          const track = { legL: [], kneeL: [], armR: [], torso: [] };
          const sample = () => { for (const k of Object.keys(track)) track[k].push(u[k].rotation.x); };
          input.jx = 0; input.jy = 1; input.sprint = false;
          for (let i = 0; i < 40; i++) { updateFoot(0.03); sample(); }
          input.sprint = true;
          for (let i = 0; i < 40; i++) { updateFoot(0.03); sample(); }
          input.sprint = false; G.crouching = true;
          for (let i = 0; i < 20; i++) { updateFoot(0.03); sample(); }
          G.crouching = false; input.jx = 0; input.jy = 0;
          player.punchT = 0.5;   // the melee pose writes u.armL/u.armR directly
          for (let i = 0; i < 20; i++) { updateFoot(0.03); sample(); }
          const spans = {};
          for (const k of Object.keys(track)) spans[k] = Math.max(...track[k]) - Math.min(...track[k]);
          return {
            spans,
            kneeParented: u.kneeL.parent === u.legL && u.kneeR.parent === u.legR,
            limbsParented: [u.legL, u.legR, u.armL, u.armR, u.torso, u.head].every(o => o.parent === player.mesh),
            worldY: (() => { const v = new THREE.Vector3(); u.head.getWorldPosition(v); return v.y - player.mesh.position.y; })(),
          };
        });
        assert(r.kneeParented && r.limbsParented,
          'every limb must still hang off its original parent after a death: ' + JSON.stringify(r));
        assert(r.spans.legL > 0.3, 'the leg must still swing through the walk/sprint cycle: ' + JSON.stringify(r.spans));
        assert(r.spans.kneeL > 0.05, 'the knee must still fold — a re-parented knee reads as a stiff leg: ' + JSON.stringify(r.spans));
        assert(r.spans.armR > 0.2, 'the arm must still swing and punch: ' + JSON.stringify(r.spans));
        assert(r.worldY > 1.5 && r.worldY < 2.4,
          'the head must sit back on top of the body at roughly rig height, offset=' + r.worldY);
      },
    },
    {
      name: 'a death out over the water skips the ground decal but still restores the rig',
      query: '?dev=1&skipintro=1&seed=515151',
      run: async (page, { assert }) => {
        // Drowning and car-into-water pass a shore `spot` to wasted(); a red
        // decal on the sea would be stranded scenery, so it is simply skipped.
        const r = await page.evaluate(() => {
          SETTINGS.reduceMotion = false;
          DEV_STATE.god = false; G.mode = 'foot'; G.over = false; G.hp = 100;
          player.car = null; player.heli = null; player.bailing = false; player.stunT = 0;
          player.x = WATER_R + 30; player.z = WATER_R + 30; player.y = 0;
          const shore = { x: clamp(player.x, -(WATER_R - 7), WATER_R - 7), z: clamp(player.z, -(WATER_R - 7), WATER_R - 7) };
          const before = { over: overWater(player.x, player.z) };
          wasted(shore);
          for (let i = 0; i < 8; i++) updateDeathFx(0.05);
          before.splatInScene = !!(_splatMesh && _splatMesh.parent === scene);
          before.detached = player.mesh.userData.kneeL.parent === player.mesh;
          return before;
        });
        assert(r.over === true, 'the test must actually be over water');
        assert(r.splatInScene === false, 'no splat decal may be dropped on the ocean');
        assert(r.detached === true, 'the break-apart still plays over water');
        await awaitRespawn(page);
        const after = await page.evaluate(RIG_PROBE);
        const EXPECT = { legL: 'root', legR: 'root', armL: 'root', armR: 'root', torso: 'root', head: 'root', kneeL: 'legL', kneeR: 'legR' };
        for (const k of Object.keys(EXPECT)) {
          assert(after.pieces[k].parent === EXPECT[k], `water death: ${k} must be re-parented to ${EXPECT[k]}`);
          assert(Math.abs(after.pieces[k].rx) < 1e-6, `water death: ${k} rotation must be zeroed`);
          assert(after.pieces[k].visible === true, `water death: ${k} must be visible again`);
        }
        assert(after.active === false && after.splatInScene === false, 'water death must leave nothing live: ' + JSON.stringify(after.active));
      },
    },
  ],
};
