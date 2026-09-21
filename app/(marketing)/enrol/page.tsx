import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = {
  // The root layout appends "· LearnHub"; adding it here too doubles it.
  title: "Join the waitlist",
  description:
    "The six week AI programme. No payment now. When seats open, you hear first.",
};

/* Static, like the masterclass page: nothing here is per-visitor, and the form
   posts to a Server Action, which does not need the page itself rendered per
   request. The cohort dates come from lib/waitlist.ts. */
export const dynamic = "force-static";

/**
 * One screen, no navigation. Deliberately not wrapped in PublicHeader/Footer:
 * this page is a link people arrive at from a post or a message, and the only
 * thing to do on it is the form.
 */
export default function EnrolPage() {
  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-10 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">AI programme</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
          Join the waitlist
        </h1>
        <p className="mt-3 text-lg text-muted">
          The six week AI programme. No payment now. When seats open, you hear first.
        </p>

        <div className="mt-8">
          <WaitlistForm />
        </div>
      </main>
    </div>
  );
}
