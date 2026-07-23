# CLAUDE.md — read this first, every session

This file is auto-loaded into every Claude Code session. It exists to make a few
rules **automatic** so no chat has to be told them again.

## Start here
**Read `AGENTS.md` before doing anything** — it's mission control: the agent
roster, the handoff protocol, the live task board, and the full golden rules.
Then `GAME_PLAN.md` (strategy) and the relevant slice of `HANDOFF.md` (code).
Art work: `ASSETS.md`.

## The always-on rules (do these without being asked)

1. **Open a PR to `main` after every improvement — automatically — then
   squash-merge it yourself once it's mergeable.** The moment a unit of work is
   committed and green (`cd tests && node run.js`), open a pull request to
   `main` (or push onto the branch of the PR already open for this task). One
   improvement → one PR. Required approvals are 0 and there's no CI configured
   to wait on, so nothing blocks you from merging your own PR the moment it's
   current with `main`. Full rule + GitHub settings: `AGENTS.md §2` rule 4 and
   `AGENTS.md §2.1`.

2. **Push ASAP so other agents have current info.** The repo is the message bus.
   Push the instant a change is committed and green — don't hoard local commits.
   Other sessions read the *pushed* branch/PR for the latest state. `AGENTS.md §2`
   rule 7.

3. **End every task with the human wrap-up to Austin** — what was delivered +
   next steps + the PR link — kept separate from the `HANDOFF.md`/board trace
   (that one's for the next agent). Format: `AGENTS.md §7`.

## The hard constraints (never break)
Self-contained, zero-build, Three.js vendored at r128, assets are committed
files at relative paths, mobile-first 60fps, playable at every commit, suite
green before every commit. Detail in `AGENTS.md §2` and `HANDOFF.md §2`.
