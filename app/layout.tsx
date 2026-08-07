import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { displayFont, sansFont } from "./fonts";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LearnHub: Find the tech career built for you",
    template: "%s · LearnHub",
  },
  description:
    "The AI career coach for Africa's next generation of tech talent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${GeistMono.variable}`}
    >
      <body className="bg-white font-sans text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
