"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { listenOnce, isSTTSupported } from "@/lib/speech/stt";
import { speak } from "@/lib/speech/tts";

export function GuideCall({ questId, itemPrompt }: { questId: string; itemPrompt: string }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hint" | "read">("hint");
  const [log, setLog] = useState<{ who: string; text: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [passage] = useState(itemPrompt);

  const ask = async (speech: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, childSpeech: speech, questId, itemPrompt: passage, noNames: true })
      });
      const data = await res.json();
      setLog((l) => [...l, { who: "child", text: speech }, { who: "guide", text: data.reply }]);
      await speak(data.reply).catch(() => {});
      if (data.flagged) setLog((l) => [...l, { who: "guide", text: "💛 I told your grown-up I am here to help." }]);
    } catch {
      setLog((l) => [...l, { who: "guide", text: "I am here. Let us sound it out together." }]);
    }
    setBusy(false);
  };

  const talk = async () => {
    if (!isSTTSupported()) {
      const typed = prompt("Type what you want to say to your guide:");
      if (typed) ask(typed);
      return;
    }
    try {
      setBusy(true);
      const r = await listenOnce({ timeoutMs: 7000 });
      setBusy(false);
      if (r.transcript) ask(r.transcript);
    } catch { setBusy(false); }
  };

  if (!open)
    return (
      <button onClick={() => setOpen(true)} aria-label="Call your reading guide"
        className="touch-target fixed bottom-5 right-5 z-50 rounded-full bg-berry text-white px-6 py-4 text-xl font-extrabold shadow-2xl hover:scale-105">
        📞 Call Your Guide
      </button>
    );

  return (
    <div role="dialog" aria-label="Guide voice call" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl" aria-hidden>🧙</motion.div>
          <div>
            <h2 className="text-2xl font-extrabold">Nimbus the Guide</h2>
            <p className="opacity-70">{busy ? "Listening..." : "On the line • hints only"}</p>
          </div>
          <button onClick={() => setOpen(false)} className="ml-auto touch-target rounded-full bg-white px-4 py-2 font-bold shadow" aria-label="Hang up">✕</button>
        </div>
        <div className="flex gap-2" role="tablist" aria-label="Guide mode">
          {(["hint", "read"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`touch-target rounded-full px-5 py-2 font-bold ${mode === m ? "bg-berry text-white" : "bg-white shadow"}`}>
              {m === "hint" ? "💡 Hint" : "📖 Read with me"}
            </button>
          ))}
        </div>
        <div className="max-h-56 overflow-auto space-y-2" aria-live="polite">
          {log.length === 0 && <p className="opacity-70">Say hello. I never give the answer. We find it together.</p>}
          {log.map((m, i) => (
            <p key={i} className={`rounded-2xl p-3 ${m.who === "guide" ? "bg-white" : "bg-gold/40 text-right"}`}>
              <strong>{m.who === "guide" ? "Nimbus: " : "You: "}</strong>{m.text}
            </p>
          ))}
        </div>
        <button onClick={talk} disabled={busy} className="touch-target w-full rounded-full bg-moss text-white py-4 text-xl font-extrabold disabled:opacity-50">
          🎤 {busy ? "Listening..." : "Talk"}
        </button>
        <p className="text-sm opacity-70">In-app voice only. Max 20 turns. Audio is not stored.</p>
      </motion.div>
    </div>
  );
}
