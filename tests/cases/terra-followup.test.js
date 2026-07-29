'use strict';
// Regression coverage for the last Terra handoff items: Turbo's strict
// recorded-audio policy.
//
// The mushroom-cloud case that used to lead this file was retired on
// 2026-07-28: OP2-G removed that presentation layer on owner direction, so
// `boomFx`/`updateBoomFx` no longer exist. The retained single explosion is
// covered by `vehicle-sanity.test.js` ("OP2-G: critical car damage halves the
// detonation fuse…"), which also asserts the cloud globals are gone.
module.exports = {
  cases: [
    {
      name: 'Turbo stays MP3-only while Deb and NPC dialogue retain generated speech',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const originalSpeak = speak, calls = [];
          speak = (...args) => calls.push(args);
          try {
            G.started = true; G.intro = true; introT = INTRO_LINES[0].t;
            introLinesSpoken = []; voBuffers[0] = null;
            updateIntroNarration(0); // unloaded Turbo MP3 must not synthesize
            showDialogue('TURBO', 'Unrecorded Turbo line.', 2);
            showDialogue('DEB', 'Generated speech remains available.', 2);
            return { calls, introSpoken: introLinesSpoken[0] === true };
          } finally {
            speak = originalSpeak; G.intro = false;
          }
        });
        assert(r.introSpoken, 'intro narration should still advance when its recording is unavailable');
        assert(r.calls.length === 1 && r.calls[0][1] === 'female',
          'only non-Turbo dialogue should reach generated speech, got ' + JSON.stringify(r.calls));
      },
    },
  ],
};
