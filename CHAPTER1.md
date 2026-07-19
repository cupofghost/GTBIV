# GTB IV — Chapter 1: "Paying Debts" (Story Development)

> Companion to `STORY_BIBLE.md` — follow its canon (§3), voice (§4), and templates
> (§8–§11). This document is the **first writing pass**: it fleshes out Chapter 1
> with the characters, locations, and missions the bible flagged as undefined. It
> does not contradict anything already shipped (verified against the live
> `deb_confrontation` / `deb_payoff` cutscenes and the existing mission/gang code
> in `index.html`). Text only — no code. Anything that needs a new mechanic is
> called out in **§7 Engineering Flags**.

---

## 1. New character sheets

### Donna Marinara — "The Anchovy Queen"
```
NAME: Donna Marinara              ROLE: rival / obstacle
One-line: The terrifyingly composed boss of Chaos Pizza, who runs a crime
  syndicate like a five-star franchise with a strict quality policy.
Voice: Never raises her voice. All menace, zero volume — delivered entirely
  in pizza metaphor. Treats felonies as "quality control issues."
  Sample: "You've been sampling my delivery fleet, Turbo. That's not a
  discount. That's a violation of the family recipe."
Wants / Deadline: Total control of San Chaos delivery routes; no deadline —
  she plays a long game, which is scarier than a short one.
Relationship to Turbo: Doesn't know he exists at the start of Chapter 1. His
  habit of jacking her delivery cars for quick debt-cash puts him on her
  radar by the chapter's midpoint.
First appearance: the "pizza_warning" cutscene (§6), triggered once Turbo's
  racked up enough offenses against her fleet.
Arc / payoff: Seeds the ongoing Chaos Pizza / Pizza Wars strand for later
  chapters — this chapter she only warns him.
Gags: Speaks only in food metaphors, even when threatening violence; her
  goons use topping names as code words; her HQ smells inexplicably
  incredible from a block away.
```

### Detective Frank Hardcastle
```
NAME: Detective Frank Hardcastle   ROLE: obstacle / color (recurring)
One-line: A burnt-out detective who narrates his own life like hardboiled
  noir, chasing Turbo like it's his last shot at redemption.
Voice: Gravelly internal monologue, said OUT LOUD, even in broad daylight.
  Genuinely believes he's the last honest cop in San Chaos (he isn't more
  honest than the rest — they're just all equally useless).
  Sample: "The city was a jukebox of sin, and Turbo Jones was its greatest
  hit."
Wants / Deadline: To close "the Jones case" and get off desk duty. No hard
  deadline — this is his whole personality, not a job.
Relationship to Turbo: Recurring low-grade nemesis. Every chase is, in his
  head, the climax of a film only he is watching.
First appearance: cuts into the wanted-level chatter the first time the
  player hits 3 stars (see §7 for the hook).
Arc / payoff: Running gag across the whole game. A good Chapter 2+ beat:
  he nearly catches Turbo and it costs him everything, which deepens the
  parody rather than resolving it.
Gags: Talks about donuts the way noir narrators talk about old flames
  ("One bite and I'm nineteen again"); monologues into his own radio like
  it's a diary no one's listening to.
```

### Marcus "Mookie" Jones — The Kid
```
NAME: Marcus "Mookie" Jones        ROLE: stakes (unseen this chapter)
One-line: Turbo's seven-year-old son, obsessed with monster trucks, and the
  actual reason any of this matters.
Voice: n/a on-screen yet — referenced only.
Wants: For his dad to show up to things.
Relationship to Turbo: The reason the $800 matters. Deb isn't doing "maybe
  next month" anymore because Mookie's been asking about his dad again.
First appearance: unseen in Chapter 1 — a single reference (see the
  `first_score` cutscene, §6) is enough to give the debt a face without
  spending any budget on a new character model.
Arc / payoff: Chapter 2+ hook — trade the abstract "child support" deadline
  for something concrete tied to Mookie (a birthday, a school thing) so the
  stakes sharpen instead of resetting to zero.
Gags: none — played straight, on purpose. This is the game's one sincere
  thread and it should stay that way.
```

