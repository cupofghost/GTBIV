# GTB IV: San Chaos — Full Game Script (Side Strands)

> Companion to `SCRIPT.md` (the spine). Six strands, each a self-contained chain
> that runs parallel to the $800/arrears story and feeds it money, pressure, or
> a person Turbo can lose.
>
> - **Part A — The Meridian** (Desmond Voss and the shirt). The heart of the game.
> - **Part B — Grudge Season** (the football field, expanded).
> - **Part C — Grace Street** (Turbo's father; the church).
> - **Part D — The Weigh Station** (the docks; Ruth Kessler).
> - **Part E — Quality Control** (Chaos Pizza; Donna's job offer).
> - **Part F — Tuesday's Problem** (Detective Hardcastle's real case).
>
> Same conventions as `SCRIPT.md`: written straight, no jokes aimed at, shipped
> lines untouched. Format per `STORY_BIBLE.md` §9.

---

# PART A — THE MERIDIAN

**The strand in one line:** Turbo wants another man's shirt more than he wants to
stay out of jail, and gets it, and finds out the man bought it with his own
child's money twenty-two years ago.

**Why it's the spine's mirror.** Every other strand gives Turbo a way to make
money. This one gives him a reason to understand why he never keeps any. Desmond
Voss is Turbo at fifty-eight, if Turbo keeps making exactly the choice he keeps
making — still upright, still courteous, still wearing the mistake every single
day because if he ever takes it off it was for nothing. Nobody in the script ever
points this out. Not once. It's the whole design.

**The shirt.** A **Meridian**, cut by **Halloran & Bly**, a shirtmaker that closed
nineteen years ago. Cream, long-point collar, mother-of-pearl, a fabric weight
nobody makes anymore. It is not flashy. It is the best-made object in San Chaos
and it is on a man working a permit window.

## Chain overview

| # | Mission | Archetype | Ch |
|---|---|---|---|
| M1 | A Good Shirt | proximity encounter | 3 |
| M2 | The Ask | proximity encounter (repeatable) | 3 |
| M3 | Retail | proximity encounter (VESTRY) | 3 |
| M4 | Provenance | follow / observe | 3 |
| M5 | Delicate Cycle | **heist** | 3 |
| M6 | Fit | scripted | 3 |
| M7 | The Cut | scripted | 3 |
| M8 | Thursday | repeatable ambient | 3–5 |
| M9 | Ruin | scripted (fires off a strand event) | 4 |
| M10 | The Bolt | **delivery** (ties to Part D) | 4 |
| M11 | The Loan | scripted | 5 |
| M12 | The Appraisal | **the choice** | 5 |

---

## M1 — "A Good Shirt"

```
MISSION: A Good Shirt              CHAPTER: 3 / SIDE: The Meridian
Logline: Turbo sees the shirt.
Given by: nobody — Desmond is standing in a line.
Trigger: player passes the Municipal Records Annex on foot, day 3+.
Archetype: proximity encounter (spawnDeb pattern, no new mechanic)
Setup cutscene: voss_first_sighting
OBJECTIVE: none. This is a sighting, not a task.
Reward: none. Opens M2.
Ties to spine: none yet, and that's deliberate — the game should feel like
  Turbo is wasting time he does not have. He is.
```

```
CUTSCENE: voss_first_sighting — LOCATION: Municipal Records Annex, downtown — TIME: day
[Trigger: first pass on foot, Chapter 3]

SHOT 1 — WIDE, 3.0s, static. A grey municipal hallway. Fourteen people in a
  line that isn't moving. Fluorescent light on everything.
  ACTION: Turbo is in the line because he needs a copy of something for the
    hearing. He is not looking for anything.

SHOT 2 — MEDIUM, 2.6s, rack focus down the line.
  ACTION: The camera finds a man behind the window. DESMOND VOSS, late
    fifties, entirely unremarkable except for what he's wearing.

SHOT 3 — CLOSE on the shirt, 4.0s. Slow. The collar, the cuff, the way it
  sits at the shoulder. The camera treats this like other games treat a car
  reveal, and it is completely sincere about it.
  (FX: the ambient hallway noise drops out under this shot and comes back
   at the cut. This is the only audio trick in the strand — use it once.)

SHOT 4 — CLOSE on Turbo, 3.4s.
  ACTION: He has stopped moving. The line moves without him.
  TURBO: "...what is that."

SHOT 5 — MEDIUM, at the window, 4.0s.
  VOSS: "Sir. Sir. You're at the window."
  TURBO: "What is that shirt."
  VOSS: "It's a shirt. Do you have a form?"

SHOT 6 — MEDIUM two-shot, 4.4s.
  TURBO: "No, I mean — what IS it. Where does a shirt like that come from."
  VOSS: "Do you have a form, sir."
  TURBO: "I've got a — no. No, I don't have a form."
  VOSS: "Then I can't help you. Next."

SHOT 7 — WIDE, 3.0s, fade.
  ACTION: Turbo steps out of the line and does not leave the hallway. He
    stands against the far wall and watches the window for a while.
```

---

## M2 — "The Ask"

Repeatable. Turbo comes back to the window with escalating pretexts. Desmond
refuses each one with identical courtesy, which is what makes Turbo escalate.
**Three visits, then the mission closes and M3 opens.**

```
CUTSCENE: voss_ask_01 — LOCATION: the Annex window — TIME: day
[Trigger: second visit]

SHOT 1 — MEDIUM two-shot at the window, 3.2s.
  TURBO: "I've got a form."
  VOSS: "You do not have a form."
  TURBO: "I've got a question that's shaped like a form."

SHOT 2 — CLOSE on Voss, 3.6s. He does not sigh. He has worked this window
  for twenty-six years and Turbo is not remotely the strangest thing at it.
  VOSS: "Ask it."

SHOT 3 — CLOSE on Turbo, 3.4s.
  TURBO: "What do you want for the shirt."

SHOT 4 — CLOSE on Voss, 4.4s.
  VOSS: "Nothing. It isn't for sale, so there's nothing to want."

SHOT 5 — MEDIUM two-shot, 4.0s.
  TURBO: "Everything's for sale. That's — that's the actual rule of the
    entire city."
  VOSS: "Then this is the exception, and now you've met it. Next."
```

```
CUTSCENE: voss_ask_02 — LOCATION: the Annex window — TIME: day
[Trigger: third visit. Turbo brings coffee.]

SHOT 1 — MEDIUM, 3.0s. Turbo sets a coffee on the ledge.
  TURBO: "No form. No question. Coffee."
  VOSS: "I don't take things from the public."

SHOT 2 — MEDIUM, 3.4s.
  TURBO: "It's a coffee."
  VOSS: "It's the start of a conversation about a shirt."

SHOT 3 — CLOSE on Turbo, 2.8s. Caught, and impressed about it.
  TURBO: "...okay, that's fair."

SHOT 4 — CLOSE on Voss, 4.6s. The first time he gives Turbo anything.
  VOSS: "It's a Meridian. Halloran and Bly. They shut nineteen years ago and
    the cutter's dead, so there isn't another one being made. That's what
    you wanted to know. Now you know it, and it doesn't help you."

SHOT 5 — CLOSE on Turbo, 3.6s. He repeats it under his breath like a plate
  number.
  TURBO: "Halloran and Bly."

SHOT 6 — MEDIUM, 3.0s, fade.
  VOSS: "Drink your coffee somewhere else. Next."
```

---

## M3 — "Retail"

Turbo goes to VESTRY to buy the answer. Kell tells him the truth, and the truth
is that money doesn't fix this. **If the player bought the Kell house cut in
Chapter 1 (road C), this scene plays a second, worse version.**

```
CUTSCENE: voss_the_kell — LOCATION: VESTRY — TIME: day
[Trigger: enter VESTRY after voss_ask_02]

SHOT 1 — MEDIUM at the counter, 3.4s.
  TURBO: "Halloran and Bly. A Meridian. What's it cost me."
  KELL: "Nothing, because you can't have one."

SHOT 2 — CLOSE on Kell, 4.6s. He's not gatekeeping. He's a professional
  giving a professional answer.
  KELL: "Halloran shut in oh-six. There were maybe four hundred Meridians
    ever cut and they were cut to a person — a Meridian isn't a size, it's a
    man's measurements from nineteen ninety-something. Somebody else's
    shoulders. You understand what I'm telling you."

SHOT 3 — CLOSE on Turbo, 3.0s.
  TURBO: "I understand you're telling me no."
  KELL: "I'm telling you it wouldn't fit. Those are different sentences and
    you should learn the difference, it'd save you money."

SHOT 4 — [ROAD C ONLY] MEDIUM two-shot, 4.4s.
  ACTION: Kell looks at what Turbo is wearing — the shirt he sold him.
  KELL: "That's a good shirt, by the way. I made it. I stand behind it."
  TURBO: "But."
  KELL: "But it's not a Meridian, and you knew that when you bought it, and
    you bought it anyway because you wanted to have bought something. I'm not
    judging you. I took the eight hundred."

SHOT 5 — CLOSE on Turbo, 3.6s, fade.
  ACTION: He doesn't answer.
```

---

## M4 — "Provenance"

```
MISSION: Provenance                CHAPTER: 3 / SIDE: The Meridian
Logline: If he can't buy it, he'll learn where it lives.
Given by: self-directed.
Trigger: after voss_the_kell.
Archetype: follow/observe — reuses the existing proximity + waypoint pattern.
  No new mechanic; the "don't be seen" layer is the heist's detection cone
  reused at low aggression.
Setup cutscene: none — a toast: "Find out where the shirt goes."
OBJECTIVE: follow Voss from the Annex at 5pm without being spotted three
  times, to three waypoints: the bus stop, the grocery, and TRANG'S FINE
  CARE on a Thursday.
Escalation: Voss is not stupid. He notices on the second night and says
  nothing, which the player finds out about later.
Fail states: spotted three times → he takes a different route, retry
  tomorrow (soft fail, no penalty).
Reward: opens M5. Introduces Ilse Trang.
Wanted impact: none.
Ties to spine: none. Turbo is burning a day of a ten-day clock on this.
```

```
CUTSCENE: trang_introduction — LOCATION: Trang's Fine Care — TIME: evening, Thursday
[Trigger: completing the third waypoint of Provenance]

SHOT 1 — WIDE, 3.0s, across the street. A narrow storefront. Voss goes in
  with a garment bag and comes out without it.
  ACTION: Turbo waits until he's a block gone, then crosses.

SHOT 2 — MEDIUM inside, 3.4s. ILSE TRANG behind a counter, not looking up.
  TRANG: "We're closed."
  TURBO: "Door was open."
  TRANG: "The door is always open. We're still closed."

SHOT 3 — MEDIUM two-shot, 4.0s.
  TURBO: "Guy just dropped off a cream shirt. Long collar."
  TRANG: "Mm."
  TURBO: "I want to look at it."
  TRANG: "No."

SHOT 4 — CLOSE on Trang, 4.6s. She finally looks up, and she has his number
  in about a second and a half.
  TRANG: "Thursday. Every Thursday for eleven years, he brings it in, and
    Monday he picks it up, and in between it hangs on that rail and nobody
    touches it but me. That's not me being difficult. That's the only reason
    it still exists."

SHOT 5 — CLOSE on Turbo, 3.0s.
  TURBO: "Eleven years."
  TRANG: "Eleven years here. He had someone else before me and they were
    ruining it."

SHOT 6 — WIDE, 3.4s, fade.
  TRANG: "Go home. And don't come back Thursday."
  ACTION: Turbo leaves. The camera holds on Trang, who watches him all the
    way down the block, because she knows exactly what she just did.
```

---

## M5 — "Delicate Cycle"

The heist. This is the strand's mechanical centerpiece and it reuses the shipped
heist loop wholesale — sneak in, avoid detection, take the thing, get out before
the alarm — with one change: **the target is worth nothing.**

```
MISSION: Delicate Cycle            CHAPTER: 3 / SIDE: The Meridian
Logline: Break into a dry cleaner to steal a shirt.
Given by: self-directed.
Trigger: enter Trang's after hours on a Thursday.
Archetype: heist (existing loop — sneak, timer, escape). No safe to crack;
  the "crack the safe" step becomes "find the right rail," which is the same
  timed interaction with different art.
Setup cutscene: none — a toast: "Thursday. It's on the rail until Monday."
OBJECTIVE: enter after close, find the Meridian among four hundred garments
  before the alarm timer expires, leave.
Escalation / complication: **there is no security.** No guards, no dogs, no
  cameras. It's a dry cleaner. The pressure is entirely the alarm timer and
  the fact that the player has to look at four hundred shirts, and the game
  should let that land as slightly pathetic rather than tense. If a stealth
  system needs a body in the building, use a single night-shift presser who
  is wearing headphones and never becomes hostile.
Fail states: alarm expires → Turbo leaves empty-handed, soft retry next
  Thursday (which costs a day off the clock — the only real penalty).
Reward: THE MERIDIAN. $0.
Wanted impact: 1 star on the alarm, standard.
Dialogue hooks: turbo_heist_shirt pack (SCRIPT_BARKS.md).
Payoff cutscene: none immediately — M6 fires when Turbo puts it on.
Ties to spine: he burns a night and a wanted star on a shirt while owing
  five thousand dollars. Play that completely straight.
```

---

## M6 — "Fit"

The best beat in the strand and possibly the game. Turbo gets the thing. It's
wrong. And then the person he stole it from doesn't do any of the things a person
in this genre does.

```
CUTSCENE: voss_fit — LOCATION: alley behind Trang's — TIME: night
[Trigger: immediately after escaping Delicate Cycle with the Meridian]

SHOT 1 — MEDIUM, 3.6s. An alley. Turbo has it out of the bag. He is
  breathing hard and he is very happy, and the camera lets him have that for
  a full three seconds before it takes it away.

SHOT 2 — CLOSE, 3.0s. He puts it on. It goes on beautifully.

SHOT 3 — CLOSE, 4.4s. Then it doesn't. The shoulder sits an inch wide. The
  sleeve stops short of his wrist. It is a very good shirt on the wrong man.
  ACTION: He pulls at the cuff. Rolls the shoulder. Pulls at the cuff again.
  TURBO: "...no, it's — it's fine, it's a cut, it's supposed to—"

SHOT 4 — CLOSE, 4.0s. He stops. He stands there in the alley in a stolen
  shirt that does not fit him.
  (FX: no music. Rain starting, light.)

SHOT 5 — WIDE, 4.6s. He turns and Voss is standing at the mouth of the
  alley. No coat. Soaked. He's been out looking.
  ACTION: Voss does not shout. Does not approach. Does not call anyone.

SHOT 6 — MEDIUM two-shot, 4.4s.
  VOSS: "Ilse called me."
  TURBO: "Look—"
  VOSS: "It doesn't fit you."
  TURBO: "...no."

SHOT 7 — CLOSE on Voss, 5.0s.
  VOSS: "It fits a man named Errol Halloran's idea of me, from a fitting
    room in nineteen ninety-eight. It's never going to fit anybody else.
    That's what a shirt like that is. That's the entire point of one."

SHOT 8 — MEDIUM, 4.0s.
  TURBO: "You're not calling the cops."
  VOSS: "No."
  TURBO: "Why not."

SHOT 9 — CLOSE on Voss, 4.6s.
  VOSS: "Because I know what you've got. I've had it since I was thirty-six.
    Take it off. Then walk with me — I'm going the same way you are and I'd
    rather not do it in silence."

SHOT 10 — WIDE, 3.6s, fade. Turbo takes it off in the rain and hands it
  over. Voss puts it in the bag, not on. They walk.
```

*(Naming note: **Errol Halloran** is the cutter. "Errol" also happens to be the
name of the man who died in Cornelius Jones's car in Part C. Same name, no
connection, never remarked on — the world is small and full of Errols. If that
reads as a wink rather than texture, rename one of them. Recommend keeping it.)*

---

## M7 — "The Cut"

Desmond's backstory, delivered walking, in one take. This is the scene the whole
strand exists to reach.

```
CUTSCENE: voss_the_cut — LOCATION: a wet street, walking — TIME: night
[Trigger: immediately after voss_fit. Chapter 3's closing beat.]

SHOT 1 — WIDE tracking, 4.0s, both men walking, garment bag between them.
  VOSS: "Twenty-two years ago I had six thousand dollars in an envelope. It
    was for my daughter's first semester. I had it in cash because I don't
    trust banks with anything that has a deadline on it."

SHOT 2 — MEDIUM tracking, 4.6s.
  VOSS: "I walked past a window on Kesterly with that envelope in my coat.
    And I want to be precise with you, because you're going to want to
    believe I was tricked. Nobody tricked me. There was no salesman. The
    shop was closed. I looked at a shirt through glass for eleven minutes
    and then I came back the next morning when they opened."

SHOT 3 — CLOSE on Voss, 4.4s.
  TURBO: "How much."
  VOSS: "Twenty-two hundred. Which left me thirty-eight, and thirty-eight
    is not six."

SHOT 4 — MEDIUM two-shot, 4.6s.
  VOSS: "She didn't go that year. She went the next year, on loans, and it
    took her eleven years to clear them. She's forty-one. She lives ninety
    minutes from here."

SHOT 5 — CLOSE on Voss, 4.0s.
  TURBO: "Does she call?"
  VOSS: "No."

SHOT 6 — WIDE tracking, 5.0s. He says the next part without any self-pity,
  which is what makes it land.
  VOSS: "So I wear it. Every day, twenty-two years, Thursday to Monday at
    Ilse's and back on again. Because the day I stop wearing it, it was for
    nothing. Right now it's at least for something. It's for a shirt."

SHOT 7 — CLOSE on Turbo, 5.4s. He has been building a comeback for six shots
  and he doesn't use it.
  TURBO: "I've got a kid."
  VOSS: "I know. You told the whole line at the window on Tuesday."

SHOT 8 — CLOSE on Turbo, 4.4s.
  TURBO: "I owe his mother fifty-six hundred dollars." [OR "thirty-four
    hundred," road A]
  VOSS: "Yes."
  TURBO: "And last week I—"
  VOSS: "I know what you did last week. It's on you. Literally. I recognized
    the shoulders." [ROAD C ONLY — otherwise Voss just says: "I know."]

SHOT 9 — WIDE, 4.6s. They've reached a corner. Voss stops.
  VOSS: "I'm not going to tell you what to do about it. Everyone's told you
    what to do about it and you're still standing in the rain with my shirt.
    I'll say the only useful thing I've got."

SHOT 10 — CLOSE on Voss, 5.0s.
  VOSS: "The wanting doesn't stop. That's not the lesson. Twenty-two years
    and I still stop at windows. What changes is that eventually you get old
    enough to watch yourself do it, and you can decide to be somewhere else
    when it happens. That's all. That's the whole thing I've got."

SHOT 11 — WIDE, 3.6s, fade.
  ACTION: Voss goes left. Turbo stands on the corner in the rain in his own
    shirt.
```

---

## M8 — "Thursday"

Repeatable ambient scenes. The relationship. Small, quiet, no plot.

```
MISSION: Thursday                  CHAPTER: 3–5 / SIDE: The Meridian
Logline: Turbo starts going to the cleaners.
Given by: standing invitation after voss_the_cut.
Trigger: enter Trang's on a Thursday evening.
Archetype: ambient conversation node (same shape as Danny's equipment shed)
OBJECTIVE: none. Two or three exchanges from a rotating pool, then Voss
  goes home.
Reward: none. This is the payoff, not a step toward one.
Ties to spine: the only place in the game where Turbo isn't working an
  angle, and the contrast is the point.
```

Rotating exchanges (each is a two- or three-line beat, no cutscene framing —
speech bubbles at the counter):

```
EXCHANGE A
  TRANG: "Don't touch the rail."
  TURBO: "I'm not touching the rail."
  TRANG: "You're standing at touching distance from the rail."

EXCHANGE B
  VOSS: "You're wearing that badly."
  TURBO: "It's a jacket."
  VOSS: "It's a jacket you're wearing like an apology. Shoulders back. There.
    That cost you nothing and it took four seconds."

EXCHANGE C
  TURBO: "How do you stand at that window all day."
  VOSS: "I stand at that window all day and then I go home. That's the
    entire arrangement and I've never once been confused about it. You
    should try having one."

EXCHANGE D
  TURBO: "Hearing's in four days."
  VOSS: "Yes."
  TURBO: "You're not going to ask how much I've got."
  VOSS: "No. You'd tell me a number and then we'd both have to sit with it."

EXCHANGE E — [only after church_the_ledger, Part C]
  TURBO: "My old man's been paying her. Sixty a month. Four years."
  VOSS: "...that's a good man."
  TURBO: "That's not the part I'm stuck on."
  VOSS: "I know which part you're stuck on. You'll be stuck on it a while."

EXCHANGE F — TRANG teaches him
  TRANG: "Cold. Always cold. Warm water sets a stain like it's setting
    concrete, and everyone does it warm, and then they bring it to me."
  TURBO: "Why are you telling me this."
  TRANG: "Because you're going to ruin something eventually and I'd like you
    to ruin it less."
```

*(Exchange F is a plant. It pays off in M10.)*

---

## M9 — "Ruin"

The shirt gets destroyed. Cheapest and best version: it happens because Turbo did
something generous, not something stupid.

```
MISSION: Ruin                      CHAPTER: 4 / SIDE: The Meridian
Logline: Turbo borrows the Meridian for one hour and it doesn't survive.
Given by: Voss lends it — see the cutscene.
Trigger: after M8 has been visited twice AND the player has met Prine or
  Kessler (i.e. mid-Chapter 4).
Archetype: scripted, fires off whatever the player is doing next
Setup cutscene: voss_lends_it
OBJECTIVE: none — the ruin happens in the next mission the player runs while
  wearing it, whatever that is. It is not avoidable.
Reward: opens M10.
Ties to spine: gives Turbo a debt he can actually pay, which is the only one
  in the game.
```

```
CUTSCENE: voss_lends_it — LOCATION: Trang's — TIME: Thursday evening
[Trigger: entering the M9 window]

SHOT 1 — MEDIUM, 3.4s. Voss takes the bag off the rail and holds it out.
  Trang, behind him, says nothing and her face says a great deal.
  VOSS: "Take it."

SHOT 2 — CLOSE on Turbo, 3.0s.
  TURBO: "It doesn't fit me."
  VOSS: "It doesn't fit you. Take it anyway."

SHOT 3 — CLOSE on Voss, 4.6s.
  VOSS: "There's a room on the eleventh where a man is going to decide what
    you are. He'll decide it in about nine seconds, before you open your
    mouth, and then he'll spend an hour confirming it. That's not cynicism,
    that's just what a courtroom is. Give him something to confirm."

SHOT 4 — MEDIUM two-shot, 4.0s.
  TURBO: "Des—"
  VOSS: "Don't. If you say something now I'll take it back."

SHOT 5 — CLOSE on Trang, 3.4s.
  TRANG: "Cold water. Whatever happens. Cold."

SHOT 6 — WIDE, 3.0s, fade.
  ACTION: Turbo leaves with the bag. Trang and Voss stand there.
  TRANG: "He'll ruin it."
  VOSS: "Probably."
  TRANG: "You know that and you gave it to him."
  VOSS: "Yes."
```

```
CUTSCENE: shirt_ruined — LOCATION: wherever it happens — TIME: any
[Trigger: end of the first mission the player completes while carrying the
 Meridian. Fires regardless of success or failure.]

SHOT 1 — CLOSE, 2.6s. The shirt. Blood, or engine oil, or harbour water —
  whatever the last mission's environment supplies.

SHOT 2 — CLOSE on Turbo, 4.0s. Absolutely still.
  TURBO: "No. No, no, no—"

SHOT 3 — MEDIUM, 4.4s. He is already moving, already doing the wrong thing:
  reaching for a tap, a hose, a bottle.
  ACTION: He stops with his hand on it.
  TURBO: "...cold. Cold water."

SHOT 4 — WIDE, 3.6s, fade.
  ACTION: He does it cold. It is not enough and he knows it's not enough,
    and he does it properly anyway, for a long time, in an alley, alone.
```

---

## M10 — "The Bolt"

The repair. Ties Part A to Part D — the last bolt of Halloran cloth in the
country is sitting in a container at the docks, and Ruth Kessler knows exactly
which one because Ruth Kessler knows exactly which one about everything.

```
MISSION: The Bolt                  CHAPTER: 4 / SIDE: The Meridian × the docks
Logline: There's one bolt of the cloth left in a container at the docks.
Given by: Ilse Trang, who says the repair needs matching fabric and she is
  not going to patch a Meridian with anything else.
Trigger: bring the ruined shirt to Trang's.
Archetype: delivery (existing loop — get X, get it across town, timed by the
  dock's shift change rather than an artificial clock)
Setup cutscene: trang_the_repair
OBJECTIVE: get the manifest number from Kessler (Part D, W1 must be done),
  find container 4-C-19 in the yard, take the bolt, get it to Trang's before
  the yard shift changes.
Escalation: the container isn't Kessler's to give. She'll let Turbo take it
  and she'll write it down, which is worse than her stopping him.
Fail states: caught in the yard → thrown out, retry next day (soft fail).
Reward: the Meridian is repaired. $0. Costs Turbo a favor to Kessler that
  Part F will try to collect on.
Wanted impact: none if clean, 2 stars if caught.
Ties to spine: nothing. He spends a day of the ten on a shirt repair, and
  by this point in the game that reads as a choice rather than a mistake.
```

```
CUTSCENE: trang_the_repair — LOCATION: Trang's — TIME: day
[Trigger: bringing the ruined Meridian in]

SHOT 1 — CLOSE on the shirt on the counter, 3.4s. Trang's hands on it.
  TRANG: "Cold water."
  TURBO: "Cold water."
  TRANG: "Good. That's why there's anything left of it."

SHOT 2 — MEDIUM, 4.0s.
  TRANG: "The panel's gone. I can rebuild the panel. I can't invent the
    cloth — it's a Halloran weave and there's no substitute that isn't an
    insult. Patch it in poplin and it's a repaired shirt. It stops being a
    Meridian the second I do that."

SHOT 3 — CLOSE on Turbo, 3.0s.
  TURBO: "Then get me the cloth."
  TRANG: "There isn't any."
  TURBO: "There's always some. Somewhere in this city there is always some
    of everything, that's the one thing I actually know about San Chaos."

SHOT 4 — CLOSE on Trang, 4.6s. A long look. She decides to help him.
  TRANG: "When Halloran shut, the stock went into a receiver's lot and the
    receiver's lot went into storage and storage went into a container that
    nobody has ever paid to open. It's at the harbour. It's been at the
    harbour for nineteen years."

SHOT 5 — MEDIUM, 3.4s.
  TURBO: "You know the container."
  TRANG: "I know a woman who knows every container. Everybody at the harbour
    knows her and nobody likes talking about it."

SHOT 6 — CLOSE on Trang, 3.6s, fade.
  TRANG: "Don't tell him you're doing this."
```

---

## M11 — "The Loan"

```
CUTSCENE: voss_the_loan — LOCATION: Trang's — TIME: evening, day 10
[Trigger: night before the hearing, if the Meridian was repaired]

SHOT 1 — WIDE, 3.0s. The shirt on the rail, rebuilt. Voss looking at it.
  ACTION: He runs a thumb along the new panel. He can feel the seam.

SHOT 2 — CLOSE on Voss, 4.4s.
  VOSS: "Ilse. This is the same cloth."
  TRANG: "It is."
  VOSS: "There is no more of this cloth."
  TRANG: "Apparently there was."

SHOT 3 — MEDIUM, Voss turns to Turbo, 4.6s.
  VOSS: "What did that cost you."
  TURBO: "A favor to somebody who writes things down."
  VOSS: "That's a real cost."
  TURBO: "Yeah."

SHOT 4 — CLOSE on Voss, 5.0s. He takes it off the rail and holds it out —
  not lending it this time.
  VOSS: "Then it's yours."
  TURBO: "Des, it doesn't—"
  VOSS: "It doesn't fit you. I'm aware. I've been aware the whole time."

SHOT 5 — CLOSE on Voss, 4.6s.
  VOSS: "I've worn that shirt for twenty-two years to make one bad morning
    mean something, and this week it meant something without any help from
    me. That's the most it's ever going to do. I'd rather it stop there than
    go back on the rail."

SHOT 6 — MEDIUM two-shot, 4.0s. Turbo takes it. He doesn't say thank you,
  because the script knows he'd ruin it, and Voss doesn't want it.
  VOSS: "Nine a.m. Shoulders back."

SHOT 7 — WIDE, 2.6s, fade.
```

---

## M12 — "The Appraisal"

The choice. Available from the moment Turbo owns the Meridian, and the game puts
Halberstam's window on the route between everywhere and the courthouse.

```
MISSION: The Appraisal             CHAPTER: 5 / SIDE: The Meridian
Logline: A pawnbroker will give Turbo nineteen hundred dollars for a gift.
Given by: Mo Halberstam.
Trigger: enter Halberstam Loan & Trade carrying the Meridian.
Archetype: the choice. One prompt, no timer, fully reversible until the
  gavel — the ticket can be redeemed for $1,900 plus interest right up until
  the hearing starts, which the game should state clearly so the decision
  stays live instead of becoming a regret.
OBJECTIVE: sell it, or don't.
Reward: $1,900, or nothing.
Ties to spine: $1,900 is the largest single sum available on day 11 and it
  is almost always the difference between two endings. That's the design.
```

```
CUTSCENE: halberstam_appraisal — LOCATION: Halberstam Loan & Trade — TIME: day
[Trigger: entering with the Meridian]

SHOT 1 — MEDIUM at the counter, 3.6s. Mo puts on glasses. He handles it for
  a long time — collar, cuff, the new panel — before he says anything.
  MO: "Where'd you get this."
  TURBO: "It was given to me."
  MO: "By somebody who knew what it was?"
  TURBO: "By the only person who did."

SHOT 2 — CLOSE on Mo, 4.4s.
  MO: "There's a rebuilt panel here. Matched cloth, hand-set, and I've been
    doing this thirty years and I can barely find the seam. Whoever did this
    is better than anyone I use."

SHOT 3 — MEDIUM, 4.0s.
  TURBO: "What's it worth."
  MO: "To a collector, four. To me, nineteen hundred, because I'll sit on it
    for a year finding the collector."

SHOT 4 — CLOSE on Turbo, 4.6s.
  ACTION: He doesn't answer immediately. Long hold.

SHOT 5 — CLOSE on Mo, 5.0s. He is not talking Turbo into it. Mo Halberstam
  has watched a thousand people do this and he has one thing he says.
  MO: "I'll tell you what I tell everybody, and then I'll do whatever you
    want and I won't mention it again. Nobody has ever come back in here
    happy about the ticket. Some of them needed the money and they were
    right to take it, and they still weren't happy. Those are two different
    things and people get them confused at this counter constantly."

SHOT 6 — MEDIUM, 3.4s, prompt.
  MO: "Nineteen hundred. Ticket's good till you say it isn't."
  (PROMPT: SELL — $1,900 / KEEP)
```

**If sold**, one more beat, days later:

```
CUTSCENE: trang_the_window — LOCATION: Trang's — TIME: after the hearing
[Trigger: epilogue, if the Meridian was sold]

SHOT 1 — MEDIUM, 3.6s. Trang, working. She doesn't look up.
  TRANG: "It's in Halberstam's window."

SHOT 2 — CLOSE on Turbo, 3.0s. Nothing.

SHOT 3 — CLOSE on Trang, 4.6s.
  TRANG: "I'm not going to tell him. He doesn't come this way and he stopped
    asking about it, which I think he did on purpose."

SHOT 4 — MEDIUM, 4.0s.
  TURBO: "I needed it."
  TRANG: "I believe you. I've believed everybody who's said that to me."

SHOT 5 — WIDE, 3.0s, fade.
  TRANG: "Thursdays are still Thursdays. He still comes. You can still come."
  ACTION: She goes back to work. That's the whole absolution she offers and
    it's more than Turbo expected.
```

---

# PART B — GRUDGE SEASON (football, expanded)

Everything in `FOOTBALL_STRAND.md` still stands: Coach Grimsby, Danny Kowalski,
the Alumni Wildcats, the cheer squad, the PA Voice, Old Scores → Rematch →
Turbo Bowl, all shipped as FB1–FB5. **This part does not touch any of it.** It
adds a second season on top, running in Chapter 4, with a real antagonist and a
real stake: the field is being sold.

## The situation

Prine Holdings bought the parcel eighteen months ago at a county auction nobody
attended. The school district sold it because the district doesn't run a football
program anymore — it hasn't since the year on the banner. **Coach Grimsby has
been running the field on his own since then**: mowing it, lining it, and paying
the liability insurance out of his pension, eleven years, because a field with
lapsed insurance is a field the county fences off.

Prine needs one thing to close: a filing that the parcel is unused. He needs an
affidavit from someone with standing — an alum, ideally one with a jersey in the
case. There is exactly one of those in San Chaos and his name is Turbo Jones.

## Chain

| # | Mission | Ch |
|---|---|---|
| G1 | The Parcel — prine_stakes | 4 |
| G2 | Eleven Years — coach_eleven_years | 4 |
| G3 | The Kid — trey_first / trey_the_talk | 4 |
| G4 | The Jar — danny_the_jar | 4 |
| G5 | The Offer — prine_offer | 4 |
| G6 | Homecoming — homecoming | 4 |

---

## G1 — "The Parcel"

```
CUTSCENE: prine_stakes — LOCATION: Wildcats Field — TIME: day
[Trigger: first visit to the field in Chapter 4]

SHOT 1 — WIDE, 3.4s, static. Survey stakes with orange ribbon, driven into
  the field at ten-yard intervals. One is in the end zone.
  ACTION: Coach is pulling them up. He has a bundle of them under one arm.
    He is not shouting. He has clearly been doing this for a while.

SHOT 2 — MEDIUM, 3.6s.
  ACTION: A man in a good coat stands at the fence with a tablet, watching
    him do it, entirely patient. HOLLIS PRINE.
  PRINE: "Gary. They'll just put them back tomorrow."
  COACH: "Then I'll pull them up tomorrow."

SHOT 3 — MEDIUM two-shot at the fence, 4.4s. Prine is not a villain and the
  scene is careful about it.
  PRINE: "I'm not enjoying this. I want to say that out loud because you've
    decided I am. I bought a parcel at a county auction. It was advertised
    for six weeks. Nobody bid against me. Nobody came."
  COACH: "I came."
  PRINE: "You wrote a letter. That's not bidding."

SHOT 4 — CLOSE on Coach, 4.0s.
  COACH: "It's a football field."
  PRINE: "It's four point one acres and a scoreboard with one working bulb.
    I've walked it eleven times. There's no program, no league, no district
    use. I'm not taking anything from anybody, Gary. It's already gone.
    I'm just the man doing the paperwork on it."

SHOT 5 — MEDIUM, Turbo arriving, 3.4s.
  ACTION: Prine looks at Turbo, then at the jersey case visible past the
    bleachers, then back at Turbo. He is putting something together.
  PRINE: "...you're Jones."

SHOT 6 — WIDE, 3.0s, fade.
  PRINE: "Mr. Jones, when you've got a minute, I'd like to buy you a coffee.
    That's not a threat and it's not a joke. It's a coffee and a
    conversation and I think you'll want to have it."
```

---

## G2 — "Eleven Years"

```
CUTSCENE: coach_eleven_years — LOCATION: the equipment shed — TIME: day
[Trigger: after prine_stakes, approach Coach at the shed]

SHOT 1 — MEDIUM, 3.6s. Coach at a folding table with a shoebox. Receipts.
  ACTION: He doesn't hide it when Turbo comes in, which is unusual for him.

SHOT 2 — CLOSE on the box, 3.0s.
  TURBO: "What is that."
  COACH: "Insurance."

SHOT 3 — MEDIUM two-shot, 4.6s.
  COACH: "General liability on the parcel. Eleven hundred a year, due in
    March. If it lapses the county fences the field inside a week — that's
    not a threat from anybody, that's just the rule, an unfenced field
    without coverage is a lawsuit standing in a puddle."

SHOT 4 — CLOSE on Turbo, 3.0s.
  TURBO: "Who's been paying it."
  COACH: "..."
  TURBO: "Coach. Who's been paying it."

SHOT 5 — CLOSE on Coach, 4.4s. Flat. He doesn't make it a speech.
  COACH: "Eleven years."

SHOT 6 — MEDIUM, 4.6s.
  TURBO: "Out of what?"
  COACH: "Out of a pension that was calculated for a man who was going to
    be a lot more relaxed than I turned out to be."

SHOT 7 — CLOSE on Turbo, 4.0s. He does the arithmetic out loud because he
  can't help it.
  TURBO: "That's twelve thousand dollars."
  COACH: "Twelve thousand one hundred. There was a rate change in
    seventeen."

SHOT 8 — MEDIUM two-shot, 5.0s.
  TURBO: "Why."
  COACH: "Because it's the field. Because if it's fenced, it's done, and if
    it's done then everything that happened on it was just — a thing that
    happened. And I'm not built to think about it that way."

SHOT 9 — CLOSE on Coach, 4.4s.
  COACH: "I banned you off this field for twenty years, Jones, and I'd do it
    again, and I've been paying for the grass you're standing on the entire
    time. Both of those are true. Don't make it a moment."

SHOT 10 — WIDE, 2.6s, fade.
  ACTION: He puts the lid back on the shoebox.
```

---

## G3 — "The Kid"

Trey Okonkwo, seventeen, plays pickup on the field every afternoon because there
is no team to play for. He is fast and he has Turbo's exact temper, and in
Chapter 4 he is about six days from doing to somebody what Turbo did to Danny.

```
CUTSCENE: trey_first — LOCATION: Wildcats Field — TIME: afternoon
[Trigger: second visit to the field in Chapter 4]

SHOT 1 — WIDE, 3.0s. Pickup game, eight kids, no equipment. One of them is
  visibly better than the rest and visibly angrier about it.

SHOT 2 — MEDIUM, 3.6s. A shove after the whistle. Trey squares up on a kid
  half his size. Two others pull him off. It resolves in four seconds and
  nobody makes anything of it except Turbo, who has gone very still.

SHOT 3 — MEDIUM two-shot at the sideline, 4.0s.
  TREY: "You're the guy in the case. The upside-down jersey."
  TURBO: "That's me."
  TREY: "Coach says you were the fastest he ever had."
  TURBO: "Coach says that?"
  TREY: "Coach says it like a warning."

SHOT 4 — CLOSE on Turbo, 3.4s.
  TURBO: "...yeah. That tracks."

SHOT 5 — MEDIUM, 4.4s.
  TREY: "There's no team. District cut it before I got here. So I'm the
    fastest guy at a thing that doesn't exist. What's that worth."
  TURBO: "Ask me in twenty years."
  TREY: "That's not an answer."
  TURBO: "No. It's a warranty."

SHOT 6 — WIDE, 2.6s, fade.
```

```
CUTSCENE: trey_the_talk — LOCATION: Wildcats Field, after dark — TIME: night
[Trigger: after Turbo has witnessed the shove twice. This is the strand's
 sincere beat and it is the one place Turbo gets to be useful.]

SHOT 1 — WIDE, 3.4s. Field lights half-on. Trey alone, running routes
  against nobody, hard, in the dark.

SHOT 2 — MEDIUM two-shot, 4.0s.
  TURBO: "You're gonna hurt somebody."
  TREY: "I'm running."
  TURBO: "You're gonna hurt somebody, and it's not going to be a decision.
    That's the part people get wrong about it. You think there's a moment
    where you choose. There isn't one. There's just after."

SHOT 3 — CLOSE on Trey, 3.4s. Defensive, seventeen.
  TREY: "You don't know me."
  TURBO: "No. I know the other guy."

SHOT 4 — CLOSE on Turbo, 5.0s. No deflection. None.
  TURBO: "There's a man in that shed with a bad knee who's forty-two and
    stacks footballs for a living, and I did that to him over a drink.
    Not over a game — over a drink somebody handed to him instead of me.
    I was seventeen and I was the fastest guy Coach ever had, and then I
    was a guy who did that, and I have been that guy every single day
    since, including today, including right now, talking to you."

SHOT 5 — CLOSE on Trey, 4.4s. He doesn't have anything.

SHOT 6 — MEDIUM two-shot, 4.6s.
  TURBO: "I'm not telling you to be calm. I don't know how to be calm, I'd
    be lying to you and you'd hear it. I'm telling you to know which four
    seconds it is. That's all I've got. Learn the four seconds and go
    somewhere else during them."

SHOT 7 — WIDE, 3.6s, fade.
  ACTION: Turbo leaves. Trey stands on the field. After a beat he starts
    running routes again — but slower, and he stops at the line instead of
    through it.
```

---

## G4 — "The Jar"

```
CUTSCENE: danny_the_jar — LOCATION: the equipment shed — TIME: day
[Trigger: visit the shed in Chapter 4, after danny_apology has played]

SHOT 1 — CLOSE on the jar, 3.0s. Labeled GATORADE FUND in marker. Coins
  and a few bills. It has been there a long time.
  TURBO: "The jar's a bit, right? The jar's been a bit for twenty years."

SHOT 2 — MEDIUM, 3.6s. Danny keeps stacking.
  DANNY: "It's a bit."
  TURBO: "Okay."
  DANNY: "It's also four thousand three hundred dollars short of a knee
    replacement, so it's a bit that I check."

SHOT 3 — CLOSE on Turbo, 3.4s.
  TURBO: "...Danny."
  DANNY: "Don't. This isn't a thing I'm laying on you. I made the jar a
    joke on purpose, because people put money in a joke and they don't put
    money in a forty-two-year-old man with a limp."

SHOT 4 — MEDIUM two-shot, 4.6s.
  DANNY: "It's insurance, mostly. It's not the knee, it's the deductible
    and the eight weeks I can't be here. Coach can't run this place alone
    for eight weeks. He thinks he can. He's sixty-eight."

SHOT 5 — CLOSE on Danny, 4.0s.
  TURBO: "How long have you been at forty-three hundred short."
  DANNY: "It was six thousand short in twenty-nineteen. So — progress."

SHOT 6 — WIDE, 3.0s, fade.
  ACTION: Turbo looks at the jar for a long time and doesn't put anything
    in it. He has $0 and everyone in the room knows it. That's the scene.
```

*(Player can fund the jar at any point, any amount, forever. Fully funding it —
$4,300 — is the game's single most expensive act of generosity and it directly
costs the player the Paid ending. It changes one shot in the epilogue. That is
the entire reward and the game does not advertise it in advance.)*

---

## G5 — "The Offer"

```
CUTSCENE: prine_offer — LOCATION: a coffee place downtown — TIME: day
[Trigger: accept Prine's invitation from G1]

SHOT 1 — WIDE, 3.0s. Two coffees. Prine has a single sheet of paper and a
  pen already out, which is the only aggressive thing he does all scene.

SHOT 2 — MEDIUM two-shot, 4.4s.
  PRINE: "Two paragraphs. It says you're a graduate of Chaos High, that
    your number is retired in the case by the bleachers, and that to your
    knowledge the parcel has not hosted a sanctioned athletic program in
    eleven years."

SHOT 3 — CLOSE on Turbo, 3.0s.
  TURBO: "That's true."
  PRINE: "Every word of it is true. That's why I want your name on it and
    not somebody else's. I don't buy lies, Mr. Jones, they're expensive
    later."

SHOT 4 — CLOSE on Prine, 4.6s. The number.
  PRINE: "Twenty-two hundred dollars. Today, in cash, in this room."

SHOT 5 — CLOSE on Turbo, 4.4s. He looks at the number the way he looked at
  the shirt in the hallway. The scene is aware of that and doesn't say so.

SHOT 6 — MEDIUM, 5.0s.
  PRINE: "I know what you owe. It's a public filing, it took me four
    minutes. I'm not using it against you — I'm telling you I know so you
    don't have to perform being comfortable."

SHOT 7 — CLOSE on Prine, 4.6s. His actual argument, which is good, which is
  the problem.
  PRINE: "Gary Grimsby has spent twelve thousand dollars keeping an empty
    field insured. That's not devotion, that's a man who can't stop. In
    three years he'll be seventy-one and the field will still be empty and
    he'll still be writing that check. Somebody has to be the one who says
    it out loud. It might as well be somebody who gets paid for it."

SHOT 8 — MEDIUM, prompt, 4.0s.
  PRINE: "Twenty-two hundred."
  (PROMPT: SIGN — $2,200 / DON'T)
```

**If signed:** the money lands immediately. Coach finds out in three days
(`coach_finds_out`) and the strand ends there — no Homecoming, no G6, and Coach
never speaks to Turbo again. The Alumni Wildcats revert to hostile. **This is the
harshest available consequence in the game and it is not reversible.**

```
CUTSCENE: coach_finds_out — LOCATION: Wildcats Field — TIME: day
[Trigger: three days after signing]

SHOT 1 — WIDE, 3.4s. Coach in the middle of the field with the filing in
  his hand. He is not pulling stakes. He is just standing there.

SHOT 2 — MEDIUM two-shot, 4.6s.
  COACH: "It's got your signature on it."
  TURBO: "Coach—"
  COACH: "I'm not asking a question, Jones, I'm reading you a document."

SHOT 3 — CLOSE on Coach, 5.0s. No shouting, which from this character is
  devastating.
  COACH: "Everything on here is accurate. That's what I keep — there's no
    program. There's no league. I know that. I've known it for eleven
    years, I'm the one who knows it best."

SHOT 4 — CLOSE on Coach, 4.4s.
  COACH: "I just needed one person to not say it. That was the whole job.
    One person, out of the whole city, to not say it out loud on a form."

SHOT 5 — WIDE, 3.6s, fade.
  ACTION: He walks off the field. He does not slam the gate. He closes it
    properly behind him, because it's his gate, and that's worse.
```

---

## G6 — "Homecoming"

If Turbo doesn't sign, the counter-play: Prine's filing needs the parcel to be
unused, so use it. Loudly, with witnesses, on the record.

```
MISSION: Homecoming                CHAPTER: 4 / SIDE: Grudge Season
Logline: Fill the field with people so the paperwork can't call it empty.
Given by: Danny, who knows how a filing actually works because he's read
  eleven years of Coach's insurance paperwork.
Trigger: decline Prine's offer, then return to the shed.
Archetype: composite — a **delivery** leg (drive the flyers/equipment), then
  the shipped **Turbo Bowl** loop played as the exhibition itself.
Setup cutscene: homecoming_plan
OBJECTIVE: (1) get thirty people to the field before Friday — three delivery
  runs: the Alumni Wildcats from the bar, the cheer squad from the school,
  the folding chairs from the church (which requires the player to have been
  to Grace Street at least once). (2) Play one Turbo Bowl run with the
  stands occupied.
Escalation: Prine doesn't interfere. He shows up and watches, and takes
  photographs, and the player should not be able to tell whether that's bad.
Fail states: none — the game is played whether thirty people come or six.
  The number who show up changes the epilogue card, not the outcome.
Reward: $0. The filing fails. Coach keeps the field for now.
Wanted impact: none.
Dialogue hooks: the shipped PA Voice pack, coach_sideline_turbobowl,
  jock_turbobowl_defender — all unchanged, all reused.
Payoff cutscene: homecoming
Ties to spine: costs the player two days and $2,200 they didn't take. This
  is the game's clearest test of whether the player is playing Turbo as a
  man who changes.
```

```
CUTSCENE: homecoming — LOCATION: Wildcats Field — TIME: Friday, dusk
[Trigger: completing a Turbo Bowl run during the exhibition]

SHOT 1 — WIDE, 3.6s. The stands. Not full — thirty-odd people on a set of
  bleachers built for six hundred. The camera is honest about the number.
  (FX: PA feedback squeal, the shipped PA Voice pack under this.)

SHOT 2 — MEDIUM, 3.0s. Coach on the sideline with a clipboard he doesn't
  need, because there's nothing to write on it.

SHOT 3 — MEDIUM at the fence, 3.4s. Prine, alone, taking a photograph of
  the occupied stands. He lowers the phone. He looks at the field for a
  while.

SHOT 4 — MEDIUM two-shot at the fence, 4.6s.
  PRINE: "Thirty-one people."
  TURBO: "Thirty-one people is a use."
  PRINE: "Thirty-one people is a use. For this filing cycle. Which is
    ninety days."

SHOT 5 — CLOSE on Prine, 4.4s. He is not bitter. He's a professional
  acknowledging a competent move.
  PRINE: "You've bought him a season. I want you to understand exactly what
    you've bought, because you've paid twenty-two hundred dollars for it and
    you're going to be standing in a courtroom in four days."

SHOT 6 — CLOSE on Turbo, 4.0s.
  TURBO: "Yeah."
  PRINE: "That's it? 'Yeah'?"
  TURBO: "I've been trying to think of the version where I say something
    better. There isn't one. It's a season."

SHOT 7 — WIDE, 4.6s, fade.
  ACTION: Prine goes. Turbo stays at the fence. Behind him the PA is still
    on and the announcer is still trying to establish the correct spelling
    of his name, and Coach is still standing on the sideline with his
    clipboard, not writing anything.
```

---

# PART C — GRACE STREET (Turbo's father)

**Reverend Cornelius Jones**, 66. `FOOTBALL_STRAND.md` §1 established him:
booming, earnest, still enforcing house rules on a thirty-four-year-old ex-con.
That's who he is at volume. This part is who he is at rest, and it does not
contradict the loud version — it explains it.

**The backstory.** Before the collar, Cornelius drove. Late seventies into the
eighties, he ran goods up the coast for a crew out of the harbour district — a
wheelman, well paid, never once caught. In 1984, on a wet road outside San
Chaos, he took a curve wrong and the man in the passenger seat, **Errol Vance**,
died at the scene. Nobody was charged. There was no investigation worth the
name. Cornelius walked away from the car with a cut on his hand and he walked,
literally walked, eleven miles down the shoulder of the interstate until he came
to a chapel that opened at six. He sat in the lot until it did. He never drove
again — not once, not ever, and Turbo has spent his whole life assuming his
father just doesn't like cars.

**Rosalind**, Turbo's mother, died of pneumonia when Turbo was nine. Cornelius
was thirty-eight and alone with a fast, charming, furious boy who reminded him
of nobody so much as himself at twenty. **Every rule he stacked on Turbo was a
rule he wished someone had stacked on him.** The cheerleader ban was never about
the girls. It was a man looking at his son's appetite and recognizing it.

**Grace Street Fellowship** is a converted appliance showroom with a gravel lot,
forty folding chairs, and a hand-lettered board out front. Generic on purpose. It
is the least stylized location in San Chaos — no neon reaches it.

## Chain

| # | Scene | Ch |
|---|---|---|
| C1 | church_first_visit | 3 |
| C2 | church_the_collection | 3 |
| C3 | church_the_road | 3 |
| C4 | church_the_rule | 3 |
| C5 | church_the_ledger | 3 |
| C6 | church_testimony | 5 |

---

```
CUTSCENE: church_first_visit — LOCATION: Grace Street Fellowship — TIME: day
[Trigger: first approach, Chapter 3. Turbo is here to ask for money.]

SHOT 1 — WIDE, 3.6s, static. A gravel lot. A low brick building that used
  to sell washing machines. A board out front with movable letters, one of
  which is upside down.
  ACTION: Turbo stands in the lot for a while. He goes in.

SHOT 2 — WIDE interior, 3.0s. Forty folding chairs. Cornelius stacking
  them, alone, at four in the afternoon.

SHOT 3 — MEDIUM, 3.4s.
  CORNELIUS: "Terrence."
  TURBO: "Nobody calls me that."
  CORNELIUS: "I'm not nobody. Grab that end."

SHOT 4 — WIDE, 4.0s. They stack chairs. Neither says anything for a while
  and the scene lets that be long.

SHOT 5 — MEDIUM two-shot, 4.4s.
  CORNELIUS: "You've been out eleven days."
  TURBO: "Twelve."
  CORNELIUS: "Twelve. And this is Tuesday, so you want something, because
    you've never once come here on a Tuesday."

SHOT 6 — CLOSE on Turbo, 3.4s.
  TURBO: "I need thirty-four hundred dollars." [OR "fifty-six hundred"]

SHOT 7 — CLOSE on Cornelius, 4.6s. No sermon. He puts the chair down.
  CORNELIUS: "No."

SHOT 8 — MEDIUM, 4.0s.
  TURBO: "You didn't even—"
  CORNELIUS: "I don't have it. That's the first answer and it's the true
    one, so I'm giving it to you first. There's four hundred and ten dollars
    in the account and two hundred of that is the gas bill."

SHOT 9 — CLOSE on Cornelius, 4.6s.
  CORNELIUS: "The second answer is that if I had it I'd have to think very
    hard about it, and I'd like you to notice that I told you the true one
    first instead of hiding behind the hard one. Your mother used to catch
    me doing that."

SHOT 10 — WIDE, 3.0s, fade.
  CORNELIUS: "Stay and stack the chairs. It's an hour. You've got nowhere
    to be that's better than this."
```

```
CUTSCENE: church_the_collection — LOCATION: Grace Street Fellowship — TIME: evening
[Trigger: second visit. Turbo tries to give money instead of take it.]

SHOT 1 — MEDIUM, 3.4s. Turbo puts a folded stack on the table by the door
  — the collection plate, essentially. It is not a small amount.
  ACTION: Cornelius looks at it. Does not pick it up.

SHOT 2 — CLOSE on Cornelius, 4.0s.
  CORNELIUS: "Where's that from."
  TURBO: "Does it matter?"
  CORNELIUS: "It's the only thing that matters about money, Terrence, it's
    the only quality it has. A dollar's a dollar. Where it's from is the
    entire difference between a gift and a problem."

SHOT 3 — MEDIUM two-shot, 4.4s.
  TURBO: "I worked for it."
  CORNELIUS: "Doing what."
  TURBO: "...moving some things at the harbour."
  CORNELIUS: "Moving some things at the harbour."

SHOT 4 — CLOSE on Cornelius, 5.0s. Something goes across his face that
  Turbo does not have the context to read. The camera stays on it two beats
  longer than the line needs. This is the plant for C3.
  CORNELIUS: "...take it back."

SHOT 5 — MEDIUM, 4.0s.
  TURBO: "It's four hundred dollars, Pop, the gas bill's two—"
  CORNELIUS: "Take it back."
  TURBO: "You'd rather be cold."
  CORNELIUS: "I'd rather be cold. That's not a hard question for me and I'm
    sorry it looks like one from where you're standing."

SHOT 6 — CLOSE on Turbo, 3.6s. Genuinely angry, first time this chapter.
  TURBO: "That's not principle. That's just you being able to say no to me
    about something. You've been looking for one of those for twenty years."

SHOT 7 — CLOSE on Cornelius, 4.6s. He takes it, and it lands.
  CORNELIUS: "...that may be true. I'll sit with that. I'm still not taking
    the money."

SHOT 8 — WIDE, 2.6s, fade.
```

```
CUTSCENE: church_the_road — LOCATION: the gravel lot — TIME: night
[Trigger: third visit. Cornelius tells him about 1984. The strand's core.]

SHOT 1 — WIDE, 3.6s. The lot. Cornelius sitting on the step. An old sedan
  parked at the far end under a tarp, which has been in the background of
  every church scene so far.

SHOT 2 — MEDIUM two-shot, 3.4s.
  TURBO: "That car's been under that tarp my whole life."
  CORNELIUS: "It has."
  TURBO: "You don't drive."
  CORNELIUS: "No."

SHOT 3 — CLOSE on Cornelius, 4.6s.
  CORNELIUS: "I drove for eight years. I was very good at it. I want to be
    accurate about that with you, because I've let you think I was afraid of
    it, and I wasn't. I was the best driver anybody I knew had ever been
    in a car with."

SHOT 4 — CLOSE on Turbo, 3.0s. He didn't know any of this.
  TURBO: "Drove what."

SHOT 5 — MEDIUM, 5.0s.
  CORNELIUS: "Goods. Up the coast, out of the harbour, for men whose names
    I'm not going to say to you in a parking lot. Eight years, never caught,
    never even stopped. Paid better than anything I've done since by a
    factor I'd rather not calculate."

SHOT 6 — CLOSE on Cornelius, 5.4s. Flat. He's told nobody this.
  CORNELIUS: "In eighty-four I took a curve on the coast road in the rain
    at a speed I had taken it at forty times. Errol Vance was in the seat
    beside me. He was twenty-six. He was still there when I got out of the
    car and he was not there four minutes later, and I want to be clear that
    nothing happened to me. No charges. No hearing. Not one man in a uniform
    ever asked me a question about it. That is the part I have carried."

SHOT 7 — MEDIUM two-shot, 4.6s.
  TURBO: "You never told me."
  CORNELIUS: "No."
  TURBO: "Mom?"
  CORNELIUS: "Your mother knew. Your mother married me anyway, which is the
    single most generous thing that has ever been done in my presence."

SHOT 8 — CLOSE on Cornelius, 5.0s.
  CORNELIUS: "I walked eleven miles that night. Down the shoulder, in the
    rain, past three places I could have stopped. And at six in the morning
    a woman opened a chapel off the interstate and found a man sitting in
    her lot, and she made him coffee and did not ask him one single
    question, and I have been trying to be her ever since. That's it.
    That's the whole conversion. It's not a good story. There's no light
    in it."

SHOT 9 — CLOSE on Turbo, 4.4s.
  TURBO: "Why now."
  CORNELIUS: "Because you told me you were moving things at the harbour and
    I have been sick since Tuesday."

SHOT 10 — WIDE, 3.6s, fade.
  ACTION: Neither of them moves. The tarp on the car doesn't move either.
```

```
CUTSCENE: church_the_rule — LOCATION: inside, folding chairs — TIME: day
[Trigger: after church_the_road]

SHOT 1 — MEDIUM two-shot, 3.4s. Chairs again. It's what they do instead of
  looking at each other.
  TURBO: "Can I ask you the other thing."
  CORNELIUS: "The cheerleaders."
  TURBO: "The cheerleaders."

SHOT 2 — CLOSE on Cornelius, 4.6s.
  CORNELIUS: "You've been angry about that for nineteen years and you've
    never once asked me why. You've told the story a hundred times. You
    told it to a man at my own door last spring."

SHOT 3 — MEDIUM, 4.4s.
  TURBO: "So why."
  CORNELIUS: "Because you were me."

SHOT 4 — CLOSE on Cornelius, 5.0s.
  CORNELIUS: "That's the answer and it's smaller than you've been imagining
    it. You were sixteen and fast and you had a face that got you out of
    things, and I watched you use it on a Thursday and I felt my own
    stomach drop, because I knew exactly where that goes. I know the whole
    road. I drove it for eight years."

SHOT 5 — MEDIUM two-shot, 4.6s.
  TURBO: "So you just — put a fence up."
  CORNELIUS: "I put every fence up I could find, and I put them up badly,
    and I put them up on a boy who hadn't done anything yet. Yes."

SHOT 6 — CLOSE on Cornelius, 4.4s.
  CORNELIUS: "And you jumped every one of them except that one. Which I've
    thought about a great deal, Terrence. Out of everything I ever told you
    not to do, that's the one you kept. I don't know what to do with that."

SHOT 7 — CLOSE on Turbo, 5.0s. The realest thing he says to his father.
  TURBO: "It was the only one where you told me why. You said 'because I'm
    asking you.' You never said that about anything else. Everything else
    was rules."

SHOT 8 — CLOSE on Cornelius, 4.4s.
  CORNELIUS: "...I don't remember saying that."
  TURBO: "I know."

SHOT 9 — WIDE, 3.0s, fade.
```

```
CUTSCENE: church_the_ledger — LOCATION: the church office — TIME: day
[Trigger: after church_the_rule. Chapter 3's detonation.]

SHOT 1 — MEDIUM, 3.4s. A back office the size of a closet. Cornelius
  looking for something in a drawer. A checkbook register on the desk,
  open, facing the camera.
  ACTION: Turbo, waiting, glances at it. Then doesn't stop glancing at it.

SHOT 2 — CLOSE on the register, 4.0s. A column, going back years, in the
  same handwriting. Sixty dollars. Sixty dollars. Sixty dollars.
  Every entry says the same thing in the memo line: **D. JONES.**

SHOT 3 — CLOSE on Turbo, 4.4s.
  TURBO: "What is this."

SHOT 4 — MEDIUM, 3.6s. Cornelius doesn't turn around immediately. When he
  does, he doesn't pretend not to know what Turbo's looking at.
  CORNELIUS: "That's the register."
  TURBO: "It says D. Jones. Every month it says D. Jones."

SHOT 5 — CLOSE on Cornelius, 4.6s.
  CORNELIUS: "Sixty a month. Since the spring you went in."
  TURBO: "Four years."
  CORNELIUS: "Four years and some."

SHOT 6 — MEDIUM two-shot, 5.0s. Turbo is not shouting yet. He is working
  out which thing he's angry about, and there are several, and the scene
  lets him fail to pick.
  TURBO: "Does she know it's from you?"
  CORNELIUS: "She knows. She sends a card at Christmas."
  TURBO: "Does she — " He stops. " — does she think it's from me?"
  CORNELIUS: "No. I made sure of that. That would have been a lie and it
    would have been the worst kind, the kind that helps."

SHOT 7 — CLOSE on Turbo, 4.6s.
  TURBO: "Why didn't you tell me."
  CORNELIUS: "Because it wasn't for you."

SHOT 8 — CLOSE on Cornelius, 5.4s. Not unkind. The kindest possible way to
  say the worst available thing.
  CORNELIUS: "It was never a favor to you, Terrence. I didn't do it so
    you'd owe me and I didn't do it so you'd be shamed by it. There's a
    seven-year-old in this city with my name on him and for four years the
    only thing anyone could count on was sixty dollars a month. That's a
    terrible sentence. I've had to live inside it."

SHOT 9 — CLOSE on Turbo, 5.0s.
  TURBO: "You could've told me. In there. You visited eleven times, you
    could have said one—"
  CORNELIUS: "And what would you have done with it."

SHOT 10 — CLOSE on Turbo, 4.6s. He doesn't have an answer, and the camera
  makes him sit in it.

SHOT 11 — WIDE, 3.6s, fade.
  CORNELIUS: "That's what I thought, son. That's what I thought every one
    of the eleven times."
```

```
CUTSCENE: church_testimony — LOCATION: Grace Street, morning of the 11th — TIME: dawn
[Trigger: morning of day 11, if the player has visited the church 2+ times.
 This is what puts Cornelius in the back row of the_hearing.]

SHOT 1 — WIDE, 3.0s. Six in the morning. Cornelius in the lot in a suit
  that is twenty years old and immaculate.
  ACTION: He is waiting. He has been waiting a while.

SHOT 2 — MEDIUM two-shot, 3.4s.
  TURBO: "You don't have to come."
  CORNELIUS: "No."
  TURBO: "It's not going to help. They don't let people just talk."
  CORNELIUS: "I know how a courtroom works, Terrence. I've been in more of
    them than you have and I was in them a lot younger."

SHOT 3 — CLOSE on Cornelius, 4.6s.
  CORNELIUS: "I'm not coming to speak. I'm coming to be in the room. Those
    are different and the second one is the one I've been bad at."

SHOT 4 — MEDIUM, 4.0s.
  TURBO: "You came to all four of the other ones."
  CORNELIUS: "I came to the back of all four of the other ones. And I left
    before they read it out, every single time, because I could not sit
    there and hear a stranger describe my son."

SHOT 5 — CLOSE on Cornelius, 4.6s.
  CORNELIUS: "I'm going to sit through it today."

SHOT 6 — WIDE, 3.6s, fade.
  ACTION: They walk to the bus stop together. Neither of them drives. The
    game has never once made a point of Cornelius not driving until this
    shot, and it doesn't make one now either — they just get on the bus.
```

---

# PART D — THE WEIGH STATION (the docks)

**Ruth Kessler** runs the weigh station at the harbour. She pays fairly, on time,
in cash, and asks nothing. She is the most dangerous person in San Chaos for one
reason: **she writes everything down.** Not as leverage. As bookkeeping. She has
eleven years of ledgers in a filing cabinet and she has never once used one
against anybody, and every serious person at the harbour is aware that they
exist.

```
MISSION: Weight                    CHAPTER: 2 / SIDE: the docks   [W1]
Logline: The first honest-looking work Turbo's been offered.
Given by: Ruth Kessler, at the weigh station.
Trigger: approach the weigh station, Chapter 2+.
Archetype: delivery
Setup cutscene: kessler_introduction
OBJECTIVE: move three containers' worth of paperwork and one truck across
  the yard before the shift change.
Reward: $300. Opens W2.
Wanted impact: none. This is the only clean money in the game.
```

```
CUTSCENE: kessler_introduction — LOCATION: the weigh station — TIME: day
[Trigger: first approach]

SHOT 1 — WIDE, 3.0s. A portable office on blocks. A scale. A window with a
  woman behind it and a clipboard in front of her.
  KESSLER: "You're the one who's been asking about work."

SHOT 2 — MEDIUM, 3.4s.
  TURBO: "Depends who's asking."
  KESSLER: "Nobody's asking. I said a sentence. Do you want work or not."
  TURBO: "...yes."

SHOT 3 — CLOSE on Kessler, 4.6s.
  KESSLER: "Three rules and they're not negotiable and I say them to
    everybody in the same order. One: you show up when you say. Two: you
    don't open anything. Three — and this is the one people have trouble
    with — I write down everything you do, with your name on it, in a book,
    and I keep the book."

SHOT 4 — CLOSE on Turbo, 3.4s.
  TURBO: "That's a weird rule for a place like this."
  KESSLER: "It's the only rule for a place like this. Everybody who works
    this yard is a little bit worried about that book, which means nobody
    who works this yard does anything genuinely stupid. It's the cheapest
    security in the harbour and it costs me a pen."

SHOT 5 — MEDIUM, 4.0s.
  TURBO: "And if a cop asks you for the book."
  KESSLER: "Then a cop gets the book. I'm not going to lie to you about
    that and I'm not going to lie to a cop either. That's the arrangement.
    You're free to work somewhere with a worse arrangement and a better
    story."

SHOT 6 — WIDE, 2.6s, fade.
  KESSLER: "Three hundred. Yard's that way. Don't open anything."
```

```
MISSION: Manifest                  CHAPTER: 3 / SIDE: the docks   [W2]
Logline: A container Turbo isn't supposed to open.
Archetype: delivery, with a stationary temptation node midway.
OBJECTIVE: move 4-C-19's neighbour across the yard. The player can open the
  container. Nothing stops them.
Escalation: if they open it: it's restaurant equipment. Ovens. Sixty
  commercial pizza ovens, bound for Chaos Pizza. Not drugs, not guns —
  which is the joke, except the game does not play it as one: Donna
  Marinara imports ovens and the ovens are how the routes work, and the
  fact that it is boring is exactly why nobody has ever looked.
Reward: $350. Opening it sets a flag Part E and Part F both read.
```

```
MISSION: Records                   CHAPTER: 4 / SIDE: the docks   [W3]
Logline: Hardcastle wants the book. Kessler knows he wants the book.
Archetype: conversation node → feeds Part F
Reward: none. Sets up H2/H4.
```

```
MISSION: The Bolt                  CHAPTER: 4 / SIDE: the docks × the shirt
See Part A, M10. Kessler's line at the end of it is the whole point:
```

```
CUTSCENE: kessler_writes_it_down — LOCATION: the weigh station — TIME: day
[Trigger: leaving the yard with the Halloran bolt]

SHOT 1 — MEDIUM at the window, 3.4s.
  KESSLER: "What's in the roll."
  TURBO: "Cloth."
  KESSLER: "From 4-C-19."
  TURBO: "...yeah."

SHOT 2 — CLOSE on Kessler, 4.0s. She opens the book. She writes.
  KESSLER: "Jones. One bolt. Four-C-nineteen. Today's date."

SHOT 3 — MEDIUM, 4.4s.
  TURBO: "You're not going to stop me."
  KESSLER: "No. Nobody's paid the storage on that container since
    two-thousand-six, and I've got a rule about opening things, not about
    what other people open. I'm writing it down. That's the entire
    consequence and it's a real one."

SHOT 4 — CLOSE on Turbo, 3.4s.
  TURBO: "Why does that scare me more than a gun."
  KESSLER: "Because a gun's an opinion and a book's a fact. Go on, you're
    holding up the scale."

SHOT 5 — WIDE, 2.6s, fade.
```

---

# PART E — QUALITY CONTROL (Chaos Pizza)

`CHAPTER1.md` established Donna Marinara and shipped `pizza_warning`. This part
adds the one thing that makes her genuinely dangerous to Turbo: **a legitimate
job offer with a start date on the eleventh.**

```
CUTSCENE: donna_the_route — LOCATION: Chaos Pizza HQ, back office — TIME: night
[Trigger: Chapter 4, after pizza_warning has fired. Turbo is brought in,
 not taken. Nobody touches him.]

SHOT 1 — WIDE, 3.4s. An office behind a pizza kitchen. Paperwork. A route
  map on the wall with sixty pins in it.
  DONNA: "Sit down, Turbo. Nobody's going to do anything to you. If I were
    doing something to you I wouldn't have had you brought to the office,
    I'd have had it done where you were standing."

SHOT 2 — MEDIUM two-shot, 4.0s.
  DONNA: "You've taken nine of my cars in eight days. Nine. I've had drivers
    work for me eleven years and not touch nine cars."

SHOT 3 — CLOSE on Donna, 4.6s.
  DONNA: "So I looked you up, because that's a number that means something
    and I wanted to know what. And what I found is a man with a court date
    and a child and no employment history whatsoever, which is a shame,
    because that first part is a work ethic."

SHOT 4 — MEDIUM, 4.4s. She writes on a napkin and turns it around.
  DONNA: "Four hundred a week. Routes. It's real work, it's on the books,
    and the books are real because the books are how the routes function.
    I'll say that plainly so you don't have to wonder about it."

SHOT 5 — CLOSE on Turbo, 3.6s.
  TURBO: "That's — that's more than anything anybody's said to me all week."
  DONNA: "I'm aware."

SHOT 6 — CLOSE on Donna, 5.0s. The catch, delivered as an administrative
  detail, which is how she delivers everything.
  DONNA: "Start date's the eleventh. Six a.m., every route driver, first
    day is not negotiable and there's never been an exception because the
    day a driver learns the whole route is the day the route works. If you
    miss the eleventh there isn't a twelfth."

SHOT 7 — CLOSE on Turbo, 4.6s.
  TURBO: "My hearing's the eleventh. Nine a.m."
  DONNA: "I know. I said I looked you up."

SHOT 8 — MEDIUM, 5.0s.
  TURBO: "So you're making me pick."
  DONNA: "No. I'm making you an offer with a start date, which every job in
    the world has. You've decided that's a trap because you've never had
    one before. Turbo — this is what having a job is. It's a thing that
    happens on a specific morning whether or not you have something else on."

SHOT 9 — WIDE, 3.4s, fade.
  DONNA: "The napkin's yours. The offer's good until six a.m. on the
    eleventh and then it isn't."
```

**Taking it:** the player can take the job. It pays $400 immediately as an
advance. It also fails the hearing by absence, which routes straight to
`ending_contempt` — a bench warrant for non-appearance. **The game does not warn
the player twice.** Donna warned them once and she was completely honest about
it, which is the strand's whole character note.

---

# PART F — TUESDAY'S PROBLEM (Hardcastle)

`CHAPTER1.md` established Detective Frank Hardcastle as a noir-narrating
recurring nuisance. This part gives him a real case, and the case is not Turbo.

```
CUTSCENE: hardcastle_the_offer — LOCATION: an impound lot — TIME: night
[Trigger: Chapter 4, after the player has worked at least two dock jobs.
 Roads B/C only get the warrant sweetener; road A gets the money version.]

SHOT 1 — WIDE, 3.0s. An impound lot at night. Hardcastle leaning on a car
  that isn't his, eating nothing, drinking nothing, waiting.
  HARDCASTLE: "Terrence Jones. Sit in the car. It's not that kind of sit
    in the car."

SHOT 2 — MEDIUM two-shot in the car, 4.0s.
  TURBO: "You've been chasing me for a week and a half."
  HARDCASTLE: "I've been chasing you for four years and I'd like to stop.
    You're not a case, Jones. You've never been a case. You're a guy who
    steals a sedan when he's frightened, and I know that because I've
    watched you do it eleven times and you always take the same kind."

SHOT 3 — CLOSE on Hardcastle, 4.6s. Dropping the register for once — no
  noir, flat delivery, which is the point of the scene.
  HARDCASTLE: "Ruth Kessler keeps a book. Eleven years of it. Every
    container, every driver, every plate that's come through that scale.
    I have wanted that book since before you went in."

SHOT 4 — CLOSE on Turbo, 3.4s.
  TURBO: "So go get it. You're the cop."
  HARDCASTLE: "I need probable cause and I've got a scale operator who
    hasn't broken a law in eleven years. That's the problem with Ruth. She's
    the most law-abiding person at that harbour and she's the reason the
    whole thing runs."

SHOT 5 — MEDIUM, 4.4s.
  HARDCASTLE: "One page. Photograph one page with a container number on it
    and a date and I've got my cause."

SHOT 6 — CLOSE on Hardcastle, 4.6s. The price.
  HARDCASTLE (roads B/C): "And that warrant with your name on it goes away.
    Not reduced. Away. Like it was never typed. I can do that — that is
    genuinely within what I can do."
  HARDCASTLE (road A): "And there's a fund for this. It's two thousand
    dollars and it's real money and it comes on a county check, which
    means for the first time in your life you could hand somebody a
    receipt."

SHOT 7 — CLOSE on Turbo, 5.0s.
  TURBO: "She writes down everything I do. In the book. If I take a page
    out of that book, my name's on the page before it."
  HARDCASTLE: "...yes."
  TURBO: "You knew that."
  HARDCASTLE: "I knew that."

SHOT 8 — MEDIUM, 4.6s.
  HARDCASTLE: "I've been doing this a long time and I've never once gotten
    anything from anybody who wasn't standing in a hole. That's the job. I
    find the hole and I lower a rope into it and I charge for the rope. You
    can hate that. Most people do it anyway."

SHOT 9 — WIDE, 3.0s, fade.
  HARDCASTLE: "One page, Jones. I'll be at the lot."
```

**If Turbo takes it:** the warrant clears (or $2,000 lands), Kessler's yard
closes within the week, and the last dock scene is her stripping the office with
the book already gone as evidence.

```
CUTSCENE: kessler_closed — LOCATION: the weigh station — TIME: day
[Trigger: two days after giving Hardcastle the page]

SHOT 1 — WIDE, 3.4s. The portable office, door open, boxes. The scale is
  taped off. Kessler carrying a chair out to a truck.

SHOT 2 — MEDIUM two-shot, 4.0s.
  KESSLER: "Don't."
  TURBO: "I didn't say anything."
  KESSLER: "You've got the face on. I've had four people come down here
    this week with that face."

SHOT 3 — CLOSE on Kessler, 4.6s. Not angry. Which is much worse.
  KESSLER: "It was going to be somebody. It's always going to be somebody
    — that's what a book is for, it's a thing that eventually gets taken.
    I knew that when I started it. I wrote in it every day for eleven
    years knowing that."

SHOT 4 — MEDIUM, 4.4s.
  TURBO: "Then why keep it."
  KESSLER: "Because for eleven years nobody at this harbour did anything
    genuinely stupid, and now they will, and that will be somebody's
    problem next year. I'm sixty-one. It won't be mine."

SHOT 5 — CLOSE on Kessler, 4.0s.
  KESSLER: "Page four-oh-eight, by the way. That's the one you gave him."
  TURBO: "I didn't look at the number."
  KESSLER: "No. But I did, and there's a line on four-oh-seven that says
    Jones, one bolt, four-C-nineteen. So he's got you too, and he knew
    that when he asked, and I'd think about what that tells you about your
    new friend."

SHOT 6 — WIDE, 3.0s, fade.
  ACTION: She goes back for another chair. She does not ask him to help
    and he does not offer.
```

**If Turbo refuses:** Kessler finds out that he was asked and said no. She never
mentions it. She just starts giving him the good work — $1,500 across the
remaining days, which is the game quietly paying loyalty better than betrayal
without ever saying so.

```
CUTSCENE: kessler_the_good_work — LOCATION: the weigh station — TIME: day
[Trigger: two days after refusing Hardcastle]

SHOT 1 — MEDIUM at the window, 3.4s.
  KESSLER: "Frank Hardcastle came by."
  TURBO: "...okay."
  KESSLER: "He asked me a lot of questions about a page. Which means
    somebody told him there's a page."

SHOT 2 — CLOSE on Turbo, 3.0s. He doesn't defend himself.

SHOT 3 — CLOSE on Kessler, 4.4s.
  KESSLER: "He also asked me whether you'd been down here on the
    fourteenth, which is a question you only ask when somebody's already
    told you no."

SHOT 4 — MEDIUM, 4.6s. She turns the clipboard around.
  KESSLER: "There's night work. It's boring, it's long, it pays four
    hundred a shift, and I've been holding it for somebody I didn't have
    to think about. That's all I'm going to say about any of this."

SHOT 5 — WIDE, 2.6s, fade.
  KESSLER: "Don't thank me, it's a shift. Don't open anything."
```

---

## Strand cutscene index

| ID | Part | Ch | Notes |
|---|---|---|---|
| `voss_first_sighting` | A | 3 | opens the strand |
| `voss_ask_01` / `voss_ask_02` | A | 3 | repeatable pair |
| `voss_the_kell` | A | 3 | branches on road C |
| `trang_introduction` | A | 3 | |
| `voss_fit` | A | 3 | after the heist |
| `voss_the_cut` | A | 3 | closes Chapter 3 |
| `voss_lends_it` | A | 4 | |
| `shirt_ruined` | A | 4 | fires off the next mission |
| `trang_the_repair` | A | 4 | |
| `kessler_writes_it_down` | A/D | 4 | |
| `voss_the_loan` | A | 5 | night before |
| `halberstam_appraisal` | A | 5 | THE CHOICE |
| `trang_the_window` | A | epilogue | only if sold |
| `prine_stakes` | B | 4 | |
| `coach_eleven_years` | B | 4 | |
| `trey_first` / `trey_the_talk` | B | 4 | |
| `danny_the_jar` | B | 4 | |
| `prine_offer` | B | 4 | THE CHOICE |
| `coach_finds_out` | B | 4 | only if signed |
| `homecoming` | B | 4 | only if refused |
| `church_first_visit` | C | 3 | |
| `church_the_collection` | C | 3 | |
| `church_the_road` | C | 3 | the backstory |
| `church_the_rule` | C | 3 | |
| `church_the_ledger` | C | 3 | the detonation |
| `church_testimony` | C | 5 | puts Dad in the courtroom |
| `kessler_introduction` | D | 2 | |
| `kessler_closed` | D/F | 4 | only if betrayed |
| `kessler_the_good_work` | D/F | 4 | only if refused |
| `donna_the_route` | E | 4 | THE CHOICE |
| `hardcastle_the_offer` | F | 4 | THE CHOICE |
