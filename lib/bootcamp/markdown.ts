import "server-only";
import { marked } from "marked";

/**
 * Lesson markdown to HTML.
 *
 * Runs in a Server Component, so `marked` never reaches the browser. A
 * client-side markdown renderer would add tens of kilobytes to every lesson
 * view, on connections where that is the difference between reading and
 * giving up.
 *
 * No sanitiser, deliberately. The only writer is the sync script running on
 * the service role from files in this repo, and `lessons` grants no write to
 * anon or authenticated. If lesson bodies ever become user-editable, this
 * needs DOMPurify in front of it and that is not a small change to forget.
 */
export function renderLessonBody(markdown: string | null): string {
  if (!markdown) return "";
  return marked.parse(markdown, {
    // Newline in the source is a line break, which is how people write when
    // they are not thinking about markdown.
    breaks: true,
    gfm: true,
    async: false,
  }) as string;
}

/**
 * First sentence or so of a lesson, for a card.
 *
 * Strips the markdown rather than rendering it: a heading marker or a link
 * bracket in the middle of a one-line summary reads as a typo.
 */
export function lessonExcerpt(markdown: string | null, max = 140): string {
  if (!markdown) return "";
  const text = markdown
    // Drop the draft banners the week one files carry.
    .replace(/^>.*$/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  // Cut on a word, not mid-word.
  return text.slice(0, text.lastIndexOf(" ", max)) + "…";
}
