# WORKLOG: what changed, what is left

> Living file. `HANDOFF.md` explains the project and how to work with the user (stable).
> This file tracks **what is happening now** (changes by the user and by Claude, and what is still open).

## How we use it

**Start of every session (Claude):**
1. Read `HANDOFF.md`, then this file, then the code.
2. If the user uploaded `recent-changes.txt` or a zip, compare it with the last entry below. Anything that differs was changed by the user. Write it under **User changes** in the new entry (one line each, plain words).
3. Tell the user in 3 lines max: what you found changed, what is open, what you suggest next.

**After every meaningful step, and at the end of every session (Claude):**
1. Output the updated parts of this file so the user can paste them in, commit and push.
2. **The Log is append-only.** Add a new dated entry at the top for each step that was done or confirmed. **Never delete or rewrite old entries.**
3. **Open items:** when something is done, change `[ ]` to `[x]` and leave the line. Add new items at the right priority. Do not delete lines.
4. **Status** is only a snapshot of "right now"; this is the one part you may rewrite.
5. Keep each entry short (2 to 4 lines).

**User:** you do not have to write anything here. After each step that works, run `git add -A`, `git commit -m "short message"`, `git push` (for example `hero: smaller TALK text`). If you skip `push`, a new Claude only sees the old version. Claude reads the commits and fills this file.

---

## Status (updated 2026-11-09, late night)

- **Working:** Home page (hero, marquees, torn-paper sections, tilt cards, step illustrations, CTA), Vocabulary page (filters, search, known tracker, audio), routing (`/`, `/app`, `/vocabulary`), 52 images in `public/images/`.
- **Verified by the user (screenshots):** the hero (TALK OUT LOUD! with flying pieces) renders well and fits the first screen; after the second position fix the K of TALK and the top bubble are clear.
- **Temporary:** `/app` shows the Vocabulary page until the dashboard exists.
- **Repo:** GitHub, branch `main`. Latest pushed commit: run `git log -1` (do not trust a hash written here; see the Log for recorded ones).

## Open items

Priority order. Mark `[x]` when done and leave the line in place; add a matching entry to the Log.

**Next**
- [x] User sends hero screenshot; Claude tunes `heroPieces` positions and `.word` sizes. (Hero approved by the user; no tuning requested.)
- [x] Optional: separate OUT a little from TALK and show more of the L in LOUD! (the character's hand covers it). Done in `Home.jsx` (new word sizes/positions, LOUD! above the character).
- [ ] Mobile layout for the hero (it only shrinks now).
- [ ] Dashboard at `/app` (sidebar, progress ring, stats, "continue", section cards).

**Soon**
- [ ] Reading page (highlighted words, tap for Arabic + audio).
- [ ] Listening page, then Writing page.
- [ ] Expand vocabulary to about 40+ words.
- [ ] Give inner pages a touch of the collage style (tape, tilt) without hurting readability.
- [ ] Use unused assets (paper, tape, polaroids, arrows, circles) where they help.

**Later**
- [ ] Database + accounts + deploy to the cloud (discuss options first).
- [ ] Final site name (currently the placeholder "sayit."), page title, favicon.
- [ ] Better-resolution `hero-guy` (currently about 626 px wide).

**User to-do (small)**
- [ ] Confirm the GitHub repo is **Private**.
- [ ] Optional: remove `project_code.txt` and `project_code.txt~` from the repo and add them to `.gitignore`.

---

## User changes since the last Claude session

_(Claude fills this at the start of each session after reading the diff. Write "none detected" if nothing changed.)_

- none yet

---

## Log (newest first)

### 2026-11-09 (late night, 3)
- **User:** approved the hero after the second fix. Committed and pushed it: commit `cc85fdd` "hero: fix TALK overlap and top bubble" (included `Home.jsx`, `HANDOFF.md` and the new `WORKLOG.md`; previous pushed commit `56c0e1c`). Git showed only harmless LF/CRLF line-ending warnings.
- **Claude:** removed the commit hash from the Status section (it goes stale after every push). Open for the user: confirm the repo is Private.

### 2026-11-09 (late night, 2)
- **User:** approved the new word/character positions but pointed out that the character's head still covers the K of TALK and the yellow "SAY IT!" bubble is under the nav bar. Asked to fix everything.
- **Claude:** in `Home.jsx` only: TALK shifted left and smaller (16cqw), character moved right and a little lower so the K is fully visible; OUT and LOUD! nudged right; yellow bubble and a spark moved down inside the stage; `.stage` got a small top margin so top pieces stay clear of the nav while the mouse parallax moves them. Suggested commit: `hero: fix TALK overlap and top bubble`.

### 2026-11-09 (late night)
- **User:** asked to fix the positions of the character and the words in the hero.
- **Claude:** in `Home.jsx` only: TALK smaller (16.5cqw) and OUT moved right so they no longer touch; LOUD! moved right/smaller and drawn above the character so the L is readable; character moved left; megaphone, yellow bubble and a star nudged to avoid overlaps. `Word` now accepts a `z` prop. Suggested commit: `hero: fix word and character positions`.

### 2026-11-09 (night)
- **User:** sent a screenshot of the new hero and approved it ("everything works, looks great"). Asked for the log to be append-only (add per step, never remove).
- **Claude:** made the Log append-only and the Open items tick-only (see "How we use it"). Noted two small optional hero tweaks.

### 2026-11-09 (evening)
- **User:** created the GitHub repo and pushed the project. Added `HANDOFF.md` to the project root and pushed it (`56c0e1c`). The push also included `project_code.txt` and `project_code.txt~` (leftover files, not part of the app).
- **Claude:** wrote `HANDOFF.md` and `chroma_cut.py` (image cutting tool, goes in `tools/`). Created this file.

### 2026-11-09 (earlier)
- **Claude:** created the Vite React project and the Vocabulary page; built the Home page (marquee, torn-paper sections, tilt cards, parallax, scroll bar, per-letter animation); added routing and a route-aware Nav; removed the custom cursor, the hero level chip and the outlined step numbers.
- **User:** rejected the first cream/blue design; picked a dark collage reference; generated four Gemini sticker sheets; placed the cut images in `public/images/`.
- **Claude:** cut the sheets into 52 transparent PNGs; rebuilt the hero as TALK OUT LOUD! with pieces that fly in and stick; added poses to the cards, step illustrations and CTA characters.
