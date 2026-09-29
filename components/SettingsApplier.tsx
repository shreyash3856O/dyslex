"use client";
import { useEffect } from "react";
import { useLexStore } from "@/lib/store";

export function SettingsApplier() {
  const settings = useLexStore((s) => s.settings);
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = settings.theme;
    html.dataset.contrast = settings.highContrast ? "high" : "normal";
    html.dataset.dysFont = settings.font;
    html.style.setProperty("--lx-spacing", `${settings.letterSpacing}em`);
    html.style.setProperty("--lx-line", `${settings.lineSpacing}`);
    document.body.classList.toggle("no-motion", settings.reducedMotion);
  }, [settings]);
  return null;
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Skip in development so local edits always show up fresh.
    if (process.env.NODE_ENV !== "production") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
      }
      return;
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
