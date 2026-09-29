# LexQuest — Reading Adventure (MVP)

Fantasy RPG practice for dyslexic readers (7–14). Structured literacy, kind voices, zero shame.

## Quick start (2 min, no keys needed)
```bash
npm install
npm run dev
# open http://localhost:3000
```
Demo runs fully offline with browser storage. Supabase + Anthropic are optional and enhance it.

## Env vars
Copy `.env.example` to `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — auth + DB (optional for demo)
- `ANTHROPIC_API_KEY` — AI guide (server route only). Without it, a local hint engine answers so voice flow still works.

## Flow (under 3 min)
1. `/` — CodeDex-style scrolling story intro → Start your story
2. `/onboarding` — nickname + PIN + avatar + parent voice consent
3. `/map` — 3 regions × 10 quests = 30 quests, mastery-gated at 80%
4. `/quest/[id]` — 6 rounds: Sound Match, Segment Tap, Tile Blend, Spell Cast, Sound Match, Boss Battle
5. `/dashboard` — minutes, heatmap from real attempts, CSV export, controls
6. 📞 Call Your Guide — in-app voice (STT → `/api/guide` → TTS), hint-only

## How to add quests (no code)
Edit `lib/content.ts` — or, with Supabase, insert into `quests` + `quest_items`:
```sql
insert into quests (id, region, title, story, skill, minutes, data) values ('woods-11','woods','New Trail','...','letter-sound',12,'{}');
```
Quest JSON shape: `{ id, kind, skill, instruction, prompt, target, choices?, tiles?, phonemes?, nonsense?, hint, passage? }`.
Run `supabase/schema.sql` in Supabase SQL editor for tables + RLS starter.

## Key files
- `app/page.tsx` — story intro animation
- `lib/content.ts` — 30 seeded quests
- `lib/store.ts` — Zustand + XP/streak/badges/mastery
- `lib/speech/tts.ts`, `lib/speech/stt.ts` — swap point for Azure/Google/ElevenLabs
- `lib/guide/prompt.md` — editable guide system prompt
- `app/api/guide/route.ts` — guarded Claude call (20-turn cap, PII strip, mock fallback)
- `public/sw.js` — offline cache for core quests

## Accessibility
Fonts (Lexend/OpenDyslexic/Atkinson), spacing sliders, cream/pastel/dark, high-contrast, reduced-motion, 48px targets, keyboard + ARIA, karaoke highlight, listen-first toggle.

## Deploy (Vercel, recommended)
1. Push this folder to GitHub.
2. Import the repo in Vercel. Framework preset: Next.js. No extra build settings needed.
3. Optional env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`.
4. Deploy. PWA service worker registers only in production, so local dev always shows fresh edits.

## Assumptions & next steps
Assumptions: browser storage = demo DB; PIN is device-local (hash before Supabase); TTS voices vary by device; guide mock used without key.
Next: Supabase Auth + RLS wiring, Azure neural voices for latency, unit tests for mastery gates, teacher class codes, Lighthouse CI ≥95.
