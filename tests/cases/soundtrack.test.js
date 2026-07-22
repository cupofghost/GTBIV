// Guards the procedural 80s-synthwave soundtrack engine: the radio is a set
// of playlists of through-composed songs, and each song's arrangement / lead
// melody has to stay internally consistent or the scheduler drifts. Also
// drives the scheduler across every song so a bad node hookup in any
// instrument (pad/bass/arp/lead/drums/riser/crash/chase-stab) surfaces as a
// thrown error, and checks the wanted-level "heat" layer that leans the score
// hotter during a chase without switching tracks.
module.exports = {
  cases: [
    {
      name: 'radio is three synthwave playlists of well-formed songs',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const out = { stations: STATIONS.length, songs: 0, bad: [] };
          STATIONS.forEach(st => {
            if (!st.name || !Array.isArray(st.songs) || !st.songs.length) out.bad.push('empty station: ' + st.name);
          });
          const seen = new Set();
          STATIONS.forEach(st => st.songs.forEach(song => {
            if (seen.has(song)) return; seen.add(song); out.songs++;
            prepSong(song);
            const secBars = song.sections.reduce((a, s) => a + s.bars, 0);
            if (song.bars !== secBars) out.bad.push(song.name + ': bars(' + song.bars + ') != sum sections(' + secBars + ')');
            song.sections.forEach(s => {
              if (!(s.e >= 0 && s.e <= 1)) out.bad.push(song.name + ': energy out of range');
              if (!(s.bars > 0)) out.bad.push(song.name + ': non-positive section length');
            });
            song.prog.forEach(ch => { if (!Array.isArray(ch) || ch.length < 3) out.bad.push(song.name + ': malformed chord'); });
            if (song.lead) {
              const durSum = song.lead.reduce((a, p) => a + p[1], 0);
              if (song.leadLen !== durSum) out.bad.push(song.name + ': leadLen(' + song.leadLen + ') != note durations(' + durSum + ')');
              if (durSum % 16 !== 0) out.bad.push(song.name + ': lead phrase is not whole bars');
              song.lead.forEach(p => { if (!isFinite(mtof(p[0]))) out.bad.push(song.name + ': non-finite lead note'); });
            }
          }));
          for (let s = 0; s < 8; s++) if (!isFinite(mtof(arpNote([57, 60, 64], s)))) out.bad.push('arpNote step ' + s);
          return out;
        });
        assert(r.stations === 3, 'expected 3 radio stations, got ' + r.stations);
        assert(r.songs === 9, 'expected 9 distinct songs across the dial (3 per station), got ' + r.songs);
        assert(r.bad.length === 0, 'soundtrack data problems: ' + r.bad.join(' | '));
      },
    },
    {
      name: 'FX rack builds and every song on the dial schedules without throwing',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!AC) initAudio();
          const rack = !!(musicPump && musicVerbIn && musicDelayL && musicDelayR && musicVODuck);
          const savedHeat = heatLevel;
          let totalSteps = 0;
          STATIONS.forEach(st => st.songs.forEach(song => {
            prepSong(song);
            const spb = 60 / song.bpm / 4, base = AC.currentTime + 0.05;
            const steps = Math.min(song.bars * 16, 16 * 16); // cap scheduled nodes per song
            for (let step = 0; step < steps; step++) stepSong(song, step, base + step * spb, spb);
            totalSteps += steps;
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
  ],
};
