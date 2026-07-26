# Agent 4 — OP2-C/D Melee, Shadows, and Footsteps

```text
Required model: gpt-5.6-sol
Required reasoning effort: xhigh
Required branch: codex/op2-melee-grounding
Required base: commit 1abc365 or a descendant
Required delivery: two sequential commits (OP2-C, then OP2-D)

START
1. Verify `git merge-base --is-ancestor 1abc365 HEAD` succeeds and the worktree
   starts clean. Stop if it does not.
2. Read AGENTS.md, STATUS.md, HANDOFF.md OP2-C/OP2-D, js/person.js, then only
   relevant melee, updateFoot, person-shadow, lifecycle, and audio code.
3. Claim OP2-C and OP2-D in STATUS.md using:
   Signed: Codex | GPT-5.6 | high
4. Do not edit vehicles, roads, rats, Cinema routes, Turbo Mode, HANDOFF.md, or
   CODEX/OP2_CONCURRENT/.

COMMIT 1 — OP2-C MELEE RELIABILITY
- Reproduce punch/kick lockout during long mixed play.
- Exercise repeated/held attacks, vehicle transitions, pause, stun, respawn,
  Cinema, and interrupted specials.
- Fix the owning state/timer/input-reset invariant; do not hide it with a
  watchdog.
- Every attack must return to neutral when completed or interrupted.
- Keep hit windows synchronized with visible poses.

At the charged planted kick's peak:
- one support leg is straight/vertical with its foot planted on groundH;
- pelvis and torso stay roughly at waist height;
- torso is straight, face-down, and horizontal;
- both arms extend straight forward;
- the other leg extends straight backward;
- Turbo reads like he is lying flat on his stomach in midair while supported
  by the single vertical leg;
- nothing except the planted foot enters terrain;
- do not move/shrink the collision root to fake the pose.

Blend into/out of the silhouette without snapping or root teleportation.

COMMIT 1 ACCEPTANCE
- At least 100 mixed attacks without lockout.
- Punch, kick, charged punch, and charged kick survive every interruption.
- Pose follows slopes without burying Turbo.
- Visible strike and hit geometry agree.
- Extend charged-melee coverage and capture side/front screenshots.
- Run syntax and focused melee tests once at the end of this commit.

COMMIT 2 — OP2-D SHADOWS AND FOOTSTEPS
- Person shadows remain horizontal ground projections.
- Stop child shadows rotating vertically when an actor falls.
- Upright: compact foot/torso ellipse.
- Knockdown/death: ease over roughly 0.15–0.25s into a longer body-shaped
  shadow under the fallen actor.
- Reverse the transition on recovery.
- Keep shadows at groundH plus a tiny offset.
- Cover Turbo, pedestrians, jocks, foot cops, and applicable staged actors.
- Hide/dispose shadows with pooled or removed actors.
- Keep cheap blob shadows; do not introduce real-time shadow maps.

Footsteps:
- Drive Turbo's steps from actual left/right gait-phase crossings.
- Add restrained alternating asphalt/concrete, grass, sand, and roof/interior
  variants plus a separate landing thump.
- Cadence follows walk/run/sprint.
- Adjust weight/pitch subtly for speed and scale.
- Silence while airborne, idle, stunned, paused, attacking without foot
  motion, in vehicles, replaying, or in cutscenes.
- Use the existing SFX bus/audio-unlock path.
- Cap overlap so skipped frames cannot emit several steps together.

COMMIT 2 ACCEPTANCE
- No person shadow becomes vertical, floats, or survives actor removal.
- Fallen actors receive a horizontal body shadow; recovery restores upright.
- One alternating step occurs per planted stride with no idle/airborne spam.
- Surface variants remain coherent; landing has weight.
- Add focused lifecycle/cadence coverage.
- Run syntax, sprint, relevant lifecycle, and new focused tests once.
- Footstep quality requires an owner listening pass; automated tests cannot
  claim final sound approval.

FINISH
- Update your STATUS row with exact results for both commits.
- Scan both diffs for secrets/PII.
- Make two imperative commits, each ending:
  Signed: Codex | GPT-5.6 | high
- Push only the feature branch and open a draft PR if available; never merge.
- Report both hashes, touched files, tests, screenshots/audio notes,
  uncertainties, and the consolidation check.
```
