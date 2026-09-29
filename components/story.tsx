"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { speak } from "@/lib/speech/tts";

/* ---------- small SVG art (no emojis, no icon font) ---------- */

function Fox({ x = 0 }: { x?: number }) {
  return (
    <motion.svg width="96" height="84" viewBox="0 0 96 84" animate={{ x }} aria-hidden
      transition={{ type: "spring", stiffness: 60, damping: 14 }}>
      <ellipse cx="48" cy="74" rx="30" ry="7" fill="#2B2118" opacity="0.12" />
      <path d="M18 22 L28 4 L40 20 Z" fill="#C65A21" />
      <path d="M78 22 L68 4 L56 20 Z" fill="#C65A21" />
      <path d="M22 18 L29 8 L36 18 Z" fill="#F6C79C" />
      <path d="M74 18 L67 8 L60 18 Z" fill="#F6C79C" />
      <ellipse cx="48" cy="46" rx="30" ry="26" fill="#E07B39" />
      <ellipse cx="48" cy="58" rx="16" ry="12" fill="#FFF3E2" />
      <circle cx="38" cy="42" r="3.4" fill="#2B2118" />
      <circle cx="58" cy="42" r="3.4" fill="#2B2118" />
      <circle cx="39" cy="41" r="1.1" fill="#fff" />
      <circle cx="59" cy="41" r="1.1" fill="#fff" />
      <ellipse cx="48" cy="52" rx="4.4" ry="3.2" fill="#2B2118" />
      <path d="M44 56 Q48 60 52 56" stroke="#2B2118" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M72 60 Q88 62 84 76 Q70 78 66 66 Z" fill="#C65A21" />
      <path d="M76 64 Q84 66 82 74 Q74 74 72 68 Z" fill="#FFF3E2" />
    </motion.svg>
  );
}

function NightSky({ lit }: { lit: boolean[] }) {
  return (
    <svg viewBox="0 0 320 150" className="w-full" aria-hidden>
      <rect width="320" height="150" rx="14" fill="#22304A" />
      <circle cx="262" cy="34" r="18" fill="#F4E9C8" />
      <circle cx="256" cy="30" r="16" fill="#22304A" opacity="0.85" />
      {[
        { x: 40, y: 40 }, { x: 110, y: 26 }, { x: 180, y: 52 }, { x: 70, y: 96 }, { x: 240, y: 100 }
      ].map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={lit[i % 3] ? 7 : 3.5} fill={lit[i % 3] ? "#F5B301" : "#8FA3C7"} />
          {lit[i % 3] && <circle cx={s.x} cy={s.y} r="11" fill="#F5B301" opacity="0.25" />}
        </g>
      ))}
      <path d="M0 128 Q80 112 160 126 T320 122 L320 150 L0 150 Z" fill="#2E7D5B" />
      <path d="M0 138 Q100 128 200 138 T320 136 L320 150 L0 150 Z" fill="#256B4E" />
    </svg>
  );
}

function BridgeArt({ planks }: { planks: number }) {
  return (
    <svg viewBox="0 0 320 150" className="w-full" aria-hidden>
      <rect width="320" height="150" rx="14" fill="#DCEBF5" />
      <rect y="96" width="320" height="54" fill="#7CC6E6" />
      <path d="M0 104 Q40 100 80 104 T160 104 T240 104 T320 104" stroke="#5AA9CE" strokeWidth="3" fill="none" />
      <line x1="40" y1="30" x2="40" y2="110" stroke="#8A5A33" strokeWidth="5" />
      <line x1="280" y1="30" x2="280" y2="110" stroke="#8A5A33" strokeWidth="5" />
      <path d="M40 30 Q160 52 280 30" stroke="#8A5A33" strokeWidth="4" fill="none" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={58 + i * 42} y="78" width="36" height="14" rx="4"
          fill={i < planks ? "#A9743F" : "#A9743F"} opacity={i < planks ? 1 : 0.25} stroke="#2B2118" strokeWidth="2" />
      ))}
    </svg>
  );
}

function CaveArt({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 320 150" className="w-full" aria-hidden>
      <rect width="320" height="150" rx="14" fill="#2A2438" />
      <path d="M20 150 L20 70 Q160 10 300 70 L300 150 Z" fill="#38304F" />
      {[
        { x: 90, y: 60 }, { x: 160, y: 44 }, { x: 230, y: 60 }
      ].map((c, i) => (
        <g key={i}>
          <polygon points={`${c.x},${c.y - 26} ${c.x - 14},${c.y + 14} ${c.x + 14},${c.y + 14}`}
            fill={lit && i === 1 ? "#7CF2D8" : "#5A5175"} stroke="#17131F" strokeWidth="2" />
          {lit && i === 1 && <polygon points={`${c.x},${c.y - 26} ${c.x - 7},${c.y + 6} ${c.x + 7},${c.y + 6}`} fill="#E8FFF9" />}
        </g>
      ))}
      <ellipse cx="160" cy="140" rx="120" ry="10" fill="#17131F" opacity="0.5" />
    </svg>
  );
}

