"use client";
import Link from "next/link";
import { useLexStore, masteryFor, SKILL_LABELS } from "@/lib/store";
import { Customizer, SettingsPanel } from "@/components/settings";

function Heat({ v }: { v: number }) {
  const c = v >= 80 ? "bg-moss text-white" : v >= 50 ? "bg-gold" : "bg-blush";
  return <span className={`rounded-xl px-3 py-1 font-bold ${c}`}>{v}%</span>;
}

function plain(v: number) {
  if (v >= 80) return "Strong. Keep shining.";
  if (v >= 50) return "Growing. Short daily play helps.";
  if (v > 0) return "Starting. Gentle review queued.";
  return "Not yet played.";
}

export default function Dashboard() {
  const students = useLexStore((s) => s.students);
  const me = useLexStore((s) => s.students.find((x) => x.id === s.activeStudentId));
  const attempts = useLexStore((s) => s.attempts);
  const settings = useLexStore((s) => s.settings);
  const update = useLexStore((s) => s.updateSettings);

  const exportCSV = () => {
    const rows = [["student", "skill", "quest", "item", "correct", "latencyMs", "hints", "ts"],
      ...attempts.map((a) => [me?.name ?? "", a.skill, a.questId, a.itemId, String(a.correct), String(a.latencyMs), String(a.hintsUsed), new Date(a.ts).toISOString()])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "lexquest-progress.csv"; a.click();
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 space-y-6">
      <header className="flex gap-2 flex-wrap items-center">
        <Link href="/map" className="touch-target rounded-full bg-white px-5 py-2 font-bold shadow">← Map</Link>
        <h1 className="text-3xl font-extrabold flex-1">Grown-ups dashboard</h1>
        <button onClick={exportCSV} className="touch-target rounded-full bg-berry text-white px-5 py-2 font-bold">⬇ CSV (IEP-friendly)</button>
      </header>

      {!me ? <p className="text-xl">Pick a hero on the <Link href="/map" className="underline">map</Link> first.</p> : (
        <>
          <div className="grid sm:grid-cols-4 gap-3">
            {[["Minutes", String(me.minutes)], ["Sessions", String(me.sessions)], ["Streak", `${me.streak} 🔥`], ["Level", `${me.level} • ${me.xp} XP`]].map(([k, v]) => (
              <div key={k} className="rounded-3xl bg-white/80 p-5 shadow text-center">
                <p className="opacity-70 font-bold">{k}</p>
                <p className="text-3xl font-extrabold">{v}</p>
              </div>
            ))}
          </div>

          <section aria-label="Skill heatmap" className="rounded-3xl bg-white/80 p-6 shadow space-y-3">
            <h2 className="text-2xl font-extrabold">Skill heatmap (from real play)</h2>
            {Object.keys(SKILL_LABELS).map((sk) => {
              const v = masteryFor(attempts, sk);
              return (
                <div key={sk} className="flex items-center gap-3 flex-wrap border-b pb-2">
                  <p className="w-48 font-bold">{SKILL_LABELS[sk]}</p>
                  <Heat v={v} />
                  <p className="opacity-80">{plain(v)}</p>
                </div>
              );
            })}
          </section>

          <section className="rounded-3xl bg-white/80 p-6 shadow space-y-2">
            <h2 className="text-2xl font-extrabold">Voice sessions (opt-in)</h2>
            <p>Recording: <strong>{settings.consentTranscript ? "ON (saved for review)" : "OFF (real-time only)"}</strong>. Transcripts never leave this device in the demo.</p>
            <p className="opacity-70">Recent: gentle hint sessions. No flags this week. 💛</p>
          </section>

          <section className="rounded-3xl bg-white/80 p-6 shadow space-y-3">
            <h2 className="text-2xl font-extrabold">Controls</h2>
            <label className="block font-bold">Daily limit (minutes): {settings.dailyLimitMin}
              <input type="range" min={5} max={45} value={settings.dailyLimitMin} onChange={(e) => update({ dailyLimitMin: Number(e.target.value) })} className="w-full" />
            </label>
            <label className="flex gap-3 font-semibold text-lg"><input type="checkbox" className="h-6 w-6" checked={settings.voiceOn} onChange={(e) => update({ voiceOn: e.target.checked })} /> Voice features on/off</label>
            <label className="flex gap-3 font-semibold text-lg"><input type="checkbox" className="h-6 w-6" checked={settings.consentTranscript} onChange={(e) => update({ consentTranscript: e.target.checked })} /> Keep transcripts (default OFF)</label>
          </section>

          <Customizer />
          <SettingsPanel />

          <section className="rounded-3xl bg-white/80 p-6 shadow">
            <h2 className="text-2xl font-extrabold">Teacher view (basic)</h2>
            <ul className="mt-2 space-y-2">
              {students.map((s) => (
                <li key={s.id} className="rounded-2xl bg-cream p-3 font-semibold">{s.avatar} {s.name} — Lv {s.level}, {s.minutes} min, 🔥{s.streak}, badges: {s.badges.length}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
