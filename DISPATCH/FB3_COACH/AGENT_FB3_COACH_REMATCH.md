# Agent — FB3: "Old Scores" → "Rematch" (the Coach mission)

**Model:** Opus 5 · **Effort:** high · **Branch:** `claude/fb3-coach-rematch`
**Card:** `HANDOFF.md` §8 → FB3 (`P1 · Risk: Med`, `OPEN`) — the standing
`NEXT:` marker at `HANDOFF.md` §10.
**Signature:** `Signed: Claude Code | Opus 5 | high`

## What this is

The dramatic payoff of Turbo's backstory: he tracks down Coach Gary Grimsby
and settles a decade-old grudge with his fists. It is **two linked missions**,
not one — `Old Scores` (get to the field through a jock warm-up) leading
straight into `Rematch` (the boss fight). Both are specced in
`FOOTBALL_STRAND.md` §4.

This is a **story/side mission**: one-shot, triggered by proximity, not part
of the repeating `startMission()` rotation.

## Read first

- `AGENTS.md` (workflow, signatures), then `STATUS.md` — **claim your row
  before you start**, and escape the pipes in your signature as `\|` or the
  table breaks.
- **`FOOTBALL_STRAND.md` is the implementation contract**, specifically
  §4 (mission specs), §6 (cutscene scripts — `coach_rematch_intro` at
  line 313, `coach_defeat` at line 343), §7 (bark packs), §8 (engineering
  flags). `STORY_BIBLE.md` has an older, shorter worked example of the same
  material — **keep it as background, not as the spec, where the two differ.**
  `HANDOFF.md` §8's FB3 card says this explicitly.
- `CHARACTERS.md` for Coach's voice; `FOOTBALL_STRAND.md` §1 has his full
  character sheet.

### ⚠️ Trap: FOOTBALL_STRAND.md's internal cross-references are wrong

The §4 mission specs cite "(§5)" for dialogue hooks — `jock_street_taunt`,
`jock_fight`, `coach_taunt`, `coach_defeat`. Those packs are actually in
**§7 (Bark packs, line 425+)**. §5 is the Turbo Bowl minigame. The document's
internal numbering drifted when it was expanded and nobody resynced the
pointers. Follow the pack **names**, not the section numbers. Don't "fix" the
numbering as a side quest — flag it in `STATUS.md` under Known issues if you
want it recorded.

## Where it goes in the code

Build it as a new self-contained section in `index.html`, banner-delimited like
every other system, placed after `FOOTBALL RIVALS: CHAOS HIGH JOCKS`. Add the
banner to the `// CODE MAP` block — and regenerate the ranges from the banners
rather than hand-counting (see `STATUS.md` → Shared-file touches).

Existing anchors you will build against (line numbers drift — grep the banner):

| What | Where |
| --- | --- |
| Wildcats Field landmark (`FOOTBALL`, has `.x`/`.z`) | §FOOTBALL FIELD ~2622; the park is picked at ~1739 |
| Jock faction — `spawnJock(x,z)`, `JOCK_TEAMS`, jock AI | §FOOTBALL RIVALS ~4075 |
| Closest existing model for a staged, triggered encounter | §PIZZA WARS MISSION ~4561 (`spawnGuards`/`updateGuards`/`checkHeistTriggers`) |
| Proximity story trigger pattern | `spawnDeb` ~9730, `updateStory(dt)` ~9745 |
| Cutscene system — `CUTSCENES` table ~9933, `playCutscene(id, anchorX, anchorZ, onDone)` ~10002 | §CUTSCENE SYSTEM ~9930 |
| Melee you must reuse — `doPunch(heavy,kicking)` ~7871, `endMelee()` ~7781, `knockPed(ped,byCar)` ~7947 | §WEAPONS ~6168 |
| Save blob | §SAVE SYSTEM ~11232 |

### `G.coachBeaten` already exists

It is already written to and read from the save blob (`index.html` ~11238 and
~11260) — **nothing currently sets it.** That is your unlock flag; wire it, do
not redefine it or add a parallel flag. It gates FB4.

