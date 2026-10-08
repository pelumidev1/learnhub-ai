"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./motion-budget";

/**
 * The bootcamp film in the hero's framed panel, where the lesson mockup used to
 * sit. Made in learnhub-launch/videos/learnhub-hero-remotion; the web files are
 * two-pass encodes of that render (2.6 MB, and 1.8 MB for phones).
 *
 * It starts itself, muted, only when that is cheap for the reader: not with
 * reduced motion, and not when the browser says the reader is saving data.
 * Otherwise the poster stays up with a play button, and nothing downloads until
 * it is pressed. It also pauses while scrolled out of view, so a reader lower
 * down the page is not decoding a hero they cannot see.
 */
type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

export function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  // Becomes true once the film has been allowed to run, by the checks below or by a tap.
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    if (!reduced && !saveData) setWanted(true);
  }, [reduced]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !wanted) return;
    const io = new IntersectionObserver(([entry]) => {
      // play() rejects if the browser still blocks it; the play button stays up then.
      if (entry.isIntersecting) video.play().catch(() => setPlaying(false));
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [wanted]);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="lh-depth-panel relative overflow-hidden rounded-[14px] border border-white/60 bg-ink shadow-[0_2px_4px_rgba(11,15,26,.06),0_24px_64px_-12px_rgba(11,15,26,.28)] sm:rounded-[20px]">
      <video
        ref={ref}
        className="block aspect-video w-full object-cover"
        poster="/video/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-label="LearnHub AI Bootcamp: six weeks of building with AI, shown week by week"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 640px)" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {!playing && (
        <button
          type="button"
          onClick={() => {
            setWanted(true);
            ref.current?.play().catch(() => setPlaying(false));
          }}
          className="absolute inset-0 grid place-items-center"
          aria-label="Play the film"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-105 sm:h-20 sm:w-20">
            <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}

      {playing && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-ink/55 px-3.5 py-2 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-md transition-colors duration-150 hover:bg-ink/70 sm:bottom-4 sm:right-4"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
          </svg>
          {muted ? "Sound on" : "Sound off"}
        </button>
      )}
    </div>
  );
}
