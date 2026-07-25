// D5 — dev time controls: TIME_SCALE and frame-step
module.exports = {
  cases: [
    {
      name: 'TIME_SCALE defaults to 1 and stepOneFrame increments STEP_FRAMES',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert, assertEqual }) => {
        const state = await page.evaluate(() => {
          stepOneFrame();
          stepOneFrame();
          return { timeScale: TIME_SCALE, stepFrames: STEP_FRAMES };
        });
        assertEqual(state.timeScale, 1, 'expected default TIME_SCALE 1');
        assert(state.stepFrames === 2, 'expected STEP_FRAMES to be 2, got ' + state.stepFrames);
      },
    },
    {
      name: 'setTimeScale updates TIME_SCALE',
      query: '?dev=1&skipintro=1',
      run: async (page, { assertEqual }) => {
        await page.evaluate(() => { setTimeScale(0.25); });
        assertEqual(await page.evaluate(() => TIME_SCALE), 0.25, 'expected TIME_SCALE 0.25');
        await page.evaluate(() => { setTimeScale(1); });
      },
    },
    {
      name: 'dev key 2 sets time scale to 0.25',
      query: '?dev=1&skipintro=1',
      run: async (page, { assertEqual }) => {
        await page.keyboard.press('Digit2');
        assertEqual(await page.evaluate(() => TIME_SCALE), 0.25, 'expected Digit2 to set 0.25×');
        await page.evaluate(() => { setTimeScale(1); });
      },
    },
    {
      name: 'dev key 3 sets time scale to 4',
      query: '?dev=1&skipintro=1',
      run: async (page, { assertEqual }) => {
        await page.keyboard.press('Digit3');
        assertEqual(await page.evaluate(() => TIME_SCALE), 4, 'expected Digit3 to set 4×');
        await page.evaluate(() => { setTimeScale(1); });
      },
    },
    {
      name: 'dev key 1 restores normal time scale',
      query: '?dev=1&skipintro=1',
      run: async (page, { assertEqual }) => {
        await page.evaluate(() => { setTimeScale(4); });
        await page.keyboard.press('Digit1');
        assertEqual(await page.evaluate(() => TIME_SCALE), 1, 'expected Digit1 to restore 1×');
      },
    },
  ],
};
