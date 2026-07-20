# GTB IV: San Chaos — Story Bible & Script Framework

> **What this is:** a self-contained framework for **writing the story, missions,
> and scripts** for *Grand Turbo Boost IV: San Chaos*. Hand it to **any LLM** (or
> any human writer). It carries the locked canon, the voice, the world, and
> fill-in templates. It is **writing-first**: it's aware of the game's mechanics
> so the story stays playable, but it contains **no code** and nothing here needs
> to be implemented yet. Output is **text** — outlines, character sheets, mission
> specs, cutscene scripts, and barks — not assets or code.
>
> **How to use it:**
> 1. Read §1–§5 (pitch, tone, locked canon, voice, world) — never contradict
>    §3 *Locked Canon*.
> 2. Write using the templates in §8–§12.
> 3. Deliver the artifacts in the §13 checklist, in order.
>
> Companion docs (engineering side, not needed for writing): `HANDOFF.md`,
> `CHARACTERS.md`.

---

## 1. The pitch

**Logline:** Fresh out of minimum security with twelve dollars and a bus pass,
small-time crook **Turbo Jones** has until tonight to scrape together **$800** in
child support for his ex-wife **Deb** — or he's going straight back to jail. In
**San Chaos City**, the only way to make that kind of money fast is to cause a
lot of it.

**Genre:** open-world crime-comedy sandbox. Think neon 80s synthwave GTA parody —
absurd, satirical, self-aware, and cartoonishly violent without ever taking
itself seriously. **"Zero trademarks harmed."**

**Player fantasy:** be a lovable idiot menace with a car, a wisecrack, and a
deadline.

---

## 2. Tone, rating & style

- **Comedy first.** Every system is played for laughs — cops are useless, crime
  is a career, the radio is unhinged. Satire of crime games, not a real crime
  story.
- **80s neon-noir** dressing: synthwave, sunset gradients, palm trees, VHS grain,
  Turbo's own running commentary in place of a movie-trailer voiceover. Style is
  loud and pink/cyan.
- **Cartoon violence, PG-13 attitude.** Slapstick "MY SPLEEN!" energy, not gore.
  Innuendo over profanity. Keep it broadcastable-absurd.
- **Turbo is the joke and the heart.** He's a screw-up with a code; the comedy
  lands because he half-means it about the kid.
- **Do:** puns, deadpan, escalating absurdity, fourth-wall winks ("Grand Turbo
  Boost? Is that a vitamin?"), running gags.
- **Don't:** real brands, real people, real song lyrics, actual cruelty, edginess
  for its own sake, anything that needs a licence. Parody originals only.

---

## 3. Locked canon (do not contradict)

These are established in the shipping game. Build on them; don't rewrite them.

- **Hero:** **Turbo Jones** — just out of **minimum security**, has **$12 and a
  bus pass**. Wisecracking petty criminal.
- **The debt:** ex-wife **Deb** wants **$800 in child support**, due **tonight**.
  Fail = **back to jail**. There is **a kid** (unseen so far — the reason the
  debt matters). This is **Chapter 1: "Paying Debts."**
- **Setting:** **San Chaos City** (aka San Chaos) — "the city that never sleeps…
  because it's too busy causing trouble." A coastal city (beach, docks, water you
  can drive into), skyscrapers, a day/night cycle.
- **Antagonist faction:** **Chaos Pizza** — a rival pizza gang with **turf**, gang
  members, and drivers. There is a **"Pizza Wars"** conflict. (Turbo can jack
  **pizza-delivery** cars and run deliveries for cash.)
- **Law:** the cops ("the badge brigade") escalate with a **wanted level** (stars/
  heat); at high heat, **police helicopters** join. Cops are portrayed as
  incompetent.
- **Established VO (verbatim — keep these as canon voice):**
  - Intro narration: *"San Chaos. The city that never sleeps... because it's too
    busy causing trouble." / "Name's Turbo Jones. I just walked out of minimum
    security with twelve dollars and a bus pass." / "My ex-wife Deb? She wants
    eight hundred dollars in child support. And she wants it today." / "So I pay
    up... or it's straight back to the slammer. Time to go to work."*
  - Deb: *"Turbo. We need to talk." / "You owe me $800 in child support." / "Pay
    me, or you go BACK to jail. Have fun, Turbo."*
