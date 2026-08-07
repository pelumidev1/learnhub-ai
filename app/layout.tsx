import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { displayFont, sansFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LearnHub: Find the tech career built for you",
    template: "%s · LearnHub",
  },
  description: "The AI career coach for Africa's next generation of tech talent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${GeistMono.variable}`}
    >
      <body className="bg-white font-sans text-ink antialiased">
        {children}
        {/* Page views and scroll depth, so decisions about the landing page are
            made from what people actually do rather than from opinion. It is
            cookieless and stores no personal data, which is why the privacy
            policy can still say we set no tracking cookies — the analytics
            paragraph there covers what this does collect.

            About 1KB, loaded after hydration, and it sends nothing in
            development. Note for future installs: `npm i @vercel/analytics`
            fails on this repo without `--legacy-peer-deps`. The package
            declares optional peers for SvelteKit and friends, and npm tries to
            satisfy them, which drags in a vite that conflicts with vitest's.
            Nothing Svelte is installed — check `node_modules/@sveltejs` is
            still absent if you ever re-run it. */}
        <Analytics />
      </body>
    </html>
  );
}
