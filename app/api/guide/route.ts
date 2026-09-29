import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

// Server-only guide route. Key never reaches client.
// Per-session cap (20 turns) + rate limit enforced here. Child speech treated as untrusted.

const turns = new Map<string, { n: number; reset: number }>();

function shortReply(s: string) {
  return s.split(/(?<=[.!?])\s+/).slice(0, 3).map((x) => x.split(/\s+/).slice(0, 14).join(" ")).join(" ");
}

function mockGuide(mode: string, speech: string, target: string): { reply: string; flagged: boolean } {
  const flagged = /hurt|scared|sad|hate me|die|alone|mom.*dad|hit/i.test(speech);
  if (flagged) return { reply: "Thank you for telling me. You matter a lot. Tell a grown-up you trust today. [FLAG_FOR_PARENT]", flagged: true };
  if (!speech.trim()) return { reply: "I am here, friend. Say the first sound with me.", flagged: false };
  if (mode === "read") {
    const tw = target.toLowerCase().split(/\s+/);
    const sw = speech.toLowerCase().split(/\s+/);
    const miss = tw.find((w) => !sw.includes(w));
    if (!miss) return { reply: "Smooth reading, hero. Every word shone. Want one more line?", flagged: false };
    return { reply: `Lovely trying. One word wants love. Listen: ${miss.split("").join("... ")}. Can you try ${miss}?`, flagged: false };
  }
  // hint mode: never reveal target fully
  const first = target.replace(/[|]/g, " ").split(/\s+/)[0] ?? target;
  if (speech.toLowerCase().includes(first.toLowerCase()) && first.length > 1)
    return { reply: "You are close, friend. Say the first sound slowly. What mouth shape helps?", flagged: false };
  return { reply: `Good trying, friend. First sound is /${first.slice(0, 2)}/. What letters could team up?`, flagged: false };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = "hint", childSpeech = "", questId = "", itemPrompt = "" } = body;
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const now = Date.now();
    const t = turns.get(ip) ?? { n: 0, reset: now + 3600e3 };
    if (now > t.reset) { t.n = 0; t.reset = now + 3600e3; }
    if (t.n >= 20) return NextResponse.json({ reply: "We had lots of tries. Rest, hero. Come back soon.", flagged: false }, { status: 429 });
    t.n += 1; turns.set(ip, t);

    // Safety pre-screen (server): never forward PII; strip names/emails
    const clean = String(childSpeech).slice(0, 300).replace(/[\w.-]+@[\w.-]+/g, "[removed]");

    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      const m = mockGuide(mode, clean, String(itemPrompt));
      const flagged = m.reply.includes("[FLAG_FOR_PARENT]");
      return NextResponse.json({ reply: shortReply(m.reply.replace("[FLAG_FOR_PARENT]", "").trim()), flagged, turnsLeft: 20 - t.n, mock: true });
    }

    let system = "";
    try { system = await readFile(join(process.cwd(), "lib", "guide", "prompt.md"), "utf8"); } catch { system = "You are Nimbus, a kind reading guide. Short sentences. Hints only, never answers."; }

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 120,
        system,
        messages: [{ role: "user", content: `mode=${mode}; quest=${questId}; target=${String(itemPrompt).slice(0, 120)}; child said: ${clean}` }]
      })
    });
    const data = await r.json();
    const text: string = data?.content?.[0]?.text ?? "Good trying, friend. Let's sound it out slowly.";
    const flagged = text.includes("[FLAG_FOR_PARENT]");
    return NextResponse.json({ reply: shortReply(text.replace("[FLAG_FOR_PARENT]", "").trim()), flagged, turnsLeft: 20 - t.n });
  } catch (e) {
    return NextResponse.json({ reply: "I am here. Let us try one small sound together.", flagged: false }, { status: 200 });
  }
}
