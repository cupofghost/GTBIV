# GTB IV: San Chaos — Bark Packs (script pass)

> Companion to `SCRIPT.md`, `SCRIPT_STRANDS.md`, `SCRIPT_CAST.md`. Every
> speaking role's line pack for the new material, in `STORY_BIBLE.md` §11 format.
>
> **Nothing here replaces a shipped pack.** `TURBO_LINES` in `index.html`, the
> Chapter 1 packs in `CHAPTER1.md` §8, and the football packs in
> `FOOTBALL_STRAND.md` §7 all still ship and are all still canon. These are
> additions, and they're written in the straight register described in
> `SCRIPT.md` §0a.
>
> Turbo's packs are duplicated flat and numbered in `SCRIPT_TURBO_TTS.md` for
> generation. This file is the one with the tone notes.

---

## How the two Turbo registers coexist

The shipped barks are what Turbo says **outward** — to strangers, cars, cops,
pedestrians, the city. Loud, fast, deflecting. That is 90% of his runtime and it
does not change.

These packs are what he says **when someone he knows is listening, or when he
thinks nobody is.** Slower. Fewer words. No punchline at the end of the sentence.
The gap between the two registers is the character, and the game gets it for free
by simply keeping both.

**Rule for whoever wires these:** if a pack in this file and a shipped pack could
both fire in the same moment, the pack in this file wins. Turbo does not do
material in front of Deb, Voss, Cornelius, Trang, Kessler, or Trey.

---

# TURBO JONES

```
PACK: debt_grumble_arrears (NEW — replaces the shipped debt_grumble pool once
  G.story.arrears is set. Same rare-idle cooldown, same trigger shape. The
  shipped debt_grumble stays live for all of Chapter 1.)
- "Thirty-four hundred." [OR "Fifty-six hundred." — swap on branch]
- "Eight hundred was March. I didn't know there was a March."
- "Four years of months. I never once counted them."
- "Everybody keeps telling me the number like the number's the surprising part."
- "Nine days."
- "I've made eight hundred dollars in a day. I've never made eight hundred
  dollars in a day twice."
- "She's not wrong. That's the thing I keep running into. She's not wrong
  anywhere."
- "There's a version of this where I had four hundred dollars a year ago and
  I sent it. Just that. Just once."
- "I keep waiting for the part where somebody's unfair to me."
(tone note: flat, low, to himself, at half the speed of his street barks. No
  punchline. If a line here gets a laugh, it's written wrong.)
```

```
PACK: day_counter (NEW — one line on each in-game day rollover, in order.
  Fires once per day, quietly, no cutscene.)
- "Ten days."
- "Nine."
- "Eight."
- "Seven. That's a week. A week is a real amount of time."
- "Six."
- "Five."
- "Four."
- "Three."
- "Two."
- "Tomorrow."
(tone note: he stops editorializing around day 7 and just says the number. The
  countdown getting shorter as lines is the whole effect — do not add words back
  in at the end.)
```

```
PACK: turbo_shirt_idle (NEW — rare idle while G.shirt.state is 'seen' or
  'refused'. Chapter 3 only.)
- "It's the collar. It's not the color, it's the collar, it's the way it
  stands up on its own."
- "Twenty-six years at a window in a shirt like that."
- "He's not rich. I've watched him take the bus twice."
- "Halloran and Bly. They shut in oh-six."
- "There's four hundred of them in the world and one of them is on a guy who
  stamps forms."
- "I've got nine days and I'm thinking about a shirt. I'm aware. Being aware
  isn't helping."
(tone note: obsessive, specific, entirely sincere. He is not joking about the
  shirt at any point in this game and the packs must not let him.)
```

```
PACK: turbo_heist_shirt (NEW — during Delicate Cycle, the dry-cleaner heist)
- "Four hundred shirts. Cream, long collar, mother-of-pearl."
- "It's not on this rail."
- "It's Thursday. It's here. It's on a rail in this building."
- "This is a dry cleaner. I've done a bank. This is a dry cleaner."
- "Nobody's coming. That's the worst part. Nobody's even coming."
- "Found it."
(tone note: quiet, focused, faintly embarrassed. The shipped robbery barks are
  performed for an audience — there's no audience here and he drops all of it.)
```

```
PACK: turbo_shirt_wearing (NEW — rare idle while G.shirt.wearing is 'meridian')
- "Shoulders back. That's it. That's the whole trick and it's free."
- "It doesn't fit me. I know it doesn't fit me. I'm wearing it."
- "Twenty-two years he wore this. Every day."
- "Cold water. Always cold."
(tone note: careful with himself, the way people are in borrowed clothes.)
```

