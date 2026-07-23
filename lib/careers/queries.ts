import "server-only";
import { createPublicClient } from "@/lib/supabase/public";

/** careers is the one public-read table (RLS allows anon select on is_active). */

export type RemoteLevel = "low" | "medium" | "high";

export type CareerListItem = {
  slug: string;
  title: string;
  category: string;
  description: string | null;
  remote_potential: RemoteLevel | null;
  demand_level: RemoteLevel | null;
};

export type CareerDetail = CareerListItem & {
  typical_skills: string[];
  salary_ranges: Record<string, string>;
};

/** Human labels for the raw category slugs stored on careers.category. */
export const CATEGORY_LABELS: Record<string, string> = {
  software: "Software Engineering",
  data: "Data",
  ai: "AI & Machine Learning",
  design: "Design",
  cybersecurity: "Cybersecurity",
  cloud: "Cloud & DevOps",
  product: "Product",
  qa: "Quality Engineering",
};

/** Human labels for salary_ranges JSON keys (country codes + "remote"). */
export const REGION_LABELS: Record<string, string> = {
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  ZA: "South Africa",
  remote: "Remote (global)",
};

export const categoryLabel = (c: string) => CATEGORY_LABELS[c] ?? c;

/** All active careers, ordered for a stable, grouped catalog. */
export async function getCareers(): Promise<CareerListItem[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("careers")
    .select("slug, title, category, description, remote_potential, demand_level")
    .eq("is_active", true)
    .order("category")
    .order("title");
  return (data as CareerListItem[] | null) ?? [];
}

/** One active career by slug, or null if it doesn't exist / is inactive. */
export async function getCareerBySlug(slug: string): Promise<CareerDetail | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("careers")
    .select(
      "slug, title, category, description, remote_potential, demand_level, typical_skills, salary_ranges",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return (data as CareerDetail | null) ?? null;
}
