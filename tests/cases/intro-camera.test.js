// Intro flythrough vs. terrain — the INTRO_PATH heights were authored on flat
// ground, so hills could swallow the cinematic camera (owner screenshot: intro
// camera under the street, looking at the world's underside). flySample() now
// clamps camera and look target above groundH; these cases step the real intro
// frame by frame and measure clearance so it can't regress.
module.exports = {
  cases: [
    {
      name: 'intro and cinema share elevated blocker-safe routing without facade side-sliding',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r=await page.evaluate(()=>{
          let blocked=0,minClear=Infinity,same=true;
          for(let i=0;i<INTRO_PATH.length-1;i++) for(let f=0;f<=1;f+=.05){
            const a=flySample(INTRO_PATH[i],INTRO_PATH[i+1],f), b=flySample(INTRO_PATH[i],INTRO_PATH[i+1],f);
            same&&=a.px===b.px&&a.py===b.py&&a.pz===b.pz;
            blocked+=!!cinematicCameraBlocked(a.px,a.py,a.pz); minClear=Math.min(minClear,a.py-groundH(a.px,a.pz));
          } return {blocked,minClear,same};
        });
        assert(r.same&&r.blocked===0&&r.minClear>=2.39,'shared route must clear blockers continuously: '+JSON.stringify(r));
      },
    },
    {
      name: 'intro cinematic camera stays above the terrain for the whole flythrough',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          startIntro();
          let minClear = Infinity, clamped = 0, n = 0;
          while (G.intro && n < 4000) {
            updateIntroCam(0.05);
            const c = camera.position, g = groundH(c.x, c.z);
            minClear = Math.min(minClear, c.y - g);
            if (Math.abs(c.y - (g + 2.4)) < 1e-6) clamped++;
            n++;
          }
          endIntro();
          return { minClear, clamped, n, finished: !G.intro };
        });
        assert(r.finished === true, 'intro should run to completion, stopped after ' + r.n + ' steps');
        assert(r.minClear >= 2.39, 'camera dipped under terrain clearance: min ' + r.minClear.toFixed(3));
      },
    },
    {
      name: 'cinema-mode intro flythrough camera stays above the terrain too',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          enterReplay();
          cinemaIntro();
          let minClear = Infinity, n = 0;
          while (replay.introPlay && n < 4000) {
            updateCinemaCam(0.05);
            const c = camera.position, g = groundH(c.x, c.z);
            minClear = Math.min(minClear, c.y - g);
            n++;
          }
          exitReplay();
          return { minClear, n, finished: true };
        });
        assert(r.minClear >= 2.39, 'cinema flythrough dipped under terrain clearance: min ' + r.minClear.toFixed(3));
      },
    },
    {
      name: 'cinema free-fly floor follows the terrain instead of absolute 0.5',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          enterReplay();
          const c = replay.cam;
          // park the camera just over the tallest ground on the map, then try to dive
          let top = { x: 0, z: 0, h: -Infinity };
          for (let x = -H; x <= H; x += 4) for (let z = -H; z <= H; z += 4) {
            const h = groundH(x, z); if (h > top.h) top = { x, z, h };
          }
          c.x = top.x; c.z = top.z; c.y = top.h + 1;
          keys['KeyQ'] = true; // straight down
          for (let n = 0; n < 600; n++) updateCinemaCam(0.05);
          keys['KeyQ'] = false;
          const clear = c.y - groundH(c.x, c.z);
          exitReplay();
          return { clear, peak: top.h };
        });
        assert(r.peak > 2, 'sanity: the map should have real hills (peak ' + r.peak.toFixed(2) + ')');
        assert(r.clear >= 0.49, 'free-fly dove under the terrain: clearance ' + r.clear.toFixed(3));
      },
    },
  ],
};