```
PACK: turbo_kell_wearing (NEW — rare idle while G.shirt.wearing is 'kell',
  i.e. road C. Bleaker than the Meridian pack, on purpose.)
- "Eight hundred dollars."
- "It's a good shirt. Kell said so and he made it and he'd know."
- "I stood in the shop and I knew the number. I want that on the record. I
  knew the exact number."
- "Four blocks. She was four blocks away."
(tone note: he does not defend the purchase in a single one of these. That's
  the point of the road-C line pool — the character has stopped being able to
  perform about it.)
```

```
PACK: turbo_to_deb (NEW — spoken only in Deb's scenes, as the pre-beat before
  a cutscene or as the response bubble. Overrides the shipped turbo_meets_deb
  pack from Chapter 2 onward.)
- "Okay."
- "I hear you."
- "I'm not going to argue with the number."
- "I know what I said last time. I know what I said all four times."
- "How is he."
- "Don't tell him I asked. Or — no. Tell him. Tell him I asked."
- "I'm going to have it."
- "...I'm not going to have it."
(tone note: he loses every exchange with Deb and the pack is written from that
  position. Short. No jokes at all. "How is he" is the most he ever risks.)
```

```
PACK: turbo_to_voss (NEW — the Thursday node and any Voss proximity bark)
- "Des."
- "You're at the window."
- "I'm not touching the rail."
- "How do you do the same thing for twenty-six years."
- "You could've called the cops. You had it right there. Everybody would've
  said you were right."
- "Shoulders back. I got it. I got it the first time."
(tone note: this is the only relationship in the game where Turbo is the
  younger man, and he plays it that way — he defers, and he doesn't notice
  himself doing it.)
```

```
PACK: turbo_to_dad (NEW — Grace Street proximity barks)
- "Nobody calls me Terrence."
- "Grab that end."
- "Four hundred and ten dollars, Pop."
- "You never told me about the car."
- "Sixty a month."
- "I'm not going to say thank you for it. I don't think you want me to."
(tone note: quiet and much younger than his usual voice — Turbo at Grace
  Street is about nineteen. Nobody remarks on it.)
```

```
PACK: turbo_to_trey (NEW — Wildcats Field, Chapter 4)
- "You're fast."
- "Everybody's fast at seventeen. Some people are fast at thirty-four and it
  doesn't help either."
- "Know which four seconds it is."
- "There's a guy in that shed with a bad knee. Go talk to him instead of me."
- "I'm not the cautionary tale. I'm just the guy standing here. Those are
  close but they're not the same."
(tone note: the only pack where Turbo is trying to be useful to someone. He is
  bad at it and the lines are slightly too blunt, which is correct.)
```

```
PACK: turbo_the_offers (NEW — rare idle while any of the three offers is
  open and unanswered)
- "Twenty-two hundred for two paragraphs and every word of it's true."
- "One page. One page out of somebody else's book."
- "Four hundred a week. Every week. Starting the morning I'm supposed to be
  in a courtroom."
- "Every one of these is a person. That's the thing about all three of them.
  They're all a person."
- "I keep waiting to be offered something that doesn't cost anybody."
(tone note: genuine deliberation. He is not agonizing — he's doing arithmetic
  and finding out the arithmetic includes people.)
```

```
PACK: turbo_night_before (NEW — the night of day 10, wherever the player is)
- "Nine a.m. Department Four."
- "Four times in a courtroom. Four."
- "Every time, somebody stood up and got one detail wrong, and I sat there
  thinking about the detail."
- "There isn't one this time. I've been looking."
(tone note: the plainest he is in the entire game.)
```

```
PACK: turbo_bus_pass (NEW — very rare, any time, on foot, no vehicle nearby)
- "Twelve dollars and a bus pass."
- "They give you the pass so you can get to work. That's what it's for."
- "It's expired. It's been expired since the day they handed it to me."
- "I've stolen forty cars in eleven days and I've still got the pass."
(tone note: he never throws it away and the game never lets him explain why.)
```

```
PACK: turbo_post_hearing_paid (NEW — epilogue idle, ending_paid only)
- "Ten to four."
- "Saturday."
- "Don't be early. She said don't be early."
- "I'm going to be early."
(tone note: the only unguarded happiness in the game. Four lines. Don't add a
  fifth.)
```

```
PACK: turbo_post_hearing_arrangement (NEW — epilogue idle, ending_arrangement)
- "Two fifty a week."
- "Ninety days and then a man in a robe looks at me again."
- "It's not nothing. She said it's the first thing that isn't nothing."
- "I'd like it to be more than not-nothing eventually."
(tone note: sober, working. No self-pity — that's the growth and it's small.)
```

---

# DEB

Her five shipped lines are locked and are not repeated here. Everything below is
new and everything below keeps her established register exactly: deadpan,
economical, out of patience, **never cruel and never wrong.**

