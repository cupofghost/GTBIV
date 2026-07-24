// U1 — story-objective HUD + minimap Deb marker. Confirms the always-on
// "what do I do next" surface (HANDOFF.md §8 U1): the #storyObj HUD box
// tracks the story goal (find Deb / pay off the debt) with a live distance,
// yields to an active random mission instead of fighting it for the same
// screen slot, and the minimap draw path (now also plotting Deb) doesn't
// throw once she exists in the world.
module.exports = {
  cases: [
    {
      name: 'storyObj HUD shows FIND DEB with distance before meeting her',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = false;
          player.x = deb.x + 30; player.z = deb.z;
          updateStory(0.1);
          const el = document.getElementById('storyObj');
          return { display: el.style.display, html: el.innerHTML };
        });
        assert(r.display === 'block', 'expected storyObj to be visible, got ' + r.display);
        assert(/FIND DEB/.test(r.html), 'expected FIND DEB objective text, got ' + r.html);
        assert(/30m|29m|31m/.test(r.html), 'expected a live distance in the HUD text, got ' + r.html);
      },
    },
    {
      name: 'storyObj HUD switches to PAY OFF DEBT once the debt is owed',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800;
          player.x = deb.x + 50; player.z = deb.z;
          updateStory(0.1);
          const el = document.getElementById('storyObj');
          return { display: el.style.display, html: el.innerHTML };
        });
        assert(r.display === 'block', 'expected storyObj to be visible, got ' + r.display);
        assert(/PAY OFF DEBT/.test(r.html) && /\$800/.test(r.html), 'expected the debt objective + amount, got ' + r.html);
      },
    },
    {
      name: 'storyObj HUD hides once the debt is paid off',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 0; G.story.paidOff = true;
          updateStory(0.1);
          return document.getElementById('storyObj').style.display;
        });
        assert(r === 'none', 'expected storyObj to be hidden once the debt is paid off, got ' + r);
      },
    },
    {
      name: 'storyObj HUD yields to an active random mission',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          G.story.metDeb = true; deb.lineIdx = DEB_LINES.length;
          G.story.debt = 800;
          mission = { type: 'rampage', timer: 45, value: 0, need: 500 };
          updateStory(0.1);
          return document.getElementById('storyObj').style.display;
        });
        assert(r === 'none', 'expected storyObj to stay hidden while a random mission owns the HUD slot, got ' + r);
      },
    },
    {
      name: 'minimap draw does not throw once Deb exists in the world',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          spawnDeb();
          try { drawMinimap(); return { ok: true }; }
          catch (e) { return { ok: false, msg: e.message }; }
        });
        assert(r.ok, 'expected drawMinimap() to run cleanly with Deb present, got ' + r.msg);
      },
    },
  ],
};
