/* Design-system entry point.
 *
 * LearnHub is a Next.js app, not a published component library, so there is no
 * dist/ and no barrel for the converter to read. This file is that barrel: it
 * names exactly the components the design system exports, and nothing else.
 *
 * Why it must exist rather than letting the converter synthesize an entry from
 * the source tree: a synthesized entry re-exports EVERY file under the source
 * root, which here would pull in components that import Supabase, server-only,
 * and next/navigation — none of which survive in a browser bundle. Listing the
 * exports by hand keeps the bundle to the parts that genuinely stand alone.
 *
 * Adding a component to the design system = adding it here AND to
 * componentSrcMap in config.json (the converter reads the two independently). */

// Primitives
export { Alert } from "../components/ui/alert";
export { Button, Spinner } from "../components/ui/button";
export { Input } from "../components/ui/input";
export { Logo, LogoMark } from "../components/ui/logo";

// Landing / marketing
export { Kicker } from "../components/marketing/landing/kicker";
export { HeroCard } from "../components/marketing/landing/hero-card";
export { OrbitSection } from "../components/marketing/landing/orbit";
export { Faq } from "../components/marketing/landing/faq";
export { StepsTabs } from "../components/marketing/landing/steps-tabs";
