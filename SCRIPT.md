# GTB IV: San Chaos — Full Game Script (Spine)

> **What this is:** the script for the whole game, extrapolated from the shipped
> material and the existing story docs. This file carries the **spine**: the
> synopsis, the five chapters, the Chapter 1 pay/refuse **branch**, and every
> spine cutscene in playing order.
>
> Companions written in the same pass:
> - `SCRIPT_STRANDS.md` — the side strands (the shirt, football, the church, the
>   docks, Chaos Pizza, the detective) with their own cutscene chains.
> - `SCRIPT_CAST.md` — new character sheets, location sheets, state flags,
>   engineering notes.
> - `SCRIPT_BARKS.md` — every bark pack, every speaking role.
> - `SCRIPT_TURBO_TTS.md` — Turbo's lines only, flat and numbered, for TTS.
>
> Follows `STORY_BIBLE.md` §9 cutscene format. Text only, no code.

---

## 0. Read this before you read anything else

### 0a. Register — this pass is written straight

`STORY_BIBLE.md` §2 already says "play it straight," and this pass takes that
literally. **Nothing new here is written toward a laugh.** Turbo still deflects,
but the deflection reads as denial, not as a punchline. Deb is not a shrew. Coach
is not a cartoon. The Reverend is not a bit. Nobody comments on how absurd San
Chaos is.

The shipped comic barks (`TURBO_LINES` in `index.html`, the Chapter 1 packs, the
football packs) are **untouched and still canon**. They're what Turbo says to
strangers, to cars, to cops — the surface. Everything in this script is what he
says to the six people who know him, and that voice is different on purpose. If
the two registers ever sit side by side in the same scene, the straight one wins.

### 0b. Three canon changes this pass makes

Flagging these loudly so nobody has to guess which doc is current.

1. **The kid is never named and is never on screen.** This retires
   "Marcus 'Mookie' Jones" from `CHAPTER1.md` §1. Everyone says "him," "your
   son," "the kid." He is seven. He is never cast, never modeled, never heard.
   The restraint is the point: he's the only thing in the game with real weight
   and he stays offstage the whole time.
2. **Reverend Cornelius Jones appears on screen**, in Chapters 3 and 5, at a
   church. `FOOTBALL_STRAND.md` §1 already wrote him; the shipped `turbo_bowl_payoff`
   deliberately has no Dad actor (owner's 2026-08-02 ruling, asserted in
   `tests/cases/turbo-bowl.test.js`). **That scene stays exactly as it shipped.**
   Dad's on-screen debut is `church_first_visit`, a new scene at a new location,
   and it touches nothing that already exists.
3. **Chapter 1 branches.** Paying Deb and refusing Deb are both real endings to
   the chapter, and both lead into Chapter 2. See §3.

### 0c. Locked lines, do not touch

Deb's five shipped lines and Turbo's four intro-narration lines are locked canon
and appear here only where they already play:

- "Turbo. We need to talk." / "You owe me $800 in child support." / "Pay me, or
  you go BACK to jail. Have fun, Turbo." / "...wow. You actually paid." /
  "Later, Turbo."

Everything else Deb says in this document is new.

---

## 1. Logline & synopsis

**Logline:** A small-time crook fresh out of minimum security has one night to
find $800 for his ex-wife — and then finds out $800 was one month of five.

**Synopsis.** Turbo Jones walks out of Sunrise Ridge Correctional with twelve
dollars and a bus pass. His ex-wife Deb wants $800 in child support by tonight or
she puts him back inside. He spends a day in San Chaos City doing the only work
he knows, and by nightfall he has a decision: hand her the money, keep it, or —
because this is the specific way Turbo Jones has always failed — spend it on a
shirt.

Whichever he does, the next morning tells him the same thing: $800 was March.
There is $3,400 behind it, a lawyer named Renwick behind that, and a hearing on
the eleventh. Turbo has ten days to find money he has never once had.

What he finds instead is a man named Desmond Voss, who works a permit window
downtown and wears the single best shirt Turbo has ever seen. Turbo wants it. He
compliments it, then bargains for it, then follows it, then steals it — and it
doesn't fit, and Desmond doesn't call the police, and instead tells him what the
shirt cost: a semester of his daughter's tuition, twenty-two years ago, and
eleven years of her not calling. Desmond bought a shirt with money that belonged
to his child. So did Turbo. That's the whole friendship, and neither of them says
it out loud.

Around that: a football field on the outskirts is being sold out from under a
coach who has been paying its insurance out of his own pension for eleven years,
and the developer will pay Turbo $2,200 to sign a piece of paper saying the field
is dead. A dock weighmaster will pay him fairly for work she keeps a written
record of, which is what makes her dangerous. A detective who narrates his own
life wants that record and will trade a warrant for it. And on Grace Street,
across a gravel lot, Turbo's father runs a church, calls him Terrence, will not
take his money, will not give him any, and has been quietly sending Deb sixty
dollars a month for four years without telling either of them.

It ends in a courtroom on the eleventh, in a borrowed shirt or a sold one, where
Deb finally says the thing the $800 was always standing in for: the money was
never what she wanted. It was the only thing she could make him give her.

---

## 2. The spine at a glance

| Ch | Title | Pressure | Opens on | Closes on |
|---|---|---|---|---|
| 1 | Paying Debts | $800 tonight | `intro_narration` (shipped) | **THE BRANCH** — pay, refuse, or spend it |
| 2 | Arrears | $3,400 (or $5,600) in ten days | `deb_arrears` / `deb_served` | `hearing_set` |
| 3 | The Meridian | The shirt, and what it costs | `voss_first_sighting` | `voss_the_cut` |
| 4 | Grudge Season | Everyone wants Turbo's signature | `prine_stakes` | `homecoming` |
| 5 | The Eleventh | The hearing | `night_before` | one of three endings |

