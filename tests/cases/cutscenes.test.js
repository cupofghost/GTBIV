// Every entry in CUTSCENES should play start-to-finish and clean up after
// itself (HUD restored, activeCutscene cleared) without throwing. Covers
// both the shipped Deb beats and the new Chapter 1 beats from this pass.
const { playCutsceneToEnd } = require('../helpers');

function cutsceneCase(id, { needsDeb = false } = {}) {
  return {
    name: `${id} plays to completion and cleans up`,
    query: '?dev=1&skipintro=1',
    run: async (page, { assert }) => {
      if (needsDeb) await page.evaluate(() => { if (!deb) spawnDeb(); });
      const result = await playCutsceneToEnd(page, id);
      assert(result.completed, `${id} did not finish within ${result.iterations} simulated steps`);
      const ui = await page.evaluate(() => ({
        hudDisplay: document.getElementById('hud').style.display,
        dialogueDisplay: document.getElementById('dialogueBox').style.display,
        cineTop: document.getElementById('cineTop').style.display,
      }));
      assert(ui.hudDisplay === 'block', 'expected #hud restored to visible after the cutscene, got ' + ui.hudDisplay);
      assert(ui.cineTop === 'none', 'expected cinematic bars hidden after the cutscene, got ' + ui.cineTop);
    },
  };
}

module.exports = {
  cases: [
    cutsceneCase('deb_confrontation', { needsDeb: true }),
    cutsceneCase('deb_payoff', { needsDeb: true }),
    cutsceneCase('first_score'),
    cutsceneCase('pizza_warning'),
    {
      name: 'playCutscene ignores a second call while one is already active',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          playCutscene('first_score', player.x, player.z);
          const idBefore = activeCutscene.id;
          playCutscene('pizza_warning', player.x, player.z); // should no-op
          const idAfter = activeCutscene.id;
          let n = 0; while (activeCutscene && n < 4000) { updateCutscene(0.02); n++; }
          return { idBefore, idAfter, completed: !activeCutscene };
        });
        assert(r.idBefore === 'first_score' && r.idAfter === 'first_score',
          'a second playCutscene() call should be ignored while one is active, got ' + JSON.stringify(r));
        assert(r.completed, 'the original cutscene should still complete normally');
      },
    },
  ],
};
