# Codex workflow

Read and follow the repository-root `AGENTS.md` and `STATUS.md` before editing.
They are the single source of truth for claims, shared-file coordination,
privacy, focused testing, signatures, and consolidation.

For Codex submissions:

1. Claim the exact files and behavior in `STATUS.md`.
2. Keep edits limited to that claim and record any shared-file touch.
3. Test only the changed behavior once, at the end.
4. End commits and `STATUS.md` entries with
   `Signed: Codex | GPT-5 | <low|medium|high>`.
5. When continuing an existing pull request, stay on its branch, push the
   focused commit, and update that draft PR instead of opening a duplicate.