```
PACK: deb_arrears_scene (the cutscenes in SCRIPT.md §4.2/4.6 carry her main
  material; these are the connective barks and the repeat-visit pool)
- "The eight hundred was March."
- "I didn't say that was all of it. I said you owed me eight hundred."
- "You paid. In a day. That's the problem and I want you to sit with why."
- "For four years the answer was 'I don't have it.'"
- "Two hundred a week. That's me helping you. Notice that I'm helping you."
- "I'm asking for it on a schedule. That's the whole difference and it's a
  big one."
- "If I stop helping you, we do the eleventh the hard way."
(tone note: flat, unhurried, out of patience years ago. Nothing raised.)
```

```
PACK: deb_refusal_scene (roads B/C)
- "Which one is it. You don't have it, or you're not giving it to me."
- "It changes what I tell him."
- "Then it's not mine to handle anymore."
- "Cops are a bad afternoon. You're good at bad afternoons. I'm doing the
  slow thing."
- "You'll hear from someone."
- "That's new." [the shirt]
- "How much."
- "You went out and you got it. In a day. And then you walked past me."
(tone note: the less she does with these the harder they land. No anger
  anywhere in the pack — she stopped being angry about two years before the
  game starts.)
```

```
PACK: deb_the_plan_scene
- "Fifty-six hundred is a number designed to scare you. Renwick picked it."
- "Two fifty a week, wage assignment, five years."
- "He's seven. Five years is nothing. Five years is half of what's left."
- "I'm not trying to bury you. I'm trying to make you into something
  predictable."
- "That's all this has ever been."
(tone note: the closest she comes to explaining herself, and she does it once.)
```

```
PACK: deb_ambient (NEW — she can now be encountered at the corner across the
  whole game, not just at the two story beats. Rare, 2–3 lines per visit.)
- "You're not on the schedule."
- "If you've got money, say the number. If you don't, don't do the wind-up."
- "He asked about you on Sunday. I told him you were working."
- "That was true, technically. I checked before I said it."
- "Don't buy him anything. Whatever you're about to say — don't buy him
  anything, pay the support."
- "You look tired. I'm not asking."
- "Four days."
(tone note: the "he asked about you on Sunday" line is the single most
  effective thing she says all game. Bury it in the pool; don't front-load it.)
```

```
PACK: deb_hearing
- "...I want him to show up."
- "I know. That's why I asked for the other thing."
- "Saturday. Ten to four."
- "Don't be early, it makes it weird. Don't be late, because I will never do
  this again."
- "I'm not going to congratulate you. A judge had to make you do the minimum
  and you'd like me to be moved by it."
(tone note: "I want him to show up" is the thesis of the entire game. It is
  said quietly, in a courtroom, to a judge, and Turbo is not addressed.)
```

---

# DESMOND VOSS

```
PACK: voss_window (at the Annex, Chapter 3, before the strand opens up)
- "Do you have a form, sir."
- "You do not have a form."
- "It's a shirt. Do you have a form?"
- "Then I can't help you. Next."
- "It isn't for sale, so there's nothing to want."
- "Then this is the exception, and now you've met it."
- "I don't take things from the public."
- "It's a coffee. It's the start of a conversation about a shirt."
(tone note: precise and entirely without hostility. He has worked a public
  window for twenty-six years and Turbo is not close to the strangest thing
  that has happened at it.)
```

```
PACK: voss_thursday (the M8 conversation node, Chapters 3–5)
- "You're wearing that badly."
- "It's a jacket you're wearing like an apology. Shoulders back. There. That
  cost you nothing and it took four seconds."
- "I stand at that window all day and then I go home. That's the entire
  arrangement and I've never once been confused about it."
- "You should try having one."
- "No. You'd tell me a number and then we'd both have to sit with it."
- "Ilse doesn't like people near the rail. It isn't personal, she doesn't
  like me near the rail."
- "Twenty-two years. Four days a week it's on my back and three days a week
  it's on that rail."
- "I've never once been late picking it up. Not once, in eleven years. Make
  of that whatever you like."
(tone note: he offers advice about clothing freely and advice about life never.
  The one time he does — voss_the_cut, shot 10 — is the only time all game.)
```

```
PACK: voss_the_cut_scene (the walk)
- "Nobody tricked me. There was no salesman. The shop was closed."
- "I looked at a shirt through glass for eleven minutes and then I came back
  the next morning when they opened."
- "Twenty-two hundred. Which left me thirty-eight, and thirty-eight is not
  six."
- "She didn't go that year. She went the next year, on loans."
- "She's forty-one. She lives ninety minutes from here."
- "No." [does she call]
- "The day I stop wearing it, it was for nothing. Right now it's at least for
  something. It's for a shirt."
- "The wanting doesn't stop. That's not the lesson."
- "You get old enough to watch yourself do it, and you can decide to be
  somewhere else when it happens. That's the whole thing I've got."
(tone note: no self-pity anywhere in this pack. He is reporting, accurately, on
  a decision he made. That flatness is what makes it land — the second he sounds
  sorry for himself the scene dies.)
```