**Day clock.** Chapter 1 is one day. The hearing is on the eleventh — ten in-game
days out. Chapters 2–4 run across those days; Chapter 5 is the eleventh itself.
The day counter replaces the $800 clock as the pressure and it never pauses. See
`SCRIPT_CAST.md` §4 for the flag shape.

---

## 3. THE BRANCH (Chapter 1's ending — the structural heart of the game)

At the end of Chapter 1 the player is standing at Deb's Corner with, or without,
$800. Three roads out. All three lead to Chapter 2. None of them is a fail state.

```
                      ┌──────────────────────────────────────┐
                      │  END OF DAY 1 — Deb's Corner         │
                      └──────────────────┬───────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
   [A] PAY                          [B] REFUSE                     [C] SPENT IT
   has $800, hands                   has $800, keeps it            bought the Kell
   it over                                                         shirt at VESTRY
        │                                │                                │
  deb_payoff (SHIPPED)             deb_refusal                    deb_empty_handed
        │                                │                                │
        │                                └────────────┬───────────────────┘
        │                                             │
        │                                    the slow thing:
        │                                    THE SERVER, penalties,
        │                                    bench warrant flag
        │                                             │
  deb_arrears                                   deb_served
  $3,400 remaining                              $5,600 remaining
  no warrant                                    warrant: cops start hot
        │                                             │
        └───────────────────┬─────────────────────────┘
                            │
                     hearing_set — the eleventh
                            │
                       CHAPTER 2
```

### The design of it, in one paragraph

Paying is not the safe road and refusing is not the punished road. **Paying is
worse in the short term**, because it proves to Deb and to a court that Turbo
*can* produce $800 in a day, which is the single most damaging fact about him.
**Refusing is worse in the long term**, because Deb stops handling it personally
and hands it to a system that does not get tired. The player should finish
Chapter 2 unsure they picked right. That's the whole point of putting the branch
here instead of at the end.

### What Deb does on each road

She is doing the same thing on all three: **getting money for her son out of a
man who does not produce money reliably.** On road A she escalates because he
demonstrated capacity. On roads B and C she escalates because he demonstrated
refusal. The escalation is identical in kind and different in tone, and she never
enjoys any of it.

