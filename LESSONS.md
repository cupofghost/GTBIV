# Lessons Learned — Shared Knowledge Base

> **Format:** Date • Agent • Lesson • Action
>
> Update this weekly or after solving something hard. Help the next agent avoid the same wall.

---

## Sprint 1 (Aug 7–?)

### Claude Code
- **Date:** 2026-08-07
- **Lesson:** Preflight validation catches shared-file touches early, but don't edit STATUS.md directly in commits—leave space for Haiku to verify claims first.
- **Action:** Log shared-file touch entry, but let preflight pass before push.

---

## Sprint 2 (TBD)

_(Lessons logged after first sprint closes)_

---

## Timeless Lessons

_Things everyone should know:_

- Run `node tools/haiku-check.js` before every commit. It catches most discipline issues instantly.
- Commit message signatures are mechanical: `Signed: <program> | <model> | <effort>`. Typos fail preflight.
- One logical change per commit. A feature that spans 3 commits is 3 logical units. Git history should read like a story.
- If a test was passing before you touched it, keep it passing. Regressions are expensive to debug later.
- HANDOFF.md status updates (moving NEXT marker) happen AFTER tests green, not during development.

---

## How to Add a Lesson

1. Find the current sprint section
2. Add an entry with **Date** • **Lesson** • **Action**
3. Keep it short (2–3 sentences max)
4. If it's timeless (applies to everyone), add it to the bottom section
5. Commit with signature: `Signed: <program> | <model> | <effort>`

---

**Last Updated:** 2026-08-07 by Claude Code
