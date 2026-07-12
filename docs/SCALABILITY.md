# LearnHub AI — Scalability Audit & Fixes

_Audited 2026-07-12 against the full codebase. Every issue below was either fixed in this pass (with the fix noted) or consciously deferred with the threshold that should trigger it. Companion to [PRODUCT_AUDIT.md](PRODUCT_AUDIT.md) and [ARCHITECTURE.md](ARCHITECTURE.md)._

## The short version

The architecture was already right for scale in the ways that matter most: AI output is persisted and never regenerated, rate limits live in the database (so they survive serverless cold starts), every table is indexed for its access pattern, and pages are server-rendered with small client bundles. What would have hurt at scale was a layer below that: **how the database evaluates security policies, how many network round-trips each request makes, and two race conditions that could double AI spend.** All of those are now fixed. One fix needs a one-time action from you — see "What you need to do" at the bottom.

---

## 1. Issues found and fixed

### 1.1 Database security policies re-ran for every row (the big one)

**What was wrong:** Every Row Level Security policy called `auth.uid()` (and often `is_admin()`, which itself queries the profiles table) directly. Postgres re-evaluates a bare function call **once per row scanned**. Reading a chat history of 5,000 messages meant 5,000 `auth.uid()` calls and up to 5,000 profile lookups — per query. At beta size nobody notices; at thousands of users the database spends most of its time re-checking the same answer. This is the #1 finding the Supabase performance advisor raises (`auth_rls_initplan`).

**The fix:** [supabase/migrations/20260712100000_scale_rls_initplan.sql](../supabase/migrations/20260712100000_scale_rls_initplan.sql) recreates all 45 policies with each call wrapped as `(select auth.uid())`, which Postgres evaluates **once per query**. Behavior is byte-for-byte identical; only the query plan changes. Also appended to `demo-setup.sql` so fresh projects get it automatically. **You must apply this to the live database — steps below.**

### 1.2 Two auth round-trips (or three) on every request

**What was wrong:** `middleware.ts` calls Supabase Auth over the network to validate the session — correct for pages, but it also ran on `/api/advisor`, which does its own auth check. Every chat message paid for two auth round-trips. Separately, the app layout *and* the page each called `getUser()` on every navigation — two more network calls where one suffices. Supabase Auth has its own rate limits; at scale this doubles or triples your auth traffic for zero benefit, and every extra round-trip is felt hardest by your users on slow connections.

**The fix:** the middleware matcher now excludes `/api` ([middleware.ts](../middleware.ts) — route handlers authenticate themselves and can refresh the session cookie on their own). And [lib/supabase/server.ts](../lib/supabase/server.ts) now exports `getAuthUser()`, wrapped in React's `cache()` so the layout and page share **one** auth call per request. All ten authenticated pages use it.

### 1.3 Advisor chat did up to 8 database round-trips, one after another

**What was wrong:** before the coach could stream its first word, the API route ran ~8 Supabase queries **sequentially** — resolve conversation, load history, save the message, then five more to build the coach's context. Each query is a network hop between Vercel and Supabase. That's slow time-to-first-token for the user and longer (more expensive) function execution for you, multiplied by every message of every chat.

**The fix:** [app/api/advisor/route.ts](../app/api/advisor/route.ts) now runs independent queries in parallel (`Promise.all`) — context loading runs alongside conversation resolution, and the context's own five queries collapsed into two parallel stages. The critical path dropped from ~8 sequential round-trips to ~5 stages, without changing any guarantee (the user's message is still saved before streaming starts).

### 1.4 The careers catalog could silently break prompt caching

**What was wrong:** the recommendation flow sends the careers catalog to Claude as part of a prompt-cached prefix — the whole point being that all users share one cached copy. But the catalog query had **no `ORDER BY`**, and Postgres does not guarantee row order without one. The day the order shifted, the prefix bytes would change, every call would miss the cache, and every recommendation would bill full input tokens — invisibly.

