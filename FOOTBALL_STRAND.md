# GTB IV — Side Strand: "Grudge Season" (Turbo's Football Redemption)

> Companion to `STORY_BIBLE.md` (follow its canon/voice/templates) and
> `CHAPTER1.md` (same conventions). This is a **new, self-contained side
> strand** — per `STORY_BIBLE.md` §7.2, side strands run parallel to the
> $800 debt spine and don't need to touch it. Built from Turbo's promo
> monologue (reproduced below) — a gift of an unreliable-narrator backstory
> that the whole strand is designed to dramatize, not just reference.
> Text only — no code. Engineering scope flagged in §7.

---

## 0. Source material (canonize this)

Turbo's own words, from the promo — kept here as the anchor text for his
voice on this subject. He is not a reliable narrator; the strand's comedy
comes from what he leaves out.

> *"Back in high school, I was the greatest football player anybody had
> ever seen. Fast, strong, handsome. The cheerleaders all wanted to date
> me. Every single one of them. But my dad wouldn't let me because of
> church... Then, out of nowhere, I got banned from the locker room for
> no reason... So I had to quit the team... Now I'm eating hotdogs three
> times a day... One day I'll get back on my feet. I'll rebuild my life.
> I'll make things right with Deb so she'll leave me the F alone. Just
> got to get creative."*

**What actually happened (the joke is the gap between this and what he
just told you):** Turbo picked a fight with the team's star quarterback,
**Danny Kowalski**, over a Gatorade — challenged him to a "wrestling
match" to settle it, and dislocated Danny's knee. Coach banned him from
the team and the locker room on the spot. Turbo has spent twenty years
calling this "no reason."

His dad really did forbid him from dating cheerleaders — that part's true.
Turbo just leaves out that it was one rule among many, and that he broke
most of the others anyway.

---

## 1. New character sheets

### Coach Gary Grimsby
```
NAME: Gary Grimsby ("Coach Grim")   ROLE: obstacle → grudging ally
One-line: Turbo's old high-school football coach, still running the field
  like it's varsity twenty years later, still furious about the Gatorade
  incident.
Voice: Barks everything like a drill sergeant — including compliments.
  Coaches you while he's hitting you.
  Sample: "That's the same sloppy footwork that cost you the season!"
Wants / Deadline: Order on his field, and an apology he will never
  actually accept even if Turbo gives it. No hard deadline — he's been
  running this grudge at full intensity for two decades.
Relationship to Turbo: Banned him from the team after the Danny Kowalski
  incident. Still keeps Turbo's name on a literal, physical clipboard he
  calls "The List."
First appearance: `coach_rematch_intro` cutscene, Wildcats Field.
Arc / payoff: loses a fistfight to Turbo (the Rematch mission), grudgingly
  lets him back on the field — respect without warmth. Locker room stays
  off-limits regardless.
Gags: coaches everyone, including active enemies, mid-fight; treats a
  twenty-year-cold grudge with the exact intensity of a live championship
  game.
```

### Reverend Cornelius Jones — "Dad" / "Pop"
```
NAME: Reverend Cornelius Jones      ROLE: recurring obstacle / color
One-line: Turbo's father, a small-town pastor who has never once updated
  his mental image of Turbo as a teenage boy who can't be trusted alone
  with girls.
Voice: Booms like he's mid-sermon at all times, even for small talk.
  Genuinely earnest, not performative — that's what makes it funny, not
  the volume.
  Sample: "TURBO JONES! You get AWAY from those young women this
  instant! We have discussed this!"
Wants / Deadline: For Turbo to "live right." No deadline — a lifelong
  project he has visibly not given up on.
Relationship to Turbo: Loving, suffocating, still enforcing house rules on
  a 34-year-old ex-con. The teenage dating ban from the monologue is,
  apparently, still active policy.
First appearance: `turbo_bowl_payoff` cutscene, interrupting Turbo's
  moment with the cheer squad.
Arc / payoff: a running gag to carry into future chapters — he shows up to
  torpedo Turbo's good moments specifically, out of love, not malice. A
  real beat between them is a later-chapter idea, not this pass.
Gags: treats every interaction like it's happening at church; refers to
  "the Lord" like a surveillance system that reports directly to him.
```

