'use strict';
// J1 (haptics): a haptic(pattern) helper wraps navigator.vibrate, gated by a
// Settings toggle and feature-detected so unsupported/desktop browsers never
// throw. Headless Chromium has no vibration hardware, so these tests stub
// navigator.vibrate and assert on call/no-call rather than real buzzing.

module.exports = {
  cases: [
    {
      name: 'haptic() calls navigator.vibrate when enabled and supported',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const calls = [];
          navigator.vibrate = (p) => { calls.push(p); return true; };
          SETTINGS.vibrate = true;
          haptic(50);
          hapticCrash(20);
          return { calls };
        });
        assert(r.calls.length === 2, `expected 2 vibrate calls, got ${r.calls.length}`);
        assert(r.calls[0] === 50, `expected the raw pattern to pass through, got ${r.calls[0]}`);
      },
    },
    {
      name: 'toggling the Settings vibrate flag off silences all haptics',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const calls = [];
          navigator.vibrate = (p) => { calls.push(p); return true; };
          SETTINGS.vibrate = false;
          haptic(50); hapticCrash(20); explode(0, 0, 0);
          return { calls };
        });
        assert(r.calls.length === 0, `expected zero vibrate calls while disabled, got ${r.calls.length}`);
      },
    },
    {
      name: 'haptic() is a no-op and never throws when vibrate is unsupported',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          SETTINGS.vibrate = true;
          // vibrate lives on Navigator.prototype in Chromium, so shadow it
          // with an own-property undefined rather than `delete` (a no-op on
          // an inherited method) to simulate an unsupported browser.
          navigator.vibrate = undefined;
          let threw = false;
          try { haptic(50); busted(); } catch (e) { threw = true; }
          return { threw, vibrateGone: !navigator.vibrate };
        });
        assert(r.threw === false, 'haptic()/busted() should never throw when navigator.vibrate is absent');
        assert(r.vibrateGone, 'test setup should have actually shadowed navigator.vibrate');
      },
    },
    {
      name: 'the Vibrate setting persists across a reload like the volume sliders',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const before = await page.evaluate(() => {
          setVibrateMode(false);
          return JSON.parse(localStorage.getItem('gtb4.settings')).vibrate;
        });
        assert(before === false, 'expected vibrate:false written to localStorage after setVibrateMode(false)');
        await page.reload();
        await page.waitForFunction(() => typeof SETTINGS !== 'undefined');
        const after = await page.evaluate(() => SETTINGS.vibrate);
        assert(after === false, `expected vibrate setting to survive reload, got ${after}`);
      },
    },
  ],
};
