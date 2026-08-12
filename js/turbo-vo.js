'use strict';
// GENERATED FILE — do not edit. Regenerate with `node tools/vo-manifest.js --write`.
// Source of truth: KIMI_TURBO_VO.md (the voice-direction brief Kimi recorded against).
//
// Every recorded Turbo take from the 239-line batch, indexed by the folder it
// was delivered into. Landing the audio and wiring a scene are separate jobs:
// this file is the index, so a pool that has no scene yet is staged here rather
// than lost. `TURBO_VO.wired` (below, hand-maintained) records which pools the
// shipped game actually plays.
const TURBO_VO = {
  // §1 Chapter 1 — VESTRY (the shirt purchase) — 4 lines (#1–#4)
  "vestry":[
    {id:1, src:"voice/turbo/story/vestry/vestry_001_how-much-white-one.mp3", text:"How much is the white one."},
    {id:2, src:"voice/turbo/story/vestry/vestry_002_how-much-third-from.mp3", text:"...how much is the third from the left."},
    {id:3, src:"voice/turbo/story/vestry/vestry_003_wear-out.mp3", text:"Wear it out."},
    {id:4, src:"voice/turbo/story/vestry/vestry_004_good-shirt.mp3", text:"It's a good shirt."},
  ],
  // §2 Chapter 1 — the branch at Deb's Corner — 6 lines (#5–#10)
  "deb_branch":[
    {id:5, src:"voice/turbo/story/deb_branch/deb_branch_005_been-day-have-idea.mp3", text:"It's been a day. You have no idea what kind of day."},
    {id:6, src:"voice/turbo/story/deb_branch/deb_branch_006_does-change-anything.mp3", text:"...does it change anything?"},
    {id:7, src:"voice/turbo/story/deb_branch/deb_branch_007_calling-cops.mp3", text:"You calling the cops?"},
    {id:8, src:"voice/turbo/story/deb_branch/deb_branch_008_deb.mp3", text:"Deb—"},
    {id:9, src:"voice/turbo/story/deb_branch/deb_branch_009_eight-hundred.mp3", text:"...eight hundred."},
    {id:10, src:"voice/turbo/story/deb_branch/deb_branch_010_gonna-get-gonna-have.mp3", text:"I'm gonna get it. I'm gonna have it by—"},
  ],
  // §3 Chapter 2 — the arrears — 9 lines (#11–#19)
  "deb_arrears":[
    {id:11, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_011_paid-twelve-hours-ago.mp3", text:"I paid you. Twelve hours ago I paid you."},
    {id:12, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_012_march.mp3", text:"...March."},
    {id:13, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_013_said-eight-hundred-said.mp3", text:"You said eight hundred. You said eight hundred and I got you eight hundred."},
    {id:14, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_014_if-dont-have-by.mp3", text:"And if I don't have it by the eleventh."},
    {id:15, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_015_thats-deb-thats-how.mp3", text:"That's not — Deb, that's not how any of this—"},
    {id:16, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_016_youre-helping-by-asking.mp3", text:"You're helping me by asking for more money."},
    {id:17, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_017_if-miss-week.mp3", text:"And if I miss a week."},
    {id:18, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_018_working.mp3", text:"It's working."},
    {id:19, src:"voice/turbo/cutscenes/deb_arrears/cutscene_deb_arrears_019_five-years.mp3", text:"Five years."},
  ],
  // §4 Chapter 2 — outside the courthouse — 3 lines (#20–#22)
  "hearing_set":[
    {id:20, src:"voice/turbo/cutscenes/hearing_set/cutscene_hearing_set_020_can-ask-something-as.mp3", text:"Can I ask you something as a person and not as a — whatever you are."},
    {id:21, src:"voice/turbo/cutscenes/hearing_set/cutscene_hearing_set_021_sure.mp3", text:"Sure."},
    {id:22, src:"voice/turbo/cutscenes/hearing_set/cutscene_hearing_set_022_does-she-actually-want.mp3", text:"Does she actually want me in jail."},
  ],
  // §5 Chapter 2 — the process server — 2 lines (#23–#24)
  "deb_served":[
    {id:23, src:"voice/turbo/cutscenes/deb_served/cutscene_deb_served_023_nobody-calls.mp3", text:"Nobody calls me that."},
    {id:24, src:"voice/turbo/cutscenes/deb_served/cutscene_deb_served_024_what-new-number.mp3", text:"What new number."},
  ],
  // §6 Chapter 2 — the bus stop (end of chapter) — 3 lines (#25–#27)
  "chapter_two_close":[
    {id:25, src:"voice/turbo/cutscenes/chapter_two_close/cutscene_chapter_two_close_025_twelve-dollars-bus-pass.mp3", text:"Twelve dollars and a bus pass."},
    {id:26, src:"voice/turbo/cutscenes/chapter_two_close/cutscene_chapter_two_close_026_they-give-pass-can.mp3", text:"They give you the pass so you can get to work. That's what it's for. That's the whole idea of it. They hand it to you at the desk and they say, this is so you can get to work."},
    {id:27, src:"voice/turbo/cutscenes/chapter_two_close/cutscene_chapter_two_close_027_six-days.mp3", text:"Six days."},
  ],
  // §7 Chapter 3 — first sighting of the shirt — 4 lines (#28–#31)
  "voss_first_sighting":[
    {id:28, src:"voice/turbo/cutscenes/voss_first_sighting/cutscene_voss_first_sighting_028_what.mp3", text:"...what is that."},
    {id:29, src:"voice/turbo/cutscenes/voss_first_sighting/cutscene_voss_first_sighting_029_what-shirt.mp3", text:"What is that shirt."},
    {id:30, src:"voice/turbo/cutscenes/voss_first_sighting/cutscene_voss_first_sighting_030_mean-what-where-does.mp3", text:"No, I mean — what IS it. Where does a shirt like that come from."},
    {id:31, src:"voice/turbo/cutscenes/voss_first_sighting/cutscene_voss_first_sighting_031_ive-got-dont-have.mp3", text:"I've got a — no. No, I don't have a form."},
  ],
  // §8 Chapter 3 — asking Voss — 8 lines (#32–#39)
  "voss_ask":[
    {id:32, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_032_ive-got-form.mp3", text:"I've got a form."},
    {id:33, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_033_ive-got-question-thats.mp3", text:"I've got a question that's shaped like a form."},
    {id:34, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_034_what-do-want-shirt.mp3", text:"What do you want for the shirt."},
    {id:35, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_035_everythings-sale-thats-thats.mp3", text:"Everything's for sale. That's — that's the actual rule of the entire city."},
    {id:36, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_036_form-question-coffee.mp3", text:"No form. No question. Coffee."},
    {id:37, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_037_coffee.mp3", text:"It's a coffee."},
    {id:38, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_038_okay-thats-fair.mp3", text:"...okay, that's fair."},
    {id:39, src:"voice/turbo/cutscenes/voss_ask/cutscene_voss_ask_039_halloran-bly.mp3", text:"Halloran and Bly."},
  ],
  // §9 Chapter 3 — VESTRY, the truth — 3 lines (#40–#42)
  "voss_the_kell":[
    {id:40, src:"voice/turbo/cutscenes/voss_the_kell/cutscene_voss_the_kell_040_halloran-bly-meridian-whats.mp3", text:"Halloran and Bly. A Meridian. What's it cost me."},
    {id:41, src:"voice/turbo/cutscenes/voss_the_kell/cutscene_voss_the_kell_041_understand-youre-telling.mp3", text:"I understand you're telling me no."},
    {id:42, src:"voice/turbo/cutscenes/voss_the_kell/cutscene_voss_the_kell_042_but.mp3", text:"But."},
  ],
  // §10 Chapter 3 — the dry cleaner — 4 lines (#43–#46)
  "trang_introduction":[
    {id:43, src:"voice/turbo/cutscenes/trang_introduction/cutscene_trang_introduction_043_door-open.mp3", text:"Door was open."},
    {id:44, src:"voice/turbo/cutscenes/trang_introduction/cutscene_trang_introduction_044_guy-just-dropped-off.mp3", text:"Guy just dropped off a cream shirt. Long collar."},
    {id:45, src:"voice/turbo/cutscenes/trang_introduction/cutscene_trang_introduction_045_want-look.mp3", text:"I want to look at it."},
    {id:46, src:"voice/turbo/cutscenes/trang_introduction/cutscene_trang_introduction_046_eleven-years.mp3", text:"Eleven years."},
  ],
  // §11 Chapter 3 — Delicate Cycle (the heist) — 6 lines (#47–#52)
  "heist_shirt":[
    {id:47, src:"voice/turbo/story/heist_shirt/heist_shirt_047_four-hundred-shirts-cream.mp3", text:"Four hundred shirts. Cream, long collar, mother-of-pearl."},
    {id:48, src:"voice/turbo/story/heist_shirt/heist_shirt_048_rail.mp3", text:"It's not on this rail."},
    {id:49, src:"voice/turbo/story/heist_shirt/heist_shirt_049_thursday-here-rail-building.mp3", text:"It's Thursday. It's here. It's on a rail in this building."},
    {id:50, src:"voice/turbo/story/heist_shirt/heist_shirt_050_dry-cleaner-ive-done.mp3", text:"This is a dry cleaner. I've done a bank. This is a dry cleaner."},
    {id:51, src:"voice/turbo/story/heist_shirt/heist_shirt_051_nobodys-coming-thats-worst.mp3", text:"Nobody's coming. That's the worst part. Nobody's even coming."},
    {id:52, src:"voice/turbo/story/heist_shirt/heist_shirt_052_found.mp3", text:"Found it."},
  ],
  // §12 Chapter 3 — it doesn't fit — 5 lines (#53–#57)
  "voss_fit":[
    {id:53, src:"voice/turbo/cutscenes/voss_fit/cutscene_voss_fit_053_fine-cut-supposed.mp3", text:"...no, it's — it's fine, it's a cut, it's supposed to—"},
    {id:54, src:"voice/turbo/cutscenes/voss_fit/cutscene_voss_fit_054_look.mp3", text:"Look—"},
    {id:55, src:"voice/turbo/cutscenes/voss_fit/cutscene_voss_fit_055_no.mp3", text:"...no."},
    {id:56, src:"voice/turbo/cutscenes/voss_fit/cutscene_voss_fit_056_youre-calling-cops.mp3", text:"You're not calling the cops."},
    {id:57, src:"voice/turbo/cutscenes/voss_fit/cutscene_voss_fit_057_why.mp3", text:"Why not."},
  ],
  // §13 Chapter 3 — the walk (Voss tells him what it cost) — 5 lines (#58–#62)
  "voss_the_cut":[
    {id:58, src:"voice/turbo/cutscenes/voss_the_cut/cutscene_voss_the_cut_058_how-much.mp3", text:"How much."},
    {id:59, src:"voice/turbo/cutscenes/voss_the_cut/cutscene_voss_the_cut_059_does-she-call.mp3", text:"Does she call?"},
    {id:60, src:"voice/turbo/cutscenes/voss_the_cut/cutscene_voss_the_cut_060_ive-got-kid.mp3", text:"I've got a kid."},
    {id:61, src:"voice/turbo/cutscenes/voss_the_cut/cutscene_voss_the_cut_061_owe-his-mother-fifty.mp3", text:"I owe his mother fifty-six hundred dollars.", alt:true},
    {id:62, src:"voice/turbo/cutscenes/voss_the_cut/cutscene_voss_the_cut_062_last-week.mp3", text:"And last week I—"},
  ],
  // §14 Chapter 3 — Grace Street, first visit — 4 lines (#63–#66)
  "church_first_visit":[
    {id:63, src:"voice/turbo/cutscenes/church_first_visit/cutscene_church_first_visit_063_nobody-calls.mp3", text:"Nobody calls me that."},
    {id:64, src:"voice/turbo/cutscenes/church_first_visit/cutscene_church_first_visit_064_twelve.mp3", text:"Twelve."},
    {id:65, src:"voice/turbo/cutscenes/church_first_visit/cutscene_church_first_visit_065_need-thirty-four-hundred.mp3", text:"I need thirty-four hundred dollars.", alt:true},
    {id:66, src:"voice/turbo/cutscenes/church_first_visit/cutscene_church_first_visit_066_didnt-even.mp3", text:"You didn't even—"},
  ],
  // §15 Chapter 3 — trying to give his father money — 6 lines (#67–#72)
  "church_the_collection":[
    {id:67, src:"voice/turbo/cutscenes/church_the_collection/cutscene_church_the_collection_067_does-matter.mp3", text:"Does it matter?"},
    {id:68, src:"voice/turbo/cutscenes/church_the_collection/cutscene_church_the_collection_068_worked.mp3", text:"I worked for it."},
    {id:69, src:"voice/turbo/cutscenes/church_the_collection/cutscene_church_the_collection_069_moving-some-things-harbour.mp3", text:"...moving some things at the harbour."},
    {id:70, src:"voice/turbo/cutscenes/church_the_collection/cutscene_church_the_collection_070_four-hundred-dollars-pop.mp3", text:"It's four hundred dollars, Pop, the gas bill's two—"},
    {id:71, src:"voice/turbo/cutscenes/church_the_collection/cutscene_church_the_collection_071_youd-rather-cold.mp3", text:"You'd rather be cold."},
    {id:72, src:"voice/turbo/cutscenes/church_the_collection/cutscene_church_the_collection_072_thats-principle-thats-just.mp3", text:"That's not principle. That's just you being able to say no to me about something. You've been looking for one of those for twenty years."},
  ],
  // §16 Chapter 3 — the road (1984) — 6 lines (#73–#78)
  "church_the_road":[
    {id:73, src:"voice/turbo/cutscenes/church_the_road/cutscene_church_the_road_073_cars-been-under-tarp.mp3", text:"That car's been under that tarp my whole life."},
    {id:74, src:"voice/turbo/cutscenes/church_the_road/cutscene_church_the_road_074_dont-drive.mp3", text:"You don't drive."},
    {id:75, src:"voice/turbo/cutscenes/church_the_road/cutscene_church_the_road_075_drove-what.mp3", text:"Drove what."},
    {id:76, src:"voice/turbo/cutscenes/church_the_road/cutscene_church_the_road_076_never-told.mp3", text:"You never told me."},
    {id:77, src:"voice/turbo/cutscenes/church_the_road/cutscene_church_the_road_077_mom.mp3", text:"Mom?"},
    {id:78, src:"voice/turbo/cutscenes/church_the_road/cutscene_church_the_road_078_why-now.mp3", text:"Why now."},
  ],
  // §17 Chapter 3 — the rule — 6 lines (#79–#84)
  "church_the_rule":[
    {id:79, src:"voice/turbo/cutscenes/church_the_rule/cutscene_church_the_rule_079_can-ask-other-thing.mp3", text:"Can I ask you the other thing."},
    {id:80, src:"voice/turbo/cutscenes/church_the_rule/cutscene_church_the_rule_080_cheerleaders.mp3", text:"The cheerleaders."},
    {id:81, src:"voice/turbo/cutscenes/church_the_rule/cutscene_church_the_rule_081_why.mp3", text:"So why."},
    {id:82, src:"voice/turbo/cutscenes/church_the_rule/cutscene_church_the_rule_082_just-put-fence-up.mp3", text:"So you just — put a fence up."},
    {id:83, src:"voice/turbo/cutscenes/church_the_rule/cutscene_church_the_rule_083_only-one-where-told.mp3", text:"It was the only one where you told me why. You said 'because I'm asking you.' You never said that about anything else. Everything else was rules."},
    {id:84, src:"voice/turbo/cutscenes/church_the_rule/cutscene_church_the_rule_084_know.mp3", text:"I know."},
  ],
  // §18 Chapter 3 — the ledger — 7 lines (#85–#91)
  "church_the_ledger":[
    {id:85, src:"voice/turbo/cutscenes/church_the_ledger/cutscene_church_the_ledger_085_what.mp3", text:"What is this."},
    {id:86, src:"voice/turbo/cutscenes/church_the_ledger/cutscene_church_the_ledger_086_says-d-jones-every.mp3", text:"It says D. Jones. Every month it says D. Jones."},
    {id:87, src:"voice/turbo/cutscenes/church_the_ledger/cutscene_church_the_ledger_087_four-years.mp3", text:"Four years."},
    {id:88, src:"voice/turbo/cutscenes/church_the_ledger/cutscene_church_the_ledger_088_does-she-know-from.mp3", text:"Does she know it's from you?"},
    {id:89, src:"voice/turbo/cutscenes/church_the_ledger/cutscene_church_the_ledger_089_does-she-does-she.mp3", text:"Does she — does she think it's from me?"},
    {id:90, src:"voice/turbo/cutscenes/church_the_ledger/cutscene_church_the_ledger_090_why-didnt-tell.mp3", text:"Why didn't you tell me."},
    {id:91, src:"voice/turbo/cutscenes/church_the_ledger/cutscene_church_the_ledger_091_couldve-told-there-visited.mp3", text:"You could've told me. In there. You visited eleven times, you could have said one—"},
  ],
  // §19 Chapter 3 — end of chapter, outside the church — 3 lines (#92–#94)
  "chapter_three_close":[
    {id:92, src:"voice/turbo/cutscenes/chapter_three_close/cutscene_chapter_three_close_092_sixty-month-four-years.mp3", text:"Sixty a month. Four years. He never said a word about it. Not to her, not to me."},
    {id:93, src:"voice/turbo/cutscenes/chapter_three_close/cutscene_chapter_three_close_093_everybody-life-has-been.mp3", text:"Everybody in my life has been covering the number I wasn't covering. Deb. My dad. Some guy at a permit window I met last week has a better answer for his kid than I do."},
    {id:94, src:"voice/turbo/cutscenes/chapter_three_close/cutscene_chapter_three_close_094_five-days.mp3", text:"Five days."},
  ],
  // §20 Chapter 4 — the field — 5 lines (#95–#99)
  "coach_eleven_years":[
    {id:95, src:"voice/turbo/cutscenes/coach_eleven_years/cutscene_coach_eleven_years_095_what.mp3", text:"What is that."},
    {id:96, src:"voice/turbo/cutscenes/coach_eleven_years/cutscene_coach_eleven_years_096_coach-whos-been-paying.mp3", text:"Coach. Who's been paying it."},
    {id:97, src:"voice/turbo/cutscenes/coach_eleven_years/cutscene_coach_eleven_years_097_out-what.mp3", text:"Out of what?"},
    {id:98, src:"voice/turbo/cutscenes/coach_eleven_years/cutscene_coach_eleven_years_098_thats-twelve-thousand-dollars.mp3", text:"That's twelve thousand dollars."},
    {id:99, src:"voice/turbo/cutscenes/coach_eleven_years/cutscene_coach_eleven_years_099_why.mp3", text:"Why."},
  ],
  // §21 Chapter 4 — Trey — 9 lines (#100–#108)
  "trey_the_talk":[
    {id:100, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_100_thats.mp3", text:"That's me."},
    {id:101, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_101_coach-says.mp3", text:"Coach says that?"},
    {id:102, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_102_ask-twenty-years.mp3", text:"Ask me in twenty years."},
    {id:103, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_103_warranty.mp3", text:"No. It's a warranty."},
    {id:104, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_104_youre-gonna-hurt-somebody.mp3", text:"You're gonna hurt somebody."},
    {id:105, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_105_youre-gonna-hurt-somebody-2.mp3", text:"You're gonna hurt somebody, and it's not going to be a decision. That's the part people get wrong about it. You think there's a moment where you choose. There isn't one. There's just after."},
    {id:106, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_106_know-other-guy.mp3", text:"No. I know the other guy."},
    {id:107, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_107_theres-man-shed-with.mp3", text:"There's a man in that shed with a bad knee who's forty-two and stacks footballs for a living, and I did that to him over a drink. Not over a game — over a drink somebody handed to him instead of me. I was seventeen and I was the fastest guy Coach ever had, and then I was a guy who did that, and I have been that guy every single day since, including today, including right now, talking to you."},
    {id:108, src:"voice/turbo/cutscenes/trey_the_talk/cutscene_trey_the_talk_108_telling-calm-dont-know.mp3", text:"I'm not telling you to be calm. I don't know how to be calm, I'd be lying to you and you'd hear it. I'm telling you to know which four seconds it is. That's all I've got. Learn the four seconds and go somewhere else during them."},
  ],
  // §22 Chapter 4 — the jar — 4 lines (#109–#112)
  "danny_the_jar":[
    {id:109, src:"voice/turbo/cutscenes/danny_the_jar/cutscene_danny_the_jar_109_jars-bit-right-jars.mp3", text:"The jar's a bit, right? The jar's been a bit for twenty years."},
    {id:110, src:"voice/turbo/cutscenes/danny_the_jar/cutscene_danny_the_jar_110_okay.mp3", text:"Okay."},
    {id:111, src:"voice/turbo/cutscenes/danny_the_jar/cutscene_danny_the_jar_111_danny.mp3", text:"...Danny."},
    {id:112, src:"voice/turbo/cutscenes/danny_the_jar/cutscene_danny_the_jar_112_how-long-have-been.mp3", text:"How long have you been at forty-three hundred short."},
  ],
  // §23 Chapter 4 — Prine's offer — 4 lines (#113–#117)
  "prine_offer":[
    {id:113, src:"voice/turbo/cutscenes/prine_offer/cutscene_prine_offer_113_thats-true.mp3", text:"That's true."},
    {id:114, src:"voice/turbo/cutscenes/prine_offer/cutscene_prine_offer_114_yeah.mp3", text:"Yeah."},
    {id:116, src:"voice/turbo/cutscenes/prine_offer/cutscene_prine_offer_116_ive-been-trying-think.mp3", text:"I've been trying to think of the version where I say something better. There isn't one. It's a season."},
    {id:117, src:"voice/turbo/cutscenes/prine_offer/cutscene_prine_offer_117_thirty-one-people-use.mp3", text:"Thirty-one people is a use."},
  ],
  // §24 Chapter 4 — Donna's office — 3 lines (#118–#120)
  "donna_the_route":[
    {id:118, src:"voice/turbo/cutscenes/donna_the_route/cutscene_donna_the_route_118_thats-thats-more-than.mp3", text:"That's — that's more than anything anybody's said to me all week."},
    {id:119, src:"voice/turbo/cutscenes/donna_the_route/cutscene_donna_the_route_119_hearings-eleventh-nine-m.mp3", text:"My hearing's the eleventh. Nine a.m."},
    {id:120, src:"voice/turbo/cutscenes/donna_the_route/cutscene_donna_the_route_120_youre-making-pick.mp3", text:"So you're making me pick."},
  ],
  // §25 Chapter 4 — Hardcastle's offer — 4 lines (#121–#124)
  "hardcastle_the_offer":[
    {id:121, src:"voice/turbo/cutscenes/hardcastle_the_offer/cutscene_hardcastle_the_offer_121_youve-been-chasing-week.mp3", text:"You've been chasing me for a week and a half."},
    {id:122, src:"voice/turbo/cutscenes/hardcastle_the_offer/cutscene_hardcastle_the_offer_122_go-get-youre-cop.mp3", text:"So go get it. You're the cop."},
    {id:123, src:"voice/turbo/cutscenes/hardcastle_the_offer/cutscene_hardcastle_the_offer_123_she-writes-down-everything.mp3", text:"She writes down everything I do. In the book. If I take a page out of that book, my name's on the page before it."},
    {id:124, src:"voice/turbo/cutscenes/hardcastle_the_offer/cutscene_hardcastle_the_offer_124_knew.mp3", text:"You knew that."},
  ],
  // §26 Chapter 4 — the weigh station — 8 lines (#125–#132)
  "kessler":[
    {id:125, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_125_depends-whos-asking.mp3", text:"Depends who's asking."},
    {id:126, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_126_yes.mp3", text:"...yes."},
    {id:127, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_127_thats-weird-rule-place.mp3", text:"That's a weird rule for a place like this."},
    {id:128, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_128_if-cop-asks-book.mp3", text:"And if a cop asks you for the book."},
    {id:129, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_129_cloth.mp3", text:"Cloth."},
    {id:130, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_130_yeah.mp3", text:"...yeah."},
    {id:131, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_131_youre-going-stop.mp3", text:"You're not going to stop me."},
    {id:132, src:"voice/turbo/cutscenes/kessler/cutscene_kessler_132_why-does-scare-more.mp3", text:"Why does that scare me more than a gun."},
  ],
  // §27 Chapter 4 — the ruin and the repair — 6 lines (#133–#139)
  "shirt_ruined":[
    {id:133, src:"voice/turbo/cutscenes/shirt_ruined/cutscene_shirt_ruined_133_no-no-no-no.mp3", text:"No. No, no, no—"},
    {id:134, src:"voice/turbo/cutscenes/shirt_ruined/cutscene_shirt_ruined_134_cold-cold-water.mp3", text:"...cold. Cold water."},
    {id:135, src:"voice/turbo/cutscenes/shirt_ruined/cutscene_shirt_ruined_135_cold-water.mp3", text:"Cold water."},
    {id:136, src:"voice/turbo/cutscenes/shirt_ruined/cutscene_shirt_ruined_136_then-get-cloth.mp3", text:"Then get me the cloth."},
    {id:138, src:"voice/turbo/cutscenes/shirt_ruined/cutscene_shirt_ruined_138_theres-always-some-somewhere.mp3", text:"There's always some. Somewhere in this city there is always some of everything, that's the one thing I actually know about San Chaos."},
    {id:139, src:"voice/turbo/cutscenes/shirt_ruined/cutscene_shirt_ruined_139_know-container.mp3", text:"You know the container."},
  ],
  // §28 Chapter 5 — Voss gives him the shirt — 4 lines (#140–#143)
  "voss_the_loan":[
    {id:140, src:"voice/turbo/cutscenes/voss_the_loan/cutscene_voss_the_loan_140_doesnt-fit.mp3", text:"It doesn't fit me."},
    {id:141, src:"voice/turbo/cutscenes/voss_the_loan/cutscene_voss_the_loan_141_favor-somebody-who-writes.mp3", text:"A favor to somebody who writes things down."},
    {id:142, src:"voice/turbo/cutscenes/voss_the_loan/cutscene_voss_the_loan_142_yeah.mp3", text:"Yeah."},
    {id:143, src:"voice/turbo/cutscenes/voss_the_loan/cutscene_voss_the_loan_143_des-doesnt.mp3", text:"Des, it doesn't—"},
  ],
  // §29 Chapter 5 — the pawnshop — 3 lines (#144–#146)
  "halberstam_appraisal":[
    {id:144, src:"voice/turbo/cutscenes/halberstam_appraisal/cutscene_halberstam_appraisal_144_given.mp3", text:"It was given to me."},
    {id:145, src:"voice/turbo/cutscenes/halberstam_appraisal/cutscene_halberstam_appraisal_145_by-only-person-who.mp3", text:"By the only person who did."},
    {id:146, src:"voice/turbo/cutscenes/halberstam_appraisal/cutscene_halberstam_appraisal_146_whats-worth.mp3", text:"What's it worth."},
  ],
  // §30 Chapter 5 — the night before — 4 lines (#147–#150)
  "night_before":[
    {id:147, src:"voice/turbo/cutscenes/night_before/cutscene_night_before_147_nine-m-department-four.mp3", text:"Nine a.m. Department Four."},
    {id:148, src:"voice/turbo/cutscenes/night_before/cutscene_night_before_148_ive-been-courtroom-four.mp3", text:"I've been in a courtroom four times. Every time, somebody stood up and explained what I'd done, and every time they were basically right, and every time I sat there thinking about how they'd gotten one detail wrong. Like the detail was the point."},
    {id:149, src:"voice/turbo/cutscenes/night_before/cutscene_night_before_149_tomorrow-somebodys-going-stand.mp3", text:"Tomorrow somebody's going to stand up and explain what I've done to a seven-year-old. And I've been sitting here for an hour trying to find the detail they've got wrong."},
    {id:150, src:"voice/turbo/cutscenes/night_before/cutscene_night_before_150_there-isnt-one.mp3", text:"There isn't one."},
  ],
  // §31 Chapter 5 — the morning, with his father — 3 lines (#151–#153)
  "church_testimony":[
    {id:151, src:"voice/turbo/cutscenes/church_testimony/cutscene_church_testimony_151_dont-have-come.mp3", text:"You don't have to come."},
    {id:152, src:"voice/turbo/cutscenes/church_testimony/cutscene_church_testimony_152_going-help-they-dont.mp3", text:"It's not going to help. They don't let people just talk."},
    {id:153, src:"voice/turbo/cutscenes/church_testimony/cutscene_church_testimony_153_came-all-four-other.mp3", text:"You came to all four of the other ones."},
  ],
  // §32 Chapter 5 — the hearing — 6 lines (#154–#159)
  "the_hearing":[
    {id:154, src:"voice/turbo/cutscenes/the_hearing/cutscene_the_hearing_154_sir.mp3", text:"No, sir."},
    {id:155, src:"voice/turbo/cutscenes/the_hearing/cutscene_the_hearing_155_ive-got.mp3", text:"I've got —"},
    {id:156, src:"voice/turbo/cutscenes/the_hearing/cutscene_the_hearing_156_all.mp3", text:"It's not all of it."},
    {id:157, src:"voice/turbo/cutscenes/the_hearing/cutscene_the_hearing_157_going-stand-here-tell.mp3", text:"I'm not going to stand here and tell you I got unlucky. I've told that one in this building before and I think you can all hear it coming. I had the money. Four separate times over four years I had the money and I bought something instead. That's it. That's the whole case against me and it's accurate."},
    {id:158, src:"voice/turbo/cutscenes/the_hearing/cutscene_the_hearing_158_last-one-shirt-eight.mp3", text:"The last one was a shirt. Eight hundred dollars. It's a really good shirt."},
    {id:159, src:"voice/turbo/cutscenes/the_hearing/cutscene_the_hearing_159_last-one-jacket-two.mp3", text:"The last one was a jacket. Two hundred and ten dollars. I still have it. I'm wearing it.", alt:true},
  ],
  // §33 Chapter 5 — the endings — 6 lines (#160–#165)
  "endings":[
    {id:160, src:"voice/turbo/cutscenes/endings/cutscene_endings_160_saturday-what.mp3", text:"Saturday what?"},
    {id:161, src:"voice/turbo/cutscenes/endings/cutscene_endings_161_ten-four.mp3", text:"Ten to four."},
    {id:162, src:"voice/turbo/cutscenes/endings/cutscene_endings_162_ninety-days.mp3", text:"Ninety days."},
    {id:163, src:"voice/turbo/cutscenes/endings/cutscene_endings_163_thats-nothing.mp3", text:"That's not nothing."},
    {id:164, src:"voice/turbo/cutscenes/endings/cutscene_endings_164_yeah.mp3", text:"...yeah."},
    {id:165, src:"voice/turbo/cutscenes/endings/cutscene_endings_165_no.mp3", text:"...no."},
  ],
  // §34 Idle — the arrears weighing on him — 10 lines (#166–#175)
  "idle_arrears":[
    {id:166, src:"voice/turbo/story/idle_arrears/idle_arrears_166_thirty-four-hundred.mp3", text:"Thirty-four hundred."},
    {id:167, src:"voice/turbo/story/idle_arrears/idle_arrears_167_fifty-six-hundred.mp3", text:"Fifty-six hundred."},
    {id:168, src:"voice/turbo/story/idle_arrears/idle_arrears_168_eight-hundred-march-didnt.mp3", text:"Eight hundred was March. I didn't know there was a March."},
    {id:169, src:"voice/turbo/story/idle_arrears/idle_arrears_169_four-years-months-never.mp3", text:"Four years of months. I never once counted them."},
    {id:170, src:"voice/turbo/story/idle_arrears/idle_arrears_170_everybody-keeps-telling-number.mp3", text:"Everybody keeps telling me the number like the number's the surprising part."},
    {id:171, src:"voice/turbo/story/idle_arrears/idle_arrears_171_nine-days.mp3", text:"Nine days."},
    {id:172, src:"voice/turbo/story/idle_arrears/idle_arrears_172_ive-made-eight-hundred.mp3", text:"I've made eight hundred dollars in a day. I've never made eight hundred dollars in a day twice."},
    {id:173, src:"voice/turbo/story/idle_arrears/idle_arrears_173_shes-wrong-thats-thing.mp3", text:"She's not wrong. That's the thing I keep running into. She's not wrong anywhere."},
    {id:174, src:"voice/turbo/story/idle_arrears/idle_arrears_174_theres-version-where-had.mp3", text:"There's a version of this where I had four hundred dollars a year ago and I sent it. Just that. Just once."},
    {id:175, src:"voice/turbo/story/idle_arrears/idle_arrears_175_keep-waiting-part-where.mp3", text:"I keep waiting for the part where somebody's unfair to me."},
  ],
  // §35 The day counter — 10 lines (#176–#185)
  "day_counter":[
    {id:176, src:"voice/turbo/story/day_counter/day_counter_176_ten-days.mp3", text:"Ten days."},
    {id:177, src:"voice/turbo/story/day_counter/day_counter_177_nine.mp3", text:"Nine."},
    {id:178, src:"voice/turbo/story/day_counter/day_counter_178_eight.mp3", text:"Eight."},
    {id:179, src:"voice/turbo/story/day_counter/day_counter_179_seven-thats-week-week.mp3", text:"Seven. That's a week. A week is a real amount of time."},
    {id:180, src:"voice/turbo/story/day_counter/day_counter_180_six.mp3", text:"Six."},
    {id:181, src:"voice/turbo/story/day_counter/day_counter_181_five.mp3", text:"Five."},
    {id:182, src:"voice/turbo/story/day_counter/day_counter_182_four.mp3", text:"Four."},
    {id:183, src:"voice/turbo/story/day_counter/day_counter_183_three.mp3", text:"Three."},
    {id:184, src:"voice/turbo/story/day_counter/day_counter_184_two.mp3", text:"Two."},
    {id:185, src:"voice/turbo/story/day_counter/day_counter_185_tomorrow.mp3", text:"Tomorrow."},
  ],
  // §36 Idle — the shirt (Chapter 3) — 6 lines (#186–#191)
  "idle_shirt":[
    {id:186, src:"voice/turbo/story/idle_shirt/idle_shirt_186_collar-color-collar-way.mp3", text:"It's the collar. It's not the color, it's the collar, it's the way it stands up on its own."},
    {id:187, src:"voice/turbo/story/idle_shirt/idle_shirt_187_twenty-six-years-window.mp3", text:"Twenty-six years at a window in a shirt like that."},
    {id:188, src:"voice/turbo/story/idle_shirt/idle_shirt_188_hes-rich-ive-watched.mp3", text:"He's not rich. I've watched him take the bus twice."},
    {id:189, src:"voice/turbo/story/idle_shirt/idle_shirt_189_halloran-bly-they-shut.mp3", text:"Halloran and Bly. They shut in oh-six."},
    {id:190, src:"voice/turbo/story/idle_shirt/idle_shirt_190_theres-four-hundred-them.mp3", text:"There's four hundred of them in the world and one of them is on a guy who stamps forms."},
    {id:191, src:"voice/turbo/story/idle_shirt/idle_shirt_191_ive-got-nine-days.mp3", text:"I've got nine days and I'm thinking about a shirt. I'm aware. Being aware isn't helping."},
  ],
  // §37 Idle — wearing the Meridian — 4 lines (#192–#195)
  "wearing_meridian":[
    {id:192, src:"voice/turbo/story/wearing_meridian/wearing_meridian_192_shoulders-back-thats-thats.mp3", text:"Shoulders back. That's it. That's the whole trick and it's free."},
    {id:193, src:"voice/turbo/story/wearing_meridian/wearing_meridian_193_doesnt-fit-know-doesnt.mp3", text:"It doesn't fit me. I know it doesn't fit me. I'm wearing it."},
    {id:194, src:"voice/turbo/story/wearing_meridian/wearing_meridian_194_twenty-two-years-he.mp3", text:"Twenty-two years he wore this. Every day."},
    {id:195, src:"voice/turbo/story/wearing_meridian/wearing_meridian_195_cold-water-always-cold.mp3", text:"Cold water. Always cold."},
  ],
  // §38 Idle — wearing the Kell (road C) — 4 lines (#196–#199)
  "wearing_kell":[
    {id:196, src:"voice/turbo/story/wearing_kell/wearing_kell_196_eight-hundred-dollars.mp3", text:"Eight hundred dollars."},
    {id:197, src:"voice/turbo/story/wearing_kell/wearing_kell_197_good-shirt-kell-said.mp3", text:"It's a good shirt. Kell said so and he made it and he'd know."},
    {id:198, src:"voice/turbo/story/wearing_kell/wearing_kell_198_stood-shop-knew-number.mp3", text:"I stood in the shop and I knew the number. I want that on the record. I knew the exact number."},
    {id:199, src:"voice/turbo/story/wearing_kell/wearing_kell_199_four-blocks-she-four.mp3", text:"Four blocks. She was four blocks away."},
  ],
  // §39 Idle — the bus pass — 4 lines (#200–#203)
  "bus_pass":[
    {id:200, src:"voice/turbo/story/bus_pass/bus_pass_200_twelve-dollars-bus-pass.mp3", text:"Twelve dollars and a bus pass."},
    {id:201, src:"voice/turbo/story/bus_pass/bus_pass_201_they-give-pass-can.mp3", text:"They give you the pass so you can get to work. That's what it's for."},
    {id:202, src:"voice/turbo/story/bus_pass/bus_pass_202_expired-been-expired-since.mp3", text:"It's expired. It's been expired since the day they handed it to me."},
    {id:203, src:"voice/turbo/story/bus_pass/bus_pass_203_ive-stolen-forty-cars.mp3", text:"I've stolen forty cars in eleven days and I've still got the pass."},
  ],
  // §40 Idle — the three offers — 5 lines (#204–#208)
  "idle_offers":[
    {id:204, src:"voice/turbo/story/idle_offers/idle_offers_204_twenty-two-hundred-two.mp3", text:"Twenty-two hundred for two paragraphs and every word of it's true."},
    {id:205, src:"voice/turbo/story/idle_offers/idle_offers_205_one-page-one-page.mp3", text:"One page. One page out of somebody else's book."},
    {id:206, src:"voice/turbo/story/idle_offers/idle_offers_206_four-hundred-week-every.mp3", text:"Four hundred a week. Every week. Starting the morning I'm supposed to be in a courtroom."},
    {id:207, src:"voice/turbo/story/idle_offers/idle_offers_207_every-one-these-person.mp3", text:"Every one of these is a person. That's the thing about all three of them. They're all a person."},
    {id:208, src:"voice/turbo/story/idle_offers/idle_offers_208_keep-waiting-offered-something.mp3", text:"I keep waiting to be offered something that doesn't cost anybody."},
  ],
  // §41 Proximity — Deb — 8 lines (#209–#216)
  "approach_deb_ch2":[
    {id:209, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_209_okay.mp3", text:"Okay."},
    {id:210, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_210_hear.mp3", text:"I hear you."},
    {id:211, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_211_going-argue-with-number.mp3", text:"I'm not going to argue with the number."},
    {id:212, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_212_know-what-said-last.mp3", text:"I know what I said last time. I know what I said all four times."},
    {id:213, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_213_how-he.mp3", text:"How is he."},
    {id:214, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_214_dont-tell-him-asked.mp3", text:"Don't tell him I asked. Or — no. Tell him. Tell him I asked."},
    {id:215, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_215_going-have.mp3", text:"I'm going to have it."},
    {id:216, src:"voice/turbo/story/approach_deb_ch2/approach_deb_ch2_216_going-have-2.mp3", text:"...I'm not going to have it."},
  ],
  // §42 Proximity — Voss — 6 lines (#217–#222)
  "approach_voss":[
    {id:217, src:"voice/turbo/story/approach_voss/approach_voss_217_des.mp3", text:"Des."},
    {id:218, src:"voice/turbo/story/approach_voss/approach_voss_218_youre-window.mp3", text:"You're at the window."},
    {id:219, src:"voice/turbo/story/approach_voss/approach_voss_219_touching-rail.mp3", text:"I'm not touching the rail."},
    {id:220, src:"voice/turbo/story/approach_voss/approach_voss_220_how-do-do-same.mp3", text:"How do you do the same thing for twenty-six years."},
    {id:221, src:"voice/turbo/story/approach_voss/approach_voss_221_couldve-called-cops-had.mp3", text:"You could've called the cops. You had it right there. Everybody would've said you were right."},
    {id:222, src:"voice/turbo/story/approach_voss/approach_voss_222_shoulders-back-got-got.mp3", text:"Shoulders back. I got it. I got it the first time."},
  ],
  // §43 Proximity — Grace Street — 6 lines (#223–#228)
  "approach_dad":[
    {id:223, src:"voice/turbo/story/approach_dad/approach_dad_223_nobody-calls-terrence.mp3", text:"Nobody calls me Terrence."},
    {id:224, src:"voice/turbo/story/approach_dad/approach_dad_224_grab-end.mp3", text:"Grab that end."},
    {id:225, src:"voice/turbo/story/approach_dad/approach_dad_225_four-hundred-ten-dollars.mp3", text:"Four hundred and ten dollars, Pop."},
    {id:226, src:"voice/turbo/story/approach_dad/approach_dad_226_never-told-about-car.mp3", text:"You never told me about the car."},
    {id:227, src:"voice/turbo/story/approach_dad/approach_dad_227_sixty-month.mp3", text:"Sixty a month."},
    {id:228, src:"voice/turbo/story/approach_dad/approach_dad_228_going-say-thank-dont.mp3", text:"I'm not going to say thank you for it. I don't think you want me to."},
  ],
  // §44 Proximity — Trey — 5 lines (#229–#233)
  "approach_trey":[
    {id:229, src:"voice/turbo/story/approach_trey/approach_trey_229_youre-fast.mp3", text:"You're fast."},
    {id:230, src:"voice/turbo/story/approach_trey/approach_trey_230_everybodys-fast-seventeen-some.mp3", text:"Everybody's fast at seventeen. Some people are fast at thirty-four and it doesn't help either."},
    {id:231, src:"voice/turbo/story/approach_trey/approach_trey_231_know-which-four-seconds.mp3", text:"Know which four seconds it is."},
    {id:232, src:"voice/turbo/story/approach_trey/approach_trey_232_theres-guy-shed-with.mp3", text:"There's a guy in that shed with a bad knee. Go talk to him instead of me."},
    {id:233, src:"voice/turbo/story/approach_trey/approach_trey_233_cautionary-tale-just-guy.mp3", text:"I'm not the cautionary tale. I'm just the guy standing here. Those are close but they're not the same."},
  ],
  // §45 Epilogue idles — 8 lines (#234–#241)
  "epilogue":[
    {id:234, src:"voice/turbo/story/epilogue/epilogue_234_ten-four.mp3", text:"Ten to four."},
    {id:235, src:"voice/turbo/story/epilogue/epilogue_235_saturday.mp3", text:"Saturday."},
    {id:236, src:"voice/turbo/story/epilogue/epilogue_236_dont-early-she-said.mp3", text:"Don't be early. She said don't be early."},
    {id:237, src:"voice/turbo/story/epilogue/epilogue_237_going-early.mp3", text:"I'm going to be early."},
    {id:238, src:"voice/turbo/story/epilogue/epilogue_238_two-fifty-week.mp3", text:"Two fifty a week."},
    {id:239, src:"voice/turbo/story/epilogue/epilogue_239_ninety-days-then-man.mp3", text:"Ninety days and then a man in a robe looks at me again."},
    {id:240, src:"voice/turbo/story/epilogue/epilogue_240_nothing-she-said-first.mp3", text:"It's not nothing. She said it's the first thing that isn't nothing."},
    {id:241, src:"voice/turbo/story/epilogue/epilogue_241_id-like-more-than.mp3", text:"I'd like it to be more than not-nothing eventually."},
  ],
};

// Pools the shipped game plays today. Everything else in TURBO_VO is recorded
// and staged against chapters that are not implemented yet (SCRIPT.md) — add a
// pool here as its scene lands so the coverage number stays honest.
TURBO_VO.wired = ['bus_pass'];

// Look a take up by its brief id (#1–#241), or pull a whole pool.
TURBO_VO.line = id => {
  for (const k of Object.keys(TURBO_VO)) {
    if (!Array.isArray(TURBO_VO[k])) continue;
    const hit = TURBO_VO[k].find(l => l.id === id);
    if (hit) return hit;
  }
  return null;
};
TURBO_VO.pools = () => Object.keys(TURBO_VO).filter(k => Array.isArray(TURBO_VO[k]) && k !== 'wired');
TURBO_VO.count = () => TURBO_VO.pools().reduce((n, k) => n + TURBO_VO[k].length, 0);

if (typeof window !== 'undefined') window.TURBO_VO = TURBO_VO;
if (typeof module !== 'undefined' && module.exports) module.exports = TURBO_VO;
