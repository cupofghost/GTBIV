# GTB IV — Test Suite

A headless regression suite, built so an agent (or a human) can verify a
change didn't break the game without doing a full manual playtest first.
It lives in its own folder specifically so it stays **outside** the game's
deploy — `index.html` doesn't reference anything here, and GitHub Pages
serving the repo root is unaffected. The zero-build golden rule in
`HANDOFF.md` §2 is about the *game*, not this tooling.

## What this is (and isn't)

This tests **state and logic**, not feel or visuals:
- Does the game boot with zero console errors?
- Do cutscenes play to completion and clean up after themselves?
- Do state-machine triggers (the debt, wanted stars, Chapter 1 story flags)
  fire under the right conditions and *not* fire under the wrong ones?
- Does save/restore round-trip everything it should?

It does **not** replace playtesting. It can't tell you a camera angle
looks bad, a control feels sluggish, or a cutscene shot is badly framed —
that's still the manual [Verification Checklist](../HANDOFF.md#9-verification--definition-of-done)
in `HANDOFF.md` §9. Run both: this suite before you're confident nothing
*broke*, a real playtest before you're confident it *feels right*.

## Running it

```bash
cd tests
npm install     # only needed once, or if playwright isn't already available
node run.js
```

If you're in this project's Claude Code sandbox, `npm install` isn't even
required — `helpers.js` falls back to the globally-installed Playwright at
`/opt/node22/lib/node_modules/playwright` and auto-detects the Chromium
build under `PLAYWRIGHT_BROWSERS_PATH`. Elsewhere, `npm install` fetches
Playwright normally.

Run a subset by filename substring:

```bash
node run.js cutscenes     # only tests/cases/cutscenes.test.js
node run.js chapter1      # only tests/cases/chapter1-story.test.js
```

The runner starts its own static file server on a free port (no need to
`python3 -m http.server` first), launches one shared headless Chromium,
and gives each test case a fresh page/context. Exit code is `0` if
everything passed, `1` otherwise — safe to gate on in a script or CI.

## Writing a new test case

Add a file to `tests/cases/*.test.js` exporting either a single
`{name, run}` object or `{cases: [...]}` for a group of related checks:

```js
module.exports = {
  cases: [
    {
      name: 'describe the one thing this checks',
      query: '?dev=1&skipintro=1',   // optional, this is the default
      run: async (page, { assert, assertEqual }) => {
        const result = await page.evaluate(() => G.story.debt);
        assert(result === 800, 'expected the debt to be $800, got ' + result);
      },
    },
  ],
};
```

A few things worth knowing before you write one:

- **Everything in the game is a global.** `index.html` is one non-module
  `<script>`, so `page.evaluate(() => G.money)` just works — no exported
  test hooks needed, no module boundary to punch through.
- **Headless `requestAnimationFrame` is slow and inconsistent.** Don't
  `page.waitForTimeout()` and hope a cutscene or timer finished — step the
  relevant `update*` function directly with a fixed `dt` in a tight loop
  instead (see `playCutsceneToEnd()` in `helpers.js`, or the manual
  `while(activeCutscene){ updateCutscene(0.02); }` pattern used in several
  test cases). This is the single most important pattern in this suite.
- **Any console/page error auto-fails the test**, even if your assertions
  all pass — a case doesn't need to assert "no errors" itself.
- **Drive state directly rather than simulating input.** Setting
  `player.x`/`G.story.pizzaHeat`/etc. and calling the relevant `update*`
  or trigger function is faster and far less flaky than trying to walk the
  player there via synthetic touch/keyboard events. Reserve real input
  simulation for tests specifically about input handling.

## Layout

| File | Purpose |
| --- | --- |
| `run.js` | Discovers and runs `cases/*.test.js`, prints a pass/fail summary, sets the exit code |
| `helpers.js` | Static server, browser/page launch, the cutscene fast-forward helper |
| `cases/boot.test.js` | Boots the game both ways (dev-skip and plain), checks the dev panel |
| `cases/cutscenes.test.js` | Every `CUTSCENES` entry plays to completion and cleans up |
| `cases/chapter1-story.test.js` | The Chapter 1 state machine: `first_score`, `pizza_warning`, the Hardcastle hook, pizza-heat, and their guards |
| `cases/save-restore.test.js` | Save/restore round-trips every `G.story` field; corrupt/absent saves fall back cleanly; no per-frame writes |
| `cases/regression.test.js` | Shallow sweep of missions, wanted/star escalation, and the pizza-jack mechanic |
| `cases/soundtrack.test.js` | Synthwave radio: all 12 songs (and their hot/calm loop variants) are well-formed, every song + variant on the dial schedules cleanly through the FX rack, the wanted-level "heat" layer boosts energy without breaking the clamp, and the hot-loop state machine switches in under sustained heat and freezes/resumes the arrangement correctly |

When you add a real feature, add or extend a case in the same pass —
treat this the way the codebase already treats `HANDOFF.md`'s
Verification Checklist: part of "done," not an afterthought.
