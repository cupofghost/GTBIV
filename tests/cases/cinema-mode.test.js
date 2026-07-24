// Cinema Mode (grown out of the old replay screen). Verifies you can enter the
// live director, stage each scene from the dropdown, toggle the HUD off for a
// clean recording, and exit cleanly — all without grinding for the moment.
// Scenes are driven by calling cinemaPlayScene() directly (headless Chromium
// throttles rAF too hard to trust wall-clock), and each case tears cinema down
// inside the same evaluate so the staged scenes' delayed timers can't fire
// after the assertion and trip the console-error guard.

module.exports = {
  cases: [
    {
      name: 'enter defaults to a live director (no recording needed) and exit restores state',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const godBefore = DEV_STATE.god;
          enterReplay();
          const during = {
            replay: G.replay, live: replay && replay.live, god: DEV_STATE.god,
            bar: document.getElementById('replayBar').style.display,
            scrub: document.getElementById('cinemaScrub').style.display,
          };
          exitReplay();
          const after = {
            replay: G.replay, replayObj: replay, god: DEV_STATE.god,
            hud: document.getElementById('hud').style.display,
            bar: document.getElementById('replayBar').style.display,
          };
          return { godBefore, during, after };
        });
        assert(r.during.replay === true && r.during.live === true, 'cinema should enter as a live director');
        assert(r.during.god === true, 'director should be invulnerable (god on) while filming');
        assert(r.during.bar === 'flex', 'cinema bar should be visible');
        assert(r.during.scrub === 'none', 'scrub controls should be hidden in live mode');
        assert(r.after.replay === false && r.after.replayObj === null, 'exit should tear cinema down');
        assert(r.after.god === r.godBefore, 'exit should restore the prior god-mode state');
        assert(r.after.hud === 'block', 'exit should restore the game HUD');
        assert(r.after.bar === 'none', 'exit should hide the cinema bar');
      },
    },
    {
      name: 'jock fight stages three brawlers and re-staging clears the old ones',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          enterReplay();
          const before = jocks.length;
          cinemaPlayScene('jockfight');
          const staged = { jocks: jocks.length - before, refs: replay.staged.length };
          cinemaPlayScene('freeroam'); // should clear the staged jocks
          const cleared = { jocks: jocks.length - before, refs: replay.staged.length };
          exitReplay();
          return { staged, cleared };
        });
        assert(r.staged.jocks === 3 && r.staged.refs === 3, 'jock fight should spawn 3 tracked jocks, got ' + JSON.stringify(r.staged));
        assert(r.cleared.jocks === 0 && r.cleared.refs === 0, 're-staging should remove the previous jocks, got ' + JSON.stringify(r.cleared));
      },
    },
    {
      name: 'car / cop-car / pedestrian / rat-mother scenes each spawn their actor',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          enterReplay();
          const carBefore = cars.length;
          cinemaPlayScene('blowcar');
          const carAdded = cars.length - carBefore;
          const carType = replay.staged[0] && replay.staged[0].ref.type;
          cinemaPlayScene('blowcop');
          const copType = replay.staged[0] && replay.staged[0].ref.type;
          const pedBefore = peds.length;
          cinemaPlayScene('shootped');
          const pedAdded = peds.length - pedBefore;
          cinemaPlayScene('ratmother');
          const ratUp = !!mamaRat;
          exitReplay();
          const ratGone = !mamaRat; // exit clears the staged rat
          return { carAdded, carType, copType, pedAdded, ratUp, ratGone };
        });
        assert(r.carAdded >= 1, 'blow-up-a-car should spawn a car');
        assert(r.copType === 'cop', 'blow-up-a-cop-car should spawn a cop car, got ' + r.copType);
        assert(r.pedAdded >= 1, 'shoot-a-pedestrian should spawn a pedestrian');
        assert(r.ratUp === true, 'rat mother incident should raise the mama rat');
        assert(r.ratGone === true, 'exiting cinema should clear the staged mama rat');
      },
    },
    {
      name: 'hide-HUD toggle hides HUD + bar and the SHOW pill brings them back',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          enterReplay();
          document.getElementById('cinemaHud').click();
          const hidden = {
            flag: replay.hudHidden,
            hud: document.getElementById('hud').style.display,
            bar: document.getElementById('replayBar').style.display,
            show: document.getElementById('cinemaShow').style.display,
          };
          document.getElementById('cinemaShow').click();
          const shown = {
            flag: replay.hudHidden,
            hud: document.getElementById('hud').style.display,
            bar: document.getElementById('replayBar').style.display,
            show: document.getElementById('cinemaShow').style.display,
          };
          exitReplay();
          return { hidden, shown };
        });
        assert(r.hidden.flag === true && r.hidden.hud === 'none' && r.hidden.bar === 'none' && r.hidden.show === 'block',
          'hide-HUD should hide HUD + bar and reveal the SHOW pill, got ' + JSON.stringify(r.hidden));
        assert(r.shown.flag === false && r.shown.hud === 'block' && r.shown.bar === 'flex' && r.shown.show === 'none',
          'SHOW pill should restore HUD + bar, got ' + JSON.stringify(r.shown));
      },
    },
    {
      name: 'intro flythrough plays and hands the camera back to the director',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          enterReplay();
          cinemaPlayScene('intro');
          const playing = !!replay.introPlay;
          let n = 0; while (replay.introPlay && n < 4000) { updateCinemaCam(0.05); n++; }
          const done = { introPlay: replay.introPlay, logo: document.getElementById('introLogo').style.display };
          exitReplay();
          return { playing, done, n };
        });
        assert(r.playing === true, 'selecting Intro should start the flythrough');
        assert(r.done.introPlay === null, 'the flythrough should finish and clear itself, ran ' + r.n + ' steps');
        assert(r.done.logo === 'none', 'the intro logo should be hidden when the flythrough ends');
      },
    },
    {
      name: 'replay-last-30s scene scrubs the buffer, then a live scene returns to the world',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          for (let i = 0; i < 20; i++) recTick(1); // seed the ring buffer without grinding
          enterReplay();
          cinemaPlayScene('replaybuf');
          const inBuf = {
            live: replay.live,
            scrub: document.getElementById('cinemaScrub').style.display,
          };
          updateReplay(0.05); // one scrub frame shouldn't throw
          cinemaPlayScene('freeroam');
          const backLive = { live: replay.live, scrub: document.getElementById('cinemaScrub').style.display };
          exitReplay();
          return { inBuf, backLive };
        });
        assert(r.inBuf.live === false && r.inBuf.scrub === 'inline-flex',
          'Replay-last-30s should switch to buffer scrub with scrub controls shown, got ' + JSON.stringify(r.inBuf));
        assert(r.backLive.live === true && r.backLive.scrub === 'none',
          'picking a live scene afterward should return to the live director, got ' + JSON.stringify(r.backLive));
      },
    },
  ],
};
