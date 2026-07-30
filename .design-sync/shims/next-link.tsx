/* `next/link` stand-in for the design-system bundle.
 *
 * Components like Logo import next/link. Bundling the real one drags in the
 * Next router runtime, which throws outside a Next app (no router context) and
 * would blank every preview that contains a Logo. Outside Next, a Link IS an
 * anchor — so that is what this renders, with the same prop surface the DS
 * actually uses. Wired in via the `paths` map in tsconfig.sync.json. */

import { forwardRef } from "react";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
  // Accepted and dropped: routing hints with no meaning outside Next.
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, prefetch, replace, scroll, shallow, children, ...props },
  ref,
) {
  return (
    <a ref={ref} href={typeof href === "string" ? href : (href?.pathname ?? "#")} {...props}>
      {children}
    </a>
  );
});

export default Link;
