// U2 onboarding controls card — first-boot auto-show, "seen" persistence in
// the save blob, pause-menu recall, and tab switching. Drives the card
// functions directly (the dev/skipintro boot path skips the story card, so
// the natural trigger — dismissStoryCard() — is invoked by hand).
module.exports = {
  cases: [
    {
      name: 'card auto-shows after the story card on first boot; GOT IT marks seen and saves',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const shown = await page.evaluate(() => {
          localStorage.removeItem('gtb4.save');
          G.controlsCardSeen = false;
          dismissStoryCard();
          return {
            display: $('controlsCard').style.display,
            btn: $('ccBtn').textContent,
            touchVisible: $('ccTouch').style.display !== 'none',
            isTouch: IS_TOUCH,
          };
        });
        assert(shown.display === 'flex', 'expected card to auto-show, got ' + JSON.stringify(shown));
        assert(shown.btn === 'GOT IT', 'first-boot button should be GOT IT, got ' + shown.btn);
        assert(shown.touchVisible === shown.isTouch, 'default tab should match the device (IS_TOUCH=' + shown.isTouch + ')');

        await page.click('#ccBtn');
        const after = await page.evaluate(() => {
          const hidden = $('controlsCard').style.display === 'none';
          saveGame(); // flush now rather than waiting out the queueSave debounce
          const blob = JSON.parse(localStorage.getItem('gtb4.save') || 'null');
          return { hidden, seen: G.controlsCardSeen, saved: blob && blob.controlsCardSeen };
        });
        assert(after.hidden === true, 'card should hide after GOT IT');
        assert(after.seen === true, 'G.controlsCardSeen should be true after GOT IT');
        assert(after.saved === true, 'save blob should persist controlsCardSeen:true');
      },
    },
    {
      name: 'seen flag suppresses the auto-show',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.controlsCardSeen = true;
          dismissStoryCard();
          return $('controlsCard').style.display;
        });
        assert(r !== 'flex', 'card should stay hidden once seen, got ' + r);
      },
    },
    {
      name: 'pause menu HOW TO PLAY re-opens the card as CLOSE and teaches the save nothing',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        await page.evaluate(() => { G.controlsCardSeen = true; pauseGame(); });
        await page.click('#pmHowBtn');
        const opened = await page.evaluate(() => ({
          card: $('controlsCard').style.display,
          btn: $('ccBtn').textContent,
          pause: $('pauseMenu').style.display,
        }));
        assert(opened.card === 'flex' && opened.btn === 'CLOSE', 'expected CLOSE-variant card from pause, got ' + JSON.stringify(opened));
        assert(opened.pause === 'flex', 'pause menu should still be under the card');

        await page.click('#ccBtn');
        const closed = await page.evaluate(() => ({
          card: $('controlsCard').style.display,
          pause: $('pauseMenu').style.display,
          seen: G.controlsCardSeen,
        }));
        assert(closed.card === 'none' && closed.pause === 'flex', 'CLOSE should drop back to the pause menu, got ' + JSON.stringify(closed));
        assert(closed.seen === true, 'CLOSE must not change the seen flag');
      },
    },
    {
      name: 'tabs switch between touch and desktop content',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        await page.evaluate(() => openControlsCard(true));
        await page.click('#ccTabDesk');
        const desk = await page.evaluate(() => ({
          desk: $('ccDesk').style.display, touch: $('ccTouch').style.display, on: $('ccTabDesk').classList.contains('on'),
        }));
        assert(desk.desk === 'block' && desk.touch === 'none' && desk.on === true, 'desktop tab should show desktop body, got ' + JSON.stringify(desk));
        await page.click('#ccTabTouch');
        const touch = await page.evaluate(() => ({
          desk: $('ccDesk').style.display, touch: $('ccTouch').style.display, on: $('ccTabTouch').classList.contains('on'),
        }));
        assert(touch.touch === 'block' && touch.desk === 'none' && touch.on === true, 'touch tab should show touch body, got ' + JSON.stringify(touch));
        await page.evaluate(() => closeControlsCard());
      },
    },
    {
      name: 'save restore round-trips the flag: pre-flag saves see the card once, flagged saves do not',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const flagged = await page.evaluate(() => {
          localStorage.setItem('gtb4.save', JSON.stringify({ v: 1, money: 50, controlsCardSeen: true, story: { cardShown: true } }));
          restoreSave(loadSave());
          return { seen: G.controlsCardSeen, card: $('controlsCard').style.display };
        });
        assert(flagged.seen === true && flagged.card !== 'flex', 'flagged save should restore seen and stay hidden, got ' + JSON.stringify(flagged));

        const legacy = await page.evaluate(() => {
          localStorage.setItem('gtb4.save', JSON.stringify({ v: 1, money: 50, story: { cardShown: true } })); // no flag — pre-U2 save
          restoreSave(loadSave());
          return { seen: G.controlsCardSeen, card: $('controlsCard').style.display, btn: $('ccBtn').textContent };
        });
        assert(legacy.seen === false && legacy.card === 'flex' && legacy.btn === 'GOT IT',
          'legacy save should get the one-time card, got ' + JSON.stringify(legacy));
        await page.evaluate(() => closeControlsCard());
      },
    },
  ],
};
