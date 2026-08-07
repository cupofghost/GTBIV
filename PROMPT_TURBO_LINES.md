# Kimi prompt — generate Turbo Jones lines

> **For the owner, not part of the prompt.** Everything between the `=====` rules
> below is self-contained: paste it into Kimi as-is. It carries the canon, both
> of Turbo's voice registers, the repo's output conventions, and the rejection
> criteria, so Kimi doesn't need repo access.
>
> **Fill in the two bracketed fields at the top of the prompt** (what to write,
> how many). Everything else is fixed.
>
> **If you want TTS audio instead of new writing**, don't use this — paste
> `SCRIPT_TURBO_TTS.md`, which is already flat, numbered, and stage-direction
> free.
>
> Where the output goes when it comes back: new bark packs append to
> `SCRIPT_BARKS.md` (Turbo section) and get mirrored flat into
> `SCRIPT_TURBO_TTS.md`. New cutscenes go in `SCRIPT.md` (spine) or
> `SCRIPT_STRANDS.md` (side strands). Don't paste generated lines into
> `index.html` without a code pass — `TURBO_LINES` is a shipped array with a
> fixed shape.

=====

You are writing dialogue for **Turbo Jones**, the player character of *GTB IV:
San Chaos*, a neon-80s open-world crime game. You are writing for an existing
production with locked canon and a house style. Follow this brief exactly.

## YOUR TASK

Write: **[WHAT — e.g. "a bark pack for Turbo reacting to being tailed by the
process server" / "the cutscene where Turbo tells Voss he sold the shirt" /
"20 more idle lines for the day-counter pack"]**

Quantity: **[HOW MANY — e.g. "10–12 lines" / "one cutscene, 5–7 shots"]**

Output only the finished lines in the format specified at the bottom. No preamble,
no explanation of your choices, no alternatives menu.

---

## 1. WHO TURBO IS

Thirty-four. Just out of minimum security with twelve dollars and a bus pass. His
ex-wife Deb wants child support and has a court date on it. He is a petty
criminal, a fast driver, and a man who has, four separate times over four years,
had the money and bought something for himself instead. The last time it was a
shirt.

He is not stupid, not cruel, and not a schemer. He is impulsive and he is a soft
touch for himself. His stated goal is not redemption — it's a transaction: get
back on his feet and make things right with Deb so she'll leave him alone. Keep
that self-serving framing. He is never in on a joke about himself.

He half-means it about his kid, and that is the only sincere thing in him. Play
it straight and never undercut it.

---

## 2. THE TWO REGISTERS — THIS IS THE MOST IMPORTANT SECTION

Turbo has two voices. Picking the wrong one is the single most common failure
and it will get your output rejected.

### Register A — THE STREET VOICE
What he says to strangers, cars, cops, pedestrians, the city. Loud, fast, present
tense, one line long, deflects everything with a joke. He always means it; he is
never doing a bit.

Canon samples (do not reuse, these are calibration):
- Stealing a car: "Borrowing this. Permanently." / "Keys in the ignition. How thoughtful."
- Running someone over: "That's gonna leave a mark." / "Walk it off, champ!"
- Being chased: "Catch me if you can, badge boys!" / "Eat my exhaust!"

**Use Register A when:** the listener is a stranger, an enemy, a vehicle, a
crowd, or nobody in particular during ordinary gameplay chaos.

### Register B — THE STRAIGHT VOICE
What he says when someone who knows him is listening, or when he thinks nobody
is. Slower. Fewer words. Sentences that stop where they stop instead of turning
into a joke. Often losing the argument. Often not answering the question.

Canon samples:
- "Eight hundred was March. I didn't know there was a March."
- "She's not wrong. That's the thing I keep running into. She's not wrong anywhere."
- "How is he."
- "I've stolen forty cars in eleven days and I've still got the pass."

**Use Register B when:** he's talking to Deb, his father, Desmond Voss, Ilse
Trang, Ruth Kessler, Trey, a judge, or himself. Also any scene about the debt,
the kid, the shirt, or his father.

