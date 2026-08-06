// FB4 — Turbo Bowl, the endless-run minigame (FOOTBALL_STRAND.md §5).
// Covers HANDOFF.md §8's FB4 acceptance — playable start to finish, clear
// win/lose, hands off to the payoff on a win — plus the locked design's own
// rules: gated on FB3's unlock flag, soft fail with no penalty, yardage
// scoring with a persisted best, and defenders that can never join the
// hostile jock faction.
//
// Each case drives the mode inside one synchronous page.evaluate() so the
// page's rAF loop can't interleave with the phase machine.

// Unlocks the mode and drops Turbo on the beacon, but does not start a run.
const AT_BEACON = `
  if (!FOOTBALL) throw new Error('no Wildcats Field in this city — FB2 is a prerequisite');
  G.coachBeaten = true;
  player.x = FOOTBALL.x; player.z = FOOTBALL.z;
  player.mesh.position.set(player.x, groundH(player.x, player.z), player.z);
`;

// Runs Turbo the length of the field, teleporting him downfield in steps the
// way a player would cover it, and stepping the mode between each.
const RUN_DOWNFIELD = `
  function advance(steps) {
    for (let i = 0; i < steps && turboBowl && turboBowl.phase === 'run'; i++) {
      player.x += 34 / steps;
      player.mesh.position.set(player.x, groundH(player.x, player.z), player.z);
      updateTurboBowl(0.016);
    }
  }
`;