### Deb (expanded)
```
NAME: Deb                          ROLE: holds the deadline; not a villain
One-line: Turbo's ex-wife, out of patience for empty promises, holding the
  line for their son whether Turbo likes it or not.
Voice (LOCKED, verbatim — do not alter): "Turbo. We need to talk." /
  "You owe me $800 in child support." / "Pay me, or you go BACK to jail.
  Have fun, Turbo." / "...wow. You actually paid." / "Later, Turbo."
Wants / Deadline: The $800, tonight — not cruelty, just done extending
  credit. Mookie asked about his dad again and "maybe next month" isn't an
  answer anymore.
Relationship to Turbo: Ex-spouse, co-parent, out of patience but not out of
  history with him.
First appearance: `deb_confrontation`, downtown.
Arc / payoff: `deb_payoff` — a flicker of real surprise/respect when he
  delivers, undercut immediately by "Later, Turbo" — she's not convinced
  this sticks.
Gags: none — she's the straight woman the comedy bounces off.
```

---

## 2. New location sheets

```
LOCATION: Deb's Corner              DISTRICT: Downtown
Vibe: Grey office-district intersection that feels out of place in a neon
  city — the one patch of San Chaos where nobody's committing a crime.
What the player does here: story trigger — approach to start
  `deb_confrontation`; return with $800 to trigger `deb_payoff`.
Story hooks: pink beacon marks it; Deb waits, arms crossed, watching Turbo
  approach.
Gags/landmarks: one sad park bench; a "Please Curb Your Dog" sign riddled
  with bullet holes from unrelated chaos two blocks over.
```

```
LOCATION: Chaos Pizza HQ & Turf      DISTRICT: opposite side of the city
Vibe: Purple-and-black neon parlor that smells inexplicably incredible; a
  fleet of delivery scooters and vans queued out front like soldiers.
What the player does here: jack delivery vehicles for quick cash; trigger
  point for the existing Pizza Wars mission; new trigger point for the
  "pizza_warning" cutscene once Turbo's a known problem.
Story hooks: Donna Marinara's base.
Gags/landmarks: an "Employee of the Month" board where every photo is the
  same guy; a topping-shaped mascot statue with a suspicious dent in it.
```

```
LOCATION: The Docks                  DISTRICT: Waterfront
Vibe: Fog and shipping containers — the one place in town people whisper
  about instead of shouting about (peds already say "the docks are hot
  tonight").
What the player does here: target for the "Deep Dish Heist" side mission
  (§4) — sneak in, crack the safe, get out before the alarm.
Story hooks: doubles as a neutral crime-cache location if the Chaos Pizza
  angle isn't wanted for a given playthrough's pacing.
Gags/landmarks: a shipping container stenciled "DEFINITELY NOT EVIDENCE."
```

```
LOCATION: Sunrise Ridge Correctional  DISTRICT: outskirts (skyline only)
Vibe: The "minimum security" Turbo just walked out of — visible as a
  distant silhouette, a standing reminder of the stakes.
What the player does here: nothing playable yet — pure worldbuilding to
  back the intro VO ("I just walked out of minimum security...").
Story hooks: the ever-present threat of "back to jail."
Gags/landmarks: a sign out front reading "163 DAYS WITHOUT AN INCIDENT"
  with the number scratched out and rewritten at least four times.
```

```
LOCATION: The Boardwalk               DISTRICT: Beach
Vibe: Neon arcade games, churro stands, a rollercoaster that is very
  obviously a fire hazard.
What the player does here: home turf for style/stunt side missions — ramps
  already exist here.
Story hooks: none yet — pure flavor and mission-archetype home.
Gags/landmarks: a boardwalk fortune-teller machine that only ever prints
  "YOU'RE GOING TO JAIL."
```

---

## 3. Chapter 1 outline (filled)

```
CHAPTER 1: PAYING DEBTS
Premise: Turbo has until tonight to scrape together $800 for Deb, or it's
  back to jail.
Opens with: intro VO + key-art panels (shipped) → spawnDeb → the
  `deb_confrontation` cutscene.
Story missions (in order):
  1. "We Need To Talk"    — deb_confrontation (shipped)
  2. Earn $800            — open sandbox: store robberies + side hustles
                             (§4) + optional Chaos Pizza / heist strand
  3. "The Warning"        — pizza_warning cutscene (§6, NEW) — a
                             complication, not a hard gate
  4. "Paid In Full"       — deb_payoff (shipped)
Escalation: heat climbs passively from robberies (police pressure); the
  Chaos Pizza strand adds a second, independent pressure (gang attention)
  that doesn't touch the star meter — two different flavors of "getting too
  hot," so the player always has a safer lane if one is spiking.
Climax: paying Deb at her corner — deb_payoff.
Ends with: the existing "CHAPTER 2 COMING SOON" card. This document doesn't
  resolve that — see the Chapter 2 discussion whenever we pick that thread
  up.
New toys/areas unlocked: none new to the map — this pass adds texture to
  what already exists rather than expanding it (per HANDOFF.md, content
  expansion is a later phase).
```

