"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { speak, stopSpeak } from "@/lib/speech/tts";

/* ---------- tiny pixel renderer ---------- */

function Pixels({ map, palette, px = 10 }: { map: string[]; palette: Record<string, string>; px?: number }) {
  const cols = map[0].length;
  const rows = map.length;
  return (
    <svg width={cols * px} height={rows * px} viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges" style={{ imageRendering: "pixelated" }} aria-hidden>
      {map.flatMap((row, y) =>
        row.split("").map((ch, x) =>
          ch === "." || ch === " " ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={palette[ch] ?? "#fff"} />
          )
        )
      )}
    </svg>
  );
}

const FOX = [
  "............",
  ".DD......DD.",
  ".DWD....DWD.",
  ".DOOOOOOOOD.",
  "..OOOOOOOO..",
  "..OBBOOBBO..",
  "..OOWWWWO O..".replace(" ", ""),
  "...OWWWWO...",
  "...OBBBO....",
  "....O..O...."
];

const KID = [
  "....BBBB....",
  "...BHHHBB...",
  "...BHFFHB...",
  "...BFFFFB...",
  "....FFFF....",
  "..RRRRRRR...",
  "..RFRFRFR...",
  "..RFFFFFR...",
  "...FFFFF....",
  "...L...L....",
  "..LL...LL..."
];

const MOSS = [
  "............",
  ".GG......GG.",
  "..GG....GG..",
  "..GGGGGGGG..",
  ".GGGGGGGGGG.",
  ".GBBGGBBG G.".replace(" ", ""),
  ".GGGGGGGGGG.",
  "..GWWWWWWG..",
  "..GWGWWGWG..",
  "...GGGGGG..."
];

const TREE = [
  ".....G......",
  "....GGG.....",
  "...GGGGG....",
  "..GGGGGGG...",
  ".GGGGGGGGG..",
  ".....T......",
  ".....T......"
];

const PAL = {
  D: "#8A4A1D", O: "#E07B39", W: "#FFF3E2", B: "#14100B",
  H: "#3A2A1A", F: "#F2C69B", R: "#C0392B", L: "#2B2118",
  G: "#2E7D5B", T: "#6B4423"
};

/* ---------- film script ---------- */

interface Scene { caption: string; }

const SCENES: Scene[] = [
  { caption: "The Realm was loud and bright. Every letter sang its sound." },
  { caption: "Children blended and spelled. Cat. Ship. Even zib." },
  { caption: "Then one quiet night, three sounds went missing." },
  { caption: "This is where you come into play. Yes, you!" },
  { caption: "LexQuest. Find the sounds. Become a Sound Keeper." }
];