module.exports = {
  cases: [
    {
      name: 'the beacon and the mode are gated on FB3\'s unlock flag',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!FOOTBALL) throw new Error('no Wildcats Field in this city');
          G.coachBeaten = false;
          player.x = FOOTBALL.x; player.z = FOOTBALL.z;
          player.mesh.position.set(player.x, groundH(player.x, player.z), player.z);
          for (let i = 0; i < 60; i++) updateTurboBowl(0.016);
          const lockedRun = turboBowl, lockedBeacon = tbBeacon;
          const lockedStart = startTurboBowl();

          G.coachBeaten = true;
          for (let i = 0; i < 5; i++) updateTurboBowl(0.016);
          return {
            lockedRun, lockedBeacon, lockedStart,
            unlockedRun: turboBowl && turboBowl.phase,
            beaconExists: !!tbBeacon,
          };
        });
        assert(r.lockedRun === null, 'no run should start before Coach is beaten');
        assert(r.lockedBeacon === null, 'the beacon should not even be built before the unlock');
        assert(r.lockedStart === null, 'startTurboBowl() must refuse while locked');
        assert(r.beaconExists === true, 'the beacon should appear once the flag is set');
        assert(r.unlockedRun === 'run', 'walking onto the beacon unlocked should start a run, got ' + r.unlockedRun);
      },
    },
    {
      name: 'kickoff puts Turbo on his own goal line with the ball, facing downfield',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(AT_BEACON + `
          updateTurboBowl(0.016);
          return {
            phase: turboBowl && turboBowl.phase,
            atOwnGoal: Math.round(player.x - (FOOTBALL.x - 17)),
            onCentreLine: Math.round(player.z - FOOTBALL.z),
            yards: tbYards(player.x),
            hasBall: !!tbBall && !!tbBall.parent,
            defenders: tbDefenders.length,
            defendersInJocks: tbDefenders.filter(d => jocks.some(j => j.mesh === d.mesh)).length,
            cast: tbCast.length,
            beaconHidden: tbBeacon && tbBeacon.visible === false,
          };
        `));
        assert(r.phase === 'run', 'expected a live run, got ' + r.phase);
        assert(r.atOwnGoal === 0, 'kickoff should place Turbo on his own goal line, off by ' + r.atOwnGoal);
        assert(r.onCentreLine === 0, 'kickoff should be on the centre line, off by ' + r.onCentreLine);
        assert(r.yards === 0, 'own goal line should read 0 yards, got ' + r.yards);
        assert(r.hasBall === true, 'Turbo should be carrying the ball');
        assert(r.defenders === 3, 'the locked design opens with 3 defenders, got ' + r.defenders);
        assert(r.defendersInJocks === 0, 'defenders must never be in `jocks` — the hostile faction must not be able to reach them');
        assert(r.cast === 4, 'expected Coach plus a 3-person cheer squad on the sidelines, got ' + r.cast);
        assert(r.beaconHidden, 'the beacon should hide while a run is live');
      },
    },
    {
      name: 'reaching the far end zone scores, and yardage tracks the run',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(RUN_DOWNFIELD + AT_BEACON + `
          updateTurboBowl(0.016);
          tbDefenders.length = 0;              // an unobstructed run
          const atStart = tbYards(player.x);
          player.x = FOOTBALL.x; updateTurboBowl(0.016);
          const atMidfield = tbYards(player.x);
          advance(8);
          const phase = turboBowl.phase, yards = turboBowl.yards;
          for (let i = 0; i < 300 && turboBowl; i++) updateTurboBowl(0.016);
          return { atStart, atMidfield, phase, yards, best: G.turboBowlBest,
            over: G.over, cutscene: activeCutscene && activeCutscene.id, won: G.turboBowlWon };
        `));
        assert(r.atStart === 0 && r.atMidfield === 50,
          'yardage should run 0 at the goal line to 50 at midfield, got ' + r.atStart + '/' + r.atMidfield);
        assert(r.phase === 'scored', 'crossing the far goal line should score, got ' + r.phase);
        assert(r.yards === 100, 'a touchdown should register 100 yards, got ' + r.yards);
        assert(r.best === 100, 'the best should record the touchdown, got ' + r.best);
        assert(r.over === false, 'scoring must not touch the WASTED flow');
        assert(r.cutscene === 'turbo_bowl_payoff', 'the first win should play the payoff, got ' + r.cutscene);
        assert(r.won === true, 'the first win should set the one-time payoff flag');
      },
    },
    {
      name: 'a tackle is a soft fail — no wasted, no fine, and the yards still bank',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(AT_BEACON + `
          const moneyBefore = G.money = 400;
          const heatBefore = G.heat = 0;
          updateTurboBowl(0.016);
          player.x = FOOTBALL.x - 17 + 34 * 0.4;   // 40 yards downfield
          const d = tbDefenders[0];
          d.x = player.x; d.z = player.z;          // defender lands on him
          updateTurboBowl(0.016);
          const afterTackle = { phase: turboBowl.phase, yards: turboBowl.yards,
            over: G.over, hp: G.hp, money: G.money, heat: G.heat, best: G.turboBowlBest };
          for (let i = 0; i < 400 && turboBowl; i++) updateTurboBowl(0.016);
          const cleanedUp = tbDefenders.length + tbCast.length;   // measure BEFORE retrying
          // ...and the beacon comes straight back for an instant retry
          player.x = FOOTBALL.x; player.z = FOOTBALL.z;
          updateTurboBowl(0.016);
          return { moneyBefore, heatBefore, afterTackle, cleanedUp,
            retry: turboBowl && turboBowl.phase, won: G.turboBowlWon };
        `));
        assert(r.afterTackle.phase === 'tackled', 'touching a defender should tackle, got ' + r.afterTackle.phase);
        assert(r.afterTackle.over === false, 'a tackle must not run the WASTED flow');
        assert(r.afterTackle.hp === 100, 'a tackle must not cost health, got hp ' + r.afterTackle.hp);
        assert(r.afterTackle.money === r.moneyBefore, 'a tackle must not cost money');
        assert(r.afterTackle.heat === r.heatBefore, 'the strand never touches the cops — heat changed');
        assert(r.afterTackle.yards === 40, 'the tackle should bank the yards run, got ' + r.afterTackle.yards);
        assert(r.afterTackle.best === 40, 'a tackled run still sets a personal best, got ' + r.afterTackle.best);
        assert(r.cleanedUp === 0, 'defenders should be cleaned up after the run, ' + r.cleanedUp + ' left');
        assert(r.retry === 'run', 'walking back onto the beacon should restart immediately, got ' + r.retry);
        assert(r.won !== true, 'a tackle must not set the payoff flag');
      },
    },
    {
      name: 'turbo_bowl_payoff plays to completion, and Dad never appears',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          playCutscene('turbo_bowl_payoff', FOOTBALL.x, FOOTBALL.z);
          let n = 0;
          while (activeCutscene && n < 4000) { updateCutscene(0.02); n++; }
          const shots = CUTSCENES.turbo_bowl_payoff.shots;
          return {
            completed: !activeCutscene, n,
            hud: document.getElementById('hud').style.display,
            cineTop: document.getElementById('cineTop').style.display,
            speakers: shots.map(s => s.dialogue && s.dialogue.speaker).filter(Boolean),
          };
        });
        assert(r.completed, 'turbo_bowl_payoff did not finish within ' + r.n + ' steps');
        assert(r.hud === 'block', 'expected #hud restored, got ' + r.hud);
        assert(r.cineTop === 'none', 'expected cinematic bars hidden, got ' + r.cineTop);
        // HANDOFF.md's FB5 card: "Dad never appears on-screen ... don't add a
        // Dad actor/model for this." The owner confirmed that reading over
        // FOOTBALL_STRAND.md §6's conflicting Dad-storms-the-field version.
        assert(!r.speakers.includes('DAD'), 'Dad must not speak on-screen — got speakers ' + r.speakers.join(', '));
        assert(r.speakers.includes('AMBER'), 'Amber gets the squad\'s one named line, got ' + r.speakers.join(', '));
      },
    },
    {
      name: 'the payoff fires once; later wins get the short celebration',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(AT_BEACON + `
          function score() {
            player.x = FOOTBALL.x; player.z = FOOTBALL.z;
            updateTurboBowl(0.016);
            tbDefenders.length = 0;
            player.x = FOOTBALL.x + 18;
            updateTurboBowl(0.016);
            for (let i = 0; i < 300 && turboBowl; i++) updateTurboBowl(0.016);
          }
          score();
          const firstCutscene = activeCutscene && activeCutscene.id;
          let n = 0; while (activeCutscene && n < 4000) { updateCutscene(0.02); n++; }
          for (let i = 0; i < 400; i++) updateTurboBowl(0.016);   // let the outro clear
          const defendersNext = (() => {
            score();
            const c = activeCutscene && activeCutscene.id;
            let m = 0; while (activeCutscene && m < 4000) { updateCutscene(0.02); m++; }
            for (let i = 0; i < 400; i++) updateTurboBowl(0.016);
            return c;
          })();
          return { firstCutscene, secondCutscene: defendersNext,
            runs: G.turboBowlRuns, staged: tbDefenders.length + tbCast.length };
        `));
        assert(r.firstCutscene === 'turbo_bowl_payoff', 'first win should play the payoff, got ' + r.firstCutscene);
        assert(!r.secondCutscene, 'the payoff is a one-time thing — second win replayed ' + r.secondCutscene);
        assert(r.runs === 2, 'both touchdowns should count, got ' + r.runs);
        assert(r.staged === 0, 'all staging should be disposed between runs, ' + r.staged + ' left');
      },
    },
    {
      name: 'the best score and payoff flag survive a save/restore round-trip',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.turboBowlBest = 73; G.turboBowlWon = true; G.turboBowlRuns = 4;
          saveGame();
          const blob = JSON.parse(localStorage.getItem('gtb4.save'));
          G.turboBowlBest = 0; G.turboBowlWon = false; G.turboBowlRuns = 0;
          restoreSave(blob);
          return { blob, best: G.turboBowlBest, won: G.turboBowlWon, runs: G.turboBowlRuns };
        });
        assert(r.blob.turboBowlBest === 73, 'expected the best in the save blob, got ' + r.blob.turboBowlBest);
        assert(r.best === 73, 'expected the best restored, got ' + r.best);
        assert(r.won === true, 'expected the payoff flag restored');
        assert(r.runs === 4, 'expected the run count restored, got ' + r.runs);
      },
    },
    {
      name: 'leaving the field on foot ends the run instead of stranding it',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(AT_BEACON + `
          updateTurboBowl(0.016);
          const started = turboBowl.phase;
          player.x = FOOTBALL.x - 40;              // back out through your own end zone
          updateTurboBowl(0.016);
          const backedOut = turboBowl.phase;
          for (let i = 0; i < 400 && turboBowl; i++) updateTurboBowl(0.016);
          return { started, backedOut, mission: turboBowl,
            staged: tbDefenders.length + tbCast.length, over: G.over };
        `));
        assert(r.started === 'run', 'expected a run to start');
        assert(r.backedOut === 'tackled', 'running out the back should end the run, got ' + r.backedOut);
        assert(r.mission === null, 'the mode should clear itself, not strand a phase');
        assert(r.staged === 0, 'staging should be disposed, ' + r.staged + ' left');
        assert(r.over === false, 'backing out must not waste Turbo');
      },
    },
  ],
};