---

## 4. Master mission list — Chapter 1

**Story spine:** We Need To Talk → Earn $800 (sandbox) → The Warning → Paid In Full

**Side hustles (repeatable, fund the spine):**
1. Pie in the Sky — delivery
2. Curb Appeal — style/stunt
3. Grand Turbo Tour — checkpoints
4. Insurance Fraud, Basically — rampage
5. Badge Brigade Blues — heat/survive
6. Deep Dish Heist — heist (Chaos Pizza strand, biggest single payday)

**Standing side strand (already shipped, not gated to Chapter 1):** Pizza
Wars — player-triggered anytime via the existing `M` key; unrelated to the
debt clock, referenced narratively by Donna Marinara but not required.

---

## 5. Mission specs

```
MISSION: Pie in the Sky            CHAPTER: 1 / SIDE: Hustle
Logline: Jack a Chaos Pizza delivery car and get three pies across town
  before they're stone cold.
Given by: opportunity — a Chaos Pizza delivery car idling nearby
Trigger: enter/steal a marked pizza vehicle
Archetype: delivery
Setup cutscene: none — toast only ("Deliver 3 pies before they go cold!")
OBJECTIVE: drive the jacked pizza car to 3 delivery markers before the
  timer runs out; keep the car above 40% HP.
Escalation / complication: Chaos Pizza drivers who spot their car chase and
  try to run Turbo off the road.
Fail states: timer out / car destroyed / van abandoned too long.
Reward: $80–150, scaling with deliveries completed. Also increments a
  hidden "pizza heat" counter (see §7) toward "The Warning."
Wanted impact: none directly from cops.
Dialogue hooks: jack bark ("Extra hot, extra stolen" — new, §8); drop-off
  bark; Chaos Pizza driver taunt during the chase (§8 goon pack).
Payoff cutscene: none — toast "+$120, pizza's here!"
Ties to spine: fast repeatable cash; seeds the Chaos Pizza strand.
```

```
MISSION: Curb Appeal                CHAPTER: 1 / SIDE: Hustle
Logline: A boardwalk gearhead bets Turbo can't catch air and drift like he
  claims.
Given by: a street-racer ped at the Boardwalk (flavor only — reuses an
  existing ped, no new model needed)
Trigger: approach the marked ramp cluster at the Boardwalk
Archetype: style/stunt
Setup cutscene: none — toast challenge text.
OBJECTIVE: score air + drift points in 60 seconds (existing style scoring).
Escalation / complication: none new — the existing timer pressure carries
  it.
Fail states: timer out under the score threshold.
Reward: $60–140, scaled to score.
Wanted impact: none — the safest hustle in the chapter.
Dialogue hooks: Turbo boast bark on a big score; racer taunt (new, small
  pack, §8).
Payoff cutscene: none — toast "+$100, showoff."
Ties to spine: no-heat cash source for a cautious player.
```

```
MISSION: Grand Turbo Tour           CHAPTER: 1 / SIDE: Hustle
Logline: Somebody's running an underground time-trial and put decent money
  on Turbo's name without asking him first.
Given by: phone/flyer event (existing generic mission-start flow)
Trigger: existing checkpoint mission start
Archetype: checkpoints / time-trial
Setup cutscene: none.
OBJECTIVE: hit every checkpoint before the clock runs out.
Escalation / complication: optional — if the pizza-heat counter (§7) is
  already up, route one checkpoint through Chaos Pizza turf for a light
  callback. Not required for the mission to work.
Fail states: timer out.
Reward: $70–160.
Wanted impact: none directly.
Dialogue hooks: Turbo bark on checkpoint clear.
Payoff cutscene: none — toast.
Ties to spine: cash, with a light narrative callback if other strands are
  active.
```

