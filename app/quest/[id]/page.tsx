"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTS } from "@/lib/content";
import { useLexStore } from "@/lib/store";
import { GameLoop } from "@/components/games";
import { GuideCall } from "@/components/GuideCall";
import { Celebration } from "@/components/ui";
import { speak } from "@/lib/speech/tts";

const PHASES = ["Learn it", "Try together", "You try", "Boss + review"];

export default function QuestPage() {
  const params = useParams<{ id: string }>();
  const quest = QUESTS.find((q) => q.id === params.id);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const completeQuest = useLexStore((s) => s.completeQuest);
  const router = useRouter();

  if (!quest) return <p className="p-10 text-2xl">Quest not found. <a href="/map" className="underline">Back to map</a></p>;
  const item = quest.items[idx];
  const phase = PHASES[Math.min(Math.floor((idx / quest.items.length) * 4), 3)];

  const finishQuest = () => {
    completeQuest(quest.id, quest.minutes);
    setDone(true);
    speak(`Quest complete! You earned stars, ${quest.title}.`).catch(() => {});
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center space-y-5">
        <Celebration show />
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl bg-white p-10 shadow-2xl space-y-4">
          <p className="text-7xl" aria-hidden>🏆</p>
          <h1 className="text-4xl font-extrabold">Quest complete!</h1>
          <p className="text-xl">{quest.title} — you listened, blended, and spelled like a hero.</p>
          <p className="font-bold">+60 XP • streak safe • badge earned</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={() => router.push("/map")} className="touch-target rounded-full bg-berry text-white px-8 py-3 font-bold">🗺 Map</button>
            <button onClick={() => { setDone(false); setIdx(0); }} className="touch-target rounded-full bg-gold px-8 py-3 font-bold">↻ Play again</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => router.push("/map")} className="touch-target rounded-full bg-white px-5 py-2 font-bold shadow" aria-label="Back to map">← Map</button>
        <h1 className="text-2xl font-extrabold flex-1">{quest.title}</h1>
        <span className="rounded-full bg-white px-4 py-1 font-bold shadow">{phase} • {idx + 1}/{quest.items.length}</span>
      </div>
      <div className="h-4 rounded-full bg-white/60 overflow-hidden" role="progressbar" aria-valuenow={idx + 1} aria-valuemin={1} aria-valuemax={quest.items.length} aria-label="Quest progress">
        <motion.div className="h-full bg-gradient-to-r from-gold to-moss" animate={{ width: `${((idx + 1) / quest.items.length) * 100}%` }} />
      </div>
      <p className="rounded-2xl bg-white/60 p-4 text-lg italic">📖 {quest.story}</p>
      <AnimatePresence mode="wait">
        <motion.div key={item.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
          <GameLoop item={item} questId={quest.id} onDone={() => { idx + 1 >= quest.items.length ? finishQuest() : setIdx(idx + 1); }} />
        </motion.div>
      </AnimatePresence>
      <GuideCall questId={quest.id} itemPrompt={item.passage ?? item.prompt} />
    </div>
  );
}
