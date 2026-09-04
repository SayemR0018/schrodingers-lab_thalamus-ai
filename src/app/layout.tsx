import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Thalamus AI — AI Business Brain",
  description:
    "Thalamus AI is a business-first intelligence layer that connects business context, specialized agents, evidence, and human control.",
};

/**
 * Root layout for the unified application.
 *
 * Deliberately minimal: it owns the fonts and the stylesheet, and nothing
 * else. The two surfaces layer their own concerns on top —
 * `(landing)/layout.tsx` adds the landing palette and theme provider, and
 * `workspace/layout.tsx` adds the app shell and the context bridge. In
 * particular, `<html lang>` is managed per surface, because each keeps its
 * language in a different store.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
