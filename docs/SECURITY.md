# LearnHub AI — Security Audit & Fixes

_Audited 2026-07-12 against the full codebase (commit `012a1f3`). Every issue below was fixed in this pass; the required owner actions were completed the same day, so **nothing is pending**. Companion to [SCALABILITY.md](SCALABILITY.md), [PRODUCT_AUDIT.md](PRODUCT_AUDIT.md), and [ARCHITECTURE.md](ARCHITECTURE.md)._

## The short version

The fundamentals were already right: the Anthropic key never leaves the server, every user table has Row Level Security, AI output is Zod-validated before it's stored, and no secrets are committed to git. What the audit found sat one layer down: **one critical database hole (any signed-in user could quietly make themselves admin), two high-risk web vulnerabilities (auth links that could bounce users to an attacker's site, and AI-generated links that weren't scheme-checked), and a set of hardening gaps.** All fixed. The database migration was applied to the live project and the production URL setting was filled in on 2026-07-12.

---

## 1. Issues found and fixed

### 1.1 Any signed-in user could make themselves admin (critical)

**What was wrong:** the init migration granted `UPDATE` on *every column* of every table to signed-in users, and the RLS policy on `profiles` only checks that you're editing your own row — not *which columns* you change. `profiles.role` is what `is_admin()` reads, and every "or is_admin()" policy grants read access to all users' data. Net effect: anyone could call the Supabase REST API directly and set `role='admin'` on themselves, then read every user's assessments, chats, and results plus the admin analytics views.

**The fix:** [supabase/migrations/20260712120000_security_hardening.sql](../supabase/migrations/20260712120000_security_hardening.sql) replaces the table-wide UPDATE grant on `profiles` with a column list that excludes `role` — only the server (service role) can change it. Also appended to `demo-setup.sql`. **Applied to the live database by the owner, 2026-07-12.**

### 1.2 Shareable results URLs let attackers poison other people's data

**What was wrong:** `assessment_answers` and `career_results` inserts only checked "the row is stamped with your own user id" — not that the assessment they attach to is yours. Assessment ids appear in shareable `/results/[id]` URLs, so anyone who saw one could insert rows against that assessment, colliding with its unique keys and permanently breaking the owner's autosave and results generation.

**The fix:** same migration — inserting into either table now also requires owning the parent assessment. Other child tables don't need this: their parent ids never appear in URLs, and existing unique keys already prevent foreign rows from colliding.

### 1.3 Auth links could bounce users to an attacker's site (open redirect)

**What was wrong:** the `?next=` parameter on `/auth/callback` and `/auth/confirm` (the routes email links and Google OAuth land on) was appended to the site origin unvalidated — `?next=@evil.com` becomes `https://site.com@evil.com`, which browsers read as **evil.com**. The login form's `redirect` field accepted `//evil.com` the same way. A crafted but genuine-looking LearnHub link could complete a real sign-in and then land the person on a phishing page.

**The fix:** [lib/utils/redirect.ts](../lib/utils/redirect.ts) — `safeInternalPath()` only accepts same-site relative paths (rejects `//…`, `@…`, absolute URLs, backslash variants) and falls back to `/dashboard`. Used in both auth routes and the sign-in action.

### 1.4 AI-generated links weren't scheme-checked (stored-XSS risk)

**What was wrong:** roadmap steps carry resource links produced by the model, validated only as "any string" and rendered as clickable `<a href>`. A prompt-injected `javascript:` URL (a user can steer the model through their assessment answers) would have been stored and executed on click — persistent XSS.

**The fix:** the Zod gate in [lib/ai/roadmap.ts](../lib/ai/roadmap.ts) now drops any non-http(s) link (dropping, not failing — one bad link shouldn't waste a paid Opus call), and [components/roadmap/step-item.tsx](../components/roadmap/step-item.tsx) filters again at render time to cover roadmaps stored before this fix.

### 1.5 Password-reset emails trusted a spoofable header

**What was wrong:** the address embedded in Supabase auth emails (password reset, signup confirm) was built from the request's `Origin` header — which the sender controls — before falling back to `NEXT_PUBLIC_SITE_URL`. A forged request could get a reset email sent whose link points at an attacker's host (Supabase's redirect allow-list was the only backstop).

**The fix:** [app/(auth)/actions.ts](<../app/(auth)/actions.ts>) `siteOrigin()` now prefers `NEXT_PUBLIC_SITE_URL` and only falls back to the header when it's unset (local dev, preview deploys). **The production value was empty in Vercel; set to `https://learnhub-ai-alpha.vercel.app` and redeployed, 2026-07-12.**

### 1.6 No browser security headers

**What was wrong:** responses carried no `X-Content-Type-Options`, no framing protection (clickjacking), no referrer or permissions policy.

**The fix:** [next.config.mjs](../next.config.mjs) now sends `nosniff`, `X-Frame-Options: DENY` + `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`, and a minimal `Permissions-Policy` on every route. Verified live against a production build.

### 1.7 Server actions accepted unvalidated input

**What was wrong:** CLAUDE.md and the PRD require Zod at every boundary, but the assessment autosave accepted arbitrary unbounded JSON under any key, and four actions took raw string ids straight into queries.

**The fix:** [app/(app)/assessment/actions.ts](<../app/(app)/assessment/actions.ts>) accepts only known question keys with bounded values (strings ≤500 chars, arrays ≤20 items); every action-taking id (`assessmentId`, `careerResultId`, `stepId`, `resourceId`) is UUID-validated before any query runs.

### 1.8 Raw error internals reached the UI

**What was wrong:** failed AI or database calls returned `e.message` to the user — Anthropic API details, Postgres constraint names — and the roadmap flow even put them in the URL.

**The fix:** users now see plain, friendly copy ("Something went wrong generating your results. Please try again."); the real errors go to server logs (`console.error`, visible in Vercel → Logs).

### 1.9 Demo mode had no production guard

**What was wrong:** `AI_DEMO_MODE=true` in the production environment would have silently served canned sample output to real users.

**The fix:** [lib/ai/config.ts](../lib/ai/config.ts) ignores the flag when `VERCEL_ENV === "production"` — local dev and preview deploys still work. (Audited the live values: production already had it off; this is a permanent safety net.)

---

## 2. Checked and confirmed healthy (no action)

- **Anthropic key** — server-only (`server-only` imports, no `NEXT_PUBLIC_`, all calls in route handlers/server actions).
- **RLS** — enabled on all 18 user tables with owner-scoped policies; admin analytics views run `security_invoker` so they respect RLS.
- **AI output** — Zod-validated before persisting in all three flows (including demo mode).
- **XSS surface** — all user/AI content renders as plain React text (auto-escaped); no `dangerouslySetInnerHTML` anywhere in the codebase.
- **Secrets in git** — scanned history and tracked files for key material: clean. `.env*.local` ignored.
- **Rate limiting** — DB-backed per-user caps on all three AI flows.
- **Next.js 15.5.20** — well past the 2025 middleware-bypass CVE (fixed in 15.2.3).
- **`npm audit`** — one moderate advisory against the postcss copy bundled *inside* Next (build-time only, not reachable at runtime). Do **not** run `npm audit fix --force` — it would downgrade Next to v9. Revisit at the next Next.js upgrade.

---

## 3. When the owner buys a custom domain (future)

1. Vercel → learnhub-ai → Settings → Environment Variables → change `NEXT_PUBLIC_SITE_URL` (Production) to the new `https://` address.
2. Supabase → Authentication → URL Configuration → set Site URL / add the domain to the redirect list.
3. Redeploy.
