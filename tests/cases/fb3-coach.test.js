// FB3 — "Old Scores" → "Rematch", the Coach encounter (FOOTBALL_STRAND.md §4).
// One case per acceptance point on HANDOFF.md §8's FB3 card: triggers once,
// plays both real cutscenes, resolves to a clear win, sets G.coachBeaten,
// persists across a reload, and never re-triggers — plus the two behaviours the
// spec is explicit about beyond the card (a loss soft-retries instead of
// wasting Turbo, and the Wildcats go non-hostile afterwards).
//
// Every case drives the encounter inside one synchronous page.evaluate() so the
// page's own rAF loop can't interleave and make the phase machine racy.

// Steps the encounter from dormant to the start of the Rematch: teleport to the
// field, trigger Old Scores, put the warm-up jocks down through the real
// downJock() path, then run coach_rematch_intro to its end.
const TO_FIGHT = `
  player.x = FOOTBALL.x + 8; player.z = FOOTBALL.z + 8;
  player.mesh.position.set(player.x, groundH(player.x, player.z), player.z);
  updateCoachMission(0.016);
  coachMission.warmup.forEach(j => { j.hp = 0; downJock(j, false); });
  updateCoachMission(0.016);                       // warm-up clear -> intro
  let guard = 0;
  while (activeCutscene && guard < 4000) { updateCutscene(0.02); guard++; }
`;