```
PACK: voss_lends_and_gives
- "Take it."
- "It doesn't fit you. Take it anyway."
- "There's a room on the eleventh where a man is going to decide what you
  are. Give him something to confirm."
- "Don't. If you say something now I'll take it back."
- "What did that cost you."
- "Then it's yours."
- "I've worn that shirt for twenty-two years to make one bad morning mean
  something, and this week it meant something without any help from me."
- "Nine a.m. Shoulders back."
(tone note: he gives it away in the fewest possible words and immediately
  changes the subject, which is how people who mean it actually do it.)
```

---

# ILSE TRANG

```
PACK: trang_counter
- "We're closed."
- "The door is always open. We're still closed."
- "Don't touch the rail."
- "You're standing at touching distance from the rail."
- "Eleven years. Every Thursday. Monday he picks it up."
- "That's not me being difficult. That's the only reason it still exists."
- "He had someone else before me and they were ruining it."
- "Go home. And don't come back Thursday."
- "Cold. Always cold. Warm water sets a stain like it's setting concrete."
- "Because you're going to ruin something eventually and I'd like you to ruin
  it less."
- "The panel's gone. I can rebuild the panel. I can't invent the cloth."
- "Patch it in poplin and it stops being a Meridian the second I do it."
- "Don't tell him you're doing this."
- "It's in Halberstam's window."
- "I'm not going to tell him. He stopped asking about it, which I think he
  did on purpose."
- "I believe you. I've believed everybody who's said that to me."
- "Thursdays are still Thursdays. He still comes. You can still come."
(tone note: short and declarative. She never explains anything twice and never
  softens a sentence after saying it.)
```

---

# AMBROSE KELL

```
PACK: kell_vestry
- "You've been at that window six minutes. Come in or don't."
- "You don't want the white one. You want the third from the left and you've
  been looking at it since you got here."
- "Eight hundred."
- "It'll be here tomorrow. It won't be here in a week."
- "You want it in a bag or you want to wear it out."
- "You've got the shoulders for a shirt. Most men don't. Most men buy the
  shirt anyway."
- "It's a good shirt."
- "Nothing, because you can't have one."
- "Halloran shut in oh-six. There were maybe four hundred Meridians ever cut
  and they were cut to a person."
- "A Meridian isn't a size. It's somebody else's shoulders."
- "I'm telling you it wouldn't fit. Those are different sentences and you
  should learn the difference, it'd save you money."
- "I made it. I stand behind it. But it's not a Meridian, and you knew that,
  and you bought it anyway because you wanted to have bought something."
- "I'm not judging you. I took the eight hundred."
(tone note: a craftsman describing his own work accurately. Never a salesman,
  never predatory, and never apologetic about the transaction.)
```

---

# CLAUDIA RENWICK

```
PACK: renwick
- "Mr. Jones, Claudia Renwick, I represent Ms. Jones."
- "We filed this morning. There's a hearing on the eleventh."
- "You shouldn't talk to me without counsel."
- "I know. That's why I said it."
- "No. She wants a check that arrives. Jail is what she has instead of a
  check that arrives."
- "The eleventh. Nine a.m. Department Four."
- "Bring everything you have, and I mean that literally."
- "Judges respond to effort. They can smell the difference between broke and
  lazy."
- "The respondent owes fifty-six hundred dollars in back support across five
  months." [OR "thirty-four hundred," road A]
- "The petitioner has documented every month. I'd direct the court to the
  third page."
(tone note: professional, unhurried, entirely fair. She never once takes a
  cheap shot and it makes her the most alarming person in Chapter 2.)
```

---

# THE SERVER

```
PACK: server
- "Terrence Jones?"
- "You've been served."
- "Hearing's on the eleventh, nine a.m., Department Four."
- "It's all in there, including the new number."
- "Fifty-six hundred. There's penalties on the arrears and there's costs on
  the filing."
- "It goes up on the first of the month if we're both still doing this."
- "That's fine. I'll be around."
- "I'm not in a hurry, Mr. Jones. I'm paid by the attempt."
(tone note: procedural and unfailingly polite. Never raises his voice, never
  runs, never threatens. The last two lines are what he says if the player
  flees, and they should play at exactly the same volume as the first six.)
```

---

# JUDGE AURELIO BASK

