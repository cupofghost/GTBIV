// Boot sanity: the game has to load and reach a playable state with zero
// console/page errors before anything else in this suite is trustworthy.
module.exports = {
  cases: [
    {
      name: 'dev boot (?dev=1&skipintro=1) reaches gameplay',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const state = await page.evaluate(() => ({ started: G.started, mode: G.mode, over: G.over }));
        assert(state.started === true, 'expected G.started to be true after clicking Start');
        assert(state.mode === 'foot', 'expected G.mode to be "foot" on a fresh boot, got ' + state.mode);
        assert(state.over === false || state.over === undefined, 'expected G.over to be falsy on boot');
      },
    },
    {
      name: 'plain load (no query) shows the title screen without auto-starting',
      query: '',
      start: false,
      run: async (page, { assert }) => {
        const s = await page.evaluate(() => ({
          startVisible: document.getElementById('start').style.display !== 'none',
          started: G.started,
        }));
        assert(s.startVisible, 'expected #start (title screen) to be visible on a plain load');
        assert(s.started === false, 'expected G.started to still be false before clicking Start');
      },
    },
    {
      name: 'dev panel opens on backtick and is inert without ?dev=1',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        await page.keyboard.press('Backquote');
        await page.waitForTimeout(200);
        const rows = await page.evaluate(() =>
          [...document.querySelectorAll('#devPanel .devRow .devLbl')].map(l => l.textContent));
        assert(rows.includes('CH1 STORY'), 'expected the CH1 STORY dev row to be present, got: ' + rows.join(', '));
      },
    },
  ],
};
