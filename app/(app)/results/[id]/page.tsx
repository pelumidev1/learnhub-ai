import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CareerMatchCard } from "@/components/results/career-match-card";
import { GeneratePanel } from "@/components/results/generate-panel";

export const metadata: Metadata = { title: "Your career matches" };

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: assessment } = await supabase
    .from("assessments")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!assessment) redirect("/dashboard");

  const { data: results } = await supabase
    .from("career_results")
    .select("*")
    .eq("assessment_id", id)
    .eq("user_id", user.id)
    .order("rank", { ascending: true });

  if (!results || results.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <GeneratePanel assessmentId={id} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">
            Your results
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
            Careers built for you
          </h1>
        </div>
        <Link
          href="/assessment"
          className="text-sm font-semibold text-muted transition hover:text-ink"
        >
          Retake assessment
        </Link>
      </div>

      <div className="space-y-4">
        {results.map((r, i) => (
          <CareerMatchCard key={r.id} result={r} top={i === 0} />
        ))}
      </div>
    </div>
  );
}
