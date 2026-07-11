# LearnHub AI — Screen & Component Design Spec

Design for every screen, defined before code. Built on `CLAUDE.md` (brand, tokens, code rules) and the schema in `supabase/migrations`. Mobile-first, modern, minimal, metallic, Apple-like. English only.

**How to read:** Shared foundations are defined once in §1 and reused everywhere — screens reference them by name instead of redefining. Each screen lists: purpose · access · anatomy · components · states · data.

---

## 1. Shared foundations

### 1.1 Design tokens (from `CLAUDE.md`)
- **Color:** `--lh-blue #1F33CC` (primary), `--lh-blue-600` (hover), `--lh-blue-400` (accent), `--lh-ink #0B0F1A`, white, `--lh-mist`, gray scale. Blue is the accent — used deliberately.
- **Type:** Geist. Scale: Display / H1 / H2 / H3 / Body / Small / Caption. Never Inter/Roboto/system.
- **Radius:** 8 / 12 / 16 / full. **Shadow:** soft, layered. **Motion:** 150–250ms ease-out.

### 1.2 Layout shells
- **`MarketingShell`** — public pages. Sticky top nav (transparent → solid on scroll): `Logo`, links (How it works · Careers · Log in), primary `Button` "Start free". Footer (links, socials, legal).
- **`AuthShell`** — sign up / login. Centered, distraction-free: `Logo` top, centered `Card`, legal microcopy footer.
- **`AppShell`** — authenticated app. **Desktop:** left `Sidebar` (Logo, nav items, user menu pinned bottom). **Mobile:** top `AppBar` (Logo + `Avatar`) + fixed `BottomNav` (max 5 tabs). Renders `<main>` + global `Toast` region + `OfflineBanner`.
- **`AssessmentShell`** — the wizard. Minimal chrome: top `StepProgress` + `SaveIndicator` + close (saves draft). No sidebar/bottom nav (focus mode).
- **`AdminShell`** — admin only. Sidebar with admin nav (Overview · Users · AI Cost · Feedback · Catalog). Gated by `is_admin()`.

### 1.3 UI primitives (`components/ui/` — reused across all screens)
`Logo` · `Button` (primary/secondary/ghost/destructive, loading) · `GoogleAuthButton` · `TextField` · `Textarea` · `Select` · `Checkbox` · `RadioGroup` · `OptionCard` (selectable tile) · `Chip` / `ChipMultiSelect` · `Slider`/`ScaleInput` · `Card` · `Badge` · `Avatar` · `Tabs` · `Progress` (bar) · `ScoreRing` (circular %) · `StatTile` (KPI) · `Modal`/`ConfirmDialog` · `Sheet`/`Drawer` · `DropdownMenu` · `Tooltip` · `Toast` · `Alert`/`Banner` · `Skeleton` · `Spinner` · `Stepper`/`StepProgress` · `SaveIndicator` · `EmptyState` · `ErrorState` · `DataTable` (sortable) · `SearchInput` · `FilterBar` · `Pagination` · `ChatBubble` · `ThumbsFeedback` · `ChartCard` (bar/line).

### 1.4 Feature components (`components/<feature>/`)
Defined here, reused by the screens below: `CareerCard`, `CareerMatchCard`, `RecommendationSummary`, `GenerationStream`, `RoadmapTimeline`, `RoadmapStepCard`, `ResourceCard`, `ResourceLinkItem`, `CertificateCard`, `CertificateCallout`, `AdvisorLaunchButton`, `AdvisorChatPanel`, `ProgressOverviewCard`, `RoadmapProgressRow`, `ActivityTimeline`, `CatalogEditor`.

---

## 2. Screens

### 2.1 Landing Page — `/`
**Purpose:** convert a visitor into an assessment start. **Access:** public · `MarketingShell`.
**Anatomy (top→bottom):**
1. **Hero** — headline ("Discover the tech career built for you"), subhead, primary `Button` "Find my career — free", secondary "How it works". Metallic gradient + orbit mark. Trust line ("For students, graduates & career changers across Africa").
2. **How it works** — 3 `StepCard`s: Assess → Get your match → Follow your path.
3. **Career explorer teaser** — horizontal-scroll row of `CareerCard`s (from `careers`), link to full catalog.
4. **Value props** — `FeatureCard` grid: Personalized to you · Grounded in African reality · Free forever · AI coach 24/7.
5. **Who it's for** — `PersonaCard`s (Students / Graduates / Career changers).
6. **FAQ** — accordion.
7. **CTA band** — royal-blue section, reverse logo, "Start free" `Button`.
8. **Footer.**
**Components:** `MarketingShell`, `HeroSection`, `StepCard`, `CareerCard`, `FeatureCard`, `PersonaCard`, `FAQAccordion`, `CTABand`, `Button`, `Logo`.
**States:** career teaser → `Skeleton` while loading, hidden if empty. **Data:** `careers` (public read).

