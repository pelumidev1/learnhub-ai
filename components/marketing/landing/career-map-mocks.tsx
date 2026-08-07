/**
 * The eight tiles on the career map: one miniature product screen per path,
 * in place of the blue icon tiles that were there before.
 *
 * An icon says "data" twice — once in the glyph, once in the label under it.
 * A screen says what the work looks like: a chart being read, a canvas being
 * pushed around, a pipeline going green. Same footprint, more signal.
 *
 * Every mock is sized in `cqw`, and each tile declares `container-type: size`,
 * so one component draws correctly at 68px on a phone and 124px on a laptop
 * with no breakpoints of its own. Nothing here is text — at this size type is
 * noise — so the mocks are pure shape, and the path's real name lives in the
 * label and the button's aria-label. All of it is decorative: `aria-hidden`
 * sits on the mock, never on the button.
 *
 * One accent only. Grey carries the structure; blue marks the one thing the
 * screen is about.
 */

/** Chrome + ground. The header strip is what makes a rectangle read as a screen. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-full w-full flex-col overflow-hidden rounded-[11cqw] border border-silver bg-white">
      <span className="flex flex-none items-center gap-[3cqw] border-b border-silver bg-paper px-[6cqw] py-[4cqw]">
        <span
          className="block flex-none rounded-full bg-silver-2"
          style={{ width: "3.6cqw", height: "3.6cqw" }}
        />
        <span
          className="block rounded-full bg-silver-2"
          style={{ width: "20cqw", height: "2.8cqw" }}
        />
      </span>
      <span className="flex min-h-0 flex-1 flex-col justify-center p-[7cqw]">{children}</span>
    </span>
  );
}

/** Data analytics — four bars, the one you are reading in blue. */
export function ChartMock() {
  return (
    <Frame>
      <span className="flex h-full items-end gap-[4.5cqw]">
        {[46, 70, 34, 92].map((h, i) => (
          <span
            key={h}
            className={`block flex-1 rounded-[1.5cqw] ${i === 3 ? "bg-blue" : "bg-silver-2"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </span>
    </Frame>
  );
}

/** Product design — an object selected on a canvas, handles and all. */
export function CanvasMock() {
  return (
    <Frame>
      <span className="relative block h-full w-full rounded-[3cqw] bg-paper">
        <span
          className="absolute rounded-[2.5cqw] border-[1.6cqw] border-blue bg-white"
          style={{ left: "16%", top: "14%", right: "20%", bottom: "22%" }}
        />
        {/* Two opposite handles read as a selection; four would be mush at 68px. */}
        {[
          { left: "16%", top: "14%" },
          { right: "20%", bottom: "22%" },
        ].map((pos, i) => (
          <span
            key={i}
            className="absolute rounded-[0.8cqw] bg-blue"
            style={{ width: "5cqw", height: "5cqw", ...pos, transform: "translate(-40%, -40%)" }}
          />
        ))}
      </span>
    </Frame>
  );
}

/** Software engineering — indented lines with the cursor's line live. */
export function CodeMock() {
  const lines = [
    { w: "72%", i: "0%", on: false },
    { w: "48%", i: "14%", on: true },
    { w: "60%", i: "14%", on: false },
    { w: "34%", i: "0%", on: false },
  ];
  return (
    <Frame>
      <span className="flex h-full flex-col justify-center gap-[5cqw]">
        {lines.map((l) => (
          <span key={l.w + l.i} className="block" style={{ paddingLeft: l.i }}>
            <span
              className={`block rounded-full ${l.on ? "bg-blue" : "bg-silver-2"}`}
              style={{ width: l.w, height: "3.4cqw" }}
            />
          </span>
        ))}
      </span>
    </Frame>
  );
}

/** Cybersecurity — a shield that has come back clean. */
export function ShieldMock() {
  return (
    <Frame>
      <span className="flex h-full flex-col items-center justify-center gap-[5cqw]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          style={{ width: "34cqw", height: "34cqw" }}
          className="text-blue"
        >
          <path
            d="M12 3l7.5 2.8v5.6c0 4.2-3.2 7.2-7.5 8.4-4.3-1.2-7.5-4.2-7.5-8.4V5.8L12 3Z"
            fill="currentColor"
          />
          <path
            d="M8.6 12.1l2.4 2.4 4.4-4.6"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="block rounded-full bg-silver-2" style={{ width: "54%", height: "3cqw" }} />
      </span>
    </Frame>
  );
}

/** Cloud & DevOps — three stages of a pipeline, two of them through. */
export function PipelineMock() {
  return (
    <Frame>
      <span className="flex h-full flex-col justify-center gap-[7cqw]">
        <span className="relative flex items-center justify-between">
          <span
            className="absolute left-0 right-0 rounded-full bg-silver-2"
            style={{ height: "2.4cqw" }}
          />
          <span
            className="absolute left-0 rounded-full bg-blue"
            style={{ width: "56%", height: "2.4cqw" }}
          />
          {[true, true, false].map((done, i) => (
            <span
              key={i}
              className={`relative block rounded-full border-[1.6cqw] ${
                done ? "border-blue bg-blue" : "border-silver-2 bg-white"
              }`}
              style={{ width: "11cqw", height: "11cqw" }}
            />
          ))}
        </span>
        <span
          className="block overflow-hidden rounded-full bg-paper-2"
          style={{ height: "3.4cqw" }}
        >
          <span className="block h-full rounded-full bg-silver-2" style={{ width: "56%" }} />
        </span>
      </span>
    </Frame>
  );
}

/** AI & machine learning — points, and the line fitted through them. */
export function ModelMock() {
  return (
    <Frame>
      <span className="relative block h-full w-full">
        {[
          { l: "6%", t: "68%" },
          { l: "28%", t: "52%" },
          { l: "46%", t: "58%" },
          { l: "64%", t: "26%" },
          { l: "84%", t: "18%" },
        ].map((p) => (
          <span
            key={p.l}
            className="absolute rounded-full bg-silver-2"
            style={{ left: p.l, top: p.t, width: "6cqw", height: "6cqw" }}
          />
        ))}
        <span
          className="absolute left-0 top-1/2 w-full origin-center rounded-full bg-blue"
          style={{ height: "2.8cqw", transform: "rotate(-22deg)" }}
        />
      </span>
    </Frame>
  );
}

/** Support & success — someone asking, someone answering. */
export function ChatMock() {
  return (
    <Frame>
      <span className="flex h-full flex-col justify-center gap-[5cqw]">
        <span
          className="block rounded-[4cqw] rounded-tl-[1.2cqw] bg-paper-2"
          style={{ width: "72%", height: "13cqw" }}
        />
        <span className="flex justify-end">
          <span
            className="block rounded-[4cqw] rounded-tr-[1.2cqw] bg-blue"
            style={{ width: "56%", height: "10cqw" }}
          />
        </span>
      </span>
    </Frame>
  );
}

/** Product management — a board, and the card that is moving. */
export function BoardMock() {
  return (
    <Frame>
      <span className="flex h-full gap-[4.5cqw]">
        {[[true, false], [false], [false, false]].map((col, c) => (
          <span
            key={c}
            className="flex flex-1 flex-col gap-[4cqw] rounded-[2.5cqw] bg-paper p-[3cqw]"
          >
            {col.map((on, i) => (
              <span
                key={i}
                className={`block rounded-[2cqw] ${on ? "bg-blue" : "bg-silver-2"}`}
                style={{ height: "26%" }}
              />
            ))}
          </span>
        ))}
      </span>
    </Frame>
  );
}
