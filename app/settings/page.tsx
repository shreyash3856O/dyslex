"use client";
import Link from "next/link";
import { SettingsPanel } from "@/components/settings";
import { Customizer } from "@/components/settings";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8 space-y-5">
      <Link href="/map" className="touch-target inline-block rounded-full bg-white px-5 py-2 font-bold shadow">← Map</Link>
      <h1 className="text-3xl font-extrabold">Comfort settings</h1>
      <SettingsPanel />
      <Customizer />
    </div>
  );
}
