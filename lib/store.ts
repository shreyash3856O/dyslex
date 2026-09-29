// Central client state (Zustand) with localStorage persistence.
// Works offline with zero backend. Supabase sync can be layered later.

"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RegionId = "woods" | "bridge" | "caves";
export type GameKind = "sound-match" | "tile-blend" | "segment-tap" | "spell-cast" | "boss-battle";

export interface QuestItem {
  id: string;
  kind: GameKind;
  skill: string;
  instruction: string;
  prompt: string;
  target: string;
  choices?: string[];
  tiles?: string[];
  phonemes?: string[];
  nonsense?: boolean;
  hint: string;
  passage?: string;
}

export interface Quest {
  id: string;
  region: RegionId;
  title: string;
  story: string;
  skill: string;
  minutes: number;
  items: QuestItem[];
}

export interface Attempt {
  questId: string;
  itemId: string;
  skill: string;
  correct: boolean;
  latencyMs: number;
  hintsUsed: number;
  ts: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  pin: string;
  xp: number;
  level: number;
  streak: number;
  lastPlayedDay: string | null;
  freezes: number;
  badges: string[];
  pet: string;
  hair: string;
  outfit: string;
  unlocked: string[];
  minutes: number;
  sessions: number;
}

interface Settings {
  font: "lexend" | "opendyslexic" | "atkinson";
  letterSpacing: number;
  lineSpacing: number;
  theme: "cream" | "pastel" | "dark";
  highContrast: boolean;
  reducedMotion: boolean;
  listenFirst: boolean;
  narrator: "wizard" | "dragon" | "robot" | "calm";
  slowMo: boolean;
  voiceOn: boolean;
  dailyLimitMin: number;
  consentVoice: boolean;
  consentTranscript: boolean;
}

interface LexState {
  parentEmail: string | null;
  students: StudentProfile[];
  activeStudentId: string | null;
  attempts: Attempt[];
  settings: Settings;
  guideTurnsToday: number;
  addStudent: (s: Pick<StudentProfile, "name" | "avatar" | "pin">) => void;
  setActive: (id: string | null) => void;
  logAttempt: (a: Omit<Attempt, "ts">) => void;
  addXP: (xp: number, questId?: string) => void;
  completeQuest: (questId: string, minutes: number) => void;
  updateSettings: (p: Partial<Settings>) => void;
  customize: (p: Partial<Pick<StudentProfile, "hair" | "outfit" | "pet" | "avatar">>) => void;
  resetAll: () => void;
}

const dayKey = () => new Date().toISOString().slice(0, 10);

export const SKILL_LABELS: Record<string, string> = {
  "phonemic-awareness": "Hearing sounds",
  "letter-sound": "Letter sounds",
  blending: "Blending sounds",
  segmenting: "Breaking words apart",
  spelling: "Spelling",
  fluency: "Smooth reading"
};

export function masteryFor(attempts: Attempt[], skill: string): number {
  const last = attempts.filter((a) => a.skill === skill).slice(-10);
  if (last.length === 0) return 0;
  return Math.round((last.filter((a) => a.correct).length / last.length) * 100);
}

export const useLexStore = create<LexState>()(
  persist(
    (set, get) => ({
      parentEmail: null,
      students: [],
      activeStudentId: null,
      attempts: [],
      settings: {
        font: "lexend",
        letterSpacing: 0.06,
        lineSpacing: 1.7,
        theme: "cream",
        highContrast: false,
        reducedMotion: false,
        listenFirst: true,
        narrator: "wizard",
        slowMo: false,
        voiceOn: true,
        dailyLimitMin: 20,
        consentVoice: false,
        consentTranscript: false
      },
      guideTurnsToday: 0,
      addStudent: (s) =>
        set((st) => {
          const id = `stu_${Math.random().toString(36).slice(2, 8)}`;
          const profile: StudentProfile = {
            id, name: s.name, avatar: s.avatar, pin: s.pin,
            xp: 0, level: 1, streak: 1, lastPlayedDay: dayKey(),
            freezes: 1, badges: ["first-steps"], pet: "fox", hair: "curls", outfit: "cloak",
            unlocked: ["woods-1"], minutes: 0, sessions: 0
          };
          return { students: [...st.students, profile], activeStudentId: id };
        }),
      setActive: (id) => set({ activeStudentId: id }),
      logAttempt: (a) => set((st) => ({ attempts: [...st.attempts.slice(-500), { ...a, ts: Date.now() }] })),
      addXP: (xp, questId) =>
        set((st) => {
          const id = st.activeStudentId;
          if (!id) return st;
          return {
            students: st.students.map((s) => {
              if (s.id !== id) return s;
              const total = s.xp + xp;
              const level = 1 + Math.floor(total / 100);
              const leveled = level > s.level;
              const badges = [...s.badges];
              if (leveled && !badges.includes(`level-${level}`)) badges.push(`level-${level}`);
              if (questId && !s.unlocked.includes(questId)) void 0;
              return { ...s, xp: total, level, badges };
            })
          };
        }),
      completeQuest: (questId, minutes) =>
        set((st) => {
          const id = st.activeStudentId;
          if (!id) return st;
          return {
            students: st.students.map((s) => {
              if (s.id !== id) return s;
              const today = dayKey();
              const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
              let { streak, freezes } = s;
              if (s.lastPlayedDay !== today) {
                if (s.lastPlayedDay === yesterday) streak += 1;
                else if (freezes > 0) { freezes -= 1; } // forgiving freeze
                else streak = 1;
              }
              const badges = [...s.badges];
              if (!badges.includes(`quest-${questId}`)) badges.push(`quest-${questId}`);
              if (streak >= 3 && !badges.includes("streak-3")) badges.push("streak-3");
              if (streak >= 7 && !badges.includes("streak-7")) badges.push("streak-7");
              // unlock next quest in sequence is handled by map logic using mastery; also auto-unlock next id
              const num = parseInt(questId.split("-")[1] ?? "1", 10);
              const region = questId.split("-")[0];
              const next = `${region}-${num + 1}`;
              const unlocked = s.unlocked.includes(next) ? s.unlocked : [...s.unlocked, next];
              return { ...s, streak, freezes, badges, unlocked, minutes: s.minutes + minutes, sessions: s.sessions + 1, lastPlayedDay: today };
            })
          };
        }),
      updateSettings: (p) => set((st) => ({ settings: { ...st.settings, ...p } })),
      customize: (p) =>
        set((st) => ({
          students: st.students.map((s) => (s.id === st.activeStudentId ? { ...s, ...p } : s))
        })),
      resetAll: () => set({ students: [], activeStudentId: null, attempts: [] })
    }),
    { name: "lexquest-v1" }
  )
);
