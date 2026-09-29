"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLexStore } from "@/lib/store";
import { SpeakButton, Instruction } from "@/components/ui";

export default function Onboarding() {
  const addStudent = useLexStore((s) => s.addStudent);
  const updateSettings = useLexStore((s) => s.updateSettings);
  const settings = useLexStore((s) => s.settings);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🦊");
  const [pin, setPin] = useState("");
  const router = useRouter();

  const done = () => {
    if (!name.trim() || pin.length < 3) return;
    addStudent({ name: name.trim().slice(0, 20), avatar, pin });
    router.push("/map");
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 space-y-6">
      <h1 className="text-4xl font-extrabold">Become a Sound Keeper in 2 minutes</h1>
      <Instruction text={["First, tell us your hero name.", "Pick a friend to travel with.", "Last step: parent permission for voices."][step]} />
      {step === 0 && (
        <div className="rounded-3xl bg-white/80 p-6 shadow space-y-4">
          <label className="block text-xl font-bold">Hero nickname (first name only)
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="e.g. Ari"
              className="mt-2 w-full rounded-2xl border-4 border-berry/30 p-4 text-2xl" aria-label="Hero nickname" />
          </label>
          <label className="block text-xl font-bold">Secret PIN (for kids login)
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="1234"
              className="mt-2 w-full rounded-2xl border-4 border-berry/30 p-4 text-2xl" aria-label="PIN" />
          </label>
          <button onClick={() => setStep(1)} disabled={!name.trim() || pin.length < 3} className="touch-target rounded-full bg-berry text-white px-8 py-3 font-bold disabled:opacity-40">Next →</button>
        </div>
      )}
      {step === 1 && (
        <div className="rounded-3xl bg-white/80 p-6 shadow space-y-4">
          <p className="text-xl font-bold">Pick your avatar</p>
          <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Avatar">
            {["🦊", "🦉", "🐲", "🤖", "🧙", "🐢"].map((a) => (
              <button key={a} role="radio" aria-checked={avatar === a} onClick={() => setAvatar(a)}
                className={`touch-target rounded-2xl text-5xl p-4 shadow ${avatar === a ? "bg-gold" : "bg-cream"}`}>{a}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="touch-target rounded-full bg-white px-6 py-3 font-bold shadow">← Back</button>
            <button onClick={() => setStep(2)} className="touch-target rounded-full bg-berry text-white px-8 py-3 font-bold">Next →</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="rounded-3xl bg-white/80 p-6 shadow space-y-4">
          <h2 className="text-2xl font-extrabold">Grown-up step: permission</h2>
          <p className="text-lg">LexQuest needs a grown-up to say yes before voices or reading help turn on. No last names. No audio stored unless you opt in.</p>
          <label className="flex gap-3 items-start text-lg">
            <input type="checkbox" className="h-6 w-6 mt-1" checked={settings.consentVoice} onChange={(e) => updateSettings({ consentVoice: e.target.checked })} />
            Yes, my child can use voice reading and the in-app guide.
          </label>
          <label className="flex gap-3 items-start text-lg">
            <input type="checkbox" className="h-6 w-6 mt-1" checked={settings.consentTranscript} onChange={(e) => updateSettings({ consentTranscript: e.target.checked })} />
            Also save voice transcripts so I can review (optional, off by default).
          </label>
          <SpeakButton text="A grown-up said it is okay to play with voices." label="Hear permission" />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStep(1)} className="touch-target rounded-full bg-white px-6 py-3 font-bold shadow">← Back</button>
            <button onClick={done} disabled={!settings.consentVoice} className="touch-target rounded-full bg-moss text-white px-8 py-3 font-extrabold disabled:opacity-40">🗺 Start questing!</button>
          </div>
          {!settings.consentVoice && <p className="opacity-70">Tip: voice consent is needed for TTS and guide in this demo.</p>}
        </div>
      )}
    </div>
  );
}
