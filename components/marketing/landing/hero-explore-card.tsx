import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";

/**
 * The floating pill card in the bottom-left of the hero.
 *
 * A clone of the reference's "Education Plan" card, measured off its rendered
 * page rather than eyeballed: a 319x84 white pill at radius 180, padding
 * 12/30/12/12, a 12px gap, a 60px circular avatar, and a content column at 8px
 * gap holding a 24px icon plus a heading, then a second line.
 *
 * `backdrop-blur` is theirs too, and it is load-bearing rather than decorative:
 * the card sits on a photograph, and a flat white pill over a face reads as a
 * sticker. Blurring what is behind it makes it read as glass sitting on the
 * image.
 *
 * What changed is only what it says. Their second line is a money figure and a
 * progress percentage; ours is the catalog size and the price, because the
 * shape of that line — muted text, then one token in the accent colour — is
 * what the layout needs, and inventing a match percentage here would put a
 * number in front of someone that nothing has computed.
 */
export function HeroExploreCard() {
  return (
    <Link
      href="/careers"
      className="group inline-flex items-center gap-3 rounded-full bg-white/95 p-3 pr-[30px] shadow-[0_18px_50px_-20px_rgba(0,0,0,.55)] backdrop-blur-[36px] transition hover:-translate-y-0.5 hover:bg-white"
    >
      {/* 60px, circular. A real face, as theirs is — the hero is a photograph
          of students and this is the same cast. */}
      <span className="relative block h-[60px] w-[60px] flex-none overflow-hidden rounded-full bg-paper-2">
        {/* object-position, not centre: the source is a half-length shot, so a
            centred 60px circle lands on the books rather than the face. */}
        <Image
          src="/brand/student-1.jpg"
          alt=""
          fill
          sizes="60px"
          className="object-cover object-[50%_18%]"
        />
      </span>

      <span className="flex flex-col gap-2">
        <span className="flex items-center gap-2">
          <LogoMark className="h-6 w-6 flex-none text-blue" />
          <span className="font-display text-base font-bold leading-none tracking-[-0.02em] text-ink">
            Explore careers
          </span>
        </span>
        <span className="flex items-baseline gap-2 text-[15px] leading-none">
          <span className="text-muted">17 paths mapped for Africa</span>
          <span className="font-bold text-blue">Free</span>
        </span>
      </span>
    </Link>
  );
}