- **Turbo's backstory** (from his own retelling — see the full monologue in §4;
  treat this as how Turbo tells it, not necessarily objective truth, which is
  itself a character trait):
  - He was **the greatest football player anybody had ever seen** in high
    school — fast, strong, handsome, by his own account. Every cheerleader
    wanted to date him.
  - **His dad wouldn't let him date them, because of church.** Turbo says he
    respected that. He clearly still isn't over it.
  - He got **banned from the locker room** — reason unspecified/glossed over
    by Turbo, played as an unexplained injustice he insists wasn't his fault.
    Having no locker room access, he "had to quit the team."
  - This is the wound the football saga (§7 worked example, `HANDOFF.md`
    Phase 7) is built on: a rival team of old teammates (**Chaos High
    Jocks**) still rag on him in the streets, and **Coach** is the one who
    banned him — the target of Turbo's eventual revenge mission.
  - **Why he owes Deb:** he "meant to pay" — but kept buying stuff he wanted
    instead, until the money was gone. This is Turbo's own explanation for
    the $800 debt that kicks off Chapter 1. Play it as impulsive, not
    malicious — he's a soft touch for himself, not a schemer.
  - **Prison diet:** hot dogs, three times a day. A standing complaint/gag.
  - **His stated goal is not redemption — it's a transaction:** get back on
    his feet and "make things right with Deb so she'll leave me the F alone."
    Keep this self-serving framing; it's consistent with his voice (§4) and
    funnier than a sincere redemption arc.
- **Chaos High Jocks** — a third hostile faction (alongside cops and Chaos
  Pizza): Turbo's old football team, still holding a grudge, roaming the
  streets and picking fights with him on sight. **Already implemented in the
  shipping game** (ambient NPCs, ~7 on the street at any time) — see
  `HANDOFF.md` Phase 7, task **FB1**.

---

## 4. Voice guide (match these — samples are canon)

Write dialogue to fit these registers. Samples are pulled from the game.

**Turbo Jones** — cocky, breezy, never rattled; one-liner machine; secretly a dad.
- Steals a car: *"Borrowing this. Permanently." / "Nice ride. It's mine now." /
  "Keys in the ignition. How thoughtful."*
- Runs someone over: *"Oops. Should've looked both ways, pal." / "That's gonna
  leave a mark." / "Outta the way! I'm late for a court hearing."*
- Fires a shot: *"Say goodnight." / "That's how we settle things in San Chaos." /
  "You picked the wrong block, buddy."*
- Register: short, punchy, present tense, deflects everything with a joke.

**Deb** — deadpan, done-with-him, sharper than Turbo, not a villain. Dry menace.
- *"Turbo. We need to talk." / "Pay me, or you go BACK to jail. Have fun, Turbo."*

**Turbo Jones (narrator mode)** — same cocky, breezy register, but when he's
explaining the job to himself (and the player) it lands like an under-breath
running commentary. No separate deep-voiced announcer; Turbo is the only voice
that reads mission briefings and big story beats.
- *"Okay, here's the deal. I'm Turbo Jones, fresh out of minimum security, and my
  ex Deb wants eight hundred bucks in child support by tonight. I pay up, or it's
  straight back to the slammer."*
- *"Delivery run. Grab the package, get it across town, and don't scratch the
  merchandise." / "Rampage. They want chaos... give them chaos." / "The heist is
  on. Sneak in, crack the safe, and vanish before the alarm screams."*

**Ambient San Chaos citizens** — absurd, oblivious, fourth-wall-adjacent.
- *"Nice weather for a rampage." / "The cops here? Useless." / "I saw THREE
  explosions before breakfast." / "Real estate here is BOOMING. Literally." /
  "This city peaked in the 80s."*
- Panic yells: *"AAAH!" / "MY SPLEEN!" / "NOT AGAIN!" / "I JUST GOT HERE!"*

