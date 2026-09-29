// Basic adaptive engine: 3 misses -> easier + hint, sustained mastery -> harder.

export interface AdaptiveState { missesStreak: number; hintLevel: number; easyMode: boolean; }

export function nextAdaptive(prev: AdaptiveState, correct: boolean, mastery: number): AdaptiveState {
  if (correct) {
    const missesStreak = 0;
    const easyMode = mastery >= 80 ? false : prev.easyMode;
    return { missesStreak, hintLevel: 0, easyMode };
  }
  const missesStreak = prev.missesStreak + 1;
  if (missesStreak >= 3) return { missesStreak, hintLevel: Math.min(prev.hintLevel + 1, 2), easyMode: true };
  return { ...prev, missesStreak };
}

export function spacedReviewQueue(attempts: { skill: string; correct: boolean; ts: number }[]): string[] {
  // weakest skills first (lowest accuracy over last 10)
  const skills = ["phonemic-awareness", "letter-sound", "blending", "segmenting", "spelling", "fluency"];
  const scored = skills.map((s) => {
    const last = attempts.filter((a) => a.skill === s).slice(-10);
    const acc = last.length ? last.filter((a) => a.correct).length / last.length : 0.5;
    return { s, acc, n: last.length };
  });
  return scored.sort((a, b) => a.acc - b.acc).slice(0, 2).map((x) => x.s);
}