```
MISSION: Insurance Fraud, Basically  CHAPTER: 1 / SIDE: Hustle
Logline: A shady contact will pay cash for a very specific amount of
  property damage to a "pre-approved" rental — for the insurance,
  allegedly.
Given by: phone/flyer event
Trigger: existing rampage mission start
Archetype: rampage
Setup cutscene: none — reframe the toast copy as insurance fraud rather
  than generic chaos, to land the satire.
OBJECTIVE: cause $X of damage within the time limit (existing rampage
  mechanic, unchanged numbers).
Escalation / complication: cops respond faster than a normal rampage —
  "someone" tipped them off (a good future hook for Hardcastle
  specifically suspecting insurance fraud).
Fail states: timer out under the damage target.
Reward: $100–200 — the highest-heat, highest-reward hustle in the chapter.
Wanted impact: heavy heat gain, by design.
Dialogue hooks: reuse the existing Turbo line "Insurance covers that.
  Probably." (already shipped in `TURBO_LINES.runover`) as a mission-start
  or mid-mission bark.
Payoff cutscene: none — toast.
Ties to spine: the "I'm short on time, going loud" option late in the
  chapter.
```

```
MISSION: Badge Brigade Blues         CHAPTER: 1 / SIDE: Hustle
Logline: A job went loud. Now Turbo just needs to not be standing here
  when the badge brigade decides to care.
Given by: automatic — fires when a robbery/rampage spikes the wanted level
Trigger: existing heat/survive mission start
Archetype: heat / survive
Setup cutscene: none.
OBJECTIVE: survive and lose the cops until wanted clears (existing
  mechanic, unchanged).
Escalation / complication: the first time the player hits 3+ stars in a
  session, Hardcastle's voice cuts into the cop chatter instead of the
  generic line (see §7 hook), then falls back to normal chatter after.
Fail states: busted.
Reward: $50–120 flat completion bonus (matches the existing pattern).
Wanted impact: clears on success (existing).
Dialogue hooks: Hardcastle noir-monologue bark pack (§8).
Payoff cutscene: none — toast.
Ties to spine: turns a hot moment into a payday instead of pure
  punishment.
```

```
MISSION: Deep Dish Heist             CHAPTER: 1 / SIDE: Chaos Pizza strand
Logline: Word is Chaos Pizza keeps a cash box at the docks warehouse they
  use for overflow storage — sneak in, crack it, vanish before the alarm
  screams.
Given by: a rumor that surfaces after "Pie in the Sky" has been run a
  couple of times (see §7 for the gate)
Trigger: approach the docks warehouse marker
Archetype: heist (existing spawnGuards/safe-crack systems, unchanged)
Setup cutscene: none required — the existing `trailerSay('heist')` line
  already covers the briefing beat.
OBJECTIVE: sneak in, deal with/avoid guards, crack the safe, escape before
  the alarm timer expires (existing heist loop, unchanged).
Escalation / complication: getting spotted mid-heist stacks a wanted-level
  chase on top of the heist's own alarm timer.
Fail states: alarm expires / player wasted or busted mid-heist.
Reward: $250–400 — the single biggest side payday in the chapter.
Wanted impact: sharp gain if botched; none if clean.
Dialogue hooks: Turbo bark on a successful crack; a Donna Marinara line
  played as a toast/radio bark shortly after ("Somebody's been in my dough
  box.") — this is the natural trigger for "The Warning" if it hasn't
  fired yet.
Payoff cutscene: none required on its own, but strongly recommend it feeds
  straight into `pizza_warning` (§6) if that hasn't played yet.
Ties to spine: the biggest non-story payday, and the strongest single push
  into the Chaos Pizza strand.
```

---

## 6. Cutscene scripts — new

Two short beats to sit between the confrontation and the payoff, per the
§9 format. Neither touches the locked `deb_confrontation` / `deb_payoff`
lines.

```
CUTSCENE: first_score — LOCATION: wherever Turbo is standing — TIME: current
[Trigger: the first time Turbo's Chapter-1 earnings cross roughly $200]

SHOT 1 — MEDIUM, 2.2s, quick push on Turbo.
  ACTION: Turbo fans out a stack of bills, grinning.
  TURBO: "Two hundred down. Six hundred to go. Piece of cake."

SHOT 2 — CLOSE, 2.6s, cut.
  ACTION: His phone buzzes. He glances at the screen, waves it off without
    answering.
  TURBO: "...I'll call her back. After the cake."

SHOT 3 — WIDE, 1.6s, fade out.
  ACTION: Turbo pockets the phone and the cash, keeps walking.
  (FX: phone buzz sfx under Shot 2, soft fade)
```
*Why this beat:* it's the first crack in Turbo's bravado — the unanswered
call is quietly about Deb, and by extension Mookie, without spending a
single line of on-screen dialogue naming either. Cheap, three shots, and it
gives the debt a pulse between the two Deb scenes.

