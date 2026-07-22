// Terrain & vertical-surface resolver (Tier 0 + 3a).
// Guards the grade-ready plumbing: buildings seat on groundH via baseY, the
// roof/stairs/deck picker (supportY) is the single floor-under-you function, and
// registered deck surfaces behave like floors-from-above / ceilings-from-below.
// The map is still flat today, so every "grade-ready" value is a no-op (0) — the
// point is that the code now routes through the height field instead of hardcoding
// y=0, and that the resolver is a working extension point for garage decks (3b).
module.exports = {
  cases: [
    {
      name: 'resolver + height-field API exist and are self-consistent on flat ground',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => ({
          hasGroundH: typeof groundH === 'function',
          hasRoofAt: typeof roofAt === 'function',
          hasSupportY: typeof supportY === 'function',
          hasRegister: typeof registerSurface === 'function',
          hasDeckArray: Array.isArray(DECK_SURFACES),
          // (0,0) is a road intersection: no building, flat street
          ghOrigin: groundH(0, 0),
          supportOrigin: supportY(0, 0, 0),
          gridFinite: (() => {
            for (let x = -300; x <= 300; x += 60)
              for (let z = -300; z <= 300; z += 60)
                if (!Number.isFinite(groundH(x, z))) return false;
            return true;
          })(),
        }));
        assert(r.hasGroundH && r.hasRoofAt && r.hasSupportY, 'groundH/roofAt/supportY must all be functions');
        assert(r.hasRegister && r.hasDeckArray, 'registerSurface() + DECK_SURFACES registry must exist for garage decks');
        assert(r.gridFinite, 'groundH must be finite everywhere it is sampled');
        assert(r.supportOrigin === r.ghOrigin, 'on open street, supportY must equal groundH (no phantom floor)');
      },
    },
    {
      name: 'every building carries a finite baseY and seats its roof at baseY + h',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const bad = buildings.filter(b => !Number.isFinite(b.baseY == null ? 0 : b.baseY));
          // roofAt at a building centre must report that building's top
          const b = buildings.find(b => b.h > 0);
          const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
          return {
            count: buildings.length,
            badCount: bad.length,
            roof: roofAt(cx, cz),
            expected: (b.baseY || 0) + b.h,
            allFlatZero: buildings.every(b => (b.baseY || 0) === 0),
          };
        });
        assert(r.count > 0, 'expected buildings to exist');
        assert(r.badCount === 0, 'every building baseY must be a finite number (or absent -> 0)');
        assert(Math.abs(r.roof - r.expected) < 1e-6, `roofAt should be baseY+h (${r.expected}), got ${r.roof}`);
        assert(r.allFlatZero, 'today the map is flat, so every baseY should be 0 (grade-ready no-op)');
      },
    },
    {
      name: 'a registered deck is a floor from above and a ceiling from below',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          // put a 6u-high deck over the origin intersection (no building there)
          const deck = {
            minX: -3, maxX: 3, minZ: -3, maxZ: 3, y: 6,
            covers(x, z) { return x >= this.minX && x <= this.maxX && z >= this.minZ && z <= this.maxZ; },
            heightAt() { return this.y; },
          };
          registerSurface(deck);
          const gh = groundH(0, 0);
          const onDeck = supportY(0, 0, 6);     // up near the deck -> stand on it
          const belowDeck = supportY(0, 0, 0);  // down on the street -> deck is overhead
          const offDeck = supportY(20, 0, 6);   // outside the footprint -> unaffected
          DECK_SURFACES.pop();                  // tidy up (per-case page anyway)
          return { gh, onDeck, belowDeck, offDeck, ghOff: groundH(20, 0) };
        });
        assert(r.onDeck === 6, `standing at deck height should resolve to the deck (6), got ${r.onDeck}`);
        assert(r.belowDeck === r.gh, `from the street below, the deck is a ceiling, not a floor (expected ${r.gh}, got ${r.belowDeck})`);
        assert(r.offDeck === r.ghOff, 'outside the deck footprint the resolver must ignore it');
      },
    },
    {
      name: 'supportY reproduces the old roof pick (refactor is behaviour-preserving)',
      query: '?dev=1&skipintro=1',
      run: async (page, { assert }) => {
        const r = await page.evaluate(() => {
          const b = buildings.find(b => b.h > 5);
          const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
          const curY = (b.baseY || 0) + b.h;          // standing on the roof
          // the exact expression the foot/bail code used before the refactor:
          const roofHere = roofAt(cx, cz), sh = (typeof stairH === 'function' ? stairH(cx, cz) : 0);
          const legacy = (roofHere > 0 && curY > roofHere - 1.0) ? roofHere
            : Math.max(groundH(cx, cz), (sh > 0 && curY > sh - 1.0) ? sh : 0);
          return { legacy, resolver: supportY(cx, cz, curY) };
        });
        assert(Math.abs(r.legacy - r.resolver) < 1e-6, `supportY (${r.resolver}) must match the legacy roof pick (${r.legacy})`);
      },
    },
  ],
};
