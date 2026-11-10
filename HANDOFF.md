# HANDOFF: "sayit." English-learning website

> **Read this first.** This file lets any Claude (any chat, any account) continue this project without the user repeating himself.
> Last updated: 2026-11-09. This file is the stable reference. The moving parts (status, open items, change log) live in **`WORKLOG.md`**.

---

## 0. How to use this file (for Claude)

1. The user will upload a zip of the project (code snapshot) plus, sometimes, `recent-changes.txt` (output of `git log -8 -p --stat`).
2. Unzip and read, in this order: this file, then **`PSYCHOLOGY.md`** (the product's learning design, binding), then **`WORKLOG.md`** (current status, open items, log), then `src/`.
3. Compare the code and commits with the last entry in `WORKLOG.md`. Anything different was changed by the user. Report it to him in 3 lines and record it under "User changes" in the worklog.
4. At the end of the session, **output the updated sections of `WORKLOG.md`** (Status, Open items, new Log entry) so the user can paste them in and push. Update this file only when something stable changes (decisions, code map, assets).
5. If something in the code contradicts these files, trust the code, tell the user, and fix the files.

---

## 1. The user and how to work with him

**Who:** Abdulkareem. Arabic speaker (Palestinian/Levantine dialect), writes short messages. Studies translation and business; the site teaches English to Arabic speakers. Beginner-to-intermediate with code: he can follow exact steps, copy and paste into VS Code, run npm and git, but needs paths, shortcuts and expected results spelled out.

**Other projects (completely separate, do not mix):** Lexora (vocabulary app), Fluentia (English platform), a Telegram movies bot, a dialect translation app. This website is **standalone**.

### Rules he set (follow them)
- **Reply in Arabic, concise and actionable, step by step.** Code, file names and UI terms stay in English.
- **Always send COMPLETE updated files.** Never "replace this part" or partial snippets. He repeated this after getting partial edits and was annoyed.
- **Be an expert programmer and be 100% honest.** Give a frank opinion and push back instead of just agreeing. He explicitly wants this.
- **Show a full draft for review before any action taken on his behalf.**
- **Ask at most one question per message.** Prefer numbered options with a recommended default. He often answers with a single number or word.

### How he works (observed)
- **Visual first.** He judges by screenshots and often cannot describe what he wants in words. Show options, interpret reference images, and give him the vocabulary ("that style is called scrollytelling / collage").
- **Short feedback loops:** screenshot, one-line reaction ("remove this", "good"), tweak, repeat.
- **Delegates creative decisions** ("you are the teacher") but notices and objects quickly when something is off. Do not ask the same question twice; decide, state the assumption, move on.
- **Ambitious about quality:** wants a clean, artistic, bold, "wow" site, not a generic template.
- **Hits message-limit caps** and continues in other chats or accounts. That is why this file and the GitHub repo exist. Keep answers compact where possible.
- **Tools he uses:** Windows, VS Code (auto save = afterDelay), PowerShell/Git Bash, Chromium-based browser, GitHub, Gemini for image generation.
- When he asks "what is X?" explain simply with an analogy, then continue.

### Do not
- Invent fake stats or testimonials on the site.
- Copy third-party design assets (the Dribbble "Fluency" shot by BL/S was **inspiration only**).
- Add real features to the landing page (see decisions).
- Introduce TypeScript, Tailwind or a new framework, or reorganize files, without asking.

---

## 2. Project in one paragraph

A bold, collage-style website that trains Arabic speakers to **speak American English clearly, confidently and without hesitating** (speaking-first; full design in `PSYCHOLOGY.md`). The **home page is a visual showcase only** (no logic) with a **Start** button that enters the real site. Inside the site, pages are calmer (same colors) and use **Arabic for meanings and translations**; the main interface language is English. Front end first; database, auth and cloud hosting come later.

---

## 3. Decisions made (and rejected)

**Chosen**
- Stack: React + Vite (JavaScript), `react-router-dom`, plain CSS in one file, Oxlint, npm. Node v24.
- Site type: a website for teaching English "in his own way and design", standalone.
- **Product focus (decided 2026-11-09):** the whole site revolves around speaking: correct pronunciation, General American accent, confidence, no hesitation, keep talking. The user has this problem himself and delegated the method to Claude. See `PSYCHOLOGY.md`. He accepts paid APIs and API keys later when needed.
- Style: dark background, hot pink + yellow, collage / sticker / torn paper, brush-marker headlines. Reference mood: bold and colorful, modern.
- **Two-level identity:** home page is bold and artistic; inner learning pages are the same palette but calmer and more readable.
- Main interface in **English**; Arabic only inside pages (meanings, example translations, hints) and set with `dir="rtl"`.
- Home page stays **non-functional/showcase**; **Start** goes to `/app`, which currently shows the Shadowing page temporarily. A dashboard will replace it.
- Hero headline: **TALK OUT LOUD!** Site name **"sayit."** is a **placeholder**.
- Image assets are generated with Gemini on a **solid green sheet**, then cut into transparent PNGs by script (see section 6).
- Pieces "fly in and stick" (cut-and-assemble effect) when they enter the screen.
- Progress ("known words") is saved in `localStorage` for now.

**Rejected**
- First design: calm cream background with blue accent (he did not like it).
- Custom mouse cursor (removed at his request).
- Using the Gemini hero mockup as one flat image (text baked in, no interaction); we use its pieces instead.
- The "ENGLISH 92% / ARABIC NATIVE" level chip in the hero (removed).
- Outlined brush numbers 01/02/03 in "How it works" (replaced by illustrations).

---

## 4. Tech and how to run

```
npm install
npm run dev        # http://localhost:5173
```
Dependencies added beyond the Vite React template: `react-router-dom`. Fonts load from Google Fonts (needs internet): Permanent Marker, Caveat, Inter, Space Mono, IBM Plex Sans Arabic.

`index.html`: `lang="en" dir="ltr"`, title "sayit. | Learn English".

---

## 5. Code map (state at last update)

```
index.html
src/
  main.jsx                (Vite default)
  App.jsx                 BrowserRouter; ScrollToTop; routes: "/" Home, "/app" Shadowing (temporary entry until the dashboard), "/shadowing", "/vocabulary"
  components/Nav.jsx      floating glass pill nav; on "/" shows What you get / How it works / Start; elsewhere Home / Shadowing / Vocabulary
  pages/Home.jsx          showcase landing page (details below)
  pages/Vocabulary.jsx    inner page: vocabulary cards
  pages/Shadowing.jsx     inner page: speaking practice (core of the product)
  pages/Shadowing.css     styles for that page only (new pages may keep their own CSS next to them)
  index.css               ALL styles (tokens, hero, marquee, paper sections, cards, vocab page, animations, mobile, reduced-motion)
public/images/*.png       52 transparent sticker/collage PNGs (list in section 6)
```

### Design tokens (`:root` in `index.css`)
`--bg #0D0D0F`, `--ink #F4F1EA`, `--muted #9A9AA0`, `--pink #F0185F`, `--yellow #F2D024`, `--paper #3A3A3C`, `--tear` (clip-path polygon for torn-paper edges).

### Home.jsx
- **Scroll progress bar** (fixed, pink to yellow).
- **Hero:** grid background, mouse-following pink glow (`.spot`), `.stage` container (`container-type: inline-size`, aspect ratio 1.85, sized so it fits the viewport). Words TALK (yellow with pink offset shadow), OUT and LOUD! (pink with yellow shadow) use `cqw` font sizes and per-letter pop animation (`Letters`). 17 pieces defined in `heroPieces` (position in % of the stage, rotation, fly-in start vector, parallax depth). Buttons: "Start Talking! →" and "Play Word Game", both link to `/app`.
- **Yellow tilted marquee** of section names (pauses on hover).
- **Paper section** (torn top edge, noise texture, grid): title "Pick your move." with underline/arrow/burst pieces; 4 `TiltCard`s (3D tilt + shine) each with a character pose image sticking out of the corner.
- **Dark section:** "Simple. Fast. Yours." with 3 illustrated steps; pink reverse marquee of slogans; "READY?" CTA with `pose-wave` and `pose-thumbs`; footer.
- **Fly system:** `<Piece>` wraps an image in `.px` (absolute, parallax via CSS vars `--mx/--my/--d`). An `IntersectionObserver` observes the **parent** (not the image, because it starts off-screen) and adds `in` to child `.fly` elements; after the transition ends `done` is added so hover wiggle has no delay. `--spin: 0deg` is used for characters so they do not rotate while flying.

### Shadowing.jsx (front end only, browser APIs)
12 sentences (tags: everyday / connected speech / keep talking) each with stress pattern, Arabic meaning and an Arabic pronunciation note. Per sentence, 4 steps: **Listen** (browser text-to-speech, slow and normal, voice picker that prefers en-US "Natural" voices), **Say it** (record with `MediaRecorder`, max 20 s), **Compare** (play mine, or model then mine), **Check** (Web Speech `SpeechRecognition`, en-US; words are matched in order with aliases gonna/wanna/gotta/kinda/lemme; shows a percentage and highlights matched/missed words; it checks understandability, not accent). Stats in `localStorage` key `sayit-speaking-stats` (`sec` spoken, `tries` per sentence id); selected voice in `sayit-voice`. Needs Chrome or Edge, internet for recognition, and microphone permission (works on localhost).

### Vocabulary.jsx
10 sample words (levels A2 to C1) with: English word, part of speech and pronunciation hint, Arabic meaning, example sentence with the word highlighted, Arabic translation of the example, speaker buttons (Web Speech API, `en-US`, rate 0.85). Level filters, status filters (All / Learning / Known), search (English or Arabic), "عرفتها" toggle, progress bar. Known words stored in `localStorage` key `sayit-known-words`. Cards have a small tape strip and tilt/pink shadow on hover.

---

## 6. Image assets

Folder `public/images/` (all transparent PNG with a white sticker border):

- **Hero stickers:** `hero-guy`, `bubble-ohyeah`, `bubble-sayit-yellow`, `label-sayit`, `label-gowild`, `megaphone-a`, `megaphone-b`, `chat-heart`, `badge-fun`
- **Decor:** `star-yellow-1`, `star-pink-1`, `star-pink-2`, `spark-yellow-1/2/3`, `spark-pink-1/2`, `zigzag-1` to `zigzag-4`
- **Character poses:** `pose-reading`, `pose-listening`, `pose-writing`, `pose-cards`, `pose-wave`, `pose-thumbs`
- **Collage:** `paper-white/grey/kraft/pink`, `tape-yellow/pink/white/black`, `polaroid-1/2` (transparent window), `arrow-pink/yellow/loop/double`, `circle-black/yellow/pink`, `underline-black/yellow/pink`, `burst-yellow/pink`
- **Step icons:** `step-learn`, `step-use`, `step-own`

Not yet used on the site: papers, tapes, polaroids, most arrows/circles/underlines, `badge`-type extras.

**How they were made:** Gemini generated sheets on flat `#00FF00`. `tools/chroma_cut.py` keys out the green (alpha from `G - max(R,B)`, despill) and splits pieces by connected components. Known limits: `hero-guy` is only about 626 px wide (soft on high-DPI screens); small decor pieces are 30 to 90 px.

**Gemini style block (reuse for new sheets):**
```
Flat vector cartoon sticker style, thick black outlines, bold shapes. Color palette ONLY: hot pink #F0185F, yellow #F2D024, black and white. Every element fully separate with generous empty space between elements (nothing touching or overlapping). Background: one flat solid pure chroma-key green (#00FF00), no gradient, no shadow, no grid, no texture. Do not use green anywhere inside the elements.
```
For the same character in new poses, give Gemini the reference image and say "same character".

---

## 7. Status and open items (snapshot; the live version is in `WORKLOG.md`)

**Unverified:** the latest hero (flying pieces, TALK OUT LOUD!) had been delivered but the user had **not yet sent a screenshot**. Positions and sizes in `heroPieces` and the `.word` font sizes are estimates and probably need tuning.

**Next, in suggested order**
1. Review hero screenshot and tune layout.
2. Mobile layout for the hero (currently only shrinks).
3. **Dashboard** at `/app`: sidebar navigation, progress ring, stats (known words, level, streak), "continue where you left off", section cards. Replaces the temporary Shadowing entry route; should present the speaking ladder as the user's path.
4. Reading page (text with highlighted words, tap a word for Arabic and audio).
5. Listening, then Writing (connectors, sentence ordering).
6. Expand vocabulary to about 40+ words; give inner pages a touch of the collage style (tape, tilt) without hurting readability.
7. **Later:** database + accounts + deploy to the cloud (he already knows Firebase from another project; discuss options before choosing).
8. Final site name, real page title, favicon.

**Known caveats**
- Progress is per browser/device until a database exists.
- `container query units (cqw)` need a modern Chromium/Safari/Firefox.
- Web Speech voice quality depends on the user's device.
- Hero logic is desktop-first (parallax uses the mouse).

---

## 8. Working with GitHub (user workflow)

Before ending a session or switching accounts:
```
git add -A
git commit -m "short clear message about what changed"
git push
git archive --format=zip -o project.zip HEAD
git log -8 -p --stat | Out-File -Encoding utf8 recent-changes.txt
```
Upload `project.zip` and `recent-changes.txt` to the new chat. (On Windows PowerShell use `Out-File -Encoding utf8` as above; a plain `>` writes UTF-16 and the file becomes unreadable. Add `project.zip` and `recent-changes.txt` to `.gitignore`.) In the Claude account used for the next session, "Code execution and file creation" must be enabled so it can open the zip. `git archive` leaves out `node_modules` and `.git`, so the zip stays small. Meaningful commit messages help Claude see what changed.

---

## 9. Session log

Moved to **`WORKLOG.md`** (status, open items, and the dated log of changes by the user and by Claude).
