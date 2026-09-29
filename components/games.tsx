"use client";
import { useEffect, useRef, useState } from "react";
import type { QuestItem } from "@/lib/store";
import { speak } from "@/lib/speech/tts";
import { useLexStore } from "@/lib/store";
import { Instruction, SpeakButton } from "./ui";
import { nextAdaptive, type AdaptiveState } from "@/lib/adaptive";

export function GameLoop({ item, questId, onDone }: { item: QuestItem; questId: string; onDone: (correct: boolean) => void }) {
  const narrator = useLexStore((s) => s.settings.narrator);
  const listenFirst = useLexStore((s) => s.settings.listenFirst);
  const voiceOn = useLexStore((s) => s.settings.voiceOn);
  const logAttempt = useLexStore((s) => s.logAttempt);
  const addXP = useLexStore((s) => s.addXP);
  const [ad, setAd] = useState<AdaptiveState>({ missesStreak: 0, hintLevel: 0, easyMode: false });
  const [msg, setMsg] = useState("");
  const [hints, setHints] = useState(0);
  const t0 = useRef(Date.now());

  useEffect(() => {
    t0.current = Date.now();
    setMsg(""); setHints(0);
    if (listenFirst && voiceOn) speak(item.instruction + ". " + item.prompt, { narrator }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const finish = (correct: boolean) => {
    const latencyMs = Date.now() - t0.current;
    logAttempt({ questId, itemId: item.id, skill: item.skill, correct, latencyMs, hintsUsed: hints });
    // mastery approx for adaptive
    setAd((p) => nextAdaptive(p, correct, correct ? 85 : 40));
    if (correct) {
      addXP(10);
      setMsg("Lovely trying! You did it! ✨");
      speak("Lovely trying! You did it!", { narrator }).catch(() => {});
      setTimeout(() => onDone(true), 1100);
    } else {
      setMsg("Almost, try again! You are safe here. 💛");
    }
  };

  const hint = () => {
    setHints((h) => h + 1);
    speak(item.hint, { narrator }).catch(() => {});
    setMsg(item.hint + (ad.hintLevel > 0 ? " Take your time." : ""));
  };

  return (
    <div className="space-y-4">
      <Instruction text={item.instruction} />
      <div className="rounded-3xl bg-white/80 p-6 shadow text-center">
        <p className="text-sm font-bold uppercase tracking-wide opacity-70">{item.skill} {item.nonsense ? "• silly word" : ""}</p>
        <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-4xl font-extrabold">{item.kind === "boss-battle" ? item.passage : item.prompt}</span>
          <SpeakButton text={item.kind === "boss-battle" ? item.passage ?? item.prompt : item.prompt} />
          <SpeakButton text={item.prompt} label="Slow-mo" slow />
        </div>
        {item.kind === "sound-match" && <SoundMatch item={item} easy={ad.easyMode} onPick={(c) => finish(c === item.target)} />}
        {item.kind === "tile-blend" && <TileBlend item={item} onDone={finish} />}
        {item.kind === "segment-tap" && <SegmentTap item={item} onDone={finish} />}
        {item.kind === "spell-cast" && <TileBlend item={item} spell onDone={finish} />}
        {item.kind === "boss-battle" && <BossBattle item={item} onDone={finish} />}
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={hint} className="touch-target rounded-full bg-gold px-5 py-2 font-bold shadow" aria-label="Get a hint">💡 Hint</button>
        <button onClick={() => finish(true)} className="touch-target rounded-full bg-white px-5 py-2 font-bold shadow" aria-label="Skip for now">Skip →</button>
      </div>
      {msg && <p role="status" className="rounded-2xl bg-blush/60 p-4 text-xl font-semibold">{msg}</p>}
      {ad.easyMode && <p className="text-lg">🌱 Easy mode is on. Smaller steps, more help.</p>}
    </div>
  );
}

function SoundMatch({ item, easy, onPick }: { item: QuestItem; easy: boolean; onPick: (c: string) => void }) {
  const choices = easy && item.choices ? item.choices.slice(0, 2) : item.choices ?? [];
  return (
    <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Choose the matching letter">
      {choices.map((c) => (
        <button key={c} role="radio" aria-checked={false} onClick={() => { speak(c).catch(() => {}); onPick(c); }}
          className="touch-target rounded-2xl bg-cream p-6 text-4xl font-extrabold shadow hover:scale-105 border-4 border-transparent focus:border-berry">
          {c}
        </button>
      ))}
    </div>
  );
}

function TileBlend({ item, spell, onDone }: { item: QuestItem; spell?: boolean; onDone: (ok: boolean) => void }) {
  const tiles = item.tiles ?? [];
  const [slots, setSlots] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>(tiles);
  useEffect(() => { setSlots([]); setPool(item.tiles ?? []); }, [item.id]);
  const place = (t: string, i: number) => {
    speak(t).catch(() => {});
    setSlots((s) => [...s, t]);
    setPool((p) => p.filter((_, j) => j !== i));
  };
  const clear = () => { setSlots([]); setPool(tiles); };
  const check = () => {
    const built = slots.join(spell ? "" : "");
    // tile-blend with digraph tiles like ["sh","o","p"] joins to "shop" correctly
    const target = item.target;
    const norm = (s: string) => s.replace(/\|/g, "");
    if (norm(built) === norm(target)) {
      speak(`You built ${target}. ${target.split("").join("... ")}. ${target}!`).catch(() => {});
      onDone(true);
    } else onDone(false);
  };
  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2 justify-center min-h-[72px]" aria-label="Word slots">
        {(item.target.match(/sh|ch|th|wh|ck|ng|ee/g) ? item.phonemes ?? [] : item.target.split("")).map((_, i) => (
          <div key={i} className="w-14 h-14 rounded-xl border-4 border-dashed border-berry/50 bg-white flex items-center justify-center text-2xl font-extrabold" aria-label={`slot ${i + 1}`}>
            {slots[i] ?? ""}
          </div>
        ))}
        {slots.length === 0 && <span className="opacity-60 self-center">Tap tiles below 👇</span>}
      </div>
      <div className="flex gap-2 justify-center flex-wrap" aria-label="Letter tiles">
        {pool.map((t, i) => (
          <button key={`${t}-${i}`} onClick={() => place(t, i)} className="touch-target rounded-2xl bg-berry text-white px-5 py-3 text-2xl font-extrabold shadow hover:scale-105">{t}</button>
        ))}
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={check} disabled={!slots.length} className="touch-target rounded-full bg-moss text-white px-6 py-2 font-bold disabled:opacity-40">✨ {spell ? "Cast spell" : "Blend it"}</button>
        <button onClick={clear} className="touch-target rounded-full bg-white px-6 py-2 font-bold shadow">Clear</button>
      </div>
    </div>
  );
}

function SegmentTap({ item, onDone }: { item: QuestItem; onDone: (ok: boolean) => void }) {
  const [taps, setTaps] = useState(0);
  const need = parseInt(item.target, 10);
  useEffect(() => setTaps(0), [item.id]);
  const tap = () => {
    const n = taps + 1;
    setTaps(n);
    speak(String(n)).catch(() => {});
    if (n === need) { speak(item.phonemes?.join("... ") ?? item.prompt).catch(() => {}); onDone(true); }
    else if (n > need) { setTaps(0); onDone(false); }
  };
  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2 justify-center" aria-label="Elkonin boxes">
        {Array.from({ length: need }).map((_, i) => (
          <div key={i} className={`w-16 h-16 rounded-xl border-4 ${i < taps ? "bg-gold border-gold" : "bg-white border-berry/40"}`} />
        ))}
      </div>
      <button onClick={tap} className="touch-target rounded-full bg-gold px-8 py-3 text-2xl font-extrabold shadow" aria-label={`Tap sound ${taps + 1}`}>
        👆 Tap {taps + 1}
      </button>
      <div className="flex gap-2 justify-center">
        {(item.choices ?? ["2", "3", "4"]).map((c) => (
          <button key={c} onClick={() => onDone(c === item.target)} className="touch-target rounded-xl bg-white px-5 py-2 font-bold shadow">{c} sounds</button>
        ))}
      </div>
    </div>
  );
}

function BossBattle({ item, onDone }: { item: QuestItem; onDone: (ok: boolean) => void }) {
  const words = (item.passage ?? item.target).split(/[ |]+/).filter(Boolean);
  const [read, setRead] = useState<boolean[]>(words.map(() => false));
  const all = read.every(Boolean);
  return (
    <div className="mt-4 space-y-3">
      <p className="text-xl">🐲 Moss the friendly boss is listening. No timer. No fail.</p>
      <div className="flex gap-2 justify-center flex-wrap">
        {words.map((w, i) => (
          <button key={i} onClick={() => { speak(w).catch(() => {}); setRead((r) => r.map((x, j) => (j === i ? true : x))); }}
            aria-pressed={read[i]} aria-label={`Read word ${w}`}
            className={`touch-target rounded-2xl px-6 py-3 text-2xl font-extrabold shadow ${read[i] ? "bg-moss text-white" : "bg-white"}`}>
            {read[i] ? `✅ ${w}` : w}
          </button>
        ))}
      </div>
      <button onClick={() => { if (all) onDone(true); else { speak("The boss retreats. Try again for more XP.").catch(() => {}); onDone(true); } }}
        className="touch-target rounded-full bg-berry text-white px-8 py-3 font-bold">
        {all ? "🎉 Finish battle" : "💛 Gentle finish"}
      </button>
    </div>
  );
}
