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

### Danny Kowalski
```
NAME: Danny Kowalski                ROLE: rival → ally (redemption arc)
One-line: The once-star quarterback whose knee Turbo blew out over a
  Gatorade — now the Wildcats' equipment manager, permanent limp, zero
  interest in reliving 1994.
Voice: Tired, dry, doesn't rise to Turbo's energy — the only person in
  this strand as deadpan as Deb. Not bitter, exactly, more exhausted by
  the whole subject after two decades of other people staying mad on his
  behalf.
  Sample: "You know I have a knee brace named after this game, right?
  Not a good name."
Wants / Deadline: To be left alone about the incident. Secretly wants an
  actual apology instead of another Turbo deflection.
Relationship to Turbo: the actual injured party in the strand's founding
  myth — everyone else's grudge (Coach's, the jocks') is really proxy
  anger on Danny's behalf, and Danny himself has mostly moved on.
First appearance: the equipment shed at Wildcats Field, noticeable once
  Coach lets Turbo back on the field after Rematch.
Arc / payoff: `danny_apology` — a short, sincere scene where Turbo gives
  his first real, undeflected apology of the game so far, and Danny
  accepts it on one condition. Mirrors and foreshadows the eventual Deb
  payoff.
Gags: keeps a jar on the equipment counter labeled "GATORADE FUND,"
  visibly still not full after twenty years.
```

### The PA Voice (Wildcats Field announcer)
```
NAME: credited only as "THE PA VOICE"   ROLE: color
One-line: A nervous local volunteer running the stadium PA system —
  underprepared, over-enthusiastic, and reading sponsor copy for
  businesses that clearly don't exist.
Voice: Small-town sports-announcer cadence; mispronounces things; trails
  off mid-sentence; genuinely thrilled by every play no matter the
  stakes.
Wants: to get through the broadcast without another mic-feedback
  incident.
Relationship to Turbo: none personally — pure ambient narration during
  Turbo Bowl.
First appearance: Turbo Bowl, first "Play Ball" trigger.
Gags: reads increasingly absurd fake local-business ads between plays
  (more "zero trademarks harmed" invented-brand territory); can't settle on
  Turbo's name ("Turbo... Jonas? Jones? The bus-pass guy!").
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
4. **Turbo Bowl** — the unlockable minigame (locked design in §5; the one
   real new mode — build-cost flag in §8).

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

## 5. Turbo Bowl — minigame design (LOCKED: Endless Run)

Decision made — going with the cheap version (§8 Option A), kept
deliberately simple rather than growing a "downs" system or new verbs.
Full design so it's buildable without further back-and-forth:

```
MODE: Turbo Bowl                     UNLOCK: complete Rematch
LOCATION: San Chaos Wildcats Field, replayable anytime after unlock
Setup: a "PLAY BALL" beacon at midfield (same beacon pattern as story/
  mission triggers). Walking into it starts a run — no separate menu.
Core loop (one continuous timed sprint, not multiple downs):
  1. Kickoff — Turbo receives the ball at his own end zone (PA "kickoff"
     bark, §7).
  2. He sprints the length of the field toward the far end zone using
     the EXISTING move controls only — no new input, no new verb.
  3. A handful of Alumni Wildcats (3 to start) spawn ahead/to the sides
     and converge on him, reusing the existing chase-AI shape (same
     "close the distance" logic as cop pursuit, just non-lethal).
  4. Touching a defender = TACKLED. Run ends immediately. This is a
     SOFT fail — no busted/wasted screen, no penalty, instant retry via
     the same beacon.
  5. Reaching the far end zone = TOUCHDOWN. Triggers `turbo_bowl_payoff`
     on the first win only; subsequent wins just get a toast + bark
     (§7 `turbo_turbobowl_run`) — the full cutscene is a one-time thing.
Scoring: yards covered before being tackled or scoring (distance
  traveled = the score). No timer pressure needed — the defenders
  closing in ARE the pressure. Track a session-best (and, once F1/save
  lands, a persisted best) so replays have something to chase.
Difficulty: each successful touchdown adds one more defender on the next
  attempt (cap it low, e.g. 3 → 6, so it never turns into a bullet-hell).
  Resets to 3 if the player hasn't played in a while, or just holds flat
  if that's simpler — engineering's call, not a story requirement.
Fail/retry: tackled → instant re-prompt at the beacon, no cooldown. This
  should feel like pickup-game replayability, not a mission with stakes.
```

*Why this shape:* every piece of it reuses something that already exists
— movement, a chase-AI pattern, a beacon trigger, a toast/bark pipeline —
except the yardage/defender-count bookkeeping itself, which is small
state, not a new system. It's the cheapest version of "football
minigame" that still delivers the beat you asked for (win → cheerleaders
→ Dad).

---

## 6. Cutscene scripts

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
CUTSCENE: danny_apology — LOCATION: Wildcats Field, equipment shed — TIME: day
[Trigger: player approaches the equipment shed after coach_defeat has played]

SHOT 1 — WIDE, 2.4s, push in on a guy restocking footballs, favoring one leg.
  ACTION: Danny doesn't look up.
  DANNY: "Coach let you back on the field. Bold move."

SHOT 2 — MEDIUM two-shot, 3.2s.
  TURBO: "Danny. Hey. Been a while."
  DANNY: "Nineteen years. But sure, 'a while.'"

SHOT 3 — CLOSE on Turbo, 3.6s, cut. (the one beat where he actually
  stops joking)
  TURBO: "...I'm sorry about your knee. I was showing off. It wasn't
    about you. That doesn't make it better, I know."

SHOT 4 — CLOSE on Danny, 3.4s.
  DANNY: "...huh. That's the first time you've said that without a
    punchline after it."

SHOT 5 — MEDIUM two-shot, 3.0s, cut.
  DANNY: "Fine. Apology accepted. Never bring up the wrestling match
    again."
  TURBO: "The what now? Never heard of it."

SHOT 6 — WIDE, 2.0s, fade.
  ACTION: Danny almost smiles. Almost. He goes back to stacking footballs.
```
*Why this beat:* it's the strand's real emotional payoff — the first
apology Turbo gives anyone without immediately deflecting it into a
joke — and it's small and cheap (one location, two characters, no new
mechanic) precisely so it doesn't compete with the football beats for
build budget.

