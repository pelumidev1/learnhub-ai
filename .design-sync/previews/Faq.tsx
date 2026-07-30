import { Faq } from "learnhub-ai";

/* Faq carries its own question set — it takes no props, so there is exactly
 * one honest story. It is wrapped at the width the landing page gives it,
 * because the type scale and the divider rhythm only read correctly at
 * roughly that measure. The first item renders open by default.
 *
 * Both stories sit on `bg-ink`: the component is styled for a dark ground,
 * which is the only place the landing page uses it. On white its questions are
 * invisible, so a light preview would misrepresent it. */

export function Default() {
  return (
    <div className="w-full bg-ink p-8">
      <div className="max-w-2xl">
        <Faq />
      </div>
    </div>
  );
}

/** How the section actually appears on the landing page, with its heading. */
export function InSection() {
  return (
    <div className="w-full bg-ink p-8">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-bold uppercase leading-[1.04] tracking-tight text-white">
          Questions, answered
        </h2>
        <div className="mt-8">
          <Faq />
        </div>
      </div>
    </div>
  );
}