**Radio DJs** (to be written) — three stations' worth of unhinged patter, fake
ads, and between-song bits. Same comic register, station-flavored.

**Turbo Jones (backstory monologue)** — Turbo talking about his life, unprompted,
to camera/no one in particular. This is the master reference for his self-pitying,
self-justifying, weirdly-specific comic voice — mine it for barks, a possible
unlockable cutscene/easter egg, or loading-screen flavor text, but don't quote it
in full inside gameplay (it's a promo piece, not a script — pull individual beats
from it instead):

> *"My name's Turbo Jones. People hear 'minimum security' and they laugh. They
> think it's some kind of summer camp. Let me tell you something — it ain't.
> Every day I wake up surrounded by nothing but dudes. Just... dudes. I love
> women. Always have. And now? It's like the universe looked at me and said,
> 'Turbo, no.'*
>
> *People think I'm some kind of deadbeat. They say, 'Turbo, why didn't you pay
> child support?' I meant to pay Deb. I really did. I had every intention. But
> then I started buying stuff I wanted, and next thing you know... the money was
> gone. It happens. One minute you're looking at a cool shirt, the next minute
> you're in prison explaining your financial strategy to a gross guy!*
>
> *Nobody ever talks about my struggles. I've had hardship my whole life. Back
> in high school, I was the greatest football player anybody had ever seen.
> Fast, strong, handsome. The cheerleaders all wanted to date me. Every single
> one of them. But my dad wouldn't let me because of church. I respected him, so
> that was that. You think that doesn't leave scars?*
>
> *Then, out of nowhere, I got banned from the locker room for no reason...
> How's a man supposed to make it as a football star if he can't use the locker
> room? So I had to quit the team. People always ask, 'Turbo, what happened?'
> Life happened.*
>
> *Now I'm eating hot dogs three times a day while Deb's out there thinking of
> how to screw me even harder. It's not fair! Some nights I stare out my tiny
> little window and wonder where it all went wrong. Was it the shopping? I don't
> know. All I know is a man can only endure so much.*
>
> *One day I'll get back on my feet. I'll rebuild my life. I'll make things
> right with Deb so she'll leave me the F alone. Just got to get creative..."*

Comic engine to reuse from this: **wildly disproportionate self-pity**, treating
petty consequences (jail, debt) as unjust hardship, **specific weird details**
("a gross guy," "hot dogs three times a day") landing harder than general
complaints, and **never actually apologizing** — every setback is something
that *happened to* him.

**Chaos High Jocks** (shipped taunts — canon; see `JOCK_TAUNTS` in `index.html`):
- *"Hey Jones! Heard you got banned from the locker room!" / "Nice hands, Turbo
  — too bad you can't use 'em on the field anymore!" / "Coach still tells that
  story. Every practice." / "Real men play football, Turbo. What do you play
  now, felon?" / "Bet your dad still won't let you talk to cheerleaders!" /
  "Should be paying child support, not starting fights!" / "Heard you spent it
  all on a cool shirt. Nice shirt, deadbeat." / "Washed up AND broke. Rough
  year, Jones." / "Somebody get this guy back to minimum security!" / "You'll
  never wear the jersey again, Turbo!"*
- Register: young, cocky, needling — they know exactly which old wounds to
  poke and enjoy it.

---

## 5. World bible — San Chaos City

A coastal neon metropolis where crime is the main industry and nobody's alarmed.
Use/extend these; add new locations with the §7 template.

- **Established / implied:** downtown skyscrapers, a **beach & boardwalk**, the
  **docks** ("the docks are hot tonight"), open **water** (drive in = swim),
  **ramps** for stunts, robbable **stores**, a **Chaos Pizza** parlor + turf,
  minimum-security **prison** (Turbo's origin), **Chaos High** (Turbo's old
  high school — see location sheet below), and Deb's meetup spot downtown.
- **Factions:** the **badge brigade** (cops), **Chaos Pizza** (rival gang),
  **Chaos High Jocks** (Turbo's old football team, still hostile — roams the
  streets, see §3/§4), and whatever crews/rackets the writer invents (keep it
  parody).