function SceneArt({ scene }: { scene: number }) {
  if (scene === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <div className="flex items-end gap-10">
          <Pixels map={TREE} palette={PAL} px={9} />
          <Pixels map={FOX} palette={PAL} px={14} />
          <Pixels map={TREE} palette={PAL} px={9} />
        </div>
        <div className="flex gap-4">
          {["m", "s", "a"].map((l) => (
            <span key={l} className="border-4 border-[#F5B301] bg-[#14100B] px-6 py-2 text-4xl font-bold text-[#F5B301]">
              {l}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (scene === 1) {
    const cards = ["m says mmm", "s says sss", "c a t", "sh team", "tap tap tap", "z i b", "read it", "spell it"];
    return (
      <div className="grid h-full grid-cols-4 content-center gap-5 px-10 sm:px-24">
        {cards.map((c) => (
          <div key={c} className="border-4 border-[#3A3A52] bg-[#1B1B2A] px-2 py-5 text-center text-lg font-bold text-[#FFF8E8] sm:text-xl">
            {c}
          </div>
        ))}
      </div>
    );
  }
  if (scene === 2) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex gap-8">
          {["m", "s", "a"].map((l) => (
            <span key={l} className="border-4 border-dashed border-[#4A4A63] px-6 py-2 text-4xl font-bold text-[#4A4A63]">
              {l}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (scene === 3) {
    return (
      <div className="relative flex h-full flex-col justify-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-x-0 top-0 h-[45%] bg-[#2E86C1]" />
          <div className="absolute inset-x-0 top-[30%] h-[25%] bg-[#3E9B6E]" />
          <div className="absolute inset-x-0 top-[52%] bottom-0 bg-[#256B4E]" />
          <div className="absolute left-[8%] top-[38%]"><Pixels map={TREE} palette={PAL} px={12} /></div>
          <div className="absolute right-[8%] top-[30%]"><Pixels map={TREE} palette={PAL} px={14} /></div>
        </div>
        <div className="relative flex items-end justify-center gap-6 pb-28">
          <Pixels map={FOX} palette={PAL} px={11} />
          <Pixels map={KID} palette={PAL} px={11} />
          <Pixels map={MOSS} palette={PAL} px={11} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p className="text-5xl font-bold tracking-widest text-[#F5B301] sm:text-7xl" style={{ fontFamily: "monospace" }}>
        LEXQUEST
      </p>
      <p className="text-xl text-[#FFF8E8]" style={{ fontFamily: "monospace" }}>Find the sounds.</p>
    </div>
  );
}

/* ---------- fullscreen film ---------- */

export function FilmOverlay({ onClose }: { onClose: () => void }) {
  const [scene, setScene] = useState(0);
  const [chars, setChars] = useState(0);
  const [muted, setMuted] = useState(true);
  const [staticMode, setStaticMode] = useState(false);
  const spoken = useRef(-1);

  const caption = SCENES[scene].caption;
  const lineDone = chars >= caption.length;

  useEffect(() => {
    setStaticMode(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; stopSpeak(); };
  }, []);

  // typewriter
  useEffect(() => {
    setChars(0);
    if (staticMode) { setChars(caption.length); return; }
    const iv = setInterval(() => {
      setChars((c) => {
        if (c >= caption.length) { clearInterval(iv); return c; }
        return c + 1;
      });
    }, 42);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, staticMode]);

  // advance after pause
  useEffect(() => {
    if (staticMode || !lineDone || scene >= SCENES.length - 1) return;
    const to = setTimeout(() => setScene((s) => s + 1), 1700);
    return () => clearTimeout(to);
  }, [lineDone, scene, staticMode]);

  // narration
  useEffect(() => {
    if (muted || spoken.current === scene) return;
    spoken.current = scene;
    speak(caption).catch(() => {});
  }, [scene, muted, caption]);

  const skip = useCallback(() => { stopSpeak(); onClose(); }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S" || e.key === "Escape") skip();
      if (e.key === "m" || e.key === "M") setMuted((m) => !m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  return (
    <div role="dialog" aria-modal="true" aria-label="LexQuest opening film"
      className="fixed inset-0 z-[100] flex flex-col bg-black text-white">
      <div className="flex items-center justify-end px-5 py-3">
        <button onClick={skip} aria-label="Skip film (press S)"
          className="touch-target rounded-lg border-2 border-white/40 px-4 py-2 font-bold"
          style={{ fontFamily: "monospace" }}>
          Press <kbd className="rounded border border-white bg-white px-2 py-0.5 text-black">S</kbd> to skip
        </button>
      </div>

      <div className="relative flex-1">
        <SceneArt scene={scene} />
      </div>

      <div className="px-5 pb-8 sm:px-16">
        <p aria-live="polite" className="min-h-[3.5rem] text-xl sm:text-2xl" style={{ fontFamily: "monospace" }}>
          {caption.slice(0, chars)}
          {!lineDone && <span className="animate-pulse">_</span>}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-2" aria-label="Film chapters">
            {SCENES.map((s, i) => (
              <button key={s.caption} onClick={() => setScene(i)} aria-label={`Go to chapter ${i + 1}`}
                className={`h-2 ${i === scene ? "w-10 bg-white" : "w-5 bg-white/30"}`} />
            ))}
          </div>
          {staticMode && (
            <button onClick={() => setScene((s) => Math.min(s + 1, SCENES.length - 1))}
              className="touch-target ml-4 rounded-lg border-2 border-white px-4 py-2 font-bold">
              Next
            </button>
          )}
          {scene === SCENES.length - 1 && lineDone && (
            <span className="ml-auto flex flex-wrap gap-2">
              <a href="/onboarding"
                className="touch-target rounded-lg bg-[#F5B301] px-6 py-3 font-extrabold text-black">
                Begin your quest
              </a>
              <button onClick={skip}
                className="touch-target rounded-lg border-2 border-white px-6 py-3 font-bold">
                Practice first
              </button>
            </span>
          )}
        </div>
      </div>

      <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute narration (press M)" : "Mute narration (press M)"}
        className="touch-target absolute bottom-5 right-5 rounded-lg border-2 border-white/40 bg-[#1B1B2A] p-3">
        {muted ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="white" />
            <path d="M16 9l6 6M22 9l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="white" />
            <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function useAutoFilm() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem("lx-film-seen")) {
      sessionStorage.setItem("lx-film-seen", "1");
      setOpen(true);
    }
  }, []);
  return { open, setOpen };
}