### The Alumni Wildcats (jock archetype)
```
NAME: The Alumni Wildcats             ROLE: obstacle (roaming street faction)
One-line: Turbo's grown-up former teammates, still loyal to Coach, still
  mad about Danny's knee, now roaming San Chaos looking for the guy who
  ended their championship run.
Voice: Cocky ex-jock energy, half taunting and half genuinely still hurt
  about Danny. Louder and dumber than the Chaos Pizza goons — slapstick,
  not menacing.
Wants: to rough Turbo up on Coach's behalf; secretly want the old team
  back together.
Relationship to Turbo: hostile on sight until Rematch is won, then
  downgrades to grudging, still-teasing acceptance.
First appearance: ambient street encounters once the strand is live —
  concentrated near Wildcats Field, occasional stragglers elsewhere.
Arc / payoff: flip from a fightable street faction to background color
  (and eventually Turbo Bowl's opposing defenders) after Rematch.
Gags: still wear varsity jackets that don't fit anymore; recite old plays
  from memory, unprompted, mid-conversation.
```

### The San Chaos Wildcats Cheer Squad
```
NAME: The Wildcats Cheer Squad         ROLE: color
One-line: The current cheer squad, who adopt Turbo as an unlikely local
  legend the moment he wins a Turbo Bowl.
Voice: light, gossipy, mostly unbothered by the general chaos of San
  Chaos. Captain **Amber** gets the one named line, in `turbo_bowl_payoff`.
Wants: something to talk about.
Relationship to Turbo: indifferent → mildly impressed after a win →
  immediately scattered by Dad.
First appearance: `turbo_bowl_payoff` cutscene.
Gags: treat Coach's whistle with more reverence than Coach does.
```

---

## 2. New location sheet

```
LOCATION: San Chaos Wildcats Field     DISTRICT: outskirts, near the old
  high school
Vibe: A faded but stubbornly maintained football field — one good
  scoreboard bulb out of six, a championship banner from a year Coach
  will not stop bringing up.
What the player does here: ambient Alumni Wildcats encounters
  (pre-Rematch); the Old Scores → Rematch mission chain; the Turbo Bowl
  minigame afterward (replayable).
Story hooks: Coach's home turf. Danny Kowalski's name comes up here —
  flagged as a good future hook (a possible appearance/forgiveness beat
  in a later chapter, not this pass).
Gags/landmarks: Turbo's own retired jersey hangs upside-down "as a
  warning to others"; the snack shack sells nothing but hot dogs — a
  quiet callback to the promo monologue's prison complaint.
```

---

## 3. How the strand plays (verb-mapped)

Per `STORY_BIBLE.md` §8's mission-mechanics contract — mapped to existing
player verbs wherever possible, new mechanics flagged explicitly in §7.

1. **Ambient jock encounters** — Alumni Wildcats roam near the field and
   pick fights on sight (reuses **punch/gun combat**, a **new roaming
   hostile faction** structurally similar to `gangMembers`).
2. **Old Scores** — a fetch/approach mission that leads Turbo to the
   field, fighting through jocks on the way (reuses **punch**, **walk/run**,
   the **proximity-trigger** pattern already used for Deb/stores).
3. **Rematch** — a scripted 1-on-1 fistfight against Coach, a **named boss
   ped** (new pattern — see §7).
4. **Turbo Bowl** — the unlockable minigame (the one real new mode — see §7).

---

## 4. Mission specs

