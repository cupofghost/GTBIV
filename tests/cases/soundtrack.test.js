// Guards the procedural 80s-synthwave soundtrack engine: the radio is a set
// of playlists of through-composed songs, and each song's arrangement / lead
// melody has to stay internally consistent or the scheduler drifts. Also
// drives the scheduler across every song (and every hot/calm loop variant) so
// a bad node hookup in any instrument surfaces as a thrown error, checks the
// wanted-level "heat" layer that leans the score hotter during a chase, and
// checks the hot/calm loop-variant state machine (freeze/resume + hysteresis).
module.exports = {
  cases: [
    {
      name: 'radio is three synthwave playlists of well-formed songs and loop variants',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const out = { stations: STATIONS.length, songs: 0, withHot: 0, withCalm: 0, bad: [] };
          const checkArrangement = (thing, label) => {
            prepSong(thing);
            const secBars = thing.sections.reduce((a, s) => a + s.bars, 0);
            if (thing.bars !== secBars) out.bad.push(label + ': bars(' + thing.bars + ') != sum sections(' + secBars + ')');
            thing.sections.forEach(s => {
              if (!(s.e >= 0 && s.e <= 1)) out.bad.push(label + ': energy out of range');
              if (!(s.bars > 0)) out.bad.push(label + ': non-positive section length');
            });
            thing.prog.forEach(ch => { if (!Array.isArray(ch) || ch.length < 3) out.bad.push(label + ': malformed chord'); });
            if (thing.bass && thing.bass.length !== 16) out.bad.push(label + ': bass pattern is not 16 steps');
            if (thing.lead) {
              const durSum = thing.lead.reduce((a, p) => a + p[1], 0);
              if (thing.leadLen !== durSum) out.bad.push(label + ': leadLen(' + thing.leadLen + ') != note durations(' + durSum + ')');
              if (durSum % 16 !== 0) out.bad.push(label + ': lead phrase is not whole bars');
              thing.lead.forEach(p => { if (!isFinite(mtof(p[0]))) out.bad.push(label + ': non-finite lead note'); });
            }
          };
          STATIONS.forEach(st => {
            if (!st.name || !Array.isArray(st.songs) || !st.songs.length) out.bad.push('empty station: ' + st.name);
          });
          const seen = new Set();
          STATIONS.forEach(st => st.songs.forEach(song => {
            if (seen.has(song)) return; seen.add(song); out.songs++;
            checkArrangement(song, song.name);
            if (song.hotLoop) { out.withHot++; checkArrangement(song.hotLoop, song.name + ' (hot loop)'); }
            if (song.calmLoop) { out.withCalm++; checkArrangement(song.calmLoop, song.name + ' (calm loop)'); }
          }));
          for (let s = 0; s < 8; s++) if (!isFinite(mtof(arpNote([57, 60, 64], s)))) out.bad.push('arpNote step ' + s);
          return out;
        });
        assert(r.stations === 3, 'expected 3 radio stations, got ' + r.stations);
        assert(r.songs === 12, 'expected 12 distinct songs across the dial (4 per station), got ' + r.songs);
        assert(r.withHot === 12, 'expected every song to define a hotLoop variant, got ' + r.withHot);
        assert(r.withCalm === 12, 'expected every song to define a calmLoop variant, got ' + r.withCalm);
        assert(r.bad.length === 0, 'soundtrack data problems: ' + r.bad.join(' | '));
      },
    },
    {
      name: 'FX rack builds and every song + loop variant on the dial schedules without throwing',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!AC) initAudio();
          const rack = !!(musicPump && musicVerbIn && musicDelayL && musicDelayR && musicVODuck);
          const savedHeat = heatLevel;
          let totalSteps = 0;
          const runThrough = (thing) => {
            prepSong(thing);
            const spb = 60 / (thing.bpm || 112) / 4, base = AC.currentTime + 0.05;
            const steps = Math.min(thing.bars * 16, 16 * 16); // cap scheduled nodes
            for (let step = 0; step < steps; step++) stepSong(thing, step, base + step * spb, spb);
            totalSteps += steps;
          };
          STATIONS.forEach(st => st.songs.forEach(song => {
            runThrough(song);
            if (song.hotLoop) runThrough(song.hotLoop);
            if (song.calmLoop) runThrough(song.calmLoop);
          }));
          duckMusicForVO(true); duckMusicForVO(false); // VO duck must be safe pre/post
          heatLevel = savedHeat;
          return { rack, totalSteps };
        });
        assert(r.rack, 'expected initAudio to build the FX rack (pump + reverb + delay + VO duck)');
        assert(r.totalSteps > 0, 'expected the song scheduler to step');
      },
    },
    {
      name: 'wanted-level heat leans a song hotter and the chase layer schedules cleanly',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const drumSec = { e: 0.3, drum: 1 };
          const padSec = { e: 0.3, pad: 1 };
          const before = { drum: heatEnergy(drumSec), pad: heatEnergy(padSec) };
          const savedStars = G.stars, savedHeat = heatLevel, savedT = heatLastT;
          G.stars = 5; heatLevel = 0;
          // updateHeatLevel() paces itself off real elapsed AC time, which barely
          // moves across a synchronous loop — so simulate 0.3s having elapsed
          // before each tick instead of spinning wall-clock time.
          for (let i = 0; i < 20; i++) { heatLastT = AC.currentTime - 0.3; updateHeatLevel(); }
          const after = { drum: heatEnergy(drumSec), pad: heatEnergy(padSec), heatLevel };
          // run the flagship song again with heat maxed so the chase-stab/pulse branches execute
          const song = STATIONS[0].songs[0]; prepSong(song);
          const spb = 60 / song.bpm / 4, base = AC.currentTime + 0.05;
          for (let step = 0; step < Math.min(song.bars * 16, 8 * 16); step++) stepSong(song, step, base + step * spb, spb);
          G.stars = savedStars; heatLevel = savedHeat; heatLastT = savedT;
          return { before, after };
        });
        assert(r.after.heatLevel > 0.9, 'expected heatLevel to climb to near 1 at 5 stars, got ' + r.after.heatLevel);
        assert(r.after.drum > r.before.drum, 'expected heat to raise a drum section\'s effective energy');
        assert(r.after.pad > r.before.pad, 'expected heat to raise a non-drum section\'s effective energy too (smaller boost)');
        assert(r.after.drum <= 1 && r.after.pad <= 1, 'heat-boosted energy must stay clamped to 1');
      },
    },
    {
      name: 'scheduler swaps in the hot loop under sustained wanted heat and freezes/resumes the arrangement',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!AC) initAudio();
          const save = { station: G.station, stars: G.stars, heatLevel, heatLastT, calmT,
            swStationRef, swSongIdx, musicStep, swMode, swLoopStep, nextNoteTime };
          // pump the scheduler forward via repeated small nudges rather than one big
          // rewind — AC.currentTime starts at 0 on a fresh context, so subtracting a
          // large fixed offset can go negative, which Web Audio's setValueAtTime rejects.
          const pump = (n) => { for (let i = 0; i < n; i++) { nextNoteTime = Math.max(0, AC.currentTime - 0.5); scheduleMusic(); } };
          // fresh, deterministic start on VICE FM (song 0 = Neon Tide, which has both loop variants)
          G.station = 0; swStationRef = -1; swSongIdx = 0; musicStep = 0; swMode = 'normal'; swLoopStep = 0;
          G.stars = 0; heatLevel = 0; heatLastT = AC.currentTime; calmT = 0;
          nextNoteTime = AC.currentTime + 0.02;
          scheduleMusic(); // loads the station/song and runs a couple of steps in 'normal'
          const song = STATIONS[0].songs[swSongIdx];
          const hasLoops = !!(song.hotLoop && song.calmLoop);
          const modeAfterInit = swMode;

          // force max wanted heat and pump enough schedule time to cross a bar boundary
          G.stars = 5; heatLevel = 1; heatLastT = AC.currentTime;
          pump(10);
          const modeAfterHot = swMode, stepFrozenDuringHot = musicStep;

          // one more hot-mode round: the frozen arrangement position must not move
          pump(5);
          const stepStillFrozen = musicStep;

          // cool off for real (several seconds clean) and pump more schedule time
          G.stars = 0;
          for (let i = 0; i < 30; i++) { heatLastT = AC.currentTime - 0.3; updateHeatLevel(); }
          pump(10);
          const modeAfterCool = swMode, stepAfterCool = musicStep;

          G.station = save.station; G.stars = save.stars; heatLevel = save.heatLevel; heatLastT = save.heatLastT; calmT = save.calmT;
          swStationRef = save.swStationRef; swSongIdx = save.swSongIdx; musicStep = save.musicStep; swMode = save.swMode; swLoopStep = save.swLoopStep;
          nextNoteTime = save.nextNoteTime;
          return { hasLoops, modeAfterInit, modeAfterHot, stepFrozenDuringHot, stepStillFrozen, modeAfterCool, stepAfterCool };
        });
        assert(r.hasLoops, "expected VICE FM's first song to define both a hotLoop and a calmLoop");
        assert(r.modeAfterInit === 'normal', 'expected a fresh song to start in the authored arrangement, got ' + r.modeAfterInit);
        assert(r.modeAfterHot === 'hot', 'expected sustained max wanted heat to switch in the hot loop, got ' + r.modeAfterHot);
        assert(r.stepStillFrozen === r.stepFrozenDuringHot, 'expected the normal arrangement position to stay frozen while the hot loop plays');
        assert(r.modeAfterCool !== 'hot', 'expected the scheduler to leave the hot loop once heat cooled off, got ' + r.modeAfterCool);
        assert(r.stepAfterCool >= r.stepFrozenDuringHot, 'expected the arrangement to resume advancing (never rewind) once it left hot mode');
      },
    },
  ],
};
