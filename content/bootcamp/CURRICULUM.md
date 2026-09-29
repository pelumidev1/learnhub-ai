# AI Bootcamp curriculum

The source of truth for what the six weeks teach. Settled 2026-09-28 with
Pelumi; it replaces section 5 of `learnhub-launch/learnhub-master-context.md`,
which still describes the August outline (phone first, no Claude Code, no
agents or automation). Where the two disagree, this file wins.

Updated 2026-09-29 to match the cohort 1 brochure
(`learnhub-launch/brochure/brochure.html`), which Pelumi edited that morning.
The brochure is what students are sold, so where it and this file disagree
on what a week covers, match the brochure.

Cohort 1 starts **Monday 12 October 2026**. 35 seats. Live sessions every
Saturday at 11am WAT. Prices live in `lib/bootcamp/pricing.ts` (₦150,000
early-bird until Saturday 10 October, ₦350,000 from Sunday 11 October, or
₦200,000 plus ₦150,000 with the second payment due before week three), not
here.

## Who it is for, and the promise

People who want to use AI to build and earn, not people who want to build AI
models:

- Students and graduates who want skills employers are hiring for now
- Career changers looking for a practical way into tech
- Marketers, founders and freelancers who want AI doing real work for them
- Anyone done with tutorials who wants to build

No coding experience needed. They finish six weeks having built real things
every week, using Claude and ChatGPT far beyond the average user, and
certified only if they did all of the work.

What they walk away with, as the brochure puts it: 7 projects shipped (one a
week plus the final), 1 live product on the internet with an AI agent running
it, 20+ tools set up and used for real work, and 1 certificate earned only by
completing all of the work.

## The ground rules

- **Laptop required.** This is serious work: Claude Code, Supabase, Vercel and
  n8n all need one. Lessons still read well on a phone, so students can study
  on the move and build at the laptop.
- **One paid tool: Claude Pro.** Everything else is taught on a free tier
  first. Where a free tier runs out (video generation credits especially),
  lessons say so plainly and name the cheapest way through.
- **Every week ships something.** No week is only theory.
- **The 20-minute rule still applies.** If a technique cannot be shown in
  under 20 minutes and rebuilt by the student the same day, it does not belong.

## Shape: three arcs and a final project

Each week has its own project. The weeks are paired into two-week arcs, and
the second week of an arc builds on the first. The final project combines all
three arcs into one real thing.

| Arc | Weeks | Theme | Arc outcome |
|---|---|---|---|
| 1 | 1 and 2 | Your AI foundation | A working AI setup, and prompting that gets you the results you want |
| 2 | 3 and 4 | Build and create | A live website or web app, and professional AI-generated videos that companies and individuals will pay you for |
| 3 | 5 and 6 | Automate and earn | Agents and automations working for you, and a career or business plan built on them |
| Final | across 5 and 6, presented end of 6 | Everything | One real product or offer, launched |

## Every week has the same six parts

| Part | What it is | How it is checked |
|---|---|---|
| Lessons | Short video plus written lesson. The written lesson stands on its own | Marked done by the student |
| Live session | Saturdays, 11am WAT: walkthroughs, questions answered, builds reviewed. Recorded, so a missed session can be caught up the same week | Not checked |
| Assignment | One short practical task on the week's lessons | Submitted as a link or screenshot |
| Test | 10 questions on the week's lessons | Auto-marked, 80% to pass (the same mark as roadmap quizzes), retakes unlimited |
| Weekly project | The week's shipped deliverable | Submitted as a link, reviewed and approved or sent back |
| Pod | A small group from the cohort to build alongside, so nobody gets stuck alone | Not checked |

## Certification

A certificate is issued only when **all** of these are true:

1. All six weekly projects approved
2. All assignments submitted
3. All six weekly tests passed
4. The final project approved and presented at demo day

Every certificate has a public verification link, so anyone can check it is
real.

No partial certificates. A student who misses something can still finish the
course, they just do not get certified.

-

## Week 0: before you start (pre-work, the week before 12 October)

Nothing is taught. This week exists so that day one is not lost to sign-ups.

- Laptop check: a working laptop with Chrome and at least 10GB free
- Accounts: Claude (upgrade to Pro), ChatGPT, Google (for Gemini), GitHub
- Join the cohort WhatsApp group and meet your pod
- **Your one sentence:** what you want to build or sell by the end of week six.
  This drives your project choices for the whole bootcamp.

---

## Arc 1: your AI foundation

### Week 1: Set up your AI stack and use it properly

By the end of the week every tool the bootcamp uses is installed and working,
and the student uses Claude and ChatGPT with context rather than one-off
prompts.

