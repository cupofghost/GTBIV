# Unified Agent Workflow (v1.1 — 2026-07-23)

These rules apply to every AI agent (Claude, Codex, Kimi, Gemini, or other) working in this repo.
The owner is not a coder. Be efficient, be brief, and never assume another agent's work is broken.

## 0. Facts you would otherwise spend tokens grepping for
Every one of these has cost a past session a search. Trust this table over any
figure quoted elsewhere in the docs — the older markdown has stale numbers in it.

| Thing | Answer |
|---|---|
| Size of `index.html` | ~11,850 lines / ~565 KB. The game's `<script>` starts at line 715. It never fits in context — grep for a banner, then read a window. |
| Navigating `index.html` | Section banners are `// ====== NAME ======` at column 0. The `// CODE MAP` block near the top indexes them. |
| Regenerating the code map | `node tools/codemap.js --write`. Never hand-edit the line numbers. `node tools/codemap.js` alone checks for drift and exits 1. |
| Test suite size | 207 cases across 44 files (`tests/cases/*.test.js`). Docs quoting 36/43/53/70/77/198 are historical — ignore them. |
| Running tests | See §4a below. Do not default to the full suite. |
| CI | `.github/workflows/ci.yml` — syntax check + full suite on every PR and push to main. |
| Dev URL flags | `?dev=1` (dev panel), `?skipintro=1`, `?seed=<n>` (deterministic RNG — use this to reproduce a flaky test), `?scene=<name>`, `?cutscene=<id>`, `?mode=car\|heli`. |
| Test viewport | 800×390 (phone landscape) — the project's testing convention. |
| Serving the game locally | `python3 -m http.server 8099`, or just let `tests/run.js` do it (it starts its own server on a free port). |
| Character model viewer | `viewer.html` — turntable dev tool for the `js/person.js` rig. |
| `CODEX/` and `DISPATCH/` | Completed historical dispatch packets. Do not read unless you are resuming that exact task. |

## 1. Start of every session (do this first, cheaply)
1. Read this file and `STATUS.md`. Do NOT read the whole repo.
2. Read only the files relevant to your task.
3. Claim your work: add one line to the **Active work** table in `STATUS.md`
   (area, task, agent signature, date). If your area is already claimed by
   another agent with a recent date, pick a different task or tell the owner.

## 2. Work rules
- Stay inside your claimed area. Do not edit files outside it.
- If you MUST touch a shared file (config, main entry point, shared utilities),
  make the smallest possible change and flag it in `STATUS.md` under **Shared-file touches**.
- Keep code modular: each feature/module should run and be understandable on its own,
  with minimal imports from other areas.
- Do not refactor, reformat, or "improve" code you weren't asked to change. That wastes
  tokens and creates conflicts.

## 3. Privacy & secrets (treat this repo as PUBLIC)
- NEVER commit the owner's personal identifiable information: no real names, no email
  addresses, no phone numbers, no addresses, no usernames from other platforms.
- NEVER commit credentials of any kind: API keys, private keys, tokens, passwords,
  connection strings. Use placeholder values (e.g. `YOUR_API_KEY`) and tell the owner
  where the real value goes (environment variable or a file listed in `.gitignore`).
- Refer to the owner only as "the owner" in code, comments, commits, and docs.
- If you find PII or a secret already committed, do NOT delete it silently — flag it to
  the owner immediately (removing it properly requires cleaning git history).
- Before every commit, scan your changes for anything matching the above.

## 4. Testing rule (token saver)
- **Treat main as working.** A signed commit is proof the work was already verified by its
  author at the stated effort level. NEVER re-verify, re-test, re-read, or "sanity check"
  other agents' signed work. If you didn't change it, you don't test it.
- Test ONLY what you changed, once, at the end of your work.
- Do NOT re-run full test suites or re-verify other agents' work unless the owner asks
  or your change directly touches their code.

### 4a. Which test tier to run (read this before running anything)
CI already runs the full suite on every PR and every push to main
(`.github/workflows/ci.yml`). Running it locally too is duplicate spend — about
20 minutes of wall clock and a 200-line transcript. Default to tiers 0–2 and let
CI own tier 3.

| Tier | Command | Cost | When |
|---|---|---|---|
| 0 | `node tests/syntax-check.js` | ~2s | After every edit. Catches typos in the inline `<script>` before anything expensive. |
| 1 | `cd tests && node run.js smoke` | ~20s | The game still boots with no console errors (matches 2 files). |
| 2 | `cd tests && node run.js <substring>` | 30–90s | The case files covering what you touched. Substring matches the filename. |
| 3 | `cd tests && node run.js` | ~20 min | Only when the owner asks, or you changed something genuinely cross-cutting. Run it alone — two Playwright suites in parallel starve each other and produce spurious failures. |

`run.js` runs tier 0 itself before it launches a browser, so you never need both.
- If a test you didn't write fails and it's unrelated to your change, log it in
  `STATUS.md` under **Known issues** and move on. Do not fix it unasked.

## 5. Signature (required on every submission)
Every commit message AND every `STATUS.md` entry ends with a signature:

    Signed: <program> | <model> | <effort>

- program: e.g. Claude Code, Claude app, Codex, Kimi CLI, Gemini
- model: e.g. Opus 4.8, Sonnet 4.6, K2, Gemini 2.5 Pro
- effort: low / medium / high (how carefully this was done and tested)

Example: `Signed: Claude Code | Opus 4.8 | high`

## 6. End of every session
1. Update your line in `STATUS.md`: mark done or describe the handoff state in ≤3 lines.
2. Commit with a short message (one line what, one line why) plus your signature.
3. Run the **consolidation check** below and report the result to the owner in one sentence.

## 7. Consolidation check (tell the owner!)
Recommend a consolidation session if ANY of these is true:
- 2+ agents have touched the same shared file since the last consolidation.
- 8+ entries have been added to **Active work** since the last consolidation.
- Anything sits in **Known issues** older than 2 weeks.
- Two entries in `STATUS.md` describe overlapping or conflicting work.

Say exactly one of:
- "No consolidation needed yet."
- "Consolidation recommended: <one-line reason>."

## 8. Consolidation sessions (one focused chat, occasionally)
When the owner starts a chat with "run consolidation":
1. Read `STATUS.md` fully and skim recent commit messages.
2. Resolve conflicts, merge duplicate work, verify shared files are coherent.
3. Archive completed entries: move them from **Active work** to the bottom of
   `STATUS.md` under **Archive**, keeping only the one-line summary + signature.
4. Reset the consolidation counter by adding a line: `Last consolidation: <date> — Signed: ...`
5. Ask the owner before deleting anything or changing behavior of working code.
6. Also scan for accidentally committed PII or secrets (section 3) and report findings.

## 9. Token-efficiency rules (all agents, always)
- Short replies to the owner: what you did, what's next, consolidation check. No essays.
- Never re-read or re-print whole files into chat when a filename + line reference will do.
- Never rewrite a file to change one section.
- Keep `STATUS.md` under ~100 lines by archiving during consolidation.
- Ask before doing anything expensive (large refactor, full test run, dependency changes).