**When in doubt, use Register B.** If both could fire in the same moment, B wins.
Turbo does not do material in front of people who know him.

---

## 3. HARD RULES

1. **Play it straight. Never write toward a laugh.** The premise is absurd; the
   delivery never is. Do not wink at the camera, break the fourth wall, lampshade
   the absurdity, or signal that a moment is meant to be funny. If humor happens
   it is a byproduct of sincerity, never the target. **Register B material should
   contain no jokes at all.**
2. **The child is never named and never seen.** Turbo has a seven-year-old son.
   Refer to him only as "him," "my kid," "the kid," "a seven-year-old." Never
   invent a name. Never write a scene he appears in.
3. **Invent nothing real.** No real brands, celebrities, songs, lyrics, teams, or
   trademarks. Invented originals only.
4. **PG-13.** Attitude over profanity. Stylized, non-graphic. Keep it
   broadcastable. No slurs, no gore, nothing sexual.
5. **Don't contradict the canon in §4.** Don't invent new characters, locations,
   or game mechanics unless the task explicitly asks for them.
6. **Don't rewrite locked lines.** They're marked LOCKED in §4. You may write
   around them; you may not alter them.
7. **One idea per line.** These are voice-acted barks in a mobile game. If a line
   needs a comma-spliced second clause to land, it's too long — with the exception
   of the deliberate long confessional lines in §5.

---

## 4. LOCKED CANON — do not contradict

**Turbo's backstory, as he tells it** (he is an unreliable narrator and that's a
character trait, not a bug):
- He was the greatest high-school football player anyone ever saw. Fast, strong,
  handsome, by his own account.
- His father wouldn't let him date the cheerleaders, because of church. He
  respected that. He is not over it.
- He got banned from the locker room "for no reason" and so had to quit the team.
  (What actually happened: he blew out the star quarterback's knee in a
  "wrestling match" over a Gatorade. He has called this "no reason" for twenty
  years.)
- Prison diet: hot dogs, three times a day. A standing complaint.
- Why he owes the money: he meant to pay, then bought things he wanted until the
  money was gone.

**The world:** San Chaos City — coastal, neon, skyscrapers, beach, docks,
day/night cycle. Cops are "the badge brigade" and are overwhelmed. Chaos Pizza is
a rival gang with turf and a delivery fleet. The Alumni Wildcats are his old
teammates, still hostile. Sunrise Ridge Correctional is where he came from.

**The money:** $800 in child support, due the first night — that's Chapter 1.
Then it turns out $800 was one month; the arrears are $3,400 more if he paid, or
$5,600 total if he didn't. A hearing is set for the eleventh, nine a.m.,
Department Four. A day counter runs 10 down to 1.

**People, and which register he uses on them:**

| Person | Who they are | Register |
|---|---|---|
| **Deb** | Ex-wife. Deadpan, out of patience, never cruel, never wrong. He loses every exchange with her. | B |
| **Reverend Cornelius Jones** | His father. Ex-wheelman turned pastor. The only person who calls him **Terrence**. Won't take his money. | B — and Turbo sounds about nineteen |
| **Desmond Voss** | 58, permit clerk, owns one extraordinary shirt he bought with his daughter's tuition money 22 years ago. The only relationship where Turbo is the younger man; he defers without noticing. | B |
| **Ilse Trang** | Dry cleaner. Short, declarative. Keeps the shirt alive. | B |
| **Ruth Kessler** | Harbour weighmaster. Pays honestly, writes everything down. | B |
| **Trey Okonkwo** | 17, has Turbo's exact temper. The one person Turbo tries to help. | B, slightly too blunt |
| **Coach Grimsby** | Old coach. Banned him. Drill sergeant. | mixed |
| **Danny Kowalski** | The knee. Now equipment manager. Deadpan. | mixed |
| **Detective Hardcastle** | Cop who narrates his own life like noir. | A |
| **Donna Marinara** | Chaos Pizza boss. Calm, never raises her voice. | A |
| **Pedestrians, cops, gang members** | | A |

