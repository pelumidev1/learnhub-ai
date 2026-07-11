import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";

export const metadata: Metadata = { title: "Progress tracker" };

export default function ProgressPage() {
  return (
    <ComingSoon
      title="Progress tracker"
      description="See your streaks, completed steps, and certificates across every roadmap. Coming soon."
    />
  );
}