```
PACK: bask
- "Jones and Jones. Support arrears, contempt referral."
- "Ms. Renwick, it's your motion, go ahead."
- "Mr. Jones. You don't have counsel."
- "Do you want to say anything? You don't have to. Plenty of people don't and
  it works out about the same."
- "You may not, sir. Sit down."
- "All right. Here's what we're doing."
- "Arrears satisfied. Contempt referral is withdrawn."
- "You've caught up once. Nobody's ever impressed by catching up once."
- "Partial satisfaction. I'm ordering a wage assignment, two hundred fifty a
  week, and I'm setting a review in ninety days."
- "If you miss two consecutive payments the contempt referral comes back with
  my signature on it already."
- "Nothing's been paid. Nothing's been offered."
- "I've got a list this morning and you're not the worst thing on it, and
  that is the most generous statement I'm going to make about you."
- "Ninety days, county. Purge amount is the full arrears — you can walk out
  any day you pay it. People rarely do."
(tone note: efficient and bored, with two unexpected flashes of kindness. He is
  not a hanging judge and he is not a soft touch; he is a man with a list.)
```

---

# REVEREND CORNELIUS JONES (private register)

His shipped public-register lines (`dad_interrupt` in `FOOTBALL_STRAND.md` §7)
are untouched and still canon. This is the other voice.

```
PACK: cornelius_church
- "Terrence."
- "I'm not nobody. Grab that end."
- "You've been out eleven days."
- "This is Tuesday, so you want something. You've never once come here on a
  Tuesday."
- "No."
- "I don't have it. That's the first answer and it's the true one, so I'm
  giving it to you first."
- "There's four hundred and ten dollars in the account and two hundred of
  that is the gas bill."
- "If I had it I'd have to think very hard about it, and I'd like you to
  notice that I told you the true one first."
- "Your mother used to catch me doing that."
- "Stay and stack the chairs. It's an hour. You've got nowhere to be that's
  better than this."
(tone note: quiet, exact, unsparing with himself first. This is not the
  sermon voice and the two should be immediately distinguishable.)
```

```
PACK: cornelius_the_money
- "Where's that from."
- "It's the only thing that matters about money. It's the only quality it
  has."
- "A dollar's a dollar. Where it's from is the entire difference between a
  gift and a problem."
- "Moving some things at the harbour."
- "Take it back."
- "I'd rather be cold. That's not a hard question for me and I'm sorry it
  looks like one from where you're standing."
- "...that may be true. I'll sit with that. I'm still not taking the money."
(tone note: the pause before "take it back" is the whole performance — the
  harbour is where he drove. He does not explain that here.)
```

```
PACK: cornelius_the_road
- "I drove for eight years. I was very good at it."
- "I've let you think I was afraid of it. I wasn't."
- "Goods. Up the coast, out of the harbour, for men whose names I'm not going
  to say to you in a parking lot."
- "Eight years, never caught, never even stopped."
- "In eighty-four I took a curve on the coast road in the rain at a speed I
  had taken it at forty times."
- "Errol Vance was in the seat beside me. He was twenty-six."
- "Nothing happened to me. No charges. No hearing. Not one man in a uniform
  ever asked me a question about it. That is the part I have carried."
- "Your mother knew. Your mother married me anyway, which is the single most
  generous thing that has ever been done in my presence."
- "I walked eleven miles that night. Past three places I could have stopped."
- "A woman opened a chapel at six in the morning and found a man sitting in
  her lot, and she made him coffee and did not ask him one single question."
- "I have been trying to be her ever since."
- "That's the whole conversion. It's not a good story. There's no light in
  it."
- "Because you told me you were moving things at the harbour and I have been
  sick since Tuesday."
(tone note: he tells it once, flat, in order, with no pauses for effect. He has
  rehearsed this in his head for forty years and it comes out efficiently.)
```

```
PACK: cornelius_the_rule
- "You've been angry about that for nineteen years and you've never once
  asked me why."
- "You told it to a man at my own door last spring."
- "Because you were me."
- "You were sixteen and fast and you had a face that got you out of things."
- "I watched you use it on a Thursday and I felt my own stomach drop, because
  I knew exactly where that goes. I know the whole road."
- "I put every fence up I could find, and I put them up badly, and I put them
  up on a boy who hadn't done anything yet."
- "You jumped every one of them except that one. Which I've thought about a
  great deal."
- "...I don't remember saying that."
(tone note: he concedes everything, immediately, without defending himself
  once. That's the difference between him and his son and neither of them
  notices it in the scene.)
```

```
PACK: cornelius_the_ledger
- "That's the register."
- "Sixty a month. Since the spring you went in."
- "Four years and some."
- "She knows. She sends a card at Christmas."
- "No. I made sure of that. That would have been a lie and it would have been
  the worst kind. The kind that helps."
- "Because it wasn't for you."
- "It was never a favor to you, Terrence."
- "There's a seven-year-old in this city with my name on him and for four
  years the only thing anyone could count on was sixty dollars a month."
- "That's a terrible sentence. I've had to live inside it."
- "And what would you have done with it."
- "That's what I thought, son. That's what I thought every one of the eleven
  times."
(tone note: the least performed thing he says all game. No volume anywhere.)
```