**LOCATION: Chaos High football field**   DISTRICT: near the high school
```
Vibe: sun-bleached bleachers, a faded end-zone mural, a PA system that's seen
  better days — Turbo's glory days, gone slightly to seed.
What the player does here: the "Chaos High Jocks" faction's home turf; site
  of the "Revenge on Coach" mission; site of the football minigame once
  unlocked (see HANDOFF.md Phase 7, tasks FB2–FB5).
Story hooks: Coach still runs practice here. This is where Turbo got banned
  from the locker room and where he goes to settle it.
Gags/landmarks: a retired jersey with Turbo's number hanging crooked in a
  case nobody dusts; a scoreboard stuck on an old score; Coach's whistle,
  audible from way too far away.
```
- **Running gags to seed & pay off:** "zero trademarks harmed," the useless cops,
  helicopters *every day now*, the city "peaked in the 80s," everyone knows "a guy
  who knows a guy," the unseen kid, gas prices, Turbo's court hearing.
- **Tone of place:** everything is a little too on-fire and everyone's fine with it.

**Location sheet template:**
```
LOCATION: <name>            DISTRICT: <area>
Vibe: <one line>
What the player does here: <mechanics — race start, heist target, store, hideout…>
Story hooks: <who/what happens here>
Gags/landmarks: <memorable bits>
```

---

## 6. Character bible

**Main cast (write full sheets):**
- **Turbo Jones** (player) — see §4. Arc seed: a screw-up trying, badly, to do one
  right thing (pay for his kid).
- **Deb** — ex-wife, holds the deadline. Not evil, just fed up. Potential depth:
  she's not wrong.
- **The Kid** — unseen; the stakes. Decide age/name/relationship beats.
- **Chaos Pizza boss** — rival gang leader; comedic antagonist. Needs a name,
  gimmick, and beef with Turbo.
- **A cop / the badge brigade** — recurring incompetent authority; maybe one named
  detective who thinks he's in a serious cop drama.
- **Radio DJs** (×3 stations) — comic narrators of the city.
- **Coach** — Turbo's old football coach, banned him from the locker room
  and ended his football career. The antagonist of the "Revenge on Coach"
  mission (see §7 worked example). Comedic, not menacing — a petty tyrant of
  a small kingdom (his field, his whistle, his rules).
- **Turbo's Dad** — **never appears on-screen.** Devout, overprotective, the
  reason Turbo "wasn't allowed" to date cheerleaders in high school — and the
  rule outlived the reason for it. He's a voice in Turbo's head, not a
  character in a scene: the football-minigame punchline (§7 worked example)
  pays this off by having Turbo self-censor entirely on his own, years later,
  with nobody watching and nobody making him. That's the whole joke.
- **The Cheerleaders** — a group, not individuals (unless the writer wants to
  name one as a bigger recurring character later). Function as a reward beat
  Turbo talks himself out of — nobody stops him, he stops himself.
- **Chaos High Jocks** — Turbo's old teammates, now a hostile street faction
  (see §3/§4). Not individually named; a taunting, fist-throwing crowd, like
  Chaos Pizza's gang members but without turf.

**Character sheet template:**
```
NAME:                    ROLE: (ally / rival / obstacle / color)
One-line: <who they are in a sentence>
Voice: <how they talk — 2–3 traits + a sample line>
Wants / Deadline: <what drives them>
Relationship to Turbo:
First appearance: <where/when in the story>
Arc / payoff: <how they change or return>
Gags: <their running bits>
```

---

## 7. Story architecture (how narrative maps to a sandbox)

The game is an **open-world sandbox**, so the story is layered, not linear:

1. **The Spine (main story):** the $800 deadline. A short **Chapter 1** already
   exists ("Paying Debts"). Structure the spine as **Chapters → Story Missions →
   Beats**. Each chapter escalates the trouble and raises the stakes/heat.
2. **Side strands:** self-contained mission chains (e.g. the **Chaos Pizza** war,
   heists, delivery hustles, stunt jobs) that fund the spine and add color.
