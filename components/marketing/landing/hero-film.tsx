"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The bootcamp film in the hero's framed panel, where the lesson mockup used to
 * sit. Made in learnhub-launch/videos/learnhub-hero-remotion; the web files are
 * two-pass encodes of that render (2.6 MB, and 1.8 MB for phones).
 *
 * As on artisan.co, it does not start itself: the poster shows with a large
 * play button in the centre, and one tap plays the film with sound on.
 * Browsers only allow sound after a tap, and waiting for it means nothing
 * downloads for a reader who never presses play, which matters on metered data.
 *
 * Once started: a click anywhere on the film pauses it, a small bar holds
 * play/pause and sound, and it pauses while scrolled out of view, resuming on
 * the way back unless the reader paused it themselves.
 */

const glassButton =
  "inline-flex items-center gap-2 rounded-full bg-ink/55 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors duration-150 hover:bg-ink/70";

export function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  // True from the first tap on play; until then only the poster and the play button show.
  const [wanted, setWanted] = useState(false);
  // A pause the reader chose; scrolling back into view must not override it.
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !wanted) return;
    const io = new IntersectionObserver(([entry]) => {
      // play() rejects if the browser still blocks it; the play button stays up then.
      if (entry.isIntersecting && !userPaused.current) video.play().catch(() => setPlaying(false));
      else if (!entry.isIntersecting) video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [wanted]);

  // Not muted by default: the tap on play is what lets the browser allow sound.
  const play = () => {
    userPaused.current = false;
    setWanted(true);
    ref.current?.play().catch(() => setPlaying(false));
  };

  const pause = () => {
    userPaused.current = true;
    ref.current?.pause();
  };

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-white/60 bg-ink shadow-[0_2px_4px_rgba(11,15,26,.06),0_24px_64px_-12px_rgba(11,15,26,.28)] sm:rounded-[20px]">
      <video
        ref={ref}
        className="block aspect-video w-full cursor-pointer object-cover"
        poster="/video/hero-poster.jpg"
        loop
        playsInline
        preload="none"
        aria-label="LearnHub AI Bootcamp: six weeks of building with AI, shown week by week"
        onClick={() => (playing ? pause() : play())}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 640px)" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {!playing && (
        <button type="button" onClick={play} className="absolute inset-0 grid place-items-center" aria-label="Play the film with sound">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-105 sm:h-20 sm:w-20">
            <svg className="ml-1 h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}

      {/* The bar shows once the film has been started, so a paused film can be resumed from it too. */}
      {wanted && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between sm:bottom-4 sm:left-4 sm:right-4">
          <button
            type="button"
            onClick={playing ? pause : play}
            aria-label={playing ? "Pause the film" : "Play the film"}
            className={`${glassButton} h-9 w-9 justify-center`}
          >
            {playing ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            )}
          </button>

          <button type="button" onClick={toggleSound} aria-pressed={!muted} className={`${glassButton} px-3.5 py-2 text-xs font-semibold`}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
            </svg>
            {muted ? "Sound on" : "Sound off"}
          </button>
        </div>
      )}
    </div>
  );
}
