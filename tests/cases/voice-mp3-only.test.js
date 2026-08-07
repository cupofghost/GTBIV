// PV2 — recorded audio only. The owner's rule is "Turbo's mp3 voice or bust":
// no speech synthesis, no procedural voice, anywhere, ever.
//
// This file exists to make reintroducing either one fail loudly. The positive
// half of the contract (recordings actually resolve, barks are wired) is
// covered by voice-wiring.test.js; this one guards the negative.

module.exports = [
  {
    name: 'MP3-only: no speech-synthesis or procedural-voice entry points survive',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const g = await page.evaluate(() => ({
        speak: typeof window.speak,
        speakLine: typeof window.speakLine,
        procVoice: typeof window.procVoice,
        getVoice: typeof window.getVoice,
        initVoiceOver: typeof window.initVoiceOver,
        processVOQueue: typeof window.processVOQueue,
        stopVoiceOver: typeof window.stopVoiceOver,   // this one must SURVIVE
      }));
      for (const k of ['speak', 'speakLine', 'procVoice', 'getVoice', 'initVoiceOver', 'processVOQueue']) {
        assert(g[k] === 'undefined', `${k}() must not exist — PV2 removed all synthesized voice`);
      }
      assert(g.stopVoiceOver === 'function',
        'stopVoiceOver() should still exist — endCutscene/endIntro call it');
    }
  },

  {
    name: 'MP3-only: the game never calls window.speechSynthesis',
    start: 'skipintro',
    async run(page, { assert }) {
      // Trip-wire every way an utterance could be started, then exercise the
      // paths that used to speak.
      await page.evaluate(() => {
        window.__spoke = [];
        try {
          const ss = window.speechSynthesis;
          if (ss) { const s = ss.speak.bind(ss); ss.speak = (u) => { window.__spoke.push('speak'); return s(u); }; }
        } catch (e) { /* no speechSynthesis in this browser at all — fine */ }
        const U = window.SpeechSynthesisUtterance;
        if (U) window.SpeechSynthesisUtterance = function (...a) { window.__spoke.push('utterance'); return new U(...a); };
      });
      await page.waitForTimeout(1200);

      const spoke = await page.evaluate(async () => {
        // the three call sites PV2 rewrote
        G.story.hardcastleShown = false; G.stars = 0; G.heat = 0;
        addHeat(70);                       // used to speak Hardcastle's cut-in
        showStoryCard();                   // used to narrate the chapter card
        dismissStoryCard();
        showDialogue('DEB', 'You said you would have it tonight.', 3);  // used to speak Deb
        await new Promise(r => setTimeout(r, 300));
        return window.__spoke;
      });
      assert(spoke.length === 0,
        `nothing may reach speech synthesis, but got: ${JSON.stringify(spoke)}`);
    }
  },

  {
    name: 'MP3-only: a character without a recording still gets a caption',
    start: 'skipintro',
    async run(page, { assert, assertEqual }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        showDialogue('DEB', 'Eight hundred. Tonight.', 4);
        const box = document.getElementById('dialogueBox');
        return {
          captionsOn: CAPTIONS_ENABLED,
          display: box.style.display,
          speaker: document.getElementById('speakerName').textContent,
        };
      });
      assert(r.captionsOn === true,
        'CAPTIONS_ENABLED must stay true — with synthesis gone it is the only way an unrecorded line reaches the player');
      assertEqual(r.display, 'block', 'the caption box should be shown for a spoken line');
      assertEqual(r.speaker, 'DEB', 'the caption should name the speaker');
    }
  },

  {
    name: 'MP3-only: the radio duck stays balanced across narration',
    start: 'skipintro',
    async run(page, { assert }) {
      await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const before = voDuckN;
        voDuckOn(); voDuckOn();
        const held = voDuckN;
        voDuckOff(); voDuckOff();
        const after = voDuckN;
        stopVoiceOver();                 // must reset, not go negative
        return { before, held, after, reset: voDuckN };
      });
      assert(r.held === r.before + 2, 'two overlapping lines should hold the duck twice');
      assert(r.after === r.before, 'releasing both should restore the duck count');
      assert(r.reset === 0, 'stopVoiceOver should reset the duck to 0, never negative');
    }
  },
];
