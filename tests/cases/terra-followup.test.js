'use strict';
// Regression coverage for the last Terra handoff items: the big explosion's
// persistent mesh cloud and Turbo's strict recorded-audio policy.
module.exports = {
  cases: [
    {
      name: 'big explosions grow a solid red mushroom cloud without rising particles',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const before = boomFx.length;
          bigExplosion(player.x, 1, player.z);
          const cloud = boomFx[before];
          const particlesAfterImpact = pNext;
          updateBoomFx(0.5); // initial fireball bloom: cloud remains hidden
          const hiddenDuringBloom = !cloud.group.visible;
          updateBoomFx(0.2); // cap and stem begin growing after the bloom
          const firstCapY = cloud.cap.position.y;
          updateBoomFx(0.8);
          return {
            capIsSphere: cloud.cap.geometry.type === 'SphereGeometry',
            stemIsCylinder: cloud.stem.geometry.type === 'CylinderGeometry',
            redCap: cloud.cap.material.color.r > cloud.cap.material.color.g,
            visible: cloud.group.visible,
            hiddenDuringBloom,
            rose: cloud.cap.position.y > firstCapY,
            stemHeight: cloud.stem.scale.y,
            noRisingParticles: pNext === particlesAfterImpact,
          };
        });
        assert(r.capIsSphere && r.stemIsCylinder, 'expected a mesh sphere cap and cylinder stem, got ' + JSON.stringify(r));
        assert(r.redCap && r.visible && r.hiddenDuringBloom, 'cloud should emerge as a red cap after the fireball bloom, got ' + JSON.stringify(r));
        assert(r.rose && r.stemHeight > 1, 'cloud cap should rise while a solid stem grows beneath it, got ' + JSON.stringify(r));
        assert(r.noRisingParticles, 'the mushroom cloud update should not emit rising particle sparkles');
      },
    },
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