```
MISSION: Old Scores                CHAPTER: side strand "Grudge Season"
Logline: Turbo tracks down his old coach to settle a decade-old grudge
  over a wrestling match that ended his football career.
Given by: organic discovery — an Alumni Wildcat's street taunt names
  Coach and the field.
Trigger: player follows the lead to San Chaos Wildcats Field.
Archetype: custom proximity encounter (same pattern as `spawnDeb` — no
  new mechanic beyond the roaming jock faction noted above).
Setup cutscene: none — the jock taunt pack (§5) is the hook.
OBJECTIVE: reach the field, fighting off Alumni Wildcats who jump Turbo
  as a "warm-up" before Coach will see him.
Escalation / complication: jocks gang up 2-on-1.
Fail states: wasted (existing busted/wasted flow, unchanged).
Reward: none directly — pure setup for Rematch.
Wanted impact: none — this never touches the cops.
Dialogue hooks: `jock_street_taunt`, `jock_fight` (§5).
Payoff cutscene: leads straight into `coach_rematch_intro`.
Ties to spine: parallel strand, independent of the $800 debt — pure
  character payoff.
```

```
MISSION: Rematch                    CHAPTER: side strand "Grudge Season"
Logline: Beat Coach Grimsby in a fistfight and get off The List for good.
Given by: Coach, at the end of `coach_rematch_intro`.
Trigger: automatic, once that cutscene ends.
Archetype: custom boss fight (see §7 — reuses punch combat against a
  single named high-HP ped with scripted bark thresholds and a "yield"
  state instead of a death state).
Setup cutscene: `coach_rematch_intro`.
OBJECTIVE: fists only, house rules (no guns — the Alumni Wildcats watch
  but don't jump in). Take Coach's HP to zero.
Escalation / complication: Coach actually fights back and keeps
  "coaching" Turbo mid-fight (§5 `coach_taunt`).
Fail states: Turbo goes down first — this should be a **soft retry**, not
  a busted/wasted-style story fail (flag in §7).
Reward: no cash — unlocks Turbo Bowl; Alumni Wildcats stop being hostile
  afterward and become ambient color / Turbo Bowl opponents.
Wanted impact: none — entirely off the cops' radar.
Dialogue hooks: `coach_taunt`, `coach_defeat` (§5).
Payoff cutscene: `coach_defeat`.
Ties to spine: parallel payoff to the Deb strand — both are Turbo trying,
  badly, to fix something he broke.
```

---

## 5. Cutscene scripts

```
CUTSCENE: coach_rematch_intro — LOCATION: Wildcats Field, sideline — TIME: day
[Trigger: player reaches the field after Old Scores]

SHOT 1 — WIDE, 2.6s, push in across the field; sprinklers running, a
  faded championship banner overhead.
  ACTION: Coach Grimsby stands mid-field in a whistle and tracksuit,
    exactly as intimidating as twenty years ago.

SHOT 2 — CLOSE on Coach, 3.4s, cut.
  COACH: "Jones. Heard you were out. Heard you were causing trouble.
    Figures."

SHOT 3 — MEDIUM two-shot, 3.6s.
  TURBO: "Twenty years, Coach. Twenty years I've been carrying this."

SHOT 4 — CLOSE on Coach, 3.8s, cut. (FX: whistle blast)
  COACH: "You body-slammed my quarterback over a Gatorade, Jones. You're
    not a victim. You're a liability with a grudge."

SHOT 5 — MEDIUM two-shot, 3.2s.
  TURBO: "...it was a really good Gatorade."

SHOT 6 — WIDE, 2.4s, fade. (FX: second whistle blast)
  ACTION: Coach blows the whistle; Alumni Wildcats form a loose ring
    around the field.
  COACH: "Rules haven't changed. You want back on my field, you go
    through me. Fists only. Let's go."
```

```
CUTSCENE: coach_defeat — LOCATION: Wildcats Field — TIME: day
[Trigger: Coach's HP hits zero in the Rematch fight]

SHOT 1 — CLOSE on Coach, winded, 2.8s, cut.
  COACH: "...huh. Still got it, Jones. Still stupid. But you got it."

SHOT 2 — MEDIUM two-shot, 3.4s.
  ACTION: Coach hauls Turbo up off the ground.
  COACH: "Fine. You're off The List. Field's open. Don't make me regret
    this."

SHOT 3 — WIDE, 2.2s, fade.
  ACTION: The Alumni Wildcats clap, unimpressed but done being hostile.
  TURBO: "Coach... does this mean I can use the locker room again?"
  COACH: "Absolutely not."
```