**The fix:** the query in [app/(app)/results/actions.ts](../app/(app)/results/actions.ts) now orders by `slug`, making the cached prefix stable across calls and users.

### 1.5 Double-clicks could buy the same AI output twice

**What was wrong:** both AI flows checked "does this already exist?" before generating — but two simultaneous requests (a double-click, a retry racing a slow response) could both pass the check and both call Opus. For recommendations the database's unique constraint made the loser show an error; for roadmaps there was **no constraint at all**, so the user got duplicate roadmaps and you paid twice.

**The fix:** the migration adds a unique index (`one roadmap per career match`), and both actions now treat the "duplicate" database error (23505) as success — the loser quietly reuses the winner's result instead of erroring. AI-spend races are now capped at worst-case one wasted call, and the data can never duplicate.

### 1.6 AI cost and latency were never recorded

**What was wrong:** `ai_events` has `cost_usd` and `latency_ms` columns, but nothing wrote them. CLAUDE.md makes cost logging a hard requirement, and the PRD calls cost-per-user the primary sustainability KPI — you can't manage spend you can't see, and at scale "watching the Anthropic bill" is too late. (This was known gap #4 in the product audit.)

**The fix:** [lib/ai/config.ts](../lib/ai/config.ts) now holds the per-model pricing table (Opus 4.8: $5/$25 per million input/output tokens; Haiku 4.5: $1/$5) next to the model IDs, and all three call sites (recommendation, roadmap, advisor) log estimated cost and wall-clock latency on every call. Cost logging also moved to *before* persistence, so a failed save can no longer hide a paid API call. The `admin_ai_cost_daily` view in the database now actually shows dollars.

---

## 2. Checked and confirmed healthy (no action)

- **Persist-don't-regenerate** — revisiting results/roadmaps is a DB read, never an AI call. Verified in all three flows.
- **Rate limiting** — DB-backed (counts `ai_events` rows), so it holds across serverless instances and cold starts. An in-memory counter here would have been the classic serverless mistake; this codebase already avoided it.
- **Database indexes** — every foreign key and access pattern is covered, including composite indexes on the hot paths (`ai_events (user_id, created_at)` backs the rate limiter).
- **Chat context** — capped at the last 20 turns per AI call and 50 displayed, so long conversations can't inflate token costs or payloads.
- **Client bundles** — RSC-first, ~103–113 kB first load, hero image via `next/image`. Right for the audience's phones and data plans.
- **Streaming** — recommendation/roadmap stream server-side; advisor streams SSE to the browser.

---

## 3. Deferred — with the threshold that should trigger action

| Watch item | Fine until | Then do |
|---|---|---|
| **Resource library** sends every active resource to the phone and filters client-side | ~100–150 resources (22 today) | Move search/filter server-side with pagination |
| **`ai_events`, `analytics_events`, `messages` grow forever** | Millions of rows (years away at beta scale) | Add a retention/archive policy (e.g. roll analytics older than 12 months into monthly summaries) |
| **Supabase free tier** — connection and auth limits | Real launch traffic | Upgrade to Pro; also confirm your **Vercel function region matches your Supabase project region** in the Vercel dashboard — mismatched regions add ~100–300ms to every query and would dwarf every code fix in this document |
| **Assessment autosave** re-upserts all answers each step | Assessments stay ~6 steps | Only send changed answers if the wizard ever grows much longer |

---

## 4. What you need to do (one time, ~2 minutes)

The code fixes deploy with the next push. The **database fix needs you** because it changes the live Supabase project:

1. Open your Supabase dashboard → your LearnHub project → **SQL Editor**.
2. Open the file `supabase/migrations/20260712100000_scale_rls_initplan.sql` from this repo, copy **all** of it.
3. Paste into the SQL Editor and click **Run**. It should finish in a second or two with "Success".

That's it — it's safe to run more than once, and it changes no data, only how the database evaluates the security rules it already has.

_Verified 2026-07-12: `npx tsc --noEmit` and `npx next build` pass with all changes; see PRODUCT_AUDIT.md for the standing verification gates._
