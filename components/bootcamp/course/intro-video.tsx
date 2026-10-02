import { LogoMark } from "@/components/ui/logo";
import { COURSE_LINKS } from "@/lib/bootcamp/course-links";

/**
 * The course intro video at the top of /learn, in the place Domestika puts a
 * course trailer. Pelumi will supply it, made with AI or of him on camera;
 * until COURSE_LINKS.introVideo is set, the slot holds a branded poster that
 * says so, at the same 16:9, so the page does not reflow when it arrives.
 *
 * preload="metadata": the file is only fetched when someone presses play,
 * which on metered data is the difference between a free page and a paid one.
 */
export function IntroVideo() {
  const src = COURSE_LINKS.introVideo;

  if (src) {
    return (
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full rounded-[20px] bg-ink object-cover shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_56px_-24px_rgba(11,15,26,.35)]"
      />
    );
  }

  return (
    <div className="lh-price-panel relative grid aspect-video w-full place-items-center overflow-hidden rounded-[20px] text-white shadow-[0_1px_2px_rgba(11,15,26,.06),0_24px_56px_-24px_rgba(31,51,204,.45)]">
      <LogoMark className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 text-white/[0.06]" />
      <div className="relative text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
          <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
          </svg>
        </span>
        <p className="mt-4 font-serif text-[1.75rem] leading-tight sm:text-[2.25rem]">Course intro</p>
        <p className="mt-1 text-sm text-white/75">Video coming soon</p>
      </div>
    </div>
  );
}
