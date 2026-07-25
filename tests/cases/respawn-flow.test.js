// U3 — death / busted / respawn flow. Penalties must survive the respawn lock
// and the player must return in a controllable, terrain-seated foot state.
module.exports = {
  cases: [
    {
      name: 'busted persists its fine before the respawn lock and clears pursuit state',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.money=1000; G.heat=75; G.stars=3; G.escapeT=4; G.bustT=1; G.hiddenT=2;
          busted();
          const save=JSON.parse(localStorage.getItem('gtb4.save'));
          return { money:G.money, over:G.over, heat:G.heat, stars:G.stars,
            escapeT:G.escapeT, bustT:G.bustT, hiddenT:G.hiddenT, saved:save.money };
        });
        assert(r.money===880 && r.saved===880, 'expected the 12% bust fine to persist immediately');
        assert(r.over===true, 'expected respawn lock after being busted');
        assert(r.heat===0 && r.stars===0 && r.escapeT===0 && r.bustT===0 && r.hiddenT===0,
          'expected busted to fully clear pursuit state');
      },
    },
    {
      name: 'wasted persists its hospital bill and returns a playable terrain-seated foot state',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(async () => {
          G.money=1000; G.heat=50; G.stars=2; G.escapeT=3; G.bustT=1; G.hiddenT=2;
          wasted();
          const saved=JSON.parse(localStorage.getItem('gtb4.save')).money;
          await new Promise(resolve=>setTimeout(resolve,1900));
          return { saved, over:G.over, mode:G.mode, hp:G.hp, car:player.car, heli:player.heli,
            y:player.y, ground:groundH(player.x,player.z), nearbyCar:cars.some(c=>!c.dead&&Math.hypot(c.x-player.x,c.z-player.z)<12),
            heat:G.heat, stars:G.stars, escapeT:G.escapeT, bustT:G.bustT, hiddenT:G.hiddenT };
        });
        assert(r.saved===950, 'expected the 5% hospital bill to persist immediately');
        assert(r.over===false && r.mode==='foot' && r.hp===100 && !r.car && !r.heli,
          'expected a healthy controllable on-foot respawn');
        assert(Math.abs(r.y-r.ground)<0.001 && r.nearbyCar,
          'expected respawn to be seated on terrain with a nearby vehicle option');
        assert(r.heat===0 && r.stars===0 && r.escapeT===0 && r.bustT===0 && r.hiddenT===0,
          'expected wasted to fully clear pursuit state');
      },
    },
  ],
};
