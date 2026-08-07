// §POST FX — the screen-space finishing pass (PV1).
//
// These are state/wiring tests, not visual ones: the suite has no way to judge
// a grade. What they pin down is that every render path goes through the
// composer, that the impulse API decays instead of latching, that the quality
// tier and the Settings toggle really reach the shader, and that turning FILM
// FX off restores the plain render path exactly.

module.exports = [
  {
    name: 'Post FX: composer builds and every render path goes through renderFrame',
    start: 'skipintro',
    async run(page, { assert, assertEqual }) {
      await page.waitForTimeout(1200);
      const s = await page.evaluate(() => ({
        hasFX: typeof FX === 'object',
        hasComposer: typeof POSTFX === 'object' && typeof POSTFX.render === 'function',
        hasRenderFrame: typeof renderFrame === 'function',
        enabled: FX.enabled,
        // the three former `renderer.render(scene,camera)` call sites in the
        // main loop must all be gone — only §POST FX may call it directly
        loopSrc: loop.toString(),
      }));
      assert(s.hasFX, 'FX state object should exist');
      assert(s.hasComposer, 'POSTFX composer should exist with a render()');
      assert(s.hasRenderFrame, 'renderFrame() should exist');
      assert(s.enabled, 'post FX should default to on');
      assert(!/renderer\.render\(/.test(s.loopSrc),
        'main loop should render only through renderFrame(), not renderer.render()');
      assert(/renderFrame\(\)/.test(s.loopSrc), 'main loop should call renderFrame()');
    }
  },

  {
    name: 'Post FX: render targets track the drawing buffer size',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        renderFrame();
        const size = renderer.getDrawingBufferSize(new THREE.Vector2());
        const rt = POSTFX._rt();
        return {
          w: Math.floor(size.x), h: Math.floor(size.y),
          sceneW: rt.rtScene.width, sceneH: rt.rtScene.height,
          halfW: rt.rtA.width, quarterW: rt.rtC.width,
        };
      });
      assert(r.sceneW === r.w && r.sceneH === r.h,
        `scene target ${r.sceneW}x${r.sceneH} should match drawing buffer ${r.w}x${r.h}`);
      assert(r.halfW === Math.max(1, r.w >> 1), 'bloom mip A should be half width');
      assert(r.quarterW === Math.max(1, r.w >> 2), 'bloom mip C should be quarter width');
    }
  },

  {
    name: 'Post FX: a resize re-fits every target',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        renderer.setSize(640, 300);
        renderFrame();
        const size = renderer.getDrawingBufferSize(new THREE.Vector2());
        const rt = POSTFX._rt();
        return { w: Math.floor(size.x), sceneW: rt.rtScene.width, halfW: rt.rtA.width };
      });
      assert(r.sceneW === r.w, `scene target should have followed the resize (got ${r.sceneW}, want ${r.w})`);
      assert(r.halfW === Math.max(1, r.w >> 1), 'half-res mip should have followed the resize');
    }
  },

  {
    name: 'Post FX: impulses spike then decay back to rest',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        FX.flash = FX.damage = FX.desat = FX.kick = FX.bloomPulse = 0;
        fxFlash(0.6, 1, 0.7, 0.3);
        fxDamage(0.5);
        fxImpact(0.8);
        const spiked = { flash: FX.flash, damage: FX.damage, kick: FX.kick, bloomPulse: FX.bloomPulse };
        // drive the decay with simulated dt rather than wall clock — headless
        // rAF is throttled far too hard to wait this out in real time
        G.hp = 100;                       // keep the low-health floor out of it
        for (let i = 0; i < 200; i++) updateFxImpulses(0.02);
        const rested = { flash: FX.flash, damage: FX.damage, kick: FX.kick, bloomPulse: FX.bloomPulse };
        return { spiked, rested };
      });
      assert(r.spiked.flash > 0.5, `flash should spike (got ${r.spiked.flash})`);
      assert(r.spiked.damage > 0.4, `damage should spike (got ${r.spiked.damage})`);
      assert(r.spiked.kick > 0.7, `impact kick should spike (got ${r.spiked.kick})`);
      for (const k of ['flash', 'damage', 'kick', 'bloomPulse']) {
        assert(r.rested[k] === 0, `${k} should decay all the way to 0, got ${r.rested[k]}`);
      }
    }
  },

  {
    name: 'Post FX: fxFlash keeps the brightest flash in flight',
    start: 'skipintro',
    async run(page, { assert, assertEqual }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        FX.flash = 0;
        fxFlash(0.7, 1, 0, 0);
        fxFlash(0.2, 0, 0, 1);   // a dimmer one must not stomp the bright one
        const afterDim = { v: FX.flash, b: FX.flashB };
        fxFlash(0.9, 0, 1, 0);   // a brighter one must win
        return { afterDim, afterBright: { v: FX.flash, g: FX.flashG } };
      });
      assert(Math.abs(r.afterDim.v - 0.7) < 1e-6, `dim flash should not override bright (got ${r.afterDim.v})`);
      assert(r.afterDim.b === 0, 'dim flash should not have replaced the colour either');
      assert(Math.abs(r.afterBright.v - 0.9) < 1e-6, 'a brighter flash should take over');
      assertEqual(r.afterBright.g, 1, 'the brighter flash should bring its own colour');
    }
  },

  {
    name: 'Post FX: low health drives a sustained red throb, and stays vibrant',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        FX.damage = FX.desat = 0;
        G.mode = 'foot'; G.over = false;
        G.hp = 100; updateFxImpulses(0.016);
        const healthy = { d: FX.damage, s: FX.desat };
        G.hp = 8;
        // several ticks so the floor is applied rather than a single sample
        for (let i = 0; i < 5; i++) updateFxImpulses(0.016);
        const hurt = { d: FX.damage, s: FX.desat };
        G.hp = 100;
        return { healthy, hurt };
      });
      assert(r.healthy.d === 0 && r.healthy.s === 0, 'a healthy Turbo should get no damage grade');
      assert(r.hurt.d > 0.15, `near-death should push a visible red pulse (got ${r.hurt.d})`);
      // Owner direction: the picture stays vibrant. The red edge pulse carries
      // "you are dying"; desaturation is a trace, not a grey-out.
      assert(r.hurt.s > 0, `near-death should still tint slightly (got ${r.hurt.s})`);
      assert(r.hurt.s < 0.2, `near-death must not grey the world out (got ${r.hurt.s})`);
    }
  },

  {
    name: 'Post FX: quality tier drives the bloom chain, low disables bloom',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const u = POSTFX._mats.matComp.uniforms;
        const read = () => ({ on: u.uBloomOn.value, wide: u.uBloomWide.value });
        applyQuality('high'); renderFrame(); const high = read();
        applyQuality('medium'); renderFrame(); const medium = read();
        applyQuality('low'); renderFrame(); const low = read();
        applyQuality('high'); renderFrame();
        return { high, medium, low, tierAfter: FX.tier };
      });
      assert(r.high.on === 1 && r.high.wide > 0, 'high should run bloom with the wide halo');
      assert(r.medium.on === 1 && r.medium.wide === 0, 'medium should bloom without the wide halo');
      assert(r.low.on === 0, 'low should disable bloom entirely');
      assert(r.tierAfter === 'high', 'applyQuality should leave FX.tier in step');
    }
  },

  {
    name: 'Post FX: the FILM FX setting toggles the plain render path and persists',
    start: 'skipintro',
    async run(page, { assert, assertEqual }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        setPostFx(false);
        const off = { enabled: FX.enabled, saved: JSON.parse(localStorage.getItem('gtb4.settings')).postFx };
        renderFrame();                    // must not throw on the bypass path
        setPostFx(true);
        const on = { enabled: FX.enabled, saved: JSON.parse(localStorage.getItem('gtb4.settings')).postFx };
        renderFrame();
        return { off, on };
      });
      assertEqual(r.off.enabled, false, 'FILM FX off should disable the composer');
      assertEqual(r.off.saved, false, 'FILM FX off should persist to the settings blob');
      assertEqual(r.on.enabled, true, 'FILM FX on should re-enable the composer');
      assertEqual(r.on.saved, true, 'FILM FX on should persist to the settings blob');
    }
  },

  {
    name: 'Post FX: reduce-motion suppresses grain, scanlines and aberration',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const u = POSTFX._mats.matComp.uniforms;
        setReduceMotion(false);
        FX.aberration = 0.05;
        renderFrame();
        const motion = { grain: u.uGrain.value, scan: u.uScan.value, aberr: u.uAberr.value };
        setReduceMotion(true);
        FX.aberration = 0.05;
        renderFrame();
        const reduced = { grain: u.uGrain.value, scan: u.uScan.value, aberr: u.uAberr.value };
        setReduceMotion(false);
        return { motion, reduced };
      });
      assert(r.motion.grain > 0, 'grain should be on by default');
      assert(r.reduced.grain === 0, 'reduce motion should kill grain');
      assert(r.reduced.scan === 0, 'reduce motion should kill scanlines');
      assert(r.reduced.aberr === 0, 'reduce motion should kill chromatic aberration');
    }
  },

  {
    name: 'Post FX: explosions and player damage fire the right impulses',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        FX.flash = FX.kick = FX.damage = 0;
        bigExplosion(player.x + 12, 1, player.z);
        const boom = { flash: FX.flash, kick: FX.kick };
        FX.damage = 0;
        DEV_STATE.god = false;
        const hp0 = G.hp;
        damagePlayer(20);
        const hit = { damage: FX.damage };
        G.hp = hp0;
        return { boom, hit };
      });
      assert(r.boom.flash > 0.4, `a car explosion should flash the screen (got ${r.boom.flash})`);
      assert(r.boom.kick > 0.5, `a car explosion should punch the lens (got ${r.boom.kick})`);
      assert(r.hit.damage > 0.15, `taking 20 damage should pulse red (got ${r.hit.damage})`);
    }
  },
];
