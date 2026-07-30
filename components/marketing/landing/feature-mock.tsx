import { LogoMark } from "@/components/ui/logo";

export type FeatureMockKind = "match" | "roadmap" | "coach" | "certificate";

/**
 * Miniature product screens for the "A win for your career" cards.
 *
 * Each one is a fixed 214px-tall white panel with only its top corners rounded.
 * The parent card hangs it past its own bottom edge (negative margin) and clips
 * it, so the screen reads as a real UI continuing below the fold rather than a
 * shrunk-down screenshot. Height is fixed on purpose — the crop line has to land
 * in the same place across all four cards.
 *
 * These are illustrative, not real user data, so every panel carries a SAMPLE
 * tag.
 */
function Screen({ gap, children }: { gap: string; children: React.ReactNode }) {
  return (
    <div
      className={`flex h-[214px] flex-col overflow-hidden rounded-t-[14px] border border-silver bg-white px-3.5 pt-3.5 shadow-[0_14px_30px_rgba(11,15,26,.10)] ${gap}`}
    >
      {children}
    </div>
  );
}

function SampleTag() {
  return (
    <span className="flex-none rounded-full border border-silver px-[7px] py-[5px] font-mono text-[9px] leading-none tracking-[0.14em] text-muted-2">
      SAMPLE
    </span>
  );
}

function MatchMock() {
  return (
    <Screen gap="gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-blue px-2 py-[5px] font-mono text-[9px] leading-none tracking-[0.14em] text-white">
          TOP MATCH
        </span>
        <SampleTag />
      </div>

      <div className="flex items-center gap-3">
        {/* Conic gradient = the 92% fit ring, with a white disc punched out. */}
        <div
          className="grid h-[58px] w-[58px] flex-none place-items-center rounded-full"
          style={{ background: "conic-gradient(#1F33CC 0 92%, #E7EAF1 92% 100%)" }}
        >
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-bold tracking-[-0.02em] text-ink">
            92%
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-[3px]">
          <div className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            Data Analyst
          </div>
          <div className="text-[11px] leading-[1.4] text-muted">
            Fits your maths confidence and the tools you already use.
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full border border-silver bg-paper px-[9px] py-1.5 text-[10px] font-medium leading-none text-ink">
          Spreadsheets
        </span>
        <span className="rounded-full border border-silver bg-paper px-[9px] py-1.5 text-[10px] font-medium leading-none text-ink">
          Patient with detail
        </span>
        <span className="rounded-full border border-blue/20 bg-blue/[0.07] px-[9px] py-1.5 text-[10px] font-medium leading-none text-blue">
          Gap: SQL
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-paper-2 pt-2.5">
        <span className="text-xs font-medium leading-none text-muted">
          Second fit &middot; Product Support
        </span>
        <span className="text-xs font-semibold leading-none text-muted-2">84%</span>
      </div>
    </Screen>
  );
}

function RoadmapMock() {
  const rest = [
    { done: false, label: "Clean and join real data" },
    { done: false, label: "Build your first dashboard" },
  ];

  return (
    <Screen gap="gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] leading-none tracking-[0.14em] text-muted-2">
          DATA ANALYST PATH
        </span>
        <SampleTag />
      </div>

      <div className="flex flex-col gap-[7px]">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold leading-none text-ink">Step 2 of 8</span>
          <span className="text-[11px] leading-none text-muted-2">about 14 weeks left</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-paper-2">
          <div className="h-full w-1/4 rounded-full bg-blue" />
        </div>
      </div>

      <div className="flex flex-col gap-[11px]">
        <div className="flex items-center gap-[9px]">
          <span className="grid h-4 w-4 flex-none place-items-center rounded-full bg-blue text-[9px] font-bold text-white">
            &#10003;
          </span>
          <span className="text-xs leading-tight text-muted-2">Spreadsheet basics</span>
        </div>

        <div className="flex items-center gap-[9px]">
          <span className="h-4 w-4 flex-none rounded-full border-2 border-blue bg-white" />
          <span className="min-w-0 flex-1 truncate text-xs font-semibold leading-tight text-ink">
            SQL fundamentals
          </span>
          <span className="flex-none whitespace-nowrap rounded-full bg-blue/[0.07] px-[7px] py-[5px] font-mono text-[9px] leading-none tracking-[0.1em] text-blue">
            FREE &middot; 3 WK
          </span>
        </div>

        {rest.map((step) => (
          <div key={step.label} className="flex items-center gap-[9px]">
            <span className="h-4 w-4 flex-none rounded-full border-2 border-silver" />
            <span className="text-xs leading-tight text-muted">{step.label}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

function CoachMock() {
  return (
    <Screen gap="gap-2.5">
      <div className="flex items-center justify-between gap-2 border-b border-paper-2 pb-2.5">
        <span className="flex items-center gap-[7px]">
          <span className="h-[7px] w-[7px] flex-none rounded-full bg-blue" />
          <span className="font-mono text-[10px] leading-none tracking-[0.12em] text-ink">
            AI COACH
          </span>
        </span>
        <SampleTag />
      </div>

      <div className="flex flex-col gap-2">
        <div className="max-w-[82%] self-end rounded-[14px] rounded-br-[4px] bg-blue px-[11px] py-[9px] text-[11.5px] leading-[1.45] text-white">
          Is 3 hours a week enough?
        </div>
        <div className="max-w-[88%] self-start rounded-[14px] rounded-bl-[4px] border border-paper-2 bg-paper px-[11px] py-[9px] text-[11.5px] leading-[1.45] text-ink">
          Yes. 3 hours a week finishes SQL in about 4 weeks.
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-silver bg-white px-3 py-[9px]">
        <span className="text-[11.5px] leading-none text-muted-2">
          Ask anything about your path&hellip;
        </span>
        <span className="ml-auto grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-blue text-[11px] font-semibold text-white">
          &uarr;
        </span>
      </div>
    </Screen>
  );
}

function CertificateMock() {
  return (
    <Screen gap="gap-0">
      <div className="flex justify-end">
        <SampleTag />
      </div>
      <div className="mt-2 flex flex-1 flex-col items-center gap-2 rounded-t-[10px] border border-silver bg-[linear-gradient(180deg,#FFFFFF_0%,#F6F7FB_100%)] px-3.5 py-4 text-center">
        <span className="flex text-blue">
          <LogoMark className="h-7 w-7" />
        </span>
        <span className="font-mono text-[8.5px] leading-none tracking-[0.18em] text-muted-2">
          CERTIFICATE OF COMPLETION
        </span>
        <span className="text-[17px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
          Amara Okeke
        </span>
        <span className="text-[11px] leading-[1.4] text-muted">
          Completed the Data Analyst learning roadmap
        </span>
        <span className="mt-0.5 flex flex-col items-center gap-1 font-mono text-[9px] leading-none tracking-[0.12em] text-muted-2">
          <span className="whitespace-nowrap">ISSUED 12 MAR 2026</span>
          <span className="whitespace-nowrap">ID LH-4K92RA</span>
        </span>
      </div>
    </Screen>
  );
}

export function FeatureMock({ kind }: { kind: FeatureMockKind }) {
  switch (kind) {
    case "match":
      return <MatchMock />;
    case "roadmap":
      return <RoadmapMock />;
    case "coach":
      return <CoachMock />;
    case "certificate":
      return <CertificateMock />;
  }
}
