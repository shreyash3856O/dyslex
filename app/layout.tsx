import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SettingsApplier } from "@/components/SettingsApplier";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "LexQuest: Reading Adventure",
  description: "Fantasy RPG reading quests for dyslexic children. Structured literacy, voice guide, gentle rewards.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = { themeColor: "#6C3CE0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:p-3 focus:rounded-xl focus:z-50">
          Skip to main content
        </a>
        <SettingsApplier />
        <ServiceWorkerRegister />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