### 2.2 Sign Up — `/signup`
**Purpose:** create a free account (Google only). **Access:** public · `AuthShell`.
**Anatomy:** centered `Card` — `Logo`, H1 "Create your free account", subhead, value bullets (free · 2-min assessment), `GoogleAuthButton` "Continue with Google", legal microcopy (Terms/Privacy), link "Already have an account? Log in".
**Components:** `AuthShell`, `AuthCard` (mode="signup"), `GoogleAuthButton`, `Logo`.
**States:** default · loading ("Redirecting to Google…", button spinner) · error (`Alert` on OAuth failure).
**Data:** none pre-auth. → `/auth/callback` → onboarding (if `onboarding_completed=false`) or `/dashboard`.

### 2.3 Login — `/login`
Same `AuthCard`, **mode="login"** (never a separate duplicate). "Welcome back", `GoogleAuthButton`, link to `/signup`. Same states.

> **Onboarding** (post-signup, `/onboarding`): 3-step mini-wizard (country · current status · education) writing `profiles`, sets `onboarding_completed`. Uses `AssessmentShell`-style focus chrome + `OptionCard`/`Select`. Included here as the gate before Dashboard.

### 2.4 Dashboard — `/dashboard`
**Purpose:** home base — latest match, roadmap progress, next action. **Access:** auth · `AppShell`.
**Anatomy:** greeting header ("Welcome back, {name}"). Then, by state:
- **New user (no assessment):** full-width `EmptyState` hero — "Let's find your career. Take the 2-minute assessment." → primary CTA.
- **Returning:**
  - `MatchSummaryCard` — top `career_results` row: `ScoreRing`, title, one-line rationale, CTA "View results".
  - `RoadmapProgressCard` — `Progress` bar, next step title, CTA "Continue".
  - `QuickActionTile` row — Retake assessment · Ask the advisor · Browse resources.
  - Optional: earned `CertificateCard`(s).
**Components:** `AppShell`, `GreetingHeader`, `MatchSummaryCard`, `RoadmapProgressCard`, `QuickActionTile`, `AdvisorLaunchButton`, `EmptyState`.
**States:** loading (`Skeleton` cards) · empty (new user) · error. **Data:** `profiles`, latest `assessments`, `career_results`, `learning_roadmaps` + `progress_tracking`.

### 2.5 Career Assessment — `/assessment`
**Purpose:** collect answers for the AI. **Access:** auth · `AssessmentShell` (focus mode).
**Anatomy:** top `StepProgress` ("Step 3 of 6") + `SaveIndicator` + close-saves-draft. Body = one section per step: **Background · Interests · Goals · Skills · Work style · Constraints** (time/budget/device/internet). Each step renders `QuestionCard`s with mixed inputs: `OptionCard` (single-select), `ChipMultiSelect`, `ScaleInput`, `TextField`/`Textarea`. Sticky `WizardFooterNav` (Back · Next; final = "See my results").
**Components:** `AssessmentShell`, `StepProgress`, `QuestionCard`, `OptionCard`, `ChipMultiSelect`, `ScaleInput`, `TextField`, `SaveIndicator`, `WizardFooterNav`.
**States:** loading (resume draft skeleton) · **autosave** (saving / saved / failed→retry) · validation (inline) · **offline** (`OfflineBanner` — "You're offline, we'll save when you reconnect"; local buffer) · submit (spinner → navigate).
**Data:** writes `assessments` + `assessment_answers` (debounced autosave per step). Final submit → `status=completed` → `POST /api/recommendations/generate` → `/results/[id]`.

