// OP2-F — planned cinematic camera routes.
//
// The old flow sampled a straight authored path every frame and shoved the
// camera clear of whatever it had just hit. Reproduced on seed 424242 before
// the change: the intro peaked at 1262 u/s against a 26.6 u/s mean with
// 75,018 u/s^2 acceleration spikes, and 28 of 36 staged Cinema placements put
// the camera below terrain or inside a facade.
//
// Routes are now planned in full before the shot starts, so these cases check
// the two things that has to buy: dense samples of the *planned* path stay
// clear of terrain and buildings, and the motion it produces has bounded first
// and second derivatives — which is what "no collision-correction spikes"
// means numerically. Nothing here can tell you whether the shot looks like a
// movie; that stays an owner playtest.

// Drives the real intro frame by frame and returns motion statistics. The last
// call to updateIntroCam ends the flythrough without driving the camera, so it
// is dropped — counting it would score the handoff as a dead stop.
const INTRO_MOTION = () => {
  startIntro();
  const dt = 1 / 60, P = [], L = [];
  let n = 0, minClear = Infinity, blocked = 0;
  while (G.intro && n < 4000) {
    updateIntroCam(dt);
    if (!G.intro) break;
    const c = camera.position, d = new THREE.Vector3();
    camera.getWorldDirection(d);
    P.push([c.x, c.y, c.z]); L.push([d.x, d.y, d.z]);
    minClear = Math.min(minClear, c.y - groundH(c.x, c.z));
    if (cinematicCameraBlocked(c.x, c.y, c.z, 1.8)) blocked++;
    n++;
  }
  if (G.intro) endIntro();
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const vel = [], acc = [], look = [], lookAcc = [];
  for (let i = 1; i < P.length; i++) vel.push(dist(P[i], P[i - 1]) / dt);
  for (let i = 1; i < vel.length; i++) acc.push(Math.abs(vel[i] - vel[i - 1]) / dt);
  for (let i = 1; i < L.length; i++) {
    const dot = L[i][0] * L[i - 1][0] + L[i][1] * L[i - 1][1] + L[i][2] * L[i - 1][2];
    look.push(Math.acos(Math.max(-1, Math.min(1, dot))) / dt);
  }
  for (let i = 1; i < look.length; i++) lookAcc.push(Math.abs(look[i] - look[i - 1]) / dt);
  const mx = a => Math.max(...a), mean = a => a.reduce((s, x) => s + x, 0) / a.length;
  return {
    frames: P.length, minClear, blocked,
    velMax: mx(vel), velMean: mean(vel), accMax: mx(acc),
    lookMax: mx(look), lookAccMax: mx(lookAcc),
  };
};

// Dense clearance sweep over the planned curve itself, independent of playback.
const PLANNED_CLEARANCE = () => {
  const route = planCinematicRoute(introPathNow());
  let sink = 0, blocked = 0, minClear = Infinity;
  for (let k = 0; k <= 800; k++) {
    const p = cineCurveAt(route.pts, k / 800, route.kn);
    sink = Math.max(sink, cineFloorAt(p[0], p[2]) - p[1]);
    minClear = Math.min(minClear, p[1] - groundH(p[0], p[2]));
    if (cinematicCameraBlocked(p[0], p[1], p[2], 1.8)) blocked++;
  }
  // the framing curve must stay above the surface too, or the shot looks into
  // the underside of a hill even when the camera itself is safe
  let lookSink = 0;
  for (let k = 0; k <= 800; k++) {
    const p = cineCurveAt(route.looks, k / 800, route.lkn);
    lookSink = Math.max(lookSink, groundH(p[0], p[2]) + 0.6 - p[1]);
  }
  return { ok: route.ok, ctrl: route.pts.length, sink, lookSink, blocked, minClear };
};

