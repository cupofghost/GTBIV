# GTB IV — All Turbo Jones Lines (So Far)

> Every line Turbo speaks across the project to date: the intro narration,
> the shipped in-game barks (`TURBO_LINES` in `index.html`), the new
> mission/chapter barks from `CHAPTER1.md`, the new football-strand barks
> from `FOOTBALL_STRAND.md`, and every cutscene line attributed to him.
> The separate promo monologue is included at the end for reference.
>
> **Some lines already have professional recorded audio** — flagged
> inline. Everything else currently falls back to in-browser text-to-speech
> (`speak(...)`) in the shipped game, which is presumably what Kimi's
> replacing.

---

## Intro narration
*Already recorded: `voice/turbo/intro/intro_01_san-chaos.mp3`–`intro_04_pay-up-or-slammer.mp3`*

1. "San Chaos. The city that never sleeps... because it's too busy causing trouble."
2. "Name's Turbo Jones. I just walked out of minimum security with twelve dollars and a bus pass."
3. "My ex-wife Deb? She wants eight hundred dollars in child support. And she wants it today."
4. "So I pay up... or it's straight back to the slammer. Time to go to work."

---

## Shipped in-game barks (`TURBO_LINES`, `index.html`)

### Approaching a pedestrian
1. "Oh, honey."
2. "That shirt was already litter."
3. "Oops, sorry about that."
4. "Hey. You got the time? No? Cool."
5. "Nice face. Be a shame if something happened to it."
6. "You look like you owe me money."
7. "Move along, citizen. Nothing to see. Yet."
8. "I love what you've done with your whole situation."
9. "Beautiful day to ruin, isn't it?"
10. "Don't mind me. I'm just a guy. A very dangerous guy."
11. "Spare a dollar? I'm eight hundred short."
12. "You smell like a parking garage."

### Throwing a punch
1. "Hi-yah!"
2. "My fingers are powerful."
3. "Don't make me fist you!"
4. "Knuckle sandwich, extra mustard!"
5. "That's for looking at me."
6. "Pow! Right in the kisser."
7. "These hands are registered weapons."
8. "You just got Turbo'd."
9. "Sit down, you were leaving anyway."
10. "Free chiropractic adjustment!"
11. "I learned that one in the yard."

### Driving slowly
1. "What am I, a grandma?"
2. "Taking my time, because I'm worth it."
3. "This is a getaway, not a funeral procession."
4. "Any day now, engine."
5. "I've seen glaciers move faster."
6. "We're basically parked."
7. "A snail just lapped us."
8. "Sunday drive in the middle of a crime spree."
9. "Step on it... me!"

### Running a red light
1. "No cops, no stops!"
2. "Weeee!"
3. "Red light's just a suggestion."
4. "Stop signs are for quitters."
5. "Yellow means floor it!"
6. "I'll stop when I'm dead. And I'm not."
7. "Whoops, was that red?"
8. "Traffic laws are more like guidelines."
9. "Outta the way, I'm improvising!"

### Being chased by cops
1. "I'm Turbo — you'll never catch me!"
2. "I pay your taxes!"
3. "Catch me if you can, badge boys!"
4. "This is police harassment! And I love it."
5. "You'll never take me alive! Or at all!"
6. "Donut break's over, boys!"
7. "I'm not speeding, I'm auditioning!"
8. "Tell the chief I said hi!"
9. "Wanted level? More like wanted TALENT."
10. "Eat my exhaust!"
11. "My ex hits harder than you!"

### Running someone over
*All 7 lines recorded: `voice/turbo/ambient/run_over/`*
1. "Oops. Should've looked both ways, pal."
2. "That's gonna leave a mark."
3. "Outta the way! I'm late for a court hearing."
4. "Walk it off, champ!"
5. "Jaywalking's a crime, ya know."
6. "Insurance covers that. Probably."
7. "That's on you, honestly."

### Firing a weapon
*All 6 lines recorded: `voice/turbo/ambient/firing/`*
1. "Say goodnight."
2. "That's how we settle things in San Chaos."
3. "You picked the wrong block, buddy."
4. "Should've stayed home today."
5. "Bang. You're it."
6. "Consider this your eviction notice."

### Jacking a car
1. "Borrowing this. Permanently."
2. "Nice ride. It's mine now."
3. "Keys in the ignition. How thoughtful."
4. "Finders keepers, pal."
5. "This is a citizen's requisition."
6. "Ooh, leather seats!"

### Jacking a Chaos Pizza vehicle specifically
*Wired: `TURBO_LINES.pizza_jack`, replaces the generic jack line when the jacked car is a marked pizza delivery car (`doPizzaJack`).*
1. "Extra hot, extra stolen."
2. "Thirty minutes or it's free. Actually, it's already free."
3. "Do I look like a delivery boy? Don't answer that."
4. "Special delivery: nothing, to nowhere, on your dime."
5. "This one's for the tip jar. My tip jar. Which is my pocket."
6. "Objection! I'm allergic to paying for pizza."
7. "Fresh outta the oven and outta your parking lot."

### Idle — the debt weighing on him
*Wired: `TURBO_LINES.debt_grumble`, rare ambient bark (~30–50s cooldown) while `G.story.debt>0` (`updateStory`).*
1. "Eight hundred bucks. That's a lot of quarters."
2. "Note to self: don't marry someone smarter than you."
3. "Deb's clock is louder than my conscience, and that's saying something."
4. "If I had a dollar for every dollar I owe, I wouldn't owe it."
5. "Tonight. She said tonight. Very specific woman, my ex."
6. "Somewhere out there, a kid thinks I'm cooler than this. Gotta keep that going."
7. "$800. Not $799. She counted."

