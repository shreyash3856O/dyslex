"use client";
import Link from "next/link";
import { StoryPlayer } from "@/components/story";
import { FilmOverlay, useAutoFilm } from "@/components/cinema";

const STEPS = [
  {
    n: "1",
    title: "Listen first",
    text: "Every line can be heard aloud. Words light up as they are read, so listening and looking stay together."
  },
  {
    n: "2",
    title: "Play in short rounds",
    text: "Sound Match, Tile Blend, Segment Tap, Spell Cast, and a friendly Boss Battle. Twelve to twenty minutes, split into small wins."
  },
  {
    n: "3",
    title: "Grow without fear",
    text: "There are no red marks and no punishing timers. Misses lower the difficulty and add hints. A missed day never breaks the streak."
  },
  {
    n: "4",
    title: "Grown ups stay in charge",
    text: "Consent comes first. Nicknames only. Voice is processed live and never stored unless you opt in. The dashboard shows real attempt data."
  }
];

export default function Home() {
  const { open, setOpen } = useAutoFilm();
  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#2B2118]">
      {open && <FilmOverlay onClose={() => setOpen(false)} />}
      <header className="border-b-2 border-[#2B2118] bg-[#FFF8E8]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
          <Link href="/" className="flex items-center gap-2 font-extrabold" aria-label="LexQuest home">
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
              <circle cx="15" cy="15" r="13" fill="#2E7D5B" />
              <path d="M10 19 L15 8 L20 19 Z" fill="#FFF8E8" />
              <circle cx="15" cy="17" r="2" fill="#F5B301" />
            </svg>
            LexQuest
          </Link>
          <nav className="ml-auto flex flex-wrap gap-2" aria-label="Primary">
            <a href="#opening" className="touch-target rounded-xl px-4 py-2 font-bold underline">The opening</a>
            <a href="#how" className="touch-target rounded-xl px-4 py-2 font-bold underline">How it works</a>
            <Link href="/privacy" className="touch-target rounded-xl px-4 py-2 font-bold underline">Privacy</Link>
            <Link href="/onboarding"
              className="touch-target rounded-xl bg-[#2B2118] px-5 py-2 font-extrabold text-white">
              Start
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-10 pt-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="space-y-5">
            <p className="inline-block rounded-full border-2 border-[#2B2118] bg-white px-4 py-1 text-sm font-bold">
              A reading adventure for ages 7 to 14
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              The Realm lost its sounds. You can find them.
            </h1>
            <p className="max-w-[52ch] text-lg">
              LexQuest turns daily reading practice into a quest built on structured
              literacy. Your child listens first, then plays with sounds, letters,
              and words. Short sessions. Steady growth.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#opening"
                className="touch-target rounded-xl bg-[#2E7D5B] px-7 py-3 text-lg font-extrabold text-white shadow-[4px_4px_0_#2B2118] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                Play the opening
              </a>
              <Link href="/map"
                className="touch-target rounded-xl border-2 border-[#2B2118] bg-white px-7 py-3 text-lg font-bold shadow-[4px_4px_0_#2B2118] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                See the map
              </Link>
            </div>
            <ul className="space-y-2 text-base font-semibold">
              <li className="flex gap-2"><span aria-hidden className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full bg-[#2E7D5B]" /> Audio on every word and instruction.</li>
              <li className="flex gap-2"><span aria-hidden className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full bg-[#2E7D5B]" /> Nonsense words included, like real phonics lessons.</li>
              <li className="flex gap-2"><span aria-hidden className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full bg-[#2E7D5B]" /> Kind feedback only. Effort earns as much as accuracy.</li>
            </ul>
          </div>

          <div id="opening" className="scroll-mt-6 space-y-5">
            <button onClick={() => setOpen(true)} aria-label="Watch the opening film fullscreen"
              className="group flex w-full items-center gap-4 rounded-2xl bg-black p-5 text-left text-white shadow-[6px_6px_0_#2B2118]">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F5B301]" aria-hidden>
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" fill="#14100B" /></svg>
              </span>
              <span>
                <span className="block text-xl font-extrabold">Watch the opening film</span>
                <span className="block opacity-70">Fullscreen. About 35 seconds. Press S to skip.</span>
              </span>
            </button>
            <p className="rounded-xl border-2 border-dashed border-[#2E7D5B] bg-white p-4 font-bold">
              Now play it yourself. Five quick scenes. Tap, blend, and read along.
            </p>
            <StoryPlayer />
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/onboarding"
                className="touch-target rounded-xl bg-[#E9A100] px-6 py-3 font-extrabold text-[#2B2118] shadow-[4px_4px_0_#2B2118] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                Create your hero
              </Link>
              <Link href="/map" className="touch-target rounded-xl px-6 py-3 font-bold underline">
                Skip ahead to the map
              </Link>
            </div>
          </div>
        </section>

        <section id="how" aria-label="How the quest works" className="scroll-mt-6 border-t-2 border-[#2B2118] bg-white">
          <div className="mx-auto max-w-3xl px-5 py-12">
            <h2 className="text-3xl font-extrabold">How the quest works</h2>
            <p className="mt-2 max-w-[58ch] text-lg">
              One path, in order. Each step builds on the last, the way reading
              instruction should.
            </p>
            <ol className="mt-8 space-y-0">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`relative flex gap-4 pb-8 ${i < STEPS.length - 1 ? "border-l-2 border-[#E4D9C2] pl-0" : ""}`}>
                  <span aria-hidden
                    className="relative z-10 -ml-[21px] mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2B2118] bg-[#F5B301] text-lg font-extrabold">
                    {s.n}
                  </span>
                  <div className="ml-2">
                    <h3 className="text-xl font-extrabold">{s.title}</h3>
                    <p className="mt-1 max-w-[58ch]">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-label="For grown ups" className="bg-[#22304A] text-white">
          <div className="mx-auto max-w-3xl space-y-4 px-5 py-12">
            <h2 className="text-3xl font-extrabold">For grown ups</h2>
            <p className="max-w-[58ch] text-lg">
              Set up takes under three minutes. Add a nickname, pick an avatar,
              grant voice consent, and your child is playing. You get weekly minutes,
              a skill heatmap from real attempts, and a CSV export for school.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/onboarding" className="touch-target rounded-xl bg-white px-6 py-3 font-extrabold text-[#22304A]">
                Set up your child
              </Link>
              <Link href="/privacy" className="touch-target rounded-xl border-2 border-white px-6 py-3 font-bold">
                Read the privacy page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-[#2B2118] bg-[#FFF8E8]">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-5 py-6 text-sm font-semibold">
          <span>LexQuest. A gentle reading quest.</span>
          <span className="ml-auto flex gap-4">
            <Link href="/map" className="underline">Map</Link>
            <Link href="/dashboard" className="underline">Dashboard</Link>
            <Link href="/privacy" className="underline">Privacy</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
