// TTS abstraction: Web Speech API now, Azure/Google/ElevenLabs later.
// All game code must call speak() / speakSlow() — never window.speechSynthesis directly.

export type Narrator = "wizard" | "dragon" | "robot" | "calm";

const PRESETS: Record<Narrator, { rate: number; pitch: number }> = {
  wizard: { rate: 0.95, pitch: 0.7 },
  dragon: { rate: 0.85, pitch: 0.4 },
  robot: { rate: 1.0, pitch: 1.1 },
  calm: { rate: 0.9, pitch: 1.0 }
};

let activeUtter: SpeechSynthesisUtterance | null = null;
let wordCallback: ((idx: number) => void) | null = null;

export function setKaraokeCallback(cb: ((idx: number) => void) | null) {
  wordCallback = cb;
}

function pickVoice(narrator: Narrator): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const en = voices.filter((v) => v.lang.startsWith("en"));
    const pool = en.length ? en : voices;
    if (narrator === "robot") return pool.find((v) => /google uk english male|daniel|david/i.test(v.name)) ?? pool[0];
    if (narrator === "dragon") return pool.find((v) => /google uk english male|fred/i.test(v.name)) ?? pool[0];
    if (narrator === "calm") return pool.find((v) => /samantha|zira|female/i.test(v.name)) ?? pool[0];
    return pool.find((v) => /wizard|daniel|google us english/i.test(v.name)) ?? pool[0];
  } catch { return null; }
}

export function speak(text: string, opts?: { narrator?: Narrator; slowMo?: boolean; onWord?: (i: number) => void }): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (!("speechSynthesis" in window)) return resolve();
      window.speechSynthesis.cancel();
      const narrator = opts?.narrator ?? (localStorage.getItem("lx-narrator") as Narrator) ?? "wizard";
      const preset = PRESETS[narrator];
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(narrator);
      if (v) u.voice = v;
      u.rate = opts?.slowMo ? 0.45 : preset.rate;
      u.pitch = preset.pitch;
      const words = text.split(/\s+/);
      let idx = 0;
      u.onboundary = (e: any) => {
        if (e.name === "word" || e.charIndex !== undefined) {
          opts?.onWord?.(idx);
          wordCallback?.(idx);
          idx = Math.min(idx + 1, words.length - 1);
        }
      };
      u.onend = () => { activeUtter = null; resolve(); };
      u.onerror = () => resolve();
      activeUtter = u;
      window.speechSynthesis.speak(u);
      // Fallback karaoke timer (some browsers lack boundary events)
      const timer = setInterval(() => {
        if (!activeUtter) { clearInterval(timer); return; }
        opts?.onWord?.(idx); wordCallback?.(idx);
        idx = Math.min(idx + 1, words.length - 1);
      }, Math.max(320, 420 * (opts?.slowMo ? 2 : 1)));
      const stop = () => clearInterval(timer);
      u.onend = (() => { stop(); resolve(); }) as any;
    } catch { resolve(); }
  });
}

export const speakSlow = (text: string, narrator?: Narrator) => speak(text, { narrator, slowMo: true });

export function stopSpeak() {
  try { window.speechSynthesis?.cancel(); } catch {}
  activeUtter = null;
}

// Future swap point: export async function speakViaCloud(text, voiceId) { ... }