### Cutscene: `first_score`
*Wired: `CUTSCENES.first_score`, fires once when Chapter-1 earnings cross $200 (`updateStory`).*
1. "Two hundred down. Six hundred to go. Piece of cake."
2. "...I'll call her back. After the cake."

### Cutscene: `pizza_warning`
*Wired: `CUTSCENES.pizza_warning`, fires once `G.story.pizzaHeat` crosses 3 near Chaos Pizza HQ, guarded off if the HQ's already been destroyed via Pizza Wars (`updateStory`).*
1. "Delivery fleet? I thought those were just... cars. With pizza smell."
2. "Noted. Extra menace, hold the anchovies."

---

## New lines — Chapter 1 (`CHAPTER1.md`)

### Robbing a store
1. "This is a stickup. A polite one."
2. "Nobody move. Except the cash. The cash can move."
3. "Consider this a donation. To me."
4. "I'll take the drawer and a lottery ticket. Scratcher, not Powerball — I'm not greedy."
5. "Hands where I can see the register."
6. "This'll go a lot faster if nobody's a hero."
7. "I've got a kid to feed. Don't look at me like that, it's TRUE."
8. "Relax, it's insured. Probably."
9. "This is between me and the register. You're just standing near it."

### Store robbery — the take lands
1. "And that's how Daddy pays rent. Sort of."
2. "Four hundred to go. Feels like four thousand."
3. "Anyone asks, I was never here. I was very obviously here."
4. "One store down. San Chaos has, what, a hundred more?"
5. "Cha-ching. Minus the ching. It's all quiet, actually."

### Approaching Deb
1. "Hey Deb. You're looking... like you want to kill me. Cool, cool."
2. "Been a minute. You look great. Furious, but great."
3. "So, funny story about the eight hundred—"

### Paying Deb
1. "There. Eight hundred, exact change, no confetti."
2. "See? I'm basically a functioning adult now."
3. "Don't spend it all in one place. Kidding. Spend it on the kid."

---

## New lines — Football strand (`FOOTBALL_STRAND.md`)

### Idle — backstory callbacks
1. "Two years, three hot dogs a day. I have OPINIONS about hot dogs now."
2. "Church camp took my cheerleaders. Coach took my locker room. Deb's taking my money. I see a pattern and I don't like it."
3. "I didn't lose my temper. I lost a WRESTLING MATCH. Slight difference."
4. "Fast, strong, handsome. That's not bragging, Coach, that's HISTORY."
5. "Just gotta get creative. Always gotta get creative."

### Turbo Bowl — during a run
1. "Outta my way, I'm HISTORIC!"
2. "Twenty years of cardio for THIS moment!"
3. "Juke left— no— juke RIGHT— just RUN, TURBO!"
4. "This is for the locker room I'll never see again!"

### Turbo Bowl — getting tackled
1. "...I meant to do that."
2. "The grass broke my fall. Mostly."

### Turbo Bowl — scoring (replays after the first win)
1. "STILL. GOT. IT."
2. "Somebody call Deb, tell her I'm FAST again!"

### Cutscene: `coach_rematch_intro`
1. "Twenty years, Coach. Twenty years I've been carrying this."
2. "...it was a really good Gatorade."

### Cutscene: `coach_defeat`
1. "Coach... does this mean I can use the locker room again?"

### Cutscene: `danny_apology`
1. "Danny. Hey. Been a while."
2. "...I'm sorry about your knee. I was showing off. It wasn't about you. That doesn't make it better, I know."
3. "The what now? Never heard of it."

### Cutscene: `turbo_bowl_payoff`
1. "Still got it! Twenty years later, STILL GOT IT!"
2. "Ladies, there's plenty of Turbo to go around—"
3. "...Dad, I'm thirty-four."
4. "...worth it. Still worth it."

---

## Reference: the promo monologue (separate track, not in-game dialogue)

Included here for completeness since it's Turbo's voice too, but this is
the standalone backstory monologue you provided for the promo — not a
line from the game itself:

> "My name's Turbo Jones. People hear 'minimum security' and they laugh.
> They think it's some kind of summer camp. Let me tell you something —
> it ain't. Every day I wake up surrounded by nothing but dudes. Just...
> dudes. I love women. Always have. And now? It's like the universe
> looked at me and said, 'Turbo, no.'
>
> People think I'm some kind of deadbeat. They say, 'Turbo, why didn't
> you pay child support?' I meant to pay Deb. I really did. I had every
> intention. But then I started buying stuff I wanted, and next thing you
> know... the money was gone. It happens. One minute you're looking at a
> cool shirt, the next minute you're in prison explaining your financial
> strategy to a gross guy!
>
> Nobody ever talks about my struggles. I've had hardship my whole life.
> Back in high school, I was the greatest football player anybody had
> ever seen. Fast, strong, handsome. The cheerleaders all wanted to date
> me. Every single one of them. But my dad wouldn't let me because of
> church. I respected him, so that was that. You think that doesn't leave
> scars?
>
> Then, out of nowhere, I got banned from the locker room for no
> reason... So I had to quit the team. People always ask, 'Turbo, what
> happened?' Life happened.
>
> Now I'm eating hotdogs three times a day while Deb's out there thinking
> of how to screw me even harder. It's not fair! Some nights I stare out
> my tiny little window and wonder where it all went wrong. Was it the
> shopping? I don't know. All I know is a man can only endure so much.
>
> One day I'll get back on my feet. I'll rebuild my life. I'll make
> things right with Deb so she'll leave me the F alone. Just got to get
> creative."

---

## Line count

| Section | Lines |
| --- | --- |
| Intro narration | 4 |
| Shipped in-game barks (8 categories) | 71 |
| New — Chapter 1 | 36 |
| New — Football strand | 23 |
| **Total spoken lines** | **134** |
| Promo monologue | 1 (standalone block) |
