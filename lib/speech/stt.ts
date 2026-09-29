// STT abstraction: Web Speech API now, Azure/Google later.

export interface STTResult { transcript: string; confidence: number; }

export function isSTTSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function listenOnce(opts?: { lang?: string; timeoutMs?: number }): Promise<STTResult> {
  return new Promise((resolve, reject) => {
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) return reject(new Error("STT not supported"));
      const rec = new SR();
      rec.lang = opts?.lang ?? "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      const timer = setTimeout(() => { try { rec.stop(); } catch {} }, opts?.timeoutMs ?? 8000);
      rec.onresult = (e: any) => {
        clearTimeout(timer);
        const alt = e.results[0][0];
        resolve({ transcript: alt.transcript ?? "", confidence: alt.confidence ?? 0 });
      };
      rec.onerror = (e: any) => { clearTimeout(timer); reject(new Error(e.error ?? "mic-error")); };
      rec.onend = () => clearTimeout(timer);
      rec.start();
    } catch (e) { reject(e); }
  });
}

// Future: export async function transcribeViaCloud(audioBlob) { ... }