| | Road A (paid) | Roads B/C (didn't) |
|---|---|---|
| Her posture | Colder. He's now a payer, so she treats him like one. | Formal. She stops speaking to him directly for two days. |
| The instrument | Renwick files. Hearing on the eleventh. | Renwick files *and* THE SERVER starts following him. Penalties. |
| Remaining owed | $3,400 | $5,600 |
| Cop behavior | Normal | Warrant flag: patrols start one notch hotter |
| Her second ask | "Two hundred a week between now and the hearing." (§4.4) | "Take the plan. I'm offering you the plan." (§4.5) |

### Reconvergence

Both roads reach the same courtroom in Chapter 5. Money paid along the way is
tracked, not branched — the ending is chosen by the **total paid before the
gavel**, not by which road Chapter 1 ended on. A player who refused on day 1 and
then paid $5,600 over ten days gets the same best ending. That's deliberate:
the game's position is that the first decision isn't the one that matters.

---

## 4. CHAPTER 1 — "Paying Debts"

```
CHAPTER 1: PAYING DEBTS
Premise: $800 tonight, or back to Sunrise Ridge.
Opens with: intro narration + key-art panels (shipped) → deb_confrontation.
Story missions:
  1. "We Need To Talk"  — deb_confrontation (SHIPPED)
  2. Earn $800          — open sandbox; the existing hustles fund it
  3. "The Warning"      — pizza_warning (SHIPPED) — optional complication
  4. THE BRANCH         — pay / refuse / spend it
Escalation: cop heat from robberies; Chaos Pizza attention as a second,
  independent pressure. Both already ship.
Climax: the branch at Deb's Corner.
Ends with: deb_payoff (shipped) / deb_refusal / deb_empty_handed.
New this pass: VESTRY opens downtown from the first hour of the game, and
  sells one $800 shirt. That's the third road.
```

### 4.1 New in Chapter 1: VESTRY

A narrow shopfront downtown, four blocks from Deb's Corner. One rack, twelve
shirts, no prices on anything. **Ambrose Kell** runs it and is not a con man —
he is a shirtmaker who correctly identifies that Turbo wants a shirt and will
pay for one. The scene is a temptation, not a scam, and Kell is never written as
predatory.

The shirt is a Kell house cut, $800 exactly. Not a coincidence. Kell prices it
after looking at him.

```
CUTSCENE: vestry_offer — LOCATION: VESTRY, downtown — TIME: day
[Trigger: player enters VESTRY holding $800 or more, any time in Chapter 1.
 Repeatable — Turbo can walk out and come back.]

SHOT 1 — WIDE, 2.6s, slow push through the door. Twelve shirts on one rack.
  ACTION: Turbo stops. He does not touch anything. He looks at the rack the
    way other characters in this game look at cars.

SHOT 2 — MEDIUM on Kell behind the counter, 3.2s.
  KELL: "You've been at that window six minutes. Come in or don't."

SHOT 3 — MEDIUM two-shot, 3.6s.
  TURBO: "How much is the white one."
  KELL: "You don't want the white one. You want the third from the left and
    you've been looking at it since you got here."

SHOT 4 — CLOSE on Turbo, 3.0s.
  TURBO: "...how much is the third from the left."

SHOT 5 — CLOSE on Kell, 3.4s. He does not check a tag.
  KELL: "Eight hundred."

SHOT 6 — CLOSE on Turbo, 4.0s, hold. He does not answer.
  ACTION: He knows the number. Kell knows he knows the number. Neither of
    them says anything about it.
  (FX: no music sting. Let it sit.)

SHOT 7 — WIDE, 2.2s, fade to a prompt.
  KELL: "It'll be here tomorrow. It won't be here in a week."
  (PROMPT: BUY — $800 / LEAVE)
```

**On buying:** the player's money goes to zero, Turbo wears the Kell for the rest
of the game unless he changes, and Chapter 1 ends on road C. There is no undo and
no refund. Kell will not buy it back — see `voss_the_kell` in `SCRIPT_STRANDS.md`
for the scene where Turbo learns what he actually bought.

```
CUTSCENE: vestry_purchase — LOCATION: VESTRY — TIME: day
[Trigger: player confirms the $800 purchase]

SHOT 1 — CLOSE on the counter, 3.0s. Kell folds the shirt in tissue.
  KELL: "You want it in a bag or you want to wear it out."

SHOT 2 — CLOSE on Turbo, 2.8s.
  TURBO: "Wear it out."

SHOT 3 — MEDIUM, 3.6s. Kell hands it across. He is not smug about it.
  KELL: "For what it's worth — you've got the shoulders for a shirt. Most
    men don't. Most men buy the shirt anyway."

SHOT 4 — WIDE, 3.0s, Turbo in the doorway, backlit, the shirt on.
  ACTION: He stands there longer than he needs to.
  TURBO: "It's a good shirt."
  KELL: "It's a good shirt."

SHOT 5 — WIDE, 2.4s, fade out.
  ACTION: Turbo steps into the street. He looks downtown, toward the corner
    where Deb is waiting, and then he goes the other way.
```

### 4.2 ROAD A — Paying

The shipped `deb_payoff` plays exactly as it does today. Nothing here changes it.
The optional `turbo_pays_deb` pack (`CHAPTER1.md` §8) fires before it, unchanged.

Then, the next morning:

```
CUTSCENE: deb_arrears — LOCATION: Deb's Corner — TIME: morning, day 2
[Trigger: the morning after deb_payoff. Fires once. Road A only.]

SHOT 1 — WIDE, 3.0s, static. Grey light. The corner is emptier than it was.
  ACTION: Deb is already there. So is a woman in a coat holding a folder:
    CLAUDIA RENWICK. Renwick stands slightly behind and does not speak yet.

SHOT 2 — MEDIUM two-shot, 3.2s.
  TURBO: "I paid you. Twelve hours ago I paid you."
  DEB: "You did."

SHOT 3 — CLOSE on Deb, 4.2s.
  DEB: "The eight hundred was March."

SHOT 4 — CLOSE on Turbo, 2.6s.
  TURBO: "...March."

SHOT 5 — CLOSE on Deb, 4.6s. Flat. Not enjoying it.
  DEB: "November, December, January, February are behind it. Thirty-four
    hundred. I didn't bring it up last night because I didn't think you'd
    have the eight."

SHOT 6 — MEDIUM two-shot, 4.0s.
  TURBO: "You said eight hundred. You said eight hundred and I got you
    eight hundred."
  DEB: "I said you owe me eight hundred in child support. I never said that
    was all of it."

SHOT 7 — CLOSE on Deb, 4.4s. The turn of the knife, delivered gently.
  DEB: "And you paid it. In a day. Turbo — that's the problem. For four
    years the answer was 'I don't have it.' Last night you proved that was
    never true."

SHOT 8 — MEDIUM, Renwick steps forward, 4.0s.
  RENWICK: "Mr. Jones, Claudia Renwick, I represent Ms. Jones. We filed this
    morning. There's a hearing on the eleventh."

SHOT 9 — CLOSE on Turbo, 3.4s.
  TURBO: "And if I don't have it by the eleventh."

SHOT 10 — CLOSE on Deb, 4.0s, hold, fade out.
  DEB: "Then a judge decides instead of me. You'll like me better."
```

### 4.3 ROAD B — Refusing

The player can walk away from the corner with $800 in hand. He can also stand
there and say no. Deb does not shout. She stops.

```
CUTSCENE: deb_refusal — LOCATION: Deb's Corner — TIME: night, day 1
[Trigger: player triggers the payoff prompt with $800+ and declines, or
 walks out of the trigger radius twice after the prompt has appeared once.]

SHOT 1 — MEDIUM two-shot, 3.0s. He has the money. She can see the shape of
  it in his jacket.
  DEB: "It's in your pocket."
  TURBO: "It's been a day. You have no idea what kind of day."

SHOT 2 — CLOSE on Deb, 3.6s.
  DEB: "Which one is it. You don't have it, or you're not giving it to me."

SHOT 3 — CLOSE on Turbo, 3.4s. He doesn't have an answer ready. That's new
  for him and the camera holds on it.
  TURBO: "...does it change anything?"

SHOT 4 — CLOSE on Deb, 4.2s.
  DEB: "It changes what I tell him."

SHOT 5 — MEDIUM two-shot, 4.0s. Turbo opens his mouth. Nothing comes.
  DEB: "Okay. Then it's not mine to handle anymore."

SHOT 6 — MEDIUM, 3.4s.
  TURBO: "You calling the cops?"
  DEB: "No."

SHOT 7 — CLOSE on Deb, 4.4s.
  DEB: "Cops are a bad afternoon, Turbo. You've had bad afternoons. You're
    good at bad afternoons. I'm doing the slow thing."

SHOT 8 — WIDE, 3.0s, she walks. He doesn't follow. Fade.
  DEB: "You'll hear from someone."
```

### 4.4 ROAD C — He spent it

If Turbo bought the Kell, he arrives at the corner with no money and a very good
shirt. This is the road the character has been walking his whole life and the
scene plays it without a single joke.

```
CUTSCENE: deb_empty_handed — LOCATION: Deb's Corner — TIME: night, day 1
[Trigger: player enters the corner trigger with less than $800 and the
 vestry_purchase flag set.]

SHOT 1 — WIDE, 3.2s, slow push. Turbo walks up. The shirt reads even in the
  sodium light. Deb watches him the whole way in.
  ACTION: She doesn't ask for the money. She looks at the shirt.

SHOT 2 — CLOSE on Deb, 4.0s.
  DEB: "That's new."

SHOT 3 — CLOSE on Turbo, 3.0s.
  TURBO: "Deb—"
  DEB: "How much."

SHOT 4 — CLOSE on Turbo, 4.4s. He could lie. He's a liar. He doesn't.
  TURBO: "...eight hundred."

SHOT 5 — CLOSE on Deb, 5.0s. She nods slowly, several times. She is not
  surprised and that is the worst available reaction.
  DEB: "Okay."

SHOT 6 — MEDIUM two-shot, 4.2s.
  TURBO: "I'm gonna get it. I'm gonna have it by—"
  DEB: "Don't. Genuinely, don't. I've heard this one."

SHOT 7 — CLOSE on Deb, 4.6s.
  DEB: "You know what I keep landing on? It's not that you didn't pay me.
    It's that you got the eight hundred. You went out and you got it, in a
    day, like it was nothing. And then you walked past me to buy a shirt."

SHOT 8 — CLOSE on Turbo, 3.0s. Nothing.

SHOT 9 — WIDE, 3.4s, she goes. Fade out.
  DEB: "You'll hear from someone."
```

### 4.5 Both non-paying roads: THE SERVER

A man in a windbreaker starts appearing. He never runs. He is never hostile. He
is trying to hand Turbo an envelope and he will do it for as long as it takes.
He is credited only as **THE SERVER**.

```
CUTSCENE: deb_served — LOCATION: wherever the player is — TIME: day 3
[Trigger: 48 in-game hours after deb_refusal or deb_empty_handed, the first
 time the player is on foot in a public area. Roads B and C.]

SHOT 1 — MEDIUM, 2.6s, static. A man in a windbreaker, hands empty, waiting.
  SERVER: "Terrence Jones?"

SHOT 2 — CLOSE on Turbo, 2.4s. The given name lands wrong on him.
  TURBO: "Nobody calls me that."

SHOT 3 — MEDIUM, 3.4s. The envelope comes out. Turbo doesn't take it. The
  Server sets it on the ground between them, unhurried.
  SERVER: "You've been served. Hearing's on the eleventh, nine a.m.,
    Department Four. It's all in there, including the new number."

SHOT 4 — CLOSE on the envelope, 2.8s.
  TURBO: "What new number."

SHOT 5 — MEDIUM, 4.0s. The Server is already turning to go. He is polite in
  a way that is much worse than rudeness.
  SERVER: "Fifty-six hundred. There's penalties on the arrears and there's
    costs on the filing. It goes up on the first of the month if we're both
    still doing this."

SHOT 6 — WIDE, 3.0s, fade. Turbo alone with an envelope on the sidewalk.
  ACTION: He picks it up. He doesn't open it.
```

### 4.6 The second ask — Deb comes back for more, both roads

This is the beat the whole branch was built to reach: **on every road, Deb asks
for more money than she originally asked for.** She is not being greedy. She is
being correct, and the script never lets Turbo have the moral high ground here.

**Road A version** — she wants a rate, not a lump sum:

```
CUTSCENE: deb_the_rate — LOCATION: Deb's Corner — TIME: day 4
[Trigger: day 4, player approaches the corner. Road A only.]

SHOT 1 — MEDIUM two-shot, 3.0s.
  DEB: "Two hundred a week."
  TURBO: "That's not — Deb, that's not how any of this—"

SHOT 2 — CLOSE on Deb, 4.2s.
  DEB: "Two hundred a week, between now and the eleventh, and I tell Renwick
    to ask the judge for a payment plan instead of the whole thing at once.
    That's me helping you. I want you to notice that I'm helping you."

SHOT 3 — CLOSE on Turbo, 3.2s.
  TURBO: "You're helping me by asking for more money."
  DEB: "I'm asking for it on a schedule. That's the entire difference and
    it's a big one."

SHOT 4 — MEDIUM two-shot, 4.4s.
  TURBO: "And if I miss a week."
  DEB: "Then I stop helping you, and we do the eleventh the hard way."

SHOT 5 — WIDE, 2.6s, fade.
  ACTION: She doesn't wait for a yes. She's already assuming one.
```

**Roads B/C version** — she wants him on the plan, which is worth more to her
than the lump sum ever was:

```
CUTSCENE: deb_the_plan — LOCATION: a diner across from Deb's Corner — TIME: day 5
[Trigger: day 5, player approaches the corner. Roads B and C. First time
 she has spoken to him directly since the refusal.]

SHOT 1 — WIDE, 3.0s. Booth. Two coffees. She ordered his without asking and
  she got it right, which he notices and doesn't mention.
  DEB: "Sit down."

SHOT 2 — MEDIUM two-shot, 3.6s.
  DEB: "Fifty-six hundred is a number designed to scare you. I'm not going
    to pretend otherwise. Renwick picked it."

SHOT 3 — CLOSE on Turbo, 2.8s.
  TURBO: "It's working."

SHOT 4 — CLOSE on Deb, 4.6s.
  DEB: "Here's the plan. Two fifty a week, wage assignment, five years. You
    sign it before the eleventh and Renwick drops the penalties and asks for
    supervised instead of suspended. You don't sign it, we go in front of
    Bask cold and he does whatever he does."

SHOT 5 — MEDIUM two-shot, 4.0s.
  TURBO: "Five years."
  DEB: "He's seven. Five years is nothing. Five years is half of what's
    left."

SHOT 6 — CLOSE on Turbo, 3.6s. That lands.

SHOT 7 — CLOSE on Deb, 4.2s.
  DEB: "I'm not trying to bury you, Turbo. I'm trying to make you into
    something predictable. That's all this has ever been."

SHOT 8 — WIDE, 3.0s, fade. She leaves cash on the table for both coffees.
```

---

## 5. CHAPTER 2 — "Arrears"

```
CHAPTER 2: ARREARS
Premise: $800 was one month. There are ten days to the hearing and a number
  Turbo has never had in his life.
Opens with: deb_arrears (road A) or deb_served (roads B/C).
Story missions:
  1. "The Number"        — hearing_set; Renwick's paperwork; the day clock starts
  2. "Rate of Return"    — deb_the_rate / deb_the_plan (§4.6)
  3. Earn                — open sandbox; every strand in SCRIPT_STRANDS.md opens
  4. "Nine A.M."         — chapter_two_close
Escalation: the day counter. On roads B/C, the warrant flag makes patrols
  start one notch hotter, so the cheapest money is now the most dangerous.
Climax: none — Chapter 2 is deliberately the wide-open one. It's where the
  player picks which strands they're going to run.
Ends with: chapter_two_close, a quiet beat rather than a set piece.
New areas: the Municipal Records Annex (Voss), Grace Street Fellowship (Dad),
  Wildcats Field's survey stakes (Prine), the dock weigh station (Kessler).
```

```
CUTSCENE: hearing_set — LOCATION: outside the courthouse — TIME: day 3
[Trigger: first time the player passes the courthouse after deb_arrears or
 deb_served. Fires once. This is the scene that starts the day clock.]

SHOT 1 — WIDE, 3.0s, static on the courthouse steps. Renwick on the landing,
  folder under one arm, checking a phone. She is not waiting for Turbo — he
  happens to be here.
  ACTION: Turbo stops at the bottom of the steps.

SHOT 2 — MEDIUM two-shot, 3.4s.
  RENWICK: "Mr. Jones. You shouldn't talk to me without counsel."
  TURBO: "I don't have counsel."
  RENWICK: "I know. That's why I said it."

SHOT 3 — CLOSE on Turbo, 3.0s.
  TURBO: "Can I ask you something as a person and not as a — whatever you
    are."
  RENWICK: "Opposing counsel."
  TURBO: "Sure."

SHOT 4 — CLOSE on Renwick, 4.6s. She answers honestly, which is why she's
  frightening.
  RENWICK: "Ask."
  TURBO: "Does she actually want me in jail."
  RENWICK: "No. She wants a check that arrives. Jail is what she has instead
    of a check that arrives."

SHOT 5 — MEDIUM, 4.0s.
  RENWICK: "The eleventh. Nine a.m. Department Four. Bring everything you
    have, and I mean that literally — bring receipts, bring pay stubs, bring
    a shoebox of nothing if nothing is what you've got. Judges respond to
    effort. They can smell the difference between broke and lazy."

SHOT 6 — WIDE, 2.6s, fade.
  ACTION: She goes up the steps. Turbo stays at the bottom.
  (FX: a title card — TEN DAYS — over the fade. This is the clock going up.)
```

```
CUTSCENE: chapter_two_close — LOCATION: a bus stop, any district — TIME: night
[Trigger: end of in-game day 5, wherever the player is; nearest bus stop.]

SHOT 1 — WIDE, 3.4s, static. A bus shelter. Turbo sitting. No car in frame,
  which is the point.
  ACTION: He takes the bus pass out of his jacket and looks at it.

SHOT 2 — CLOSE on the pass, 3.0s. Bent, soft at the corners, expired.
  TURBO: "Twelve dollars and a bus pass."

SHOT 3 — CLOSE on Turbo, 4.0s. To nobody.
  TURBO: "They give you the pass so you can get to work. That's what it's
    for. That's the whole idea of it. They hand it to you at the desk and
    they say, this is so you can get to work."

SHOT 4 — WIDE, 3.6s. A bus goes past without stopping. He doesn't flag it.
  TURBO: "Six days."

SHOT 5 — WIDE, 2.4s, fade out.
```

---

## 6. CHAPTER 3 — "The Meridian"

Chapter 3's spine is thin on purpose. The chapter belongs to the shirt strand
(`SCRIPT_STRANDS.md` Part B) and the church strand (Part E); the spine's job is
to keep the money pressure audible under them.

```
CHAPTER 3: THE MERIDIAN
Premise: Turbo finds the one thing he wants more than he wants to be out of
  trouble, and it's a shirt, and the man who owns it made the exact same
  mistake twenty-two years ago.
Opens with: voss_first_sighting (Part B).
Story missions:
  1. The Meridian chain, M1–M7 (Part B)
  2. "Collection"        — church_first_visit → church_the_rule (Part E)
  3. "Sixty a Month"     — church_the_ledger — the chapter's real detonation
  4. Earn                — the strands keep paying
Escalation: money coming in from the strands is never quite keeping pace with
  the day counter, and the game should let the player feel that arithmetic.
Climax: church_the_ledger — Turbo finds out his father has been paying Deb
  sixty dollars a month for four years without telling either of them.
Ends with: voss_the_cut — Desmond tells Turbo what the shirt cost him.
```

```
CUTSCENE: chapter_three_close — LOCATION: Grace Street, outside the church — TIME: night
[Trigger: after both church_the_ledger and voss_the_cut have played.]

SHOT 1 — WIDE, 3.6s, static. Gravel lot. One light over the door. Turbo in
  the lot, not going in.
  ACTION: He stands there long enough that it's clearly not indecision.
    He's just standing there.

SHOT 2 — CLOSE on Turbo, 4.4s.
  TURBO: "Sixty a month. Four years. He never said a word about it. Not to
    her, not to me."

SHOT 3 — CLOSE, 4.0s.
  TURBO: "Everybody in my life has been covering the number I wasn't
    covering. Deb. My dad. Some guy at a permit window I met last week has a
    better answer for his kid than I do."

SHOT 4 — WIDE, 3.4s. The light over the door goes off.
  TURBO: "Five days."

SHOT 5 — WIDE, 2.4s, fade out.
```

---

## 7. CHAPTER 4 — "Grudge Season"

The chapter where three separate people offer Turbo money to sign something.
Structurally it's the game's real test: every strand puts a price on a piece of
Turbo's loyalty, and the arrears number makes all three prices look reasonable.

```
CHAPTER 4: GRUDGE SEASON
Premise: Everyone wants Turbo's signature. Prine wants an affidavit that the
  field is derelict — $2,200. Hardcastle wants Kessler's ledger — the warrant
  goes away. Donna wants him on the payroll — $400 a week, starting the
  eleventh. Every one of them nearly covers the arrears.
Opens with: prine_stakes (Part C).
Story missions:
  1. The football chain, G1–G6 (Part C)
  2. "Tuesday's Problem"  — the Hardcastle chain, H1–H4 (Part F)
  3. "The Route"          — Donna's job offer, P2–P3 (Part D)
  4. "Homecoming"         — the exhibition game; the field's last stand
Escalation: three offers, each of which solves the money and costs a person.
  The player can take all three, none, or any combination. The game does not
  editorialize; the epilogue does.
Climax: homecoming — Turbo Bowl replayed with witnesses, so Prine's
  "unused parcel" filing fails.
Ends with: coach_eleven_years — Coach tells him about the insurance.
```

```
CUTSCENE: the_three_offers — LOCATION: n/a, a montage beat — TIME: night, day 7
[Trigger: fires once, the night after any two of Prine/Hardcastle/Donna have
 made their offer. A short reflective beat — the only montage in the game.]

SHOT 1 — CLOSE on a folded affidavit in Turbo's hand, 2.4s.
  PRINE (V.O.): "It's two paragraphs. It's true, by the way. Nobody plays
    on it."

SHOT 2 — CLOSE on Turbo's other hand, a business card, 2.4s.
  HARDCASTLE (V.O.): "One ledger. One name. The warrant evaporates like it
    was never typed."

SHOT 3 — CLOSE on a folded paper napkin with a number on it, 2.4s.
  DONNA (V.O.): "Four hundred a week. Every week. Starting the eleventh."

SHOT 4 — MEDIUM on Turbo, sitting on a curb with all three, 5.0s.
  TURBO: "Every one of these is more money than I've made in a year."

SHOT 5 — CLOSE, 4.2s.
  TURBO: "And every one of them costs me somebody who's still talking to
    me. There's four of those left. I counted. That's not a lot to spend."

SHOT 6 — WIDE, 2.6s, fade.
  ACTION: He puts all three back in his jacket. He doesn't decide tonight.
```

---

## 8. CHAPTER 5 — "The Eleventh"

```
CHAPTER 5: THE ELEVENTH
Premise: Nine a.m., Department Four. Everything that's been running in
  parallel arrives in one room.
Opens with: night_before.
Story missions:
  1. "Night Before"     — night_before; last chance to earn, sell, or borrow
  2. "The Appraisal"    — the shirt decision (Part B, M12) — optional but
                          the game is built to make you consider it
  3. "Department Four"  — the_hearing
  4. Ending             — one of three
Escalation: none. The clock runs out. That's the escalation.
Climax: the_hearing.
Ends with: ending_paid / ending_arrangement / ending_contempt.
```

```
CUTSCENE: night_before — LOCATION: wherever Turbo sleeps — TIME: night, day 10
[Trigger: end of day 10.]

SHOT 1 — WIDE, 3.6s, static. A room. A chair with a shirt on it — whichever
  shirt the player is carrying into tomorrow. The camera frames the chair,
  not Turbo.
  ACTION: Turbo sits on the edge of the bed, looking at the chair.

SHOT 2 — CLOSE on Turbo, 4.4s.
  TURBO: "Nine a.m. Department Four."

SHOT 3 — CLOSE, 5.0s. The most direct he is in the entire game.
  TURBO: "I've been in a courtroom four times. Every time, somebody stood up
    and explained what I'd done, and every time they were basically right,
    and every time I sat there thinking about how they'd gotten one detail
    wrong. Like the detail was the point."

SHOT 4 — CLOSE, 4.6s.
  TURBO: "Tomorrow somebody's going to stand up and explain what I've done
    to a seven-year-old. And I've been sitting here for an hour trying to
    find the detail they've got wrong."

SHOT 5 — WIDE, 4.0s, hold on the chair.
  TURBO: "There isn't one."

SHOT 6 — WIDE, 2.6s, fade to black.
  (FX: no music under this scene. Room tone only.)
```

### 8.1 The hearing

The scene assembles from flags. Every strand the player ran shows up in this
room as either a line item or a person, and the ones they skipped are simply
absent — the game never says "you should have done X."

```
CUTSCENE: the_hearing — LOCATION: Department Four — TIME: morning, day 11
[Trigger: player enters the courthouse on day 11. This is the long one —
 twelve shots, the game's only scene over eight.]

SHOT 1 — WIDE, 3.4s, static. A small, tired courtroom. Deb and Renwick at one
  table. Turbo alone at the other. JUDGE AURELIO BASK on the bench, reading.
  ACTION (conditional): if the player attended church at least twice,
    CORNELIUS JONES is in the back row. If they ran the Voss strand to M11,
    DESMOND VOSS is two rows behind him. Neither is acknowledged yet.

SHOT 2 — MEDIUM on Bask, 3.6s.
  BASK: "Jones and Jones. Support arrears, contempt referral. Ms. Renwick,
    it's your motion, go ahead."

SHOT 3 — MEDIUM on Renwick, 4.4s. She reads. She does not perform.
  RENWICK: "Your Honor, the respondent owes fifty-six hundred dollars in
    back support across five months." [OR: "thirty-four hundred," road A]
  RENWICK: "The petitioner has documented every month. I'd direct the court
    to the third page."

SHOT 4 — CLOSE on the exhibit page in Turbo's hands, 4.0s. A column of
  small deposits. Sixty dollars. Sixty dollars. Sixty dollars.
  ACTION: Turbo's eyes go to the back row.
  (This shot only plays if church_the_ledger has fired. Otherwise skip to 5.)

SHOT 5 — MEDIUM on Bask, 4.2s.
  BASK: "Mr. Jones. You don't have counsel."
  TURBO: "No, sir."
  BASK: "Do you want to say anything? You don't have to. Plenty of people
    don't and it works out about the same."

SHOT 6 — CLOSE on Turbo, 5.0s. He stands. He does not have a speech.
  TURBO: "I've got —"
  ACTION: He puts a stack on the table. What's in it depends on the player:
    cash, a pawn ticket, a signed payment plan, a shoebox of receipts,
    nothing.
  TURBO: "It's not all of it."

SHOT 7 — CLOSE on Turbo, 5.4s. The speech he actually gives.
  TURBO: "I'm not going to stand here and tell you I got unlucky. I've told
    that one in this building before and I think you can all hear it coming.
    I had the money. Four separate times over four years I had the money and
    I bought something instead. That's it. That's the whole case against me
    and it's accurate."

SHOT 8 — CLOSE on Turbo, 4.6s.
  TURBO: "The last one was a shirt. Eight hundred dollars. It's a really
    good shirt." [ROAD C ONLY — otherwise: "The last one was a jacket. Two
    hundred and ten dollars. I still have it. I'm wearing it."]

SHOT 9 — CLOSE on Deb, 4.4s. She is looking at the table, not at him.
  ACTION: This is the first time in the game she has nothing to say.

SHOT 10 — MEDIUM on Bask, 5.0s.
  BASK: "Ms. Jones. You've asked for contempt. Do you still want it?"
  DEB: "...I want him to show up."
  BASK: "That's not one of the things I can order."
  DEB: "I know. That's why I asked for the other thing."

SHOT 11 — CONDITIONAL SHOT, 4.6s. Plays only if Cornelius is present AND
  the player ran the church strand to church_testimony.
  ACTION: Cornelius stands in the back row without being called.
  CORNELIUS: "Your Honor. May I say one thing about my son."
  BASK: "You may not, sir. Sit down."
  ACTION: He sits. He and Turbo look at each other for the first time in the
    scene. That's the whole beat — the gesture, not the testimony.

SHOT 12 — MEDIUM on Bask, 5.0s, fade to the ending.
  BASK: "All right. Here's what we're doing."
  (FX: hard cut to whichever ending the flags select.)
```

### 8.2 The three endings

Selected by **total paid before the gavel**, not by the Chapter 1 road.

```
CUTSCENE: ending_paid — LOCATION: Department Four → a residential street
[Trigger: total paid ≥ the full arrears figure]

SHOT 1 — MEDIUM on Bask, 3.6s.
  BASK: "Arrears satisfied. Contempt referral is withdrawn. Support
    continues at the ordered rate and Mr. Jones — you've caught up once.
    Nobody's ever impressed by catching up once."

SHOT 2 — WIDE, courthouse steps, 3.4s.
  ACTION: Deb comes down the steps. Turbo is at the bottom. They stand there.
  DEB: "Saturday."
  TURBO: "Saturday what?"
  DEB: "Saturday you can see him. Ten to four. Don't be early, it makes it
    weird, and don't be late, because I will never do this again."

SHOT 3 — CLOSE on Turbo, 3.4s.
  TURBO: "Ten to four."
  DEB: "Ten to four."

SHOT 4 — WIDE, 3.0s.
  ACTION: She goes. He watches her the whole way. Then he looks down at
    himself — at the shirt, whichever one he's wearing.

SHOT 5 — WIDE, a residential street, morning light, 4.0s.
  ACTION: Turbo standing on a sidewalk in front of a house we never see the
    inside of. He's early. He's very obviously early. He checks the street
    both ways and then just waits.

SHOT 6 — WIDE, 3.0s, hold, fade to black.
  ACTION: He straightens the shirt. That's the last thing he does.
  (FX: no dialogue in shots 5–6. Room tone, birds, a car somewhere.)
```

```
CUTSCENE: ending_arrangement — LOCATION: Department Four → the corner
[Trigger: partial payment — some money paid, arrears not cleared]

SHOT 1 — MEDIUM on Bask, 4.4s.
  BASK: "Partial satisfaction. I'm ordering a wage assignment, two hundred
    fifty a week, and I'm setting a review in ninety days. Mr. Jones, if
    you miss two consecutive payments the contempt referral comes back and
    it comes back with my signature on it already."

SHOT 2 — MEDIUM two-shot, hallway, 4.0s.
  TURBO: "Ninety days."
  DEB: "Ninety days."
  TURBO: "That's not nothing."
  DEB: "No. It's the first thing that isn't nothing."

SHOT 3 — CLOSE on Deb, 4.6s.
  DEB: "I'm not going to congratulate you. You understand that? A judge had
    to make you do the minimum and you'd like me to be moved by it."

SHOT 4 — CLOSE on Turbo, 3.4s.
  TURBO: "...yeah."
  DEB: "Okay. Then we're fine."

SHOT 5 — WIDE, 3.0s, fade.
  ACTION: She goes one way. He goes the other. Same as Chapter 1's last
    shot, framed identically — but he stops and looks back this time, and
    that's the entire difference.
```

```
CUTSCENE: ending_contempt — LOCATION: Department Four → Sunrise Ridge intake
[Trigger: nothing paid, or effectively nothing]

SHOT 1 — MEDIUM on Bask, 4.6s. Not angry. Bored, which is worse.
  BASK: "Nothing's been paid. Nothing's been offered. Mr. Jones, I've got a
    list this morning and you're not the worst thing on it, and that is the
    most generous statement I'm going to make about you."

SHOT 2 — CLOSE on Turbo, 3.0s. He doesn't argue.

SHOT 3 — MEDIUM on Bask, 4.0s.
  BASK: "Ninety days, county. Purge amount is the full arrears — you can
    walk out any day you pay it. People rarely do."

SHOT 4 — CLOSE on Deb, 4.4s. This is not a victory and the camera makes sure
  of it.
  ACTION: She does not look satisfied. She looks tired in a way that has
    nothing to do with today.

SHOT 5 — WIDE, intake desk, 3.6s.
  ACTION: A tray. Turbo empties his pockets into it: keys that aren't his,
    a folded receipt, the bus pass.
  CLERK (O.S.): "Anything of value."
  TURBO: "...no."

SHOT 6 — CLOSE on the bus pass in the tray, 4.0s, hold, fade to black.
  (FX: silence. No Turbo line over this. He gets the last word in every
   other ending and deliberately not in this one.)
```

---

## 9. What each ending needs from the player

Stated plainly so engineering can wire it and so the writer can check the
arithmetic works.

| Ending | Condition | Reachable from |
|---|---|---|
| Paid | total paid ≥ arrears ($3,400 road A / $5,600 roads B/C) | all three roads |
| Arrangement | $1 ≤ total paid < arrears | all three roads |
| Contempt | total paid = $0 | all three roads |

**The money is reachable on every road.** Rough ceiling across ten days if the
player runs everything: store robberies and the shipped hustles (~$150/day
sustainable), the Deep Dish Heist ($250–400, once), Kessler's dock work
($1,500 total across W1–W4), Prine's affidavit ($2,200), the Meridian at pawn
($1,900), Donna's payroll (nothing before the eleventh — it's a trap on the
timeline, not on the money). The $5,600 road requires taking at least one of the
three offers, which is the intended squeeze.

