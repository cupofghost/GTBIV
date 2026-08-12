# VO — Turbo's 239 recorded lines: land them, then wire them

Single-agent dispatch packet, opened 2026-08-11.

Kimi delivered the voice batch commissioned by `KIMI_TURBO_VO.md`, and the
owner uploaded it to `main` as **`GTBIV_turbo_VO_batch_239lines.zip`**
(commit `dc345c6`, 7.9 MB). Right now it is a zip in the repo root: the game
cannot read a single line out of it, because every path the code would ask for
is inside the archive.

This packet does **not** move the authoritative `NEXT:` marker in `HANDOFF.md`
§10. It exists so whoever picks this up does not have to re-derive what is in
the archive or guess whether unpacking it is safe.

## Base

```bash
git fetch origin main
git checkout -b claude/turbo-vo-delivery origin/main
node tools/preflight.js --touching "voice/turbo/, index.html §VOICEOVER SYSTEM, tests/cases/voice-wiring.test.js"
```

| | |
|---|---|
| Branch | `claude/turbo-vo-delivery` |
| Model | Sonnet 5 for step 1 (mechanical, verified below). Opus 5 if the owner scopes step 3 |
| Effort | medium for steps 1–2; high for step 3 |
| Area | `voice/turbo/**`, `index.html` §VOICEOVER SYSTEM / `CUTSCENES`, `tests/cases/voice-wiring.test.js` |

## What is in the archive — already checked, don't redo it

Measured 2026-08-11 by unpacking to a scratch directory and comparing against
the working tree, file by file:

| | |
|---|---|
| mp3s in the zip | **391** |
| Already in the repo at the same path | **152** — and every one is **byte-identical** (`cmp` clean, 0 differ) |
| New | **239** — exactly the line count `KIMI_TURBO_VO.md` and `SCRIPT_TURBO_TTS.md` commissioned |
| In the repo but missing from the zip | **0** |

So unpacking is **purely additive**. It cannot overwrite Deb's shipped lines or
Turbo's intro narration — the locked material `SCRIPT.md` promised to preserve —
because the archive's copies of those files are the same bytes already on disk.
That was the one real risk in this task and it is retired.

The 239 new files land under `voice/turbo/{cutscenes,story,ambient}/…`, in the
directory-per-scene shape `KIMI_TURBO_VO.md` committed to.

## The job, in order

**1. Land the audio.** Extract into the repo so the paths resolve:

```bash
unzip -n GTBIV_turbo_VO_batch_239lines.zip -d .    # -n: never overwrite
git status --short | wc -l                          # expect 239 new files
```

Use `-n`. It should be a no-op for all 152 collisions; if `unzip` reports it
skipped anything you did not expect, stop and say so rather than forcing it.

**Then ask the owner before deleting `GTBIV_turbo_VO_batch_239lines.zip`.** It
is 7.9 MB of binary that every future clone pays for, and once the mp3s are
committed it is redundant — but removing a file the owner put there is theirs
to approve, and removing it from history is a separate, larger operation.

**2. Prove the delivery matches the commission.** `KIMI_TURBO_VO.md` lists all
239 lines with their target filenames, and says it was generated from
`SCRIPT_TURBO_TTS.md` so the two cannot drift. Verify that claim rather than
trusting it: parse the filenames out of `KIMI_TURBO_VO.md` and assert each one
exists on disk, and that nothing arrived that was not commissioned. Add it to
`tests/cases/voice-wiring.test.js`, which already asserts that every *wired*
mp3 resolves to a real file — this is the same check one step earlier, over the
manifest instead of the wiring.

A short report of anything missing, extra, or zero-length belongs in the PR.

**3. Wiring is a separate conversation.** Do not start it inside this card.

None of `SCRIPT*.md` is in the game: #47 landed the whole narrative as
documents — five chapters, six strands, 44 new cutscenes — and not one line of
it is in `CUTSCENES` or any bark table. Recording the audio does not change
that. Wiring even the spine means new cutscenes, new triggers, new state flags
and the Chapter 1 branch, which is a scoped project the owner has to shape, not
something to infer from the fact that the mp3s now exist.

Finish at "the audio is in the repo, and a test proves the manifest is
complete", then hand back.

## Acceptance

- 239 new mp3s committed under `voice/turbo/`, none of the existing 152 modified
  (`git diff --stat` on the collision set must be empty).
- A manifest case in `voice-wiring.test.js` that fails if a commissioned line is
  missing from disk.
- `cd tests && node run.js voice` green — that covers `voice-wiring` and
  `voice-mp3-only`.
- Full suite left to CI. Adding files that nothing references yet should not
  move anything else; if it does, that is a finding worth reporting.

## Do not

- Do not rename the delivered files to fit anything. The filenames in
  `KIMI_TURBO_VO.md` are the contract, and the wiring in step 3 will be written
  against them.
- Do not touch the 152 files already in the repo. They are shipped and approved.
- Do not wire lines into cutscenes or barks under this card (see step 3).
- Do not add a synthesis fallback for a line whose recording is missing. PV2
  removed all synthesized voice deliberately and `voice-mp3-only.test.js`
  asserts it stays gone; a missing recording should surface as a caption and a
  failing manifest test, not as a robot voice.

## Housekeeping

`AGENTS.md` §1 and §6: claim your row in `STATUS.md` **Active work** before you
start, sign every commit and STATUS row
(`Signed: <program> | <model> | <effort>`), and run the §7 consolidation check
at the end. This card does not touch `index.html`, so the code map is not in
play unless step 3 is scoped in later.

Signed: Claude Code | Opus 5 | high
