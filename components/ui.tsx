"use client";
import { useState } from "react";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { useLexStore } from "@/lib/store";

export function SpeakButton({ text, label, slow = false }: { text: string; label?: string; slow?: boolean }) {
  const narrator = useLexStore((s) => s.settings.narrator);
  const slowMoDefault = useLexStore((s) => s.settings.slowMo);
  const [playing, setPlaying] = useState(false);
  return (
    <button
      aria-label={label ?? `Listen: ${text}`}
      onClick={async () => {
        if (playing) { stopSpeak(); setPlaying(false); return; }
        setPlaying(true);
        await speak(text, { narrator, slowMo: slow || slowMoDefault });
        setPlaying(false);
      }}
      className="touch-target inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-lg font-bold shadow hover:scale-105 transition"
    >
      <span aria-hidden>{playing ? "⏸" : "🔊"}</span>
      <span>{label ?? "Hear it"}</span>
    </button>
  );
}

export function KaraokeText({ text, active }: { text: string; active: number }) {
  return (
    <p className="text-2xl leading-relaxed" aria-live="polite">
      {text.split(/\s+/).map((w, i) => (
        <span key={i} className={`karaoke-word ${i === active ? "active" : ""}`}>{w} </span>
      ))}
    </p>
  );
}

export function Instruction({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/70 p-4 shadow">
      <p className="text-xl font-semibold flex-1 min-w-[200px]">{text}</p>
      <SpeakButton text={text} label="Hear" />
    </div>
  );
}

export function Celebration({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
      <div className="text-6xl animate-bounce">🎉 ✨ 🌟 ✨ 🎉</div>
    </div>
  );
}
