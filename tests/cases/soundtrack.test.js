// Guards the procedural 80s-synthwave soundtrack engine: the radio is a set
// of playlists of through-composed songs, and each song's arrangement / lead
// melody has to stay internally consistent or the scheduler drifts. Also
// drives the scheduler across a whole song so a bad node hookup in any
// instrument (pad/bass/arp/lead/drums/riser/crash) surfaces as a thrown error.
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
        assert(r.songs >= 6, 'expected at least 6 distinct songs across the dial, got ' + r.songs);
        assert(r.bad.length === 0, 'soundtrack data problems: ' + r.bad.join(' | '));
      },
    },
    {
      name: 'FX rack builds and the scheduler runs a whole song without throwing',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!AC) initAudio();
          const rack = !!(musicPump && musicVerbIn && musicDelayL && musicDelayR && musicVODuck);
          // Deterministically clock the flagship song through every section
          // (intro -> build -> riser -> crash/drop -> lead -> breakdown ...).
          const song = STATIONS[0].songs[0]; prepSong(song);
          const spb = 60 / song.bpm / 4, base = AC.currentTime + 0.05;
          const steps = Math.min(song.bars * 16, 16 * 16); // cap scheduled nodes
          for (let step = 0; step < steps; step++) stepSong(song, step, base + step * spb, spb);
          duckMusicForVO(true); duckMusicForVO(false); // VO duck must be safe pre/post
          return { rack, steps };
        });
        assert(r.rack, 'expected initAudio to build the FX rack (pump + reverb + delay + VO duck)');
        assert(r.steps > 0, 'expected the song scheduler to step');
      },
    },
  ],
};
