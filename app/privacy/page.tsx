import Link from "next/link";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 space-y-5">
      <Link href="/" className="touch-target inline-block rounded-full bg-white px-5 py-2 font-bold shadow">← Home</Link>
      <h1 className="text-4xl font-extrabold">Privacy, in plain words</h1>
      <div className="rounded-3xl bg-white/80 p-6 shadow space-y-3 text-lg">
        <p><strong>1. Grown-up says yes first.</strong> No hero, no voice, until a parent ticks consent.</p>
        <p><strong>2. Nicknames only.</strong> No last names, no emails for kids, no photos.</p>
        <p><strong>3. Voice is live, not saved.</strong> Speech is turned to text in the moment. Audio is never stored. Transcripts only if you opt in.</p>
        <p><strong>4. AI never knows who you are.</strong> The guide only gets the current word and quest. Never names.</p>
        <p><strong>5. Kind by design.</strong> No red marks. Flags for safety go to parents, gently.</p>
        <p><strong>6. You can erase.</strong> Clear this device any time from the dashboard. Export CSV for school if you like.</p>
        <p className="opacity-70">COPPA / GDPR / FERPA aware. This demo stores data only in your browser. Connect Supabase for real accounts.</p>
      </div>
    </div>
  );
}