```
CUTSCENE: turbo_bowl_payoff — LOCATION: Wildcats Field — TIME: day
[Trigger: first Turbo Bowl win — see §5 for the locked minigame design]

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

## 7. Bark packs

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

```
PACK: danny_ambient (Danny Kowalski, idle lines at the equipment shed,
  after `danny_apology` has played)
- "Don't step on the equipment. I only just got it organized."
- "You know I have a knee brace named after this game, right? Not a
  good name."
- "Gatorade Fund's still not full, by the way."
- "Coach still won't let me referee your games. Says I'm 'biased.' I
  am, a little."
(tone note: dry, deadpan — the least impressed person on the field, and
  proud of it)
```

### Turbo Bowl dialogue (the minigame itself, §5)

```
PACK: pa_announcer_turbo_bowl (THE PA VOICE — keyed to distance
  milestones during a run: kickoff, midfield, red zone, touchdown,
  tackled)
- "And he's OFF! Turbo Jones — sorry, is it Jonas? — with the ball!"
- "Ohhh he's cutting left, he's cutting right, does HE even know where
  he's going?"
- "Fifty yards! Halfway there, folks — halfway to glory or a pulled
  hamstring!"
- "TOUCHDOWN! TOUCHDOWN JONES! I mean JONES-JONAS! SOMEBODY CONFIRM THE
  SPELLING!"
- "Ohh, and he's DOWN. Tackled. That's gotta hurt. Today's game is
  brought to you by Big Gary's Discount Airbags — 'we cushion the
  blow, literally.'"
- "This broadcast is sponsored by Sunny Sam's Suspiciously Cheap
  Watches. Sunny Sam is not currently answering his phone."
(tone note: warm, chaotic small-town-broadcast energy, genuinely losing
  the thread mid-sentence)
```

```
PACK: coach_sideline_turbobowl (Coach, cheering from the sideline once
  Turbo's back on the field — distinct from his Rematch fight taunts)
- "Head up, JONES! Eyes downfield!"
- "That's it! That's what I've been trying to teach you for TWENTY
  YEARS!"
- "Don't you dare fumble in front of me again!"
- "ATTA BOY— don't let it go to your head."
(tone note: still gruff, but rooting for him now — the thaw from
  Rematch shows here)
```

```
PACK: jock_turbobowl_defender (Alumni Wildcats, chasing Turbo during a
  run — friendlier register than the pre-Rematch `jock_fight` pack)
- "Not today, Jones!"
- "You're still slow, old man!"
- "I've got you, I've got you— dang it, I don't got you!"
- "Coach is WATCHING, Jones, don't embarrass us!"
(tone note: competitive but warm — needling a friend, not an enemy)
```

```
PACK: turbo_turbobowl_run (Turbo, during/after a Turbo Bowl attempt)
- "Outta my way, I'm HISTORIC!"
- "Twenty years of cardio for THIS moment!"
- "Juke left— no— juke RIGHT— just RUN, TURBO!"
- "This is for the locker room I'll never see again!"
(on getting tackled)
- "...I meant to do that."
- "The grass broke my fall. Mostly."
(on scoring, replays after the first win — the full cutscene only fires once)
- "STILL. GOT. IT."
- "Somebody call Deb, tell her I'm FAST again!"
(tone note: same breezy deflection as his core lines — even getting
  tackled is a bit, not a setback)
```

---

## 8. Engineering flags

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
   ("new game mode... needs sign-off first").* **Design locked** (§5):
   Endless Run — dodge/juke a small wave of Alumni Wildcats sprinting the
   field length, reusing existing move controls and the chase-AI shape,
   scored by yards covered. Deliberately skips the target-accuracy/
   throwing version that would need a brand-new aim verb — not on the
   table. This is still, mechanically, a new mode rather than a mission,
   so it's still the one item on this list that needs your go-ahead to
   actually build, even with the design settled.

None of the fight-adjacent work (§7.1–7.3) requires a new *system* the way
the minigame does — they're new content riding existing verbs. The
minigame is the one item on this list that's a real go/no-go decision.

---

## 9. What's next

The strand is now feature-complete on the page: four named characters
(Coach Grimsby, Reverend Jones, Danny Kowalski, the PA Voice), two
archetypes (Alumni Wildcats, Cheer Squad), one location, two mission
specs, a locked minigame design, four cutscenes (`coach_rematch_intro`,
`coach_defeat`, `danny_apology`, `turbo_bowl_payoff`), and a full line
pass across every role — all built from the promo monologue's specific
details (the Gatorade/Danny Kowalski incident, the hot dogs, "gotta get
creative"). `danny_apology` gives the strand its one sincere beat, mirroring
the eventual Deb payoff.

Open threads: whether to actually greenlight the Turbo Bowl build (design's
locked, sign-off isn't — §8); whether this strand should ever cross the
Chaos Pizza strand or the Deb spine directly, or stay parallel; and the
still-open Chapter 2 premise and radio DJ personas from `CHAPTER1.md`.
