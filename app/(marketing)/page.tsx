import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { SiteHeader } from "@/components/marketing/site-header";
import { RevealInit } from "@/components/marketing/reveal-init";
import "./landing.css";

export const metadata: Metadata = {
  description:
    "LearnHub AI is the AI career coach for Africa's next generation of tech talent. Take a short assessment, get a personalized career match and learning path, and a 24/7 AI coach. Free while in beta.",
};

/* Small inline glyphs used only on this page (feature rows, mocks, footer). */

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon({ strokeWidth = 2.5 }: { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function FeatItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="feat-item">
      <span className="feat-ico">{icon}</span>
      <div>
        <b>{title}</b>
        <small>{text}</small>
      </div>
    </div>
  );
}

function MatchRow({
  score,
  title,
  note,
  pills,
  top = false,
  dim = false,
}: {
  score: number;
  title: string;
  note: string;
  pills?: string[];
  top?: boolean;
  dim?: boolean;
}) {
  return (
    <div className={`mrow${top ? " top" : ""}${dim ? " dim" : ""}`}>
      <div className="ring" style={{ "--p": score } as React.CSSProperties}>
        <span>{score}%</span>
      </div>
      <div className="mmeta">
        <b>{title}</b>
        <small>{note}</small>
        {pills && (
          <div className="pill">
            {pills.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        )}
      </div>
      <span className="go">View path</span>
    </div>
  );
}

const DOTS: { left: string; top: string; size: number; delay?: string }[] = [
  { left: "6%", top: "20%", size: 14 },
  { left: "16%", top: "55%", size: 26, delay: ".4s" },
  { left: "11%", top: "82%", size: 16, delay: "1s" },
  { left: "26%", top: "12%", size: 18, delay: ".2s" },
  { left: "30%", top: "44%", size: 12, delay: ".7s" },
  { left: "23%", top: "74%", size: 22, delay: "1.3s" },
  { left: "40%", top: "24%", size: 14, delay: ".9s" },
  { left: "44%", top: "64%", size: 30, delay: ".3s" },
  { left: "52%", top: "16%", size: 16, delay: "1.1s" },
  { left: "57%", top: "50%", size: 12, delay: ".5s" },
  { left: "60%", top: "80%", size: 20, delay: "1.5s" },
  { left: "70%", top: "22%", size: 24, delay: ".6s" },
  { left: "74%", top: "60%", size: 14, delay: "1.2s" },
  { left: "84%", top: "30%", size: 18, delay: ".8s" },
  { left: "89%", top: "70%", size: 16, delay: ".1s" },
  { left: "94%", top: "48%", size: 12, delay: "1.4s" },
];

const FACES: { left: string; top: string; size: number; bg: string; fontSize: string; initials: string }[] = [
  { left: "9%", top: "38%", size: 52, bg: "linear-gradient(160deg,#2A46F0,#182AB0)", fontSize: ".9rem", initials: "TA" },
  { left: "34%", top: "78%", size: 46, bg: "linear-gradient(160deg,#3B6FF0,#1F33CC)", fontSize: ".82rem", initials: "MK" },
  { left: "38%", top: "34%", size: 58, bg: "linear-gradient(160deg,#4C93F0,#2A46F0)", fontSize: ".95rem", initials: "JO" },
  { left: "53%", top: "70%", size: 44, bg: "linear-gradient(160deg,#1F33CC,#182AB0)", fontSize: ".8rem", initials: "FE" },
  { left: "64%", top: "38%", size: 54, bg: "linear-gradient(160deg,#2A46F0,#3B6FF0)", fontSize: ".9rem", initials: "CE" },
  { left: "80%", top: "52%", size: 48, bg: "linear-gradient(160deg,#182AB0,#1F33CC)", fontSize: ".85rem", initials: "AO" },
  { left: "78%", top: "16%", size: 44, bg: "linear-gradient(160deg,#3B6FF0,#2A46F0)", fontSize: ".8rem", initials: "KA" },
];

const QUOTES = [
  {
    text: '"I went from \'I should learn tech\' to a clear plan in one sitting. The salary and remote info made it real."',
    initials: "AO",
    name: "Amara O.",
    role: "Graduate · Accra",
    delay: "",
  },
  {
    text: '"It actually asked about my budget and my data. The path it built was all free resources I could start that week."',
    initials: "CE",
    name: "Chidi E.",
    role: "Student · Lagos",
    delay: " d1",
  },
  {
    text: '"I was a teacher. LearnHub mapped a route into data analysis I could actually do around my job."',
    initials: "KA",
    name: "Kwame A.",
    role: "Career changer · Nairobi",
    delay: " d2",
  },
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. LearnHub AI is completely free while we're in beta — the assessment, your career match, your learning path, and the AI coach.",
    open: true,
  },
  {
    q: "How long does the assessment take?",
    a: "About two minutes. Your progress saves as you go, so you can pause and pick up right where you left off.",
  },
  {
    q: "Do I need any experience?",
    a: "None at all. LearnHub is built for students, graduates, and career changers who are just getting started.",
  },
  {
    q: "Is the coach a real person?",
    a: "It's an AI coach, available any time, that already knows your assessment and your plan. Human mentorship is on our roadmap for later.",
  },
  {
    q: "Which careers does it cover?",
    a: "Software engineering, data, design, cybersecurity, cloud and DevOps, product, and more — with new paths added as we grow.",
  },
];