```
PACK: cornelius_hearing_morning
- "I know how a courtroom works, Terrence. I've been in more of them than you
  have and I was in them a lot younger."
- "I'm not coming to speak. I'm coming to be in the room."
- "Those are different and the second one is the one I've been bad at."
- "I came to the back of all four of the other ones."
- "And I left before they read it out, every single time, because I could not
  sit there and hear a stranger describe my son."
- "I'm going to sit through it today."
- "Your Honor. May I say one thing about my son."
(tone note: the last line is the only time the public register surfaces in the
  church strand — he stands up in a courtroom and booms, once, and is told to
  sit down. Play it as a man who couldn't help it.)
```

---

# HOLLIS PRINE

```
PACK: prine
- "Gary. They'll just put them back tomorrow."
- "I'm not enjoying this. I want to say that out loud because you've decided
  I am."
- "I bought a parcel at a county auction. It was advertised for six weeks.
  Nobody bid against me. Nobody came."
- "You wrote a letter. That's not bidding."
- "It's four point one acres and a scoreboard with one working bulb."
- "There's no program, no league, no district use. It's already gone. I'm
  just the man doing the paperwork on it."
- "That's not a threat and it's not a joke. It's a coffee and a conversation."
- "Two paragraphs. Every word of it is true. That's why I want your name on
  it — I don't buy lies, they're expensive later."
- "Twenty-two hundred dollars. Today, in cash, in this room."
- "I know what you owe. It's a public filing, it took me four minutes."
- "I'm telling you I know so you don't have to perform being comfortable."
- "That's not devotion. That's a man who can't stop."
- "In three years he'll be seventy-one and the field will still be empty and
  he'll still be writing that check."
- "Somebody has to be the one who says it out loud. It might as well be
  somebody who gets paid for it."
- "Thirty-one people is a use. For this filing cycle. Which is ninety days."
- "You've bought him a season. I want you to understand exactly what you've
  bought."
(tone note: patient, plain, never raises the offer, never gets angry when he
  loses. Every argument he makes is correct — that is the character and the
  script never gives the player an easy reason to dislike him.)
```

---

# TREY OKONKWO

```
PACK: trey
- "You're the guy in the case. The upside-down jersey."
- "Coach says you were the fastest he ever had."
- "Coach says it like a warning."
- "There's no team. District cut it before I got here."
- "So I'm the fastest guy at a thing that doesn't exist. What's that worth."
- "That's not an answer."
- "I'm running."
- "You don't know me."
- "...okay."
(tone note: guarded and quick. He pushes back on everything and listens to all
  of it, and his last line in trey_the_talk is one word.)
```

---

# RUTH KESSLER

```
PACK: kessler
- "You're the one who's been asking about work."
- "Nobody's asking. I said a sentence. Do you want work or not."
- "Three rules and they're not negotiable and I say them to everybody in the
  same order."
- "One: you show up when you say. Two: you don't open anything."
- "Three: I write down everything you do, with your name on it, in a book,
  and I keep the book."
- "It's the cheapest security in the harbour and it costs me a pen."
- "Then a cop gets the book. I'm not going to lie to you and I'm not going to
  lie to a cop either."
- "You're free to work somewhere with a worse arrangement and a better story."
- "Don't open anything."
- "What's in the roll."
- "Jones. One bolt. Four-C-nineteen. Today's date."
- "Nobody's paid the storage on that container since two-thousand-six."
- "I'm writing it down. That's the entire consequence and it's a real one."
- "A gun's an opinion and a book's a fact."
- "Go on, you're holding up the scale."
(tone note: completely without menace, which is what makes the book work.)
```

```
PACK: kessler_closed (if betrayed)
- "Don't. You've got the face on. I've had four people come down here this
  week with that face."
- "It was going to be somebody. It's always going to be somebody."
- "That's what a book is for. It's a thing that eventually gets taken."
- "I wrote in it every day for eleven years knowing that."
- "For eleven years nobody at this harbour did anything genuinely stupid, and
  now they will."
- "I'm sixty-one. It won't be mine."
- "Page four-oh-eight. That's the one you gave him."
- "There's a line on four-oh-seven that says Jones, one bolt, four-C-nineteen.
  So he's got you too, and he knew that when he asked."
(tone note: not angry once. Explanatory. She is telling him how the world works
  as a courtesy on her way out.)
```

