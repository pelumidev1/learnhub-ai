import { LogoMark } from "@/components/ui/logo";

/** Section eyebrow: the orbit mark + a mono label. The glyph is the brand's
 *  thread through the page — every section opens with LearnHub's own mark
 *  rather than an anonymous label. `reverse` for dark sections. */
export function Kicker({
  children,
  center = false,
  reverse = false,
}: {
  children: React.ReactNode;
  center?: boolean;
  reverse?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] ${
        reverse ? "text-sky-2" : "text-blue"
      } ${center ? "justify-center" : ""}`}
    >
      <LogoMark className="h-3.5 w-3.5 flex-none" />
      {children}
    </p>
  );
}