export default function LandingPage() {
  return (
    <div className="lp" id="lp-root">
      <RevealInit rootId="lp-root" />
      <a className="skip" href="#main">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        {/* HERO with robot background */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <Image
              src="/marketing/robot-hero.png"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="hero-badge">
                <b>BETA</b> Free for every learner in Africa
              </span>
              <h1>
                Find the tech career <span className="grad">built for you.</span>
              </h1>
              <p className="lead">
                Answer a short assessment. LearnHub AI matches you to the tech careers that fit,
                maps your learning path, and coaches you the whole way — like an AI mentor who
                actually knows your goals.
              </p>
              <div className="hero-actions">
                <Link href="/signup" className="btn btn-primary btn-lg">
                  Start free assessment
                  <ArrowIcon />
                </Link>
                <a href="#coach" className="btn btn-ghost btn-lg">
                  See the AI coach
                </a>
              </div>
              <div className="hero-meta">
                <span>2-minute assessment</span>
                <span>Free while in beta</span>
                <span>Built for African talent</span>
              </div>
            </div>
          </div>
        </section>

        {/* career strip */}
        <div className="strip">
          <div className="container">
            <p>Match into</p>
            <div className="tags">
              <span className="tag">Software Engineering</span>
              <span className="tag">Data &amp; Analytics</span>
              <span className="tag">Product Design</span>
              <span className="tag">Cybersecurity</span>
              <span className="tag">Cloud / DevOps</span>
              <span className="tag">Product</span>
            </div>
          </div>
        </div>

        {/* PRODUCT: feature demo rows */}
        <section className="section" id="product">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">The product</span>
              <h2>Not a quiz result. A working plan.</h2>
              <p>See exactly what LearnHub does the moment you finish your assessment.</p>
            </div>

            {/* Row 1: Career match */}
            <div className="feature-row">
              <div className="fr-copy reveal">
                <span className="eyebrow">Career match</span>
                <h2>See the careers that actually fit you.</h2>
                <p className="desc">
                  One short assessment turns into a ranked shortlist of tech careers — each matched
                  to your background, interests, and real constraints.
                </p>
                <div className="feat-list">
                  <FeatItem
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 17l6-6 4 4 8-8" />
                        <path d="M17 7h4v4" />
                      </svg>
                    }
                    title="Ranked matches"
                    text="Your top 5 careers, in order of fit."
                  />
                  <FeatItem
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    }
                    title="Clear reasons"
                    text="See why each one fits you — not just a score."
                  />
                  <FeatItem
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    }
                    title="Local salary & remote"
                    text="Grounded in your market, not a US average."
                  />
                </div>
              </div>
              <div className="reveal d1">
                <div className="window">
                  <div className="win-bar">
                    <div className="dots">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>
                    <span className="title">learnhub.ai / your matches</span>
                  </div>
                  <div className="win-body">
                    <MatchRow
                      top
                      score={94}
                      title="Data Analyst"
                      note="Strong logic + you like finding patterns."
                      pills={["$ Entry–Mid", "Remote: High"]}
                    />
                    <MatchRow
                      score={88}
                      title="Frontend Engineer"
                      note="You enjoy building things people use."
                      pills={["$ Entry–Mid", "Remote: High"]}
                    />
                    <MatchRow dim score={81} title="Product Designer" note="Visual thinker with an eye for users." />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Roadmap */}
            <div className="feature-row reverse">
              <div className="fr-copy reveal">
                <span className="eyebrow">Learning path</span>
                <h2>Follow a path, not just a label.</h2>
                <p className="desc">
                  Every match becomes a step-by-step roadmap you can actually follow — the right
                  skills, in order, with free resources and progress you can track.
                </p>
                <div className="feat-list">
                  <FeatItem
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16M4 12h16M4 18h10" />
                      </svg>
                    }
                    title="Step-by-step roadmap"
                    text="Skills in the right order, with time estimates."
                  />
                  <FeatItem
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    }
                    title="Free-first resources"
                    text="Curated for your budget and your bandwidth."
                  />
                  <FeatItem
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                    }
                    title="Track your progress"
                    text="Check off steps and watch the path move."
                  />
                </div>
              </div>
              <div className="reveal d1">
                <div className="window">
                  <div className="win-bar">
                    <div className="dots">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>
                    <span className="title">learnhub.ai / roadmap · data analyst</span>
                  </div>
                  <div className="win-body">
                    <div className="rm-top">
                      <b>Your path to Data Analyst</b>
                      <small>42% complete</small>
                    </div>
                    <div className="rm-prog">
                      <i></i>
                    </div>
                    <div className="step done">
                      <span className="ck">
                        <CheckIcon strokeWidth={3} />
                      </span>
                      <div>
                        <b>Spreadsheets &amp; data thinking</b>
                        <div className="rz">
                          <span>freeCodeCamp</span>
                          <span>2 wks</span>
                        </div>
                      </div>
                      <span className="st">Done</span>
                    </div>
                    <div className="step done">
                      <span className="ck">
                        <CheckIcon strokeWidth={3} />
                      </span>
                      <div>
                        <b>SQL fundamentals</b>
                        <div className="rz">
                          <span>Mode SQL</span>
                          <span>3 wks</span>
                        </div>
                      </div>
                      <span className="st">Done</span>
                    </div>
                    <div className="step now">
                      <span className="ck"></span>
                      <div>
                        <b>Python for data</b>
                        <div className="rz">
                          <span>Kaggle</span>
                          <span>4 wks</span>
                        </div>
                      </div>
                      <span className="st">In progress</span>
                    </div>
                    <div className="step">
                      <span className="ck"></span>
                      <div>
                        <b>Build 2 portfolio projects</b>
                        <small>Turn skills into proof.</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI COACH product highlight / demo */}
        <section className="section demo" id="coach">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Product highlight</span>
              <h2>An AI coach that actually knows your path.</h2>
              <p>
                Not a generic chatbot. Your coach already has your assessment, your match, and your
                roadmap — so every answer is about <em>you</em>.
              </p>
            </div>
            <div className="demo-frame reveal">
              <div className="demo-window">
                <div className="win-bar">
                  <div className="dots">
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                  <span className="title">learnhub.ai / coach</span>
                </div>
                <div className="demo-stage">
                  <div className="demo-app">
                    <b className="dt">Now coaching</b>
                    <h3>Data Analyst · Week 5</h3>
                    <p>
                      You&rsquo;re 42% through your roadmap. Next up: Python for data. Ask anything —
                      your coach answers in the context of your plan.
                    </p>
                    <div className="row">
                      <span className="chip on">My path</span>
                      <span className="chip">Switch career</span>
                      <span className="chip">Find a job</span>
                      <span className="chip">Explain a skill</span>
                    </div>
                  </div>
                  <aside className="chatcard" aria-label="AI coach chat">
                    <div className="ch-head">
                      <span className="ch-ava">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 8V4H8" />
                          <rect x="4" y="8" width="16" height="12" rx="2" />
                          <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
                        </svg>
                      </span>
                      <div>
                        <b>AI Coach</b>
                        <small>Online · knows your plan</small>
                      </div>
                    </div>
                    <div className="ch-body">
                      <div className="bub u">Is data analysis okay if I&rsquo;m not great at math?</div>
                      <div className="bub a">
                        Yes — for the analyst path you matched into, it&rsquo;s mostly logic and
                        spreadsheets, not heavy math. You&rsquo;ve already cleared SQL. Let&rsquo;s
                        start Python next.
                      </div>
                      <div className="typing" aria-label="Coach is typing">
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                    </div>
                    <div className="ch-input">
                      <div>Ask your coach…</div>
                      <button aria-label="Send">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section quotes" id="stories">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Stories</span>
              <h2>From &ldquo;where do I start?&rdquo; to a plan.</h2>
            </div>
            <div className="quote-grid">
              {QUOTES.map((q) => (
                <figure key={q.initials} className={`quote reveal${q.delay}`}>
                  <div className="stars" aria-label="5 out of 5">
                    ★★★★★
                  </div>
                  <blockquote>
                    <p>{q.text}</p>
                  </blockquote>
                  <figcaption className="who">
                    <span className="ava">{q.initials}</span>
                    <span>
                      <b>{q.name}</b>
                      <small>{q.role}</small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Questions</span>
              <h2>Good to know.</h2>
            </div>
            <div className="faq-wrap">
              {FAQS.map((f) => (
                <details key={f.q} className="reveal" open={f.open}>
                  <summary>
                    {f.q}
                    <span className="pm" aria-hidden="true"></span>
                  </summary>
                  <div className="answer">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="section pricing" id="pricing">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Pricing</span>
              <h2>Free while we&rsquo;re in beta.</h2>
              <p>Everything you need to find your path and start moving. No card, no catch.</p>
            </div>
            <div className="plans">
              <div className="plan featured reveal">
                <span className="tag">Beta</span>
                <span className="pname">Learner</span>
                <div className="price">
                  Free <small>/ during beta</small>
                </div>
                <p className="sub">The full LearnHub experience.</p>
                <ul>
                  <li>
                    <CheckIcon />
                    Personalized career assessment
                  </li>
                  <li>
                    <CheckIcon />
                    AI career match with clear reasons
                  </li>
                  <li>
                    <CheckIcon />
                    Step-by-step learning roadmap
                  </li>
                  <li>
                    <CheckIcon />
                    24/7 AI coach &amp; progress tracking
                  </li>
                </ul>
                <Link href="/signup" className="btn btn-primary btn-block btn-lg">
                  Start free
                </Link>
              </div>
              <div className="plan soon reveal d1">
                <span className="pname">Mentorship</span>
                <div className="price">Coming soon</div>
                <p className="sub">For when you want a human in your corner.</p>
                <ul>
                  <li>
                    <CheckIcon />
                    1:1 sessions with real mentors
                  </li>
                  <li>
                    <CheckIcon />
                    Portfolio &amp; interview reviews
                  </li>
                  <li>
                    <CheckIcon />
                    Accountability check-ins
                  </li>
                </ul>
                <span className="btn btn-ghost btn-block btn-lg" aria-disabled="true">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PIN-STYLE FACES CLOSER */}
        <section className="section closer">
          <div className="container">
            <div className="faces reveal" aria-hidden="true">
              {DOTS.map((d, i) => (
                <span
                  key={i}
                  className="dot"
                  style={{ left: d.left, top: d.top, width: d.size, height: d.size, animationDelay: d.delay }}
                ></span>
              ))}
              {FACES.map((f) => (
                <span
                  key={f.initials}
                  className="face"
                  style={{ left: f.left, top: f.top, width: f.size, height: f.size, background: f.bg, fontSize: f.fontSize }}
                >
                  {f.initials}
                </span>
              ))}
            </div>
            <div className="closer-copy reveal">
              <h2>
                LearnHub reads across every tech career path with a single assessment —{" "}
                <b>cutting through the noise to hand you the one that&rsquo;s built for you.</b>
              </h2>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Find your career — free
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-band">
          <div className="container reveal">
            <h2>Ready to find your path in tech?</h2>
            <p>Take the free 2-minute assessment and meet the career built for you.</p>
            <Link href="/signup" className="btn btn-white btn-lg">
              Start free assessment
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="foot-grid">
            <div className="foot-brand">
              <Logo />
              <p>The AI career coach for Africa&rsquo;s next generation of tech talent.</p>
            </div>
            <div className="foot-col">
              <h4>Product</h4>
              <a href="#product">Features</a>
              <a href="#coach">AI Coach</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="foot-col">
              <h4>Company</h4>
              <a href="#stories">Stories</a>
              <a href="#faq">FAQ</a>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <div className="foot-col">
              <h4>Get started</h4>
              <Link href="/signup">Create your account</Link>
              <Link href="/login">Log in</Link>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 LearnHub AI. All rights reserved.</span>
            <div className="socials">
              <a href="#" aria-label="X">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.3 22H2l7.7-8.8L1.4 2H8l4.7 6.2L18.9 2Zm-2.3 18h1.8L7.5 3.9H5.6L16.6 20Z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.2 8.65 21 10.6 21 13.3V21h-4v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V21H9V9Z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