## Approach

1. **Old Scores.** Reaching the field starts a bounded warm-up against
   existing Alumni Wildcat jocks — reuse `spawnJock`, don't build a new
   faction. "Bounded" means it ends on its own; don't leave the player in an
   endless brawl if they wander off. Jock taunts come from the
   `jock_street_taunt` / `jock_fight` packs.
2. **`coach_rematch_intro`.** Real cutscene through `playCutscene`, anchored
   at the field sideline. Script is `FOOTBALL_STRAND.md` §6 line 313.
3. **Rematch.** Fists-only against a single named high-HP Coach ped. The
   Alumni Wildcats watch but **do not** join in. Coach fights back and keeps
   "coaching" Turbo mid-fight — bark thresholds off `coach_taunt`.
4. **Coach yields, he does not die.** He needs a yield state distinct from the
   normal ped death/ragdoll flow in `knockPed`. This is the one genuinely new
   pattern in the task, and it is small — do not let it turn into a general
   boss framework.
5. **A Turbo loss is a soft retry at the field** — *not* the BUSTED/WASTED
   story-fail flow. Losing to Coach should feel like losing a scrimmage.
6. **On winning:** play `coach_defeat` (§6 line 343), set and save
   `G.coachBeaten`, and make ambient jocks non-hostile from then on.

## Scope fence

- **Do NOT build FB4 / Turbo Bowl.** It is the one item on
  `FOOTBALL_STRAND.md` §8's list that needs the owner's explicit go-ahead, and
  it has not been given. Setting the unlock flag is the end of your job.
- Fists-only is a *mission rule*, not a global one — don't disable weapons
  anywhere else.
- No cop/wanted interaction at all. This strand never touches the cops.
- No cash reward.
- Don't touch `groundH` or anything terrain-seated. Read `TERRAIN.md`'s Tier 1
  revision note if you think you need to; you almost certainly don't. Seat
  Coach and any staged actor via `groundH` like every other static.

## Acceptance

Straight from the card — all six must hold:

1. Triggers once.
2. Plays a real cutscene (both of them, through the real cutscene system).
3. Resolves to a clear win state.
4. Sets `G.coachBeaten`.
5. Persists across a reload.
6. Does not re-trigger after being beaten.

Plus: a Turbo loss soft-retries rather than wasting him, and ambient jocks go
non-hostile afterward.

## Testing

Add `tests/cases/fb3-coach.test.js` following the existing case style. Cover
each acceptance point above — trigger-once, both cutscenes completing and
cleaning up, the yield state, the soft retry, the flag surviving a
save/restore round-trip, and no re-trigger.

Run `node tests/syntax-check.js` while you work (~25ms), then the full suite
once at the end: `cd tests && node run.js`. Baseline is **198 cases** across
43 files.

**Two things about the suite, so you don't chase ghosts:**
- Run it **alone**. Two Playwright suites in parallel starve each other and
  produce spurious failures — `new-features.test.js`'s rotor-chop case failed
  exactly this way on 2026-07-24 and passed 5/5 once run uncontended.
- `save-restore.test.js` (and later files in a long run) sometimes time out in
  the local headless Chromium with GPU stall warnings, and
  `shadow-footsteps.test.js`'s audio case failed once at the tail of a full run
  on 2026-07-28. Both are logged in `STATUS.md` → Known issues as
  environmental. Re-run the file on its own before treating either as a real
  break.

Per `AGENTS.md` §4: test what you changed. Don't re-verify other agents' signed
work.

## Finishing

1. Update your `STATUS.md` row (done, or a ≤3-line handoff state).
2. Commit with a one-line what + one-line why + your signature.
3. Run the `AGENTS.md` §7 consolidation check and report the one-sentence
   result to the owner.
4. **Re-fetch `main` before you open the PR.** This repo moves fast — several
   PRs can land while you work, and a branch cut hours ago can go stale enough
   that merging it would revert other people's work. Merge `main` into your
   branch and re-run the suite before you ask for the merge.