```
CUTSCENE: turbo_bowl_payoff — LOCATION: Wildcats Field — TIME: day
[Trigger: first Turbo Bowl win — see §7 for minigame scope]

SHOT 1 — WIDE, 2.4s, crowd noise, push in on Turbo spiking the ball.
  TURBO: "Still got it! Twenty years later, STILL GOT IT!"

SHOT 2 — MEDIUM, 2.8s, the Cheer Squad jogs over, led by Amber.
  AMBER: "Okay, that was actually kind of impressive."

SHOT 3 — CLOSE on Turbo, 2.0s, leaning in, grinning.
  TURBO: "Ladies, there's plenty of Turbo to go around—"

SHOT 4 — WIDE, 3.6s, hard cut, Dad storms across the field. (FX: shake)
  DAD: "TURBO JONES! You get AWAY from those young women this instant!
    We have discussed this!"

SHOT 5 — CLOSE on Turbo, 3.2s, deflating instantly.
  TURBO: "...Dad, I'm thirty-four."
  DAD: "I don't care if you're ninety-four — put some space between
    you and the pom-poms!"

SHOT 6 — WIDE pull-up, 2.0s, fade out.
  ACTION: The Cheer Squad scatters, laughing. Turbo, alone, picks the
    football back up.
  TURBO: "...worth it. Still worth it."
```

---

## 6. Bark packs

```
PACK: jock_street_taunt (Alumni Wildcats, roaming encounters pre-Rematch)
- "Hey, it's Fumble Jones!"
- "Coach still talks about what you did to Danny's knee, man."
- "You still owe this team an apology. And a knee replacement."
- "Nice bus pass, star player."
- "Heard you're back. Heard nobody cares."
- "You get banned from the locker room AND the whole city? Impressive."
(tone note: cocky ex-jock energy — half taunt, half genuinely still mad
  about Danny)
```

```
PACK: jock_fight (during a street scuffle with jocks, pre-Rematch)
- "This is for Danny's knee!"
- "You're not even wearing pads, this is EASY!"
- "Coach said if I see you, I hit you. Simple as that."
- "Should've stayed inside, Jones!"
(tone note: aggressive but dumb-jock energy — slapstick, not menacing
  like the Chaos Pizza goons)
```

```
PACK: jock_post_rematch (ambient, after Turbo beats Coach)
- "...respect, man. Actual respect."
- "Coach never lost a fistfight before. You broke something sacred."
- "You're still banned from the group chat, though."
(tone note: grudging warmth — a comic downgrade of hostility, not full
  reconciliation)
```

```
PACK: coach_taunt (during the Rematch fight itself)
- "PICK UP YOUR FEET, JONES!"
- "That's the same sloppy footwork that cost you the season!"
- "I've benched better hits than that!"
- "You call that a punch? I've been hit harder by a cold front!"
- "TWENTY YEARS and you STILL lead with your chin!"
(tone note: drill-sergeant — he's genuinely coaching Turbo even while
  fighting him, and doesn't notice the irony)
```

```
PACK: coach_defeat (extra lines beyond the cutscene, for the fight's end beat)
- "...alright. Alright! Down. You're down— I mean, I'm down."
- "Get up. No — stay down a second. Then get up."
- "Fine! FINE! You've got heart, Jones! Misplaced, but heart!"
(tone note: same gruff-but-fair register, first crack of real respect)
```

```
PACK: dad_interrupt (Reverend Jones — fires on the turbo_bowl_payoff
  trigger; reusable later anywhere Turbo's flirting near a family-flagged
  moment)
- "TURBO JONES! What did we say about eye contact with the opposite sex?!"
- "Is that a CHEERLEADER? Turbo, we TALKED about this!"
- "The Lord is watching, and so, apparently, am I — CONSTANTLY!"
- "Not. Allowed. Two words, son. I've said them your whole life!"
(tone note: loving but suffocating, dead serious even though the moment
  is absurd — he's not joking, and that's what makes it funny)
```