### 2.6 Assessment Results — `/results/[id]`
**Purpose:** present the AI recommendation; drive the two CTAs. **Access:** auth · `AppShell`.
**Anatomy:**
1. Header — "Your career matches", date, "Retake" link.
2. **While generating:** `GenerationStream` — streamed "Analyzing your answers…" narrative + cards building in (progress feel, SSE).
3. `RecommendationSummary` — the AI summary paragraph.
4. **3–5 `CareerMatchCard`s** — rank badge ("Top match" on #1), title, `ScoreRing` (match %), rationale, "Strengths you bring" chips, "Gaps to close" chips, local salary range, remote-potential `Badge`, time-to-job-ready. **Two CTAs each:** "Recommend a learning path" (primary) · "Speak with an advisor" (secondary).
5. `ThumbsFeedback` — "Was this helpful?" → `user_feedback`.
**Components:** `AppShell`, `ResultsHeader`, `GenerationStream`, `RecommendationSummary`, `CareerMatchCard`, `ScoreRing`, `ThumbsFeedback`, `AdvisorLaunchButton`.
**States:** generating (stream) · complete · **AI error** (`ErrorState` inline — "We couldn't generate your results. Your answers are saved. Retry.") · empty (no completed assessment → redirect to `/assessment`).
**Data:** `assessments`, `career_results`, `careers`.

### 2.7 Learning Roadmap — `/roadmap/[id]`
**Purpose:** the generated learning plan + step tracking. **Access:** auth · `AppShell`.
**Anatomy:** header — career title, status, overall `Progress` (X of N steps), estimated time. **`RoadmapTimeline`** = vertical stepper of `RoadmapStepCard`s: order number, title, skill `Badge`, description, estimated weeks, attached `ResourceLinkItem`s, `StatusToggle` (not started / in progress / done). Footer: `AdvisorLaunchButton` ("Ask about this path"), "Mark roadmap complete". `CertificateCallout` appears when all steps done.
**Components:** `AppShell`, `RoadmapHeader`, `RoadmapTimeline`, `RoadmapStepCard`, `StatusToggle`, `ResourceLinkItem`, `AdvisorLaunchButton`, `CertificateCallout`.
**States:** generating (stream/skeleton) · complete · empty (not generated → "Generate your learning path" CTA) · error (retry) · **all-complete** (celebration + certificate issued).
**Data:** `learning_roadmaps`, `roadmap_steps`, `progress_tracking`, `roadmap_step_resources`, `resources`, `certificates`. Toggling a step writes `progress_tracking`; completing all → server issues a `certificate`.

### 2.8 Resource Library — `/resources`
**Purpose:** browse/filter curated learning resources. **Access:** auth · `AppShell`.
**Anatomy:** header + `SearchInput`. `FilterBar` (career · type · cost · difficulty). Responsive grid of `ResourceCard` (title, provider, type `Badge`, cost `Badge`, difficulty, tags, external link). `Pagination`/infinite scroll.
**Components:** `AppShell`, `SearchInput`, `FilterBar`, `ResourceCard`, `Badge`, `Pagination`, `EmptyState`.
**States:** loading (skeleton grid) · empty (no matches → "Clear filters" CTA) · error. **Data:** `resources` (+ `careers` for filter).

### 2.9 Progress Tracker — `/progress`
**Purpose:** cross-roadmap overview of learning progress + certificates. **Access:** auth · `AppShell`.
**Anatomy:** `StatTile` row (steps completed · % complete · active roadmaps · certificates earned). `RoadmapProgressRow`(s) with `Progress` → link to roadmap. `ActivityTimeline` (recently completed steps). Certificates section — `CertificateCard` grid (title, career, issued date, verify/download).
**Components:** `AppShell`, `StatTile`, `ProgressOverviewCard`, `RoadmapProgressRow`, `ActivityTimeline`, `CertificateCard`, `EmptyState`.
**States:** loading · empty (nothing started → CTA) · error. **Data:** `learning_roadmaps`, `roadmap_steps`, `progress_tracking`, `certificates`.

### 2.10 Settings — `/settings`
**Purpose:** profile + account management. **Access:** auth · `AppShell`.
**Anatomy:** `Tabs` or stacked `SettingsSection`s:
- **Profile** — `Avatar` (Google), name, country, city, current status, education, field of study, years experience → editable form.
- **Account** — connected Google account + email (read-only).
- **Data & privacy** — "Export my data" (`Button` → `/api/account/export`), "Delete account" (`DangerZone` → `ConfirmDialog`).
- **Sign out.**
**Components:** `AppShell`, `SettingsSection`, `ProfileForm`, `Avatar`, `DangerZone`, `ConfirmDialog`, `Toast`.
**States:** loading (form skeleton) · saving · success (`Toast`) · error · confirm-delete · deleting. **Data:** `profiles`; export/delete endpoints.

### 2.11 Admin Dashboard — `/admin`
**Purpose:** monitor product, AI cost, feedback; manage catalog. **Access:** **admin only** (`is_admin()`; non-admins redirected) · `AdminShell`.
**Anatomy:**
1. **Overview** — `StatTile`s: signups · assessments started/completed · roadmaps · activation rate · AI cost (today / month).
2. **Charts** — `ChartCard`s: funnel, AI cost over time, signups over time (from `admin_*` views).
3. **Feedback** — `admin_feedback_summary` + recent comments `DataTable`.
4. **Catalog** — `CatalogEditor` for `careers` & `resources` (`DataTable` + add/edit `Modal` forms). This is how you refine the AI-seeded catalog.
5. **Users** — read-only `DataTable` (name, role, joined, search).
**Components:** `AdminShell`, `StatTile`, `ChartCard`, `DataTable`, `CatalogEditor`, `Modal`, `Badge`.
**States:** loading (skeleton stats/charts) · empty ("No activity yet") · error · unauthorized (redirect/403).
**Data:** `admin_*` views, `analytics_events`, `ai_events`, `user_feedback`, `careers`, `resources`, `profiles`.

---

## 3. Cross-cutting states

### 3.1 404 — `app/not-found.tsx`
Centered `NotFoundState`: orbit mark, "404", friendly line ("This page isn't on the map."), CTA "Back to dashboard" (auth) / "Go home" (public). Minimal shell.

### 3.2 Loading states — **skeleton-first** (feels faster on slow connections; minimize layout shift)
- **Route-level** `loading.tsx` per segment → `PageSkeleton` matching the target layout.
- **Dashboard/Progress:** skeleton cards / stat tiles.
- **Results & Roadmap generation:** `GenerationStream` — streamed narrative + building skeleton (never a blank screen).
- **Lists (Resources):** skeleton grid.
- **Buttons/forms:** inline `Spinner` + disabled.
- **Auth redirect:** full-screen "Redirecting…".
Primitives: `Skeleton`, `Spinner`, `GenerationStream`, `PageSkeleton`. Rule: show something within ~100ms.

### 3.3 Empty states — one reusable `EmptyState` (icon · headline · subtext · CTA)
| Surface | Message → CTA |
|---|---|
| Dashboard (no assessment) | "Let's find your career." → Start assessment |
| Results (none) | redirect to `/assessment` |
| Roadmap (not generated) | "Turn your match into a plan." → Generate |
| Resources (no matches) | "No resources match." → Clear filters |
| Progress (nothing started) | "Your progress shows here once you start a path." |
| Certificates (none) | "Complete a roadmap to earn your first certificate." |
| Advisor (new chat) | friendly first-message prompt |
| Admin (no data) | "No activity yet." |

### 3.4 Error pages & states
- **Global boundary** `app/error.tsx` — `ErrorState`: "Something went wrong." · "Try again" (reset) · "Back home". Friendly, non-technical.
- **Segment `error.tsx`** for app sections (isolate failures).
- **AI-failure (inline, results/roadmap)** — `ErrorState` with Retry; answers/data are preserved, never lost.
- **Offline** — global `OfflineBanner` ("You're offline. Some features are paused."); assessment keeps buffering locally.
- **Unauthorized (admin)** — redirect to `/dashboard` (or 403 `ErrorState`).
Primitives: `ErrorState`, `OfflineBanner`, inline Retry.

---

## 4. Component inventory (master — reuse, never duplicate)

**Primitives (`components/ui/`):** Logo · Button · GoogleAuthButton · TextField · Textarea · Select · Checkbox · RadioGroup · OptionCard · Chip · ChipMultiSelect · Slider/ScaleInput · Card · Badge · Avatar · Tabs · Progress · ScoreRing · StatTile · Modal/ConfirmDialog · Sheet · DropdownMenu · Tooltip · Toast · Alert/Banner · Skeleton · Spinner · Stepper/StepProgress · SaveIndicator · EmptyState · ErrorState · NotFoundState · OfflineBanner · DataTable · SearchInput · FilterBar · Pagination · ChatBubble · ThumbsFeedback · ChartCard.

**Shells:** MarketingShell · AuthShell · AppShell · AssessmentShell · AdminShell.

**Feature (`components/<feature>/`):** HeroSection · StepCard · FeatureCard · PersonaCard · FAQAccordion · CTABand · AuthCard · CareerCard · MatchSummaryCard · RoadmapProgressCard · QuickActionTile · GreetingHeader · QuestionCard · WizardFooterNav · GenerationStream · RecommendationSummary · CareerMatchCard · ResultsHeader · RoadmapHeader · RoadmapTimeline · RoadmapStepCard · StatusToggle · ResourceLinkItem · ResourceCard · CertificateCard · CertificateCallout · AdvisorLaunchButton · AdvisorChatPanel · ProgressOverviewCard · RoadmapProgressRow · ActivityTimeline · SettingsSection · ProfileForm · DangerZone · CatalogEditor.

---

## 5. Responsive & accessibility
- **Mobile-first.** Bottom nav ≤ 5 items; 44px min tap targets; sticky wizard footer.
- **A11y (WCAG AA):** semantic landmarks, keyboard-navigable, visible focus rings, AA contrast (validate the blue-on-white pair), labelled inputs, `aria-live` on `GenerationStream`/`SaveIndicator`, `prefers-reduced-motion` respected.
- **Performance:** RSC-first, skeleton over spinner, optimized images, minimal client JS.
