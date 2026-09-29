"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { QUESTS, REGIONS } from "@/lib/content";
import { useLexStore, masteryFor } from "@/lib/store";
import { Instruction } from "@/components/ui";
import { spacedReviewQueue } from "@/lib/adaptive";

export default function MapPage() {
  const me = useLexStore((s) => s.students.find((x) => x.id === s.activeStudentId));
  const attempts = useLexStore((s) => s.attempts);
  const setActive = useLexStore((s) => s.setActive);
  const students = useLexStore((s) => s.students);

  if (!me) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 space-y-4">
        <h1 className="text-4xl font-extrabold">Who is playing?</h1>
        {students.length === 0 ? (
          <Link href="/onboarding" className="touch-target inline-block rounded-full bg-berry text-white px-8 py-4 font-bold">Create a hero first →</Link>
        ) : (
          <div className="grid gap-3">
            {students.map((s) => (
              <button key={s.id} onClick={() => setActive(s.id)} className="touch-target rounded-3xl bg-white p-5 shadow text-left text-2xl font-bold">
                {s.avatar} {s.name} — Level {s.level} • {s.xp} XP
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const review = spacedReviewQueue(attempts);
  const isUnlocked = (qid: string) => {
    if (me.unlocked.includes(qid)) return true;
    // mastery gate: previous quest in region needs 80% on its skill
    const [region, n] = qid.split("-");
    const num = parseInt(n, 10);
    if (num === 1) return true;
    const prev = QUESTS.find((q) => q.id === `${region}-${num - 1}`);
    if (!prev) return true;
    return masteryFor(attempts, prev.skill) >= 80;
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <div className="rounded-3xl bg-white/80 px-5 py-3 shadow font-bold text-xl">
          {me.avatar} {me.name} • Lv {me.level} • ⭐ {me.xp} XP • 🔥 {me.streak} day streak
        </div>
        <Link href="/dashboard" className="touch-target rounded-full bg-white px-5 py-2 font-bold shadow">📊 Grown-ups</Link>
        <Link href="/settings" className="touch-target rounded-full bg-white px-5 py-2 font-bold shadow">⚙️ Comfort</Link>
      </header>

      <Instruction text={`Welcome back, ${me.name}. Pick a glowing quest. Locked ones open soon.`} />

      {review.length > 0 && attempts.length > 0 && (
        <p className="rounded-2xl bg-gold/30 p-4 font-semibold">🌱 Warm-up: your brain wants to review <strong>{review.join(" and ")}</strong>. Play any glowing quest.</p>
      )}

      {REGIONS.map((r) => (
        <section key={r.id} aria-label={r.name} className="rounded-3xl p-5 shadow-xl" style={{ background: `${r.color}22` }}>
          <h2 className="text-3xl font-extrabold">{r.emoji} {r.name}</h2>
          <p className="opacity-80 text-lg">{r.desc}</p>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-3" role="list">
            {QUESTS.filter((q) => q.region === r.id).map((q, i) => {
              const open = isUnlocked(q.id);
              const m = masteryFor(attempts, q.skill);
              return (
                <motion.div key={q.id} role="listitem" whileHover={open ? { y: -6 } : {}}
                  className={`min-w-[220px] rounded-3xl p-5 shadow ${open ? "bg-white" : "bg-black/10 opacity-80"}`}>
                  <p className="text-4xl" aria-hidden>{open ? (i % 3 === 2 ? "🐲" : i % 3 === 1 ? "🌉" : "🦊") : "🔒"}</p>
                  <h3 className="font-extrabold text-lg leading-snug">{q.title}</h3>
                  <p className="text-sm opacity-70">{q.skill} • {q.minutes} min</p>
                  <p className="text-sm">Skill: {m}%</p>
                  {open ? (
                    <Link href={`/quest/${q.id}`} aria-label={`Play ${q.title}`}
                      className="touch-target mt-2 inline-block rounded-full bg-berry text-white px-5 py-2 font-bold">Play ▶</Link>
                  ) : (
                    <p className="mt-2 font-bold">🔒 Finish earlier quest to 80%</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
