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
      // PV2 (2026-08-07) rewrote the second half of this case. It used to assert
      // that Deb and NPC dialogue "retain generated speech" — the owner's
      // direction was "no more synthesized voice, turbos mp3 voice or bust", so
      // there is no speak() left to reach. What the case still guards is the
      // part that did not change: an unrecorded line must never fall back to
      // synthesis, and the intro must keep advancing when a recording is
      // missing. Deb now gets a caption instead of a voice.
      name: 'Turbo stays MP3-only, and nobody else synthesizes either (PV2)',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const spoke = [];
          const U = window.SpeechSynthesisUtterance;
          if (U) window.SpeechSynthesisUtterance = function (...a) { spoke.push('utterance'); return new U(...a); };
          try {
            G.started = true; G.intro = true; introT = INTRO_LINES[0].t;
            introLinesSpoken = []; voBuffers[0] = null;
            updateIntroNarration(0); // an unloaded Turbo MP3 must not synthesize
            showDialogue('TURBO', 'Unrecorded Turbo line.', 2);
            showDialogue('DEB', 'Deb has no recording either.', 2);
            const box = document.getElementById('dialogueBox');
            return { spoke, introSpoken: introLinesSpoken[0] === true,
                     speakGone: typeof window.speak === 'undefined',
                     debCaptioned: box.style.display === 'block' &&
                                   document.getElementById('speakerName').textContent === 'DEB' };
          } finally {
            if (U) window.SpeechSynthesisUtterance = U;
            G.intro = false;
          }
        });
        assert(r.introSpoken, 'intro narration should still advance when its recording is unavailable');
        assert(r.speakGone, 'speak() must not exist — PV2 removed every synthesized voice path');
        assert(r.spoke.length === 0,
          'nothing may reach speech synthesis, got ' + JSON.stringify(r.spoke));
        assert(r.debCaptioned,
          'a character with no recording should be captioned instead of voiced');
      },
    },
  ],
};
