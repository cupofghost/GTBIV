# Agent 1 — RV2 Mama Rat Model and Animation

```text
Required model: gpt-5.6-sol
Required reasoning effort: high
Required branch: codex/rv2-mama-rat
Required base: commit 1abc365 or a descendant

Implement HANDOFF.md task RV2 — Final creature design.

START
1. Verify `git merge-base --is-ancestor 1abc365 HEAD` succeeds and the worktree
   starts clean. Stop if it does not.
2. Read AGENTS.md, STATUS.md, HANDOFF.md RV2, and only the relevant rat code.
3. Claim RV2 in STATUS.md using:
   Signed: Codex | GPT-5.6 | high
4. Stay inside the rat mesh/Mama Rat update sections, focused tests, and your
   STATUS row. Do not edit HANDOFF.md or CODEX/OP2_CONCURRENT/.

WORK
- Replace the placeholder rat appearance with a readable low-poly rat.
- Mama Rat needs two ears, readable eyes, an opening mouth/jaw, four feet, and
  proper body/tail proportions.
- Make her face Turbo while pursuing. Calibrate the mesh forward axis once and
  smoothly rotate horizontal yaw toward Turbo without terrain pitch or
  backward/sideways travel.
- Add coherent idle, walk, turn, lunge/bite, damage, and death animation.
- Match the bite animation to the real damage window.
- Preserve existing size, HP, speed, damage, spawn, sounds, payout, and
  one-at-a-time behavior.
- Keep swarm rats inexpensive. Fork makeMamaRatMesh() if a Mama rig would make
  every tiny swarm rat unnecessarily expensive.
- Expose animated joints through mesh.userData following js/person.js
  conventions.
- Keep all movement terrain-seated.

ACCEPTANCE
- Mama Rat remains exactly 3 × turboHeight().
- Eyes/mouth face Turbo from every pursuit direction.
- Feet animate in the direction of travel; she never slides backward.
- Idle, walk, turn, bite, damage, and death states clean up correctly.
- No gameplay/balance change outside RV2.
- Extend focused orientation/animation-state coverage.
- Run syntax and rat-vengeance tests once at the end.
- Capture front, side, pursuit, and bite screenshots for owner review.

FINISH
- Update your STATUS row with the exact result.
- Scan the diff for secrets/PII.
- Commit once with an imperative subject and:
  Signed: Codex | GPT-5.6 | high
- Push only the feature branch and open a draft PR if available; never merge.
- Report commit hash, touched files, tests, screenshots, uncertainties, and
  the consolidation check.
```

