import { HeroCard } from "learnhub-ai";

/* HeroCard is `absolute bottom-8 right-6` and `hidden lg:block`, so it only
 * renders inside a positioned parent at desktop width — hence the single-card
 * mode and wide viewport in cfg.overrides.HeroCard. The ink ground is not
 * decoration: the card is white-on-dark by design, with two offset depth
 * layers behind it that are invisible on a light background.
 *
 * The cursor tilt is driven by mousemove, so a static capture shows the card
 * at rest. That is the correct resting state, not a failed animation. */

export function OnHero() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-3xl bg-ink">
      <div className="lh-noise absolute inset-0" aria-hidden />
      <div className="absolute left-10 top-14 max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-sky-2">
          Free while in beta
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight text-white">
          Find the tech career that fits you
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-silver-2">
          Two minutes on your phone. An honest match, a free roadmap, and an AI coach
          that knows your plan.
        </p>
      </div>
      <HeroCard />
    </div>
  );
}
