/**
 * The career assessment: steps, questions, and answer formatting.
 * Pure data — safe to import from both server and client.
 */

export type QuestionType = "single" | "multi" | "scale" | "text";

export type Option = { value: string; label: string };

export type Question = {
  key: string;
  type: QuestionType;
  label: string;
  help?: string;
  options?: Option[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  placeholder?: string;
  optional?: boolean;
};

export type Step = {
  id: string;
  eyebrow: string;
  title: string;
  questions: Question[];
};

export const STEPS: Step[] = [
  {
    id: "background",
    eyebrow: "About you",
    title: "Let's start with your background",
    questions: [
      {
        key: "current_status",
        type: "single",
        label: "Where are you right now?",
        options: [
          { value: "student", label: "In school / university" },
          { value: "graduate", label: "Graduated, looking for work" },
          { value: "career_changer", label: "Working, want to switch to tech" },
          { value: "employed_tech_adjacent", label: "Already in a tech-adjacent role" },
        ],
      },
      {
        key: "education",
        type: "single",
        label: "Your highest education so far",
        options: [
          { value: "secondary", label: "Secondary school" },
          { value: "diploma", label: "Diploma / certificate" },
          { value: "undergraduate", label: "Undergraduate degree" },
          { value: "graduate", label: "Postgraduate degree" },
          { value: "self_taught", label: "Self-taught" },
        ],
      },
      {
        key: "field_of_study",
        type: "text",
        label: "What did you study? (optional)",
        placeholder: "e.g. Accounting, Biology, or self-taught",
        optional: true,
      },
    ],
  },
  {
    id: "interests",
    eyebrow: "What you enjoy",
    title: "What kind of work pulls you in?",
    questions: [
      {
        key: "interests",
        type: "multi",
        label: "Pick everything that sounds like you",
        help: "Choose as many as apply.",
        options: [
          { value: "solving_problems", label: "Solving tricky problems" },
          { value: "building_apps", label: "Building apps & products" },
          { value: "working_with_data", label: "Working with data & numbers" },
          { value: "designing", label: "Designing how things look & feel" },
          { value: "security", label: "Protecting systems & people" },
          { value: "automating", label: "Automating repetitive work" },
          { value: "helping_people", label: "Helping & supporting people" },
          { value: "leading", label: "Organising & leading projects" },
        ],
      },
      {
        key: "topics",
        type: "multi",
        label: "Which topics are you curious about?",
        options: [
          { value: "web", label: "Websites" },
          { value: "mobile", label: "Mobile apps" },
          { value: "ai_ml", label: "AI & machine learning" },
          { value: "data", label: "Data & analytics" },
          { value: "design_ux", label: "Design & UX" },
          { value: "cybersecurity", label: "Cybersecurity" },
          { value: "cloud", label: "Cloud & DevOps" },
          { value: "product", label: "Product management" },
        ],
      },
    ],
  },
  {
    id: "goals",
    eyebrow: "Where you're headed",
    title: "What are you aiming for?",
    questions: [
      {
        key: "goal",
        type: "single",
        label: "Your main goal right now",
        options: [
          { value: "first_job", label: "Land my first tech job" },
          { value: "switch_careers", label: "Switch into tech from another field" },
          { value: "freelance", label: "Freelance / earn on the side" },
          { value: "startup", label: "Build my own product or startup" },
          { value: "upskill", label: "Level up skills I already have" },
        ],
      },
      {
        key: "timeline",
        type: "single",
        label: "How soon do you want to be job-ready?",
        options: [
          { value: "under_3m", label: "Under 3 months" },
          { value: "3_6m", label: "3–6 months" },
          { value: "6_12m", label: "6–12 months" },
          { value: "flexible", label: "I'm flexible" },
        ],
      },
      {
        key: "remote_importance",
        type: "scale",
        label: "How important is remote / global work to you?",
        min: 1,
        max: 5,
        minLabel: "Not important",
        maxLabel: "Essential",
      },
    ],
  },
  {
    id: "skills",
    eyebrow: "Your starting point",
    title: "What can you already do?",
    questions: [
      {
        key: "current_skills",
        type: "multi",
        label: "What do you have some experience with?",
        help: "It's completely fine to pick only one.",
        options: [
          { value: "none", label: "Starting from scratch" },
          { value: "basic_coding", label: "A little coding" },
          { value: "spreadsheets", label: "Spreadsheets" },
          { value: "design_tools", label: "Design tools (Figma, Canva)" },
          { value: "data_analysis", label: "Data analysis" },
          { value: "writing", label: "Writing / communication" },
          { value: "project_mgmt", label: "Organising projects" },
        ],
      },
      {
        key: "comfort_coding",
        type: "scale",
        label: "How comfortable are you with coding?",
        min: 1,
        max: 5,
        minLabel: "Never tried",
        maxLabel: "Very comfortable",
      },
      {
        key: "comfort_math",
        type: "scale",
        label: "How comfortable are you with maths?",
        min: 1,
        max: 5,
        minLabel: "Avoid it",
        maxLabel: "Love it",
      },
    ],
  },
  {
    id: "workstyle",
    eyebrow: "How you work",
    title: "How do you like to work?",
    questions: [
      {
        key: "work_pref",
        type: "single",
        label: "Which feels most like you?",
        options: [
          { value: "build", label: "I like building things" },
          { value: "analyze", label: "I like analysing & finding answers" },
          { value: "design", label: "I like designing & creating" },
          { value: "organize", label: "I like organising & coordinating" },
          { value: "protect", label: "I like securing & protecting" },
        ],
      },
      {
        key: "team_solo",
        type: "scale",
        label: "Solo focus, or working with a team?",
        min: 1,
        max: 5,
        minLabel: "Solo",
        maxLabel: "Team",
      },
      {
        key: "detail_bigpicture",
        type: "scale",
        label: "Big-picture thinking, or fine detail?",
        min: 1,
        max: 5,
        minLabel: "Big picture",
        maxLabel: "Fine detail",
      },
    ],
  },
  {
    id: "constraints",
    eyebrow: "Your reality",
    title: "A few practical things",
    questions: [
      {
        key: "hours_per_week",
        type: "single",
        label: "How many hours a week can you learn?",
        options: [
          { value: "under_5", label: "Under 5 hours" },
          { value: "5_10", label: "5–10 hours" },
          { value: "10_20", label: "10–20 hours" },
          { value: "20_plus", label: "20+ hours" },
        ],
      },
      {
        key: "budget",
        type: "single",
        label: "Your budget for learning",
        options: [
          { value: "free_only", label: "Free resources only" },
          { value: "some_budget", label: "A small budget" },
          { value: "flexible", label: "Flexible if it's worth it" },
        ],
      },
      {
        key: "device",
        type: "single",
        label: "What do you learn on?",
        options: [
          { value: "phone_only", label: "Mostly my phone" },
          { value: "shared_laptop", label: "A shared laptop" },
          { value: "own_laptop", label: "My own laptop" },
        ],
      },
      {
        key: "internet",
        type: "single",
        label: "How's your internet?",
        options: [
          { value: "limited", label: "Limited / expensive data" },
          { value: "okay", label: "Okay most of the time" },
          { value: "reliable", label: "Reliable" },
        ],
      },
    ],
  },
];

export type AnswerValue = string | string[] | number;
export type Answers = Record<string, AnswerValue>;

/** Middle value for a scale question (used as a friendly default). */
export function scaleDefault(q: Question): number {
  return Math.round(((q.min ?? 1) + (q.max ?? 5)) / 2);
}

function labelOf(q: Question, value: string): string {
  return q.options?.find((o) => o.value === value)?.label ?? value;
}

/** Human-readable answer summary for the AI prompt. */
export function formatAnswers(answers: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const step of STEPS) {
    for (const q of step.questions) {
      const v = answers[q.key];
      if (v === undefined || v === null || v === "") continue;
      let rendered: string;
      if (q.type === "scale") rendered = `${v} out of ${q.max ?? 5}`;
      else if (q.type === "multi" && Array.isArray(v))
        rendered = v.map((x) => labelOf(q, String(x))).join(", ");
      else rendered = labelOf(q, String(v));
      lines.push(`- ${q.label} → ${rendered}`);
    }
  }
  return lines.join("\n");
}