| # | Lesson | Status |
|---|---|---|
| 1 | What AI actually is, and how we got here | Written |
| 2 | Claude, ChatGPT and Gemini: what each is best at | Drafted |
| 3 | Setting up Claude properly: Pro, desktop app, Projects, memory | Drafted |
| 4 | ChatGPT, Codex and Gemini: Projects, Gems and when to use which | Drafted |
| 5 | Your builder setup: terminal basics, Claude Code, GitHub, Supabase, Vercel | Drafted |
| 6 | Chat vs agents: the loop, and defining done | Drafted |
| 7 | Your CLAUDE.md and context folder | Drafted |
| 8 | Skills: what you stop typing | Written |
| 9 | Build your first skill | Written |

Lessons 2 to 5 were drafted 2026-09-28, unpublished until Pelumi reads them.
Lessons 6 and 7 were drafted 2026-09-29 and replace "Why prompting stops
working" and "Workflows over prompts", which moved to week 2. Claude Code is an
agent and students use it from this week's project onward, so how agents work,
defining done, CLAUDE.md and a context folder come before weeks 3 and 4 build
with it. The source was Open Residency's "AI Agent Playbook" (episode 37),
taught in Learnhub's own words and checked against Claude Code's docs. Test
questions 4 to 7 moved to week 2 with the two lessons.
Lesson 4 no longer teaches custom GPTs: OpenAI stopped personal accounts
(Free, Go, Plus and Pro) creating new GPTs and retires them on 11 December
2026, moving them to plugins where a GPT's instructions become a skill. It
teaches ChatGPT Projects and a Gemini Gem instead, and points at lessons 8 and
9 as the version that replaces GPTs.
Lesson 2 also names the assistants students will hear about but do not set
up (Perplexity, Meta AI, Copilot, DeepSeek, Grok). Perplexity is taught
properly in week 2 lesson 6.

- **Tools:** Claude, Claude Code, ChatGPT, Codex, Gemini, GitHub, Supabase, Vercel.
- **Assignment:** screenshot of every tool signed in, plus your first skill.
- **Project: your AI workspace.** A Claude Project loaded with your own context
  (who you are, your goal sentence, your work), one skill you built, and a
  one-page "about me" site made with Claude Code and live on Vercel. The live
  site proves the whole builder setup works before week 3 depends on it.

### Week 2: Prompt engineering: writing and marketing with AI

How to prompt any model properly, then the prompts that do real work: your
voice, everyday writing, and marketing. Most AI writing reads like a machine
wrote it, so this week spends as much time editing and on voice as on
generating.

| # | Lesson |
|---|---|
| 1 | How to prompt any AI model: context, roles and constraints |
| 2 | Why prompting stops working (written, moved from week 1) |
| 3 | Workflows over prompts, the six roles (written, moved from week 1) |
| 4 | Teaching AI your voice, so the writing sounds like you (including removing the AI tells readers spot) |
| 5 | Prompts for everyday work: posts, emails, proposals and captions |
| 6 | Prompts for marketing: offers, landing pages and launch copy |
| 7 | Research you can trust: Perplexity, sources and fact-checking |

Lessons 2 and 3 are in `week-2/` already. The week 2 test starts with the four
questions that moved with them (`week-2/work/test.json`) and needs six more.

Lesson 7 is not in the brochure. It was in the old week 2 outline, and week 1
lesson 2 tells students they will use Perplexity properly in week two.
Pelumi to confirm it stays; if it goes, change that line in week 1 lesson 2.

- **Tools:** Claude, ChatGPT, skills.
- **Assignment:** your voice skill, tested on one paragraph.
- **Project: your prompt library and voice.** Your own prompt library, your
  voice skill, and one piece of writing published in your voice. Include the
  offer line and landing copy for the thing you will build in week 3. Grows
  from week 1: written with the workspace and skill you built.

---

## Arc 2: build and create

### Week 3: Build websites and web apps

Claude Code as the main tool. v0 or Lovable as a warm-up for anyone who wants
to see a result before opening the terminal.

| # | Lesson |
|---|---|
| 1 | How a web app works: front end, database, login, hosting, in plain English |
| 2 | From idea to plan: getting Claude to write the plan before the code |
| 3 | Building a website with Claude Code and putting it live on Vercel |
| 4 | Adding a database and sign-in with Supabase |
| 5 | Making it work on all devices, and fixing what breaks |
| 6 | Keeping it safe and watching it: secrets, keys, cybersecurity best practices and monitoring |

- **Assignment:** one change to your week 1 site, made and deployed by you.
- **Tools:** Claude Code, Supabase, Vercel, v0, Lovable.
- **Project: a live product.** A website or web app at a live URL that works
  on all devices, using the landing copy from week 2. Grows from week 2.

### Week 4: Video, UGC and motion graphics with AI

The module people want most. Both faceless and on-camera routes, because
plenty of people will never want to be filmed.

| # | Lesson |
|---|---|
| 1 | Scripting video with AI: hooks, structure, 30 to 60 seconds |
| 2 | Realistic AI video: Veo, Kling and Higgsfield, and which tool is best for what |
| 3 | UGC-style ads: making content that looks like a real customer made it |
| 4 | Voice and avatars: ElevenLabs, and when an avatar helps or hurts |
| 5 | Motion graphics as code: Remotion with Claude Code |
| 6 | Editing videos using agents, and repurposing one long video into many short ones with CapCut |