```
PACK: kessler_good_work (if refused)
- "Frank Hardcastle came by."
- "He asked me a lot of questions about a page. Which means somebody told him
  there's a page."
- "He also asked me whether you'd been down here on the fourteenth, which is
  a question you only ask when somebody's already told you no."
- "There's night work. It's boring, it's long, it pays four hundred a shift."
- "I've been holding it for somebody I didn't have to think about."
- "That's all I'm going to say about any of this."
- "Don't thank me, it's a shift. Don't open anything."
(tone note: she pays loyalty better than betrayal and never once says so.)
```

---

# MO HALBERSTAM

```
PACK: halberstam
- "Where'd you get this."
- "By somebody who knew what it was?"
- "There's a rebuilt panel here. Matched cloth, hand-set."
- "I've been doing this thirty years and I can barely find the seam."
- "Whoever did this is better than anyone I use."
- "To a collector, four. To me, nineteen hundred, because I'll sit on it for
  a year finding the collector."
- "I'll tell you what I tell everybody, and then I'll do whatever you want
  and I won't mention it again."
- "Nobody has ever come back in here happy about the ticket."
- "Some of them needed the money and they were right to take it, and they
  still weren't happy. Those are two different things and people get them
  confused at this counter constantly."
- "Nineteen hundred. Ticket's good till you say it isn't."
(tone note: technical about the object, unsentimental about the person, one
  honest sentence at the end that he clearly says twenty times a week.)
```

---

# DETECTIVE HARDCASTLE — the plain register

His shipped noir packs (`detective_hardcastle`, `hardcastle_high_heat`) are
untouched and still fire on every chase. This pack fires **once**, in
`hardcastle_the_offer`, and the effect depends entirely on it sounding like a
different man.

```
PACK: hardcastle_plain
- "Terrence Jones. Sit in the car. It's not that kind of sit in the car."
- "I've been chasing you for four years and I'd like to stop."
- "You're not a case, Jones. You've never been a case."
- "You're a guy who steals a sedan when he's frightened, and I know that
  because I've watched you do it eleven times and you always take the same
  kind."
- "Ruth Kessler keeps a book. Eleven years of it."
- "I have wanted that book since before you went in."
- "I need probable cause and I've got a scale operator who hasn't broken a
  law in eleven years."
- "That's the problem with Ruth. She's the most law-abiding person at that
  harbour and she's the reason the whole thing runs."
- "One page. Photograph one page with a container number and a date and I've
  got my cause."
- "That warrant goes away. Not reduced. Away. Like it was never typed."
- "There's a fund for this. Two thousand dollars, on a county check, which
  means for the first time in your life you could hand somebody a receipt."
- "...yes." / "I knew that."
- "I've never once gotten anything from anybody who wasn't standing in a
  hole. That's the job. I find the hole and I lower a rope into it and I
  charge for the rope."
- "You can hate that. Most people do it anyway."
- "One page, Jones. I'll be at the lot."
(tone note: NO noir. No monologue, no metaphor, no donuts. Flat and tired and
  completely honest, including about the part where he's using Turbo. The whole
  point of the scene is that the bit was a bit.)
```

---

# DONNA MARINARA — the office register

Her shipped packs (`donna_marinara_taunt`, `donna_marinara_repeat_offense`) are
untouched. This fires once, behind a closed door, and drops the food metaphors
entirely.

```
PACK: donna_office
- "Sit down, Turbo. Nobody's going to do anything to you."
- "If I were doing something to you I wouldn't have had you brought to the
  office. I'd have had it done where you were standing."
- "You've taken nine of my cars in eight days. Nine."
- "I've had drivers work for me eleven years and not touch nine cars."
- "So I looked you up, because that's a number that means something."
- "A man with a court date and a child and no employment history whatsoever,
  which is a shame, because that first part is a work ethic."
- "Four hundred a week. Routes. It's real work, it's on the books, and the
  books are real because the books are how the routes function."
- "I'll say that plainly so you don't have to wonder about it."
- "Start date's the eleventh. Six a.m. First day is not negotiable."
- "There's never been an exception, because the day a driver learns the whole
  route is the day the route works."
- "If you miss the eleventh there isn't a twelfth."
- "I know. I said I looked you up."
- "I'm making you an offer with a start date, which every job in the world
  has. You've decided that's a trap because you've never had one before."
- "This is what having a job is. It's a thing that happens on a specific
  morning whether or not you have something else on."
- "The napkin's yours. The offer's good until six a.m. on the eleventh and
  then it isn't."
(tone note: a woman running a logistics business, which is what she is once the
  door's shut. Not one food metaphor in the pack. She is completely honest about
  the conflict and does not soften it, and that honesty is the trap.)
```

---

# COACH GRIMSBY — the shed register

His shipped drill-sergeant packs are untouched and still fire everywhere else.

