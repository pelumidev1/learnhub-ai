import { TOOLS, type Tool } from "./tools";

export function ToolMark({ tool, className = "h-5 w-5" }: { tool: Tool; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={tool.d} />
    </svg>
  );
}

/**
 * "Tools you'll use": the logo strip under the hero, in the place Artisan puts
 * its customer logos. We have no customers to show yet, and the tools are the
 * honest version of the same signal: this is the industry's own kit.
 *
 * Runs on the page's existing marquee (.lh-marquee in app/brand.css): the list
 * twice, the track sliding by one copy, the second copy aria-hidden so a
 * screen reader hears it once. The section's overflow-hidden is load-bearing:
 * the track is max-content wide, and without it the page grows to its width.
 */
export function ToolsStrip() {
  return (
    <section className="overflow-hidden bg-white pb-20 pt-8 sm:pb-28 sm:pt-6">
      <h2 className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Tools you&apos;ll use
      </h2>
      <div className="lh-marquee-mask mt-8">
        <div className="lh-marquee">
          {[0, 1].map((copy) => (
            <ul className="lh-marquee-group" key={copy} aria-hidden={copy === 1 || undefined}>
              {TOOLS.map((t) => (
                <li key={t.name} className="flex items-center gap-2.5 whitespace-nowrap px-5 text-muted sm:px-7">
                  <ToolMark tool={t} className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-[17px] font-semibold tracking-[-0.01em] sm:text-lg">{t.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