- **Assignment:** one AI-generated shot that could pass as filmed.
- **Tools:** Veo, Kling, Higgsfield, ElevenLabs, Remotion, CapCut.
- **Project: the launch video.** One UGC-style ad and one motion graphic for the
  product from week 3, both published. Grows from week 3.

---

## Arc 3: automate and earn

### Week 5: Agents and automation

Agents without being a coder: chatbots, a personal operating system, and
automations that run on their own.

| # | Lesson |
|---|---|
| 1 | Agents, chatbots and automations: which one a job needs |
| 2 | No-code agents: Google Opal and Claude Projects as agents |
| 3 | Building an agent in the Claude console |
| 4 | Giving your agent tools: connectors, MCP, and an approval step before anything goes live |
| 5 | A chatbot agent on your website |
| 6 | Your AI operating system: context, skills, tools and memory in one folder |
| 7 | Automation with n8n: triggers, steps, and an AI step in the middle |
| 8 | Zapier and Make: what they are, and when a company will expect them |

Week 1 lessons 6 and 7 now teach the agent loop, defining done, CLAUDE.md and
the context folder, so this week builds on them rather than introducing them.
Lesson 2 no longer names custom GPTs, which OpenAI retires on 11 December
2026 (see week 1 lesson 4).

Automation tool choice (researched 2026-09-28): all three are still in wide
use. Zapier connects the most apps and is the easiest; Make is cheaper for
visual logic; n8n is the strongest for AI agents. n8n is taught in depth;
Zapier and Make get one lesson so students recognise them in job descriptions.

- **Tools:** Claude console, Google Opal, n8n, Zapier, Make.
- **Assignment:** one n8n automation that runs on a schedule.
- **Project: your product, automated.** A chatbot agent live on the week 3
  site, plus one automation that does real work for it (for example, new
  sign-up to welcome email to spreadsheet). Grows from weeks 3 and 4.

### Week 6: Identify your career, industry and business

Turning six weeks of work into a job, clients or a business, starting with
choosing which path to take.

| # | Lesson |
|---|---|
| 1 | Choose your path: AI automation specialist, AI UGC ad creator, AI copywriter, AI web product builder or AI product marketer |
| 2 | Where the demand is: marketing and media, customer service, operations, finance, legal, small businesses |
| 3 | Your CV and LinkedIn, rebuilt around what you built |
| 4 | Finding and applying for jobs with AI, without spamming |
| 5 | Building a business: offer, pricing and first clients |
| 6 | Presenting your work: preparing for demo day |

- **Tools:** Claude, ChatGPT, LinkedIn.
- **Assignment:** your rebuilt CV and LinkedIn headline.
- **Project: your next step.** Either a live offer with a price and one
  outreach sent, or three tailored job applications sent. Grows from all
  earlier weeks: the portfolio is what you built.

---

## Final project: launch one real thing

Started in week 5, presented at demo day at the end of week 6. It pulls the
three arcs into one product or offer:

| From | Piece |
|---|---|
| Arc 1 | Your prompts, voice and copy: the positioning, offer and writing that explain it |
| Arc 2 | Your live product and the AI videos that launch it |
| Arc 3 | Your AI agent and automations that run it, and the offer or job route it leads to |

Presented live at demo day in 5 minutes: what it is, who it is for, a live
demo, and what happens next.

---

## Career paths

The brochure names six roles, each tied to the weeks that build it, plus a
seventh route: your own business.

| Path | What they do | Weeks |
|---|---|---|
| AI Automation Specialist | Builds workflows that save a business hours every week | 1, 5 |
| AI UGC Ad Creator | Makes AI video ads for brands and businesses | 2, 4 |
| AI Copywriter | Writes posts, pages and campaigns with AI, in the client's voice | 2 |
| AI Web Product Builder | Ships websites and web apps for clients | 1, 3 |
| AI Product Marketer | Launches products with AI copy, video and automation | 2, 4, 5 |
| AI Agent Builder | Sets up chatbots and agents for support and sales | 5 |
| Your own business | Package what you built into an offer, price it, find first clients | 6 |

The brochure's line on this, which lessons should keep to: no bootcamp can
promise you a job; this one makes sure you have the work to show for it.

## After the bootcamp

- A portfolio of seven projects to link in applications, pitches and LinkedIn
- The verifiable certificate
- The Learnhub community: the cohort and pods stay together after demo day
- 1:1 mentorship for graduates who want more time and deeper builds

## How the LMS delivers this

Built 2026-09-28. Each week's page at `/learn/<module>/work` shows its
assignment, project and test. Students hand work in as a link; you review it
at `/admin/submissions` and approve it or send it back with a note. The
certificate is issued automatically the moment the rule above is met, and
verifies at `/verify/<code>` like roadmap certificates.

Authoring lives next to the lessons, in `content/bootcamp/week-N/work/`. See
`content/bootcamp/README.md` for the format.
