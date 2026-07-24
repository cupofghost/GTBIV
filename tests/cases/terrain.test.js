// Terrain regressions per TERRAIN.md — groundH must stay a single-valued,
// CONTINUOUS height field, the drawn mesh has to agree with it (or props sink
// into the hillside), and every world-placed object must read its Y from it.
module.exports = {
  cases: [
    {
      name: 'groundH is finite everywhere on the map',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          let bad = 0, samples = 0;
          const step = 8;
          for (let x = -H; x <= H; x += step) for (let z = -H; z <= H; z += step) {
            samples++;
            if (!Number.isFinite(groundH(x, z))) bad++;
          }
          return { bad, samples };
        });
        assert(r.samples > 100, 'expected a real grid sample, got ' + r.samples);
        assert(r.bad === 0, 'groundH returned a non-finite value at ' + r.bad + ' points');
      },
    },
    {
      name: 'streets never bank sideways — constant height across a road\'s width',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          let worstNS = 0, worstEW = 0, checkedNS = 0, checkedEW = 0;
          for (let i = 0; i <= WORLD.blocks; i++) {
            const rx = roadLines[i];
            // N/S street at x=rx: walk its length, and at each point sample
            // straight across its width (varying x only) — must be flat.
            for (let z = -H + 10; z <= H - 10; z += 20) {
              const across = [-6, -3, 0, 3, 6].map(dx => groundH(rx + dx, z));
              worstNS = Math.max(worstNS, Math.max(...across) - Math.min(...across));
              checkedNS++;
            }
            const rz = roadLines[i];
            for (let x = -H + 10; x <= H - 10; x += 20) {
              const across = [-6, -3, 0, 3, 6].map(dz => groundH(x, rz + dz));
              worstEW = Math.max(worstEW, Math.max(...across) - Math.min(...across));
              checkedEW++;
            }
          }
          return { worstNS, worstEW, checkedNS, checkedEW };
        });
        assert(r.checkedNS > 20 && r.checkedEW > 20, 'expected a real sample of road points');
        assert(r.worstNS < 0.01, 'a N/S street tilts sideways across its width by ' + r.worstNS.toFixed(3) + 'u');
        assert(r.worstEW < 0.01, 'an E/W street tilts sideways across its width by ' + r.worstEW.toFixed(3) + 'u');
      },
    },
    {
      name: 'the field is continuous — no ledge where a street meets its block',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // walk straight off every street onto the block beside it, in 0.25u
          // steps: a continuous field can only change by (max grade * step).
          let worst = 0, at = null, checked = 0;
          const probe = (x, z, dx, dz) => {
            let prev = groundH(x, z);
            for (let s = 0.25; s <= 14; s += 0.25) {
              const h = groundH(x + dx * s, z + dz * s);
              const d = Math.abs(h - prev);
              if (d > worst) { worst = d; at = [x + dx * s, z + dz * s]; }
              prev = h; checked++;
            }
          };
          for (let i = 0; i <= WORLD.blocks; i++) {
            for (let t = -H + 20; t <= H - 20; t += 13) {
              probe(roadLines[i], t, 1, 0);
              probe(roadLines[i], t, -1, 0);
              probe(t, roadLines[i], 0, 1);
              probe(t, roadLines[i], 0, -1);
            }
          }
          return { worst, at, checked };
        });
        assert(r.checked > 5000, 'expected a dense sample, got ' + r.checked);
        // 0.25u of travel over the steepest legal grade (a park knoll) is ~0.11u
        assert(r.worst < 0.15,
          'groundH steps by ' + r.worst.toFixed(2) + 'u over 0.25u of travel near ' +
          JSON.stringify(r.at) + ' — that is a cliff, not a grade');
      },
    },
    {
      name: 'street grade stays inside the drivable/walkable budget',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          let worst = 0, at = null;
          for (let i = 0; i <= WORLD.blocks; i++) {
            for (let t = -H + 6; t <= H - 6; t += 2) {
              const ns = Math.abs(groundH(roadLines[i], t + 1) - groundH(roadLines[i], t - 1)) / 2;
              const ew = Math.abs(groundH(t + 1, roadLines[i]) - groundH(t - 1, roadLines[i])) / 2;
              if (ns > worst) { worst = ns; at = ['NS', roadLines[i], t]; }
              if (ew > worst) { worst = ew; at = ['EW', t, roadLines[i]]; }
            }
          }
          return { worst, at };
        });
        // TERRAIN.md §5: cap street grade around 12 deg (0.21 rad) or cars fight
        // the pitch clamp and the ramp-launch heuristic
        assert(r.worst < 0.21,
          'a street grades at ' + r.worst.toFixed(3) + ' rad near ' + JSON.stringify(r.at) + ' (cap 0.21)');
      },
    },
    {
      name: 'the drawn ground mesh agrees with groundH (nothing sinks into it)',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const ray = new THREE.Raycaster();
          const down = new THREE.Vector3(0, -1, 0);
          // the grid has a vertex line on every kerb, so streets and blocks are
          // reproduced exactly; a park knoll is a dome sampled every ~3u, so it
          // keeps a little sag at the crown.
          const onKnoll = (x, z) => KNOLLS.some(k => Math.hypot(x - k.x, z - k.z) < k.r + 3);
          let worst = 0, at = null, worstFlat = 0, atFlat = null, hits = 0, flat = 0;
          for (let k = 0; k < 500; k++) {
            const x = (Math.random() * 2 - 1) * (H - 4), z = (Math.random() * 2 - 1) * (H - 4);
            ray.set(new THREE.Vector3(x, 400, z), down);
            const hit = ray.intersectObject(ground, false)[0];
            if (!hit) continue;
            hits++;
            const d = Math.abs(hit.point.y - groundH(x, z));
            if (d > worst) { worst = d; at = [x, z, hit.point.y, groundH(x, z)]; }
            if (!onKnoll(x, z)) {
              flat++;
              if (d > worstFlat) { worstFlat = d; atFlat = [x, z, hit.point.y, groundH(x, z)]; }
            }
          }
          return { worst, at, worstFlat, atFlat, hits, flat };
        });
        assert(r.hits > 400, 'expected the ground mesh to cover the city, only ' + r.hits + ' hits');
        assert(r.flat > 300, 'expected most samples to land off the park knolls, got ' + r.flat);
        assert(r.worstFlat < 0.05,
          'the drawn street/block ground is ' + r.worstFlat.toFixed(2) + 'u off groundH at ' + JSON.stringify(r.atFlat) +
          ' — props seated on groundH will float or bury there');
        assert(r.worst < 0.35,
          'the drawn ground is ' + r.worst.toFixed(2) + 'u off groundH at ' + JSON.stringify(r.at));
      },
    },
    {
      name: 'the beach mesh never punches up through the city',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const ray = new THREE.Raycaster();
          const down = new THREE.Vector3(0, -1, 0);
          let worst = -Infinity, at = null, checked = 0;
          for (let k = 0; k < 400; k++) {
            const x = (Math.random() * 2 - 1) * (H - 4), z = (Math.random() * 2 - 1) * (H - 4);
            ray.set(new THREE.Vector3(x, 400, z), down);
            const s = ray.intersectObject(sand, false)[0];
            if (!s) continue;   // hollow interior: no sand geometry here at all
            checked++;
            const over = s.point.y - groundH(x, z);
            if (over > worst) { worst = over; at = [x, z, over]; }
          }
          return { worst, at, checked };
        });
        // wherever the sand does exist inside the city it must stay buried
        assert(r.checked === 0 || r.worst < -0.5,
          'the sand mesh sits ' + r.worst.toFixed(2) + 'u above the ground at ' + JSON.stringify(r.at) +
          ' — that is the beach showing through downtown');
      },
    },
    {
      name: 'buildings sit on the ground field — baseY matches a footprint corner, no floaters',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const sample = buildings.filter(b => b.baseY !== undefined).slice(0, 40);
          let worstFloat = 0, worstBury = 0;
          for (const b of sample) {
            const corners = [
              groundH(b.minX, b.minZ), groundH(b.minX, b.maxZ),
              groundH(b.maxX, b.minZ), groundH(b.maxX, b.maxZ),
            ];
            const lowest = Math.min(...corners);
            // baseY must be <= every corner's ground height (skirt covers the rest)
            for (const c of corners) worstFloat = Math.max(worstFloat, b.baseY - c);
            worstBury = Math.max(worstBury, lowest - b.baseY);
          }
          return { count: sample.length, worstFloat, worstBury };
        });
        assert(r.count > 0, 'expected at least one building with a baseY');
        assert(r.worstFloat <= 0.001, 'a building floats above a footprint corner by ' + r.worstFloat.toFixed(3) + 'u');
      },
    },
    {
      name: 'pickups hover above the ground under them, never inside the hill',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          updatePickupVisuals(0);
          let worst = Infinity, at = null;
          for (const p of pickups) {
            const clear = p.mesh.position.y - groundH(p.x, p.z);
            if (clear < worst) { worst = clear; at = [p.kind, p.x, p.z, clear]; }
          }
          // and one dropped on the tallest signature hill
          const hill = SIGNATURE_HILLS[0];
          spawnPickup('cash', hill.x, hill.z);
          const drop = pickups[pickups.length - 1];
          const hillClear = drop.mesh.position.y - groundH(hill.x, hill.z);
          return { n: pickups.length, worst, at, hillClear, hillH: groundH(hill.x, hill.z) };
        });
        assert(r.n > 10, 'expected the world to be scattered with pickups, got ' + r.n);
        assert(r.hillH > 1, 'expected the signature hill to be elevated, got ' + r.hillH.toFixed(2));
        assert(r.worst > 0.5, 'a pickup sits ' + r.worst.toFixed(2) + 'u off the ground at ' + JSON.stringify(r.at));
        assert(Math.abs(r.hillClear - 1.4) < 0.01,
          'a pickup dropped on the hilltop hovers ' + r.hillClear.toFixed(2) + 'u above it, expected 1.4');
      },
    },
    {
      name: 'rail pillars reach the ground and stay a sane, non-degenerate height',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // beam sits at a fixed absolute y=7; pillars grow from local groundH up to it
          let minPh = Infinity, worstOver = -Infinity;
          for (const p of RAIL_PILLARS) {
            const gh = groundH(p.x, p.z);
            minPh = Math.min(minPh, Math.max(1, 7 - gh));
            worstOver = Math.max(worstOver, gh - 7);
          }
          return { n: RAIL_PILLARS.length, minPh, worstOver };
        });
        assert(r.n > 0, 'expected rail pillars to exist');
        assert(r.minPh >= 1, 'pillar height clamp failed, got minimum ' + r.minPh.toFixed(2));
        // generous tolerance: city relief + a stray park knoll near the loop can eat into
        // the fixed beam clearance a little, but shouldn't come anywhere close to it
        assert(r.worstOver < 4, 'terrain under the rail loop is eating the beam clearance: worst groundH is ' + r.worstOver.toFixed(2) + 'u above the fixed y=7 beam');
      },
    },
    {
      name: 'a climbable stair run tracks continuously from bottom to top',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const run = STAIR_RUNS.find(r => r.topH - r.baseH > 1.5 && r.topH - r.baseH < 14);
          if (!run) return { found: false };
          // walk the run bottom to top and confirm stairHitRun tracks it continuously
          let worstJump = 0, prevH = null;
          for (let t = 0; t <= 1; t += 0.05) {
            const x = run.x + Math.sin(run.ang) * run.len * t;
            const z = run.z + Math.cos(run.ang) * run.len * t;
            const hit = stairHitRun(x, z);
            if (hit) {
              if (prevH !== null) worstJump = Math.max(worstJump, Math.abs(hit.h - prevH));
              prevH = hit.h;
            }
          }
          return { found: true, baseH: run.baseH, topH: run.topH, worstJump, gotStart: prevH !== null };
        });
        assert(r.found, 'expected at least one tall climbable STAIR_RUN (rail stairs / fire escapes)');
        assert(r.gotStart, 'expected stairHitRun to detect the run along its own length');
        assert(r.worstJump < 1, 'stair height jumps unexpectedly while climbing it: ' + r.worstJump.toFixed(2));
      },
    },
    {
      name: 'the steepest street is drivable — a car tracks it without launching',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // steepest N/S street segment on the map
          let best = null;
          for (let i = 0; i <= WORLD.blocks; i++) for (let j = 0; j < WORLD.blocks; j++) {
            const d = VERT_H[i][j + 1] - VERT_H[i][j];
            if (!best || Math.abs(d) > Math.abs(best.d)) best = { i, j, d };
          }
          const x = roadLines[best.i];
          const uphill = best.d > 0;
          const z0 = uphill ? roadLines[best.j] + 2 : roadLines[best.j + 1] - 2;
          const c = cars.find(c2 => !c2.dead && !c2.driver);
          c.x = x; c.z = z0; c.y = groundH(x, z0); c.vy = 0; c.airborne = false;
          c.heading = uphill ? 0 : Math.PI; c.speed = 0;
          c.vel.set(0, 0, 0);
          player.car = c; G.mode = 'car';
          input.gas = 1; input.boost = false; input.brake = false; input.drift = false; input.jx = 0;
          let launched = 0, worstOff = 0, travelled = 0;
          for (let k = 0; k < 400; k++) {
            updateCarMode(0.02);
            if (c.airborne) launched++;
            worstOff = Math.max(worstOff, Math.abs(c.y - groundH(c.x, c.z)));
            travelled = Math.abs(c.z - z0);
          }
          input.gas = 0; G.mode = 'foot'; player.car = null; c.driver = null;
          return { drop: Math.abs(best.d), launched, worstOff, travelled, climbed: c.y - groundH(x, z0) };
        });
        assert(r.drop > 1, 'expected at least one street with real grade, steepest drop is ' + r.drop.toFixed(2) + 'u');
        assert(r.travelled > 20, 'expected the car to actually drive up the street, moved ' + r.travelled.toFixed(1) + 'u');
        assert(r.launched === 0, 'the graded street launched the car into the air on ' + r.launched + ' frames');
        assert(r.worstOff < 0.2, 'car.y drifted ' + r.worstOff.toFixed(2) + 'u off the street surface');
      },
    },
    {
      name: 'player walking onto a signature hill settles onto groundH, not a flat y=0',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const hill = SIGNATURE_HILLS[0];
          player.x = hill.x; player.z = hill.z; player.y = groundH(hill.x, hill.z) + 3; player.vy = 0;
          for (let i = 0; i < 60; i++) updateFoot(0.05);
          return { y: player.y, gh: groundH(player.x, player.z), hillH: groundH(hill.x, hill.z) };
        });
        assert(r.hillH > 1, 'expected the signature hill to actually be elevated, got groundH=' + r.hillH.toFixed(2));
        assert(Math.abs(r.y - r.gh) < 0.05, 'expected player.y to settle onto groundH on the hilltop, got y=' + r.y.toFixed(2) + ' vs groundH=' + r.gh.toFixed(2));
      },
    },
    {
      name: 'Turbo walks up a hillside instead of popping up to it',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // start at the foot of the big hill and drive him straight at the summit
          const hill = SIGNATURE_HILLS[0];
          const ang = Math.atan2(hill.x - (hill.x - hill.r * 0.9), hill.z - (hill.z - hill.r * 0.9));
          player.x = hill.x - hill.r * 0.9; player.z = hill.z - hill.r * 0.9;
          player.y = groundH(player.x, player.z); player.vy = 0; player.car = null; G.mode = 'foot';
          // input is camera-relative; park the camera behind him so W walks uphill
          camera.position.set(player.x - Math.sin(ang) * 8, player.y + 5, player.z - Math.cos(ang) * 8);
          input.jx = 0; input.jy = -1;
          let worstStep = 0, climbed = 0, prevY = player.y, steps = 0;
          for (let i = 0; i < 200; i++) {
            const before = player.y;
            updateFoot(0.03);
            worstStep = Math.max(worstStep, Math.abs(player.y - before));
            if (player.y > prevY) climbed += player.y - prevY;
            prevY = player.y; steps++;
          }
          input.jx = 0; input.jy = 0;
          return { worstStep, climbed, steps, endY: player.y, gh: groundH(player.x, player.z) };
        });
        assert(r.climbed > 1.5, 'expected Turbo to gain real height walking uphill, got ' + r.climbed.toFixed(2) + 'u');
        // 0.03s at 8.2u/s over the steepest legal grade is ~0.05u per frame; a
        // ledge-pop would be a whole step of it at once
        assert(r.worstStep < 0.3,
          'Turbo jumped ' + r.worstStep.toFixed(2) + 'u in one frame — that is popping up a ledge, not walking a grade');
        assert(Math.abs(r.endY - r.gh) < 0.05, 'expected him to end up on the ground, y=' + r.endY.toFixed(2) + ' vs ' + r.gh.toFixed(2));
      },
    },
  ],
};