module.exports = {
  cases: [
    {
      name: 'planned intro route clears terrain and buildings along its whole length (seed 424242)',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(PLANNED_CLEARANCE);
        assert(r.ok === true, 'the planner should find a valid route, got ' + JSON.stringify(r));
        assert(r.blocked === 0, r.blocked + ' of 801 planned samples sat inside a solid');
        assert(r.sink <= 0.001, 'planned camera curve dipped ' + r.sink.toFixed(3) + 'u under its clearance floor');
        assert(r.lookSink <= 0.001, 'planned look curve dipped ' + r.lookSink.toFixed(3) + 'u under the terrain');
        assert(r.minClear >= 2.39, 'planned route ran ' + r.minClear.toFixed(2) + 'u over the ground');
      },
    },
    {
      name: 'planned intro route clears terrain and buildings on a different city (seed 90210)',
      query: '?dev=1&skipintro=1&seed=90210',
      run: async (page, { assert }) => {
        const r = await page.evaluate(PLANNED_CLEARANCE);
        assert(r.ok === true, 'the planner should find a valid route, got ' + JSON.stringify(r));
        assert(r.blocked === 0, r.blocked + ' of 801 planned samples sat inside a solid');
        assert(r.sink <= 0.001, 'planned camera curve dipped ' + r.sink.toFixed(3) + 'u under its clearance floor');
        assert(r.lookSink <= 0.001, 'planned look curve dipped ' + r.lookSink.toFixed(3) + 'u under the terrain');
      },
    },
    {
      name: 'the intro moves like one planned shot — bounded speed, acceleration and pan rate',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(INTRO_MOTION);
        assert(r.frames > 1000, 'the intro should play out frame by frame, got ' + r.frames);
        assert(r.blocked === 0, 'camera entered a solid on ' + r.blocked + ' frames');
        assert(r.minClear >= 2.39, 'camera came within ' + r.minClear.toFixed(2) + 'u of the ground');
        // A dolly holds its speed: before the planner this ratio was 47 (1262
        // peak against a 26.6 mean) because the height popped to a roofline.
        assert(r.velMax / r.velMean <= 1.6,
          'speed is not being held: peak ' + r.velMax.toFixed(1) + ' vs mean ' + r.velMean.toFixed(1));
        assert(r.accMax <= 40, 'acceleration spike of ' + r.accMax.toFixed(1) + ' u/s^2 (was 75018 before the planner)');
        assert(r.lookMax <= 1.2, 'framing whipped at ' + r.lookMax.toFixed(2) + ' rad/s');
        assert(r.lookAccMax <= 15, 'framing snapped at ' + r.lookAccMax.toFixed(2) + ' rad/s^2 (was 1892)');
      },
    },
    {
      name: 'staged Cinema shots cut to a solid-free framing wherever the action is (seed 7)',
      query: '?dev=1&skipintro=1&seed=7',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // planCinemaShot is what every staged scene routes through; sweep it
          // over the map directly so nothing has to be spawned to test it.
          let n = 0, bad = 0, worst = null;
          for (let a = 0; a < 12; a++) for (let d = 10; d <= 130; d += 20) {
            const tx = Math.sin(a * 0.52) * d, tz = Math.cos(a * 0.52) * d;
            player.x = tx; player.z = tz; player.y = groundH(tx, tz); player.heading = a * 0.52;
            for (const shot of [[8, 3.4], [10, 3.2], [7, 2.6], [12, 5]]) {
              const s = planCinemaShot(tx, groundH(tx, tz) + 1.4, tz, shot[0], shot[1]);
              n++;
              const clear = s.y - groundH(s.x, s.z);
              if (cinematicCameraBlocked(s.x, s.y, s.z, 1.8) || clear < 0.5) { bad++; worst = { s, clear }; }
            }
          }
          return { n, bad, worst };
        });
        assert(r.n >= 300, 'sanity: the sweep should cover the map, got ' + r.n + ' placements');
        assert(r.bad === 0, r.bad + ' of ' + r.n + ' staged placements were inside terrain or a facade, e.g. ' + JSON.stringify(r.worst));
      },
    },
    {
      name: 'every scene on the Cinema menu frames its action without burying the camera',
      query: '?dev=1&skipintro=1&seed=1337',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          enterReplay();
          const out = [];
          for (const id of ['freeroam', 'jockfight', 'blowcar', 'blowcop', 'shootped', 'ratmother']) {
            cinemaPlayScene(id);
            const c = replay.cam;
            out.push({ id, clear: +(c.y - groundH(c.x, c.z)).toFixed(2), blocked: !!cinematicCameraBlocked(c.x, c.y, c.z, 1.8) });
          }
          cinemaClearStaged();
          exitReplay();
          return out;
        });
        for (const s of r) {
          assert(!s.blocked, 'scene "' + s.id + '" put the camera inside a solid');
          assert(s.clear >= 0.5, 'scene "' + s.id + '" framed from ' + s.clear + 'u over the ground');
        }
      },
    },
    {
      name: 'routes are deterministic, and an unplannable one cuts to a known-safe shot',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const a = planCinematicRoute(introPathNow()), b = planCinematicRoute(introPathNow());
          const same = JSON.stringify(a.pts) === JSON.stringify(b.pts)
            && JSON.stringify(a.looks) === JSON.stringify(b.looks)
            && a.arc[a.arc.length - 1] === b.arc[b.arc.length - 1];
          // force the bail-out: a route the planner could not clear must cut to
          // the safe shot rather than scrape along whatever is in the way
          const failed = planCinematicRoute(introPathNow());
          failed.ok = false;
          const cut = cineRouteSample(failed, 0.5, 1 / 60);
          const safeBlocked = !!cinematicCameraBlocked(cut.px, cut.py, cut.pz, 1.8);
          const safeClear = cut.py - groundH(cut.px, cut.pz);
          return { same, cut, safeBlocked, safeClear, len: a.arc[a.arc.length - 1] };
        });
        assert(r.same === true, 'planning the same path twice must give the same route');
        assert(r.len > 100, 'sanity: the intro route should be a real journey, got ' + r.len.toFixed(1) + 'u');
        assert(!r.safeBlocked, 'the fallback shot itself sat inside a solid: ' + JSON.stringify(r.cut));
        assert(r.safeClear >= 0.5, 'the fallback shot sat ' + r.safeClear.toFixed(2) + 'u over the ground');
      },
    },
    {
      name: 'the Cinema flythrough plans its own route from wherever Turbo is, and hands back',
      query: '?dev=1&skipintro=1&seed=424242',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // put Turbo well away from spawn: the authored tail was written around
          // the spawn point, so this is where the old path aimed at empty street
          player.x = 90; player.z = -70; player.y = groundH(player.x, player.z); player.heading = 1.2;
          enterReplay();
          cinemaIntro();
          const planned = !!(replay.introPlay && replay.introPlay.route && replay.introPlay.route.ok);
          let n = 0, minClear = Infinity, blocked = 0;
          while (replay.introPlay && n < 4000) {
            updateCinemaCam(1 / 60);
            if (!replay.introPlay) break;
            const c = camera.position;
            minClear = Math.min(minClear, c.y - groundH(c.x, c.z));
            if (cinematicCameraBlocked(c.x, c.y, c.z, 1.8)) blocked++;
            n++;
          }
          const tail = planCinematicRoute(introPathNow()).looks.slice(-1)[0];
          const done = replay.introPlay === null;
          exitReplay();
          return { planned, done, n, minClear, blocked, tail };
        });
        assert(r.planned === true, 'the Cinema flythrough should plan a valid route up front');
        assert(r.done === true, 'the flythrough should finish and hand the camera back, ran ' + r.n + ' steps');
        assert(r.blocked === 0, 'Cinema flythrough entered a solid on ' + r.blocked + ' frames');
        assert(r.minClear >= 2.39, 'Cinema flythrough came within ' + r.minClear.toFixed(2) + 'u of the ground');
        assert(Math.hypot(r.tail[0] - 90, r.tail[2] + 70) < 3,
          'the route tail should frame Turbo where he actually is, got ' + JSON.stringify(r.tail));
      },
    },
  ],
};