3. **Ambient story:** barks, radio, graffiti, one-off street events — worldbuilding
   with zero cutscene cost.

**Progression levers the writer can use (already in the game):** money (toward the
$800 and beyond), **wanted level / heat**, day↔night, reputation with **Chaos
Pizza** / turf, unlocked vehicles & areas, mission count.

**Chapter outline template:**
```
CHAPTER <n>: <TITLE>
Premise: <what's the pressure this chapter>
Opens with: <cutscene / event>
Story missions: <ordered list of mission titles>
Escalation: <how heat/stakes rise>
Climax: <the big set-piece>
Ends with: <payoff cutscene / cliffhanger>
New toys/areas unlocked:
```

Keep **Chapter 1 = "Paying Debts"** as the canonical opener (intro → meet Deb →
first jobs → pay the $800 → beat). The writer can expand it into a full mission
list and add Chapters 2+.

### Worked example: the Football Saga side strand

Austin greenlit this arc as a first-class side strand (see `HANDOFF.md` Phase
7 for the implementation backlog — `FB1`, ambient jock NPCs, already ships).
It's written out in full here both as real canon and as a **worked example**
of how to fill in the §8/§9 templates.

**MISSION: Revenge on Coach**   CHAPTER: side strand / SIDE: Football Saga
```
Logline: Turbo finally settles the score with the coach who ended his career.
Given by: Coach himself, encountered at the Chaos High field.
Trigger: player approaches Coach at the field (see HANDOFF.md FB2/FB3)
Archetype: custom (staged confrontation + fight, modeled on the heist
  system's triggered-encounter pattern, not the random mission pool)
Setup cutscene: "coach_confrontation" (script below)
OBJECTIVE (in verbs): beat Coach in a fistfight (punch) at the field.
Escalation / complication: Coach doesn't fight fair — expect him to call in
  a jock or two (reuse the existing jocks[] hostiles) partway through.
Fail states: none in the traditional sense — Turbo can retreat and try again;
  this is a story beat, not a timed mission.
Reward: unlocks the football minigame permanently (persistent flag).
Wanted impact: none — this is off the cops' radar.
Dialogue hooks: Coach taunts before the fight; Turbo gets the last word after.
Payoff cutscene: short victory beat, then "You can play again, Jones." —
  unlock confirmed on-screen.
Ties to spine: none directly; it's a side strand about Turbo's pride, not the
  $800 debt. Keep it separate from the Deb plot.
```

**CUTSCENE: coach_confrontation** — LOCATION: Chaos High field — TIME: day
```
[Trigger: player approaches Coach at the field for the first time]

SHOT 1 — WIDE, 2.5s, static on the empty field.
  ACTION: Coach stands mid-field, whistle around his neck, arms crossed.

SHOT 2 — MEDIUM, 3.5s, push in.
  COACH: "Well, well. Turbo Jones. Still banned, by the way."

SHOT 3 — CLOSE on Turbo, 3.5s, cut.
  TURBO: "You ended my whole career, Coach. Over nothing."

SHOT 4 — CLOSE on Coach, 4.0s, cut.
  COACH: "It wasn't 'nothing,' Jones. It was everything. Every single time."

SHOT 5 — WIDE, 2.0s, pull back. (FX: whistle blast, fade to gameplay)
  ACTION: Coach raises his fists. Fight begins.
```

**MINIGAME: Football (post-unlock)** — see `HANDOFF.md` **FB4** for the build
spec (keep it arcade-simple: a short timed catch/score loop, not a sports
sim). Narratively: Turbo suits up one more time, plays a quick pickup game at
the field, and wins — setting up the punchline cutscene below.

