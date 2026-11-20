# ash-portfolio

The portfolio is `site/` (Vite, vanilla TypeScript, GSAP, Lenis, prerendered), served at `/`. Build brief and design rules for the whole site: `site/BRIEF.md`.

## Case studies

Any work on a project's case page (`/work/<slug>/`), its copy, its captures or its mockups goes through the `case-study` skill, or the `case-study` agent for a whole case study. Do not hand-build a case page.

- **Rules and run log:** vault `C:\Users\ashut\Vault\20 Areas\Case Studies\` (start at `Case Studies.md`). New presentation rules go into its rulebook first.
- **Story kit:** `site/src/templates/stories/kit.ts`, `site/src/views/stories/kit.ts`, `site/src/styles/story.css`. A story is `templates/stories/<slug>.ts` + `views/stories/<slug>.ts` + `styles/stories/<slug>.css`, picked up by filename. Start one with the skill's `new_story.py`.
- **Quality floor:** the DASH page. Score every story with `score_page.py` before reporting.
- **Working files:** `case-studies/<slug>/` (BUILD-LOG, copy, deck, MOCKUPS). Captures in `.shots/<slug>/` and tools in `.shots/tools/`, both untracked.
- **Mockups:** made by the `mockup` skill (a generated photo with the real capture pinned on the screen), in `.shots/mockups/<slug>/`. Approved ones and monthly capacity: vault `20 Areas\Case Studies\Mockup system.md`.

## Always

- No em or en dashes anywhere, including code comments.
- Verify visual changes in Playwright at 1440 and 390 before reporting.
- Other work is often in progress on the same branch: touch only the files your task owns. Never commit unless asked.
