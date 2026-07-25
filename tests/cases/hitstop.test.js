// J2 — hitstop + refined screen shake
module.exports = {
  cases: [
    {
      name: 'SETTINGS.reduceMotion defaults to false',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        assert(await page.evaluate(() => SETTINGS.reduceMotion === false), 'expected reduceMotion default false');
      },
    },
    {
      name: 'triggerHitStop sets HIT_STOP when reduceMotion is off',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const hs = await page.evaluate(() => {
          SETTINGS.reduceMotion = false;
          HIT_STOP = 0;
          triggerHitStop(0.05);
          return HIT_STOP;
        });
        assert(hs > 0, 'expected HIT_STOP to be set, got ' + hs);
      },
    },
    {
      name: 'triggerHitStop is a no-op when reduceMotion is on',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        await page.evaluate(() => { SETTINGS.reduceMotion = true; HIT_STOP = 0; triggerHitStop(0.05); });
        const hs = await page.evaluate(() => HIT_STOP);
        assert(hs === 0, 'expected HIT_STOP to stay 0 with reduceMotion on, got ' + hs);
      },
    },
    {
      name: 'shake increases camShake unless reduceMotion is on',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        await page.evaluate(() => { SETTINGS.reduceMotion = false; camShake = 0; shake(0.5); });
        const cs = await page.evaluate(() => camShake);
        assert(cs > 0, 'expected camShake to increase, got ' + cs);
        await page.evaluate(() => { SETTINGS.reduceMotion = true; camShake = 0; shake(0.5); });
        const cs2 = await page.evaluate(() => camShake);
        assert(cs2 === 0, 'expected camShake to stay 0 with reduceMotion on, got ' + cs2);
      },
    },
    {
      name: 'Settings Reduce Motion toggle updates SETTINGS.reduceMotion',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        await page.evaluate(() => {
          setReduceMotion(false);
          // open the settings panel so the toggle buttons are clickable
          $('pauseMenu').style.display = 'flex';
          showPausePanel('pmSettings');
        });
        await page.click('#reduceMotionGroup .qBtn[data-v="on"]');
        assert(await page.evaluate(() => SETTINGS.reduceMotion === true), 'expected reduceMotion ON after clicking ON');
        await page.click('#reduceMotionGroup .qBtn[data-v="off"]');
        assert(await page.evaluate(() => SETTINGS.reduceMotion === false), 'expected reduceMotion OFF after clicking OFF');
      },
    },
  ],
};
