import "server-only";
import type { RecommendationOutput } from "./schemas";
import type { RoadmapOutput } from "./roadmap";

/**
 * Canned AI output for demo mode (AI_DEMO_MODE=true in .env.local).
 * Lets the full product loop run with zero Anthropic spend — e.g. while the
 * API account has no credits. Callers still push this through the same Zod
 * schemas as real model output before anything persists, and every demo
 * response is labeled as sample data so nobody mistakes it for a live result.
 */

export const DEMO_MODEL = "demo";

/** Small pause so loading and streaming states feel like a real generation. */
export function demoDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Sample recommendation. Slugs match supabase/seed.sql so catalog links resolve. */
export function demoRecommendation(): RecommendationOutput {
  return {
    summary:
      "You think in patterns, enjoy solving practical problems, and want work you can start from a phone or modest laptop — that points clearly toward data and product-focused roles. (Demo mode: this is sample data, not a live AI analysis.)",
    top_careers: [
      {
        career_slug: "data-analyst",
        title: "Data Analyst",
        match_score: 92,
        rationale:
          "You said you enjoy finding patterns and explaining them to people. Data analysis is exactly that — and it's one of the most accessible entry points into tech, with free tools and strong local demand.",
        strengths_leveraged: ["Logical thinking", "Attention to detail", "Clear communication"],
        gaps_to_close: ["Spreadsheet mastery", "SQL", "Basic Python for data"],
        salary_range_local: "$300–$800/month equivalent at entry level (sample figure)",
        remote_potential: "high",
        time_to_job_ready: "6–9 months part-time",
      },
      {
        career_slug: "frontend-engineer",
        title: "Frontend Engineer",
        match_score: 85,
        rationale:
          "You like building things people can see and use. Frontend work gives you fast feedback, a huge free-learning ecosystem, and a portfolio you can build entirely in the browser.",
        strengths_leveraged: ["Creativity", "Persistence", "Eye for detail"],
        gaps_to_close: ["HTML/CSS/JavaScript", "React", "Responsive design"],
        salary_range_local: "$350–$900/month equivalent at entry level (sample figure)",
        remote_potential: "high",
        time_to_job_ready: "8–12 months part-time",
      },
    ],
    next_steps: [
      "Start the free Google Data Analytics fundamentals — 30 minutes a day is enough.",
      "Open a free Kaggle account and complete one guided spreadsheet exercise this week.",
      "Generate your learning roadmap here and mark your first step done.",
    ],
  };
}

/** Sample roadmap for any career. Six schema-valid steps, foundations to job-ready. */
export function demoRoadmap(careerTitle: string): RoadmapOutput {
  return {
    title: `Your path to ${careerTitle}`,
    steps: [
      {
        title: "Set up your learning base",
        description:
          "Get your tools ready and build a study habit you can keep. Even 30 focused minutes a day beats a long weekend binge.",
        skill: "Learning habits",
        estimated_weeks: 1,
        resources: [
          { label: "freeCodeCamp — how to learn to code", url: "https://www.freecodecamp.org/news/how-to-learn-programming/" },
        ],
      },
      {
        title: `Understand what a ${careerTitle} actually does`,
        description:
          "Watch day-in-the-life content and read job posts from your market so every later step has context. Note the tools that appear again and again.",
        skill: "Career awareness",
        estimated_weeks: 1,
        resources: [
          { label: "Coursera — free career courses", url: "https://www.coursera.org/courses?query=free" },
        ],
      },
      {
        title: "Master the fundamentals",
        description:
          "Work through the beginner track for this path. Don't rush — the fundamentals carry every step after this one.",
        skill: "Core fundamentals",
        estimated_weeks: 6,
        resources: [
          { label: "freeCodeCamp", url: "https://www.freecodecamp.org" },
          { label: "Khan Academy", url: "https://www.khanacademy.org" },
        ],
      },
      {
        title: "Learn the everyday tools",
        description:
          "Get hands-on with the two or three tools that every job post for this role mentions. Practise on real exercises, not just tutorials.",
        skill: "Professional tooling",
        estimated_weeks: 5,
        resources: [
          { label: "The Odin Project", url: "https://www.theodinproject.com" },
        ],
      },
      {
        title: "Build a real project",
        description:
          "Pick a problem from your own community and solve it end to end. One finished project teaches more than five started ones — and it becomes your first portfolio piece.",
        skill: "Applied practice",
        estimated_weeks: 5,
        resources: [
          { label: "GitHub — host your work free", url: "https://github.com" },
        ],
      },
      {
        title: "Get job-ready",
        description:
          "Polish your portfolio, write a one-page CV focused on what you built, and start applying to junior and internship roles. Apply while you keep learning — don't wait to feel ready.",
        skill: "Job search",
        estimated_weeks: 4,
        resources: [
          { label: "LinkedIn", url: "https://www.linkedin.com" },
        ],
      },
    ],
  };
}

/** Sample advisor reply, streamed word by word so the chat UI behaves as it will live. */
export const DEMO_ADVISOR_REPLY = `Quick note before anything else: I'm running in demo mode right now, so this is a sample reply — not a live AI answer to your message. Once a funded Anthropic API key is added, I'll respond to exactly what you asked.

Here's the kind of coaching you'll get from me: I already know your career match and where you are on your roadmap, so you can ask things like "is my next step worth the time?" or "how do I explain this project in an interview?" and I'll answer for your situation, not in general.

Try me again once the real key is in — I'll be here.`;

/** DEMO_ADVISOR_REPLY split into word-ish chunks for simulated streaming. */
export function demoAdvisorChunks(): string[] {
  return DEMO_ADVISOR_REPLY.match(/\S+\s*/g) ?? [];
}