**LOCKED LINES — reproduce verbatim if referenced, never alter:**

Turbo's intro narration (already recorded):
1. "San Chaos. The city that never sleeps... because it's too busy causing trouble."
2. "Name's Turbo Jones. I just walked out of minimum security with twelve dollars and a bus pass."
3. "My ex-wife Deb? She wants eight hundred dollars in child support. And she wants it today."
4. "So I pay up... or it's straight back to the slammer. Time to go to work."

Deb's five lines:
- "Turbo. We need to talk." / "You owe me $800 in child support." / "Pay me, or you go BACK to jail. Have fun, Turbo." / "...wow. You actually paid." / "Later, Turbo."

---

## 5. WORKED EXAMPLES — match these

**Good Register A** (street, to a stranger, deflecting):
> "Spare a dollar? I'm eight hundred short."

**Good Register B** (idle, alone, about the debt):
> "Everybody keeps telling me the number like the number's the surprising part."

**Good Register B** (to Deb — he loses, and doesn't reach for a joke):
> "I know what I said last time. I know what I said all four times."

**Good Register B, long form.** Long lines are allowed when he's confessing, and
only then. Note there's no joke anywhere and no button at the end:
> "You're gonna hurt somebody, and it's not going to be a decision. That's the
> part people get wrong about it. You think there's a moment where you choose.
> There isn't one. There's just after."

**BAD — joke button on a Register B line:**
> ~~"Eight hundred bucks. Guess I shouldn't have bought the boat!"~~
> Turbo doesn't have a boat, the line is aimed at a laugh, and it lets him off.

**BAD — self-aware:**
> ~~"Classic Turbo. Never learns, that guy."~~
> He never comments on himself from outside himself. Ever.

**BAD — fourth wall / genre wink:**
> ~~"This city's like a video game where nobody respawns."~~

**BAD — naming the kid:**
> ~~"Gotta do it for little Danny."~~

**BAD — too many ideas in one bark:**
> ~~"Eight hundred bucks, a court date, a warrant, and my dad won't take my calls — some week, huh?"~~
> Split it. One idea per line.

---

## 6. OUTPUT FORMAT

Match the repo's format exactly.

**For bark packs:**

```
PACK: <trigger_name_in_snake_case> (NEW — <one line: what fires this, how
  often, and whether it extends or replaces an existing pack>)
- "line"
- "line"
- "line"
(tone note: <how it should be read — register, pace, what to avoid>)
```

**For cutscenes:**

```
CUTSCENE: <id_in_snake_case> — LOCATION: <where> — TIME: <day/night>
[Trigger: <what plays this>]

SHOT 1 — <WIDE/MEDIUM/CLOSE>, <duration ~s>, <camera note: push in / static / cut>
  ACTION: <what the characters do>
  TURBO: "<line>"
  (FX: <sfx / shake / fade — only if needed>)

SHOT 2 — ...
```

Cutscene rules: 3–6 shots for an ordinary scene (it's a mobile game — respect a
phone player's attention). Shots run 2–5 seconds. Mark CLOSE for emotional beats,
WIDE for establishing. End on a button — a hard line, a threat, or a hook — never
a groaner. The camera never comments on the action.

**End every submission with this signature line, filled in:**

```
Signed: <program> | <model> | <effort>
```
e.g. `Signed: Kimi CLI | K2 | high`

---

## 7. BEFORE YOU SUBMIT — check your own work

Reject and rewrite any line that fails these:

- [ ] Is it the right register for who's listening?
- [ ] Register B lines: is there a joke in it? If yes, cut the joke, not the line.
- [ ] Does Turbo comment on himself from the outside anywhere? Cut it.
- [ ] Does any line name the kid, use a real brand, or break the fourth wall?
- [ ] Is any bark carrying two ideas? Split it.
- [ ] Would this line get a laugh in a table read? If the scene is Register B,
      that's a defect, not a win.
- [ ] Are the locked lines untouched?

=====
