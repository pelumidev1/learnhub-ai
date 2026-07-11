# Pillar 1 — The Product: What LearnHub AI Is

_Audience note: LinkedIn post is written for non-technical readers (learners, career changers). The X thread leans slightly technical. The Substack serves both. Publish once the deployed link is live; until then, end with "beta opening soon — follow along."_

---

## LinkedIn post

"Which tech career should I choose?"

I've been asked this question hundreds of times since starting Learnhub. And the honest answer was always: it depends — on your background, your interests, your budget, your device, your internet, your city.

Generic advice fails because it ignores all of that. So I built something that doesn't.

LearnHub AI is an AI career coach for Africans entering tech. Here's the whole product in four steps:

1. You answer a short assessment — about 2 minutes. Your background, interests, constraints (yes, including your budget and your data situation).
2. AI reasons over your answers and gives you 3–5 tech careers ranked by fit — with WHY each one fits *you*, realistic local salary ranges, remote-work potential, and an honest time-to-job-ready. Not a quiz score. A reasoned recommendation.
3. Every match becomes a step-by-step learning roadmap — the right skills in order, built around free resources that work on a phone.
4. An AI coach that already knows your assessment, your match, and your next step answers your questions 24/7. It's labeled as AI, because it is — no pretending.

It's free while in beta. Built mobile-first, for metered connections, because that's the reality of the people it serves.

The beta opens soon. If you know someone stuck at "I want to get into tech but I don't know where to start" — this is for them. Follow along; I'm building this in public.

**Takeaway even if you never use it:** career advice is only useful when it accounts for your constraints. Ask any mentor about your budget, your hours, and your market — not just your interests.

---

## Substack article (~750 words)

### Title: "Not a Quiz Result. A Working Plan."

**Subtitle:** What LearnHub AI is, who it's for, and why the AI part actually matters.

Every week, somewhere in a WhatsApp group or a LinkedIn DM, the same question appears: *"I want to get into tech. Where do I start?"*

The people asking aren't lazy. They're drowning in conflicting advice. Learn to code. No, learn data. No, cybersecurity pays more. Do this bootcamp. That one's a scam. Six months. Two years. It depends.

It always "depends" — and that's precisely the problem. What it depends on is *you*: your background, what you enjoy, how many hours you actually have, whether you're on a laptop or a mid-range Android phone, whether your internet is unlimited or metered by the gigabyte, and what jobs actually pay in Lagos or Nairobi or Accra — not San Francisco.

Generic advice can't hold all those variables at once. A person who knows you well can. And, it turns out, so can a well-instructed AI.

**What LearnHub AI does**

LearnHub AI is an AI career coach built for Africans entering tech. The loop is deliberately simple:

*The assessment.* Two minutes, six steps. Not a personality quiz — a structured picture of your background, interests, and real constraints. Your progress saves on every step, because connections drop, and losing your answers to a network blip is the kind of small cruelty software shouldn't commit.

*The recommendation.* The AI reasons over your answers against a curated catalog of tech careers and returns 3–5 ranked matches. Each one comes with the reasoning — why this career fits *you*, which strengths you already bring, which gaps you'd need to close — plus a local salary range in your market's currency, remote-work potential, and an honest time-to-job-ready. If the honest answer is "12–18 months," it says so.

*The roadmap.* A career label without a path is just a new way to feel lost. So every match converts into an ordered, step-by-step roadmap — foundations first, job-ready last — built preferentially from free resources that work on a phone and survive low bandwidth. You tick off steps; finishing earns you a certificate.

*The coach.* Questions don't arrive on a schedule, so there's an AI coach available 24/7 that already knows your match and where you are on your path. Ask "is this step worth my time?" or "how do I explain this project in an interview?" and it answers for your situation, not in general. It's labeled as an AI — always. No fake humans here.

**Why AI makes this different**

Career tests have existed forever. What they produce is a *category*. What a person actually needs is a *plan* — and plans require reasoning over messy, individual context. That's what modern AI is genuinely good at, and it's why this product couldn't have existed — at this cost, for a free product — even three years ago.

Two engineering choices matter here, and I'll be writing about both in detail: every AI answer is validated against a strict schema before it's ever saved (an AI product that stores malformed output is a time bomb), and nothing is ever generated twice when a database read will do (that's how a free product survives its own AI bill).

**Who it's for**

Students choosing a direction. Graduates told to "learn tech" with no map. Career changers — teachers, bankers, accountants — who need a path that fits around a full-time job. Mostly 18–35, mostly on Android, entirely deserving of advice that takes their reality seriously.

It's free while in beta. The beta opens soon — subscribe and you'll be first to know.

**The takeaway:** whether or not you ever use LearnHub AI, hold your career advice to this standard: if it doesn't account for your money, your hours, your device, and your market, it isn't advice. It's content.

---

## X thread

1/ "I want to get into tech but I don't know where to start."

I've heard this question for over a year. I finally built the answer I wish I could have given everyone: an AI career coach for Africans entering tech.

Here's how it works 🧵

2/ Step 1: A 2-minute assessment.

Background, interests, constraints. Including the ones generic advice ignores: your budget, your hours, your device, your bandwidth.

Answers autosave every step — built for networks that drop.

3/ Step 2: AI reasoning, not a quiz score.

You get 3–5 careers ranked by fit. Each with:
- WHY it fits you specifically
- strengths you already have
- gaps to close
- local salary range (₦/KSh/GH₵/R — your market, not Silicon Valley)
- honest time-to-job-ready

4/ Step 3: A roadmap, not a label.

Every match becomes ordered steps: foundations → job-ready. Free-first resources that work on a phone. Tick off steps, earn a certificate at the end.

5/ Step 4: A coach that knows your file.

24/7 AI coach preloaded with your match + your next step. Ask it anything about YOUR path. Clearly labeled as AI — we don't pretend it's a person.

6/ Under the hood (for the builders):

- Next.js RSC + Supabase w/ row-level security
- Claude Opus 4.8 for reasoning, Haiku 4.5 for chat
- every AI output Zod-validated before it persists
- results cached in Postgres — never regenerate what you can read

7/ Cost discipline is a feature. It's a free product, so:

- prompt caching on the shared career catalog
- per-user rate limits enforced in the DB (not in-memory — serverless resets those)
- persisted results = revisits cost $0

8/ Built mobile-first for mid-tier Androids on metered data. Streaming responses so nobody stares at a blank screen. That's not a nice-to-have — that's the actual user.

9/ Free while in beta. Opening soon — the first cohort is small.

Follow if you want the build-in-public journey; I'm documenting everything, including the mistakes.

What would YOU ask an AI career coach first?