```
PACK: coach_the_insurance
- "Insurance."
- "General liability on the parcel. Eleven hundred a year, due in March."
- "If it lapses the county fences the field inside a week."
- "That's not a threat from anybody. That's just the rule."
- "An unfenced field without coverage is a lawsuit standing in a puddle."
- "Eleven years."
- "Out of a pension that was calculated for a man who was going to be a lot
  more relaxed than I turned out to be."
- "Twelve thousand one hundred. There was a rate change in seventeen."
- "Because it's the field. Because if it's fenced, it's done, and if it's
  done then everything that happened on it was just a thing that happened."
- "I'm not built to think about it that way."
- "I banned you off this field for twenty years and I'd do it again, and I've
  been paying for the grass you're standing on the entire time."
- "Both of those are true. Don't make it a moment."
(tone note: the volume drops out of him for this one scene and comes straight
  back afterward. "Don't make it a moment" is him ending the scene himself.)
```

```
PACK: coach_finds_out (if Turbo signs the affidavit)
- "It's got your signature on it."
- "I'm not asking a question, Jones, I'm reading you a document."
- "Everything on here is accurate."
- "There's no program. There's no league. I know that. I've known it for
  eleven years — I'm the one who knows it best."
- "I just needed one person to not say it."
- "That was the whole job. One person, out of the whole city, to not say it
  out loud on a form."
(tone note: no shouting anywhere, which from this character is the loudest
  thing in the game. He closes the gate properly on his way out.)
```

---

# DANNY KOWALSKI — the jar

His shipped `danny_ambient` pack is untouched.

```
PACK: danny_the_jar
- "It's a bit."
- "It's also four thousand three hundred dollars short of a knee
  replacement, so it's a bit that I check."
- "Don't. This isn't a thing I'm laying on you."
- "I made the jar a joke on purpose, because people put money in a joke and
  they don't put money in a forty-two-year-old man with a limp."
- "It's insurance, mostly. It's not the knee, it's the deductible and the
  eight weeks I can't be here."
- "Coach can't run this place alone for eight weeks. He thinks he can. He's
  sixty-eight."
- "It was six thousand short in twenty-nineteen. So — progress."
(tone note: same deadpan as his shipped pack, aimed at something real for the
  first time. He deflects exactly the way Turbo does and neither of them
  notices, which is why they get along now.)
```

```
PACK: danny_jar_funded (if the player fully funds it — $4,300)
- "...that's the whole thing."
- "You know I'm going to ask where it came from."
- "I'm not going to ask where it came from."
- "Eight weeks. I'll be back before the season that doesn't exist starts."
(tone note: four lines. He never says thank you and the scene is better for it.)
```

---

# AMBIENT — new pedestrian chatter

Interleaves with the shipped `CHAT_LINES` / `TALK_LINES` pools. Same oblivious
sincerity, extended to the new material.

```
PACK: ped_chatter_arrears
- "They fenced the lot on Ninth. Whole thing, overnight. Insurance thing."
- "There's a guy at the permit window with a shirt like you would not
  believe."
- "Whole harbour's been weird since the weigh station shut."
- "My cousin got served on a Tuesday. Just standing there, guy walks up,
  says his name."
- "Department Four's the family one. That's the sad hallway."
- "Church on Grace Street does chairs and coffee. That's it. That's the whole
  operation and it's been there thirty years."
- "Somebody put money in Danny's jar. Actual money. Somebody put actual money
  in the jar."
- "Field's got stakes in it again. Third time this week."
(tone note: same register as the shipped pools — flat, unbothered, entirely
  sincere. They are describing the plot of the game and none of them know it.)
```

---

## Line counts (new material only)

Approximate — counted by pack, and the exact figure for Turbo is in
`SCRIPT_TURBO_TTS.md`, which is the file to trust for generation.

| Role | Lines |
| --- | --- |
| Turbo Jones | 96 |
| Deb | 34 |
| Desmond Voss | 39 |
| Ilse Trang | 17 |
| Ambrose Kell | 13 |
| Claudia Renwick | 10 |
| The Server | 8 |
| Judge Bask | 13 |
| Reverend Cornelius Jones | 51 |
| Hollis Prine | 16 |
| Trey Okonkwo | 9 |
| Ruth Kessler | 30 |
| Mo Halberstam | 10 |
| Detective Hardcastle (plain) | 15 |
| Donna Marinara (office) | 15 |
| Coach Grimsby (shed) | 18 |
| Danny Kowalski (jar) | 11 |
| Ambient pedestrians | 8 |
| **Total new spoken lines** | **413** |

Plus every line already shipped or written in `CHAPTER1.md`, `FOOTBALL_STRAND.md`
and `VOICE_LINES.md`, all of which remain canon and none of which this pass
touches.