```
CUTSCENE: pizza_warning — LOCATION: Chaos Pizza turf — TIME: night
  preferred, falls back to current time of day if triggered in daylight
[Trigger: once the pizza-heat counter (§7) crosses its threshold AND the
  player is near Chaos Pizza turf — fires once]

SHOT 1 — WIDE, 2.4s, slow push, purple neon glow.
  ACTION: Two Chaos Pizza goons flank Turbo's path, arms crossed. A third
    holds up a phone on a video call.

SHOT 2 — CLOSE on the phone screen, 3.6s, cut. (FX: small shake)
  DONNA (V.O., through the phone): "You've been sampling my delivery
    fleet, Turbo."

SHOT 3 — MEDIUM two-shot, Turbo and the goons, 3.4s.
  TURBO: "Delivery fleet? I thought those were just... cars. With pizza
    smell."

SHOT 4 — CLOSE on the phone screen, 4.0s, cut. (FX: shake)
  DONNA (V.O.): "That's a violation of the family recipe. Next slice you
    steal, I take something back. Something you'll miss more than a
    pizza."

SHOT 5 — WIDE pull-up, 2.2s, fade out.
  ACTION: The goons step aside. Turbo backs away, hands up, still
    grinning.
  TURBO: "Noted. Extra menace, hold the anchovies."
```
*Why this beat:* it's Chapter 1's complication — raises the stakes without
touching the debt-clock mechanic, introduces Donna Marinara in a way that
plants the ongoing Pizza Wars strand, and ends on a joke so the tone holds.

---

## 7. Engineering flags (things this pass needs from code, not new systems)

Per the bible's guardrail — flagging rather than assuming these exist:

1. **`first_score` trigger:** a one-time check when cumulative Chapter-1
   earnings cross ~$200, mirroring the existing `G.story.debt` threshold
   pattern. Cheap, no new state shape needed beyond a boolean.
2. **Pizza-heat counter:** a small counter (e.g. on `G.story`) incremented
   by jacking Chaos Pizza cars and by completing "Deep Dish Heist," gating
   the `pizza_warning` cutscene once it crosses a threshold and the player
   is near Chaos Pizza turf. Should **not** fire if the player has already
   destroyed Chaos Pizza HQ via the existing Pizza Wars mission — guard
   against that so the warning never plays after the target's already gone.
3. **Hardcastle first-3-star hook:** a one-shot flag so the *first* time a
   session hits 3 stars, a Hardcastle line plays instead of (or before) the
   generic cop chatter; falls back to normal after.
4. **Deep Dish Heist unlock gate (optional):** simplest version is to just
   make it available from the start like the other side missions — the
   "rumor after 2x Pie in the Sky" framing is flavor, not a hard
   requirement. Engineering's call.

None of these are new systems — each rides an existing trigger/toast/bark
pattern already in the codebase (the debt threshold, the wanted-star
transitions, the toast/bark pipeline).

---

## 8. Bark packs — Chapter 1 full line set

Every speaking role in Chapter 1, written to the §11 pack format. Where a
pack extends a category that already ships in `index.html`
(`TURBO_LINES.car`, `CHAT_LINES`, `TALK_LINES`), that's called out so
engineering knows whether to append to an existing array or add a new
category.

### Turbo Jones

```
PACK: store_robbery (NEW category — plays on entering a hold-up, during
  the ~2.6s robbery window)
- "This is a stickup. A polite one."
- "Nobody move. Except the cash. The cash can move."
- "Consider this a donation. To me."
- "I'll take the drawer and a lottery ticket. Scratcher, not Powerball —
  I'm not greedy."
- "Hands where I can see the register."
- "This'll go a lot faster if nobody's a hero."
- "I've got a kid to feed. Don't look at me like that, it's TRUE."
- "Relax, it's insured. Probably."
- "This is between me and the register. You're just standing near it."
(tone note: fast, nervous-confident — playing tough while visibly winging it)
```

```
PACK: store_robbery_success (NEW — fires the moment the take lands)
- "And that's how Daddy pays rent. Sort of."
- "Four hundred to go. Feels like four thousand."
- "Anyone asks, I was never here. I was very obviously here."
- "One store down. San Chaos has, what, a hundred more?"
- "Cha-ching. Minus the ching. It's all quiet, actually."
(tone note: quick relief and triumph, snaps back to breezy)
```

