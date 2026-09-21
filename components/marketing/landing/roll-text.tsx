/** A label whose letters roll on hover: each glyph slides up out of a mask
 *  while its twin slides in from below, one character 25ms after the last.
 *  This is the Zerion reference's nav-link hover, done in CSS rather than
 *  GSAP — see .lh-roll in landing.css for the mechanics.
 *
 *  The parent link owns the hover state (`.lh-roll-link`) and the readable
 *  text: every glyph here is doubled and aria-hidden, so the caller renders the
 *  label once more as `sr-only` for screen readers and find-in-page. */
export function RollText({ text }: { text: string }) {
  return (
    <span className="lh-roll" aria-hidden>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="lh-roll-char" style={{ "--i": i } as React.CSSProperties}>
          <span>{ch}</span>
          <span>{ch}</span>
        </span>
      ))}
    </span>
  );
}
