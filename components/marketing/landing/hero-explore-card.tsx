import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";

/**
 * The floating pill card in the bottom-left of the hero.
 *
 * A clone of the reference's "Education Plan" card, measured off its rendered
 * page at 1440x900 rather than eyeballed:
 *
 *   card     319x84, radius 180, padding 12/30/12/12, gap 12, items-center,
 *            solid white, no shadow
 *   avatar   60x60 circle
 *   content  column, gap 8, width 205
 *   heading  row, gap 8, items-center; a 24x24 chip at radius 6 filled with
 *            their accent, holding a 16px glyph
 *   title    16px / 600 / -0.32px tracking / 22.4px line-height
 *   sub      14px / 500 / 22.4px, muted
 *
 * The depth under it is three ghost pills, not a shadow — same 84px height,
 * pushed down 13/24/34px and inset 7/11/14% on each side, at 14%/10%/5% white.
 * That is what makes the card read as the top of a stack rather than a sticker
 * on a photo. Their card also carries `backdrop-filter: blur(36px)`, which does
 * nothing behind an opaque white fill; it is not reproduced here.
 *
 * The fill is `.lh-metal-light` rather than their flat white — the page's silver
 * surface, so this card is the same material as the pricing card and the career
 * pills. It keeps their no-shadow rule: the depth here is the ghost stack, and a
 * drop shadow would sit on top of those three layers and muddy them.
 *
 * What changed is only what it says. Their second line is a money figure and a
 * progress percentage; ours is the size of the catalog, because inventing a
 * match percentage here would put a number in front of someone that nothing has
 * computed.
 */
export function HeroExploreCard() {
  return (
    <div className="relative inline-flex">
      {/* The stack under the card. Percentage insets so the three layers keep
          their proportions when the card narrows on a phone. */}
      <span
        className="pointer-events-none absolute inset-x-[7%] -bottom-[13px] top-[13px] rounded-full bg-white/[0.14]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-x-[11%] -bottom-[24px] top-[24px] rounded-full bg-white/10"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-x-[14%] -bottom-[34px] top-[34px] rounded-full bg-white/5"
        aria-hidden
      />

      <Link
        href="/careers"
        className="lh-metal-light relative inline-flex items-center gap-3 rounded-full p-3 pr-[30px] transition hover:-translate-y-0.5"
      >
        {/* 60px, circular. A real face, as theirs is — the hero is a photograph
            of students and this is the same cast. */}
        <span className="relative block h-[60px] w-[60px] flex-none overflow-hidden rounded-full bg-paper-2">
          {/* The source is a 688x1024 half-length shot on a white wall, so
              `object-cover` alone fits the full frame width into the circle and
              the face lands about 23px across — a figure, not a portrait. The
              scale zooms past cover to roughly a head-and-shoulders crop, and
              the object-position puts the face on the circle's centre first so
              the zoom stays on it. */}
          <Image
            src="/brand/step-2.jpg"
            alt=""
            fill
            sizes="60px"
            className="scale-[1.7] object-cover object-[50%_37%]"
          />
        </span>

        <span className="flex flex-col gap-2">
          <span className="flex items-center gap-2">
            {/* Their chip is a dark glyph on fluorescent green. Ours inverts —
                white on brand blue — because the palette's accent is dark. */}
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-blue">
              <LogoMark className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-base font-semibold leading-[1.4] tracking-[-0.02em] text-ink">
              Explore careers
            </span>
          </span>
          <span className="text-sm font-medium leading-[1.4] tracking-[-0.02em] text-muted">
            17 paths mapped for Africa
          </span>
        </span>
      </Link>
    </div>
  );
}
