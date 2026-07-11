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
