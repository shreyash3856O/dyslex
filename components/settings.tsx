"use client";
import { useLexStore } from "@/lib/store";

const HAIRS = ["curls", "braids", "spikes", "hood"];
const OUTFITS = ["cloak", "armor", "robe", "scarf"];
const PETS = ["fox", "owl", "dragon", "turtle"];
const AVATARS = ["🧙", "🐉", "🦊", "🦉", "🐢", "🤖"];

export function Customizer() {
  const me = useLexStore((s) => s.students.find((x) => x.id === s.activeStudentId));
  const customize = useLexStore((s) => s.customize);
  if (!me) return null;
  const row = (label: string, opts: string[], key: "hair" | "outfit" | "pet" | "avatar") => (
    <div className="mb-3">
      <p className="font-bold">{label}</p>
      <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label={label}>
        {opts.map((o) => (
          <button key={o} role="radio" aria-checked={(me as any)[key] === o}
            onClick={() => customize({ [key]: o } as any)}
            className={`touch-target rounded-xl px-4 py-2 text-lg shadow ${(me as any)[key] === o ? "bg-berry text-white" : "bg-white"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <section aria-label="Character customizer" className="rounded-3xl bg-white/70 p-5 shadow">
      <h2 className="text-2xl font-extrabold mb-2">Your hero {me.avatar}</h2>
      {row("Avatar", AVATARS, "avatar")}
      {row("Hair", HAIRS, "hair")}
      {row("Outfit", OUTFITS, "outfit")}
      {row("Pet friend", PETS, "pet")}
    </section>
  );
}

export function SettingsPanel() {
  const s = useLexStore((st) => st.settings);
  const update = useLexStore((st) => st.updateSettings);
  return (
    <section aria-label="Reading settings" className="rounded-3xl bg-white/70 p-5 shadow space-y-4">
      <h2 className="text-2xl font-extrabold">Reading comfort</h2>
      <div>
        <label className="font-bold" htmlFor="font">Font</label>
        <div className="flex gap-2 mt-1" role="radiogroup" aria-label="Font">
          {(["lexend", "opendyslexic", "atkinson"] as const).map((f) => (
            <button key={f} role="radio" aria-checked={s.font === f} onClick={() => update({ font: f })}
              className={`touch-target rounded-xl px-4 py-2 shadow ${s.font === f ? "bg-berry text-white" : "bg-white"}`}>{f}</button>
          ))}
        </div>
      </div>
      <label className="block font-bold">Letter spacing
        <input type="range" min={0} max={0.2} step={0.01} value={s.letterSpacing} aria-label="Letter spacing"
          onChange={(e) => update({ letterSpacing: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="block font-bold">Line spacing
        <input type="range" min={1.3} max={2.4} step={0.1} value={s.lineSpacing} aria-label="Line spacing"
          onChange={(e) => update({ lineSpacing: Number(e.target.value) })} className="w-full" />
      </label>
      <div>
        <p className="font-bold">Background</p>
        <div className="flex gap-2" role="radiogroup" aria-label="Background theme">
          {(["cream", "pastel", "dark"] as const).map((t) => (
            <button key={t} role="radio" aria-checked={s.theme === t} onClick={() => update({ theme: t })}
              className={`touch-target rounded-xl px-4 py-2 shadow ${s.theme === t ? "bg-berry text-white" : "bg-white"}`}>{t}</button>
          ))}
        </div>
      </div>
      {[
        ["High contrast", "highContrast"], ["Calm motion", "reducedMotion"],
        ["Listen-first mode", "listenFirst"], ["Slow sound-out", "slowMo"], ["Voice on", "voiceOn"]
      ].map(([label, key]) => (
        <label key={key} className="flex items-center gap-3 text-lg font-semibold">
          <input type="checkbox" checked={(s as any)[key]} onChange={(e) => update({ [key]: e.target.checked } as any)} className="h-6 w-6" />
          {label}
        </label>
      ))}
      <div>
        <label className="font-bold" htmlFor="narr">Narrator voice</label>
        <div className="flex gap-2 mt-1 flex-wrap" role="radiogroup" aria-label="Narrator voice">
          {(["wizard", "dragon", "robot", "calm"] as const).map((n) => (
            <button key={n} id="narr" role="radio" aria-checked={s.narrator === n} onClick={() => update({ narrator: n })}
              className={`touch-target rounded-xl px-4 py-2 shadow ${s.narrator === n ? "bg-berry text-white" : "bg-white"}`}>🔊 {n}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