```
PACK: debt_grumble (NEW — low-frequency idle bark while debt is unpaid,
  fires rarely while wandering, same cooldown pattern as existing ambient
  quips like `slow`/`cops`)
- "Eight hundred bucks. That's a lot of quarters."
- "Note to self: don't marry someone smarter than you."
- "Deb's clock is louder than my conscience, and that's saying something."
- "If I had a dollar for every dollar I owe, I wouldn't owe it."
- "Tonight. She said tonight. Very specific woman, my ex."
- "Somewhere out there, a kid thinks I'm cooler than this. Gotta keep that
  going."
- "$800. Not $799. She counted."
(tone note: rueful muttering to himself, comic self-pity — the one
  category that gets close to sincere before he deflects)
```

```
PACK: pizza_jack (extends the SHIPPED `TURBO_LINES.car` category —
  fires specifically when the jacked vehicle is a Chaos Pizza delivery
  car/van, in place of a generic car-jack line)
- "Extra hot, extra stolen."
- "Thirty minutes or it's free. Actually, it's already free."
- "Do I look like a delivery boy? Don't answer that."
- "Special delivery: nothing, to nowhere, on your dime."
- "This one's for the tip jar. My tip jar. Which is my pocket."
- "Objection! I'm allergic to paying for pizza."
- "Fresh outta the oven and outta your parking lot."
(tone note: same register as the shipped car-jack lines — short, punchy,
deflects with a joke)
```

```
PACK: turbo_meets_deb (NEW — optional pre-beat, fires as Turbo closes the
  last few steps into `deb_confrontation`, before her first locked line)
- "Hey Deb. You're looking... like you want to kill me. Cool, cool."
- "Been a minute. You look great. Furious, but great."
- "So, funny story about the eight hundred—"
(tone note: nervous charm — Deb is the one person his jokes visibly don't
  land on; keep it short, he loses momentum fast around her)
```

```
PACK: turbo_pays_deb (NEW — optional, fires the instant the $800 leaves
  his hand, just before the `deb_payoff` cutscene's locked lines)
- "There. Eight hundred, exact change, no confetti."
- "See? I'm basically a functioning adult now."
- "Don't spend it all in one place. Kidding. Spend it on the kid."
(tone note: proud of himself, slightly too proud — first sincere beat of
  the chapter, played for one line before the joke undercuts it)
```

### Deb

Her three confrontation lines and two payoff lines are **locked canon**
(§3/§1 of `STORY_BIBLE.md`) — reproduced here for reference only, not to
be altered:
- "Turbo. We need to talk." / "You owe me $800 in child support." /
  "Pay me, or you go BACK to jail. Have fun, Turbo."
- "...wow. You actually paid." / "Later, Turbo."

```
PACK: deb_idle_wait (NEW and OPTIONAL — small ambient mutters while she's
  standing at her corner waiting, before Turbo gets close enough to
  trigger the confrontation. Does not touch or replace the locked
  DEB_LINES sequence; same speech-bubble mechanism as `debSay`.)
- "(checks phone) Unbelievable."
- "(sigh) Tonight, Turbo. I mean it."
- "(to herself) I should've asked for it in the divorce."
(tone note: muttered to herself, not yet addressed to Turbo — flavor only;
  cut this pack entirely if it dilutes the impact of her first real line)
```

### Donna Marinara

```
PACK: donna_marinara_taunt (radio/toast bark, plays during Pizza Wars or
  repeated pizza-car jacking, before the pizza_warning cutscene has fired)
- "You have odd taste in delivery vehicles, Turbo."
- "Return my scooter. I will not ask a third time."
- "Every crust has its limit."
- "This isn't a rivalry. It's quality control."
- "I hope you like the taste of consequences."
- "A man who steals pizza cars has never truly tasted pizza."
- "I built this fleet from a single scooter and a grudge. Don't test me."
- "You are not a customer. You are a supply-chain issue."
- "Even my dough has more backbone than your excuses."
- "I've buried men for less than a stolen breadstick."
(tone note: calm, clipped, never shouting — the menace is entirely in the
  composure)
```

