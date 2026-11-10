# PSYCHOLOGY: the learning design of "sayit."

> Binding reference for every page and feature. Read it before building anything.
> If a feature does not help someone **speak**, it does not belong in the product (or it comes last).
> Written 2026-11-09 from the user's decision: the whole site is built around speaking.

---

## 1. Promise

**Help Arabic speakers speak clear American English with confidence, without hesitating, and keep talking instead of stopping.**

"American" means **General American**: one consistent, widely understood accent. We aim for *clear, confident and natural*, not for a perfect imitation of a native speaker, and we never promise that.

The founder has this problem himself. He is the first test user: if a feature does not help him, it is not ready.

## 2. Who the learner is

- Arabic speaker (Levantine and other dialects) who understands more English than they can say.
- Often shy about speaking, afraid of mistakes, and freezes mid-sentence.
- Mostly practices alone, on a phone or laptop, in short sessions.

## 3. Why people hesitate (what we are fixing)

1. **Slow retrieval:** words and phrases are known but not instantly available.
2. **Fear of mistakes:** the inner editor stops them before they speak.
3. **Single-word thinking:** they build sentences word by word instead of using ready chunks.
4. **Sound problems:** unsure how a word sounds, so they avoid saying it.
5. **Almost no speaking practice:** most study is reading and listening.

## 4. Principles

1. **Speak first, correct later.** Never interrupt or punish while someone is speaking.
2. **Active recall:** ask before showing the answer.
3. **Spaced repetition:** phrases come back after 1 day, 3 days, 1 week, and so on.
4. **Chunks over words:** teach whole phrases in context.
5. **Arabic is scaffolding:** shown first, then hidden behind a tap, then gone.
6. **Short sessions (5 to 10 minutes)** with a small daily goal that can be finished.
7. **Safe by default:** playful, cheeky, encouraging tone. Mistakes are celebrated, never scored as failures. No shame, no guilt messages.
8. **Measure speaking, not perfection:** the main numbers are *minutes spoken* and *sentences practiced*, not grades.
9. **Honesty:** tell the user what a tool can and cannot judge (see section 8).

## 5. The speaking ladder

| Level | Name | What happens | Status |
|---|---|---|---|
| 1 | Sounds | Sounds Arabic speakers find hard, minimal pairs, audio | planned |
| 2 | Words and stress | Where the stress falls; weak syllables (schwa) | planned |
| 3 | Chunks | Whole useful phrases, grouped by situation | partly (Shadowing sentences) |
| 4 | Connected speech | gonna, wanna, linking, flap T, reductions | partly (Shadowing notes) |
| 5 | Shadowing | Hear a sentence, say it right after, record, compare | **built** (`/shadowing`) |
| 6 | Free speaking, no stopping | A topic and a timer; keep talking; pauses counted | planned |

The dashboard should show this ladder as the user's **speaking path**.

## 6. Anti-hesitation toolkit

- **Rescue phrases** to say while thinking: "Let me think about it", "What I mean is...", "How can I put it...", "That's a great question".
- **4/3/2 technique:** talk about the same topic three times, with less time each round (for example 4, 3, then 2 minutes). Repetition makes speech faster and smoother.
- **Pause counter:** in no-stop mode, long silences are counted and shown. Silence is the thing we train, not mistakes.
- **Speak to the app privately** first; no audience, no judgment.
- **Always offer a way to continue** (a rescue phrase, a simpler word) instead of a dead end.

## 7. Pronunciation focus for Arabic speakers (General American)

Common difficulties. Teach them gradually, with audio and minimal pairs:

- **P and B** (Arabic has no native /p/; "park" becomes "bark").
- **V and F** ("very" becomes "fery").
- **American R:** the tongue pulls back without touching the roof of the mouth and without a trill or tap.
- **More vowels than Arabic has** (for example ship/sheep, bad/bed, cup/cap).
- **Consonant clusters:** a vowel is often inserted ("school" becomes "ischool", "spring" becomes "isspring").
- **Stress and weak syllables:** English stresses some syllables and squeezes others (schwa).
- **TH sounds:** some dialects replace them with t/d or s/z.
- **Connected speech in General American:** flap T (water, get a), linking, reductions (gonna, wanna, gotta, lemme, "couldja").

Always confirm the phonetic claims with a reliable source before turning them into content. When unsure, say less.

## 8. What the technology can and cannot do

| Tool | Does | Does not |
|---|---|---|
| Browser text-to-speech (`speechSynthesis`) | Plays a model voice; quality depends on the device (Edge "Natural" voices are good) | Guarantee one consistent American voice |
| Recording (`MediaRecorder`) | Lets the user hear themselves and compare with the model | Judge anything |
| Speech recognition (`SpeechRecognition`, Chrome and Edge, needs internet) | Shows whether the words were understood | **Score accent or pronunciation**; it is forgiving by design |

**Privacy:** in Chrome and Edge, speech recognition sends audio to the browser vendor's servers. The site must say so in a privacy note before launch.

**Later (needs a backend and API keys, never committed to git):**
- Real pronunciation assessment (a paid speech API).
- Pre-generated, consistent American voice audio files (one high-quality TTS voice, rendered once and stored in the project).
- An AI conversation partner for free speaking with gentle feedback.
- Accounts and a database so progress follows the user.

## 9. Motivation design

- **Streak:** gentle only. One rest day allowed, no guilt messages, no punishment. A broken streak must never feel like failure.
- **Main metric:** minutes spoken (and later words per minute and pause count).
- **Small wins:** celebrate the first recording, the first 5 minutes, the first no-stop minute.
- **Autonomy:** the user chooses what to practice; we recommend, we do not force.
- **Tone:** playful and bold, matching the visual identity. Arabic is used for explanations and encouragement; the interface itself is English.

## 10. Rules for building features

1. Every feature names the **speaking skill** it trains (put it in the commit or the worklog).
2. No score that can make someone feel stupid. Prefer "again" over "wrong".
3. Never block speaking behind a quiz or a paywall.
4. Tell the user what the tool measures and what it does not (see section 8).
5. Keep sessions short and the next action obvious (one clear button).
6. Add content (sentences, sounds) in small, verified batches.

## 11. Open questions

- Daily goal: how many minutes by default?
- When to start the paid pronunciation API?
- Voice: one fixed generated voice, or the browser's?
- Streak rules (rest days, freezes).
- Free vs paid features, if the site ever charges.
