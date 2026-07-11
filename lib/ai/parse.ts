import "server-only";

/** Collect text from response content blocks without depending on SDK type paths. */
export function extractText(content: Array<{ type: string }>): string {
  let out = "";
  for (const block of content) {
    if (block.type === "text") {
      const t = (block as { text?: unknown }).text;
      if (typeof t === "string") out += t + "\n";
    }
  }
  return out.trim();
}

/** Tolerant JSON extraction: strips code fences and slices to the outermost object. */
export function parseJson(text: string): unknown {
  let t = text.trim();
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) t = fenced[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}