```
PACK: donna_marinara_repeat_offense (NEW — escalation tier; fires if the
  pizza-heat counter crosses a second, higher threshold AFTER
  pizza_warning has already played once)
- "I warned you once. Warnings are a courtesy. I'm out of courtesy."
- "You're not on my menu anymore, Turbo. You're the special."
- "Somebody bring me a box. A big one."
- "Last time was a conversation. This time is a delivery — of a different
  kind."
(tone note: same composure, dialed up exactly one notch — she still never
  raises her voice, which is the point)
```

### Detective Frank Hardcastle

```
PACK: detective_hardcastle (fires during 3+-star wanted chases)
- "Another night in San Chaos. Another Jones."
- "I've seen a hundred guys like him. I've caught none of them."
- "Dispatch, this is Hardcastle. Tell my captain I said... nothing. Tell
  him nothing."
- "Somewhere, a donut is getting cold. It'll have to wait."
- "The city doesn't forgive. Neither do I. Probably."
- "I used to believe in the system. Now I believe in overtime pay."
- "They call him Turbo. I call him Tuesday's problem."
- "My captain says let it go. My captain's never lost a jukebox to a guy
  in a stolen sedan."
- "Every siren in this city sings the same sad song. I just hum along."
(tone note: hardboiled noir monologue, played completely straight — he
  means every word, which is what makes it funny)
```

```
PACK: hardcastle_high_heat (NEW — escalation tier for 5+ stars, more
  frantic/self-aware than the base pack)
- "This is it. This is the one. It's always the one, until it isn't."
- "Dispatch, requesting backup. And maybe a therapist."
- "If I don't get him tonight, I retire. I say that every night."
(tone note: same register, cranked one notch more desperate)
```

### Chaos Pizza goons

```
PACK: chaos_pizza_goon_taunt (rank-and-file gang members, chase/gunfight
  barks — extends the existing `gangMembers`/`chaosDrivers` entities)
- "Boss said no discounts!"
- "You're not on the delivery schedule, pal!"
- "This one's extra crispy!"
- "Nobody steals the family car!"
- "That's a FAMILY vehicle, chump!"
- "You want a tip? Here's my fist!"
- "Boss is gonna hear about this — and so are your kneecaps!"
- "Get off our route, freeloader!"
(tone note: loud, dumb-muscle energy — the contrast to Donna's cool is
  the joke)
```

### Boardwalk racer (Curb Appeal mission giver)

```
PACK: boardwalk_racer_taunt (ambient challenge lines, plays near the
  Boardwalk ramp cluster / at the start of Curb Appeal)
- "Bet you can't catch air off that ramp without eating pavement."
- "My grandma drifts better than that."
- "Sixty seconds. Make it count, hotshot."
- "Pink slips are so last decade. Just embarrass yourself for free."
- "I've seen shopping carts drift better."
- "Land it clean or don't land it at all."
(tone note: cocky but harmless — bragging-rights rival, not a threat)
```

### Ambient pedestrians

```
PACK: ped_chatter_chapter1 (NEW — interleave into the existing
  CHAT_LINES/TALK_LINES pools; Chapter-1-flavored gossip, same oblivious
  register)
- "Some guy's been jacking pizza cars all week. Bold strategy."
- "Heard Chaos Pizza put a bounty on a 'menace in a bus-pass jacket.'"
- "Guy owes his ex eight hundred bucks, apparently. Yikes, dude."
- "Detective what's-his-name was on the radio again, talking about 'the
  city's soul.' Weird guy."
- "I ordered a pizza an hour ago. Still waiting. Wonder why."
- "Saw a guy rob a store and then just... walk. No running. Confidence."
- "Child support's rough, man. Rougher with a getaway car involved."
(tone note: same fourth-wall-adjacent, oblivious voice as the shipped
  pools — meant to interleave with them, not replace them)
```

---

## 9. What's next

This covers the "flesh out Chapter 1" pass: two new named characters
(Donna Marinara, Detective Hardcastle), the Kid locked to a name/age, five
location sheets, six mission specs, two new cutscenes bracketing the
existing Deb scenes, and a full line pass across every Chapter 1 speaking
role (§8) — Turbo's chapter-specific barks, Donna's two-tier menace, both
Hardcastle tiers, the goons, the racer, and ambient gossip.

Open threads for a follow-up pass, whenever we pick them up: Chapter 2's
premise (what pressure replaces the $800 clock), the radio DJ personas for
the three existing stations (VICE FM, TURBO FM, BOOM BAP 90), and a fuller
pedestrian/ambient bark expansion beyond Chapter 1.