**CUTSCENE: football_win_punchline** — LOCATION: Chaos High field — TIME: day
```
[Trigger: player wins the football minigame (HANDOFF.md FB5)]

SHOT 1 — WIDE, 2.0s, crowd cheering (reuse ambient ped cheer/chatter).
  ACTION: Turbo, triumphant, catches his breath in the end zone.

SHOT 2 — MEDIUM, 3.0s, cut.
  TURBO: "That's right. That's what I'm talking about."
  ACTION: cheerleaders start walking toward him, waving.

SHOT 3 — CLOSE on Turbo, 3.0s, cut. (FX: he visibly catches himself)
  TURBO: "...Nope. Nope, can't. Church."
  ACTION: Turbo holds a hand up, waving them off before they even arrive —
    entirely his own call, nobody's watching, nobody made him.

SHOT 4 — MEDIUM, 3.0s, cut.
  ACTION: the cheerleaders shrug and peel off. Turbo watches them go, alone,
    still holding the pose.
  TURBO: "Dad would be so proud. If he knew. Which he won't. Because I'm not
    telling him. Because there's nothing to tell. Because I said no."

SHOT 5 — WIDE, 2.0s, fade out.
  ACTION: Turbo, alone on the field, nodding to himself like that was a
    normal thing that just happened. Coach, defeated, just watches from the
    sideline, baffled.
```

Guardrail for the writer: **Dad never appears** — this is a solo Turbo bit. The
joke is that he polices *himself*, unprompted, years later, with zero stakes and
zero witnesses — that's funnier and sadder than an external authority doing it
for him. Keep the cheerleaders **comedic, not creepy**: they're a reward beat
Turbo talks himself out of, not objects of the joke. The joke is entirely on
Turbo.

---

## 8. The Mission = Mechanics contract (write missions the game can play)

Missions must be expressible in the game's **verbs**. Write to these; if a beat
can't be built from them, flag it as "needs new mechanic."

**Player verbs / systems available:**
- **On foot:** walk/run, jump, crouch, **punch**, **gun** (pistol/RPG), talk to
  peds, rob stores, sneak.
- **Vehicles:** **steal/enter** any car, bike, or helicopter; **drive/fly**,
  **boost**, **drift**, **stunt/air-time** off ramps, **horn**, ram, take damage.
- **World:** **wanted level** (gain heat by crime, lose it by escaping), cops +
  cop helis, **day/night**, money economy, **radio**.
- **Existing mission archetypes** (reuse & reskin narratively): **delivery** (get
  X across town, timed), **checkpoints/time-trial** (race markers), **style/stunt**
  (score air & drift in 60s), **rampage** (cause $ of chaos in a time limit),
  **heat/survive** (lose the cops), **heist** (sneak in → crack safe → escape
  before the alarm), **pizza jobs** (jack a pizza car, deliver), **Pizza Wars**
  (fight the rival gang / take turf).

**Mission spec template** (one per mission — this is the core writing deliverable):
```
MISSION: <title>                 CHAPTER: <n> / SIDE: <strand>
Logline: <one sentence>
Given by: <character / phone / event>          Trigger: <how it starts>
Archetype: <delivery | race | stunt | rampage | heist | survive | pizza | custom>
Setup cutscene: <short — or "none">
OBJECTIVE (in verbs): <e.g. "Steal the pizza van, deliver 3 pies before the timer,
  don't let the van drop below 40% HP.">
Escalation / complication: <what goes wrong halfway>
Fail states: <timer out / wasted / busted / target destroyed…>
Reward: <$ amount + any unlock>   Wanted impact: <gains/loses heat>
Dialogue hooks: <Turbo barks, giver radio chatter during play>
Payoff cutscene: <short — or a toast line>
Ties to spine: <how it moves the $800 / chapter forward>
```

---

## 9. Cutscene script format (readable, maps to the engine later)

Cutscenes in-engine are **a sequence of camera shots with dialogue** (the camera
flies between framed positions; characters can be posed/animated). Write them as
lightweight screenplay so they translate cleanly — **no code**, just structure.

**Format:**
```
CUTSCENE: <id/title>   —   LOCATION: <where>   TIME: <day/night>
[Trigger: <what plays this>]

SHOT 1 — <WIDE/MEDIUM/CLOSE>, <duration ~s>, <camera note: push in / orbit / static>
  ACTION: <what the characters do — posed/animated beats>
  <SPEAKER>: "<line>"
  (FX: <sfx / shake / fade>)

SHOT 2 — ...
```