module.exports = {
  cases: [
    {
      name: 'Old Scores triggers on reaching the field, and only once',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          if (!FOOTBALL) throw new Error('no Wildcats Field in this city — FB2 is a prerequisite');
          const before = coachMission;
          player.x = FOOTBALL.x + 8; player.z = FOOTBALL.z + 8;
          player.mesh.position.set(player.x, groundH(player.x, player.z), player.z);
          const jocksBefore = jocks.length;
          for (let i = 0; i < 60; i++) updateCoachMission(0.016);   // keep poking the trigger
          return {
            before, phase: coachMission && coachMission.phase,
            staged: coachMission ? coachMission.warmup.length : 0,
            spawned: jocks.length - jocksBefore,
          };
        });
        assert(r.before === null, 'the encounter should be dormant before Turbo reaches the field');
        assert(r.phase === 'warmup', 'expected the warm-up phase after reaching the field, got ' + r.phase);
        assert(r.staged === 3, 'expected 3 staged Alumni Wildcats, got ' + r.staged);
        assert(r.spawned === 3, 'repeated trigger checks should not stack a second warm-up — ' + r.spawned + ' jocks spawned');
      },
    },
    {
      name: 'the strand never touches the cops — no heat off its jocks',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          player.heading = 0;   // forward is +z
          const punch = (alumni) => {
            const j = spawnJock(player.x, player.z + 1.4);
            j.alumni = alumni;
            G.heat = 0; G.stars = 0; player.punchT = 0; player.kickT = 0;
            doPunch(false, false);
            const heat = G.heat;
            const i = jocks.indexOf(j);
            if (i >= 0) { scene.remove(j.mesh); disposeMesh(j.mesh); jocks.splice(i, 1); }
            return heat;
          };
          const plain = punch(false), alumni = punch(true);
          // downJock() carries its own heat, and the mission's jocks skip that too
          const j = spawnJock(player.x + 3, player.z);
          j.alumni = true; G.heat = 0; downJock(j, false);
          return { plain, alumni, downed: G.heat };
        });
        // Any bystander caught by the same swing contributes to both numbers;
        // the jock's own 14 is the only difference between them.
        assert(r.plain - r.alumni === 14,
          'a mission jock should cost exactly the jock heat less than an ordinary one, got ' + r.plain + ' vs ' + r.alumni);
        assert(r.downed === 0, 'downing a mission jock should add no heat, got ' + r.downed);
      },
    },
    {
      name: 'coach_rematch_intro plays to completion and cleans up',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          playCutscene('coach_rematch_intro', FOOTBALL.x, FOOTBALL.z);
          let n = 0;
          while (activeCutscene && n < 4000) { updateCutscene(0.02); n++; }
          return {
            completed: !activeCutscene, n,
            hud: document.getElementById('hud').style.display,
            cineTop: document.getElementById('cineTop').style.display,
            shots: CUTSCENES.coach_rematch_intro.shots.length,
          };
        });
        assert(r.completed, 'coach_rematch_intro did not finish within ' + r.n + ' simulated steps');
        assert(r.shots === 6, 'FOOTBALL_STRAND.md §6 scripts 6 shots, found ' + r.shots);
        assert(r.hud === 'block', 'expected #hud restored after the cutscene, got ' + r.hud);
        assert(r.cineTop === 'none', 'expected cinematic bars hidden after the cutscene, got ' + r.cineTop);
      },
    },
    {
      name: 'coach_defeat plays to completion and cleans up',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          playCutscene('coach_defeat', FOOTBALL.x, FOOTBALL.z);
          let n = 0;
          while (activeCutscene && n < 4000) { updateCutscene(0.02); n++; }
          return {
            completed: !activeCutscene, n,
            hud: document.getElementById('hud').style.display,
            cineTop: document.getElementById('cineTop').style.display,
          };
        });
        assert(r.completed, 'coach_defeat did not finish within ' + r.n + ' simulated steps');
        assert(r.hud === 'block', 'expected #hud restored after the cutscene, got ' + r.hud);
        assert(r.cineTop === 'none', 'expected cinematic bars hidden after the cutscene, got ' + r.cineTop);
      },
    },
    {
      name: 'clearing the warm-up runs the intro cutscene into a fists-only Rematch',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(TO_FIGHT + `
          const phase = coachMission.phase;
          G.weapon = 'pistol';                    // house rules put it straight back
          updateCoachMission(0.016);
          return {
            phase, weapon: G.weapon, guard,
            coachHp: coach && coach.hp, maxHp: coach && coach.maxHp,
            spectators: coachMission.spectators.length,
            spectatorsInJocks: coachMission.spectators.filter(s => jocks.some(j => j.mesh === s.mesh)).length,
          };
        `));
        assert(r.guard > 100, 'the intro cutscene should actually have run, only stepped ' + r.guard + ' times');
        assert(r.phase === 'fight', 'expected the Rematch to start when the intro ends, got phase ' + r.phase);
        assert(r.coachHp === r.maxHp && r.coachHp > 0, 'expected Coach at full HP at the bell, got ' + r.coachHp);
        assert(r.weapon === 'fists', "expected the house rule to force fists, got '" + r.weapon + "'");
        assert(r.spectators === 5, 'expected the ring of watching Wildcats, got ' + r.spectators);
        assert(r.spectatorsInJocks === 0, 'the watching Wildcats must not be in `jocks` — nothing can make them join in');
      },
    },
    {
      name: 'Coach yields instead of dying, then the win sets and saves G.coachBeaten',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(TO_FIGHT + `
          // beat him down through the real melee hook, not by poking his HP.
          // Every landed punch shoves him back, so close the gap again each
          // swing the way a player chasing him down would.
          let swings = 0;
          while (coach.hp > 0 && swings < 60) {
            player.heading = 0; player.x = coach.x; player.z = coach.z - 1.3;
            player.punchT = 0; player.kickT = 0;
            doPunch(false, false); swings++;
          }
          const yieldState = coach.state, yieldPhase = coachMission.phase;
          const flat = Math.abs(coach.mesh.rotation.x) > 1;   // knockPed()'s ragdoll pitch
          const beatenBefore = G.coachBeaten;
          // the yield beat holds, then resolves through coach_defeat
          for (let i = 0; i < 200 && !activeCutscene && coachMission; i++) updateCoachMission(0.016);
          const playedDefeat = activeCutscene && activeCutscene.id;
          let n = 0; while (activeCutscene && n < 4000) { updateCutscene(0.02); n++; }
          const blob = JSON.parse(localStorage.getItem('gtb4.save'));
          const inSceneAfterWin = scene.children.includes(coach && coach.mesh);
          // the Wildcats clap it out, then the whole staging clears itself away
          for (let i = 0; i < 600 && coachMission; i++) updateCoachMission(0.016);
          return { swings, yieldState, yieldPhase, flat, beatenBefore, playedDefeat,
            beaten: G.coachBeaten, saved: blob && blob.coachBeaten, over: G.over,
            inSceneAfterWin, mission: coachMission, coach,
            missionHud: document.getElementById('mission').style.display };
        `));
        assert(r.swings > 1 && r.swings < 60, 'expected Coach to take a real beating, got ' + r.swings + ' swings');
        assert(r.yieldState === 'yield', "expected Coach's yield state, got '" + r.yieldState + "'");
        assert(r.yieldPhase === 'yield', 'expected the encounter in its yield phase, got ' + r.yieldPhase);
        assert(r.flat === false, 'Coach must not ragdoll flat — he yields, he does not die');
        assert(r.beatenBefore !== true, 'the unlock flag should not be set before coach_defeat resolves');
        assert(r.playedDefeat === 'coach_defeat', 'expected coach_defeat to play, got ' + r.playedDefeat);
        assert(r.beaten === true, 'expected G.coachBeaten set on the win');
        assert(r.saved === true, 'expected G.coachBeaten written straight to the save blob');
        assert(r.over === false, 'the win must not run through the BUSTED/WASTED flow');
        assert(r.inSceneAfterWin === true, 'Coach should still be standing there through the payoff');
        assert(r.mission === null && r.coach === null, 'the staging should clear itself away after the payoff');
        assert(r.missionHud === 'none', 'the mission HUD slot should be released after the win');
      },
    },
    {
      name: 'the unlock flag survives a save/restore round-trip',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          G.coachBeaten = true; saveGame();
          const blob = JSON.parse(localStorage.getItem('gtb4.save'));
          G.coachBeaten = false;
          restoreSave(blob);
          return { saved: blob.coachBeaten, restored: G.coachBeaten };
        });
        assert(r.saved === true, 'expected coachBeaten in the save blob');
        assert(r.restored === true, 'expected coachBeaten restored from the blob');
      },
    },
    {
      name: 'a beaten Coach never re-triggers, and the Wildcats stop being hostile',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const hostileBefore = jocksHostile();
          const packBefore = jockTauntPack(null);
          G.coachBeaten = true;
          player.x = FOOTBALL.x; player.z = FOOTBALL.z;
          player.mesh.position.set(player.x, groundH(player.x, player.z), player.z);
          const jocksBefore = jocks.length;
          for (let i = 0; i < 120; i++) updateCoachMission(0.016);
          // an ambient jock standing right on top of Turbo must not square up
          const j = spawnJock(player.x + 2, player.z);
          for (let i = 0; i < 30; i++) updateJocks(0.016);
          return {
            hostileBefore, packBefore: packBefore === JOCK_POST_REMATCH,
            mission: coachMission, coach, spawned: jocks.length - jocksBefore,
            hostileAfter: jocksHostile(), jockState: j.state,
            packAfter: jockTauntPack(j) === JOCK_POST_REMATCH,
          };
        });
        assert(r.hostileBefore === true, 'jocks should start out hostile');
        assert(r.packBefore === false, 'the post-Rematch bark pack should not be in play before the win');
        assert(r.mission === null, 'the encounter must not re-trigger once Coach is beaten');
        assert(r.coach === null, 'no Coach should be spawned after the win');
        assert(r.spawned === 1, 'no warm-up should be staged after the win — ' + r.spawned + ' jocks appeared');
        assert(r.hostileAfter === false, 'ambient jocks should be non-hostile after the win');
        assert(r.jockState !== 'chase' && r.jockState !== 'swing',
          "a jock next to Turbo should not pick a fight after the win, got '" + r.jockState + "'");
        assert(r.packAfter === true, 'jock barks should switch to the post-Rematch pack');
      },
    },
    {
      name: 'losing to Coach soft-retries at the field instead of wasting Turbo',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(new Function(TO_FIGHT + `
          const moneyBefore = G.money = 500;
          coachStrikePlayer(9999);
          const afterLoss = { phase: coachMission.phase, hp: G.hp, over: G.over,
            money: G.money, coachHp: coach.hp, rounds: coachMission.rounds };
          // ...and the round starts again, right there, with no respawn
          for (let i = 0; i < 400 && coachMission.phase === 'retry'; i++) updateCoachMission(0.016);
          return { moneyBefore, afterLoss, phase: coachMission.phase,
            beaten: G.coachBeaten, atField: Math.hypot(player.x - FOOTBALL.x, player.z - FOOTBALL.z) };
        `));
        assert(r.afterLoss.over === false, 'a loss to Coach must not run the WASTED flow');
        assert(r.afterLoss.phase === 'retry', 'expected the soft-retry phase, got ' + r.afterLoss.phase);
        assert(r.afterLoss.hp === 100, 'expected Turbo patched up for the next round, got hp ' + r.afterLoss.hp);
        assert(r.afterLoss.money === r.moneyBefore, 'a lost scrimmage should cost nothing, money went ' + r.moneyBefore + ' -> ' + r.afterLoss.money);
        assert(r.afterLoss.coachHp === 240, 'expected Coach reset for the next round, got ' + r.afterLoss.coachHp);
        assert(r.afterLoss.rounds === 2, 'expected the round counter to advance, got ' + r.afterLoss.rounds);
        assert(r.phase === 'fight', 'expected the Rematch to restart on its own, got ' + r.phase);
        assert(r.atField < 40, 'the retry must happen at the field, not downtown — ' + Math.round(r.atField) + 'm away');
        assert(r.beaten !== true, 'losing must not set the unlock flag');
      },
    },
    {
      name: 'the encounter lets go if Turbo walks away, and re-opens later',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          player.x = FOOTBALL.x + 8; player.z = FOOTBALL.z + 8;
          updateCoachMission(0.016);
          const started = coachMission && coachMission.phase;
          const staged = coachMission.warmup.slice();
          player.x = FOOTBALL.x + 400; player.z = FOOTBALL.z + 400;
          for (let i = 0; i < 600 && coachMission; i++) updateCoachMission(0.016);
          const abandoned = coachMission;
          const stillOut = staged.filter(j => jocks.includes(j)).length;
          // the cooldown holds it shut for a bit, then walking back re-opens it
          player.x = FOOTBALL.x + 8; player.z = FOOTBALL.z + 8;
          updateCoachMission(0.016);
          const duringCooldown = coachMission;
          for (let i = 0; i < 2000 && !coachMission; i++) updateCoachMission(0.016);
          return { started, abandoned, stillOut, duringCooldown,
            reopened: coachMission && coachMission.phase, beaten: G.coachBeaten };
        });
        assert(r.started === 'warmup', 'expected the warm-up to start, got ' + r.started);
        assert(r.abandoned === null, 'the encounter should let go once Turbo is well clear of the field');
        assert(r.stillOut === 0, 'the staged Wildcats should be cleaned up when it lets go, ' + r.stillOut + ' left behind');
        assert(r.duringCooldown === null, 'it should not re-open instantly on the same step');
        assert(r.reopened === 'warmup', 'walking back should re-open the encounter, got ' + r.reopened);
        assert(r.beaten !== true, 'walking away is not a win');
      },
    },
  ],
};