```
PACK: cheer_squad_ambient (background color at the field)
- "Two, four, six, eight, who do we NOT appreciate? Coach's whistle,
  that's who."
- "Is that guy allowed back here?"
- "He's kind of got main-character energy, not gonna lie."
(tone note: light and gossipy, mostly indifferent — except Amber's one
  direct line in turbo_bowl_payoff)
```

```
PACK: turbo_backstory_callback (Turbo, rare ambient bark — extends the
  existing idle-quip pattern; ties the promo monologue directly into
  in-game barks)
- "Two years, three hot dogs a day. I have OPINIONS about hot dogs now."
- "Church camp took my cheerleaders. Coach took my locker room. Deb's
  taking my money. I see a pattern and I don't like it."
- "I didn't lose my temper. I lost a WRESTLING MATCH. Slight difference."
- "Fast, strong, handsome. That's not bragging, Coach, that's HISTORY."
- "Just gotta get creative. Always gotta get creative."
(tone note: this is where Turbo's self-mythologizing shows through
  hardest — let him say something absurd with total conviction)
```

---

## 7. Engineering flags

Ranked by how far each sits from what already exists in `index.html`,
per `HANDOFF.md`'s golden rules (§8 — new systems need sign-off).

1. **Alumni Wildcats roaming faction** — *moderate.* Structurally close to
   the existing `gangMembers`/`chaosDrivers` pattern (a new array + spawn
   logic concentrated near Wildcats Field), reusing existing melee combat.
   Not a new system, but a new faction — worth a quick sign-off, not a big
   one.
2. **Coach as a named boss ped** — *moderate.* Needs a "yield" state
   distinct from the normal ped death/ragdoll flow, scripted bark
   triggers at HP thresholds, and a **soft retry** on a Turbo loss (not
   the busted/wasted story-fail flow — losing to Coach should feel like
   losing a scrimmage, not a real consequence). New pattern, but small in
   surface area.
3. **Dad's interrupt trigger** — *low.* Mirrors the existing proximity +
   cutscene pattern (same shape as `spawnDeb`/story triggers). Cheap.
4. **Turbo Bowl minigame** — *the real ask, flagged per HANDOFF.md §2.8
   ("new game mode... needs sign-off first").* This isn't a mission, it's
   a mode, and it doesn't fit the existing archetype list. Two options,
   ranked by cost:
   - **Option A — Endless Run (recommended, far cheaper):** dodge/juke a
     line of Alumni Wildcats defenders sprinting a set distance, reusing
     the existing run/dodge foot verbs and chase-AI shape (defenders
     "tackle" on touch like a non-lethal cop grab). Timer + yardage score.
   - **Option B — Target Accuracy (stretch):** throw at receivers/targets
     for points against a clock. Needs a new aim/throw verb that doesn't
     exist anywhere in the game today — meaningfully heavier lift.
   Recommend scoping Option A only, and only once you're ready to treat
   this as an actual expansion pass rather than polish.

None of the fight-adjacent work (§7.1–7.3) requires a new *system* the way
the minigame does — they're new content riding existing verbs. The
minigame is the one item on this list that's a real go/no-go decision.

---

## 8. What's next

This covers "football characters and dialogue, and Coach": two new named
characters (Coach Grimsby, Reverend Jones), two new archetypes (Alumni
Wildcats, Cheer Squad), one location, two mission specs, three cutscenes,
and eight bark packs — all built from the promo monologue's specific
details (the Gatorade/Danny Kowalski incident, the hot dogs, "gotta get
creative").

Open threads: Danny Kowalski himself as a possible future character (an
appearance/forgiveness beat); whether Turbo Bowl gets greenlit as an
actual build (your call, per §7); and whether this strand should ever
cross the Chaos Pizza strand or the Deb spine directly, or stay parallel.
