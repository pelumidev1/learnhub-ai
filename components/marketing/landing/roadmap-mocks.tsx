import { LogoMark } from "@/components/ui/logo";
import { tool } from "./tools";
import { ToolMark } from "./tools-strip";

/**
 * The three product pictures beside the roadmap's arcs, one per arc. Markup,
 * not screenshots: sharp, a few KB, and tied to the curriculum rather than to a
 * screen that will change.
 *
 * Children of `.lh-stagger` rise in one after another when their row is
 * revealed (see Reveal and .lh-stagger in app/brand.css). Every one of these is
 * a picture, so each is aria-hidden; the card beside it carries the words.
 */

const card =
  "rounded-2xl border border-white/80 bg-white shadow-[0_1px_2px_rgba(11,15,26,.05),0_12px_32px_-10px_rgba(11,15,26,.18)]";

function Tick() {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue text-white">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 5 5L20 7" />
      </svg>
    </span>
  );
}

/** Arc 1, weeks 1 and 2: the setup from week 1 lesson 5, and the voice skill. */
export function FoundationMock() {
  const setup = ["Claude", "ChatGPT", "GitHub", "Supabase", "Vercel"];
  return (
    <div className="mx-auto w-full max-w-[330px]" aria-hidden>
      <div className={`${card} p-4`}>
        <div className="flex items-center gap-2.5 border-b border-silver pb-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue text-white">
            <LogoMark className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-ink">Your AI setup</p>
            <p className="text-[11px] text-muted">Week 1</p>
          </div>
        </div>
        <ul className="lh-stagger mt-3 space-y-2">
          {setup.map((name) => (
            <li key={name} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5">
              <ToolMark tool={tool(name)} className="h-4 w-4 text-ink" />
              <span className="flex-1 text-[13px] font-medium text-ink">{name}</span>
              <Tick />
            </li>
          ))}
        </ul>
      </div>
      <div className={`${card} -mt-3 ml-auto w-[78%] translate-x-4 px-3.5 py-3`}>
        <p className="font-mono text-[11px] text-blue">my-voice.skill</p>
        <p className="mt-1 text-[12px] leading-snug text-muted">Plain words, short sentences, your tone.</p>
      </div>
    </div>
  );
}

/** Arc 2, weeks 3 and 4: a site live on Vercel, and the video that launches it. */
export function BuildMock() {
  return (
    <div className="mx-auto w-full max-w-[360px]" aria-hidden>
      <div className={`${card} overflow-hidden`}>
        <div className="flex items-center gap-2 border-b border-silver bg-paper px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-silver-2" />
          <span className="h-2 w-2 rounded-full bg-silver-2" />
          <span className="h-2 w-2 rounded-full bg-silver-2" />
          <span className="mx-auto rounded-full bg-white px-3 py-0.5 font-mono text-[10px] text-muted-2">yourproject.vercel.app</span>
        </div>
        <div className="lh-stagger space-y-2.5 p-4">
          <div className="h-3 w-2/3 rounded-full bg-ink/85" />
          <div className="h-2 w-full rounded-full bg-silver" />
          <div className="h-2 w-4/5 rounded-full bg-silver" />
          <div className="flex gap-2 pt-1">
            <div className="h-6 w-20 rounded-full bg-blue" />
            <div className="h-6 w-16 rounded-full border border-silver-2" />
          </div>
        </div>
      </div>

      <div className={`${card} -mt-2 ml-6 flex items-center gap-2.5 px-3.5 py-2.5`}>
        <ToolMark tool={tool("Vercel")} className="h-3.5 w-3.5 text-ink" />
        <span className="flex-1 text-[12.5px] font-semibold text-ink">Live on Vercel</span>
        <Tick />
      </div>

      {/* Week 4: the launch video, as an editor's timeline. */}
      <div className={`${card} mt-3 p-3.5`}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-ink">launch-video.mp4</span>
          <span className="font-mono text-[10px] text-muted-2">Week 4</span>
        </div>
        <div className="relative mt-3 flex h-8 gap-1">
          <div className="w-[28%] rounded-md bg-blue" />
          <div className="w-[18%] rounded-md bg-sky" />
          <div className="w-[34%] rounded-md bg-blue-500" />
          <div className="flex-1 rounded-md bg-sky-2" />
          <span className="absolute -top-1 bottom-[-4px] left-[46%] w-0.5 rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

/** Arc 3, weeks 5 and 6: an n8n automation with an AI step, and demo day. */
export function AutomateMock() {
  const steps = [
    { label: "New enquiry", sub: "Form on your site" },
    { label: "Draft a reply", sub: "AI step", ai: true },
    { label: "Send email", sub: "To the customer" },
  ];
  return (
    <div className="mx-auto w-full max-w-[330px]" aria-hidden>
      <div className={`${card} p-4`}>
        <div className="flex items-center gap-2">
          <ToolMark tool={tool("n8n")} className="h-4 w-4 text-ink" />
          <span className="text-[13px] font-semibold text-ink">Reply to enquiries</span>
          <span className="ml-auto rounded-full bg-paper-2 px-2 py-0.5 text-[10px] font-bold text-blue">Active</span>
        </div>
        <ol className="lh-stagger mt-4">
          {steps.map((s, i) => (
            <li key={s.label} className="relative pl-10 pb-4 last:pb-0">
              {i < steps.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-silver-2" />}
              <span
                className={`absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-lg text-[11px] font-bold ${
                  s.ai ? "bg-blue text-white" : "border border-silver bg-paper text-ink"
                }`}
              >
                {s.ai ? <LogoMark className="h-4 w-4" /> : i + 1}
              </span>
              <p className="text-[13px] font-semibold text-ink">{s.label}</p>
              <p className="text-[11.5px] text-muted">{s.sub}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className={`${card} -mt-2 ml-auto w-[80%] translate-x-4 px-3.5 py-3`}>
        <p className="text-[12.5px] font-semibold text-ink">Demo day</p>
        <p className="mt-0.5 text-[11.5px] text-muted">Your final project, presented live</p>
      </div>
    </div>
  );
}
