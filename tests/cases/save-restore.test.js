// F1 (save/restore) plus this session's new story fields riding along in
// the same blob. Guards against silent save-shape drift: it's easy to add
// a new G.story field, forget to wire it into saveGame()/restoreSave(),
// and not notice for weeks because the game still "works" — it just quietly
// forgets that flag on every reload.
module.exports = {
  cases: [
    {
      name: 'saveGame/restoreSave round-trips every G.story field',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.money = 555; G.missionsDone = 4; G.coachBeaten = true;
          G.story.metDeb = true; G.story.debt = 250; G.story.paidOff = false;
          G.story.pizzaHeat = 7; G.story.pizzaWarned = true;
          G.story.pizzaRepeatWarned = true; G.story.firstScoreShown = true;
          G.story.hardcastleShown = true;
          saveGame();
          const blob = JSON.parse(localStorage.getItem('gtb4.save'));

          // Reset to defaults, then restore, and see if it all comes back.
          G.story = { cardShown: false, metDeb: false, debt: 0, paidOff: false,
            pizzaHeat: 0, pizzaWarned: false, pizzaRepeatWarned: false,
            firstScoreShown: false, hardcastleShown: false };
          restoreSave(blob);
          return { blob, restored: JSON.parse(JSON.stringify(G.story)), money: G.money, coachBeaten: G.coachBeaten };
        });
        assert(r.blob.story.pizzaHeat === 7, 'expected pizzaHeat in the saved blob, got ' + JSON.stringify(r.blob.story));
        assert(r.restored.pizzaHeat === 7, 'expected pizzaHeat restored');
        assert(r.restored.pizzaWarned === true, 'expected pizzaWarned restored');
        assert(r.restored.pizzaRepeatWarned === true, 'expected pizzaRepeatWarned restored');
        assert(r.restored.firstScoreShown === true, 'expected firstScoreShown restored');
        assert(r.restored.hardcastleShown === true, 'expected hardcastleShown restored');
        assert(r.money === 555 && r.coachBeaten === true, 'expected pre-existing save fields to still round-trip');
      },
    },
    {
      name: 'a corrupt save falls back cleanly instead of throwing',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          localStorage.setItem('gtb4.save', '{not valid json');
          let threw = false, result;
          try { result = loadSave(); } catch (e) { threw = true; }
          return { threw, result };
        });
        assert(r.threw === false, 'loadSave() should not throw on corrupt JSON');
        assert(r.result === null, 'loadSave() should return null for a corrupt save');
      },
    },
    {
      name: 'an absent save falls back cleanly',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          localStorage.removeItem('gtb4.save');
          return loadSave();
        });
        assert(r === null, 'loadSave() should return null when nothing is saved');
      },
    },
    {
      name: 'no save write happens inside the per-frame loop',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        // Static guard matching HANDOFF.md F1's acceptance criteria: money/
        // story writes must go through queueSave() (debounced), never a bare
        // saveGame()/localStorage call inside loop()'s per-frame body.
        const src = await page.evaluate(() => document.documentElement.outerHTML);
        const loopStart = src.indexOf('function loop(');
        const loopEnd = src.indexOf('\nfunction ', loopStart + 20);
        const loopBody = src.slice(loopStart, loopEnd === -1 ? loopStart + 6000 : loopEnd);
        assert(!/\bsaveGame\s*\(/.test(loopBody), 'found a direct saveGame() call inside loop() — should go through queueSave()');
        assert(!/localStorage\.(setItem|removeItem)/.test(loopBody), 'found a direct localStorage write inside loop()');
      },
    },
  ],
};