Guidelines: keep scenes **short** (3–6 shots, seconds each — it's a mobile game),
one idea per scene, dialogue punchy, always end on a button (joke, threat, or
hook). Mark **CLOSE** shots for emotional/comic beats, **WIDE** for
establishing/action.

**Worked example (re-formatting the existing Deb scene):**
```
CUTSCENE: deb_confrontation — LOCATION: downtown meetup — TIME: day
SHOT 1 — WIDE, 2.8s, slow push toward Turbo & Deb.
  ACTION: Deb stands arms-crossed; Turbo saunters up.
SHOT 2 — CLOSE on Deb, 4.2s, hard cut. (FX: small shake)
  DEB: "Turbo. We need to talk."
SHOT 3 — CLOSE on Deb, 4.0s.
  DEB: "You owe me $800 in child support."
SHOT 4 — MEDIUM two-shot, 4.8s, cut. (FX: shake)
  DEB: "Pay me, or you go BACK to jail. Have fun, Turbo."
SHOT 5 — WIDE pull-up, 2.0s, fade out.
  ACTION: Deb walks off; Turbo shrugs at camera.
```

The writer should deliver scenes in this format. (Engineering later maps
shot/duration/dialogue to the game's data-driven cutscene system — the writer
doesn't need to touch that.)

---

## 10. Storyboard / panel format (for cinematics & key art)

The intro uses **static key-art panels** with voiceover; cutscenes can be
storyboarded the same way. For each panel/shot:
```
PANEL <n> — <SHOT SIZE> — <mood/palette, e.g. "sunset pink, VHS grain">
  Framing: <what's in frame, composition>
  Action/pose: <what's happening>
  Caption / VO: "<narration or dialogue over it>"
```
Keep panels evocative and cheap to depict (silhouettes, neon, one clear subject).

---

## 11. Barks, radio & ambient writing

High-volume, low-cost color. Deliver as labeled line packs.

- **Turbo one-liners** by trigger category (extend the canon sets): `steal_car`,
  `run_over`, `shoot`, `busted`, `wasted`, `mission_pass`, `near_miss`,
  `boost`, `idle`. ~6–12 punchy variants each.
- **Pedestrian chatter & panic yells** (see §4 samples) — dozens, absurd, oblivious.
- **Mission-giver radio chatter** — lines that play during a job (encouragement,
  taunts, complications).
- **Radio DJ packs** — 3 stations, each with a persona: station IDs, fake ads
  (parody only), between-song patter, "traffic & crime" reports.

**Bark pack format:**
```
PACK: <trigger/speaker>
- "line"
- "line"
(tone note: <how they should read>)
```

---

## 12. Guardrails for the writer

- **Never contradict §3 Locked Canon.**
- **Parody, not infringement:** invent originals; no real brands, celebrities, or
  copyrighted lyrics. "Zero trademarks harmed" is a design law.
- **Comedy + heart:** keep it funny; let the kid/Deb thread carry real (small)
  stakes so it's not weightless.
- **Playable:** every mission must reduce to the §8 verbs, or be flagged as needing
  a new mechanic.
- **Mobile-short:** cutscenes and missions are bite-sized; respect a phone
  player's attention.
- **Text only, for now:** deliver writing. No code, no asset production yet.

---

## 13. Deliverables checklist (produce in this order)

1. **Logline + one-page synopsis** of the full game (spine).
2. **Series/chapter outline** — Chapter 1 "Paying Debts" fully, then Chapters 2+
   as premises (use §7 template).
3. **Character sheets** for the main cast (§6 template).
4. **World / location sheets** for the key districts & landmarks (§5 template).
5. **Master mission list** — titles grouped by chapter + side strand.
6. **Mission specs** for each (the §8 template) — this is the biggest chunk.
7. **Cutscene scripts** for the story beats (§9 format).
8. **Storyboards** for the intro cinematic + major cutscenes (§10 format).
9. **Bark, radio & ambient packs** (§11 format).

Deliver as Markdown. Keep every artifact consistent with the voice in §4 and the
canon in §3. When something needs a new game mechanic to work, **say so
explicitly** so engineering can scope it.
