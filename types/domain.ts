/**
 * Application-level domain types for the dashboard.
 * (The generated DB types live in types/database.ts — run `npm run db:types`.)
 */

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  current_status: string | null;
  onboarding_completed: boolean;
};

export type TopMatch = {
  id: string;
  title: string;
  match_score: number;
  rationale: string | null;
} | null;

export type RoadmapSummary = {
  id: string;
  title: string;
  status: string;
  totalSteps: number;
  doneSteps: number;
  progress: number; // 0–100
  nextStep: { id: string; title: string } | null;
};

export type ActivityItem = {
  id: string;
  label: string;
  createdAt: string;
};

export type ResourceItem = {
  id: string;
  title: string;
  provider: string | null;
  url: string;
  type: string;
  cost: string;
  difficulty: string;
};

export type WeeklyGoal = {
  id: string;
  title: string;
  target: number;
  progress: number;
  unit: string;
  isComplete: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  earnedAt: string;
};

export type CertificateItem = {
  id: string;
  title: string;
  careerTitle: string | null;
  code: string;
  issuedAt: string;
};

export type ProgressData = {
  roadmaps: RoadmapSummary[];
  certificates: CertificateItem[];
  achievements: Achievement[];
  stats: {
    currentStreak: number; // consecutive active days, alive if active today or yesterday
    bestStreak: number;
    stepsDone: number;
    totalSteps: number;
    overallProgress: number; // 0–100
    certificates: number;
  };
};

export type DashboardData = {
  profile: Profile | null;
  hasAssessment: boolean;
  topMatch: TopMatch;
  roadmaps: RoadmapSummary[];
  activity: ActivityItem[];
  resources: ResourceItem[];
  goals: WeeklyGoal[];
  achievements: Achievement[];
  stats: {
    activeRoadmaps: number;
    stepsDone: number;
    overallProgress: number;
    certificates: number;
  };
};

// ---------------------------------------------------------------------------
// Admin overview (reads the admin_* views from supabase/migrations)
// ---------------------------------------------------------------------------

/** One point in a dense daily series — every day present, zero-filled. */
export type DayPoint = { day: string; value: number };

export type AiCostRow = {
  callType: string;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
};

export type FeedbackRow = {
  context: string;
  responses: number;
  avgRating: number | null;
  helpful: number;
  notHelpful: number;
};

export type AdminOverview = {
  /** Days of history the charts and totals cover. */
  windowDays: number;
  totals: {
    signups: number;
    assessmentsStarted: number;
    assessmentsCompleted: number;
    roadmapsCreated: number;
    roadmapsCompleted: number;
    aiCalls: number;
    /** All-time Anthropic spend. */
    aiCostUsd: number;
    /** Spend inside `windowDays` — the budget-relevant number. */
    aiCostWindowUsd: number;
    /** Completed ÷ started, 0–100. Null when nobody has started one. */
    completionRate: number | null;
  };
  signups: DayPoint[];
  assessmentsStarted: DayPoint[];
  assessmentsCompleted: DayPoint[];
  aiCost: DayPoint[];
  aiByCallType: AiCostRow[];
  feedback: FeedbackRow[];
};