---

## 10. Cutscene index — spine

| ID | Ch | Trigger | New/Shipped |
|---|---|---|---|
| `intro_narration` | 1 | game start | SHIPPED |
| `deb_confrontation` | 1 | approach Deb's Corner | SHIPPED |
| `first_score` | 1 | earnings cross $200 | SHIPPED |
| `pizza_warning` | 1 | pizza heat threshold | SHIPPED |
| `vestry_offer` | 1 | enter VESTRY with $800+ | NEW |
| `vestry_purchase` | 1 | confirm the purchase | NEW |
| `deb_payoff` | 1 | pay $800 | SHIPPED |
| `deb_refusal` | 1 | decline with money in hand | NEW |
| `deb_empty_handed` | 1 | arrive broke after buying the Kell | NEW |
| `deb_arrears` | 2 | morning after payoff | NEW |
| `deb_served` | 2 | 48h after refusal/empty-handed | NEW |
| `hearing_set` | 2 | pass the courthouse | NEW |
| `deb_the_rate` | 2 | day 4, road A | NEW |
| `deb_the_plan` | 2 | day 5, roads B/C | NEW |
| `chapter_two_close` | 2 | end of day 5 | NEW |
| `chapter_three_close` | 3 | after ledger + cut | NEW |
| `the_three_offers` | 4 | two offers made | NEW |
| `night_before` | 5 | end of day 10 | NEW |
| `the_hearing` | 5 | day 11, courthouse | NEW |
| `ending_paid` / `ending_arrangement` / `ending_contempt` | 5 | gavel | NEW |

Strand cutscenes are indexed at the end of `SCRIPT_STRANDS.md`.