function Moss() {
  return (
    <svg width="110" height="96" viewBox="0 0 110 96" aria-hidden>
      <ellipse cx="55" cy="86" rx="34" ry="7" fill="#2B2118" opacity="0.12" />
      <path d="M30 50 Q10 40 16 20 Q34 26 36 44 Z" fill="#2E7D5B" />
      <path d="M80 50 Q100 40 94 20 Q76 26 74 44 Z" fill="#2E7D5B" />
      <ellipse cx="55" cy="56" rx="32" ry="28" fill="#3E9B6E" />
      <ellipse cx="55" cy="64" rx="18" ry="13" fill="#D9F2E4" />
      <circle cx="46" cy="50" r="4" fill="#22304A" />
      <circle cx="64" cy="50" r="4" fill="#22304A" />
      <circle cx="47.5" cy="48.5" r="1.3" fill="#fff" />
      <circle cx="65.5" cy="48.5" r="1.3" fill="#fff" />
      <path d="M47 62 Q55 68 63 62" stroke="#22304A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="58" r="3.4" fill="#E9A100" opacity="0.8" />
      <circle cx="72" cy="58" r="3.4" fill="#E9A100" opacity="0.8" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Hear({ text }: { text: string }) {
  return (
    <button
      onClick={() => speak(text).catch(() => {})}
      className="touch-target inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-4 py-2 font-bold shadow-[3px_3px_0_#2B2118] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      aria-label={`Hear narration: ${text.slice(0, 60)}`}>
      <SpeakerIcon /> Hear
    </button>
  );
}

/* ---------- playable story ---------- */

const PHONEMES = ["/m/", "/s/", "/a/"];

export function StoryPlayer({ onDone }: { onDone?: () => void }) {
  const [scene, setScene] = useState(0);
  const [lights, setLights] = useState<boolean[]>([false, false, false]);
  const [pipCalled, setPipCalled] = useState(false);
  const [pipTapped, setPipTapped] = useState(false);
  const [built, setBuilt] = useState<string[]>([]);
  const [team, setTeam] = useState<string | null>(null);
  const [words, setWords] = useState<boolean[]>([false, false, false]);
  const [finished, setFinished] = useState(false);

  const sceneDone = [
    lights.every(Boolean),
    pipCalled && pipTapped,
    built.join("") === "CAT",
    team === "sh",
    words.every(Boolean)
  ][scene];

  const tapLight = (i: number) => {
    if (lights[i]) return;
    speak(`${PHONEMES[i]}. You woke a sound.`).catch(() => {});
    setLights((l) => l.map((x, j) => (j === i ? true : x)));
  };

  const tapLetter = (l: string) => {
    const next = [...built, l];
    const target = "CAT".slice(0, next.length);
    speak(l.toLowerCase()).catch(() => {});
    if (next.join("") === target) setBuilt(next);
    else {
      speak("Almost. Start with C.").catch(() => {});
      setBuilt([]);
    }
  };

  const tapWord = (i: number, w: string) => {
    speak(w).catch(() => {});
    setWords((arr) => arr.map((x, j) => (j === i ? true : x)));
  };

  const next = () => {
    if (scene < 4) setScene(scene + 1);
    else { setFinished(true); onDone?.(); }
  };
  const back = () => scene > 0 && setScene(scene - 1);

  const titles = [
    "Night one. The quiet.",
    "Pip the finder.",
    "The bridge is out.",
    "The cave teams.",
    "Moss the nervous boss."
  ];
  const texts = [
    "The Realm woke up silent. Three sounds still glow in the grass. Tap each light to wake it.",
    "Pip finds lost sounds, but Pip needs a listener. Call Pip over, then tap Pip to say hello.",
    "Planks return when you blend. Tap C, then A, then T to build cat and walk across.",
    "Two letters can make one sound. Which team says shhh? Pick it to light the crystal.",
    "Moss guards the last words and feels shy. Tap each word to read it and calm Moss down."
  ];

  return (
    <div className="rounded-2xl border-2 border-ink bg-white shadow-[6px_6px_0_#2B2118]">
      <div className="flex items-center gap-3 border-b-2 border-ink px-5 py-3">
        <span className="inline-block h-3 w-3 rounded-full bg-[#C0392B]" aria-hidden />
        <span className="inline-block h-3 w-3 rounded-full bg-[#E9A100]" aria-hidden />
        <span className="inline-block h-3 w-3 rounded-full bg-[#2E7D5B]" aria-hidden />
        <p className="ml-2 font-bold">The opening. Play it now.</p>
        <p className="ml-auto text-sm font-bold opacity-70" aria-live="polite">Scene {scene + 1} of 5</p>
      </div>

      <div className="h-2 bg-[#EFE6D2]">
        <motion.div className="h-full bg-[#2E7D5B]" animate={{ width: `${((scene + 1) / 5) * 100}%` }} />
      </div>

      <div className="space-y-4 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-extrabold">{titles[scene]}</h3>
          <Hear text={`${titles[scene]} ${texts[scene]}`} />
        </div>
        <p className="max-w-[58ch] text-lg">{texts[scene]}</p>

        <AnimatePresence mode="wait">
          <motion.div key={scene} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {scene === 0 && (
              <div className="space-y-3">
                <NightSky lit={lights} />
                <div className="flex gap-2" role="group" aria-label="Wake the three sounds">
                  {PHONEMES.map((p, i) => (
                    <button key={p} onClick={() => tapLight(i)} aria-pressed={lights[i]}
                      className={`touch-target flex-1 rounded-xl border-2 border-ink px-4 py-3 text-xl font-extrabold ${lights[i] ? "bg-[#F5B301]" : "bg-[#FFF8E8]"}`}>
                      {lights[i] ? p : "Tap"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {scene === 1 && (
              <div className="flex items-center gap-5 rounded-2xl border-2 border-dashed border-[#2E7D5B] bg-[#EFF7F1] p-5">
                <Fox x={pipCalled ? 0 : -140} />
                <div className="space-y-2">
                  {!pipCalled ? (
                    <button onClick={() => { setPipCalled(true); speak("Pip is coming. Pip trusts listeners.").catch(() => {}); }}
                      className="touch-target rounded-xl bg-[#2E7D5B] px-6 py-3 font-extrabold text-white">Call Pip</button>
                  ) : (
                    <button onClick={() => { setPipTapped(true); speak("Hello, listener. I am Pip. We find sounds together.").catch(() => {}); }}
                      className="touch-target rounded-xl border-2 border-ink bg-white px-6 py-3 font-extrabold shadow-[3px_3px_0_#2B2118]">
                      {pipTapped ? "Pip says hello." : "Tap Pip to say hello"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {scene === 2 && (
              <div className="space-y-3">
                <BridgeArt planks={built.length} />
                <div className="flex items-center gap-2" aria-label="Build the word cat">
                  {(["C", "A", "T"] as const).map((l, i) => (
                    <div key={l} className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 border-ink text-2xl font-extrabold ${built[i] ? "bg-[#2E7D5B] text-white" : "bg-white"}`}>
                      {built[i] ?? ""}
                    </div>
                  ))}
                  <div className="ml-2 flex gap-2">
                    {(["C", "A", "T"] as const).map((l) => (
                      <button key={l} onClick={() => tapLetter(l)}
                        className="touch-target h-14 w-14 rounded-xl border-2 border-ink bg-[#FFF8E8] text-2xl font-extrabold shadow-[3px_3px_0_#2B2118] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                {built.join("") === "CAT" && <p className="font-bold text-[#2E7D5B]">Cat. You blended it. Pip crosses.</p>}
              </div>
            )}

            {scene === 3 && (
              <div className="space-y-3">
                <CaveArt lit={team === "sh"} />
                <div className="flex gap-2" role="radiogroup" aria-label="Which team says shhh">
                  {["sh", "s", "t"].map((t) => (
                    <button key={t} role="radio" aria-checked={team === t}
                      onClick={() => { setTeam(t); speak(t === "sh" ? "Shhh. The crystal glows." : `${t}. Almost. Try the team.`).catch(() => {}); }}
                      className={`touch-target flex-1 rounded-xl border-2 border-ink px-4 py-3 text-2xl font-extrabold ${team === t ? (t === "sh" ? "bg-[#2E7D5B] text-white" : "bg-white") : "bg-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {scene === 4 && (
              <div className="flex items-center gap-5 rounded-2xl bg-[#EFF7F1] p-5">
                <Moss />
                <div className="flex flex-wrap gap-2" aria-label="Read the three words">
                  {["the", "ship", "sails"].map((w, i) => (
                    <button key={w} onClick={() => tapWord(i, w)} aria-pressed={words[i]}
                      className={`touch-target rounded-xl border-2 border-ink px-5 py-3 text-xl font-extrabold ${words[i] ? "bg-[#2E7D5B] text-white" : "bg-white"}`}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 pt-1">
          <button onClick={back} disabled={scene === 0}
            className="touch-target rounded-xl border-2 border-ink bg-white px-5 py-2 font-bold disabled:opacity-40">Back</button>
          <div className="flex gap-1.5" aria-label="Story progress">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-2.5 w-8 rounded-full ${i <= scene ? "bg-[#2E7D5B]" : "bg-[#E4D9C2]"}`} />
            ))}
          </div>
          <button onClick={next} disabled={!sceneDone}
            className="touch-target ml-auto rounded-xl bg-[#2B2118] px-6 py-3 font-extrabold text-white disabled:opacity-40">
            {scene === 4 ? "Finish opening" : sceneDone ? "Continue" : "Play to continue"}
          </button>
        </div>

        {finished && (
          <p role="status" className="rounded-xl bg-[#EFF7F1] p-4 font-bold text-[#2E7D5B]">
            Opening complete. The Realm remembers a listener. Your quest map is ready.
          </p>
        )}
      </div>
    </div>
  );
}
